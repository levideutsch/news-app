import React, { useState, useContext } from "react";
import { UserContext } from "../../context/User";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import { ACCESS_TOKEN } from "../../util/constants";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from '@mui/material/DialogContent';


function WriterRequests({ setSelectedBox, writerRequests, setWriterRequest, selectedBox }) {
    const {isMobile }= useContext(UserContext)

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



      function requestStatus(request) {
        if (request?.approved === false  && request?.rejected === false) {
            return "Pending"
        } else if (request?.approved === true && request?.rejected === false) {
            return "Approved"
        } else if (request?.approved === false && request?.rejected === true) {
            return "Rejected"
        } else {
            return null
        }
      }


      const handleApproveRequest = async (id) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/writer-requests/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approved: true })
            });
            // setRequests(requests.map(req => req.id === id ? { ...req, approved: true, rejected: false } : req));
            console.log("request accepted")
        } catch (error) {
            console.log('Failed to approve the request');
        }
    };

    const handleRejectRequest = async (id) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/writer-requests/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejected: true })
            });
            // setRequests(requests.map(req => req.id === id ? { ...req, approved: false, rejected: true } : req));
            console.log("successfully rejected request")
        } catch (error) {
            console.log('Failed to reject the request');
        }
    };

    return (
        <Dialog
        open={selectedBox === "writerRequests"}
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
            <h1 style={{color: "white"}}>Requests list</h1>
            {writerRequests?.map((request) => ( 
                <div key={request?.id} style={{marginBottom: "20px"}}>
                <Card 
                sx={cardStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                <Avatar
                        alt="Remy Sharp"
                        src={
                            request?.profile_photo 
                            ? request?.profile_photo 
                            : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                            }
                        sx={{ width: 90, height: 90, mx: "auto", mb: 2, boxShadow: 20, marginTop: "10px" }}
                    />
                <Typography>Request ID: {request?.id}</Typography>
                <Typography>Username: {" "}{request?.username}</Typography>
                <Typography>Status: {requestStatus(request)} </Typography>
                <Typography>Request Date: { `${new Date(request?.request_date).toLocaleDateString()}` + `   ${new Date(request?.request_date).toLocaleTimeString()}`}</Typography>
                <Button style={{color: "green"}} onClick={() => handleApproveRequest(request?.id)} disabled={request?.approved ? true : false}>
                    Accept
                </Button>
                <Button style={{color: "red"}} onClick={() => handleRejectRequest(request?.id)} disabled={request?.rejected ? true : false}>
                    Reject
                </Button>
                </Card>
                {/* <hr style={{width: "35%"}}/> */}
                </div>
            ))}
        </div>
        </DialogContent>
        </Dialog>
    )
}
export default WriterRequests