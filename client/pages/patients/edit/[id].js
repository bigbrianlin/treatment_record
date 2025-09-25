import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import PageState from "@/components/ui/PageState/PageState";
import styles from "../new.module.css";

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        setIsLoading(true);
        try {
          const response = await PatientService.getPatientById(id);
          const patient = response.data;
          patient.birthDate = patient.birthDate ? patient.birthDate.split("T")[0] : "";
          setFormData(patient);
        } catch (err) {
          setError("Failed to fetch patient data. You may not have permission or the patient does not exist.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const updateData = {
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
    };

    try {
      await PatientService.updatePatient(id, updateData);
      alert("Patient updated successfully.");
      router.push(`/patients/${id}`);
    } catch (err) {
      setError("Failed to update patient. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <PageState isLoading={isLoading} error={error} data={formData} noDataMsg="No patient data found.">
      <div className={styles.container}>
        <Head>
          <title>Edit Patient: {formData?.name}</title>
        </Head>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.header}>
            <h1>Edit Patient</h1>
            <Link href={`/patients/${id}`} className={styles.backLink}>
              &larr; Back to Patient Details
            </Link>
          </div>

          {/* 表單欄位與 new.js 頁面幾乎相同 */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={formData?.name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="birthDate">Date of Birth</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData?.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData?.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? (
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
    </PageState>
  );
}
