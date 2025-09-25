import { useAuth } from "@/context/authContext";
import Link from "next/link";
import Button from "../ui/Button/Button";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Treatment Record System
      </Link>
      <nav className={styles.nav}>
        <span className={styles.userInfo}>
          Hi, {currentUser.username} ({currentUser.role === "leader" ? "Leader" : "Member"})
        </span>

        <Button onClick={logout} variant="primary">
          Logout
        </Button>
      </nav>
    </header>
  );
}
