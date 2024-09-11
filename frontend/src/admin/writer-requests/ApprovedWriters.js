import React, { useContext } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import DialogContent from '@mui/material/DialogContent';
import { UserContext } from "../../context/User";

function ApprovedWriters({approvedWriters, setSelectedBox, selectedBox}) {
    const { isMobile} = useContext(UserContext)


    const cardStyle = {
        width: isMobile ? "100%" : "60%",
        // padding: "5px",
        borderRadius: "8px",
        boxShadow: 20,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: "0 auto",
        height: "18vh",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      };

    const hoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };  

    return (
        <Dialog         
        open={selectedBox === "approvedWriters"}
        onClose={() => setSelectedBox("default")}
        fullWidth>
            <DialogContent style={{backgroundColor: "#394853"}}>
            <div style={{textAlign: "center", backgroundColor: "#394853"}}>
            <Button onClick={() => setSelectedBox("default")} style={{color: "white"}}>
                <CloseIcon />
            </Button>
            <h1 style={{color: "white"}}>Writers</h1>
                {approvedWriters?.map((writer) => (
                    <div key={writer?.id} style={{marginBottom: "20px"}}>
                    <Card  
                    sx={cardStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                    <Typography>{writer?.username}</Typography>
                    <Avatar
                        alt="Remy Sharp"
                        src={
                            writer?.profile_photo 
                            ? writer?.profile_photo 
                            : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                            }
                        sx={{ width: 90, height: 90, mx: "auto", mb: 2, boxShadow: 20, marginTop: "10px" }}
                    />
                    </Card>
                    {/* <hr style={{width: "35%"}}/> */}
                    </div>
                ))}
            </div>
            </DialogContent>
        </Dialog>
    )
}
export default ApprovedWriters