import IconButton from "@mui/material/IconButton";
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

function SingleUserConnect({ currentPublicProfile }) {


    function formatLink(link) {
        if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
            return `https://${link}`;
        }
        return link;
    }
    
    return (
        <div>
            <h1 style={{color: "white"}}>Connect</h1>
            <hr style={{width: "95%"}}/>
            <a href={formatLink(currentPublicProfile?.x_link)} target="_blank" rel="noopener noreferrer">
            <IconButton >
                <XIcon fontSize="large" style={{color: "white"}}/>
            </IconButton>
            </a>
            <a href={formatLink(currentPublicProfile?.facebook_link)} target="_blank" rel="noopener noreferrer">
            <IconButton>
                <FacebookIcon fontSize="large" style={{color: "white"}}/>
            </IconButton>
            </a>
            <a href={formatLink(currentPublicProfile?.instagram_link)} target="_blank" rel="noopener noreferrer">
            <IconButton>
                <InstagramIcon fontSize="large" style={{color: "white"}}/>
            </IconButton>
            </a>
            <a href={formatLink(currentPublicProfile?.linkedin_link)} target="_blank" rel="noopener noreferrer">
            <IconButton>
                <LinkedInIcon fontSize="large" style={{color: "white"}}/>
            </IconButton>
            </a>
            <a href={formatLink(null)} target="_blank" rel="noopener noreferrer">
            <IconButton>
                <EmailIcon fontSize="large" style={{color: "white"}}/>
            </IconButton>
            </a>
        </div>
    )
}
export default SingleUserConnect