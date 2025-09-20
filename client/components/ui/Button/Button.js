import React from "react";
import styles from "./Button.module.css";

/**
 * 一個可重複使用的按鈕元件
 * @param {object} props
 * @param {React.ReactNode} props.children - 按鈕內顯示的內容 (文字或圖示)
 * @param {function} props.onClick - 點擊時觸發的函式
 * @param {string} [props.type='button'] - 按鈕的類型 (button, submit, reset)
 * @param {string} [props.size='medium'] - 按鈕的大小 (small, medium, large)
 * @param {string} [props.variant='primary'] - 按鈕的樣式 (primary, secondary, danger)
 * @param {boolean} [props.disabled=false] - 是否禁用按鈕
 */
export default function Button({
  children,
  onClick,
  type = "button",
  size = "medium",
  variant = "primary",
  disabled = false,
  ...props // 允許傳入其他原生 button 屬性，例如 aria-label
}) {
  // 根據傳入的 props 動態組合 CSS class
  // 例如：'button medium primary'
  const buttonClasses = [styles.button, styles[size], styles[variant]].join(" ");

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
