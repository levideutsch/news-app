import React, { createContext, useState, useEffect, useCallback } from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";

export const GlobalStylesContext = createContext();

export const GlobalStylesProvider = ({ children }) => {
    

    const globalTextColor = {
        color: "white", // Set global text color to white
    };

    const globalButtonColor = {
        backgroundColor: "white",
        color: "black", // Set global text color to white
    }

    return (
        <GlobalStylesContext.Provider value={{
            // styles
            globalTextColor,
            globalButtonColor
              }}>
            {children}
        </GlobalStylesContext.Provider>
    );
};