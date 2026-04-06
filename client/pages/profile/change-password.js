import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import UserService from "@/services/user.service";
import Head from "next/head";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./change-password.module.css";

export default function ChangePassword() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { oldPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate if new passwords match
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }

    // Validate password complexity if needed (e.g., minimum 8 characters)
    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    setIsLoading(true);

    try {
      await UserService.changePassword(oldPassword, newPassword);
      setCurrentUser({ ...currentUser, mustChangePassword: false });
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to change password.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Change Password</title>
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.formContainer}>
          {/* Header */}
          <h1 className={styles.title}>Update Password</h1>
          <p className={styles.subtitle}>For security reasons, you must change your default password.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Old Password Input */}
            <div className={styles.inputGroup}>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* New Password Input */}
            <div className={styles.inputGroup}>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* Confirm New Password Input */}
            <div className={styles.inputGroup}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading || success} className={styles.submitButton}>
              {isLoading ? <Spinner size="small" /> : "Update Password"}
            </button>
          </form>

          {/* Alert Messages */}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>Password updated successfully! Redirecting...</p>}
        </div>
      </div>
    </div>
  );
}

ChangePassword.auth = true;
