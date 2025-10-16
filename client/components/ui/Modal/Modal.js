import React from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";

/**
 * Modal component
 * @param {object} props
 * @param {boolean} props.isOpen - controls whether the modal is open or closed
 * @param {function} props.onClose - function to call when closing the modal
 * @param {string} props.title - the title of the modal
 * @param {React.ReactNode} props.children - the content of the modal
 */
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    // 'portal' pattern could be used here for better accessibility
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
