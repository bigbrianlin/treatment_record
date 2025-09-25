import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PatientService from "@/services/patient.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./new.module.css";

export default function NewPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "male",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { name, birthDate, gender } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await PatientService.createPatient(formData);
      router.push(`/patients/${response.data.savedPatient._id}`);
    } catch (err) {
      setError("Failed to create patient. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Add New Patient</title>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <h1>Add New Patient</h1>
          <Link href="/patients" className={styles.backLink}>
            &larr; Back to List
          </Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={name} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="birthDate">Date of Birth</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date" // use date input for better UX
            value={birthDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* <div className={styles.inputGroup}>
          <label htmlFor="contactNumber">Contact Number (Optional)</label>
          <input id="contactNumber" name="contactNumber" type="tel" value={contactNumber} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="address">Address (Optional)</label>
          <textarea id="address" name="address" rows="3" value={address} onChange={handleChange}></textarea>
        </div> */}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? (
            <>
              <Spinner size="small" />
              <span>Saving...</span>
            </>
          ) : (
            "Create Patient"
          )}
        </button>
      </form>
    </div>
  );
}

NewPatient.auth = true;
