import React, { useContext } from "react";
// import { Route, Routes } from 'react-router-dom';
import { Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/User";
import { WriterProvider } from "./context/Writer";
// COMPONENT IMPORTS
import Home from "./home/Home";
import Profile from "./profile/Profile";
import Navbar from "./Navbar";
import ProtectedRoute from "./protect/ProtectedRoute"; // Import the ProtectedRoute component
import ProtectAdmin from "./protect/ProtectAdmin";
import Admin from "./admin/Admin";
import MySingleArticle from "./writer/MySingleArticle";

import "./index.css";
import PublicProfile from "./public-profiles/PublicProfile";
import ProtectWriter from "./protect/ProtectWriter";
import WriterDash from "./writer/WriterDash";
import ArticleDrafts from "./writer/ArticleDrafts";
import CreateArticle from "./writer/CreateArticle";

function App() {
  const { isAuthorized } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px", backgroundColor: "F4F4F4" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route path="/admin" element={<ProtectAdmin component={Admin} />} />
          <Route path="/user/:username" element={<PublicProfile />} />
        </Routes>

        {/* Wrap the writer-related routes with WriterProvider */}
        <WriterProvider>
          <Routes>
            <Route
              path="/writer"
              element={<ProtectWriter component={WriterDash} />}
            >
              <Route path="create" element={<CreateArticle />} />
              <Route path="articles/:articleType" element={<ArticleDrafts />} />
              <Route path=":articleId" element={<MySingleArticle />} />
            </Route>
          </Routes>
        </WriterProvider>
      </div>
    </div>
  );
}

export default App;
    //         <div >
    //             <Navbar />
    //             <div style={{ marginTop: '80px', backgroundColor: "F4F4F4" }}>

    //                 <Routes>
    //                     <Route path="/" element={<Home />} />

    //                     {/* Use ProtectedRoute for the Profile route */}
    //                     <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
    //                     <Route path='/admin' element={<ProtectAdmin component={Admin}/>} />

    // {/*
    //                         <Route path='writer' element={<ProtectWriter component={WriterDash}/>}>
    //                         <Route path='create' element={<CreateArticle/>}/>
    //                         <Route path='articles' element={<ArticleDrafts/>}/>
    //                         <Route path='articles/:articleId' element={<MySingleArticle />}/>
    //                         </Route> */}

    //                     <Route path='/user/:username' element={<PublicProfile />}/>
    //                 </Routes>

    //             </div>
    //         </div>
