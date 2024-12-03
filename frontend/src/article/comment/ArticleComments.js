// REACT IMPORTS
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/User";
import { ACCESS_TOKEN } from "../../util/constants";

// COMPONENT IMPORTS
import EditComment from "./EditComment";

// MUI IMPORTS
import { Button, Typography, IconButton, TextField, Box, colors } from "@mui/material";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import CommentIcon from "@mui/icons-material/Comment";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ArticleComments({
  articleCommentsClicked,
  setArticleCommentsClicked,
  articleId,
}) {
  const { isMobile, user } = useContext(UserContext);
  const [commentFormClicked, setCommentFormClicked] = useState(false);
  const [commentErrorResponse, setCommentErrorResponse] = useState(null);
  const [fetchCommentsError, setFetchCommentsError] = useState(null)
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [selectedComment, setSelectedComment] = useState(null)
  const [updatedCommentText, setUpdatedCommentText] = useState("")
  const [editCommentClicked, setEditCommentClicked] = useState(null)


  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  }

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white", // Default border color
      },
      "&:hover fieldset": {
        borderColor: "white", // Border color when hovered
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // Border color when focused
      },
      "& input": {
        color: "white", // Text color
      },
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white", // Label color when focused
    },
    width: "80%",
  };

  const postComment = async (commentText) => {
    const apiUrl = `http://127.0.0.1:8000/api/create-comment/${articleId}/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
          Authorization: `Bearer ${token}`, // Adjust token retrieval as needed
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        setCommentErrorResponse(errorMessage);
      }
      const data = await response.json();
      console.log("Comment created successfully", data);
      setCommentErrorResponse(null);
      setText("");
      setComments((prevComments) => [
        {
          id: data.comment.id,
          text: data.comment.text,
          user: user?.username,
          created_at: data.comment.created_at,
        },
        ...prevComments,
      ]);
    } catch (error) {
      console.log("error creating tag", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/comments/${articleId}/`;
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          // console.log("data for eomments")
        } else {
          const errorData = await response.json()
          setFetchCommentsError(errorData.error)
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Failed to fetch coments", error);
      }
    };
    fetchComments();
  }, []);


  const handleSelectComment = (comment) => {
    if (selectedComment === comment?.id) {
      setSelectedComment(null)
      setEditCommentClicked(false)
      setUpdatedCommentText("")
    } else {
      setSelectedComment(comment?.id)
      setEditCommentClicked(false)
      setUpdatedCommentText("")
    }
  }



  const handleDeleteComment = async(comment) => {
    const apiUrl = `http://127.0.0.1:8000/api/delete-comment/${comment}/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response?.ok) {
        console.log("Comment deleted successfully");
        setComments((prevComments) => 
          prevComments.filter((c) => c.id !== comment)
        );
    } else {
        const errorData = await response.json()
        console.log("Error deleting paragraph:", errorData);
    }
  }


  const handleEditComment = async(comment) => {
    const apiUrl = `http://127.0.0.1:8000/api/edit-comment/${comment}/`;
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
          Authorization: `Bearer ${token}`, // Adjust token retrieval as needed
        },
        body: JSON.stringify({ text: updatedCommentText }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        console.log(errorMessage);
      }
      const updatedComment = await response.json();
      

      setComments((prevComments) => {
        return prevComments.map(c => 
          c.id === updatedComment?.id ? updatedComment : c
        )
      })

      setEditCommentClicked(false)
      setUpdatedCommentText("")
      setSelectedComment(null)
    } catch (error) {
      console.log("error creating tag", error);
    }
  }

  return (
    <Dialog
      open={articleCommentsClicked}
      onClose={() => setArticleCommentsClicked(false)}
      fullWidth
      // maxWidth="sm" // Adjust width as needed
      borderRadius="20px"
      overflow="auto"
    >
      <DialogContent
        style={{ backgroundColor: "#394853", textAlign: "center" }}
      >
        <h1 style={{ color: "white" }}>Comments</h1>
        {
            fetchCommentsError && 
            <h2>{fetchCommentsError}</h2>
        }

        <EditComment 
        editCommentClicked={editCommentClicked}
        setEditCommentClicked={setEditCommentClicked}
        comment={comments.find(comment => comment?.id === selectedComment)}
        updatedCommentText={updatedCommentText}
        setUpdatedCommentText={setUpdatedCommentText}
        handleEditComment={handleEditComment}

        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments?.map((comment) => (
            <Card
              key={comment.id}
              sx={{
                width: !isMobile ? "350px" : "100%",
                height: "150px",
                margin: "0 auto",
                position: "relative", // Ensures this Card is the reference point
                // overflow: "hidden", // Prevents child elements from spilling out
                overflow: "auto"
              }}
            >
              <div style={{position: "absolute"}}>
                <IconButton onClick={() => handleSelectComment(comment)}> 
                  <MoreVertIcon sx={{fontSize: "15px", color: "black"}}/>
                </IconButton>
              </div>

            {
              selectedComment === comment?.id && (
                <div
                  style={{
                    backgroundColor: "#394853",
                    position: "absolute",
                    width: "120px", // Adjusted width for better spacing
                    height: "auto", // Dynamic height for content
                    display: "flex",
                    flexDirection: "column", // Stack the options vertically
                    justifyContent: "center",
                    alignItems: "flex-start", // Align text/options inside
                    padding: "10px", // Padding for spacing inside the popup
                    borderRadius: "8px", // Rounded corners for aesthetics
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    left: "20px", // Adjust positioning relative to parent
                    top: "15px", // Prevent overlap with parent content
                    zIndex: 1000, // Ensure it appears above other elements
                  }}
                >
                  <Button 
                  style={{ padding: "5px 0", cursor: "pointer", color: comment?.user === user?.username ? "white" : "gray"}} 
                  onClick={() => setEditCommentClicked(!editCommentClicked)}
                  disabled={comment?.user === user?.username ? false : true}
                  >
                    Edit
                  </Button>
                  <Button 
                  style={{ padding: "5px 0", cursor: "pointer", color: comment?.user === user?.username ? "white" : "gray" }} 
                  onClick={selectedComment ? () => handleDeleteComment(selectedComment) : null}
                  disabled={comment?.user === user?.username ? false : true}
                  >
                    Delete
                  </Button>
                  <Button style={{ padding: "5px 0", cursor: "pointer", color: "white" }} onClick={() => console.log("Share action")}>
                    Share
                  </Button>
                </div>
              )
            }


              <Typography sx={{width: "70%", margin: "0 auto"}}>{comment?.text}</Typography>
              <hr style={{ width: "90%" }} />
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  position: "absolute", // Anchors to the Card
                  bottom: "5px", // Positions it 5px from the bottom
                  left: "5px", // Positions it 5px from the left
                  marginTop: "10px",
                  display: "flex", // Use flexbox to align text and icon
                  flexDirection: "column", // Stack the content vertically
                  alignItems: "flex-start", // Align everything to the left
                }}
              >
                <span>
                  By: <span style={{ fontSize: "10px" }}>{comment?.user}</span>
                </span>

                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <AccessTimeIcon
                        sx={{ fontSize: "15px", marginLeft: "0px", marginTop: "0px" }} // Ensure no additional top margin
                    />
                    <span style={{ display: "inline-flex", alignItems: "center", marginLeft: "5px" }}>
                        {formatDate(comment?.created_at)}
                    </span>
                </div>
              </Typography>
            </Card>
          ))}
        </div>


        <IconButton onClick={() => setCommentFormClicked(!commentFormClicked)}>
          {!commentFormClicked ? (
            <CommentIcon sx={{ color: "white" }} />
          ) : (
            <RemoveIcon sx={{ color: "white" }} />
          )}
        </IconButton>

        {commentFormClicked && (
          <div>
            <TextField
              sx={textFieldStyles}
              variant="outlined"
              margin="normal"
              id="text"
              name="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              //   sx={{ width: "80%" }}
              InputProps={{
                placeholder: "Enter Text...",
              }}
            />
            <br />
            <IconButton onClick={() => postComment(text)}>
              <CheckIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default ArticleComments;
