import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { ADMIN_STUDENTS } from '../../constants';
import type { Student } from '../../types';
import type { UserOverrides } from './UserProfileView';
import { userValidationSchema } from '../../lib/validation';
import { toast } from 'sonner';

interface UserEditProps {
  email: string;
  overrides?: Record<string, UserOverrides>;
  onSaveOverrides: (email: string, overrides: UserOverrides) => void;
  onBack: () => void;
  students?: Student[];
  hideCompanyField?: boolean;
  forcedCompany?: string;
  entityLabel?: string;
}

export const UserEdit: React.FC<UserEditProps> = ({
  email,
  overrides,
  onSaveOverrides,
  onBack,
  students = ADMIN_STUDENTS,
  hideCompanyField = false,
  forcedCompany,
  entityLabel = 'użytkownika'
}) => {
  const base = students.find((s) => s.email === email);
  const existing = overrides?.[email];
  const companyOptions = Array.from(
    new Set([
      'Indywidualny',
      ...students.map((s) => (s.company || 'Indywidualny'))
    ])
  );

  const splitName = React.useCallback((full: string) => {
    const normalized = (full || '').trim().replace(/\s+/g, ' ');
    if (!normalized) return { firstName: '', lastName: '' };
    const parts = normalized.split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
  }, []);

  const [emailValue, setEmailValue] = React.useState(existing?.email || email);
  const initialName = existing?.name || base?.name || email;
  const initialSplit = splitName(initialName);
  const [firstName, setFirstName] = React.useState(initialSplit.firstName);
  const [lastName, setLastName] = React.useState(initialSplit.lastName);
  const [company, setCompany] = React.useState(forcedCompany || existing?.company || base?.company || 'Indywidualny');
  const [phone, setPhone] = React.useState(existing?.phone || '');
  const [address, setAddress] = React.useState(existing?.address || '');
  const [idNumber, setIdNumber] = React.useState(existing?.idNumber || '');
  const [pesel, setPesel] = React.useState(existing?.pesel || '');
  const [avatarUrl, setAvatarUrl] = React.useState(existing?.avatarUrl || '');
  const selectClassName =
    'w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white appearance-none pr-10';

  React.useEffect(() => {
    const nextBase = students.find((s) => s.email === email);
    const nextExisting = overrides?.[email];
    const nextName = nextExisting?.name || nextBase?.name || email;
    const nextSplit = splitName(nextName);
    setEmailValue(nextExisting?.email || email);
    setFirstName(nextSplit.firstName);
    setLastName(nextSplit.lastName);
    setCompany(forcedCompany || nextExisting?.company || nextBase?.company || 'Indywidualny');
    setPhone(nextExisting?.phone || '');
    setAddress(nextExisting?.address || '');
    setIdNumber(nextExisting?.idNumber || '');
    setPesel(nextExisting?.pesel || '');
    setAvatarUrl(nextExisting?.avatarUrl || '');
  }, [email, forcedCompany, overrides, splitName, students]);

  const fullName = `${firstName} ${lastName}`.trim().replace(/\s+/g, ' ');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edycja {entityLabel}</h1>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Wróć
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Imię</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jan"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nazwisko</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Kowalski"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <div className="text-xs text-slate-500 mt-2">Zmiana emaila jest symulowana w UI (bez backendu).</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="600000000"
            />
          </div>
        </div>

        {!hideCompanyField && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Firma</label>
            <div className="relative">
              <select
                className={selectClassName}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                {companyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Uwaga: to nadpisanie jest tylko w UI (bez backendu).</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Adres</label>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ul. Przykładowa 1, 99-300 Kutno"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dowód osobisty</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="ABC123456"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">PESEL</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={pesel}
              onChange={(e) => setPesel(e.target.value)}
              placeholder="00000000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Zdjęcie / miniatura (URL)</label>
          <div className="text-[11px] text-slate-500 -mt-1 mb-2">Rekomendowane: WEBP • Alternatywnie: PNG/JPG</div>
          <input
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
          {avatarUrl && (
            <img src={avatarUrl} alt="Podgląd" className="mt-3 h-16 w-16 rounded-full object-cover border border-slate-200" />
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              const validationResult = userValidationSchema.safeParse({
                name: fullName || emailValue,
                email: emailValue.trim(),
                phone: phone || "",
                pesel: pesel.trim() || undefined,
              });

              if (!validationResult.success) {
                toast.error(validationResult.error.errors[0].message);
                return;
              }

              onSaveOverrides(email, {
                email: emailValue,
                name: fullName || emailValue,
                company,
                phone,
                address,
                idNumber,
                pesel,
                avatarUrl
              });
              onBack();
            }}
            className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg shadow hover:bg-brand-accentHover transition font-semibold"
          >
            <Save size={16} /> Zapisz zmiany
          </button>
        </div>
      </div>
    </div>
  );
};
