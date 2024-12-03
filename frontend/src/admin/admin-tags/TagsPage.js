// REACT IMPORTS
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/User";

// COMPONENT IMPORTS
import CreateTag from "./CreateTag";
import SingleTag from "./SingleTag";

// MUI IMPORTS
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

function TagsPage({ selectedBox, setSelectedBox }) {
  const { isMobile } = useContext(UserContext);
  const [createTagIsOpen, setCreateTagIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

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
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  const selectTag = (tag) => {
    setSelectedTag(tag);
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
      open={selectedBox === "tags"}
      onClose={() => setSelectedBox("default")}
      fullWidth
      // maxWidth="sm" // Adjust width as needed
      borderRadius="20px"
      overflow="auto"
    >
      <DialogContent style={{ backgroundColor: "#394853" }}>
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => setSelectedBox("default")}
            style={{ color: "white" }}
          >
            <CloseIcon />
          </Button>

          <h1 style={{ color: "white" }}>Tags</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {tags?.map((tag) => (
              <Card
                key={tag?.id}
                onClick={() => selectTag(tag)}
                sx={{
                  width: "30%",
                  height: "6vh", // Set width to 30% to fit 3 items per row
                  margin: "0 auto",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: 20,
                  borderRadius: "8px", // Rounded corners
                  padding: "20px",
                  position: "relative", // Ensure positioning context for the absolute child

                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = hoverStyle.transform)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={{ 
                  position: "absolute",
                  top: "50%", 
                  left: "50%", 
                  textAlign: "center",
                  transform: "translate(-50%, -50%)",
                }}>
                  {tag?.name}
                </div>
              </Card>
            ))}
          </div>

          <IconButton onClick={() => setCreateTagIsOpen(!createTagIsOpen)}>
            {createTagIsOpen ? (
              <RemoveIcon sx={{ color: "white" }} />
            ) : (
              <AddIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </div>

        {createTagIsOpen && <CreateTag setTags={setTags} />}
        <SingleTag
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          setTags={setTags}
        />
      </DialogContent>
    </Dialog>
  );
}
export default TagsPage;
