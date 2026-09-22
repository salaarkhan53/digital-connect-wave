import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  FileCheck,
  FileText,
  Headphones,
  Headset,
  ListX,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  ShieldCheck,
  Target,
  type LucideIcon,
} from 'lucide-react';

/**
 * Content files reference icons by kebab-case name so the content layer stays
 * free of component imports. SVG only — never emoji.
 */
const registry = {
  'phone-incoming': PhoneIncoming,
  'phone-outgoing': PhoneOutgoing,
  headset: Headset,
  headphones: Headphones,
  target: Target,
  'shield-check': ShieldCheck,
  'file-text': FileText,
  'file-check': FileCheck,
  building: Building2,
  megaphone: Megaphone,
  'list-x': ListX,
  archive: Archive,
  lock: Lock,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  check: Check,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = registry[name as IconName];
  if (!Cmp) return null;
  // Decorative by default: the adjacent label carries the meaning.
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
