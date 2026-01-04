import {
  ShoppingCart,
  Leaf,
  Apple,
  Milk,
  Package,
  Cookie,
  Coffee,
  SprayCan,
  Heart,
  Shirt,
  Gift,
  Box,
  UtensilsCrossed,
  Activity,
  Film,
  ChefHat,
  Car,
  HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  // Essentials
  "shopping-basket": ShoppingCart, // GROCERY (STAPLES)
  leaf: Leaf, // VEGETABLES
  apple: Apple, // FRUITS
  milk: Milk, // DAIRY

  // Food & consumables
  package: Package, // PACKAGED FOOD
  cookie: Cookie, // SNACKS & SWEETS
  coffee: Coffee, // BEVERAGES

  // Household
  "spray-can": SprayCan, // HOUSEHOLD SUPPLIES
  box: Box, // PLASTIC & HOUSEHOLD ITEMS

  // Personal & lifestyle
  heart: Heart, // PERSONAL CARE
  shirt: Shirt, // CLOTHING / DRESS
  gift: Gift, // FANCY / GIFT ITEMS

  // Durable goods
  utensils: UtensilsCrossed, // UTENSILS / METAL ITEMS

  // Services & life
  activity: Activity, // MEDICAL / HEALTH
  film: Film, // ENTERTAINMENT
  "chef-hat": ChefHat, // DINING OUT
  car: Car, // FUEL / TRANSPORT

  // Fallback
  "help-circle": HelpCircle, // MISCELLANEOUS
};

interface Props {
  icon?: string | null;
  size?: number;
  className?: string;
}

export function CategoryIcon({ icon, size = 18, className }: Props) {
  const Icon = ICON_MAP[icon ?? ""] ?? HelpCircle;
  return <Icon size={size} className={className} />;
}
