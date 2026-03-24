import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import SelectPatientCard from "@/components/patients/SelectPatient/SelectPatientCard";
import styles from "./select-patient.module.css";
import PageState from "@/components/ui/PageState/PageState";

export default function SelectPatient() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await PatientService.getAllPatients();
        setPatients(response.data);
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
          <title>Select Patient</title>
        </Head>
        <div className={styles.header}>
          <h1 className={styles.title}>New SOAP Note</h1>
          <p className={styles.subtitle}>Select a patient to begin documenting.</p>
        </div>
        {patients.length > 0 ? (
          <div className={styles.patientsList}>
            {patients.map((patient) => (
              <SelectPatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <p className={styles.noPatients}>No patients found in the system.</p>
        )}
      </div>
    </PageState>
  );
}

SelectPatient.auth = true;
