import { create } from "zustand";
import { Course } from "../types";

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (course: Course) => void;
  removeItem: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (course) => {
    const parsedPrice = parsePrice(course.price);
    set((state) => {
      const existing = state.items.find((item) => item.courseId === course.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.courseId === course.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            courseId: course.id,
            title: course.title,
            price: parsedPrice,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (courseId) => {
    set((state) => ({
      items: state.items.filter((item) => item.courseId !== courseId),
    }));
  },

  updateQuantity: (courseId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.courseId === courseId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalAmount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
