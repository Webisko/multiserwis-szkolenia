import React, { useState } from "react";
import { useCartStore, CartItem } from "../../services/cartStore";
import { useAuthStore } from "../../services/authStore";
import { api } from "../../services/api";
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  setView: (view: any) => void;
}

export const CartView: React.FC<Props> = ({ setView }) => {
  const { items, removeItem, updateQuantity, clearCart, getTotalAmount } = useCartStore();
  const { currentUser, isLoggedIn } = useAuthStore();
  const [showPaymentMock, setShowPaymentMock] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [invoiceType, setInvoiceType] = useState<"individual" | "company">("individual");
  const [buyerName, setBuyerName] = useState(currentUser?.name || "");
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || "");
  const [companyNip, setCompanyNip] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Koszyk jest pusty.");
      return;
    }
    if (!isLoggedIn) {
      toast.info("Zaloguj się, aby sfinalizować zamówienie.");
      // We can open login flow here if we want, but for now we just require login
      return;
    }
    if (invoiceType === "company" && (!companyNip.trim() || !companyAddress.trim())) {
      toast.error("Wypełnij dane NIP i adres firmy.");
      return;
    }

    setShowPaymentMock(true);
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    toast.info("Przetwarzanie płatności...", { id: "payment-process" });

    try {
      // Send orders to API
      // Loop over items and create order for each item or bulk order
      for (const item of items) {
        await api.orders.create({
          userId: currentUser!.id,
          courseId: item.courseId,
          amount: item.price * item.quantity,
          provider: "online", // mock
        });
      }

      toast.success("Płatność zatwierdzona! Szkolenia zostały przypisane do Twojego konta.", {
        id: "payment-process",
        duration: 5000,
      });

      clearCart();
      setShowPaymentMock(false);
      
      // Redirect to panel based on role
      if (currentUser?.role === "COMPANY_GUARDIAN") {
        setView("NEW_GUARDIAN_PANEL");
      } else {
        setView("NEW_STUDENT_PANEL");
      }
    } catch (error) {
      console.error(error);
      toast.error("Błąd podczas finalizacji zamówienia.", { id: "payment-process" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showPaymentMock) {
    return (
      <div className="max-w-md mx-auto bg-slate-900 text-white rounded-lg shadow-2xl p-8 border-t-4 border-yellow-500 my-10 font-sans">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-yellow-500/10 rounded-full text-yellow-500 mb-4">
            <CreditCard size={36} />
          </div>
          <h2 className="text-xl font-bold font-heading">Symulator Płatności</h2>
          <p className="text-xs text-slate-400 mt-1">Zewnętrzna bramka płatności (Mockup)</p>
        </div>

        <div className="bg-slate-800 p-4 rounded mb-6 border border-slate-700">
          <div className="text-xs text-slate-400">Odbiorca:</div>
          <div className="font-bold text-sm text-slate-200">MultiSerwis S.C. Kutno</div>
          <div className="text-xs text-slate-400 mt-2">Kwota do zapłaty:</div>
          <div className="text-2xl font-black text-yellow-500">{getTotalAmount()} PLN</div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSimulatePaymentSuccess}
            disabled={isProcessing}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white font-bold rounded transition cursor-pointer text-sm uppercase flex items-center justify-center gap-2"
          >
            Symuluj poprawną płatność (Zapłać)
          </button>
          <button
            onClick={() => setShowPaymentMock(false)}
            disabled={isProcessing}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded transition cursor-pointer text-sm"
          >
            Anuluj transakcję
          </button>
        </div>

        <div className="text-center mt-6 text-[10px] text-slate-500">
          Bezpieczne połączenie szyfrowane SSL (Symulacja).
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
        <ShoppingBag className="text-brand-accent" size={28} />
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Twój Koszyk</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-4 inline-block">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-lg font-bold text-slate-700">Twój koszyk jest pusty</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Przejdź do katalogu, aby wybrać szkolenia dla siebie lub pracowników.</p>
          <button
            onClick={() => setView("CATALOG")}
            className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded hover:bg-brand-dark transition-colors cursor-pointer text-sm"
          >
            Przejdź do katalogu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Cart Items & Billing Data */}
          <div className="space-y-6">
            {/* Items List */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-55 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Wybrane Szkolenia
              </div>
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.courseId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">{item.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">{item.price} PLN / szt.</div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.courseId, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                          title="Zmniejsz ilość licencji"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold text-slate-700 min-w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.courseId, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                          title="Zwiększ ilość licencji"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total and Trash */}
                      <div className="text-right font-bold text-slate-800 text-sm min-w-20">
                        {item.price * item.quantity} PLN
                      </div>

                      <button
                        onClick={() => removeItem(item.courseId)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                        title="Usuń z koszyka"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Data Form */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText size={18} className="text-slate-500" /> Dane do płatności
              </h2>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="invoice"
                    checked={invoiceType === "individual"}
                    onChange={() => setInvoiceType("individual")}
                    className="accent-brand-accent h-4 w-4"
                  />
                  Osoba prywatna
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="invoice"
                    checked={invoiceType === "company"}
                    onChange={() => setInvoiceType("company")}
                    className="accent-brand-accent h-4 w-4"
                  />
                  Firma (Faktura VAT)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Imię i Nazwisko / Nazwa</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adres E-mail</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                {invoiceType === "company" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">NIP Firmy</label>
                      <input
                        type="text"
                        value={companyNip}
                        onChange={(e) => setCompanyNip(e.target.value)}
                        placeholder="NIP (10 cyfr)"
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand-primary"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Adres Siedziby</label>
                      <textarea
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Ulica, kod pocztowy, miasto"
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand-primary resize-none"
                        rows={2}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Podsumowanie</h2>
              
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Suma licencji:</span>
                  <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)} szt.</span>
                </div>
                <div className="flex justify-between">
                  <span>Wartość netto:</span>
                  <span className="font-semibold">{Math.round(getTotalAmount() * 0.77)} PLN</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>VAT (23%):</span>
                  <span>{Math.round(getTotalAmount() * 0.23)} PLN</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-800">Do zapłaty:</span>
                <span className="text-2xl font-black text-brand-accent">{getTotalAmount()} PLN</span>
              </div>

              {!isLoggedIn && (
                <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded border border-amber-200 mb-4">
                  Musisz być zalogowany, aby dokonać zakupu. Zaloguj się w menu głównym.
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!isLoggedIn}
                className="w-full py-3 bg-brand-accent hover:bg-brand-primary disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm uppercase"
              >
                Przejdź do płatności <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-xs px-2">
              <ShieldCheck size={28} className="text-green-600 shrink-0" />
              <span>Twoje połączenie jest w pełni zabezpieczone. Zakupione kursy zostaną aktywowane natychmiast po zaksięgowaniu wpłaty.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
