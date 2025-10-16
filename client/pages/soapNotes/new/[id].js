import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./[id].module.css";
import PageState from "@/components/ui/PageState/PageState";

import Modal from "@/components/ui/Modal/Modal";
import TiptapEditor from "@/components/editor/TiptapEditor";
import Button from "@/components/ui/Button/Button";

// for displaying rich text content
const DisplayBox = ({ title, content, onClick }) => (
  <div className={styles.inputGroup}>
    <label>{title}</label>
    <div
      className={styles.displayBox}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: content || "<p>Click to edit...</p>" }}
    />
  </div>
);

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

  const [editingField, setEditingField] = useState(null);
  const [tempContent, setTempContent] = useState("");

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

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempContent(formData[field]);
  };

  const handleSaveContent = () => {
    setFormData({ ...formData, [editingField]: tempContent });
    setEditingField(null);
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

          {/* SOAP */}
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

          {/* <div className={styles.inputGroup}>
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
          </div> */}

          <DisplayBox
            title="Subjective (S)"
            content={formData.subjective}
            onClick={() => handleEditClick("subjective")}
          />
          <DisplayBox title="Objective (O)" content={formData.objective} onClick={() => handleEditClick("objective")} />
          <DisplayBox
            title="Assessment (A)"
            content={formData.assessment}
            onClick={() => handleEditClick("assessment")}
          />
          <DisplayBox title="Plan (P)" content={formData.plan} onClick={() => handleEditClick("plan")} />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save SOAP Note"}
          </Button>
        </form>

        {/* Modal */}
        <Modal isOpen={!!editingField} onClose={() => setEditingField(null)} title={`Edit ${editingField}`}>
          <TiptapEditor value={tempContent} onChange={setTempContent} />
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <Button variant="secondary" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContent}>Save Content</Button>
          </div>
        </Modal>
      </div>
    </PageState>
  );
}

NewSoapNote.auth = true;
