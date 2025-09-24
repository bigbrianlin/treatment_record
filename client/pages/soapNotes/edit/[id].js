import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import Button from "@/components/ui/Button/Button";
import styles from "../new/[id].module.css";

export default function EditSoapNote() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && currentUser) {
      const fetchNote = async () => {
        setIsLoading(true);
        try {
          const response = await SoapNoteService.getSoapNoteById(id);
          const note = response.data;
          setFormData(note);
        } catch (err) {
          setError("Failed to fetch SOAP note data. You may not have permission or the note does not exist.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNote();
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const updateData = {
      disabilityCategory: formData.disabilityCategory,
      sessionCount: formData.sessionCount,
      subjective: formData.subjective,
      objective: formData.objective,
      assessment: formData.assessment,
      plan: formData.plan,
    };

    try {
      await SoapNoteService.updateSoapNote(id, updateData);
      alert("SOAP note updated successfully.");
      router.push(`/soapNotes/${id}`);
    } catch (err) {
      setError("Failed to update SOAP note. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !formData) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit SOAP Note for {formData.patient.name}</title>
      </Head>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <h1>Edit SOAP Note</h1>
          <p className={styles.patientInfo}>
            For Patient: <strong>{formData.patient.name}</strong> (MRN: {formData.patient.medicalRecordNumber})
          </p>
        </div>

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

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? (
            <>
              <Spinner size="small" />
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
