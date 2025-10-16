import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import Button from "@/components/ui/Button/Button";
import styles from "./[id].module.css";
import PageState from "@/components/ui/PageState/PageState";

export default function SoapNoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // make sure id and currentUser are available
    if (id) {
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
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this SOAP note?")) {
      setIsDeleting(true);
      try {
        await SoapNoteService.deleteSoapNote(id);
        alert("SOAP note deleted successfully.");
        router.push("/soapNotes");
      } catch (err) {
        setError("Failed to delete SOAP note. Please try again.");
        console.error("Failed to delete SOAP note:", err);
        setIsDeleting(false);
      }
    }
  };

  const isOwner = currentUser && note && (currentUser._id === note.therapist._id || currentUser.role === "leader");

  return (
    <PageState isLoading={isLoading} error={error} data={note} noDataMsg="No SOAP note found.">
      <div className={styles.container}>
        <Head>
          <title>Note Details: {note?.patient?.name}</title>
        </Head>

        <div className={styles.header}>
          <h1>Patient: {note?.patient?.name}</h1>
          <p>Medical Record Number: {note?.patient?.medicalRecordNumber}</p>
        </div>

        <div className={styles.noteDetails}>
          <p>
            <strong>Treatment Date:</strong> {new Date(note?.treatmentDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Session Count:</strong> Session #{note?.sessionCount}
          </p>
          <p>
            <strong>Diagnosis:</strong> {note?.disabilityCategory}
          </p>
          <p>
            <strong>SLP:</strong> {note?.therapist.username}
          </p>
        </div>

        <div className={styles.soapSection}>
          <h2>Subjective</h2>
          <div dangerouslySetInnerHTML={{ __html: note?.subjective }} />
        </div>
        <div className={styles.soapSection}>
          <h2>Objective</h2>
          <div dangerouslySetInnerHTML={{ __html: note?.objective }} />
        </div>
        <div className={styles.soapSection}>
          <h2>Assessment</h2>
          <div dangerouslySetInnerHTML={{ __html: note?.assessment }} />
        </div>
        <div className={styles.soapSection}>
          <h2>Plan</h2>
          <div dangerouslySetInnerHTML={{ __html: note?.plan }} />
        </div>

        {isOwner && (
          <div className={styles.actionsSection}>
            <Link href={`/soapNotes/edit/${id}`} passHref>
              <Button variant="secondary">Edit Note</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner size="small" /> : null}
              {isDeleting ? "Deleting..." : "Delete Note"}
            </Button>
          </div>
        )}

        <Link href="/soapNotes" className={styles.backLink}>
          &larr; Back to List
        </Link>
      </div>
    </PageState>
  );
}

SoapNoteDetail.auth = true;
