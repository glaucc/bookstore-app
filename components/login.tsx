import axios from "axios";
import { useState } from "react";
import styles from '../styles/AuthenticationPage.module.css'; // Import your CSS module for styling


const AuthenticationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const axios = require('axios');
    let data = '{"userId":"react","password":"123456"}';
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/authentication/versions/1/tickets',
        headers: { 
        'Content-Type': 'text/plain'
        },
        data : data
    };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
      

//   const handleSubmit = async (event:any) => {
//     event.preventDefault();
//     const url = `https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/authentication/versions/1/tickets`;

//     try {
//       const response = await axios.post(url, { username, password });

//       // Handle the response data as needed
//       console.log(response.data);
//     } catch (error) {
//       // Handle any errors
//       console.error('Error:', error);
//     }


//   };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Welcome Back!</h2>
        <form className={styles.loginForm}
        //  onSubmit={handleSubmit}
         >
          <input
            type="text"
            placeholder="Username"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
      <div className={styles.imageContainer}>
        {/* <Image src={guts} alt='Guts'/> */}
      </div>
    </div>
  );
};

export default AuthenticationPage;
