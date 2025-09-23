import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import Button from "@/components/ui/Button/Button";
import styles from "./index.module.css";

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
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

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
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>All Patients</title>
        <meta name="description" content="List of all patients in the system." />
      </Head>

      <div className={styles.header}>
        <h1>Patients</h1>
        {/* 未來新增病患的按鈕 */}
        {/* <Link href="/patient/new" className={styles.newButton}>+ Add Patient</Link> */}
      </div>

      {/* 根據是否有病患資料來決定顯示列表或提示訊息 */}
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
  );
}
