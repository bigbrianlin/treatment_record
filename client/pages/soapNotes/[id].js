import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
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

  const isOwner = currentUser && note && (currentUser._id === note.therapist._id || currentUser.role === "admin");
  const patient = note?.patient;
  const fullName =
    patient?.firstname && patient?.lastname
      ? `${patient?.firstname} ${patient?.lastname}`
      : patient?.firstname || "Unknown Patient";

  const user = note?.therapist;
  const userFullName =
    user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.firstname || "Unknown Staff";

  return (
    <PageState isLoading={isLoading} error={error} data={note} noDataMsg="No SOAP note found.">
      <div className={styles.container}>
        <Head>
          <title>Note Details: {fullName}</title>
        </Head>

        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <h1>Patient: {fullName}</h1>
            <p>Medical Record Number: {note?.patient?.medicalRecordNumber}</p>
          </div>
          {isOwner && (
            <div className={styles.actionsSection}>
              <Link href={`/soapNotes/edit/${id}`} passHref className={styles.btnIconOutline} title="Edit Patient">
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
            </div>
          )}
        </div>

        <div className={styles.noteDetails}>
          <p>
            <strong>Treatment Date:</strong> {new Date(note?.treatmentDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Session Count:</strong> {note?.sessionCount}
          </p>
          <p>
            <strong>Diagnosis:</strong> {note?.disabilityCategory}
          </p>
          <p>
            <strong>SLP:</strong> {userFullName}
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
      </div>
    </PageState>
  );
}

SoapNoteDetail.auth = true;
