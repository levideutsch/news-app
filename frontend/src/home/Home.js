import React, { useState, useContext } from "react";
import LoginOrRegister from "../auth/LoginOrRegister";
import { UserContext } from "../context/User";


// COMPONENT IMPORTS
import FloatingNav from "./FloatingNav";
import TodaysArticles from "./TodaysArticles";

function Home() {
    const [hasAnAccount, setHasAnAccount] = useState(true)
    const { loginOrRegisterIsOpen } = useContext(UserContext)


    return (
        <div>
             {loginOrRegisterIsOpen && <LoginOrRegister              
                hasAnAccount={hasAnAccount}
                setHasAnAccount={setHasAnAccount}
                />
             }
             <h1 style={{textAlign: "center", color: "white"}}>Latest Articles</h1>
             <TodaysArticles />
             {/* <FloatingNav /> */}
        </div>
    )
}
export default Home