import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import styles from "./index.module.css";
import Spinner from "@/components/ui/Spinner/Spinner";
import NoteCard from "@/components/notes/NoteCard/NoteCard";
import Button from "@/components/ui/Button/Button";

export default function SoapNotes() {
  const router = useRouter();
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading || !currentUser) {
      if (!isAuthLoading) setIsLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await SoapNoteService.getMySoapNotes();
        setNotes(response.data);
      } catch (err) {
        setError("Failed to fetch SOAP notes. Please try again later.");
        console.error("Failed to fetch SOAP notes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [currentUser, isAuthLoading]);

  if (isAuthLoading || isLoading) {
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
        <h1>My SOAP Notes</h1>
        <Button variant="primary" onClick={() => router.push("/soapNotes/select-patient")}>
          Add New Note
        </Button>
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
