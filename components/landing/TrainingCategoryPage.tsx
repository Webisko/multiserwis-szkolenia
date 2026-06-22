import { ArrowRight, CheckCircle, Info } from "lucide-react";

export interface TrainingItem {
  id: string;
  title: string;
  price?: string;
  duration?: string;
  description?: string;
  features?: string[];
}

interface ServicePromoProps {
  title: string;
  description: string;
  linkUrl: string;
  linkText: string;
}

const ServicePromo: React.FC<ServicePromoProps> = ({
  title,
  description,
  linkUrl,
  linkText,
}) => (
  <div className="bg-slate-50 border-l-4 border-brand-primary p-6 my-8 rounded-r-lg shadow-sm">
    <div className="flex items-start gap-4">
      <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary">
        <Info size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors"
        >
          {linkText} <ArrowRight size={16} />
        </a>
      </div>
    </div>
  </div>
);

interface TrainingCategoryPageProps {
  title: string;
  description: string;
  trainings: TrainingItem[];
  servicePromo?: ServicePromoProps;
  heroImage?: string;
  setView?: (view: any) => void;
}

export const TrainingCategoryPage: React.FC<TrainingCategoryPageProps> = ({
  title,
  description,
  trainings,
  servicePromo,
  heroImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  setView,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 transform scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
            {title}
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Intro / Context */}
        <div className="mb-12 max-w-4xl mx-auto text-lg text-slate-600 leading-relaxed">
          {/* Placeholder for SEO text or more description if needed */}
        </div>

        {/* Trainings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {training.title}
                </h3>
                {training.price && (
                  <div className="text-brand-primary font-bold text-lg mb-4">
                    {training.price}
                  </div>
                )}

                {training.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                    {training.description}
                  </p>
                )}

                {training.features && (
                  <ul className="space-y-2 mb-6">
                    {training.features.slice(0, 4).map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle
                          size={16}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => setView && setView("SIGNUP")}
                  className="block w-full text-center py-2.5 bg-brand-primary text-white font-bold rounded hover:bg-brand-dark transition-colors uppercase tracking-wide"
                >
                  Zapisz się
                </button>
                <div
                  onClick={() => {
                    /* Open modal logic if needed */
                  }} // Placeholder
                  className="block w-full text-center py-2 text-sm text-slate-500 hover:text-brand-primary mt-2 cursor-pointer"
                >
                  Szczegóły
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cross Promotion */}
        {servicePromo && (
          <div className="max-w-4xl mx-auto">
            <ServicePromo {...servicePromo} />
          </div>
        )}
      </div>
    </div>
  );
};
