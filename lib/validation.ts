import { z } from "zod";

// Helper to validate PESEL (checksum)
export const validatePesel = (pesel: string): boolean => {
  const p = pesel.trim();
  if (p.length !== 11 || !/^\d+$/.test(p)) return false;
  
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(p[i]) * weights[i];
  }
  const control = (10 - (sum % 10)) % 10;
  return control === parseInt(p[10]);
};

// Helper to validate NIP (checksum)
export const validateNip = (nip: string): boolean => {
  const n = nip.trim().replace(/[-\s]/g, "");
  if (n.length !== 10 || !/^\d+$/.test(n)) return false;

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(n[i]) * weights[i];
  }
  const control = sum % 11;
  return control === parseInt(n[9]);
};

export const userValidationSchema = z.object({
  name: z.string().min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki."),
  email: z.string().email("Niepoprawny format adresu e-mail."),
  phone: z.string().regex(/^\+?[0-9\s-]{9,15}$/, "Niepoprawny format numeru telefonu."),
  pesel: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || validatePesel(val), {
      message: "Niepoprawny numer PESEL (błędna suma kontrolna lub długość).",
    }),
});

export const companyValidationSchema = z.object({
  name: z.string().min(2, "Nazwa firmy musi mieć co najmniej 2 znaki."),
  nip: z
    .string()
    .regex(/^\d{10}$|^\d{3}-\d{3}-\d{2}-\d{2}$/, "NIP musi składać się z 10 cyfr.")
    .refine((val) => validateNip(val), {
      message: "Niepoprawny numer NIP (błędna suma kontrolna).",
    }),
  address: z.string().min(5, "Adres firmy jest zbyt krótki (min. 5 znaków).").optional().or(z.literal("")),
});
