import Head from "next/head";
import { useAuth } from "@/context/authContext";
import styles from "./index.module.css";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>My Profile</title>
      </Head>

      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        {/* header */}
        <div className={styles.headerText}>
          <h1 className={styles.name}>{currentUser.username}</h1>
          <span className={styles.roleBadge}>{currentUser.role}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.infoContainer}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>{currentUser.username}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Email Address</span>
            <span className={styles.value}>{currentUser.email || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.auth = true;
