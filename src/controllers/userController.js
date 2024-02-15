import axios from "axios";

// This function is used to fetch a specifc user's data from the server
export const fetchData = async () => {
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
export const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5050/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export const loginUser = async (username, password, rememberMe) => {
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