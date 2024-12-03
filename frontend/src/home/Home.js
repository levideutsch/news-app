import React, { useState, useContext, useEffect } from "react";
import LoginOrRegister from "../auth/LoginOrRegister";
import { UserContext } from "../context/User";


// COMPONENT IMPORTS
import FloatingNav from "./FloatingNav";
import TodaysArticles from "./TodaysArticles";
import HomePageTags from "./HomePageTags";

function Home() {
    // const [hasAnAccount, setHasAnAccount] = useState(true)
    const [todaysArticles, setTodaysArticles] = useState([]);
    const [latestArticle, setLatestArticle] = useState(null);
    const [popularTags, setPopularTags] = useState([])
    const { loginOrRegisterIsOpen, isMobile } = useContext(UserContext)


    useEffect(() => {
        const fetchArticles = async () => {
          const apiUrl = "http://127.0.0.1:8000/";
          const endpoint = "api/todays-articles";
          try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const data = await response.json();
              setTodaysArticles(data?.past_day);
              setLatestArticle(data?.latest);
              setPopularTags(data?.popular_tags)
            } else {
              console.error("Failed to fetch articles");
            }
          } catch (error) {
            console.error("Failed to fetch articles", error);
          }
        };
        fetchArticles();
      }, []);

    return (
        <div>
             {/* {loginOrRegisterIsOpen && <LoginOrRegister              
                hasAnAccount={hasAnAccount}
                setHasAnAccount={setHasAnAccount}
                />
             } */}
             {
             isMobile &&
             <h1 style={{textAlign: "center", color: "white"}}>Latest Articles</h1>
             }
             
             <HomePageTags popularTags={popularTags}/>
             <TodaysArticles 
                todaysArticles={todaysArticles}
                latestArticle={latestArticle}
             />
             {/* <FloatingNav /> */}
        </div>
    )
}
export default Home