import Link from "next/link";
import styles from "./FeatureCard.module.css";

/**
 * FeatureCard component
 * @param {object} props
 * @param {string} props.href - link URL
 * @param {string} props.title - card title
 * @param {string} props.description - card description
 */

export default function FeatureCard({ href, title, description }) {
  return (
    <Link href={href} className={styles.card}>
      <h2>{title} &rarr;</h2>
      <p>{description}</p>
    </Link>
  );
}
