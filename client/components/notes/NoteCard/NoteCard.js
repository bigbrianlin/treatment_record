import Link from "next/link";
import styles from "./NoteCard.module.css";

const NoteCard = ({ note, theme = "pink" }) => {
  const formattedDate = new Date(note.treatmentDate).toLocaleDateString();
  const patient = note.patient;
  const patientFullName =
    patient.firstname && patient.lastname
      ? `${patient.firstname} ${patient.lastname}`
      : patient.firstname || "Unknown Patient";
  const user = note.therapist;
  const userFullName =
    user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.firstname || "Unknown Staff";

  return (
    <Link href={`/soapNotes/${note._id}`} className={`${styles.cardBase} ${styles[theme]}`}>
      <div className={styles.cardTop}>
        <h3 className={styles.title}>{patientFullName}</h3>
        <p className={styles.subtitle}>MRN: {note.patient?.medicalRecordNumber || "N/A"}</p>

        {/* Tags area: Used for Therapist or other statuses */}
        <div className={styles.tagsContainer}>
          <span className={styles.tag}>Therapist: {userFullName}</span>
        </div>
      </div>

      {/* Bottom colored layer: Used for the date */}
      <div className={styles.cardFooter}>DATE: {formattedDate}</div>
    </Link>
  );
};

export default NoteCard;
