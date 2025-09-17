import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import AuthService from "@/services/auth.service";

export default function Register() {
  const router = useRouter();

  let [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "member",
  });
  let [message, setMessage] = useState("");
  const { username, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await AuthService.register(username, password, role);
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (err) {}
  };

  return (
    <div>
      <Head>
        <title>Register Page</title>
      </Head>
      <form onSubmit={handleRegister}>
        <h1>Create account</h1>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} name="username" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} name="password" type="password" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="leader">Leader</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
