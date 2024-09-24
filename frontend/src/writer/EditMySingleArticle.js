// REACT IMPORTS
import React, { useState, useContext } from "react";
import { UserContext } from "../context/User";
import { ACCESS_TOKEN } from "../util/constants";
import { useNavigate } from "react-router-dom";

// MUI IMPORTS
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, Button, IconButton, Card, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';


function EditMySingleArticle({ article, setIsEditing, setArticle }) {
  const { isMobile } = useContext(UserContext);
  const navigate = useNavigate()
  const [editArticleFormData, setEditArticleFormData] = useState({
    title: article?.title || "",
    photo_header: article?.photo_header || "",
    is_a_draft: article?.is_a_draft,
    paragraphs: article?.paragraphs?.map(p => ({ id: p?.id, body: p.body, photo: p.photo })) || [],
  });
  const [photoHeaderPreview, setPhotoHeaderPreview] = useState(null);
  const [paragraphPreviews, setParagraphPreviews] = useState({});


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

  // Handler for changing the header photo
  const handlePhotoHeaderChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditArticleFormData((prevData) => ({
        ...prevData,
        photo_header: file,
      }));
      setPhotoHeaderPreview(URL.createObjectURL(file));
    }
  };

  // Handler for changing the title
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setEditArticleFormData((prevData) => ({
      ...prevData,
      title: value,
    }));
  };

  // Handler for changing paragraph content
  const handleParagraphBodyChange = (e, index) => {
    const { value } = e.target;
    const newParagraphs = [...editArticleFormData.paragraphs];
    newParagraphs[index].body = value;
    setEditArticleFormData((prevData) => ({
      ...prevData,
      paragraphs: newParagraphs,
    }));
  };

  // Handler for changing paragraph photo
  const handleParagraphPhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newParagraphs = [...editArticleFormData.paragraphs];
      newParagraphs[index].photo = file;
      setEditArticleFormData((prevData) => ({
        ...prevData,
        paragraphs: newParagraphs,
      }));
      setParagraphPreviews({
        ...paragraphPreviews,
        [index]: URL.createObjectURL(file),
      });
    }
  };

  // Add new paragraph
  const handleAddParagraph = () => {
    setEditArticleFormData((prevData) => ({
        ...prevData,
        paragraphs: [
            ...prevData?.paragraphs,
            {
                body: "",
                photo: null,
            }
        ]
    }))
  };

  // Remove paragraph
  const handleRemoveParagraph = (index, paragraph) => {
    handleDeleteParagraph(article?.id, paragraph?.id)

    setEditArticleFormData((prevData) => {
        const updatedParagraphs = prevData?.paragraphs?.filter((_, i) => i !== index)

        return {
            ...prevData,
            paragraphs: updatedParagraphs
        }
    })
    setParagraphPreviews((prevPreviews) => {
        const newParagraphPreviews = Object.keys(prevPreviews)
        ?.filter((key) => parseInt(key, 10) !== index)
        ?.reduce((acc, key) => {
            const newKey = key > index ? key - 1 : key
            acc[newKey] = prevPreviews[key]
            return acc
        }, {})
        return newParagraphPreviews
    })
  };


// const postArticleData = async (articleData, isPublishing) => {
//     const apiUrl = `http://127.0.0.1:8000/api/articles/${article?.id}/edit/`;
//     const token = localStorage.getItem(ACCESS_TOKEN);
  
//     try {
//       // Base form data for the article itself
//       const formData = new FormData();
  
//       // Update title if changed
//       if (articleData?.title !== article?.title) {
//         formData.append('title', articleData?.title);
//       }
  
//       // Update photo_header if changed
//       if (articleData?.photo_header !== article?.photo_header) {
//         if (articleData?.photo_header instanceof File) {
//           formData.append('photo_header', articleData?.photo_header);
//         }
//       }
  
//       // Set draft status
//       formData.append('is_a_draft', isPublishing ? false : true);
  
