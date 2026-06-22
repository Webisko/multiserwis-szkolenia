import { Course, Order, OrderStatus, StudentUser } from "../types";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;
};

// Helper helper to map Backend Course to Frontend Course
const mapCourse = (c: any): Course => ({
  id: c.id,
  title: c.title,
  category: (c.category as any) || "Inne",
  duration: c.duration || "0h",
  price: c.price != null ? String(c.price) : "0.00",
  image:
    c.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  status:
    c.status === "PUBLISHED" || c.status === "published"
      ? "published"
      : "draft",
  description: c.description,
  level: c.level,

  hasOnline: c.hasOnline ?? true,
  hasStationary: c.hasStationary ?? false,
  priceOnline: c.priceOnline != null ? String(c.priceOnline) : undefined,
  priceStationary:
    c.priceStationary != null ? String(c.priceStationary) : undefined,
  location: c.location,
  nextSession: c.nextSession,

  // Default values for fields not yet in backend
  lessons: [],
});

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<StudentUser> => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data.user ?? data;
    },
    getMe: async (): Promise<StudentUser | null> => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: getHeaders(),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user ?? data;
      } catch (e) {
        return null;
      }
    },
    logout: () => {
      localStorage.removeItem("token");
    },
  },
  courses: {
    list: async (): Promise<Course[]> => {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.map(mapCourse);
    },
    get: async (id: string): Promise<Course> => {
      const res = await fetch(`${API_URL}/courses/${id}`);
      if (!res.ok) throw new Error("Course not found");
      const data = await res.json();
      return mapCourse(data);
    },
    create: async (data: Partial<Course>): Promise<Course> => {
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        promoPrice: data.promoPrice,
        duration: data.duration,
        status: data.status,
      };

      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || JSON.stringify(err) || "Failed to create course",
        );
      }
      const created = await res.json();
      return mapCourse(created);
    },
    update: async (id: string, data: Partial<Course>): Promise<Course> => {
      const payload: any = { ...data };

      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update course");
      const updated = await res.json();
      return mapCourse(updated);
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete course");
    },
  },
  users: {
    list: async (): Promise<StudentUser[]> => {
      const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    get: async (id: string): Promise<StudentUser> => {
      const res = await fetch(`${API_URL}/users/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    create: async (
      data: Partial<StudentUser> & { password?: string },
    ): Promise<StudentUser> => {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err.error) || "Failed to create user");
      }
      return res.json();
    },
    update: async (
      id: string,
      data: Partial<StudentUser> & { password?: string },
    ): Promise<StudentUser> => {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    enroll: async (userId: string, courseId: string) => {
      const res = await fetch(`${API_URL}/users/${userId}/enroll`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) throw new Error("Failed to enroll user");
      return res.json();
    },
  },
  progress: {
    list: async (): Promise<any[]> => {
      const res = await fetch(`${API_URL}/progress`, { headers: getHeaders() });
      if (!res.ok) return [];
      return res.json();
    },
    update: async (data: {
      lessonId: string;
      completed?: boolean;
      score?: number;
      stoppedAt?: number;
      watchTime?: number;
    }) => {
      const res = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
  },
  transactions: {
    init: async (courseId: string, amount: number) => {
      const res = await fetch(`${API_URL}/transactions/init`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ courseId, amount, provider: "mock" }),
      });
      if (!res.ok) throw new Error("Failed to init transaction");
      return res.json();
    },
    confirm: async (transactionId: string) => {
      const res = await fetch(`${API_URL}/transactions/mock-confirm`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ transactionId }),
      });
      if (!res.ok) throw new Error("Failed to confirm transaction");
      return res.json();
    },
  },
  orders: {
    create: async (data: {
      userId: string;
      courseId: string;
      amount: number;
      provider?: string;
    }): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    list: async (userId?: string): Promise<Order[]> => {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      const res = await fetch(`${API_URL}/orders${query}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    listMine: async (): Promise<Order[]> => {
      const res = await fetch(`${API_URL}/orders/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      return res.json();
    },
  },
  questions: {
    list: async (courseId: string) => {
      const res = await fetch(`${API_URL}/questions?courseId=${courseId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create question");
      return res.json();
    },
    generateExam: async (courseId: string, count: number = 10) => {
      const res = await fetch(`${API_URL}/questions/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ courseId, count }),
      });
      if (!res.ok) throw new Error("Failed to generate exam");
      return res.json();
    },
  },
  analytics: {
    getGuardianStats: async () => {
      const res = await fetch(`${API_URL}/analytics`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  },
  tickets: {
    list: async () => {
      const res = await fetch(`${API_URL}/tickets`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
    get: async (id: string) => {
      const res = await fetch(`${API_URL}/tickets/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch ticket");
      return res.json();
    },
    create: async (data: {
      subject: string;
      category: string;
      content: string;
    }) => {
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return res.json();
    },
    reply: async (ticketId: string, content: string) => {
      const res = await fetch(`${API_URL}/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to reply");
      return res.json();
    },
  },
};
