import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/User";

// MUI IMPORTS
import Card from "@mui/material/Card";
import { TextField, Button, Typography } from "@mui/material";

// ICONS
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';

// COMPONENT IMPORTS
import EditProfile from "./EditProfile";
import BecomeWriterRequest from "./BecomeWriterRequest";
import ConfirmPasswordChangeRequest from "./ConfirmPasswordChangeRequest";

function Profile() {
  const [isEditing, setIsEditing] = useState(false)  
  const { user, setUser, isMobile } = useContext(UserContext);
  const [becomeWriterClicked, setBecomeWriterClicked] = useState(false)
  const [changePasswordClicked, setChangePasswordClicked] = useState(false)

// console.log(user)
  

  const cardStyle = {
    width: isMobile ? "90%" : "25%",
    margin: "0 auto",
    mt: 2,
    p: 2,
    borderRadius: 4,
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center"
  };


  if (!isEditing) {
    return (
        <div style={{ textAlign: "center" }}>
            {becomeWriterClicked &&  
            <BecomeWriterRequest 
            becomeWriterClicked={becomeWriterClicked}
            setBecomeWriterClicked={setBecomeWriterClicked}
            writerRequest={user?.writer_request}
            />}
            <ConfirmPasswordChangeRequest 
              changePasswordClicked={changePasswordClicked}
              setChangePasswordClicked={setChangePasswordClicked}
            />
          <h1 style={{ textAlign: "center", color: "white", boxShadow: 20 }}>Profile</h1>
          <Avatar
            alt="Remy Sharp"
            src={
                user?.profile?.profile_photo 
                ? user?.profile?.profile_photo 
                :"https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                }
            sx={{ width: 80, height: 80, mx: "auto", mb: 2, boxShadow: 20 }}
          />
          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Email</span>  
              <br />
                <span style={{fontSize: "18px"}}>{user?.email ? user?.email : "Create Email"}</span> 
            </Typography>
          </Card>
    
          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Username</span>
              <br />
              <span style={{fontSize: "18px"}}>{user?.username ? user?.username : "Create Username"}</span>
            </Typography>
          </Card>

          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Location</span>
              <br />
              <span style={{fontSize: "18px"}}>{user?.profile?.location ? user?.profile?.location : "Add Location"}</span> 
            </Typography>
          </Card>

          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Sex</span>
              <br />
              <span style={{fontSize: "18px"}}>{user?.profile?.sex ? user?.profile?.sex : "Select Sex"}</span> 
            </Typography>
          </Card>

          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Age</span>
              <br />
             <span style={{fontSize: "18px"}}>{user?.profile?.age ? user?.profile?.age : "Select Age"}</span> 
            </Typography>
          </Card>

          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Links</span>
              <br />
              <span >Add Links</span>
            </Typography>
          </Card>
    
          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Admin Status</span>
              <br />
              <span style={{fontSize: "18px"}}>{user?.is_superuser ? "Admin" : "Non Admin"}</span>
            </Typography>
          </Card>
          <Card sx={cardStyle}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Writer Status</span>
              <br />
              {user?.profile?.is_writer ? (
            
                <Button style={{color: "#394853"}} onClick={() => setBecomeWriterClicked(true)}>
                Writer
            </Button>
              ) : (
                <Button style={{color: "#394853"}} onClick={() => setBecomeWriterClicked(true)}>
                    {user?.writer_request.length >= 1  ? "View Request status" : "Become A Writer"}
                </Button>
              )
            }
            </Typography>
          </Card>
          <Card sx={{...cardStyle, cursor: "pointer" }} onClick={() => setChangePasswordClicked(true)}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              style={{ marginBottom: "3px" }}
            >
              <span style={{ fontWeight: "bold" }}>Change Password</span>
            </Typography>
          </Card>
    
          <IconButton style={{marginTop: "20px", boxShadow: 20, marginBottom: "80px"}} onClick={() => setIsEditing(true)}>
            <EditIcon style={{color: "white"}} fontSize="large"/>
          </IconButton>
        </div>
      );
  } else {
    return <EditProfile 
            user={user} 
            setUser={setUser}
            cardStyle={cardStyle} 
            setIsEditing={setIsEditing}
            isMobile={isMobile}
            />
  }


}
export default Profile;
