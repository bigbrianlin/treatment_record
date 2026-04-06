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
      const data = await login(username, password);
      const user = data.user;

      if (user.mustChangePassword) {
        router.push("/profile/change-password");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.mustChangePassword) {
        router.push("/profile/change-password");
      } else if (currentUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
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
    <div>
      <Head>
        <title>Login Page</title>
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.formContainer}>
          {/* Header */}
          {error && <p className={styles.error}>{error}</p>}
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to continue to Treatment Record.</p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username Input */}
            <div className={styles.inputGroup}>
              <div className={styles.icon}>
                {/* User Icon SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                id="username"
                value={username}
                name="username"
                type="text"
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <div className={styles.icon}>
                {/* Lock Icon SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                id="password"
                value={password}
                name="password"
                type="password"
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? (
                <>
                  <Spinner size="small" />
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return page;
};
