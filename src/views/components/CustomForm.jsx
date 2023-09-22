import React from 'react';
import { Button, Paper, Grid, FormGroup, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CustomInputField from './CustomInputField.jsx';
import CustomCheckBox from './CustomCheckBox.jsx';

function CustomForm(props) {
  const inputFields = [];
  const extraComponents = [];

  React.Children.forEach(props.children, child => {
    if (child.type === CustomInputField || child.type === CustomCheckBox) {
      inputFields.push(child);
    } else {
      extraComponents.push(child);
    }
  });
          
  return (
    <Grid item xs={12} sm={10} md={6} sx={{p: {xl: 10, lg: 10, md: 0, xs: 0, sm: 0}, m: 0 }}>
      <Paper sx={{p:5, backgroundColor: 'rgba(255, 255, 255, 0.0)', boxShadow: 'none'}}>
        <Typography sx={{color: "White"}} variant="h4" gutterBottom>
          {props.buttonName}
        </Typography>
        <FormGroup>
          {inputFields}
          <Button href={props.href} variant="contained">{props.buttonName}</Button>
        </FormGroup>
        {extraComponents}
      </Paper>
    </Grid>
  );
}

CustomForm.propTypes = {
  children: PropTypes.node.isRequired,
  buttonName: PropTypes.string.isRequired,
  href: PropTypes.string
};

export default CustomForm;