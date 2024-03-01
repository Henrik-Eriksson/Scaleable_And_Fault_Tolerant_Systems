import {sendInvitations} from '../controllers/invitationController.js'; // Adjust the import path as necessary
import axios from 'axios';
import {jest} from '@jest/globals';

const eventId = '123';
const selectedUsers = ['Ohio', 'Heisenberg'];
const selectedUsers2 = ['Mrroboto'];
const users = [
  { username: 'Ohio', _id: '1' },
  { username: 'Heisenberg', _id: '2' }
];
const authenticate = jest.fn().mockResolvedValue('inviterId');

describe('sendInvitations', () => {
      beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    it('sends invitations to selected users', async () => {
      // Setup axios.post to resolve to a mock value
      axios.post = jest.fn().mockResolvedValue({ status: 200 });
  
      await sendInvitations(eventId, selectedUsers, users, "3");
  
      // Assertions
      expect(axios.post).toHaveBeenCalledTimes(selectedUsers.length);
  
      selectedUsers.forEach(username => {
        const user = users.find(u => u.username === username);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5050/api/invites/createInvite', {
          eventId,
          inviter: '3',
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