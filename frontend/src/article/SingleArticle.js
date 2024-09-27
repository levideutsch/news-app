import React, { useEffect, useState, useContext } from "react"
import { UserContext } from "../context/User";
import { useParams, useNavigate } from "react-router-dom"


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


function SingleArticle() {
    const { isMobile, user } = useContext(UserContext);
    const [errorFetchingArticle, setErrorFetchingArticle] = useState(null)
    const [article, setArticle] = useState({})
    const { articleId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchArticles = async () => {
          const apiUrl = "http://127.0.0.1:8000/";
          const endpoint = `api/user-single-article-view/${articleId}/`;
          try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const data = await response.json();
              setArticle(data);
              setErrorFetchingArticle(null)
            } else {
              console.error("Failed to fetch articles");
              setErrorFetchingArticle(true)
            }
          } catch (error) {
            console.error("Failed to fetch articles", error);
          }
        };
        fetchArticles();
      }, []);


      const socialMediaLinks = [
        { icon: <XIcon />, link: article?.user?.profile?.x_link },
        { icon: <FacebookIcon />, link: article?.user?.profile?.facebook_link },
        { icon: <InstagramIcon />, link: article?.user?.profile?.instagram_link },
        { icon: <LinkedInIcon />, link: article?.user?.profile?.linkedin_link },
      ];


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

    function formatLink(link) {
        if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
            return `https://${link}`;
        }
        return link;
    }

console.log(article)
    {
        if (!errorFetchingArticle) {
            return (
                <Card 
                style={{
                    width: isMobile ? "100%" : "45%", // Adjust width based on mobile or desktop
                    maxWidth: "1200px", // Optional: Limit maximum width for larger screens
                    margin: "0 auto", // Center the div horizontally in the available space
                  }}
                >  
                    <h1 style={{ textAlign: "center", padding: "10px" }}>{article?.title}</h1>
        
                  <div style={{ width: "80%", margin: "20px auto 0 auto", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={() => navigate(`/user/${article?.user?.username}`)}>
                        <Avatar
                        alt="Remy Sharp"
                        src={
                            article?.user?.profile?.profile_photo
                            ? article?.user?.profile?.profile_photo
                            : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
                        }
                        sx={{ width: 40, height: 40, marginRight: "20px" }}
                        />
                    </Button>
                        <div>
                        <Typography sx={{fontSize: "13px"}}>By: {article?.user?.username}</Typography>
                        <Typography variant="body2" style={{ marginTop: "4px", color: "gray", fontSize: "13px" }}>
                            {formatDate(article?.created_at)}
                        </Typography>
                        </div>
                    </div>
                     <hr style={{ width: "100%", marginTop: "20px" }} />
                    </div>
        
                  <img
                    src={article?.photo_header}
                    style={{
                        width: isMobile ? "100%" : "80%", // Adjust width based on mobile or desktop
                        maxWidth: isMobile ? "100%" : "80%", // Make sure the image doesn't exceed the container width
                        height: "auto", // Maintain aspect ratio
                        display: "block", // Remove bottom space/gap
                        margin: "0 auto", // Center the image horizontally
                    }}
                  />
        
                  <div style={{
                    textAlign: "left", 
                    width: isMobile ? "100%" : "80%", // Adjust width based on mobile or desktop
                    maxWidth: isMobile ? "100%" : "80%", // Make sure the image doesn't exceed the container width
                    margin: "0 auto"
                    }}>
                    {
                        article?.paragraphs?.map((paragraph, index) => (
                            <div key={index}>
                            <p key={index} style={{marginTop: "20px", padding: "10px"}}>
                                {paragraph?.body}
                            </p>
                            <img 
                            src={paragraph?.photo}
                            style={{
                                width: isMobile ? "100%" : "80%", // Adjust width based on mobile or desktop
                                maxWidth: isMobile ? "100%" : "80%", // Make sure the image doesn't exceed the container width
                                height: "auto", // Maintain aspect ratio
                                display: "block", // Remove bottom space/gap
                                margin: "0 auto", // Center the image horizontally
                              }}
                                />
                            </div>
                        ))
                    }
                  </div>
             </Card>  
            )
        } else {
            return <h1 style={{textAlign: "center", color: "white"}}>Unable To View Article</h1>
        }
    }
}
export default SingleArticle