import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ACCESS_TOKEN } from "../util/constants";

function BecomeWriterRequest({
  becomeWriterClicked,
  setBecomeWriterClicked,
  writerRequest,
}) {
  const [responseText, setResponseText] = useState(false);


  const handleRequest = async () => {
    const apiUrl = "http://127.0.0.1:8000/";
    const endpoint = "api/writer-requests/";
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        // No need for body as user is handled server-side
      });

      if (!response.ok) {
        setResponseText("Request already exists");
      }
      const result = await response.json();
      setResponseText(result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setResponseText("Failed to submit request");
    }
  };

  function checkRequestStatus(request) {
    if (request?.approved === false && request?.rejected === false) {
      return "Pending"
    } else if (request?.approved === true && request?.rejected === false) {
      return "Accepted"
    } else if (request?.approved === false && request?.rejected === true) {
      return "Rejected"
    } else {
      return null
    }
  }

  return (
    <Dialog
      open={becomeWriterClicked}
      onClose={() => setBecomeWriterClicked(false)}
      fullWidth
      maxWidth="sm" // Adjust width as needed
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "20px", 
          boxSizing: "border-box", 
        }}
      >
        {!responseText && (
          <Button
            style={{ color: "black", marginBottom: "20px" }} 
            onClick={handleRequest}
          >
            {writerRequest?.length >= 1
              ? "Send Another Request"
              : "Send Request"}
          </Button>
        )}

        <Button
          onClick={() => setBecomeWriterClicked(false)}
          style={{
            color: "black",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <CloseIcon />
        </Button>

        {responseText && (
          <Typography
            style={{ textAlign: "center", marginTop: "20px" }} 
          >
            {responseText}
          </Typography>
        )}

        {
        writerRequest?.length >= 1 ? 
            <div>
                <Typography style={{textAlign: "center"}}>Requests:</Typography>
                {writerRequest?.map((request) => (
                    <Typography key={request?.id}>
                        Status: {checkRequestStatus(request)}
                        <br />
                        Requested On: {request?.request_date}
                        <hr />
                    </Typography>
                ))}
            </div> 
        : 
        null
        }
      </div>
    </Dialog>
  );
}

export default BecomeWriterRequest;
