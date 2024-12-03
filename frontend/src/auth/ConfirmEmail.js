import React, { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";


function ConfirmEmail() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("Proccessing...")
console.log(uid, "uid")
// console.log(token, "token")


  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "http://127.0.0.1:8000/";
      const endpoint = `api/confirm-email/${uid}/${token}/`;
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setStatus(data?.data?.message);
        } else {
          console.error("Failed to fetch articles");
          // setStatus(response)
          console.log(response)
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [uid, token]);

  return (
    <div style={{textAlign: "center"}}>
         <h1>Email Confirmation</h1>
        {status}
    </div>
  )
    
}
export default ConfirmEmail