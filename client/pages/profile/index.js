import Head from "next/head";
import { useAuth } from "@/context/authContext";
import styles from "./index.module.css";
import Button from "@/components/ui/Button/Button";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>My Profile</title>
      </Head>

      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your account details and settings.</p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>{currentUser.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{currentUser.email || "N/A"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Role</span>
            <span className={`${styles.value} ${styles.role}`}>{currentUser.role}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => alert("Change Password feature coming soon!")}>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

Profile.auth = true;
