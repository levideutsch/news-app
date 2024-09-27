import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
function LatestArticle({ article }) {
    const navigate = useNavigate()

    const articleCardStyle = {
        background: 'white', // Background color
        padding: '20px',
        borderRadius: '8px', // Rounded corners
        display: 'flex', // Flexbox for proper layout
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: 20,
        maxHeight: "48vh"
    };

    const imageStyle = {
        width: '100%', // Make the image take up the full width of the container
        height: 'auto', // Maintain aspect ratio
        borderRadius: '8px', // Match border radius of the card
        objectFit: 'cover', // Ensure the image covers the area
        maxHeight: '300px', // Limit the maximum height of the image
    };

    const hoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      };

    return (
        <Card sx={articleCardStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => navigate(`article/${article?.id}`)}
        >
            <h2>{article?.title || "Latest Article"}</h2>
            <img 
                src={article?.photo_header} 
                alt={article?.title || "Latest Article"} 
                style={imageStyle} 
            />
        </Card>
    );
}

export default LatestArticle;