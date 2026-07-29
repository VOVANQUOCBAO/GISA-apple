'use client';

import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarBlank,
  CaretDown,
  ChalkboardTeacher,
  ChartLineUp,
  CheckCircle,
  ChatsCircle,
  ClipboardText,
  Compass,
  DownloadSimple,
  EnvelopeSimple,
  FacebookLogo,
  GlobeHemisphereWest,
  GraduationCap,
  Lightbulb,
  LinkedinLogo,
  Leaf,
  List,
  MapPin,
  MagnifyingGlass,
  Megaphone,
  Network,
  PaperPlaneTilt,
  Phone,
  PresentationChart,
  UsersThree,
  YoutubeLogo,
  X,
} from '@phosphor-icons/react';

const icons = {
  arrow: ArrowRight,
  arrowUp: ArrowUpRight,
  book: BookOpenText,
  calendar: CalendarBlank,
  caret: CaretDown,
  chats: ChatsCircle,
  clipboard: ClipboardText,
  compass: Compass,
  download: DownloadSimple,
  email: EnvelopeSimple,
  facebook: FacebookLogo,
  graduation: GraduationCap,
  training: ChalkboardTeacher,
  chart: ChartLineUp,
  check: CheckCircle,
  globe: GlobeHemisphereWest,
  lightbulb: Lightbulb,
  linkedin: LinkedinLogo,
  leaf: Leaf,
  location: MapPin,
  menu: List,
  megaphone: Megaphone,
  network: Network,
  phone: Phone,
  presentation: PresentationChart,
  search: MagnifyingGlass,
  send: PaperPlaneTilt,
  users: UsersThree,
  youtube: YoutubeLogo,
  close: X,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const Component = icons[name];
  return <Component aria-hidden="true" size={size} weight="regular" />;
}
