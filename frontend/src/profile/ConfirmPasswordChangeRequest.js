// REACT IMPORTS 
import React,{ useContext, useState } from "react"
import { UserContext } from "../context/User"

// MUI IMPORTS
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

function ConfirmPasswordChangeRequest({ changePasswordClicked, setChangePasswordClicked}) {

    const { isMobile } = useContext(UserContext);


    const handlePasswordChangeRequest = () => {

    }


    return (
        <Dialog
        open={changePasswordClicked}
        onClose={() => setChangePasswordClicked(false)}
        fullWidth
        borderRadius="20px"
        overflow="auto"
      >
        <DialogContent style={{ backgroundColor: "#394853" }}>
            <Button
                onClick={() => setChangePasswordClicked(false)}
                style={{ color: "white", position: "absolute"}}
            >
                <CloseIcon />
            </Button>
            <h4 style={{ color: "white", textAlign: "center" }}>Are You Sure You Want To Change Your Password?</h4>
            <div style={{textAlign: "center"}}>
            <Button sx={{color: "blue"}}>
                Yes
            </Button>
            <Button sx={{color: "red"}}>
                No
            </Button>
            </div>
        </DialogContent>
      </Dialog>
    )
}
export default ConfirmPasswordChangeRequest