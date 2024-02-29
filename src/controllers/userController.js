const axios = require('axios');

// This function is used to fetch a specifc user's data from the server
const fetchData = async () => {
    try {
      const userId = await authenticate();
      const response = await fetch(`http://localhost:5050/api/users/${userId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
}

// This function is used to fetch the user's data from the server
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5050/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

const loginUser = async (username, password, rememberMe) => {
    try {
        const response = await axios.post('http://localhost:5050/api/users/login', {
            username,
            password
        });
        
        if (response.status === 200) {
            console.log(response.data);
            if (rememberMe) {
                localStorage.setItem('session', response.data); // longterm
            } else {
                sessionStorage.setItem('session', response.data); // shortterm
            }
            return { success: true };
        } else {
            console.log(response);
            return { success: false, error: response };
        }
    } catch (error) {
        console.error("Login error:", error);
        let errorType = "";
        if (error.response && error.response.data) {
            errorType = error.response.data.error;
        }
        return { success: false, error: errorType };
    }
}




const validateSignupData = (formData) => {
    // Perform validation checks
    let hasPasswordMatchError = formData.password !== formData.confirmPassword;
    let hasPasswordLengthError = formData.password.length < 8 || formData.password.length > 50;
    let hasLastNameError = !(/^[A-Za-zåäöÅÄÖ]+$/.test(formData.lastName)) || formData.lastName.length < 2 || formData.lastName.length > 35;
    let hasFirstNameError = !(/^[A-Za-zåäöÅÄÖ]+$/.test(formData.firstName)) || formData.firstName.length < 2 || formData.firstName.length > 35;
    let hasUsernameError = !(/^[A-Za-z0-9åäöÅÄÖ]+$/.test(formData.username)) || formData.username.length < 2 || formData.username.length > 35;
    let hasEmailError = !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email));

    if (hasPasswordMatchError || hasPasswordLengthError || hasFirstNameError || hasLastNameError || hasUsernameError || hasEmailError) {
        return {
            success: false,
            errors: {
                passwordMatchError: hasPasswordMatchError,
                passwordLengthError: hasPasswordLengthError,
                firstNameError: hasFirstNameError,
                lastNameError: hasLastNameError,
                usernameError: hasUsernameError,
                emailError: hasEmailError
            }
        };
    }
    
    return {
        hasPasswordMatchError,
        hasPasswordLengthError,
        hasLastNameError,
        hasFirstNameError,
        hasUsernameError,
        hasEmailError
    };
};

// Function to register user
const registerUser = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5050/api/users/signup', formData);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: "Signup failed" };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    fetchUsers,
    fetchData,
    loginUser,
    validateSignupData,
    registerUser
}