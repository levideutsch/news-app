import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import CreateIcon from "@mui/icons-material/Create";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DraftsIcon from '@mui/icons-material/Drafts';
import ArticleDrafts from "./ArticleDrafts";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { ACCESS_TOKEN } from "../util/constants";

// COMPONENT IMPORTS
import CreateArticle from "./CreateArticle";

const drawerWidth = 240;

export default function WriterDash() {
  const [currentPage, setCurrentPage] = useState("main");
  const { isMobile, user } = useContext(UserContext)
  const [leftIsOpenForMobile, setLeftIsOpenForMobile] = useState(false)
  const [articles, setArticles] = useState([])
  const [articleType, setArticleType] = useState(null)
  const navigate = useNavigate();



  useEffect(() => {
    const fetchRequests = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/my-articles/${user?.username}/?type=${articleType}`;
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            // 'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response);
        } else {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.log("Failed to fetch writer requests");
      }
    };

    fetchRequests();
  }, [articleType]);


  const toggleDrawer = () => {
    setLeftIsOpenForMobile(!leftIsOpenForMobile);
  };

  function displayPage() {
    if (currentPage === "main") {
      return null;
    } else if (currentPage === "createArticle") {
      return <CreateArticle />;
    } else if (currentPage === "articleDrafts") {
      return <ArticleDrafts 
              articles={articles} 
              setArticles={setArticles} 
              setArticleType={setArticleType}
              />
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#394853",
        }}
      >
        <Toolbar >
          {isMobile && leftIsOpenForMobile ? (
            <CloseIcon onClick={() => setLeftIsOpenForMobile(false)}/>
          ): (
            <MenuIcon onClick={() => setLeftIsOpenForMobile(true)}/>
          )
          }
          <Typography variant="h6" noWrap component="div" onClick={() => setCurrentPage("main")} style={{marginLeft: "10px"}}>
            Writer Mode
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? leftIsOpenForMobile : true} 
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#394853", // Apply background color to the drawer paper
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCurrentPage("createArticle")}>
                <ListItemIcon>
                <NewspaperIcon style={{color: "white"}}/>
                </ListItemIcon>
                <ListItemText
                  primary="Write New Article"
                  sx={{ color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ backgroundColor: "white" }} />{" "}

          <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentPage("articleDrafts")}>
                  <ListItemIcon>
                    <DraftsIcon style={{color: "white"}}/>
                  </ListItemIcon>
                  <ListItemText primary="Article Drafts" sx={{ color: "white" }} />{" "}
                </ListItemButton>
              </ListItem>
          </List>

          <List style={{display: "flex", position: "absolute", marginTop: "400px", left: "30%"}}>
            <ListItem>
              <ListItemButton onClick={() => navigate("/")}>
                <ArrowBackIosIcon fontSize="large" style={{color: "white"}}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Toolbar /> */}
        {displayPage()}
      </Box>
    </Box>
  );
}
