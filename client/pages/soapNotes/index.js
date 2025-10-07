import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import SoapNoteService from "@/services/soapNote.service";
import styles from "./index.module.css";
import NoteCard from "@/components/notes/NoteCard/NoteCard";
import Button from "@/components/ui/Button/Button";
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
          <title>My SOAP</title>
          <meta name="description" content="List of my SOAP." />
        </Head>

        <div className={styles.header}>
          <h1>My SOAP Notes</h1>
          <Link href="soapNotes/select-patient" passHref>
            <Button variant="primary">Add New Note</Button>
          </Link>
        </div>

        <div className={styles.notesGrid}>
          {notes.length > 0 ? (
            notes.map((note) => <NoteCard key={note._id} note={note} />)
          ) : (
            <p className={styles.noNotes}>You have no SOAP notes yet.</p>
          )}
        </div>
      </div>
    </PageState>
  );
}

SoapNotes.auth = true;
