import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

const SectionHeader: React.FC<Props> = ({
  title,
  subtitle,
  light = false,
  centered = false,
}) => {
  if (centered) {
    return (
      <div className="mb-12 text-center">
        {subtitle && (
          <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-2 block">
            {subtitle}
          </span>
        )}
        <h2
          className={`text-3xl md:text-4xl font-heading font-extrabold uppercase relative inline-block ${light ? "text-white" : "text-brand-primary"}`}
        >
          {title}
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-brand-accent"></span>
        </h2>
      </div>
    );
  }

  // Default left-aligned style
  return (
    <div className="mb-10">
      {subtitle && (
        <div className="text-xs font-bold text-brand-secondary uppercase tracking-widest mb-2">
          {subtitle}
        </div>
      )}
      <h2
        className={`text-3xl md:text-4xl font-heading font-extrabold ${light ? "text-white" : "text-brand-dark"}`}
      >
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;
