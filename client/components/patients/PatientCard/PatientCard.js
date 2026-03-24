import Link from "next/link";
import styles from "./PatientCard.module.css";

export default function PatientCard({ patient }) {
  const formattedDate = new Date(patient.birthDate).toLocaleDateString();

  return (
    <Link href={`/patients/${patient._id}`} className={styles.patientCard}>
      <div className={styles.topLine}></div>
      <div className={styles.contentContainer}>
        {/* Patient Info Area */}
        <div className={styles.infoWrapper}>
          <h3 className={styles.name}>{patient.name || "Unknown Patient"}</h3>
          <div className={styles.details}>
            <span>{patient.medicalRecordNumber}</span>
            <sapn>DOB: {formattedDate}</sapn>
          </div>
        </div>
        <div className={styles.actionIcon}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
}
