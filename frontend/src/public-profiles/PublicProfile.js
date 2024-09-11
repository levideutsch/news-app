import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/User";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../util/constants";

// COMPONENT IMPORTS
import SingleUserArticles from "./SingleUserArticles";
import SingleUserAbout from "./SingleUserAbout";
import SingleUserConnect from "./SingleUserConnect";

// MUI IMPORTS
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import VerifiedIcon from '@mui/icons-material/Verified';
import { Card, Tooltip  } from '@mui/material';


function PublicProfile() {
  const { username } = useParams();
  const [currentPublicProfile, setCurrentPublicProfile] = useState(null);
  const [value, setValue] = React.useState(0);
  const { isMobile } = useContext(UserContext)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  function displayCard() {
    if (value === 0) {
        return <SingleUserArticles currentPublicProfile={currentPublicProfile}/>
    } else if (value === 1) {
        return <SingleUserAbout currentPublicProfile={currentPublicProfile} isMobile={isMobile}/>
    } else {
        return <SingleUserConnect currentPublicProfile={currentPublicProfile}/>
    }
  }

  const cardStyle = {
    width: "95%",
    // padding: "5px",
    borderRadius: "8px",
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    height: isMobile ?  "40vh" : "45vh",
    // overflow: "auto",
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/users/${username}/`;
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            // 'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response);
        } else {
          const data = await response.json();
          setCurrentPublicProfile(data);
        }
      } catch (error) {
        console.log("Failed to fetch writer requests");
      }
    };

    fetchRequests();
  }, [username]);

  return (
    <div style={{ textAlign: "center" }}>
      <Card sx={cardStyle}>
        <h1>{currentPublicProfile?.username}'s Profile 
        {currentPublicProfile?.is_writer && <Tooltip title="User Is A Writer" arrow><VerifiedIcon /></Tooltip> }
        </h1>     
        <Avatar
          alt="Remy Sharp"
          src={
            currentPublicProfile?.profile_photo
              ? currentPublicProfile?.profile_photo
              : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
          }
          sx={{
            width: 200,
            height: 200,
            mx: "auto",
            mb: 2,
            boxShadow: 20,
            marginTop: "10px",
          }}
        />
        <Tabs
          value={value}
          onChange={handleChange}
          centered
     
            style={{
                // marginTop: "-10px", // Adjust margin for better visibility
                backgroundColor: "white",
                width: "100%",
                position: "relative", 
                zIndex: 1, 
                margin: "0 auto",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a shadow for better distinction
                borderRadius: "8px",
                marginTop: "20px"
                
        
          }}
        >
            {currentPublicProfile?.is_writer &&
            <Tab label="Articles" style={{color: "#394853"}}/>
            }
          <Tab label="About" style={{color: "#394853"}}/>
          <Tab label="Connect" style={{color: "#394853"}}/>
        </Tabs>

         
      </Card>
      {/* <Tabs
          value={value}
          onChange={handleChange}
          centered
          style={{
            marginTop: "-35px",
            backgroundColor: "white",
            width: "95%",
            // height: "20vh",
            position: "relative", // Make sure Tabs has a relative position
            zIndex: 1, // Set a higher z-index value
            margin: "0 auto",
            // boxShadow: 20,
            borderRadius: "8px",
          }}
        >
            {currentPublicProfile?.is_writer &&
            <Tab label="Articles" style={{color: "#394853"}}/>
            }
          <Tab label="About" style={{color: "#394853"}}/>
          <Tab label="Connect" style={{color: "#394853"}}/>
        </Tabs> */}
        {displayCard()}
    </div>
  );
}
export default PublicProfile;
