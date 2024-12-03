import React, { useContext, useState } from "react";
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
import LoginOrRegister from "./auth/LoginOrRegister";

// MUI IMPORTS
import "./index.css";
import PublicProfile from "./public-profiles/PublicProfile";
import ProtectWriter from "./protect/ProtectWriter";
import WriterDash from "./writer/WriterDash";
import WritersArticles from "./writer/WritersArticles";
import WritersSingleArticle from "./writer/WritersSingleArticle";
import CreateArticle from "./writer/CreateArticle";
import SingleArticle from "./article/SingleArticle";
import ConfirmEmail from "./auth/ConfirmEmail";

function App() {
    const [hasAnAccount, setHasAnAccount] = useState(true)
    const { user, loginOrRegisterIsOpen } = useContext(UserContext)
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
      <WriterProvider>
      {!shouldHideNavbar() && <Navbar />}
      <div style={{ marginTop: "80px", backgroundColor: "F4F4F4" }}>
      {loginOrRegisterIsOpen && <LoginOrRegister              
                hasAnAccount={hasAnAccount}
                setHasAnAccount={setHasAnAccount}
                />
             }
        <Routes>
          <Route path="/confirm-email/:uid/:token" element={<ConfirmEmail />} />
          <Route path="/" element={<Home />} />
          <Route path="article/:articleId" element={<SingleArticle />}/>
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route path="/admin" element={<ProtectAdmin component={Admin} />} />
          <Route path="/user/:username" element={<PublicProfile />} />

          <Route path="/writer" element={<ProtectWriter component={WriterDash} />}>
                <Route path="create" element={<CreateArticle />} />
                <Route path="articles/:articleType" element={<WritersArticles />} />
                <Route path="articles/:articleType/:articleId" element={<WritersSingleArticle />} />
          </Route>
        </Routes>

        <FloatingNav />
      </div>
      </WriterProvider>
    </div>
  );
}
export default App;
        {/* <WriterProvider>
            <Routes>
                <Route path="/writer" element={<ProtectWriter component={WriterDash} />}>
                <Route path="create" element={<CreateArticle />} />
                <Route path="articles/:articleType" element={<WritersArticles />} />
                <Route path="articles/:articleType/:articleId" element={<WritersSingleArticle />} />
                </Route>
            </Routes>
        </WriterProvider> */}

