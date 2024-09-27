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

      const textFieldStyles = {
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white", // Default border color
          },
          "&:hover fieldset": {
            borderColor: "white", // Border color when hovered
          },
          "&.Mui-focused fieldset": {
            borderColor: "white", // Border color when focused
          },
          "& input": {
            color: "white", // Text color
          },
        },
        "& .MuiInputLabel-root": {
          color: "white", // Label color
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "white", // Label color when focused
      }
    }


    return (
        <Dialog open={loginOrRegisterIsOpen}>
        <Container maxWidth="xs" sx={{backgroundColor: "#394853"}}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 8 }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{color: "white"}}>
            Welcome Back!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              sx={textFieldStyles}
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
              sx={textFieldStyles}
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
              // color="primary"
              sx={{ mt: 3, mb: 2, backgroundColor: "white", color: "black" }}
            >
              Login
            </Button>
          </Box>

          <Typography sx={{color: "white"}}>Do not have an account?</Typography>
        
          <Button onClick={() => setHasAnAccount(false)}>
          <Typography sx={{color: "white"}}>Register here</Typography>
        </Button>
        <Button onClick={() => setLoginOrRegisterIsOpen(false)}>
        <ArrowBackIosIcon  sx={{color: "white"}}/>
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