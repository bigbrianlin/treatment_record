import React from "react";
import styles from "./Button.module.css";

/**
 * button component
 * @param {object} props
 * @param {React.ReactNode} props.children - content to be displayed inside the button
 * @param {function} props.onClick - click event handler
 * @param {string} [props.type='button'] - type (button, submit, reset)
 * @param {string} [props.size='medium'] - size (small, medium, large)
 * @param {string} [props.variant='primary'] - variant (primary, secondary, danger)
 * @param {boolean} [props.disabled=false] - disabled state
 */
export default function Button({
  children,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  size = "medium",
  variant = "primary",
  disabled = false,
  ...props // allow passing other button attributes like id, aria-*, etc.
}) {
  // Combine base button class with size and variant classes
  // e.g., "button medium primary"
  const buttonClasses = [styles.button, styles[size], styles[variant]].join(" ");

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled} {...props}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
