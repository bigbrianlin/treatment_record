import Head from "next/head";
import FeatureCard from "@/components/dashboard/FeatureCard/FeatureCard";
import styles from "./index.module.css";

export default function Home() {
  // only logged in users can reach this point
  return (
    <div className={styles.container}>
      {/* The glassmorphism card */}
      <div className={styles.welcomeBox}>
        {/* Optional: A small welcoming icon or logo can go here */}
        <div className={styles.iconWrapper}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </div>

        <h1 className={styles.title}>Welcome to Treatment Record</h1>

        <p className={styles.subtitle}>
          We are glad to have you here. Please use the navigation menu above to manage your <strong>Patients</strong>,
          review <strong>SOAP Notes</strong>, or update your <strong>Profile</strong>.
        </p>
      </div>
    </div>
  );
}

Home.auth = true;
