import { useState } from "react";
import styles from "../styles/AuthenticationPage.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthenticationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const encodeToBase64 = (str) => {
    return btoa(str);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // For real API data
    const url =
      "https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/authentication/versions/1/tickets";
    const authString = `${username}:${password}`;
    const encodedAuthString = encodeToBase64(authString);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedAuthString}`, // Add the Authorization header
      },
      body: JSON.stringify({
        userId: username,
        password: password,
      }),
    };
    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      console.log(data); // Log the response data

      // Check if the response data contains the expected "id" entry
      if (data.entry && data.entry.id) {
        document.cookie = `ALFRESCO_REMEMBER_ME=1`; // Save the cookie

        // Make subsequent GET request with the same authentication
        const getOptions = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedAuthString}`,
          },
        };
        const response = await fetch(
          'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children?maxItems=25&orderBy=isFolder%20desc%2Cname%20ASC&include=path%2Cproperties%2CallowableOperations%2Cpermissions%2CaspectNames%2CisFavorite%2Cdefinition&includeSource=true',
          getOptions
        );
        const data = await response.json();
        console.log(data); // Log the response data for the GET request

        router.push("/home"); // Navigate to the home page
      } else {
        alert("Incorrect username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to authenticate. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Welcome Back!</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
