import React from "react";

export const StaffGrid: React.FC = () => {
  const staff = [
    {
      name: "Marek Kowalski",
      role: "Główny Instruktor UDT",
      specialization: "Wózki widłowe, Suwnice",
      exp: "15 lat doświadczenia",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", // Placeholder portrait
    },
    {
      name: "Anna Nowak",
      role: "Instruktor BHP",
      specialization: "Bezpieczeństwo pracy, PPOŻ",
      exp: "10 lat doświadczenia",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    },
    {
      name: "Piotr Wiśniewski",
      role: "Instruktor Maszyn Budowlanych",
      specialization: "Koparki, Ładowarki",
      exp: "20 lat doświadczenia",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    },
    {
      name: "Krzysztof Zieliński",
      role: "Specjalista SEP / Spawalnictwo",
      specialization: "Uprawnienia elektryczne, Spawanie",
      exp: "12 lat doświadczenia",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-slate-800 mb-2">
          Nasza Kadra
        </h2>
        <p className="text-slate-500 mb-8 max-w-2xl">
          Zespół doświadczonych instruktorów-praktyków, którzy dbają o najwyższą
          jakość szkolenia i atmosferę sprzyjającą nauce.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((person, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100 hover:border-brand-accent/30 transition-colors group"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">
                {person.name}
              </h3>
              <div className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                {person.role}
              </div>
              <p className="text-sm text-slate-500 mb-2">
                {person.specialization}
              </p>
              <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-400 border border-slate-200">
                {person.exp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
