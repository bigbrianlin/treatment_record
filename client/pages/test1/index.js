import styles from "./index.module.css";

export default function Test1() {
  return (
    <div className={styles.info}>
      <p>Test 1 Page</p>
    </div>
  );
}

Test1.auth = true;
