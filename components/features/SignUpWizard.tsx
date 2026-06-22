import React, { useState } from "react";
import { COURSES } from "../../constants";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  User,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const STEPS = [
  { number: 1, title: "Kategoria", icon: GraduationCap },
  { number: 2, title: "Szkolenie", icon: Check },
  { number: 3, title: "Termin", icon: Calendar },
  { number: 4, title: "Dane", icon: User },
  { number: 5, title: "Gotowe", icon: CreditCard },
];

export const SignUpWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    courseId: "",
    date: "",
    user: { name: "", email: "", phone: "", nip: "" },
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const categories = Array.from(new Set(COURSES.map((c) => c.category)));

  const filteredCourses = formData.category
    ? COURSES.filter((c) => c.category === formData.category)
    : [];

  const selectedCourse = COURSES.find((c) => c.id === formData.courseId);

  // Mock dates for now
  const availableDates = [
    "2025-06-15",
    "2025-06-20",
    "2025-06-25",
    "2025-07-01",
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFormData({ ...formData, category: cat });
                  handleNext();
                }}
                className={`p-6 rounded-lg border-2 text-center transition-all ${
                  formData.category === cat
                    ? "border-brand-accent bg-brand-accent/5"
                    : "border-slate-200 hover:border-brand-accent/50"
                }`}
              >
                <span className="font-bold text-lg block">{cat}</span>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  setFormData({ ...formData, courseId: course.id });
                  handleNext();
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                  formData.courseId === course.id
                    ? "border-brand-accent bg-brand-accent/5"
                    : "border-slate-200 hover:border-brand-accent/50"
                }`}
              >
                <span className="font-bold">{course.title}</span>
                <span className="text-brand-primary font-bold">
                  {course.price}
                </span>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  setFormData({ ...formData, date: date });
                  handleNext();
                }}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  formData.date === date
                    ? "border-brand-accent bg-brand-accent/5"
                    : "border-slate-200 hover:border-brand-accent/50"
                }`}
              >
                <Calendar className="mx-auto mb-2 text-slate-400" />
                <span className="font-bold block">{date}</span>
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Imię i Nazwisko"
              className="w-full p-3 border border-slate-300 rounded focus:border-brand-accent outline-none"
              value={formData.user.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  user: { ...formData.user, name: e.target.value },
                })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-slate-300 rounded focus:border-brand-accent outline-none"
              value={formData.user.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  user: { ...formData.user, email: e.target.value },
                })
              }
            />
            <input
              type="tel"
              placeholder="Telefon"
              className="w-full p-3 border border-slate-300 rounded focus:border-brand-accent outline-none"
              value={formData.user.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  user: { ...formData.user, phone: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="NIP (opcjonalnie)"
              className="w-full p-3 border border-slate-300 rounded focus:border-brand-accent outline-none"
              value={formData.user.nip}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  user: { ...formData.user, nip: e.target.value },
                })
              }
            />
          </div>
        );
      case 5:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Dziękujemy za zapis!</h3>
            <p className="text-slate-600 mb-6">
              Twoje zgłoszenie na szkolenie{" "}
              <strong>{selectedCourse?.title}</strong> zostało przyjęte.
            </p>
            <p className="text-sm text-slate-500">
              Na podany adres email ({formData.user.email}) wysłaliśmy
              potwierdzenie oraz dane do płatności.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      {/* Header / Steps */}
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <div className="flex justify-between items-center relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 ml-2 mr-2"></div>

          {STEPS.map((s) => (
            <div
              key={s.number}
              className={`relative z-10 flex flex-col items-center gap-2 ${s.number <= step ? "text-brand-accent" : "text-slate-400"}`}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ${
                  s.number < step
                    ? "bg-brand-accent text-white"
                    : s.number === step
                      ? "bg-white border-2 border-brand-accent text-brand-accent"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {s.number < step ? <Check size={16} /> : s.number}
              </div>
              <span className="hidden md:block text-xs font-semibold">
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-10 min-h-[400px]">
        <h2 className="text-2xl font-bold font-heading mb-6">
          {STEPS[step - 1].title}
        </h2>
        {renderStepContent()}
      </div>

      {/* Footer Navigation */}
      {step < 5 && (
        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 ${step === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <ChevronLeft size={16} /> Wstecz
          </button>

          {step === 4 ? (
            <button
              onClick={handleNext}
              className="bg-brand-accent text-white px-8 py-2 rounded font-bold hover:bg-brand-accentHover transition-colors flex items-center gap-2"
            >
              Zapisz się <Check size={16} />
            </button>
          ) : (
            <div className="text-sm text-slate-400 italic">
              Wybierz opcję, aby przejść dalej
            </div>
          )}
        </div>
      )}
    </div>
  );
};
