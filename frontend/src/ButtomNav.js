import React, { useState, useContext } from "react";
import { UserContext } from "./context/User";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from "@mui/material/IconButton";

function ButtomNav({handleMenuToggle, drawerOpen, setDrawerOpen}) {
    const { user } = useContext(UserContext)
    const navigate = useNavigate();


    const handleNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false); // Close drawer after navigating
      };

  return (
    <div>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleMenuToggle}
        PaperProps={{
          style: {
            height: "80%", // Adjust height as needed
            overflow: "auto",
            backgroundColor: "#394853",
            color: "white"
          },
        }}
      >
        <IconButton onClick={() => setDrawerOpen(false)}>
            <KeyboardArrowDownIcon style={{color: "white"}} fontSize="large" />
        </IconButton>
        <List>
          <ListItem button onClick={null}>
            <ListItemText primary="New" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/profile")}>
            <ListItemText primary="Profile" />
          </ListItem>
          {/* Add more menu items as needed */}
          {
            user?.is_superuser 
            ? 
            <ListItem button onClick={() => handleNavigation("/admin")}>
                <ListItemText primary="Admin"/>
            </ListItem>
            :
            null
          }
                    {
            user?.profile?.is_writer
            ? 
            <ListItem button onClick={() => handleNavigation("/writer")}>
                <ListItemText primary="Writer"/>
            </ListItem>
            :
            null
          }
        </List>
      </Drawer>
    </div>
  );
}
export default ButtomNav;
