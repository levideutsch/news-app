import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";

// MUI IMPORTS
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from "@mui/material/IconButton";


function SingleHomePageTag({ selectedTag, setSelectedTag }) {
    const { isMobile }= useContext(UserContext)
    const [tag, setTag] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])
    const navigate = useNavigate()
console.log(relatedArticles)

      const hoverStyle = {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      };


      useEffect(() => {
        const fetchTags = async () => {
            const apiUrl = "http://127.0.0.1:8000/";
            const endpoint = `api/tags/related-articles/${selectedTag}/`
            // const token = localStorage.getItem(ACCESS_TOKEN);
    
            try {
                const response = await fetch(`${apiUrl}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    console.log(response)
                } else {
                    const data = await response.json()
                    setRelatedArticles(data.articles)
                    setTag(data.name)
        
                }
            } catch (error) {
                console.log('Failed to fetch writer requests');
          
            }
        };
    
        fetchTags();
    }, []);


    // create useEffect cleanup to keep this tag open upon return 
    useEffect(() => {
        if (selectedTag) {
            localStorage.setItem("selectedTag", selectedTag);
        }
    }, [selectedTag]);


    const handleClose = () => {
        setSelectedTag(null); // Reset selectedTag to null to close the Dialog
        localStorage.removeItem("selectedTag"); // Clear it from local storage
    };



    // const fakeArray = [
    //     {id: 1, title: "this is title one", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 2, title: "this is title two", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 3, title: "this is title three", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 4, title: "this is title four", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 5, title: "this is title five", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 6, title: "this is title six", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 7, title: "this is title seven", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    //     {id: 8, title: "this is title eight", photo_header: "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/poster-image-2022-10-13t221156-097-1665713940.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"},
    // ]

    return (
        <Dialog
        open={!!selectedTag}
        onClose={handleClose}
        fullWidth
        borderRadius="20px"
        overflow="auto"
        >
            <DialogContent style={{backgroundColor: "#394853"}}>
                <div style={{textAlign: "center"}}>
                    <Button onClick={handleClose} style={{color: "white"}}>
                        <CloseIcon />
                    </Button>
                    <h1 style={{color: "white"}}>{tag}</h1>

                    <div style={{display: "flex", flexWrap: "wrap", gap: "5px",  }}>
                        {
                            relatedArticles?.map((article) => (
                                <Card 
                                key={article?.id}
                                onClick={() => navigate(`article/${article?.id}`)}
                                sx={{
                                    // width: "10vw", 
                                    width: "30%",
                                    height: "15vh", // Set width to 30% to fit 3 items per row
                                    margin: "0 auto",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    boxShadow: 20,
                                    borderRadius: "8px", // Rounded corners
                                    padding: "20px",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.transform = hoverStyle.transform)
                                  }
                                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    <div style={{ textAlign: "center", marginBottom: "5px" }}>{article?.title}</div>
                                    <img 
                                    src={article?.photo_header} 
                                    style={{
                                        width: "100%", // Scales the image to fit within the card width
                                        height: "60%", // Scales height to a percentage of the card
                                        objectFit: "contain", // Maintains the image's aspect ratio
                                    }}
                                    />
                                </Card>
                            ))
                        }
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
export default SingleHomePageTag