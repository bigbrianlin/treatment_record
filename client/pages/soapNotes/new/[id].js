import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./[id].module.css";
import PageState from "@/components/ui/PageState/PageState";

export default function NewSoapNote() {
  const router = useRouter();
  const { id } = router.query; // get the patient ID from the URL

  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    disabilityCategory: "",
    sessionCount: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await PatientService.getPatientById(id);
        setPatient(response.data);
      } catch (err) {
        setError("Failed to fetch patient data. You may not have permission or the patient does not exist.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const noteData = {
      ...formData,
      patient: id,
      treatmentDate: new Date(),
    };

    try {
      const response = await SoapNoteService.createSoapNote(noteData);
      alert("SOAP Note created successfully!");

      router.push(`/soapNotes/${response.data.populatedSoapNote._id}`);
    } catch (err) {
      setError(err.response?.data || "Failed to create SOAP Note.");
      setIsLoading(false);
    }
  };

  return (
    <PageState isLoading={isLoading} error={error} data={patient} noDataMsg="No patient data found.">
      <div className={styles.container}>
        <Head>
          <title>New SOAP Note for {patient?.name}</title>
        </Head>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.header}>
            <div>
              <h1>New SOAP Note</h1>
              <p className={styles.patientInfo}>
                For Patient: <strong>{patient?.name}</strong> (MRN: {patient?.medicalRecordNumber})
              </p>
            </div>
            <Link href={`/patients/${id}`} className={styles.backLink}>
              Back to Patient
            </Link>
          </div>

          {/* SOAP 表單欄位 */}
          <div className={styles.inputGroup}>
            <label htmlFor="disabilityCategory">Disability Category</label>
            <input
              id="disabilityCategory"
              name="disabilityCategory"
              type="text"
              value={formData.disabilityCategory}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="sessionCount">Session Count</label>
            <input
              id="sessionCount"
              name="sessionCount"
              type="number"
              min="1"
              value={formData.sessionCount}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subjective">Subjective (S)</label>
            <textarea
              id="subjective"
              name="subjective"
              rows="4"
              value={formData.subjective}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="objective">Objective (O)</label>
            <textarea
              id="objective"
              name="objective"
              rows="4"
              value={formData.objective}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="assessment">Assessment (A)</label>
            <textarea
              id="assessment"
              name="assessment"
              rows="4"
              value={formData.assessment}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="plan">Plan (P)</label>
            <textarea id="plan" name="plan" rows="4" value={formData.plan} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? (
              <>
                <Spinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              "Create SOAP"
            )}
          </button>
        </form>
      </div>
    </PageState>
  );
}

NewSoapNote.auth = true;
