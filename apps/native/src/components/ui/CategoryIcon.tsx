/**
 * @fileoverview CategoryIcon component
 * @module @kakeibo/native/components/ui
 *
 * Dynamic category icon component using Lucide icons.
 */

import {
  AppWindow,
  Armchair,
  Award,
  Baby,
  BadgePercent,
  Bed,
  Bike,
  Blocks,
  BookMarked,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Car,
  CarFront,
  ChartLine,
  Clock,
  Coffee,
  CreditCard,
  Droplet,
  Dumbbell,
  Eye,
  Film,
  Flame,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  type LucideIcon,
  Map as MapIcon,
  MoreHorizontal,
  Music,
  Palette,
  PawPrint,
  Pencil,
  Percent,
  Pill,
  Plane,
  PlusCircle,
  Receipt,
  Repeat,
  Rocket,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Smile,
  Sparkles,
  SquareParking,
  Stethoscope,
  Store,
  Tag,
  Ticket,
  TrainFront,
  TrendingUp,
  Tv,
  Undo2,
  Users,
  Utensils,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react-native';
import type React from 'react';

const iconMap: Record<string, LucideIcon> = {
  // Food & Dining
  'shopping-cart': ShoppingCart,
  utensils: Utensils,
  coffee: Coffee,
  bike: Bike,

  // Housing & Utilities
  home: Home,
  landmark: Landmark,
  zap: Zap,
  droplet: Droplet,
  flame: Flame,
  wifi: Wifi,
  smartphone: Smartphone,
  wrench: Wrench,

  // Transportation
  fuel: Fuel,
  'train-front': TrainFront,
  car: Car,
  'square-parking': SquareParking,
  'car-front': CarFront,
  shield: Shield,

  // Shopping
  shirt: Shirt,
  laptop: Laptop,
  'shopping-bag': ShoppingBag,
  armchair: Armchair,
  bed: Bed,
  'app-window': AppWindow,

  // Entertainment
  gamepad2: Gamepad2,
  film: Film,
  music: Music,
  tv: Tv,
  ticket: Ticket,
  palette: Palette,

  // Travel
  plane: Plane,
  map: MapIcon,
  briefcase: Briefcase,

  // Health
  'heart-pulse': HeartPulse,
  stethoscope: Stethoscope,
  pill: Pill,
  dumbbell: Dumbbell,
  eye: Eye,

  // Education
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'book-marked': BookMarked,
  pencil: Pencil,

  // Financial
  'badge-percent': BadgePercent,
  percent: Percent,
  'credit-card': CreditCard,
  receipt: Receipt,

  // Family & Kids
  baby: Baby,
  users: Users,
  'paw-print': PawPrint,
  blocks: Blocks,

  // Subscriptions
  repeat: Repeat,

  // Income
  'trending-up': TrendingUp,
  'chart-line': ChartLine,
  rocket: Rocket,
  award: Award,
  gift: Gift,
  building: Building,
  'building-2': Building2,
  store: Store,
  undo2: Undo2,
  'heart-handshake': HeartHandshake,
  heart: Heart,
  smile: Smile,
  sparkles: Sparkles,
  'plus-circle': PlusCircle,
  clock: Clock,

  // Default
  tag: Tag,
  'more-horizontal': MoreHorizontal,
};

export interface CategoryIconProps {
  /** Icon name (from iconMap) */
  icon: string;

  /** Icon color (hex) */
  color?: string;

  /** Icon size */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * CategoryIcon component
 *
 * @example
 * <CategoryIcon icon="shopping-cart" color="#10b981" size="md" />
 */
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  color = '#64748b',
  size = 'md',
}) => {
  const IconComponent = iconMap[icon] || Tag;
  const iconSize = sizeMap[size];

  return <IconComponent size={iconSize} color={color} />;
};
