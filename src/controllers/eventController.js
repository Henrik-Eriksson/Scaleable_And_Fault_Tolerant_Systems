const axios = require('axios');

const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5050/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

const sendInvitations = async (eventId, selectedUsers, users, authenticate) => {
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
        else 
        {
          throw new Error(`User ${username} does not exist`);
        }
      }
  
    } catch (error) {
      console.error("Error sending invitations:", error);
      
    }
};

module.exports = {
    fetchUsers,
    sendInvitations
};
