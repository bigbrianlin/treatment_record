import styles from "./Spinner.module.css";

/**
 * A simple loading spinner component.
 * @param {{size?: 'small' | 'medium' | 'large'}} props
 * - size: The size of the spinner. Can be 'small', 'medium', or 'large'. Default is 'medium'.
 */
const Spinner = ({ size = "medium" }) => {
  const spinnerClassName = `${styles.spinner} ${styles[size]}`;
  return <div className={spinnerClassName}></div>;
};

export default Spinner;
