import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/User";
import { useParams, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../util/constants";

// COMPONENT IMPORTS
import EditMySingleArticle from "./EditMySingleArticle";

// MUI IMPORTS
import Card from "@mui/material/Card";
import { Typography, TextField, Button, Input, IconButton } from "@mui/material";
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Avatar from "@mui/material/Avatar";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { WriterContext } from "../context/Writer";

function WritersSingleArticle() {
  const { isMobile, user } = useContext(UserContext);
  const [errorFetchingWritersSingleArticle, setErrorFetchingWritersSingleArticle] = useState(null)
  const [article, setArticle] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { articleId, articleType } = useParams()
  const navigate = useNavigate()



  const socialMediaLinks = [
    { icon: <XIcon />, link: user?.profile?.x_link },
    { icon: <FacebookIcon />, link: user?.profile?.facebook_link },
    { icon: <InstagramIcon />, link: user?.profile?.instagram_link },
    { icon: <LinkedInIcon />, link: user?.profile?.linkedin_link }
  ];

  function formatLink(link) {
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
    }
    return link;
  }

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

    function formatDate(dateString) {
        const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
        };

    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
    }

    // useEffect(() => {
    //     console.log("entered page")
    //     setArticleType(article?.is_a_draft ? "draft" : "published");
    //     // return () => {
    //     //     setArticleType(null);
    //     // };
    // }, []);

    useEffect(() => {
        const fetchArticle = async () => {
          const apiUrl = `http://127.0.0.1:8000/api/articles/${parseInt(articleId)}/`;
          const token = localStorage.getItem(ACCESS_TOKEN);
    
          try {
            const response = await fetch(`${apiUrl}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              setErrorFetchingWritersSingleArticle(true)
            } else {
              const data = await response.json();
              setArticle(data);
              setErrorFetchingWritersSingleArticle(null)
            }
          } catch (error) {
            console.log("Failed to fetch articles");
          }
        };
    
        if (user?.username) {
          fetchArticle();
        }
      }, []);

      
  if (!isEditing) {
    return (
        <div
          style={{
            width: isMobile ? "100%" : "70%", // Adjust width based on mobile or desktop
            maxWidth: "1200px", // Optional: Limit maximum width for larger screens
            margin: "0 auto", // Center the div horizontally in the available space
          }}
        >
            <IconButton onClick={() => navigate(`/writer/articles/${articleType}`)}>
              <ArrowBackIosIcon fontSize="medium" sx={{color: "black"}}/>
            </IconButton>
            <IconButton onClick={() => setIsEditing(true)}>
                <EditNoteIcon fontSize="large" sx={{color: "black"}}/>
            </IconButton>
            {article?.is_a_draft ? "Draft" : "Published"}
            
          <h1 style={{ textAlign: "left" }}>{article?.title}</h1>
    
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <Avatar
                alt="Remy Sharp"
                src={
                  user?.profile?.profile_photo
                    ? user?.profile?.profile_photo
                    : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                }
                sx={{ width: 40, height: 40, marginRight: "20px" }}
              />
                <div>
                    <Typography>By: {user?.username}</Typography>
                    <Typography variant="body2" style={{ marginTop: "4px", color: "gray" }}>
                        {formatDate(article?.created_at)}
                    </Typography>
                </div>
            </div>
          </div>
          
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
               {socialMediaLinks?.map((media, index) => (
                <IconButton key={index} component="a" href={formatLink(media.link)} target="_blank" rel="noopener noreferrer">
                    {media?.icon}
                </IconButton>
               ))}
            </div>
          </div>
          <hr />
    
          <img
            src={article?.photo_header}
            style={{
              maxWidth: "100%", // Make sure the image doesn't exceed the container width
              height: "auto", // Maintain aspect ratio
              display: "block", // Remove bottom space/gap
              margin: "0 auto", // Center the image horizontally
            }}
          />
          <hr />
          <div style={{textAlign: "left"}}>
            {
                article?.paragraphs?.map((paragraph) => (
                    <div key={paragraph?.order}>
                    <p key={paragraph?.order} style={{marginTop: "20px"}}>
                        {paragraph?.body}
                    </p>
                    <img 
                    src={paragraph?.photo}
                    style={{
                        maxWidth: isMobile ? "100%" : "50%", // Make sure the image doesn't exceed the container width
                        height: "auto", // Maintain aspect ratio
                        display: "block", // Remove bottom space/gap
                        margin: "0 auto", // Center the image horizontally
                      }}
                        />
                    </div>
                ))
            }
          </div>
        </div>
      );
  } else {
    return <EditMySingleArticle setIsEditing={setIsEditing} formatDate={formatDate} article={article} setArticle={setArticle} />
  }
}
export default WritersSingleArticle
