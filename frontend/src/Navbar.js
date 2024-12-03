import React, { useContext, useState } from "react";
import { UserContext } from "./context/User";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ButtomNav from "./ButtomNav";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


function Navbar() {
  const { isAuthorized, setIsAuthorized, setLoginOrRegisterIsOpen, isMobile, currentRoute } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function Logout() {
    localStorage.clear();
    setIsAuthorized(false);
    return navigate("/");
  }

  const handleMenuToggle = () => {
    setDrawerOpen(!drawerOpen);
  };



  return (
    <div>
      <AppBar
        position="fixed"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
          {isAuthorized &&
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: "white"}}
            onClick={handleMenuToggle}
          >
            {
                !drawerOpen 
                ? <KeyboardArrowUpIcon fontSize="large" style={{color: "black", boxShadow: 20 }} />
                : <KeyboardArrowDownIcon fontSize="lage" style={{color: "black", boxShadow: 20 }}/>
            }
          </IconButton>
            }

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/")}
          >
            The Offendinator
          </Typography>


            {
              !isMobile &&
              <div style={{ 
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                width: "auto",  // Adjusts the width to content size
                left: "50%",  // Centers horizontally in the parent
                transform: "translateX(-50%)",  // Fine-tunes the centering
               }}>
              <h1 style={{ textAlign: "center" }}>
                {currentRoute}
              </h1>
            </div>
            }
       

          {isAuthorized && (
            <Button
              style={{ color: "white" }}
              onClick={() => navigate("/profile")}
            >
              <AccountCircleIcon  style={{color: "black"}}/>
            </Button>
          )}
       
          {!isAuthorized ? (
            <Button
              color="inherit"
              onClick={() => setLoginOrRegisterIsOpen(true)}
            >
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={() => Logout()}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isAuthorized &&
          <ButtomNav 
          handleMenuToggle={handleMenuToggle}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          />
          }
    </div>
  );
}

export default Navbar;
