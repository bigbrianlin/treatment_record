import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import styles from "./soapNoteDetail.module.css";

export default function SoapNoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // make sure id and currentUser are available
    if (id && currentUser) {
      const fetchNote = async () => {
        try {
          const response = await SoapNoteService.getSoapNoteById(id);
          setNote(response.data);
        } catch (err) {
          setError("Failed to fetch SOAP note. Please try again later.");
          console.error("Failed to fetch SOAP note:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNote();
    }
  }, [id, currentUser]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!note) return <div>No SOAP note found.</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Note Details: {note.patient?.name}</title>
      </Head>

      <div className={styles.header}>
        <h1>Patient: {note.patient.name}</h1>
        <p>Medical Record Number: {note.patient.medicalRecordNumber}</p>
      </div>

      <div className={styles.noteDetails}>
        <p>
          <strong>Treatment Date:</strong> {new Date(note.treatmentDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Session Count:</strong> Session #{note.sessionCount}
        </p>
        <p>
          <strong>Diagnosis:</strong> {note.disabilityCategory}
        </p>
        <p>
          <strong>SLP:</strong> {note.therapist.username}
        </p>
      </div>

      <div className={styles.soapSection}>
        <h2>Subjective</h2>
        <p>{note.subjective}</p>
      </div>
      <div className={styles.soapSection}>
        <h2>Objective</h2>
        <p>{note.objective}</p>
      </div>
      <div className={styles.soapSection}>
        <h2>Assessment</h2>
        <p>{note.assessment}</p>
      </div>
      <div className={styles.soapSection}>
        <h2>Plan</h2>
        <p>{note.plan}</p>
      </div>

      <Link href="/soapNotes" className={styles.backLink}>
        &larr; Back to List
      </Link>
    </div>
  );
}
