import React, { useContext } from "react";
import { UserContext } from "../context/User";

// MUI IMPORTS
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Avatar from "@mui/material/Avatar";


function PreviewAndPublish({
  articleFormData,
  setPreviewAndPublishClicked,
  previewAndPublishClicked,
  paragraphPreviews,
  photoHeaderPreview,
  handlePublish
}) {
    const { user, isMobile } = useContext(UserContext)

  const cardStyle = {
    width: isMobile ? "100%" : "60%",
    borderRadius: "8px",
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    height: "auto",
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    marginTop: "10px",
    minHeight: "20vh",
  };



  return (
    <Dialog
      open={previewAndPublishClicked}
      onClose={() => setPreviewAndPublishClicked(false)}
      fullWidth
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          height: "80vh", // Set custom height, e.g. 80% of the viewport height
          width: "90vw", // Set custom width, e.g. 90% of the viewport width
          textAlign: "center",
        },
      }}
    >
      <DialogContent>
        <h1>Article Preview</h1>
        <h1 style={{marginTop: "40px"}}>
            {articleFormData.title ? articleFormData.title : "No Title"}
        </h1>
        <Card
          sx={{
            ...cardStyle,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {photoHeaderPreview && (
            <img
              src={photoHeaderPreview}
              alt="Header Preview"
              style={{
                height: "40vh",
                width: "100%",
                objectFit: "contain",
                display: "block",
                margin: "auto",
              }}
            />
          )}
        </Card>


        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
            <Avatar 
                alt="Remy Sharp"
                src={
                    user?.profile?.profile_photo 
                    ? user?.profile?.profile_photo 
                    : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                }
                sx={{ width: 60, height: 60, boxShadow: 20, marginRight: "20px" }}
                />

                <Typography >
                By: {user?.username}
                </Typography>
            </div>
        </div>

    <h1 style={{ fontWeight: "bold", marginTop: "80px" }}>Paragraphs</h1>
      {articleFormData.paragraphs.map((paragraph, index) => (
        <div
          key={index}
          style={{
            width: isMobile ? "100%" : "60%",
            boxShadow: 20,
            borderRadius: "8px",
            backgroundColor: "white",
            color: "black",
            textAlign: "center",
            margin: "0 auto",
            marginTop: "30px",
            padding: "10px",
            textAlign: "left"
            
          }}
        >
          {/* <h2>Body</h2> */}
          <Typography>
            {paragraph.body}
          </Typography>

            {paragraphPreviews[index] && (
            <img
              src={paragraphPreviews[index]}
              alt={`Paragraph ${index} Preview`}
              style={{
                height: "20vh",
                width: "100%",
                objectFit: "contain",
                display: "block",
                margin: "auto",
                marginTop: "15px"
              }}
            />
          )}
        </div>
      ))}
        <Button style={{marginTop: "50px"}} onClick={handlePublish}>
            <PostAddIcon sx={{color: "black"}} fontSize="large"/>
        </Button>
        <br />
        <p style={{ marginBottom: "50px"}}>Publish</p>

      </DialogContent>
    </Dialog>
  );
}
export default PreviewAndPublish;
