import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminService from "@/services/admin.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./[id].module.css";
import PageState from "@/components/ui/PageState/PageState";

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await AdminService.getUserById(id);
          setUser(response);
        } catch (err) {
          setError("Failed to fetch user data. You may not have permission or the user does not exist.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const fullName =
    user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.firstname || "Unknown Staff";
  const statusText = user?.mustChangePassword ? "Pending" : "Active";

  return (
    <PageState isLoading={isLoading} error={error} data={user} noDataMsg="No user data found.">
      <div className={styles.container}>
        <Head>
          <title>UserDetail</title>
        </Head>

        <div className={styles.headerWrap}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.name}>{fullName}</h1>
              <p className={styles.mrn}>ID: {user?.username || "N/A"}</p>
            </div>

            {/* <div className={styles.headerActions}>
              <Link href={`/patients/edit/${id}`} passHref className={styles.btnIconOutline} title="Edit Patient">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                className={styles.btnIconDanger}
                title={isDeleting ? "Deleting..." : "Delete Patient"}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Spinner size="small" />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                )}
              </button>
              <Link href={`/soapNotes/new/${id}`} passHref className={styles.btnIconPrimary} title="Add SOAP Note">
                <svg
                  width="22"
                  height="22"
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
            </div> */}

            <div className={styles.infoCard}>
              <h2 className={styles.cardTitle}>General Information</h2>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{statusText}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>role</span>
                  <span className={styles.value}>{user?.role}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{user?.email || "N/A"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone Number</span>
                  <span className={styles.value}>{user?.phoneNumber || "N/A"}</span>
                </div>
                {/* <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <span className={styles.label}>Address</span>
                  <span className={styles.value}>{user?.address || "N/A"}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageState>
  );
}

UserDetail.auth = { requireAdmin: true };
