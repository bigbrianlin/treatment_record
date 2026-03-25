import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import AuthService from "@/services/auth.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./index.module.css";

export default function Register() {
  const router = useRouter();

  let [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { username, password, role } = formData;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await AuthService.register(username, password, role);
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Register Page</title>
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.formContainer}>
          {error && <div className={styles.error}>{error}</div>}
          {/* Header */}
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Register your account to manage treatment notes.</p>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username Input */}
            <div className={styles.inputGroup}>
              <div className={styles.icon}>
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

            {/* Role Select Dropdown */}
            <div className={styles.inputGroup}>
              <div className={styles.icon}>
                {/* Badge/Role Icon SVG */}
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
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                  <path d="m19.6 21-2.4-3.5-3.6 1.4-1.6-3.9"></path>
                  <path d="m4.4 21 2.4-3.5 3.6 1.4 1.6-3.9"></path>
                  <circle cx="12" cy="9" r="7"></circle>
                </svg>
              </div>
              <select id="role" name="role" value={role} onChange={handleChange} className={styles.select}>
                <option value="" disabled>
                  Select your role
                </option>
                <option value="leader">Leader</option>
                <option value="member">Member</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? (
                <>
                  <Spinner size="small" />
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className={styles.footerText}>
            Already have an account?
            <Link href="/login" className={styles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Create account</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} name="username" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} name="password" type="password" onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="leader">Leader</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? (
            <>
              <Spinner size="small" />
              <span>Registering...</span>
            </>
          ) : (
            "Register"
          )}
        </button>

        <p className={styles.link}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return page;
};
