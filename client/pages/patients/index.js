import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import PatientService from "@/services/patient.service";
import styles from "./index.module.css";
import PageState from "@/components/ui/PageState/PageState";

const PatientCard = ({ patient }) => (
  <Link href={`/patients/${patient._id}`} className={styles.card}>
    <h3>{patient.name}</h3>
    <p>
      <strong>MRN:</strong> {patient.medicalRecordNumber}
    </p>
    <p>
      <strong>DOB:</strong> {new Date(patient.birthDate).toLocaleDateString()}
    </p>
  </Link>
);

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
          <title>All Patients</title>
          <meta name="description" content="List of all patients in the system." />
        </Head>

        <div className={styles.header}>
          <h1>Patients</h1>
          <Link href="/patients/new" className={styles.newButton}>
            Add Patient
          </Link>
        </div>
        {patients.length > 0 ? (
          <div className={styles.patientsGrid}>
            {patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <p className={styles.noPatients}>No patients found in the system.</p>
        )}
      </div>
    </PageState>
  );
}

Patients.auth = true;
