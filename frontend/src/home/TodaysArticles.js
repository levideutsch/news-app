import React, { useEffect, useState, useContext } from "react";
import LatestArticle from "./LatestArticle";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";

// MUI IMPORTS
import { Card } from "@mui/material";

function TodaysArticles() {
  const [todaysArticles, setTodaysArticles] = useState([]);
  const [latestArticle, setLatestArticle] = useState(null);
  const navigate = useNavigate()
  const { isMobile } = useContext(UserContext); // Accessing isMobile from UserContext

  useEffect(() => {
    const fetchArticles = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = "api/todays-articles";
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTodaysArticles(data?.past_day);
          setLatestArticle(data?.latest);
        } else {
          console.error("Failed to fetch articles");
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };
    fetchArticles();
  }, []);

  // Inline styles based on screen size
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", // Stack on mobile, 2 columns on desktop
    gap: "20px",
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "20px",
    marginBottom: "100px"
  };

  const latestArticleStyle = {
    gridColumn: isMobile ? "span 1" : "span 1", // Same for both, but you can adjust if needed
  };

  const todaysArticlesGridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", // One column for mobile, 2 for desktop
    gap: "20px",

    // marginTop: '20px',
  };

  const remainingArticlesGridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", // Stack on mobile, 4 columns on desktop
    gap: "20px",
    marginTop: isMobile ? null : "-200px",
  };

  const articleCardStyle = {
    background: "white", // Background color
    padding: "20px",
    borderRadius: "8px", // Rounded corners
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: 20,
  };

  const hoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  const SmallArticleCard = ({ article }) => (
    <div style={articleCardStyle}>
      <h4>{article.title}</h4>
      <p>{article.content}</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Latest Article */}
      <div style={latestArticleStyle}>
        <LatestArticle article={latestArticle} />
      </div>

      {/* Today's Articles */}
      <div>
        <div style={todaysArticlesGridStyle}>
          {todaysArticles.slice(0, 4).map((article, index) => (
            <Card
              key={index}
              sx={articleCardStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = hoverStyle.transform)
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => navigate(`article/${article?.id}`)}
            >
              <div
                style={{
                  width: "100%",
                  height: "200px", // Fixed height for image container
                  overflow: "hidden", // Hide any overflow from large images
                  borderRadius: "8px", // Match border radius
                }}
              >
                <img
                  src={article?.photo_header}
                  style={{
                    width: "100%",
                    height: "100%", // Make image take up the full height of the container
                    objectFit: "cover", // Ensure the image covers the container
                    borderRadius: "8px", // Match border radius of the card
                  }}
                />
              </div>
              <h4 style={{ margin: "10px 0 0 0", textAlign: "center" }}>
                {article?.title}
              </h4>
            </Card>
          ))}
        </div>
      </div>

      {/* Remaining Articles */}
      <div style={remainingArticlesGridStyle}>
        {todaysArticles.slice(4).map((article, index) => (
          <Card
            key={index}
            sx={articleCardStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = hoverStyle.transform)
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: "100%",
                height: "200px", // Fixed height for image container
                overflow: "hidden", // Hide any overflow from large images
                borderRadius: "8px", // Match border radius
              }}
            >
              <img
                src={article?.photo_header}
                style={{
                  width: "100%",
                  height: "100%", // Make image take up the full height of the container
                  objectFit: "cover", // Ensure the image covers the container
                  borderRadius: "8px", // Match border radius of the card
                }}
              />
            </div>
            <h4 style={{ margin: "10px 0 0 0", textAlign: "center" }}>
              {article?.title}
            </h4>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TodaysArticles;
