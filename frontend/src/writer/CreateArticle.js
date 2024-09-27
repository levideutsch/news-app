import React, { useContext, useState } from "react";
import { UserContext } from "../context/User";
import { ACCESS_TOKEN } from "../util/constants";
import { useNavigate } from "react-router-dom";

// MUI IMPORTS
import Card from "@mui/material/Card";
import { Typography, TextField, Button, IconButton } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PreviewAndPublish from "./PreviewAndPublish";



function CreateArticle() {
  const { isMobile } = useContext(UserContext);
  const [articleFormData, setArticleFormData] = useState({
    title: "",
    photo_header: null,
    is_a_draft: true,
    paragraphs: [{ body: "", photo: ""}],
  });

  const [photoHeaderPreview, setPhotoHeaderPreview] = useState(null);
  const [paragraphPreviews, setParagraphPreviews] = useState({});
  const [previewAndPublishClicked, setPreviewAndPublishClicked] = useState(false)
  const navigate = useNavigate()


  const cardStyle = {
    width: isMobile ? "100%" : "30%",
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

  const hoverStyle = {
    transform: "scale(1.09)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  // Handler for changing the title
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setArticleFormData((prevData) => ({
      ...prevData,
      title: value,
    }));
  };

  // Handler for changing the header photo
  const handlePhotoHeaderChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArticleFormData((prevData) => ({
        ...prevData,
        photo_header: file,
      }));
      setPhotoHeaderPreview(URL.createObjectURL(file));
    }
  };

  // Handler for changing paragraph content
  const handleParagraphBodyChange = (e, index) => {
    const { value } = e.target;
    const newParagraphs = [...articleFormData.paragraphs];
    newParagraphs[index] = { ...newParagraphs[index], body: value };
    setArticleFormData((prevData) => ({
      ...prevData,
      paragraphs: newParagraphs,
    }));
  };

  // Handler for changing paragraph photo
  const handleParagraphPhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newParagraphs = [...articleFormData.paragraphs];
      newParagraphs[index] = { ...newParagraphs[index], photo: file };
      setArticleFormData((prevData) => ({
        ...prevData,
        paragraphs: newParagraphs,
      }));
      setParagraphPreviews({
        ...paragraphPreviews,
        [index]: URL.createObjectURL(file),
      });
    }
  };

  const addParagraph = () => {
    setArticleFormData((prevData) => ({
      ...prevData,
      paragraphs: [
        ...prevData.paragraphs,
        {
          body: "",
          photo: null,
        },
      ],
    }));
  };

  const removeParagraph = (index) => {
    setArticleFormData((prevData) => {
      // Remove the paragraph at the specified index
      const updatedParagraphs = prevData.paragraphs.filter((_, i) => i !== index);
  
      // // Update the order of the remaining paragraphs
      // const reorderedParagraphs = updatedParagraphs.map((paragraph, idx) => ({
      //   ...paragraph,
      //   order: idx + 1, // Reorder starting from 1
      // }));

      return {
        ...prevData,
        paragraphs: updatedParagraphs,
      };
    });
  
    // Update the paragraph previews
    setParagraphPreviews((prevPreviews) => {
      // Create a new previews object, excluding the one for the removed paragraph
      const newParagraphPreviews = Object.keys(prevPreviews)
        .filter((key) => parseInt(key, 10) !== index)
        .reduce((acc, key) => {
          // Adjust the keys for the previews to match the new paragraph indices
          const newKey = key > index ? key - 1 : key;
          acc[newKey] = prevPreviews[key];
          return acc;
        }, {});
  
      return newParagraphPreviews;
    });
  };


  const postArticleData = async (articleData, isPublishing) => {
    const apiUrl = "http://127.0.0.1:8000/api/create-article/"; // Base URL of the API
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const formData = new FormData();
      formData.append("title", articleData.title);
      formData.append("photo_header", articleData.photo_header);
      formData.append("is_a_draft", isPublishing ? "false" : "true");
  
      // Add paragraphs to the FormData
      articleData.paragraphs.forEach((paragraph, index) => {
        formData.append(`paragraphs[${index}].body`, paragraph.body);
        formData.append(`paragraphs[${index}].photo`, paragraph.photo);
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Adjust token retrieval as needed
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      console.log("Article created successfully:", data);
      navigate(`/writer/articles/${data.is_a_draft ? "draft" : "published"}`)
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  // Publish the article
  const handlePublish = () => {
    postArticleData(articleFormData, true); // isPublishing is true for publishing
  };

  // Save as Draft button
  const handleSaveAsDraft = () => {
    postArticleData(articleFormData, false); // isPublishing is false for saving as draft
  };

  return (
    <div style={{ textAlign: "center" }}>

      <PreviewAndPublish 
      articleFormData={articleFormData} 
      setPreviewAndPublishClicked={setPreviewAndPublishClicked}
      previewAndPublishClicked={previewAndPublishClicked}
      photoHeaderPreview={photoHeaderPreview}
      paragraphPreviews={paragraphPreviews}
      handlePublish={handlePublish}
      />

      <NewspaperIcon fontSize="large" style={{ marginBottom: "15px" }} />
      <h1 style={{ marginTop: "-20px" }}>Create Article</h1>

      <Typography sx={{ fontWeight: "bold" }}>Image Header</Typography>

      <Card
        sx={{
          ...cardStyle,
          position: "relative",
          overflow: "hidden",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = hoverStyle.transform)
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {photoHeaderPreview && (
          <img
            src={photoHeaderPreview}
            alt="Header Preview"
            style={{
              height: "20vh",
              width: "100%",
              objectFit: "contain",
              display: "block",
              margin: "auto",
            }}
          />
        )}
        <IconButton
          aria-label="upload picture"
          component="label"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "10px",
          }}
        >
          <input
            type="file"
            name="photo_header"
            hidden
            onChange={handlePhotoHeaderChange}
            accept="image/*"
          />
          <PhotoCameraIcon fontSize="large" sx={{ color: "black" }} />
        </IconButton>
      </Card>

      <h1 style={{ fontWeight: "bold", marginTop: "100px" }}>Title</h1>
      <Card
        sx={{
          width: isMobile ? "100%" : "70%",
          boxShadow: 20,
          borderRadius: "8px",
          backgroundColor: "white",
          color: "black",
          textAlign: "center",
          margin: "0 auto",
          height: "auto",
          minHeight: "20vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = hoverStyle.transform)
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <TextField
          variant="outlined"
          margin="normal"
          id="title"
          name="title"
          type="text"
          value={articleFormData.title}
          onChange={handleTitleChange}
          sx={{ width: "80%" }}
          InputProps={{
            placeholder: "Enter Title...",
          }}
        />
      </Card>

      <h1 style={{ fontWeight: "bold", marginTop: "100px" }}>Paragraphs</h1>
      {articleFormData.paragraphs.map((paragraph, index) => (
        <Card
          key={index}
          sx={{
            width: isMobile ? "100%" : "70%",
            boxShadow: 20,
            borderRadius: "8px",
            backgroundColor: "white",
            color: "black",
            textAlign: "center",
            margin: "0 auto",
            marginTop: "30px",
            padding: "10px",
            
          }}
        >
          <h2>Paragraph</h2>
          <TextField
            variant="outlined"
            margin="normal"
            id={`body-${index}`}
            name="body"
            type="text"
            value={paragraph.body}
            onChange={(e) => handleParagraphBodyChange(e, index)}
            sx={{ width: "80%" }}
            multiline
            minRows={3}
            InputProps={{
              placeholder: `Enter text for paragraph ${index + 1}...`,
            }}
          />
        <IconButton
          aria-label="upload picture"
          component="label"
          sx={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <input
            type="file"
            name="paragraph_photo"
            hidden
            onChange={(e) => handleParagraphPhotoChange(e, index)}
            accept="image/*"
          />
          <PhotoCameraIcon fontSize="large" sx={{ color: "black" }} />
        </IconButton>
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
          <br />
          <Button onClick={() => removeParagraph(index)} sx={{}}>
            <RemoveIcon sx={{color: "black"}} fontSize="large"/>
          </Button>
        </Card>
      ))}
      <Button onClick={addParagraph} sx={{color: "black", marginTop: "10px"}}>
        <AddIcon sx={{color: "black"}} fontSize="large"/>
        </Button>
      <br />
      <div style={{justifyContent: "center", display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", marginTop: "30px"}}>
        <Button
          sx={{color: "white", backgroundColor: "#394853", minWidth: "15vw"}}
          onClick={() => {
            setPreviewAndPublishClicked(true)
          }}
        >
          Preview And Publish
        </Button>
        <Button
          sx={{color: "white", backgroundColor: "#394853", minWidth: "15vw"}}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </Button>
      </div>
      <button onClick={() => navigate("/writer/articles/published")}>back to writer test</button>
    </div>
  );
}

export default CreateArticle;