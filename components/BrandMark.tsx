import React from "react";

interface BrandMarkProps {
  onClick?: () => void;
  variant?: "default" | "sidebar" | "dark";
}

// Keep image path logic local (matches Layout.tsx behavior)
const getImagePath = (filename: string) => filename;

export const BrandMark: React.FC<BrandMarkProps> = ({
  onClick,
  variant = "default",
}) => {
  const wrapperClass =
    variant === "sidebar"
      ? "flex items-center gap-3 cursor-pointer group"
      : "flex items-center gap-2 cursor-pointer group";

  const logoBoxClass =
    variant === "sidebar"
      ? "w-9 h-9 bg-brand-accent rounded-sm flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300 p-1"
      : "w-10 h-10 bg-brand-accent rounded-sm flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300 p-1";

  const titleClass =
    variant === "sidebar"
      ? "text-xl font-heading font-extrabold text-white leading-none tracking-tight"
      : variant === "dark"
        ? "text-2xl font-heading font-extrabold text-brand-dark leading-none tracking-tight"
        : "text-2xl font-heading font-extrabold text-white leading-none tracking-tight";

  const subtitleClass =
    variant === "sidebar"
      ? "text-[10px] text-slate-300 font-medium tracking-[0.2em] uppercase leading-none mt-1"
      : variant === "dark"
        ? "text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase leading-none mt-1"
        : "text-[10px] text-slate-300 font-medium tracking-[0.2em] uppercase leading-none mt-1";

  return (
    <div
      className={wrapperClass}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className={logoBoxClass}>
        <img
          src={getImagePath("logo.svg")}
          alt="MultiSerwis Logo"
          className="w-full h-full scale-[0.85] group-hover:scale-100 transform group-hover:-rotate-45 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col">
        <span className={titleClass}>
          MULTI<span className="text-brand-accent">SERWIS</span>
        </span>
        <span className={subtitleClass}>Profesjonalne Szkolenia</span>
      </div>
    </div>
  );
};
