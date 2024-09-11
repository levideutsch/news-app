import React, { useContext } from 'react';
import { UserContext } from '../context/User';
import { Home } from '@mui/icons-material';
import { IconButton, Paper, Tooltip } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";


const FloatingNav = () => {
    const {isMobile} = useContext(UserContext)
    const navigate = useNavigate()
    const cardStyle = {
        // width: isMobile ? "100%" : "60%",
        // padding: "5px",
        // borderRadius: "8px",
        // boxShadow: 20,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: "0 auto",
        // height: isMobile ? "28vh" : "35vh",
        overflow: "auto",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      };

    const hoverStyle = {
        transform: 'scale(1.55)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };  


    return (
      <Paper
        elevation={3}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Adjust positioning
          backgroundColor: 'white', // Change this to your chosen color
          width: 'auto',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          padding: '0 10px', // Add padding for spacing
          zIndex: 1000, // Ensures it's on top of other elements
        }}
      >
          <Tooltip title="Home" arrow >
          <IconButton 
          sx={cardStyle} 
          onClick={null}
          onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
          <Home fontSize='large'/>
        </IconButton>
          </Tooltip>
  
          <Tooltip title="Create New Article" arrow>
          <IconButton 
            sx={cardStyle} 
            onClick={() => navigate("/writer")}
            onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}

           >
          <CreateIcon fontSize='large'/>
        </IconButton>
          </Tooltip>

      </Paper>
    );
  };
  
  export default FloatingNav;