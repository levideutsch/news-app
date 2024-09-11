import React, { useState } from 'react';


// MUI IMPORTS
import { TextField, Button, Typography, Container, Box } from "../mui-stuff/MuiElements"

import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function Register({ loginClicked, setLoginClicked, setHasAnAccount, loginOrRegisterIsOpen, setLoginOrRegisterIsOpen }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        // register(username, password);        
    };


    return (
      <Dialog open={loginOrRegisterIsOpen}>
        <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 8 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Let's Go!
            </Button>
          </Box>
          <Typography>Already have an account?</Typography>
        
        <Button onClick={() => setHasAnAccount(true)}>
        <Typography>Login Here</Typography>
      </Button>
      <Button onClick={() => setLoginOrRegisterIsOpen(false)}>
        <ArrowBackIosIcon />
        </Button>
{/*   
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error ? error : null}
          </Typography> */}
        </Box>
      </Container>
      </Dialog>
    )
}
export default Register