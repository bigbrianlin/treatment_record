import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "../new/[id].module.css";
import PageState from "@/components/ui/PageState/PageState";
import Modal from "@/components/ui/Modal/Modal";
import TiptapEditor from "@/components/editor/TiptapEditor";
import Button from "@/components/ui/Button/Button";

// for displaying rich text content
const DisplayBox = ({ title, content, onClick }) => {
  // Tiptap content might be "<p></p>"
  const isEmpty = !content || content === "<p></p>";

  return (
    <div className={styles.inputGroup}>
      <label>{title}</label>
      <div
        className={`${styles.displayBox} ${isEmpty ? styles.placeholder : ""}`}
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content || "<p>Click to edit...</p>" }}
      />
    </div>
  );
};

export default function EditSoapNote() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [tempContent, setTempContent] = useState("");

  useEffect(() => {
    if (id) {
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

  return (
    <PageState isLoading={isLoading} error={error} data={formData} noDataMsg="No SOAP note data found.">
      <div className={styles.container}>
        <Head>
          <title>Edit SOAP Note for {formData?.patient.name}</title>
        </Head>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.header}>
            <h1>Edit SOAP Note</h1>
            <p className={styles.patientInfo}>
              For Patient: <strong>{formData?.patient.name}</strong> (MRN: {formData?.patient.medicalRecordNumber})
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="disabilityCategory">Disability Category</label>
            <input
              id="disabilityCategory"
              name="disabilityCategory"
              type="text"
              value={formData?.disabilityCategory}
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
              value={formData?.sessionCount}
              onChange={handleChange}
              required
            />
          </div>

          <DisplayBox
            title="Subjective (S)"
            content={formData?.subjective}
            onClick={() => handleEditClick("subjective")}
          />
          <DisplayBox
            title="Objective (O)"
            content={formData?.objective}
            onClick={() => handleEditClick("objective")}
          />
          <DisplayBox
            title="Assessment (A)"
            content={formData?.assessment}
            onClick={() => handleEditClick("assessment")}
          />
          <DisplayBox title="Plan (P)" content={formData?.plan} onClick={() => handleEditClick("plan")} />

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

EditSoapNote.auth = true;
