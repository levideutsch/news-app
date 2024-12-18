import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../context/User';
import DraftsIcon from '@mui/icons-material/Drafts';
import { WriterContext } from '../context/Writer';
import { useNavigate, useParams, Outlet  } from "react-router-dom";



// MUI IMPORTS
import Card from "@mui/material/Card";
import { Button, Typography, Box } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";

function WritersArticles() {
    const { isMobile } = useContext(UserContext);
    const {articles, setArticleType} = useContext(WriterContext)
    const navigate = useNavigate()
    const { articleType } = useParams()


    const cardStyle = {
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        padding: "20px",
        height: "auto",
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        marginTop: "10px",
        minHeight: "150px",
      };

    const hoverStyle = {
        transform: "scale(1.09)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    };

    useEffect(() => {
        setArticleType(articleType);
        // return () => {
        //     setArticleType(null);
        // };
    }, [articleType]);

    const gridContainerStyle = {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: "20px",
        width: isMobile ? "100%" : "70%",
        margin: "0 auto",
        marginTop: "20px",
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


    return (
        <div style={{ textAlign: "center" }}>
            <DraftsIcon fontSize="large" style={{ marginBottom: "15px", color: "#394853" }} />
            <h1 style={{ marginTop: "-20px", color: "#394853" }}>{articleType === "draft" ? "Article Drafts" : "Published Articles"}</h1>

            <div style={gridContainerStyle}>
                {articles.map((article, index) => (
                    <Card
                        key={index}
                        sx={{
                            ...cardStyle,
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = hoverStyle.transform)
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                        onClick={() => navigate(`${article?.id}`)}
                    >
                        <Typography variant="h6">
                        {article.title.length > 40 
                            ? `${article.title.slice(0, 40)}...` 
                            : article.title
                        }
                        </Typography>
                        <img 
                            src={article?.photo_header}
                            style={{
                                height: "20vh",
                                width: "100%",
                                objectFit: "contain",
                                display: "block",
                                margin: "auto",
                                }}
                        />
                        <p style={{fontSize: "10px"}}>{formatDate(article?.created_at)}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
export default WritersArticles;