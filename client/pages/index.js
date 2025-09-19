import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./index.module.css";

const FeatureCard = ({ href, title, description }) => (
  <Link href={href} className={styles.card}>
    <h2>{title} &rarr;</h2>
    <p>{description}</p>
  </Link>
);

export default function Home() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    // Wait until loading finishes
    if (!isLoading) {
      return;
    }
    // If not logged in, redirect to login page
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  // Show a loading spinner while checking auth status
  if (isLoading || !currentUser) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

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
