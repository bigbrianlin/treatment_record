import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoIcon from "../ui/Icons/LogoIcon";
import LogoutIcon from "../ui/Icons/LogoutIcon";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const isActive = (path) => router.pathname.startsWith(path);

  useEffect(() => {
    const handleScroll = () => {
      // If scrolled down more than 10 pixels, trigger the morphing effect
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Apply the 'scrolled' class conditionally based on state
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navbarContainer}>
        {/* Left Section */}
        <Link href={currentUser?.role === "admin" ? "/admin" : "/"} className={styles.logo}>
          <LogoIcon className={styles.logoIcon} />
          <span className={styles.logoText}>Treatment Record</span>
        </Link>

        {/* Middle Section: Navigation Links with Colored Dots */}
        <nav className={styles.navMenu}>
          {currentUser?.role === "admin" ? (
            <Link href="/admin/users" className={`${styles.navLink} ${isActive("/admin/users") ? styles.active : ""}`}>
              <span className={`${styles.dot} ${styles.dotBlue}`}></span>
              Staff Management
            </Link>
          ) : (
            <>
              <Link href="/patients" className={`${styles.navLink} ${isActive("/patients") ? styles.active : ""}`}>
                <span className={`${styles.dot} ${styles.dotBlue}`}></span>
                Patients
              </Link>
              <Link href="/soapNotes" className={`${styles.navLink} ${isActive("/soapNotes") ? styles.active : ""}`}>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                SOAP Notes
              </Link>
              <Link href="/profile" className={`${styles.navLink} ${isActive("/profile") ? styles.active : ""}`}>
                <span className={`${styles.dot} ${styles.dotOrange}`}></span>
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className={styles.accountActions}>
          <div className={styles.userInfo}>
            {/* <span className={styles.userName}>{currentUser?.username}</span> */}
            <span className={styles.roleBadge}>{currentUser?.role === "admin" ? "Admin" : "Therapist"}</span>
          </div>
          <button onClick={logout} className={styles.iconButton} title="Logout" aria-label="Logout">
            <LogoutIcon />
            {/* <img src="/favicon.ico" alt="Logout" width="20" height="20" /> */}
          </button>
        </div>
      </div>
    </header>
  );
}
