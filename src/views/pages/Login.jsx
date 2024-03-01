import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import { Grid, Link, SvgIcon } from '@mui/material';
import CustomInputField from '../components/CustomInputField.jsx';
import CustomCheckBox from '../components/CustomCheckBox.jsx';
import CustomInfoBox from '../components/CustomInfoBox.jsx';
import CustomForm from '../components/CustomForm.jsx';
import { useState } from 'react';
import {loginUser} from '../../controllers/userController.js';




function Login() {
const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // State variables for error handling
    const [usernameError, setUsernameError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setUsernameError(false);
        setPasswordMatchError(false);

        // Call loginUser from userController
        const { success, error } = await userController.loginUser(formData.username, formData.password, rememberMe);

        if (success) {
            location.replace('/');
        } else {
            if (error === "password") {
                setPasswordMatchError(true);
            } else if (error === "username") {
                setUsernameError(true);
            }
            // Handle other errors or general server error
        }
    };


  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)),url(../../../Hejsan.png)`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "100vh", // This will make sure the div takes the full viewport height
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

    <Grid container spacing={0} sx={{p: 5, alignItems: 'center', justifyContent: 'center' }}>        
      <CustomInfoBox title="Welcome to TimeTuna" text={
        <Typography variant="h5" >
          <br></br>
          {"TimeTuna a application that allows you to create events and manage your schedule."}
          <br></br>
          <br></br>
          {"Timetuna is a application that allows you to access your schedule from any device, anywhere."}
          <br></br>
          <br></br>
          {"Timetuna is a collaborative application that allows you to invite others to your events effortlessly."}
          <br></br>
          <br></br>
          {"Timetuna is free to use and is available on all platforms."}
        </Typography>
      }
      />
        <CustomForm title = "Login To Your Account" titleColor = "White" buttonName="Login" onSubmit={handleSubmit}
        
        >
        <CustomInputField 
        error = {usernameError} helperText={usernameError ? "Wrong username" : ""}
         label="Username"
         value={formData.username}
         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
         />
        <CustomInputField
          error = {passwordMatchError} helperText={passwordMatchError ? "Wrong Password": ""} 

         label="Password"
         type="password"
         value={formData.password}
         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
         />
        <CustomCheckBox checked={rememberMe} label="Remember me" onChange={(e) => setRememberMe(e.target.checked)}/>
        
          <Typography color="white" variant="paragraph" gutterBottom>
          {/*SPECIFIC FOR LOGIN*/}
          <br></br>
          </Typography>
          <Link href="/signup" variant ="h6">
            {"Don't have an account?"}
          </Link>
          {/*:::::::::::::::::::::::::::::*/}
        </CustomForm>
    </Grid>
    </div>
  )
 } 
export default Login;
