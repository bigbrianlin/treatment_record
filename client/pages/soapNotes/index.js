import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import styles from "./index.module.css";
import Spinner from "@/components/ui/Spinner/Spinner";

// Need to fix the NoteCard component to show more details
const NoteCard = ({ note }) => (
  <Link href={`/soapNotes/${note._id}`} className={styles.card}>
    <h3>Patient: {note.patient?.name || "N/A"}</h3>
    <p>MRN: {note.patient?.medicalRecordNumber || "N/A"}</p>
    <p>Date: {new Date(note.treatmentDate).toLocaleDateString()}</p>
    <p>Therapist: {note.therapist?.username || "N/A"}</p>
  </Link>
);

export default function SoapNotes() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const myNotesResponse = await SoapNoteService.getMySoapNotes();
        setNotes(myNotesResponse.data);
      } catch (err) {
        setError("Failed to fetch SOAP notes. Please try again later.");
        console.error("Failed to fetch SOAP notes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
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
    <div>
      <Head>
        <title>My SOAP</title>
      </Head>

      <div className={styles.header}>
        <h1>SOAP</h1>
        {/* add button*/}
        {/* <Link href="/soapNote/new" className={styles.newButton}>add</Link> */}
      </div>
      <div className={styles.notesGrid}>
        {notes.length === 0 ? (
          <p>No SOAP notes found.</p>
        ) : (
          notes.map((note) => <NoteCard key={note._id} note={note} />)
        )}
      </div>
    </div>
  );
}
