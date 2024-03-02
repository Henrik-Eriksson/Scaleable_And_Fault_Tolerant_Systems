import {loginUser} from '../controllers/userController.js';
import {jest} from '@jest/globals';
import axios from 'axios';


const username = "GusFring";
const password = "HeisenburgSus123";
const data = {
userId: "123",
session: "3hdk3kt499s0dk3k4rtjreisdo4354d4543543"
};
describe('loginUser', () => {

    beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('login with correct username and password', async () => {
        // Setup the mock implementations
        axios.post = jest.fn().mockResolvedValue({ status: 200, data: data});
        localStorage = jest.fn();
        localStorage.setItem = jest.fn();
    
        // Call the function with mock dependencies
        const result = await loginUser(username, password, true);
    
        // Assertions to ensure all steps are called correctly
        expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/users\/login$/), 
        {username,password}
        );
        
        expect(result).toEqual({ success: true });
      });

    it('login with incorrect username or password', async () => {
        // Setup the mock implementations
        axios.post = jest.fn().mockResolvedValue({ status: 403 });
        localStorage = jest.fn();
        localStorage.setItem = jest.fn();
        sessionStorage = jest.fn();
        sessionStorage.setItem = jest.fn();
    
        const result = await loginUser(username, password, true);
    
        // Assertions to ensure all steps are called correctly
        expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/users\/login$/), 
        {username,password}
        );

        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
        
        expect(result).toMatchObject({ success: false });
      });    

    it('login with rememberMe checked', async () => {
        // Setup the mock implementations


        axios.post = jest.fn().mockResolvedValue({ status: 200, data: data });
        localStorage = jest.fn();
        localStorage.setItem = jest.fn();
        sessionStorage = jest.fn();
        sessionStorage.setItem = jest.fn();
    
        const result = await loginUser(username, password, true);
    
        // Assertions to ensure all steps are called correctly
        expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/users\/login$/), 
        {username,password}
        );

        expect(localStorage.setItem).toHaveBeenCalledWith('session', data);
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
        
        expect(result).toEqual({ success: true });
      });     

    it('login with rememberMe unchecked', async () => {
        // Setup the mock implementations


        axios.post = jest.fn().mockResolvedValue({ status: 200, data: data });
        localStorage = jest.fn();
        localStorage.setItem = jest.fn();
        sessionStorage = jest.fn();
        sessionStorage.setItem = jest.fn();
    
        const result = await loginUser(username, password, false);
    
        // Assertions to ensure all steps are called correctly
        expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/users\/login$/), 
        {username,password}
        );

        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(sessionStorage.setItem).toHaveBeenCalledWith('session',data);
        
        expect(result).toEqual({ success: true });
      });     
});
