import {validateSignupData} from '../controllers/userController.js';
import {jest} from '@jest/globals';
import axios from 'axios';
const exampleFormData = { // [EXAMPLE EVERYTHING VALID]
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123',
    firstName: 'Gus',
    lastName: 'Fring',
    username: 'incel123',
    email: 'doggystylelover@example.com'
};
let data = undefined;
describe('validateSignupData', () => {
    beforeAll(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    beforeEach(async() => {
        data = JSON.parse(JSON.stringify(exampleFormData));
    });

    it('should return an error if password and confirm password do not match', () => {

        data.confirmPassword = "hej";

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.passwordMatchError).toBeTruthy();
    });

    it('should return an error if password length is incorrect', () => {

        data.password = "1";
        data.confirmPassword = "1";

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.passwordLengthError).toBeTruthy();
    });

    it('should return an error for invalid first name', () => {
        data.firstName = "6";

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.firstNameError).toBeTruthy();
    });

    it('should return an error for invalid last name', () => {
        data.lastName = "7";

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.lastNameError).toBeTruthy();
    });

    it('should return an error for invalid username', () => {
        data.username = "!nv@lid";        

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.usernameError).toBeTruthy();
    });

    it('should return an error for too long username', () => {
        data.username = "jsidfnkdmeoifwrgnsmdimgeasidmjfmasdfnogjmafdj";        

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.usernameError).toBeTruthy();
    });   

    it('should return an error for too short username', () => {
        data.username = "j";        

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.usernameError).toBeTruthy();
    });         

    it('should return an error for invalid email format', () => {
        data.email = "hejsan";  

        const result = validateSignupData(data);
        expect(result.success).toBeFalsy();
        expect(result.errors.emailError).toBeTruthy();
    });

    it('should pass validation for valid input data', () => {
        const result = validateSignupData(exampleFormData);
        expect(result.success).toBeUndefined();
        expect(result.errors).toBeUndefined(); 
    });
});
