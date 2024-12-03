import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/User";
import { ACCESS_TOKEN } from "../../util/constants";


import { Button, Typography, IconButton, TextField, Box, colors } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import CommentIcon from "@mui/icons-material/Comment";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

function EditComment({ editCommentClicked, setEditCommentClicked, comment, updatedCommentText, setUpdatedCommentText, handleEditComment }) {
    const { isMobile, user } = useContext(UserContext);


    return (
        <Dialog
        open={editCommentClicked}
        onClose={() => setEditCommentClicked(false)}
        fullWidth
        // maxWidth="sm" // Adjust width as needed
        borderRadius="20px"
        overflow="auto"
      >
        <DialogContent
            style={{ backgroundColor: "#394853", textAlign: "center" }}
        >
            <Typography sx={{color: "white", textAlign: "center"}}>
               <span style={{fontWeight: "bold", color: "black"}}>
               Original Text:
               </span>
               <br />
                {comment?.text}
            </Typography>

          <div
            style={{
              marginTop: "10px", // Adds spacing between the Card and TextField
              width: "100%", // Matches the width of the parent container
              display: "flex",
              justifyContent: "center", // Center the TextField horizontally if needed
            }}
          >
            <TextField
              sx={{
                width: !isMobile ? "350px" : "100%", // Matches Card's width
              }}
              variant="outlined"
              margin="normal"
              id="text"
              name="text"
              type="text"
              value={updatedCommentText}
              placeholder="Update Comment..."
              onChange={(e) => setUpdatedCommentText(e.target.value)} // Make sure this function is defined
            />
          </div>
          <IconButton onClick={() => handleEditComment(comment?.id)}>
            <CheckIcon sx={{color: "white"}}/>
          </IconButton>
        </DialogContent>
      </Dialog>
    )
}
export default EditComment