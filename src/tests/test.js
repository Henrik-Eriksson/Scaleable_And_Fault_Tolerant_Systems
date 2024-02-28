const { fetchUsers } = require('../controllers/eventController.js'); // Adjust the import path as necessary
const axios = require('axios');

jest.mock('axios');

describe('fetchUsers', () => {
    it('fetches users successfully', async () => {
      // Mock axios.get to resolve with mock data
      const users = [{ id: 1, name: 'John Doe' }];
      axios.get.mockResolvedValue({ data: users });
  
      // Call the function
      const result = await fetchUsers();
  
      // Assert that the result is as expected
      expect(result).toEqual(users);
    });
  
    it('returns an empty array on error', async () => {
      // Mock axios.get to reject with an error
      axios.get.mockRejectedValue(new Error('Error fetching users'));
  
      // Call the function
      const result = await fetchUsers();
  
      // Assert that the result is as expected
      expect(result).toEqual([]);
    });
  });