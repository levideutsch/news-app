import React, { useState } from "react";
import { ACCESS_TOKEN } from "../../util/constants";
// MUI IMPORTS
import { Typography, TextField, Button, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

function CreateTag({ setTags }) {
  const [name, setName] = useState("");
  const [tagResponseError, setTagResponseError] = useState(null)

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white", // Default border color
      },
      "&:hover fieldset": {
        borderColor: "white", // Border color when hovered
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // Border color when focused
      },
      "& input": {
        color: "white", // Text color
      },
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white", // Label color when focused
    },
    width: "80%",
  };

  const postTag = async (tagName) => {
    const apiUrl = "http://127.0.0.1:8000/api/tags/";
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
         "Content-Type": "application/json", // Set the correct content type
          Authorization: `Bearer ${token}`, // Adjust token retrieval as needed
        },
        body: JSON.stringify({ name: tagName }),
      });
      if (!response.ok) {
        const errorMessage = await response.json()
        setTagResponseError(errorMessage?.name)
      }
      const data = await response.json();
      console.log("Tag created successfully", data);
      setTags((prevTags) => [data, ...prevTags])
      setName("")
      setTagResponseError(null)
    } catch (error) {
      console.log("error creating tag", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center", color: "white" }}>Create Tag</h1>

      <TextField
        sx={textFieldStyles}
        variant="outlined"
        margin="normal"
        id="title"
        name="title"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        //   sx={{ width: "80%" }}
        InputProps={{
          placeholder: "Enter Tag Name...",
        }}
      />
      <br />
      {tagResponseError && <Typography sx={{color: "white"}}>{tagResponseError}</Typography>}
      <br />
      <IconButton onClick={() => postTag(name)}>
        <CheckIcon fontSize="large" sx={{color: "white"}}/>
      </IconButton>
    </div>
  );
}
export default CreateTag;
