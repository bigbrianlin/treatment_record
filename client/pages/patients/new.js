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
    firstname: "",
    lastname: "",
    birthDate: "",
    gender: "male",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { firstname, lastname, birthDate, gender, email, phone } = formData;

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
          <label htmlFor="firstname">Firstname</label>
          <input id="firstname" name="firstname" type="text" value={firstname} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastname">Lastname</label>
          <input id="lastname" name="lastname" type="text" value={lastname} onChange={handleChange} />
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
          <label>Gender</label>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={handleChange}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={handleChange}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                checked={gender === "other"}
                onChange={handleChange}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="text" value={email} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" value={phone} onChange={handleChange} />
        </div>

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
