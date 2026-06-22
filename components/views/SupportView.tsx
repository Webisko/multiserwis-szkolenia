import React, { useEffect, useState } from "react";
import { MessageSquare, Plus, Send, ChevronLeft } from "lucide-react";
import { api } from "../../services/api"; // Will need to update mock api.ts to include tickets

interface Ticket {
  id: string;
  subject: string;
  category: "TECH" | "GENERAL" | "BILLING";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  updatedAt: string;
  messages?: TicketMessage[];
}

interface TicketMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

const SupportView: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("GENERAL");
  const [newContent, setNewContent] = useState("");

  // Reply State
  const [replyContent, setReplyContent] = useState("");

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await api.tickets.list();
      setTickets(data);
    } catch (e) {
      console.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async () => {
    try {
      await api.tickets.create({
        subject: newSubject,
        category: newCategory,
        content: newContent,
      });

      setShowNewTicketModal(false);
      setNewSubject("");
      setNewContent("");
      fetchTickets();
    } catch (e) {
      alert("Błąd podczas tworzenia zgłoszenia");
    }
  };

  const handleReply = async () => {
    if (!selectedTicketId || !replyContent.trim()) return;
    try {
      await api.tickets.reply(selectedTicketId, replyContent);
      setReplyContent("");

      const updatedTicket = await api.tickets.get(selectedTicketId);

      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicketId ? updatedTicket : t)),
      );
    } catch (e) {
      alert("Błąd wysyłania wiadomości");
    }
  };

  // Derived state
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "text-green-600 bg-green-50 border-green-200";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "CLOSED":
        return "text-slate-500 bg-slate-100 border-slate-200";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
      {/* Ticket List */}
      <div
        className={`w-full md:w-1/3 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col ${selectedTicketId ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare size={20} /> Zgłoszenia
          </h2>
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="p-2 bg-brand-primary text-white rounded-sm hover:bg-brand-dark transition-colors"
            title="Nowe zgłoszenie"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 && !isLoading && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Brak zgłoszeń.
            </div>
          )}

          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedTicketId === ticket.id ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status === "IN_PROGRESS"
                    ? "W trakcie"
                    : ticket.status === "OPEN"
                      ? "Otwarte"
                      : "Zamknięte"}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">
                {ticket.subject}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {ticket.messages && ticket.messages.length > 0
                  ? ticket.messages[ticket.messages.length - 1].content
                  : "Brak wiadomości"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Detail / Chat */}
      <div
        className={`w-full md:w-2/3 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col ${selectedTicketId ? "flex" : "hidden md:flex"}`}
      >
        {selectedTicket ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
              <button
                onClick={() => setSelectedTicketId(null)}
                className="md:hidden p-1 hover:bg-slate-200 rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="font-bold text-slate-800">
                  {selectedTicket.subject}
                </h2>
                <div className="text-xs text-slate-500 flex gap-2">
                  <span>#{selectedTicket.id.split("-")[0]}</span>
                  <span>•</span>
                  <span>{selectedTicket.category}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${msg.senderId === currentUser.id ? "ml-auto items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg text-sm shadow-sm ${
                      msg.senderId === currentUser.id
                        ? "bg-brand-primary text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
                  onKeyPress={(e) => e.key === "Enter" && handleReply()}
                />
                <button
                  onClick={handleReply}
                  className="p-2 bg-brand-primary text-white rounded-sm hover:bg-brand-dark transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
            <MessageSquare size={48} className="opacity-20" />
            <p>Wybierz zgłoszenie z listy</p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg p-6 shadow-xl animate-scale-in">
            <h2 className="text-xl font-bold font-heading mb-4">
              Nowe zgłoszenie
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Temat
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
                  placeholder="np. Problem z logowaniem"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Kategoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="GENERAL">Ogólne pytania</option>
                  <option value="TECH">Problem techniczny</option>
                  <option value="BILLING">Faktury i płatności</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Opis problemu
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-brand-primary min-h-30"
                  placeholder="Opisz dokładnie swój problem..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-sm"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={!newSubject || !newContent}
                  className="px-6 py-2 bg-brand-primary text-white font-bold rounded-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Wyślij zgłoszenie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportView;
