const {sendInvitations} = require('../controllers/eventController.js'); // Adjust the import path as necessary
const axios = require('axios');

const eventId = '123';
const selectedUsers = ['Ohio', 'Heisenberg'];
const selectedUsers2 = ['Mrroboto'];
const users = [
  { username: 'Ohio', _id: '1' },
  { username: 'Heisenberg', _id: '2' }
];
const authenticate = jest.fn().mockResolvedValue('inviterId');
jest.mock('axios');

describe('sendInvitations', () => {
    it('sends invitations to selected users', async () => {
      // Setup axios.post to resolve to a mock value
      axios.post.mockResolvedValue({ status: 200 });
  
      await sendInvitations(eventId, selectedUsers, users, authenticate);
  
      // Assertions
      expect(authenticate).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledTimes(selectedUsers.length);
  
      selectedUsers.forEach(username => {
        const user = users.find(u => u.username === username);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5050/api/invites/createInvite', {
          eventId,
          inviter: 'inviterId',
          invited: user._id
        });
      });
    });
    it("Should not send an invitation to a user that doesn't exist", async () => {
        axios.post.mockResolvedValue({ status: 200 });
        // Execute the function with a non-existent user
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await sendInvitations(eventId, selectedUsers2, users, authenticate);
        // Assertion
        expect(authenticate).not.toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith("Error sending invitations:", expect.any(Error));
    });
});