import Link from "next/link";
import { useAuth } from "@/context/authContext";
import styles from "./index.module.css";

const FeatureCard = ({ href, title, description }) => (
  <Link href={href} className={styles.card}>
    <h2>{title} &rarr;</h2>
    <p>{description}</p>
  </Link>
);

export default function Home() {
  const { currentUser } = useAuth();

  // only logged in users can reach this point
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome back, <span className={styles.username}>{currentUser.username}</span>!
        </h1>

        <p className={styles.description}>Please select an operation to continue:</p>

        <div className={styles.grid}>
          <FeatureCard
            href="/patients"
            title="Patient Management"
            description="View, add, or edit your patient records."
          />

          <FeatureCard
            href="/soapNotes"
            title="SOAP Notes"
            description="Write and review SOAP notes for your patients."
          />

          <FeatureCard href="/profile" title="Profile" description="Manage your account settings and password." />
        </div>
      </main>
    </div>
  );
}

Home.auth = true;
