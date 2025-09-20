import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./select-patient.module.css";

export default function SelectPatient() {
  const router = useRouter();
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      router.push("/login");
      return;
    }
    if (currentUser) {
      PatientService.getAllPatients()
        .then((response) => setPatients(response.data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [currentUser, isAuthLoading, router]);

  const handlePatientSelect = (patientId) => {
    router.push(`/soapNotes/new/${patientId}`);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }
  return (
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
  );
}
