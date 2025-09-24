import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Treatment Record System. All Rights Reserved.</p>
    </footer>
  );
}
