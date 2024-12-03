import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/User";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ACCESS_TOKEN } from "../util/constants";
import { Button, Typography } from "@mui/material";
// COMPONENT IMPORTS

import AdminPages from "./AdminPages";
// other componets coming later

function Admin() {
  const { isMobile, allUsers } = useContext(UserContext);
  const [writerRequests, setWriterRequests] = useState([])
  const [selectedBox, setSelectedBox] = useState("default")
  const [numberOfTags, setNumberOfTags] = useState(null)
  const approvedWriters = writerRequests?.filter(request => request?.approved)


  const cardStyle = {
    width: "100%",
    // padding: "5px",
    borderRadius: "8px",
    boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    height: "25vh",
  };


  useEffect(() => {
    const fetchRequests = async () => {
        const apiUrl = "http://127.0.0.1:8000/";
        const endpoint = "api/admin-dash-data/"
        const token = localStorage.getItem(ACCESS_TOKEN);

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.log(response)
            } else {
                const data = await response.json()
                setWriterRequests(data?.writer_requests_list)
                setNumberOfTags(data?.number_of_tags)
            }
        } catch (error) {
            console.log('Failed to fetch writer requests');
      
        }
    };

    fetchRequests();
}, []);



        return (
            <div style={{ padding: "16px" }}>
              <AdminPages
                setSelectedBox={setSelectedBox}
                selectedBox={selectedBox}
                writerRequests={writerRequests}
                setWriterRequests={setWriterRequests}
                approvedWriters={approvedWriters}
                allUsers={allUsers}
              />
              <Grid
                container
                spacing={3}
                justifyContent={isMobile ? "center" : "flex-start"}
              >
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle} onClick={() => setSelectedBox("writerRequests")}>
                    <Typography variant="h6">Writer Requests</Typography>
                    <Typography variant="body2">
                    </Typography>
                    <Typography style={{fontSize: "70px"}}>
                        {writerRequests?.length}
                      </Typography>
                      <Button onClick={() => setSelectedBox("writerRequests")} style={{color: "white", backgroundColor: "#394853"}}>Go To Page</Button>
                  </Card>
                </Grid>
        
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle} onClick={() => setSelectedBox("approvedWriters")}>
                    <Typography variant="h6">Current Writers</Typography>
                    <Typography style={{fontSize: "70px"}}>
                      {approvedWriters?.length}
                    </Typography>
                    <Button onClick={() => setSelectedBox("approvedWriters")} style={{color: "white", backgroundColor: "#394853"}}>Go To Page</Button>
                  </Card>
                </Grid>
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle}>
                    <Typography variant="h6">All Users</Typography>
                    <Typography style={{fontSize: "70px"}}>
                      {allUsers?.length}
                    </Typography>
                    <Button onClick={() => setSelectedBox("allUsers")} style={{color: "white", backgroundColor: "#394853"}}>Go To Page</Button>
                  </Card>
                </Grid>
        
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle}>
                    <Typography variant="h6">Tags</Typography>
                    <Typography style={{fontSize: "70px"}}>
                      {numberOfTags}
                    </Typography>
                    <Button onClick={() => setSelectedBox("tags")} style={{color: "white", backgroundColor: "#394853"}}>Go To Page</Button>
                  </Card>
                </Grid>
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle}>
                    <Typography variant="h6">Card 5</Typography>
                    <Typography variant="body2">
                      This is some fake text for card 5
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={17} sm={isMobile ? 12 : 4}>
                  <Card style={cardStyle}>
                    <Typography variant="h6">Card 6</Typography>
                    <Typography variant="body2">
                      This is some fake text for card 6
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </div>
          );



}

export default Admin;
