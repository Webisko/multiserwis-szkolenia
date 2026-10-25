import React from "react";

export type IndustrialIconName =
  | "forklift"
  | "excavator"
  | "sep"
  | "welding"
  | "bhp"
  | "clock"
  | "search"
  | "close"
  | "check"
  | "arrow-right"
  | "play";

interface Props {
  name: IndustrialIconName;
  className?: string;
}

export const IndustrialIcon: React.FC<Props> = ({ name, className = "w-5 h-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "forklift" && (
        <>
          <path d="M18 3v15h4" />
          <path d="M18 13h3" />
          <path d="M3 15V9a2 2 0 0 1 2-2h6l3 5v3H3Z" />
          <path d="M6 7V4h5v3" />
          <circle cx="6.5" cy="17.5" r="2.5" />
          <circle cx="13.5" cy="17.5" r="2.5" />
          <path d="M9 17.5h2" />
        </>
      )}
      {name === "excavator" && (
        <>
          <path d="M3 17h10a2 2 0 0 0 2-2v-3l-2.5-4H6a2 2 0 0 0-2 2v7Z" />
          <rect x="2" y="17" width="13" height="3.5" rx="1.75" />
          <path d="M13 10l4.5-5 4 2.5-2.5 5.5" />
          <path d="M17.5 13l3.5 1.5-1.5 3c-1.5.5-3-.5-3-2v-2.5Z" />
          <path d="M7 8v4h4" />
        </>
      )}
      {name === "sep" && (
        <path d="M13 2L4.5 13.5h6.5L10 22l9.5-11.5h-6.5L13 2Z" />
      )}
      {name === "welding" && (
        <>
          <path d="M12 22c4.5 0 7.5-3 7.5-7.2 0-4.5-4.5-7.8-6-11.8-1 3.5-4 5.5-4 8.5 0 1.5 1 2.5 2 2.5-.5-2 1-3.5 2-4.5 1 2 2.5 3.8 2.5 5.8 0 2.2-1.8 3.7-4 3.7s-3.5-1.5-3.5-3.5c0-1.2.4-2.3 1-3.2C6.8 13.8 5 16 5 18.2 5 20.5 8 22 12 22Z" />
          <path d="M4 5l2 2" />
          <path d="M8 2l.5 2.5" />
          <path d="M2 9l2.5.5" />
        </>
      )}
      {name === "bhp" && (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="M9 12l2 2 4-4" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      )}
      {name === "close" && (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      )}
      {name === "check" && <path d="M20 6 9 17l-5-5" />}
      {name === "arrow-right" && (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
      {name === "play" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
};
