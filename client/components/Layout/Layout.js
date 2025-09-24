import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/authContext";
import Footer from "./Footer";
import styles from "./Layout.module.css";

const Navbar = () => {
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
        <button onClick={logout} className={styles.button}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>Treatment Record System</title>
        <meta name="description" content="A treatment record system built with Next.js" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Brian" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <Navbar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
