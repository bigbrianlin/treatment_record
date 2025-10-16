import Head from "next/head";
import FeatureCard from "@/components/dashboard/FeatureCard/FeatureCard";
import styles from "./index.module.css";

export default function Home() {
  // only logged in users can reach this point
  return (
    <div className={styles.container}>
      <Head>
        <title>Homepage - Treatment Record System</title>
      </Head>

      <p className={styles.description}>Please select an operation to continue:</p>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Patient & Records</h2>
          <hr className={styles.separator} />
        </div>

        <div className={styles.grid}>
          <FeatureCard href="/patients" title="Patient" description="View, add, or edit your patient records." />
          <FeatureCard
            href="/soapNotes/search"
            title="Search"
            description="Find specific SOAP notes by patient name or MRN."
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Notes & Account</h2>
          <hr className={styles.separator} />
        </div>

        <div className={styles.grid}>
          <FeatureCard
            href="/soapNotes"
            title="SOAP Notes"
            description="Write and review SOAP notes for your patients."
          />
          <FeatureCard href="/profile" title="Profile" description="Manage your account settings and password." />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Test1 & Test2</h2>
          <hr className={styles.separator} />
        </div>

        <div className={styles.grid}>
          <FeatureCard href="/test1" title="Test1" description="Test" />
          <FeatureCard href="/test1" title="Test1" description="Test" />
          <FeatureCard href="/test1" title="Test1" description="Test" />
          <FeatureCard href="/test1" title="Test1" description="Test" />
          <FeatureCard href="/test1" title="Test1" description="Test" />
          <FeatureCard href="/test1" title="Test1" description="Test" />
        </div>
      </section>
    </div>
  );
}

Home.auth = true;
