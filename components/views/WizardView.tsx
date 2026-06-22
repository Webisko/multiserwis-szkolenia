import React from "react";
import { SignUpWizard } from "../features/SignUpWizard";

interface WizardViewProps {
  setView: (view: any) => void;
}

const WizardView: React.FC<WizardViewProps> = ({ setView }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-slate-800 mb-2">
            Zapisz się na szkolenie
          </h1>
          <p className="text-slate-600">
            Wypełnij formularz w 4 prostych krokach.
          </p>
        </div>

        <SignUpWizard />

        <div className="text-center mt-8 text-sm text-slate-500">
          Masz pytania? Skontaktuj się z nami:{" "}
          <a
            href="tel:601308358"
            className="text-brand-primary font-bold hover:underline"
          >
            601 308 358
          </a>
        </div>
      </div>
    </div>
  );
};

export default WizardView;