//       // Prepare paragraph data as FormData
//       const paragraphs = articleData?.paragraphs || [];
//       const paragraphFormData = new FormData();
      
//       paragraphs.forEach(paragraph => {
//         if (paragraph.id) {
//           paragraphFormData.append(`paragraphs[${paragraph.id}][body]`, paragraph.body);
//           paragraphFormData.append(`paragraphs[${paragraph.id}][order]`, paragraph.order);
          
//           // Handle photo if provided
//           if (paragraph.photo instanceof File) {
//             paragraphFormData.append(`paragraphs[${paragraph.id}][photo]`, paragraph.photo);
//           } else if (paragraph.photo && typeof paragraph.photo === 'string') {
//             // Handle photo URL if it's a string (optional, based on your logic)
//             paragraphFormData.append(`paragraphs[${paragraph.id}][photo]`, paragraph.photo);
//           }
//         } else {
//           // Handle new paragraphs (if needed)
//           paragraphFormData.append('paragraphs', JSON.stringify(paragraph));
//         }
//       });
  
//       // Send paragraph data in a single bulk request
//       const paragraphResponse = await fetch(
//         `http://127.0.0.1:8000/api/articles/${article.id}/paragraphs/bulk-edit/`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: paragraphFormData,
//         }
//       );
  
//       if (!paragraphResponse.ok) {
//         const errorData = await paragraphResponse.json();
//         console.log("Error handling paragraphs:", errorData);
//       }
  
//       // Finally, update the article with PATCH
//       const articleResponse = await fetch(apiUrl, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
  
