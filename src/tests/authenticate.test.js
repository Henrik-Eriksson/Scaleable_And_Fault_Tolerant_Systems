import {authenticate} from '../controllers/userController.js';
import {jest} from '@jest/globals';
import axios from 'axios';

// Mocking localStorage and sessionStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    }
  };
})();

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    }
  };
})();

describe('authenticate', () => {
  beforeAll(() => {
    // Mocking the global storage objects
    global.localStorage = mockLocalStorage;
    global.sessionStorage = mockSessionStorage;

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({ status: 200, data: { userId: '123' } }));
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('authenticates using long-term session ID', async () => {
    localStorage.setItem('session', 'long-term-session-id');

    const userId = await authenticate();

    expect(axios.post).toHaveBeenCalledWith('http://20.45.152.9:5050/api/users/userId', {
      sessionId: 'long-term-session-id'
    });
    expect(userId).toBe('123');
  });

  it('authenticates using short-term session ID when long-term is not available', async () => {
    sessionStorage.setItem('session', 'short-term-session-id');

    const userId = await authenticate();

    expect(axios.post).toHaveBeenCalledWith('http://20.45.152.9:5050/api/users/userId', {
      sessionId: 'short-term-session-id'
    });
    expect(userId).toBe('123');
  });

  it('does not authenticate when no session ID is available', async () => {
    const userId = await authenticate(); 
    expect(axios.post).not.toHaveBeenCalled();
    expect(userId).toBeUndefined(); //Make sure the userId stays undefined, Other frontend code will make sure the user is jumped back to login if necessary
  });

  it('handles error response from server (wrong sessionId)', async () => {
    sessionStorage.setItem('session', 'short-term-session-id');
    axios.post.mockRejectedValueOnce(new Error('An error occurred'));

    const userId = await authenticate();

    expect(console.error).toHaveBeenCalledWith("An error occurred: An error occurred");
    expect(userId).toBeNull();
  });
});
