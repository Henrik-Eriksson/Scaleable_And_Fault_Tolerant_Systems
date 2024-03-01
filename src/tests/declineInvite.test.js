const axios = require('axios');
const {declineInvite} = require("../controllers/invitationController.js")
jest.mock('axios');

// Mock the `remove` function
const remove = jest.fn();


describe('declineInvite', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        axios.delete.mockClear();
        remove.mockClear();
    });

    it('successfully declines an invite', async () => {
        // Setup
        const inviteId = '123';
        const notification = { id: 'notif-123' };
        axios.delete.mockResolvedValue({ status: 200 });

        // Act
        await declineInvite(inviteId, notification, remove);
        // Assert
        expect(axios.delete).toHaveBeenCalledWith(`http://localhost:5050/api/invites/invite/${inviteId}`);
        expect(remove).toHaveBeenCalledWith(notification.id);
    });
    it('handles error when declining an invite fails', async () => {
        // Setup
        const inviteId = '123';
        const notification = { id: 'notif-123' };
        const errorMessage = 'Error declining invite';
        axios.delete.mockRejectedValue(new Error(errorMessage));
    
        // Act
        await declineInvite(inviteId, notification, remove);
    
        // Assert
        expect(axios.delete).toHaveBeenCalledWith(`http://localhost:5050/api/invites/invite/${inviteId}`);
    });
});