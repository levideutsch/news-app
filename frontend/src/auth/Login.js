import React, { useState, useContext } from "react";
import { UserContext } from "../context/User";
import { TextField, Button, Typography, Container, Box } from "../mui-stuff/MuiElements"



import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function Login({ setHasAnAccount, loginOrRegisterIsOpen, setLoginOrRegisterIsOpen,}) {
    const { login, error} = useContext(UserContext)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);     
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
            Welcome Back!
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {
              error && <Typography style={{color: "red"}}>{error}</Typography>
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>

          <Typography>Do not have an account?</Typography>
        
          <Button onClick={() => setHasAnAccount(false)}>
          <Typography>Register here</Typography>
        </Button>
        <Button onClick={() => setLoginOrRegisterIsOpen(false)}>
        <ArrowBackIosIcon />
        </Button>
        
  
          {/* <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error ? error : null}
          </Typography> */}
        </Box>
      </Container>
      </Dialog>
    )
}
export default Login