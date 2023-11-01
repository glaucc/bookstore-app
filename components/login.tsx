import { useState } from "react";
import styles from '../styles/AuthenticationPage.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthenticationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const router = useRouter();

  const handleSubmit = (event:any) => {
    event.preventDefault();
    if (username === "react" && password === "123456") {
      router.push('/home');
    } else {
      alert("Incorrect username or password. Please try again.");
    }
  };

  // For real API data
  // const handleSubmit = async (event:any) => {
  //   event.preventDefault();
  //   const url = 'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/authentication/versions/1/tickets';
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Cookie': 'ALFRESCO_REMEMBER_ME=1', // Add the cookie here
  //     },
  //     body: JSON.stringify({
  //       userId: username,
  //       password: password,
  //     }),
  //   };
  //   try {
  //     const response = await fetch(url, requestOptions);
  //     const data = await response.json();
  //     console.log(data); // Handle the response data here
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

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
