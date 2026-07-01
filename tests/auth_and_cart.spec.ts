import { test, expect } from "@playwright/test";

test.describe("Ścieżka logowania i koszyka zakupowego", () => {
  test("użytkownik loguje się i dodaje szkolenie do koszyka", async ({ page }) => {
    // 1. Otwarcie strony głównej (HashRouter)
    await page.goto("http://localhost:5173/#/");

    // 2. Kliknięcie w przycisk "Zaloguj" w menu
    const loginBtn = page.locator("button:has-text('Zaloguj')").first();
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    // 3. Wypełnienie formularza logowania (mockowy student)
    await page.fill("input[placeholder='Twój e-mail']", "student@firma.pl");
    await page.fill("input[placeholder='Hasło']", "student123");
    
    // Kliknięcie "Zaloguj się" w modalu
    const submitLoginBtn = page.locator("button:has-text('Zaloguj się')");
    await submitLoginBtn.click();

    // 4. Weryfikacja zalogowania (imię studenta w nagłówku i strefa kursanta)
    await expect(page.locator("text=Jan Kowalski")).toBeVisible();
    await expect(page.locator("text=Twoje Aktywne Szkolenia")).toBeVisible();

    // 5. Przejście do katalogu szkoleń
    await page.locator("span:has-text('Szkolenia')").first().click();
    await page.locator("text=Wszystkie szkolenia").click();
    await expect(page.locator("text=Katalog Szkoleń Zawodowych")).toBeVisible();

    // 6. Dodanie kursu do koszyka
    const buyCourseBtn = page.locator("button:has-text('Kup szkolenie')").first();
    await buyCourseBtn.click();

    // Weryfikacja powiadomienia Toast z sonnera
    await expect(page.locator("text=Dodano szkolenie")).toBeVisible();

    // 7. Przejście do koszyka poprzez przycisk "Pokaż koszyk" w toście lub menu
    const showCartToastBtn = page.locator("button:has-text('Pokaż koszyk')");
    if (await showCartToastBtn.isVisible()) {
      await showCartToastBtn.click();
    } else {
      await page.goto("http://localhost:5173/#/cart");
    }

    // Weryfikacja widoku koszyka
    await expect(page.locator("h1:has-text('Twój Koszyk')")).toBeVisible();
    await expect(page.locator("text=Do zapłaty")).toBeVisible();

    // 8. Przejście do płatności
    const payBtn = page.locator("button:has-text('Przejdź do płatności')");
    await payBtn.click();

    // Weryfikacja bramki płatności mock
    await expect(page.locator("text=Symulator Płatności")).toBeVisible();

    // Kliknięcie płatności poprawnej
    await page.locator("button:has-text('Symuluj poprawną płatność')").click();

    // Powrót do panelu po udanej płatności
    await expect(page.locator("text=Twoje Aktywne Szkolenia")).toBeVisible();
  });
});
