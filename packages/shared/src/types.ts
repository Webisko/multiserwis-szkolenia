export type CourseCategory = "UDT" | "SEP" | "BHP" | "Inne";

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  duration: string;
  price: string;
  promoPrice?: string;
  image: string;
  isPopular?: boolean;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  level?: string;

  hasOnline?: boolean;
  hasStationary?: boolean;
  priceOnline?: string;
  priceStationary?: string;
  location?: string;
  nextSession?: string;
}
