import axios from 'axios';

export const acceptInvite = async (inviteId, eventId, notification, remove, fetchEvent, userId) => { //TODO PERHAPS: add the remove/fetchEvent/authenticate function above and call it here

    remove(notification.id); 

    let eventData = await fetchEvent(eventId)
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

export const declineInvite = async (inviteId,notification,remove) => {
    console.log(inviteId);
    remove(notification.id);
    try {
      await axios.delete(`http://localhost:5050/api/invites/invite/${inviteId}`);
      // Refresh the notifications or remove the specific notification from the list
    } catch (error) {
      console.error("Error declining invite:", error);
    }
}

export const fetchInvites = async (userId, setInvites) => {
  try {
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

    setInvites(fetchedInvites); //React State from view
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

export const sendInvitations = async (eventId, selectedUsers, users, userId) => {
  try {
    for (let username of selectedUsers) {
      const user = users.find(u => u.username === username);
      if (user) {
        const inviteData = {
          eventId: eventId,
          inviter: userId, 
          invited: user._id
        };
        await axios.post('http://localhost:5050/api/invites/createInvite', inviteData);
      }
      else 
      {
        throw new Error(`User ${username} does not exist`);
      }
    }

  } catch (error) {
    console.error("Error sending invitations:", error);
    
  }
};
