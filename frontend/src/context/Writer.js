import { createContext, useState, useEffect, useContext } from "react";
import { ACCESS_TOKEN } from "../util/constants"; // Import token constant
import { UserContext } from "./User";

export const WriterContext = createContext();

export const WriterProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [articleType, setArticleType] = useState(null);
  const { user } = useContext(UserContext); // Assuming user comes from UserContext

console.log(articleType, "article type")
  useEffect(() => {
    const fetchArticles = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/my-articles/${user?.username}/?type=${articleType}`;
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response);
        } else {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.log("Failed to fetch articles");
      }
    };

    if (user?.username && articleType !== null ) {
      fetchArticles();
    }
  }, [articleType, user]);

  return (
    <WriterContext.Provider value={{ articles, setArticles, articleType, setArticleType }}>
      {children}
    </WriterContext.Provider>
  );
};