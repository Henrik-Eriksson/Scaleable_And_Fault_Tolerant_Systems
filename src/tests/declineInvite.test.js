import { declineInvite } from '../controllers/invitationController.js';
import {jest} from '@jest/globals';
import axios from 'axios';
// Mock the `remove` function
const remove = jest.fn();

describe('declineInvite', () => {

    beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    beforeEach(() => {
        // Clear mock calls before each test
        //axios.mockClear(); // Throws an error however we have as default to clear all mockcalls in settings before a test so shouldnt be a problem
        remove.mockClear();   
          
    });


    it('successfully declines an invite', async () => {
        // Setup  
        const inviteId = '123';
        const notification = { id: 'notif-123' };
        axios.delete = jest.fn().mockResolvedValue({ status: 200 });

        // Act
        await declineInvite(inviteId, notification, remove);
        // Assert
        //expect(axios.delete).toHaveBeenCalledWith(`http://20.45.152.9:5050/api/invites/invite/${inviteId}`);
        expect(axios.delete).toHaveBeenCalled();
        expect(remove).toHaveBeenCalledWith(notification.id);
    });
    it('handles error when declining an invite fails', async () => {
        // Setup
        const inviteId = '123';
        const notification = { id: 'notif-123' };
        const errorMessage = 'Error declining invite';
        axios.delete = jest.fn().mockResolvedValue(new Error(errorMessage));
    
        // Act
        await declineInvite(inviteId, notification, remove);
    
        // Assert
        expect(axios.delete).toHaveBeenCalledWith(`http://20.45.152.9:5050/api/invites/invite/${inviteId}`);
    });
});