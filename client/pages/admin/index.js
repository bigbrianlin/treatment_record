import styles from "./index.module.css";

export default function Test1() {
  return (
    <div className={styles.info}>
      <p>Admin Page</p>
    </div>
  );
}

Test1.auth = true;
