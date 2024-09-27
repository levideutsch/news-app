import React, { useContext } from "react";
// import { Route, Routes } from 'react-router-dom';
import { Router, Routes, Route, useLocation } from "react-router-dom";
import { UserContext } from "./context/User";
import { WriterProvider } from "./context/Writer";
// COMPONENT IMPORTS
import Home from "./home/Home";
import Profile from "./profile/Profile";
import Navbar from "./Navbar";
import ProtectedRoute from "./protect/ProtectedRoute"; // Import the ProtectedRoute component
import ProtectAdmin from "./protect/ProtectAdmin";
import Admin from "./admin/Admin";
import FloatingNav from "./home/FloatingNav";


import "./index.css";
import PublicProfile from "./public-profiles/PublicProfile";
import ProtectWriter from "./protect/ProtectWriter";
import WriterDash from "./writer/WriterDash";
import WritersArticles from "./writer/WritersArticles";
import WritersSingleArticle from "./writer/WritersSingleArticle";
import CreateArticle from "./writer/CreateArticle";
import SingleArticle from "./article/SingleArticle";

function App() {
    const { user } = useContext(UserContext)
    const location = useLocation(); 

      // Define paths where the navbar should not be displayed
    const hideNavbarPaths = [
        "/writer/create",
        "/writer/articles/:articleType",
        "/writer/articles/:articleType/:articleId"
    ];

      // Helper function to check if the current path matches any of the "hideNavbar" paths
    const shouldHideNavbar = () => {
        return hideNavbarPaths.some((path) =>
        location.pathname.startsWith("/writer")
        );
    };


  return (
    <div>
      {!shouldHideNavbar() && <Navbar />}
      <div style={{ marginTop: "80px", backgroundColor: "F4F4F4" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="article/:articleId" element={<SingleArticle />}/>
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route path="/admin" element={<ProtectAdmin component={Admin} />} />
          <Route path="/user/:username" element={<PublicProfile />} />
        </Routes>


        <WriterProvider>
            <Routes>
                <Route path="/writer" element={<ProtectWriter component={WriterDash} />}>
                <Route path="create" element={<CreateArticle />} />
                <Route path="articles/:articleType" element={<WritersArticles />} />
                <Route path="articles/:articleType/:articleId" element={<WritersSingleArticle />} />
                </Route>
            </Routes>
        </WriterProvider>
        <FloatingNav />
      </div>
    </div>
  );
}

export default App;
