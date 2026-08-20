'use client';

import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpenText,
  Buildings,
  CalendarBlank,
  CaretDown,
  ChalkboardTeacher,
  ChartLineUp,
  CheckCircle,
  ChatsCircle,
  ClipboardText,
  Compass,
  Cpu,
  DownloadSimple,
  EnvelopeSimple,
  FacebookLogo,
  Flask,
  GlobeHemisphereWest,
  GraduationCap,
  HandHeart,
  Lightbulb,
  LinkedinLogo,
  Leaf,
  List,
  MapPin,
  MagnifyingGlass,
  Mountains,
  Megaphone,
  Microscope,
  Network,
  PaperPlaneTilt,
  Phone,
  PresentationChart,
  Rocket,
  ShareNetwork,
  Target,
  UsersThree,
  YoutubeLogo,
  X,
} from '@phosphor-icons/react';

const icons = {
  arrow: ArrowRight,
  arrowUp: ArrowUpRight,
  atom: Atom,
  book: BookOpenText,
  buildings: Buildings,
  calendar: CalendarBlank,
  caret: CaretDown,
  chats: ChatsCircle,
  clipboard: ClipboardText,
  compass: Compass,
  cpu: Cpu,
  download: DownloadSimple,
  email: EnvelopeSimple,
  facebook: FacebookLogo,
  flask: Flask,
  graduation: GraduationCap,
  handHeart: HandHeart,
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
  microscope: Microscope,
  mountains: Mountains,
  network: Network,
  phone: Phone,
  presentation: PresentationChart,
  rocket: Rocket,
  shareNetwork: ShareNetwork,
  search: MagnifyingGlass,
  send: PaperPlaneTilt,
  target: Target,
  users: UsersThree,
  youtube: YoutubeLogo,
  close: X,
} as const;

export type IconName = keyof typeof icons;

/* `duotone` tô thêm một lớp nền cùng màu ở độ mờ thấp, nên biểu tượng có khối
   chứ không chỉ còn nét viền — dùng cho những chỗ biểu tượng phải bắt mắt. */
export type IconWeight = 'regular' | 'bold' | 'fill' | 'duotone';

export function Icon({
  name,
  size = 24,
  weight = 'regular',
}: {
  name: IconName;
  size?: number;
  weight?: IconWeight;
}) {
  const Component = icons[name];
  return <Component aria-hidden="true" size={size} weight={weight} />;
}
