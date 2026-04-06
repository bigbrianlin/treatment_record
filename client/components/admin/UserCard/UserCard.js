import Link from "next/link";
import styles from "./UserCard.module.css";

export default function UserCard({ user }) {
  const fullName =
    user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname || "Unknown Staff";

  const statusText = user.mustChangePassword ? "Pending" : "Active";
  const statusClass = user.mustChangePassword ? styles.statusPending : styles.statusActive;

  return (
    <Link href={`/admin/users/${user._id}`} className={styles.userCard}>
      <div className={styles.topLine}></div>
      <div className={styles.contentContainer}>
        {/* Patient Info Area */}
        <div className={styles.infoWrapper}>
          <h3 className={styles.name}>{fullName}</h3>
          <div className={styles.details}>
            <span>{user.role}</span>
            <span>ID: {user.username}</span>
            <span className={statusClass}>{statusText}</span>
          </div>
        </div>
        <div className={styles.actionIcon}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
}
