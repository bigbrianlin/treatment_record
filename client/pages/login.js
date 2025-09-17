import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";

export default function Login() {
  const router = useRouter();
  const { login, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { username, password } = formData;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    router.push("/");
    return null;
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <form onSubmit={handleSubmit}>
        <h1>Login System</h1>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} name="username" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} name="password" type="password" onChange={handleChange} />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
