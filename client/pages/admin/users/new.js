import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminService from "@/services/admin.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./new.module.css";

export default function NewUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    role: "therapist",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { username, firstname, lastname, email, phoneNumber, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await AdminService.createUser(formData);
      setSuccess(true);

      // Redirect back to the user list after a short delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to create user.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Add New Staff | Admin</title>
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Add New Staff</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                id="username"
                value={username}
                name="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                id="firstname"
                value={firstname}
                name="firstname"
                type="text"
                placeholder="Firstname"
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                id="lastname"
                value={lastname}
                name="lastname"
                type="text"
                placeholder="Lastname"
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                id="email"
                value={email}
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                id="phoneNumber"
                value={phoneNumber}
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                className={styles.input}
                style={{ appearance: "auto" }} // Ensure native select dropdown styling
                required
              >
                <option value="therapist">Therapist</option>
                <option value="admin">Admin</option>
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
          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.success}>
              User created successfully! The default password has been applied. Redirecting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

NewUser.auth = { requireAdmin: true };
