import React, { useContext } from "react";
import { UserContext } from "../../context/User";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from '@mui/material/DialogContent';

function AllUsersList({ allUsers, selectedBox, setSelectedBox}) {
    const { isMobile, user }= useContext(UserContext)
    const navigate = useNavigate()


    const cardStyle = {
        width: isMobile ? "100%" : "60%",
        // padding: "5px",
        borderRadius: "8px",
        boxShadow: 20,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: "0 auto",
        height: isMobile ? "28vh" : "35vh",
        overflow: "auto",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      };

    
    const hoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };

    return (
        <Dialog
        open={selectedBox === "allUsers"}
        onClose={() => setSelectedBox("default")}
        fullWidth
        // maxWidth="sm" // Adjust width as needed
        borderRadius="20px"
        overflow="auto"
      >
        <DialogContent style={{backgroundColor: "#394853"}}>
        <div style={{textAlign: "center"}}>
            <Button onClick={() => setSelectedBox("default")} style={{color: "white"}}>
                <CloseIcon />
            </Button>
            <h1 style={{color: "white"}}>All Users</h1>
            {allUsers?.map((u) => ( 
                <div key={u?.id} style={{marginBottom: "20px"}}>
                <Card 
                onClick={() => navigate(u?.id === user?.id ? "/profile" : `/user/${u?.username}`)}
                sx={cardStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                <Avatar
                        alt="Remy Sharp"
                        src={
                            u?.profile_photo 
                            ? u?.profile_photo 
                            : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                            }
                        sx={{ width: 90, height: 90, mx: "auto", mb: 2, boxShadow: 20, marginTop: "10px" }}
                    />

                <Typography>Username: {" "}{u?.username}</Typography>
                <Typography>Status: {u?.is_writer ? "Writer" : "Non-Writer"} </Typography>
                {u?.is_writer &&
                <Typography>Number Of Articles: {u?.articles?.length}</Typography>
                }
                </Card>
                </div>
            ))}
        </div>
        </DialogContent>
        </Dialog>
    )
}
export default AllUsersList