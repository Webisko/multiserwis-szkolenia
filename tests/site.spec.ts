import { test, expect } from "@playwright/test";

test.describe("Portal szkoleniowy MultiSerwis Kutno — E2E", () => {
  test("strona główna ładuje się poprawnie z nagłówkiem i ofertą", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/MultiSerwis Kutno/i);

    // Weryfikacja nawigacji
    const brand = page.locator("nav[aria-label='Nawigacja główna']");
    await expect(brand).toBeVisible();

    // Weryfikacja telefonu kontaktowego
    await expect(page.locator("text=+48 730 101 000").first()).toBeVisible();

    // Weryfikacja kafelków zaufania
    await expect(page.locator("text=5000+")).toBeVisible();
    await expect(page.locator("text=Własny poligon manewrowy w Kutnie").first()).toBeVisible();
  });

  test("katalog szkoleń renderuje wyspę CourseFinderIsland z filtrowaniem", async ({ page }) => {
    await page.goto("/szkolenia");
    await expect(page).toHaveTitle(/Katalog szkoleń/i);

    // Sprawdzenie wyszukiwarki szkoleń
    const searchInput = page.locator("input[aria-label='Wyszukaj szkolenie']");
    await expect(searchInput).toBeVisible();

    // Wpisanie frazy 'wózki'
    await searchInput.fill("wózki");
    await expect(page.locator("text=Wyniki dla frazy: „wózki”")).toBeVisible();
    await expect(page.locator("h3:has-text('wózk')").first()).toBeVisible();
  });

  test("podstrona szczegółów kursu prezentuje ramowy plan i formularz", async ({ page }) => {
    await page.goto("/szkolenia/wozki-widlowe");
    await expect(page).toHaveTitle(/wózk/i);

    // Sprawdzenie sekcji planu nauczania
    await expect(page.locator("text=Program szkolenia i zagadnienia praktyczne")).toBeVisible();
    await expect(page.locator("text=Wymagania wstępne dla kandydatów")).toBeVisible();

    // Przycisk zapisu na szkolenie
    const enrollLink = page.locator("a:has-text('Zapisz się na to szkolenie')").first();
    await expect(enrollLink).toBeVisible();
  });

  test("formularz zapisu obsługuje przełączanie między uczestnikiem a firmą B2B", async ({ page }) => {
    await page.goto("/rejestracja");
    await expect(page).toHaveTitle(/Zapisz się na szkolenie/i);

    const b2bCard = page.locator("button[data-role='B2B']");
    await expect(b2bCard).toBeVisible();
    await b2bCard.click();

    // Sprawdzenie czy pola firmy stają się widoczne
    const companyInput = page.locator("#reg-company");
    await expect(companyInput).toBeVisible();
    const nipInput = page.locator("#reg-nip");
    await expect(nipInput).toBeVisible();
  });

  test("panel szkoleniowy LMS renderuje formularz logowania i rejestracji", async ({ page }) => {
    await page.goto("/panel");
    await expect(page).toHaveTitle(/Platforma szkoleniowa e-learning/i);

    // Formularz logowania i rejestracji w wyspie LMS
    await expect(page.locator("text=Strefa kursanta i opiekuna firmy B2B")).toBeVisible();
    await expect(page.locator("button:has-text('Logowanie do konta')")).toBeVisible();
    await expect(page.locator("button:has-text('Rejestracja nowego konta')")).toBeVisible();

    // Sprawdzenie inputów logowania
    await expect(page.locator("input[placeholder='np. kursant@multiserwis.edu.pl']")).toBeVisible();
  });
});
