import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
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

        {/* <div className={styles.topNav}>
          <Link href="/patients" className={styles.backLink}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Patient List
          </Link>
        </div> */}

        {/* Header */}
        <div className={styles.headerWrap}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.name}>{patient?.name || "N/A"}</h1>
              <p className={styles.mrn}>MRN: {patient?.medicalRecordNumber || "N/A"}</p>
            </div>

            <div className={styles.headerActions}>
              <Link href={`/patients/edit/${id}`} passHref className={styles.btnIconOutline} title="Edit Patient">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                className={styles.btnIconDanger}
                title={isDeleting ? "Deleting..." : "Delete Patient"}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Spinner size="small" />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                )}
              </button>
              <Link href={`/soapNotes/new/${id}`} passHref className={styles.btnIconPrimary} title="Add SOAP Note">
                <svg
                  width="22"
                  height="22"
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
          </div>
        </div>

        {/* Details Card */}
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>General Information</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Date of Birth</span>
              <span className={styles.value}>{new Date(patient?.birthDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{patient?.age} years old</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Gender</span>
              <span className={styles.value}>{patient?.gender}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Contact Number</span>
              <span className={styles.value}>{patient?.contactNumber || "N/A"}</span>
            </div>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.label}>Address</span>
              <span className={styles.value}>{patient?.address || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </PageState>
  );
}

PatientDetail.auth = true;
