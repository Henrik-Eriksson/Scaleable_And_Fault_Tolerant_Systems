import axios from 'axios';

export const acceptInvite = async (inviteId, eventId, notification) => {

    remove(notification.id);

    let eventData = await fetchEvent(eventId)
    let userId = await authenticate();
    const createEventResponse = await axios.post(`http://localhost:5050/api/users/createEvent`, {event: eventData, userId: userId, shared: []});
  if (createEventResponse.status !== 200) {
    console.error("Error creating the new event");
    return;
  }

  try {
    await axios.delete(`http://localhost:5050/api/invites/invite/${inviteId}`);
    // Refresh the notifications or remove the specific notification from the list
  } catch (error) {
    console.error("Error removing the invite", error);
  }
}

export const declineInvite = async (inviteId,notification) => {
    console.log(inviteId);
    remove(notification.id);
    try {
      await axios.delete(`http://localhost:5050/api/invites/invite/${inviteId}`);
      // Refresh the notifications or remove the specific notification from the list
    } catch (error) {
      console.error("Error declining invite:", error);
    }
}

export const fetchInvites = async () => {
  try {
    const userId = await authenticate();
    const response = await axios.get(`http://localhost:5050/api/invites/receivedInvites/${userId}`);
    const fetchedInvites = response.data;
    const inviterUsernames = {};

    // Fetch usernames for each inviter
    for (let invite of fetchedInvites) {
      if (invite.inviter) {
        const usernameResponse = await fetchInviterUsername(invite.inviter);
        inviterUsernames[invite.inviter] = usernameResponse;
      }
    }

    // Now you have a map of inviter IDs to usernames in inviterUsernames
    // You can use this map to display the usernames in your component

    setInvites(fetchedInvites);
  } catch (error) {
    console.error("Error fetching invites:", error);
  }
}

export const fetchInviterUsername = async (inviterId) => {
  try {
    const response = await axios.get(`http://localhost:5050/api/users/usernameFromId/${inviterId}`);
    setInviterUsername(response.data.username);
  } catch (error) {
    console.error("Error fetching inviter's username:", error);
  }
}

export const sendInvitations = async (eventId) => {
  try {
    for (let username of selectedUsers) {
      const user = users.find(u => u.username === username);
      if (user) {
        const inviteData = {
          eventId: eventId,
          inviter: await authenticate(), 
          invited: user._id
        };
        await axios.post('http://localhost:5050/api/invites/createInvite', inviteData);
      }
    }
  } catch (error) {
    console.error("Error sending invitations:", error);
  }
}

export const fetchInvitersUsername = async (inviter) => {
  try {
  await axios.get(`http://localhost:5050/api/users/usernameFromId/${inviter}`);
  }
  catch (error) {
    console.error("Error fetching inviter's username:", error);
  }
};