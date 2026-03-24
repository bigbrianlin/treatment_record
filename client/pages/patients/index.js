import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import PatientService from "@/services/patient.service";
import styles from "./index.module.css";
import PageState from "@/components/ui/PageState/PageState";
import PatientCard from "@/components/patients/PatientCard/PatientCard";
import Button from "@/components/ui/Button/Button";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const allPatientsResponse = await PatientService.getAllPatients();
        setPatients(allPatientsResponse.data);
      } catch (err) {
        setError("Failed to fetch patients. Please try again later.");
        console.error("Failed to fetch patients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  });

  return (
    <PageState isLoading={isLoading} error={error}>
      <div className={styles.container}>
        <Head>
          <title>Patients</title>
          <meta name="description" content="List of all patients in the system." />
        </Head>

        {patients.length > 0 ? (
          <div className={styles.patientsList}>
            {patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <p className={styles.noPatients}>No patients found in the system.</p>
        )}

        <Link href="/patients/new" passHref className={styles.addFloatingButton}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Link>
      </div>
    </PageState>
  );
}

Patients.auth = true;
