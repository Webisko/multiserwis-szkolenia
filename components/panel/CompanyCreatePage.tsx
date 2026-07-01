import React from 'react';
import { ArrowLeft, Save, Mail, Phone, User } from 'lucide-react';
import { ADMIN_STUDENTS } from '../../constants';
import type { CompanyOverrides } from './CompanyView';
import type { UserOverrides } from './UserProfileView';
import { companyValidationSchema } from '../../lib/validation';
import { toast } from 'sonner';

interface CompanyCreatePageProps {
  overrides?: Record<string, CompanyOverrides>;
  userOverrides?: Record<string, UserOverrides>;
  onCreate: (companyName: string, overrides: CompanyOverrides) => void;
  onSaveUserOverrides?: (email: string, overrides: UserOverrides) => void;
  onCancel: () => void;
  onCreated: (companyName: string) => void;
}

export const CompanyCreatePage: React.FC<CompanyCreatePageProps> = ({
  overrides,
  userOverrides,
  onCreate,
  onSaveUserOverrides,
  onCancel,
  onCreated
}) => {
  const [companyKey, setCompanyKey] = React.useState('');
  const [companyDisplayName, setCompanyDisplayName] = React.useState('');
  const [contactUserEmail, setContactUserEmail] = React.useState('');
  const [nip, setNip] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [companyEmail, setCompanyEmail] = React.useState('');
  const [companyPhone, setCompanyPhone] = React.useState('');
  const [contactSearch, setContactSearch] = React.useState('');
  const [showContactList, setShowContactList] = React.useState(false);

  const uniqueUsers = Array.from(new Map(ADMIN_STUDENTS.map((s) => [s.email, s])).values());

  const filteredContacts = uniqueUsers
    .map((user) => {
      const override = userOverrides?.[user.email];
      const displayName = override?.name || user.name || user.email;
      return { email: user.email, name: displayName };
    })
    .filter((user) => {
      const hay = `${user.name} ${user.email}`.toLowerCase();
      return hay.includes(contactSearch.trim().toLowerCase());
    })
    .slice(0, 10);

  const contactBase = uniqueUsers.find((u) => u.email === contactUserEmail);
  const contactOverride = userOverrides?.[contactUserEmail];
  const contactName = contactOverride?.name || contactBase?.name || contactUserEmail;
  const contactPhone = contactOverride?.phone || '';
  const contactEmail = contactOverride?.email || contactUserEmail || '';

  React.useEffect(() => {
    setCompanyEmail(contactEmail || '');
    setCompanyPhone(contactPhone || '');
  }, [contactEmail, contactPhone]);

  const selectClassName =
    'w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white appearance-none pr-10';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dodawanie firmy</h1>
        </div>
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Wróć
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nazwa firmy (klucz)</label>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={companyKey}
            onChange={(e) => {
              const next = e.target.value;
              setCompanyKey(next);
              if (!companyDisplayName) setCompanyDisplayName(next);
            }}
            placeholder="Np. MultiSerwis Kutno Sp. z o.o."
          />
          <div className="text-xs text-slate-500 mt-2">To identyfikator firmy używany w panelu (bez backendu).</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nazwa wyświetlana</label>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={companyDisplayName}
            onChange={(e) => setCompanyDisplayName(e.target.value)}
            placeholder="Np. MultiSerwis Kutno"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Osoba kontaktowa</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowContactList((prev) => !prev)}
              className={`${selectClassName} text-left`}
            >
              {contactName || 'Wybierz osobę'}
            </button>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
            {showContactList && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-slate-100">
                  <input
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Wyszukaj osobę..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">Brak wyników.</div>
                  ) : (
                    filteredContacts.map((user) => (
                      <button
                        key={user.email}
                        type="button"
                        onClick={() => {
                          setContactUserEmail(user.email);
                          setShowContactList(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <User size={12} /> Opiekun: {contactName || '—'} (dane kontaktowe firmy są powiązane).
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email firmy</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="kontakt@firma.pl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon firmy</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="+48 000 000 000"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">NIP</label>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            placeholder="0000000000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Zdjęcie / miniatura firmy (URL)</label>
          <div className="text-[11px] text-slate-500 -mt-1 mb-2">Rekomendowane: WEBP • Alternatywnie: PNG/JPG</div>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
          />
          {logoUrl && (
            <img src={logoUrl} alt="Logo firmy" className="mt-3 h-16 w-16 rounded-lg object-cover border border-slate-200" />
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              const key = companyKey.trim();
              if (!key) {
                toast.error('Podaj nazwę firmy.');
                return;
              }
              if (overrides?.[key]) {
                toast.error('Taka firma już istnieje.');
                return;
              }

              const validationResult = companyValidationSchema.safeParse({
                name: (companyDisplayName || key).trim(),
                nip: nip || "",
              });

              if (!validationResult.success) {
                toast.error(validationResult.error.errors[0].message);
                return;
              }

              onCreate(key, {
                name: (companyDisplayName || key).trim(),
                contactUserEmail: contactUserEmail || undefined,
                nip: nip || undefined,
                logoUrl: logoUrl || undefined
              });

              if (onSaveUserOverrides && contactUserEmail) {
                const previous = userOverrides?.[contactUserEmail] || {};
                onSaveUserOverrides(contactUserEmail, {
                  ...previous,
                  email: companyEmail || previous.email,
                  phone: companyPhone || previous.phone
                });
              }

              onCreated(key);
            }}
            className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg shadow hover:bg-brand-accentHover transition font-semibold"
          >
            <Save size={16} /> Utwórz firmę
          </button>
        </div>
      </div>
    </div>
  );
};
