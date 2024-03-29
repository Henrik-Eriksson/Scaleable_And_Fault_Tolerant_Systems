
import {acceptInvite} from '../controllers/invitationController.js';
import {jest} from '@jest/globals';
import axios from 'axios';
const remove = jest.fn();
const fetchEventMock = jest.fn();
const authenticateMock = jest.fn();

describe('acceptInvite', () => {

    beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('successfully creates an event and deletes the invite', async () => {
        // Setup the mock implementations



        fetchEventMock.mockResolvedValue({id: 'event123', name: 'Test Event'});
        authenticateMock.mockResolvedValue('user123');

        axios.post = jest.fn().mockResolvedValue({ status: 200 });
        axios.delete = jest.fn().mockResolvedValue({});
        
    
        // Create a mock notification object
        const mockNotification = {id: 'notification123'};
    
        // Call the function with mock dependencies
        await acceptInvite('invite123', 'event123', mockNotification, remove, fetchEventMock, "123");
    
        // Assertions to ensure all steps are called correctly
        expect(remove).toHaveBeenCalledWith('notification123');
        expect(fetchEventMock).toHaveBeenCalledWith('event123');
        //expect(axiosMock.post).toHaveBeenCalled();
        //expect(axiosMock.delete).toHaveBeenCalled();
      });
  
    it('handles failure in event creation', async () => {

      // Mock implementations for failure case
      axios.post = jest.fn().mockResolvedValue({ status: 500 });
      // Attempt to create the event (expected to fail)
      await acceptInvite('invite123', 'event123', {id: 'notification123'}, remove, fetchEventMock, "123");
  
      // Assertions to verify behavior on failure
      expect(axios.delete).not.toHaveBeenCalled();
    });
  
    it('handles failure in invite deletion', async () => {

      // Setup mocks to succeed in event creation but fail in invite deletion
      axios.post = jest.fn().mockResolvedValue({ status: 200 });
      axios.delete = jest.fn().mockRejectedValue(new Error('Network error'));
  
      // Attempt to delete the invite (expected to fail)
      await acceptInvite('invite123', 'event123', {id: 'notification123'}, remove, fetchEventMock, "123");
  
      // Assertions to verify the correct handling of delete failure
      expect(axios.delete).toHaveBeenCalled();
    });
});
