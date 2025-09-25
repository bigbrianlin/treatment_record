import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./index.module.css";

export default function Login() {
  const router = useRouter();
  const { login, currentUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { username, password } = formData;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      // router.push("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (currentUser) {
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login Page</title>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login System</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} name="username" type="text" onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} name="password" type="password" onChange={handleChange} />
        </div>

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? (
            <>
              <Spinner size="small" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className={styles.link}>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return page;
};
