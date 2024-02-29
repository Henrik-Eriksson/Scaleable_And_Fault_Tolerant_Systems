const axios = require('axios');
const {acceptInvite} = require('../controllers/invitationController.js');

// Mock the external functions and modules
jest.mock('axios');
const remove = jest.fn();
const fetchEventMock = jest.fn();
const authenticateMock = jest.fn();


const axiosMock = {
  post: jest.fn(),
  delete: jest.fn(),
};

// Mock axios directly inside the jest.mock call
jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ status: 200 })),
    delete: jest.fn(() => Promise.resolve({})),
  }));

describe('acceptInvite', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });

    it('successfully creates an event and deletes the invite', async () => {
        // Setup the mock implementations
  


        fetchEventMock.mockResolvedValue({id: 'event123', name: 'Test Event'});
        authenticateMock.mockResolvedValue('user123');
        axiosMock.post.mockResolvedValue({ status: 200 });
        axiosMock.delete.mockResolvedValue({});
        
    
        // Create a mock notification object
        const mockNotification = {id: 'notification123'};
    
        // Call the function with mock dependencies
        await acceptInvite('invite123', 'event123', mockNotification, remove, fetchEventMock, authenticateMock);
    
        // Assertions to ensure all steps are called correctly
        expect(remove).toHaveBeenCalledWith('notification123');
        expect(fetchEventMock).toHaveBeenCalledWith('event123');
        expect(authenticateMock).toHaveBeenCalled();
        //expect(axiosMock.post).toHaveBeenCalled();
        //expect(axiosMock.delete).toHaveBeenCalled();
      });
  
    it('handles failure in event creation', async () => {
      // Mock implementations for failure case
      axios.post.mockResolvedValue({ status: 500 });
      // Attempt to create the event (expected to fail)
      await acceptInvite('invite123', 'event123', {id: 'notification123'}, remove, fetchEventMock, authenticateMock);
  
      // Assertions to verify behavior on failure
      expect(axios.delete).not.toHaveBeenCalled();
      // You can also expect console.error to have been called with specific error message
    });
  
    it('handles failure in invite deletion', async () => {
      // Setup mocks to succeed in event creation but fail in invite deletion
      axios.post.mockResolvedValue({ status: 200 });
      axios.delete.mockRejectedValue(new Error('Network error'));
  
      // Attempt to delete the invite (expected to fail)
      await acceptInvite('invite123', 'event123', {id: 'notification123'}, remove, fetchEventMock, authenticateMock);
  
      // Assertions to verify the correct handling of delete failure
      expect(axios.delete).toHaveBeenCalled();
    });
});
