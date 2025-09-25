import React from "react";
import Spinner from "../Spinner/Spinner";
import styles from "./PageState.module.css";

/**
 * displays loading spinner, error message, or children based on state
 * @param {object} props
 * @param {boolean} props.isLoading - is loading state
 * @param {string | null} props.error - error message if any
 * @param {any} props.data - data to check for no data condition
 * @param {string} [props.noDataMsg="No data found."] - message to show when no data
 * @param {React.ReactNode} props.children - content to render when not loading or error
 */
export default function PageState({ isLoading, error, data, noDataMsg = "No data found.", children }) {
  // status one: loading
  if (isLoading) {
    return (
      <div className={styles.fullPageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

  // status two: error
  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  // status three: no data
  // if data is defined and is either falsy or an empty array
  if (data !== undefined && (!data || (Array.isArray(data) && data.length === 0))) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>{noDataMsg}</p>
      </div>
    );
  }

  // status four: normal content
  return <>{children}</>;
}
