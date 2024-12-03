// REACT IMPORTS
import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../../context/User";
// MUI IMPORTS
import { Button, selectClasses, Typography, TextField  } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

function SingleTag({selectedTag, setSelectedTag, setTags }) {
    const {isMobile} = useContext(UserContext)
    const [formIsOpen, setFormIsOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const cardStyle = {
        width: isMobile ? "100%" : "60%",
        // padding: "5px",
        borderRadius: "-8px",
        boxShadow: 20,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: "0 auto",
        height: isMobile ? "28vh" : "35vh",
        overflow: "auto",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      };


     const handleDeleteTag = async(tag) => {
        const apiUrl = `http://127.0.0.1:8000/api/tags/${tag?.id}/`;
    
        const response = await fetch(apiUrl, {
            method: "DELETE",
        })
        if (response?.ok) {
            console.log("Tag deleted successfully");
            setTags((prevTags) => prevTags?.filter((t) => t?.id !== tag?.id));
            setSelectedTag(null)
        } else {
            const errorData = await response.json()
            console.log("Error deleting tag:", errorData);
        }
      }

     const handleEditTag = async(tag, updatedTagName) => {
        const apiUrl = `http://127.0.0.1:8000/api/tags/${tag?.id}/`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Set the correct content-type
                },
                body: JSON.stringify({ name: updatedTagName })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.log(errorData)
            } else {
                const updatedTag = await response.json()
                // console.log(updatedTag?.name)
                setTags((prevTags) => {
                    return prevTags.map(t => 
                        t.id === updatedTag.id ? updatedTag : t
                    );
                });
            }
        } catch (error) {
            console.log(error)
        }
     } 

    useEffect(() => {
        if (selectedTag) {
          setNewName(selectedTag?.name);
        } else {
          setNewName(""); // Reset if no selectedTag
        }
      }, [selectedTag]);

    return (
        <Dialog
        open={!!selectedTag}
        onClose={() => setSelectedTag(null)}
        // fullWidth
        borderRadius="20px"
        overflow="auto"
        >
            <DialogContent sx={{backgroundColor: "white", textAlign: "center"}}>
            <Button onClick={null}>
                <CloseIcon />
            </Button>
            <br />

            {selectedTag?.name}
            <br />
            <IconButton onClick={() => setFormIsOpen(!formIsOpen)}> 
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteTag(selectedTag)}> 
                <DeleteIcon />
            </IconButton>
            </DialogContent>

            <div>
                <Typography variant="h6" gutterBottom>
                    Enter Your Text:
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Update Tag Here..."
                    fullWidth
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <IconButton onClick={() => handleEditTag(selectedTag, newName)}>
                    <CheckIcon />
                </IconButton>
            </div>
        </Dialog>
    )
}
export default SingleTag