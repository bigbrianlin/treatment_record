import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminService from "@/services/admin.service";
import styles from "./index.module.css";
import PageState from "@/components/ui/PageState/PageState";
import UserCard from "@/components/admin/UserCard/UserCard";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await AdminService.getAllUsers();
        setUsers(users);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to load users. Please try again later.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <PageState isLoading={isLoading} error={error}>
      <div className={styles.container}>
        <Head>
          <title>Users</title>
        </Head>

        {users.length > 0 ? (
          <div className={styles.patientsList}>
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className={styles.noPatients}>No users found in the system.</p>
        )}

        <Link href="/admin/users/new" passHref className={styles.addFloatingButton}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Link>
      </div>
    </PageState>
  );
}

Users.auth = { requireAdmin: true };
