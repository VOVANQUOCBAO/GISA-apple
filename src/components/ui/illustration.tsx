import Image from 'next/image';

import {
  ChatsCircle,
  FileMagnifyingGlass,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

/**
 * Editorial illustrations use one restrained, colourful academic asset family.
 * Utility-only symbols stay as vectors so they remain crisp at very small sizes.
 */
const imageIllustrations = {
  'application-transfer': '/icons/academic-set/application-transfer.png',
  'applied-research': '/icons/academic-set/applied-research.png',
  'capacity-building': '/icons/academic-set/capacity-building.png',
  'climate-action': '/icons/academic-set/climate-action.png',
  'community-impact': '/icons/academic-set/community-impact.png',
  'gisa-strength2food-icon': '/icons/academic-set/gisa-strength2food-icon.png',
  'gisa-trade4sd-icon': '/icons/academic-set/gisa-trade4sd-icon.png',
  'gisa-valumics-icon': '/icons/academic-set/gisa-valumics-icon.png',
  'global-collaboration': '/icons/academic-set/global-collaboration.png',
  'impact-measurement': '/icons/academic-set/impact-measurement.png',
  'inclusive-community': '/icons/academic-set/inclusive-community.png',
  'network-collaboration': '/icons/academic-set/network-collaboration.png',
  'quality-education': '/icons/academic-set/quality-education.png',
  'responsible-innovation': '/icons/academic-set/responsible-innovation.png',
  'strategic-consulting': '/icons/academic-set/strategic-consulting.png',
} as const;

const vectorIllustrations = {
  'chat-bubbles': ChatsCircle,
  'research-doc': FileMagnifyingGlass,
} as const satisfies Record<string, PhosphorIcon>;

export type IllustrationName = keyof typeof imageIllustrations | keyof typeof vectorIllustrations;

export function Illustration({ name, size }: { name: IllustrationName; size: number }) {
  const imageSource = imageIllustrations[name as keyof typeof imageIllustrations];

  if (imageSource) {
    return <Image alt="" aria-hidden="true" height={size} src={imageSource} width={size} />;
  }

  const IllustrationIcon = vectorIllustrations[name as keyof typeof vectorIllustrations];
  return <IllustrationIcon aria-hidden="true" size={size} weight="regular" />;
}
