import Link from "next/link";
import styles from "./NoteCard.module.css";

// Added a theme prop with a default value, so you can color-code your notes if you want!
const NoteCard = ({ note, theme = "pink" }) => {
  const formattedDate = new Date(note.treatmentDate).toLocaleDateString();

  return (
    <Link href={`/soapNotes/${note._id}`} className={`${styles.cardBase} ${styles[theme]}`}>
      <div className={styles.cardTop}>
        <h3 className={styles.title}>{note.patient?.name || "Unknown Patient"}</h3>
        <p className={styles.subtitle}>MRN: {note.patient?.medicalRecordNumber || "N/A"}</p>

        {/* Tags area: Used for Therapist or other statuses */}
        <div className={styles.tagsContainer}>
          <span className={styles.tag}>Therapist: {note.therapist?.username || "N/A"}</span>
        </div>
      </div>

      {/* Bottom colored layer: Used for the date */}
      <div className={styles.cardFooter}>DATE: {formattedDate}</div>
    </Link>
  );
};

export default NoteCard;
