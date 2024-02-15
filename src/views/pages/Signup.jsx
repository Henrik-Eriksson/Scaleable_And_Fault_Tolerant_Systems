import {Grid,Link} from '@mui/material'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import CustomInputField from '../components/CustomInputField.jsx';
import CustomCheckBox from '../components/CustomCheckBox.jsx';
import CustomForm from '../components/CustomForm.jsx';
import React, { useState, useEffect } from 'react';
import {validateSignupData, registerUser} from '../../controllers/userController.js'


function Signup() {
        const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateSignupData(formData);
        setErrors(validationErrors.errors);

        if (!(Object.values(validationErrors).some(error => error))) {
          const result = await registerUser(formData);
          
          if (result.success) {
              console.log(result.data);
              localStorage.setItem('session', result.data);
              location.replace('/');
          } else {
              setErrors(result.errors || {});
              if (result.message) {
                  alert(result.message); // TODO: Snackbar implementation here?
              }
          }
      }
    };

  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)),url(./src/assets/xd.png)`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
      height: "100vh", // This will make sure the div takes the full viewport height
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
    <Grid container spacing={0} sx={{p: 5, alignItems: 'center', justifyContent: 'center' }}>        
        <CustomForm title = "Create Your Account" titleColor = "White" buttonName="Sign Up" onSubmit={handleSubmit}>

        <CustomInputField error = {errors.firstNameError} helperText={errors.firstNameError ? "Invalid first name" : ""} label="First Name" value={formData.firstName}  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}/>
        <CustomInputField error = {errors.lastNameError} helperText={errors.lastNameError ? "Invalid last name" : ""} label="Last Name" value={formData.lastName}  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}/>
        <CustomInputField error = {errors.usernameError || errors.usernameExistsError} helperText={errors.usernameError ? "Invalid username" : (errors.usernameExistsError ? "Username already exists" : "")} label="Username" value={formData.username}  onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
        <CustomInputField error = {errors.emailError || errors.emailExistsError} helperText={errors.emailError ? "Invalid email" : (errors.emailExistsError ? "Email already exists" : "")}  label="Email-address" value={formData.email}  onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
        <CustomInputField type="password" error = {errors.passwordMatchError || errors.passwordLengthError} helperText={errors.passwordMatchError ? "Passwords do not match" : (errors.passwordLengthError ? "Password too short" : "")}  label="Password" value={formData.password}  onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
        <CustomInputField type="password" error = {errors.passwordMatchError || errors.passwordLengthError} helperText={errors.passwordMatchError ? "Passwords do not match" : (errors.passwordLengthError ? "Password too short" : "")}  label="Confirm Password" value={formData.confirmPassword}  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
        
          <Typography color="white" variant="paragraph" gutterBottom>
          {/*SPECIFIC FOR SIGN UP*/}
          <Link href="/login">
            {"Already have an account?"}
          </Link>
          {/*:::::::::::::::::::::::::::::*/}
          </Typography>
          
        </CustomForm>
    </Grid>
  </div>
  )
}
export default Signup;
