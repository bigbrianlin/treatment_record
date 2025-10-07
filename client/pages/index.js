import FeatureCard from "@/components/dashboard/FeatureCard/FeatureCard";
import styles from "./index.module.css";

export default function Home() {
  // only logged in users can reach this point
  return (
    <div className={styles.container}>
      <p className={styles.description}>Please select an operation to continue:</p>
      <div className={styles.grid}>
        <FeatureCard href="/patients" title="Patient" description="View, add, or edit your patient records." />

        <FeatureCard
          href="/soapNotes"
          title="SOAP Notes"
          description="Write and review SOAP notes for your patients."
        />

        <FeatureCard href="/profile" title="Profile" description="Manage your account settings and password." />

        <FeatureCard href="/soapNotes/search" title="Search" description="Search Search Search Search Search Search" />
      </div>
    </div>
  );
}

Home.auth = true;
