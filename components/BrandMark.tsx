import React from "react";

export const MultiSerwisEmblem: React.FC<{ className?: string }> = ({
  className = "w-full h-full",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 215.25 213"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      transform="matrix(0.746388, 0.0387904, -0.0387904, 0.746388, 22.667593, -4.308565)"
      fill="none"
      strokeLinejoin="miter"
      d="M 23.70514 61.062752 C 88.201608 1.617793 152.695967 1.646833 217.198386 61.144111"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(0.572096, 0.480943, -0.480943, 0.572096, 39.832766, 27.664762)"
      fill="none"
      strokeLinejoin="miter"
      d="M 16.498401 16.499856 L 262.297368 16.498863"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(-0.747097, -0.0211284, 0.0211284, -0.747097, 195.863611, 216.068173)"
      fill="none"
      strokeLinejoin="miter"
      d="M 23.693011 64.961328 C 89.360518 0.319538 155.026848 0.34474 220.697519 65.047236"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(0.572399, 0.480583, -0.480583, 0.572399, 15.864842, 58.787771)"
      fill="none"
      strokeLinejoin="miter"
      d="M 16.497529 16.498899 L 174.894069 16.502823"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(0.578067, -0.47375, 0.47375, 0.578067, 141.691865, 104.468184)"
      fill="none"
      strokeLinejoin="miter"
      d="M 16.501648 16.49805 L 81.315506 16.502295"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(-0.0335867, -0.746641, 0.746641, -0.0335867, 2.676521, 156.398469)"
      fill="none"
      strokeLinejoin="miter"
      d="M 21.302331 22.130225 C 50.148174 14.617523 78.990668 14.622718 107.829577 22.151032"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(-0.0224359, 0.747059, -0.747059, -0.0224359, 215.48332, 59.708109)"
      fill="none"
      strokeLinejoin="miter"
      d="M 21.352238 22.081857 C 49.704086 14.631591 78.055025 14.637675 106.410437 22.105175"
      stroke="#ffffff"
      strokeWidth="32"
    />
    <path
      strokeLinecap="round"
      transform="matrix(0.549434, -0.506678, 0.506678, 0.549434, 91.588072, 151.143562)"
      fill="none"
      strokeLinejoin="miter"
      d="M 16.502923 16.50019 L 31.212682 16.500169"
      stroke="#ffffff"
      strokeWidth="32"
    />
  </svg>
);

interface BrandMarkProps {
  onClick?: () => void;
  variant?: "default" | "sidebar" | "dark";
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  onClick,
  variant = "default",
}) => {
  const wrapperClass =
    variant === "sidebar"
      ? "flex items-center gap-3 cursor-pointer group"
      : "flex items-center gap-2.5 cursor-pointer group";

  const logoBoxClass =
    variant === "sidebar"
      ? "w-10 h-10 bg-brand-accent rounded-sm flex items-center justify-center p-2 shadow-md shadow-orange-600/30 shrink-0 transform group-hover:rotate-45 transition-transform duration-300"
      : "w-10 h-10 bg-brand-accent rounded-sm flex items-center justify-center p-2 shadow-md shadow-orange-600/30 shrink-0 transform group-hover:rotate-45 transition-transform duration-300";

  const titleClass =
    variant === "sidebar"
      ? "text-2xl font-heading font-black text-white leading-none tracking-tight"
      : variant === "dark"
        ? "text-2xl font-heading font-black text-brand-dark leading-none tracking-tight"
        : "text-2xl font-heading font-black text-white leading-none tracking-tight";

  const subtitleClass =
    variant === "sidebar"
      ? "text-xs text-slate-400 font-semibold tracking-[0.15em] uppercase leading-none mt-1.5"
      : variant === "dark"
        ? "text-xs text-slate-500 font-semibold tracking-[0.15em] uppercase leading-none mt-1.5"
        : "text-xs text-slate-300 font-semibold tracking-[0.15em] uppercase leading-none mt-1.5";

  return (
    <div
      className={wrapperClass}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={logoBoxClass}>
        <div className="w-full h-full transform group-hover:-rotate-45 transition-transform duration-300 flex items-center justify-center">
          <MultiSerwisEmblem className="w-full h-full" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={titleClass}>
          MULTI<span className="text-brand-accent">SERWIS</span>
        </span>
        <span className={subtitleClass}>Kutno • Szkolenia</span>
      </div>
    </div>
  );
};
