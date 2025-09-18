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
    role: "member",
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
