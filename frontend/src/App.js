import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContext } from './context/User';
// COMPONENT IMPORTS
import Home from './home/Home';
import Profile from './profile/Profile';
import Navbar from './Navbar';
import ProtectedRoute from './protect/ProtectedRoute'; // Import the ProtectedRoute component
import ProtectAdmin from './protect/ProtectAdmin';
import Admin from './admin/Admin';

import "./index.css"
import PublicProfile from './public-profiles/PublicProfile';
import ProtectWriter from './protect/ProtectWriter';
import WriterDash from './writer/WriterDash';

function App() {
    const { isAuthorized } = useContext(UserContext);

  

    return (
        <div >
            <Navbar />
            <div style={{ marginTop: '80px', backgroundColor: "F4F4F4" }}>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Use ProtectedRoute for the Profile route */}
                    <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
                    <Route path='/admin' element={<ProtectAdmin component={Admin}/>} />
                    <Route path='/writer' element={<ProtectWriter component={WriterDash}/>}/>
                    <Route path='/user/:username' element={<PublicProfile />}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;
