import axios from 'axios';

// This function is used to fetch a specifc user's data from the server
export const fetchData = async (setUserData) => {
    try {
      const userId = await authenticate();
      const response = await fetch(`http://internal-api-service:5050/api/users/${userId}`);
      const data = await response.json();
      setUserData(data); //React state from view
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
}

// This function is used to fetch the user's data from the server
export const fetchUsers = async () => {
    try {
        const response = await axios.get('http://internal-api-service:5050/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export const loginUser = async (username, password, rememberMe) => {
    try {
        const response = await axios.post('http://internal-api-service:5050/api/users/login', {
            username,
            password
        });
        
        console.log(response.status);
        console.log(response.data);
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




export const validateSignupData = (formData) => {
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
export const registerUser = async (formData) => {
    try {
        const response = await axios.post('http://internal-api-service:5050/api/users/signup', formData);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: "Signup failed" };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export async function authenticate()
{

   const longTermSessionId = localStorage.getItem('session');
  const shortTermSessionId = sessionStorage.getItem('session');

  let sessionIdToSave;

  if (longTermSessionId) {
      sessionIdToSave = longTermSessionId;
  } else if (shortTermSessionId) {
      sessionIdToSave = shortTermSessionId;
  } else
  {
    return;
  }

    try {
    const response = await axios.post('http://internal-api-service:5050/api/users/userId', {
      sessionId: sessionIdToSave
    });


    if (response.status === 200) {
      return response.data.userId;
    } else {
      console.error("Couldn't authenticate and fetch userId");
    }
  } catch (error) {
    console.error("An error occurred: " + error.message);
  }

  return null;

  }



export const userIsLoggedIn = () => {
  const longTermSessionId = localStorage.getItem('session');
  const shortTermSessionId = sessionStorage.getItem('session');
  return !!longTermSessionId || !!shortTermSessionId;
};