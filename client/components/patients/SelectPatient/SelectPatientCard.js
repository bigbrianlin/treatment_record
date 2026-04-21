import Link from "next/link";
import styles from "./SelectPatientCard.module.css";

export default function SelectPatientCard({ patient }) {
  const formattedDate = new Date(patient.birthDate).toLocaleDateString();
  const fullName =
    patient.firstname && patient.lastname
      ? `${patient.firstname} ${patient.lastname}`
      : patient.firstname || "Unknown Patient";

  return (
    <Link href={`/soapNotes/new/${patient._id}`} className={styles.patientCard}>
      <div className={styles.topLine}></div>
      <div className={styles.contentContainer}>
        {/* Patient Info Area */}
        <div className={styles.infoWrapper}>
          <h3 className={styles.name}>{fullName}</h3>
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
