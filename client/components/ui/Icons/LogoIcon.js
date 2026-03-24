import React from "react";

export default function LogoIcon({ className }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Define the gradient palette in <defs> */}
      <defs>
        {/* x1, y1 to x2, y2 controls the direction (e.g., top-left to bottom-right) */}
        <linearGradient id="myMedicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3AE71" />
          <stop offset="50%" stopColor="#E39971" />
          <stop offset="100%" stopColor="#E39494" />
        </linearGradient>
      </defs>

      {/* Apply the gradient using url(#id) in the stroke attribute */}
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="url(#myMedicalGradient)"></polyline>
    </svg>
  );
}
