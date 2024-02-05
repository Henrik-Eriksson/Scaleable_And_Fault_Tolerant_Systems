import axios from 'axios';

export const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5050/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
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