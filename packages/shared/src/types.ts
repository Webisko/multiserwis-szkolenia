export type CourseCategory = "UDT" | "IMBiGS" | "SEP" | "Spawalnictwo" | "BHP" | "Inne";

export interface Course {
  id: string;
  slug?: string;
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

export interface Machine {
  id: string;
  name: string;
  type: string;
  specs: {
    height?: string;
    capacity?: string;
    weight?: string;
    power?: string;
  };
  image: string;
}
