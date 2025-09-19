import Link from "next/link";
import styles from "./NoteCard.module.css";

const NoteCard = ({ note }) => (
  <Link href={`/soap-note/${note._id}`} className={styles.card}>
    <h3>Patient: {note.patient?.name || "N/A"}</h3>
    <p>MRN: {note.patient?.medicalRecordNumber || "N/A"}</p>
    <p>Date: {new Date(note.treatmentDate).toLocaleDateString()}</p>
    <p>Therapist: {note.therapist?.username || "N/A"}</p>
  </Link>
);

export default NoteCard;
