// import { useState, useEffect } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';  // Added useContext import
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { FirebaseContext } from 'contexts/FirebaseContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { register, googleSignIn } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const customization = useSelector((state) => state.customization);
  
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const googleHandler = async () => {
    try {
      await googleSignIn();
      navigate('/dashboard'); // Navigate to dashboard after successful sign in
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        {/* Google Sign up button and divider remain the same... */}
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          fname: '',
          lname: '',
          phone: '',
          gender: '',
          birthday: '',
          occupation: '',
          jobsSeeking: '',
          skills: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(255)
            .required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
          fname: Yup.string().max(255).required('First name is required'),
          lname: Yup.string().max(255).required('Last name is required'),
          phone: Yup.string().max(15).required('Phone number is required'),
          gender: Yup.string().required('Gender is required'),
          birthday: Yup.date().required('Birthday is required'),
          occupation: Yup.string().max(255).required('Occupation is required'),
          jobsSeeking: Yup.string().max(255).required('Jobs you are seeking are required'),
          skills: Yup.string().max(255).required('Skills you have acquired are required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (!checked) {
              setErrors({ submit: 'Please agree to terms and conditions' });
              return;
            }
            
            await register(values.email, values.password, {
              firstName: values.fname,
              lastName: values.lname,
              phone: values.phone,
              gender: values.gender,
              birthday: values.birthday,
              occupation: values.occupation,
              jobsSeeking: values.jobsSeeking,
              skills: values.skills
            });
            
            setStatus({ success: true });
            navigate('/dashboard');
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="fname"
                  type="text"
                  value={values.fname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.fname && errors.fname)}
                  helperText={touched.fname && errors.fname}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="lname"
                  type="text"
                  value={values.lname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.lname && errors.lname)}
                  helperText={touched.lname && errors.lname}
                  sx={{ ...theme.typography.customInput }}
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {/* Form for confirming password */}
            <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirm Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                name="confirmPassword"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-confirm-password-register">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>

            {/* Password strength indicator remains the same... */}

            {/* Other fields */}
            <TextField
              fullWidth
              label="Phone"
              margin="normal"
              name="phone"
              type="text"
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              sx={{ ...theme.typography.customInput }}
            />

            <FormControl fullWidth error={Boolean(touched.gender && errors.gender)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-gender-register">Gender</InputLabel>
              <Select
                id="outlined-adornment-gender-register"
                value={values.gender}
                name="gender"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {touched.gender && errors.gender && (
                <FormHelperText error id="standard-weight-helper-text-gender-register">
                  {errors.gender}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Birthday"
              margin="normal"
              name="birthday"
              type="date"
              value={values.birthday}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.birthday && errors.birthday)}
              helperText={touched.birthday && errors.birthday}
              sx={{ ...theme.typography.customInput }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Occupation"
              margin="normal"
              name="occupation"
              type="text"
              value={values.occupation}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.occupation && errors.occupation)}
              helperText={touched.occupation && errors.occupation}
              sx={{ ...theme.typography.customInput }}
            />

            <TextField
              fullWidth
              label="Jobs You're Seeking"
              margin="normal"
              name="jobsSeeking"
              type="text"
              value={values.jobsSeeking}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.jobsSeeking && errors.jobsSeeking)}
              helperText={touched.jobsSeeking && errors.jobsSeeking}
              sx={{ ...theme.typography.customInput }}
            />

            <TextField
              fullWidth
              label="Skills You've Acquired"
              margin="normal"
              name="skills"
              type="text"
              value={values.skills}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.skills && errors.skills)}
              helperText={touched.skills && errors.skills}
              sx={{ ...theme.typography.customInput }}
            />


            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={checked} 
                      onChange={(event) => setChecked(event.target.checked)} 
                      name="checked" 
                      color="primary" 
                    />
                  }
                  label={
                    <Typography variant="subtitle1">
                      Agree with &nbsp;
                      <Typography variant="subtitle1" component={Link} to="#">
                        Terms & Condition.
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
