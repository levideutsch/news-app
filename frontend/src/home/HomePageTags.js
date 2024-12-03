// REACT IMPORTS
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/User';

// COMPONENT IMPORTS
import SingleHomePageTag from './SingleHomePageTag';



// MUI IMPORTS
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';




function HomePageTags({ popularTags }) {
    const { isMobile } = useContext(UserContext)
    const [selectedTag, setSelectedTag] = useState(null)


useEffect(() => {
    const savedTag = localStorage.getItem("selectedTag");
    if (savedTag) {
        setSelectedTag(savedTag);
    }
}, [setSelectedTag]);

    return (
      <div style={{
        maxWidth: "1300px",
        margin: "0 auto",
        textAlign: "center",
        display: isMobile ? "none" : "flex",
        gap: "20px",
        
      }}>
        {
            selectedTag &&  <SingleHomePageTag selectedTag={selectedTag} setSelectedTag={setSelectedTag} /> 
        }
       
    
        <ButtonGroup 
        variant="outlined" 
        aria-label="Loading button group"
        sx={{
            '& .MuiButton-outlined': {
              borderColor: 'white', // Set the outline (border) color to white
              color: 'white',       // Ensure the text color is also white
            },
            '& .MuiButton-outlined:hover': {
              borderColor: 'white', // Keep border white on hover
            },
          }}
        >
                {popularTags?.map((tag) => (
                <Button onClick={() => setSelectedTag(tag?.id)} key={tag?.id} sx={{fontSize: "10px", width: "130px", color: "white" }}>{tag?.name}</Button>
                ))}
            {/* <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>
                Save
            </LoadingButton> */}
        </ButtonGroup>
      </div>
    );
  }
  
  export default HomePageTags;