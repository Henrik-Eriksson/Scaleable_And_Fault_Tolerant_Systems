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