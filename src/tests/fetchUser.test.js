import { fetchUsers} from '../controllers/userController.js'; // Adjust the import path as necessary
import {jest} from '@jest/globals';
import axios from 'axios';


describe('fetchUsers', () => {
    beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('fetches users successfully', async () => {
      const users = [{ id: 1, name: 'John Doe' }];
      axios.get = jest.fn().mockResolvedValue({ data: users });

  
      // Call the function
      const result = await fetchUsers();
  
      // Assert that the result is as expected
      expect(result).toEqual(users);
    });
  
    it('returns an empty array on error', async () => {
      // Mock axios.get to reject with an error
      axios.get = jest.fn().mockRejectedValue(new Error("Error fetching users"));
  
      // Call the function
      const result = await fetchUsers();
  
      // Assert that the result is as expected
      expect(result).toEqual([]);
    });
});