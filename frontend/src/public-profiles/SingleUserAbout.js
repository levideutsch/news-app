import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";


function SingleUserAbout({ currentPublicProfile, isMobile }) {


    const cardStyle = {
        width: isMobile ? "85%" : "40%",
        // padding: "5px",
        borderRadius: "8px",
        boxShadow: 20,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: "0 auto",
        height: isMobile ? "3vh" : "7vh",
        // overflow: "auto",
        marginTop: "5px"
      };

    return (
        <div>
            <h1 style={{color: "white"}}>About</h1>
            <hr style={{width: "95%"}}/>
            <Card sx={cardStyle}>
                <Typography style={{fontSize: isMobile ? "20px" : "30px"}}>
                {currentPublicProfile?.is_writer ? `${currentPublicProfile?.username} Is A Writer` :`${currentPublicProfile?.username} Is Not A Writer` }

                </Typography>
            </Card>
            <Card sx={cardStyle}>
                <Typography style={{fontSize:  isMobile ? "20px" : "30px"}}>
                {currentPublicProfile?.location ? `${currentPublicProfile?.username} Is From ${currentPublicProfile?.location}` : null}
                </Typography>
            </Card>
        </div>
    )
}
export default SingleUserAbout