// REACT IMPORTS
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/User";

// MUI IMPORTS
import { Button, Typography, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function AddTagsToArticle({ addTagsClicked, setAddTagsClicked, setArticleFormData, articleFormData }) {
  const { isMobile } = useContext(UserContext);
  const [tags, setTags] = useState([]);
// console.log(articleFormData, "for data from tags")


const handleTagToggle = (tagId) => {
    setArticleFormData((prevData) => {
      // Check if `tags` array exists; if not, initialize it as an empty array.
      const currentTags = prevData?.tags || [];
  
      // Toggle the tag ID in the array.
      const updatedTags = currentTags.includes(tagId)
        ? currentTags.filter((id) => id !== tagId)
        : [...currentTags, tagId];
  
      // Return the updated form data.
      return {
        ...prevData,
        tags: updatedTags,
      };
    });
  };

  const cardStyle = {
    width: isMobile ? "100%" : "90%",
    // padding: "5px",
    borderRadius: "8px",
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    height: isMobile ? "28vh" : "35vh",
    overflow: "auto",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  useEffect(() => {
    const fetchTags = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = "api/tags/";
      // const token = localStorage.getItem(ACCESS_TOKEN);

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
          setTags(data);
        }
      } catch (error) {
        console.log("Failed to fetch writer requests");
      }
    };

    fetchTags();
  }, []);

  return (
    <Dialog
      open={addTagsClicked}
      onClose={() => setAddTagsClicked(false)}
      borderRadius="20px"
      overflow="auto"
    >
      <DialogContent style={{ backgroundColor: "#394853" }}>
        <div style={{ textAlign: "center"}}>
          <Button
            onClick={() => setAddTagsClicked(false)}
            style={{ color: "white" }}
          >
            <CloseIcon />
          </Button>

          <h1 style={{ color: "white" }}>Add Tags</h1>

          <Card
            sx={{
              ...cardStyle,
            }}
          >
            <FormGroup>
              {tags?.map((tag) => (
                <FormControlLabel
                  key={tag?.id}
                  sx={{textAlign: "left"}}
                  control={
                    <Checkbox
                      checked={articleFormData?.tags.includes(tag?.id)}
                      onChange={() => handleTagToggle(tag?.id)}
                    />
                  }
                  label={<Typography variant="body1">{tag?.name}</Typography>}
                />
              ))}
            </FormGroup>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AddTagsToArticle;