//       if (articleResponse.ok) {
//         console.log("Article updated successfully");
//       } else {
//         const errorData = await articleResponse.json();
//         console.log("Error updating article:", errorData);
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };



  // For deleting one paragraph
  const handleDeleteParagraph = async(article_id, paragraph_id) => {
    const apiUrl = `http://127.0.0.1:8000/api/articles/${article_id}/paragraphs/${paragraph_id}/delete/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response?.ok) {
        console.log("Paragraph deleted successfully");
    } else {
        const errorData = await response.json()
        console.log("Error deleting paragraph:", errorData);
    }
  }

  // For deleting entire article with paragraphs
  const handleDeleteArticle = async (articleId) => {
    const apiUrl = `http://127.0.0.1:8000/api/articles/${articleId}/delete/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log("Article deleted successfully");
            navigate("/writer/articles")
            // Optionally, you can refresh the page or redirect the user after deletion
        } else {
            const errorData = await response.json();
            console.log("Error deleting article:", errorData);
        }
    } catch (error) {
        console.log("Error:", error);
    }
  };  

  // Publish the article
  const handlePublish = () => {
    handleEditArticleAndParagraphs(editArticleFormData, true); // isPublishing is true for publishing
  };
  // Save as Draft button
  const handleSaveAsDraft = () => {
    handleEditArticleAndParagraphs(editArticleFormData, false); // isPublishing is false for saving as draft
  };

  const handleEditArticleAndParagraphs = async (articleData, isPublishing) => {
    const apiUrl = `http://127.0.0.1:8000/api/article-and-paragraphs-update/${article?.id}/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
            // Initialize formdata
            const articleParagraphsFormData = new FormData();

            // Add article data to formdata
            articleParagraphsFormData.append("title", articleData.title);
            articleParagraphsFormData.append("photo_header", articleData.photo_header);
            articleParagraphsFormData.append("is_a_draft", articleData.is_a_draft);

            // Initialize existing and new paragraphs 
            const existingParagraphs = [];
            const newParagraphs = [];


            articleData?.paragraphs?.forEach(paragraph => {
                if (paragraph?.id) {
                    // Existing paragraph: include the ID and body
                    existingParagraphs.push({
                        id: paragraph.id,
                        body: paragraph.body,
                        photo: paragraph.photo || null
                    });
                } else {
                    // New paragraph
                    newParagraphs.push({
                        body: paragraph.body,
                        photo: paragraph.photo || null
                    });
                }
            });

            // Add existing paragraphs to formdata
            existingParagraphs.forEach(paragraph => {
                articleParagraphsFormData.append(`paragraphs[${paragraph.id}][id]`, paragraph.id);
                articleParagraphsFormData.append(`paragraphs[${paragraph.id}][body]`, paragraph.body);
                if (paragraph?.photo) {
                    articleParagraphsFormData.append(`paragraphs[${paragraph.id}][photo]`, paragraph.photo);
                }
            });

     
            // Add new paragraphs to form data
            newParagraphs.forEach((paragraph, index) => {
                articleParagraphsFormData.append(`new_paragraphs[${index}][body]`, paragraph.body);
                if (paragraph?.photo) {
                    articleParagraphsFormData.append(`new_paragraphs[${index}][photo]`, paragraph.photo);
                }
            });

       
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: articleParagraphsFormData
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Update successful:', result);
        } else {
            console.error('Update failed:', result);
        }
    } catch (error) {
        console.error('Error during update:', error);
    }
};

  return (
    <div style={{ textAlign: "center" }}>
        <IconButton onClick={() => setIsEditing(false)}>
        <EditNoteIcon fontSize="large" sx={{color: "black", marginBottom: "15px" }}/>
        </IconButton>

        <h1 style={{ marginTop: "-20px" }}>Continue Editing</h1>

      <form onSubmit={handleEditArticleAndParagraphs}>
        {/* Header Photo */}
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
          {editArticleFormData.photo_header && (
            <img
              src={photoHeaderPreview || editArticleFormData.photo_header}
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
            <PhotoCameraIcon />
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
          value={editArticleFormData.title}
          onChange={handleTitleChange}
          sx={{ width: "80%" }}
          InputProps={{
            placeholder: "Enter Title...",
          }}
        />
      </Card>


        {/* Paragraphs */}
        <h1 style={{ fontWeight: "bold", marginTop: "100px" }}>Paragraphs</h1>
        {editArticleFormData.paragraphs.map((paragraph, index) => (
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
            <h2>Paragraph {paragraph.order}</h2>
            <TextField
              variant="outlined"
              margin="normal"
              id={`body-${index}`}
              name="body"
              type="text"
              value={paragraph.body}
              onChange={(e) => handleParagraphBodyChange(e, index)}
              multiline
              minRows={3}
              sx={{ width: "80%" }}
              inputProps={{
                placeholder: `Enter text for paragraph ${paragraph.order}...`,
              }}
            />
            <IconButton 
                component="label"
                aria-label="upload picture"
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
            {paragraph.photo && (
              <img
                src={paragraphPreviews[index] || paragraph.photo}
                alt={`Paragraph ${index + 1} Photo`}
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
            <IconButton onClick={() => handleRemoveParagraph(index, paragraph)}>
                <RemoveIcon sx={{color: "black"}} fontSize="large"/>
            </IconButton>
          </Card>
        ))}

        <Button onClick={handleAddParagraph} sx={{color: "black", marginTop: "10px"}}>
        <AddIcon sx={{color: "black"}} fontSize="large"/>
        </Button>
        <br />

    <div style={{justifyContent: "center", display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", marginTop: "30px"}}>
        <Button
          sx={{color: "white", backgroundColor: "#394853", minWidth: "15vw"}}
          onClick={handlePublish}
        >
          Preview And Publish
        </Button>
        <Button
          sx={{color: "white", backgroundColor: "#394853", minWidth: "15vw"}}
          onClick={handleSaveAsDraft}
        >
          Continue As Saved Draft
        </Button>
      </div>
      </form>
      <IconButton>
        Delete Entire Article<DeleteIcon  sx={{marginLeft: "10px"}} onClick={() => handleDeleteArticle(article?.id)}/>
      </IconButton>
    </div>
  );
}

export default EditMySingleArticle;