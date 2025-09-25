import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
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

  const handlePatientSelect = (patientId) => {
    router.push(`/soapNotes/new/${patientId}`);
  };

  return (
    <PageState isLoading={isLoading} error={error}>
      <div className={styles.container}>
        <Head>
          <title>Select Patient</title>
        </Head>
        <h1>Select a Patient to Create a SOAP Note</h1>
        <div className={styles.patientGrid}>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <button key={patient._id} onClick={() => handlePatientSelect(patient._id)} className={styles.patientCard}>
                <h3>{patient.name}</h3>
                <p>MRN: {patient.medicalRecordNumber}</p>
              </button>
            ))
          ) : (
            <p>No patients found.</p>
          )}
        </div>
      </div>
    </PageState>
  );
}

SelectPatient.auth = true;
