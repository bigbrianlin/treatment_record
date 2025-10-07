import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import Button from "@/components/ui/Button/Button";
import styles from "./[id].module.css";
import PageState from "@/components/ui/PageState/PageState";

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // make sure we have an id and user is authenticated
    if (id) {
      const fetchPatient = async () => {
        try {
          const response = await PatientService.getPatientById(id);
          setPatient(response.data);
          console.log(response.data);
        } catch (err) {
          setError("Failed to fetch patient data. You may not have permission or the patient does not exist.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await PatientService.deletePatient(id);
        alert("Patient deleted successfully.");
        router.push("/patients");
      } catch (err) {
        setError("Failed to delete patient.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <PageState isLoading={isLoading} error={error} data={patient} noDataMsg="No patient data found.">
      <div className={styles.container}>
        <Head>
          <title>Patient: {patient?.name}</title>
        </Head>

        <div className={styles.header}>
          <div>
            <h1 className={styles.patientName}>{patient?.name}</h1>
            <p className={styles.mrn}>MRN: {patient?.medicalRecordNumber}</p>
          </div>

          <Link href="/patients" className={styles.backLink}>
            &larr; Back to Patient List
          </Link>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h4>Date of Birth</h4>
            <p>{new Date(patient?.birthDate).toLocaleDateString()}</p>
          </div>
          <div className={styles.detailCard}>
            <h4>Age</h4>
            <p>{patient?.age} years old</p>
          </div>
          <div className={styles.detailCard}>
            <h4>Gender</h4>
            <p>{patient?.gender}</p>
          </div>
          <div className={styles.detailCard}>
            <h4>Contact Number</h4>
            <p>{patient?.contactNumber || "N/A"}</p>
          </div>
          <div className={`${styles.detailCard} ${styles.addressCard}`}>
            <h4>Address</h4>
            <p>{patient?.address || "N/A"}</p>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <Link href={`/patients/edit/${id}`} passHref>
            <Button variant="secondary">Edit Patient</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner size="small" /> : null}
            {isDeleting ? "Deleting..." : "Delete Patient"}
          </Button>
          <Link href={`/soapNotes/new/${id}`} passHref>
            <Button variant="primary">Add SOAP Note</Button>
          </Link>
        </div>
      </div>
    </PageState>
  );
}

PatientDetail.auth = true;
