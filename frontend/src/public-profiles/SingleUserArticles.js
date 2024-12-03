// REACT IMPORTS
import React, { useContext, useState, useEffect } from "react";
import { GlobalStylesContext } from "../context/GlobalStyles";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";

// MUI IMPORTS
import { Card, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function SingleUserArticles({ username }) {
  const { globalTextColor, globalTextColorBlack } =
    useContext(GlobalStylesContext);
  const { isMobile } = useContext(UserContext);
  const navigate = useNavigate();
  const [errorFetchingArticles, setErrorFetchingArticles] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more articles


  const cardStyle = {
    width: isMobile ? "95%" : "50%",
    borderRadius: "8px",
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    height: isMobile ? "40vh" : "45vh",
    margin: "5px auto",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hoverStyle = {
    transform: "scale(1.02)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/single-user-articles/${username}/?page=${page}`;
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response, "error");
          setErrorFetchingArticles(true);
          setHasMore(false); // No more articles if there's an error
          return;
        } else {
          const data = await response.json();
          setArticles((prevArticles) => {
            const newArticles = data.results.filter(
              (newArticle) =>
                !prevArticles.some((article) => article.id === newArticle.id)
            );
            return [...prevArticles, ...newArticles];
          });
          setHasMore(data.next !== null); // Check if there's a next page
          // console.log(data, "data");
          setErrorFetchingArticles(false);
        }
      } catch (error) {
        console.log("Failed to fetch writer requests");
      }
    };

    fetchArticles();
  }, [page]);

  const loadMoreArticles = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page to fetch more articles
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {articles?.map((article) => (
        <Card
          sx={cardStyle}
          key={article?.id}
          onClick={() => navigate(`/article/${article?.id}`)}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = hoverStyle.transform)
          }
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h4 style={globalTextColorBlack}>{article?.title}</h4>
          <hr style={{ width: "95%" }} />
          <img
            style={{
              width: "90%",
              height: "90%", // Make image take up the full height of the container
              objectFit: "cover", // Ensure the image covers the container
              borderRadius: "8px", // Match border radius of the card
            }}
            src={article?.photo_header}
          />
        </Card>
      ))}
      <ExpandMoreIcon
        onClick={loadMoreArticles}
        fontSize="large"
        style={{ marginTop: "100px", marginBottom: "100px", color: "white" }}
      >
        load more
      </ExpandMoreIcon>
    </div>
  );
}
export default SingleUserArticles;
