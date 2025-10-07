import Link from "next/link";
import styles from "./PatientCard.module.css";

export default function PatientCard({ patient }) {
  return (
    <Link href={`/patients/${patient._id}`} className={styles.card}>
      <h3>{patient.name}</h3>
      <p>
        <strong>MRN:</strong> {patient.medicalRecordNumber}
      </p>
      <p>
        <strong>DOB:</strong> {new Date(patient.birthDate).toLocaleDateString()}
      </p>
    </Link>
  );
}
