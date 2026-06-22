import React from "react";
import { BaseGallery } from "../features/BaseGallery";
import { StaffGrid } from "../features/StaffGrid";
import { Trophy, ShieldCheck, Users } from "lucide-react";

interface AboutViewProps {
  setView: (view: any) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ setView }) => {
  return (
    <div className="pb-16">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80')] bg-cover bg-center opacity-20 filter grayscale"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            O Nas
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Jesteśmy liderem w szkoleniach zawodowych i usługach dla przemysłu.
            Łączymy wiedzę teoretyczną z praktyką na najwyższym poziomie.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-16">
        {/* Stats / Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Certyfikowana Jakość</h3>
            <p className="text-sm text-slate-500">
              Posiadamy certyfikaty ISO oraz akredytacje UDT, co gwarantuje
              najwyższy standard nauczania.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <TypograhyIcon size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">15 Lat Doświadczenia</h3>
            <p className="text-sm text-slate-500">
              Przeszkoliliśmy tysiące operatorów, którzy z powodzeniem pracują w
              Polsce i za granicą.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Indywidualne Podejście</h3>
            <p className="text-sm text-slate-500">
              Dostosowujemy program szkoleń do potrzeb osób prywatnych oraz
              firm.
            </p>
          </div>
        </div>

        <StaffGrid />
        <BaseGallery />
      </div>
    </div>
  );
};

const TypograhyIcon = ({ size }: { size: number }) => <Trophy size={size} />;

export default AboutView;
