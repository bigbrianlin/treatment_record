import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import SoapNoteService from "@/services/soapNote.service";
import styles from "./index.module.css";
import NoteCard from "@/components/notes/NoteCard/NoteCard";
import PageState from "@/components/ui/PageState/PageState";

export default function SoapNotes() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  });

  return (
    <PageState isLoading={isLoading} error={error}>
      <div className={styles.container}>
        <Head>
          <title>SOAP Notess</title>
          <meta name="description" content="List of my SOAP Notes." />
        </Head>

        <div className={styles.notesGrid}>
          {notes.length > 0 ? (
            notes.map((note) => <NoteCard key={note._id} note={note} />)
          ) : (
            <p className={styles.noNotes}>You have no SOAP notes yet.</p>
          )}
        </div>

        <Link href="/soapNotes/select-patient" passHref className={styles.addFloatingButton}>
          <svg
            width="28"
            height="28"
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
    </PageState>
  );
}

SoapNotes.auth = true;
