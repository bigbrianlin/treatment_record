import { useState, useEffect, use } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./[id].module.css";

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser, isLoading: isAuthloading } = useAuth();

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthloading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isAuthloading, router]);

  useEffect(() => {
    // make sure we have an id and user is authenticated
    if (id && currentUser) {
      const fetchPatient = async () => {
        setIsLoading(true);
        try {
          const response = await PatientService.getPatientById(id);
          setPatient(response.data);
        } catch (err) {
          setError("Failed to fetch patient data. You may not have permission or the patient does not exist.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id, currentUser]);

  if (isAuthloading || isLoading || !currentUser) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Patient: {patient.name}</title>
      </Head>

      <div className={styles.header}>
        <div>
          <h1 className={styles.patientName}>{patient.name}</h1>
          <p className={styles.mrn}>MRN: {patient.medicalRecordNumber}</p>
        </div>
        <Link href="/patients" className={styles.backLink}>
          &larr; Back to Patient List
        </Link>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h4>Date of Birth</h4>
          <p>{new Date(patient.birthDate).toLocaleDateString()}</p>
        </div>
        <div className={styles.detailCard}>
          <h4>Age</h4>
          <p>{patient.age} years old</p>
        </div>
        <div className={styles.detailCard}>
          <h4>Gender</h4>
          <p>{patient.gender}</p>
        </div>
        <div className={styles.detailCard}>
          <h4>Contact Number</h4>
          <p>{patient.contactNumber || "N/A"}</p>
        </div>
        <div className={`${styles.detailCard} ${styles.addressCard}`}>
          <h4>Address</h4>
          <p>{patient.address || "N/A"}</p>
        </div>
      </div>

      <div className={styles.actionsSection}>
        {/* add and edit button */}
        <button className={styles.actionButton}>Add SOAP Note</button>
        <button className={styles.actionButton}>Edit Patient</button>
      </div>
    </div>
  );
}
