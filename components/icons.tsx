import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconSpark(props: IconProps) {
  return (
    <Stroke strokeWidth={2.1} {...props}>
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </Stroke>
  );
}

export function IconPanelLeft(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </Stroke>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 5v14M5 12h14" />
    </Stroke>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Stroke>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m6 9 6 6 6-6" />
    </Stroke>
  );
}

export function IconZap(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function IconLayout(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </Stroke>
  );
}

export function IconCode(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
    </Stroke>
  );
}

export function IconReasoning(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </Stroke>
  );
}

export function IconPaperclip(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </Stroke>
  );
}

export function IconSend(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </Stroke>
  );
}

export function IconShare(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </Stroke>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </Stroke>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Stroke>
  );
}

export function IconX(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Stroke>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Stroke>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </Stroke>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Stroke strokeWidth={2.2} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Stroke>
  );
}

export function IconCreditCard(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </Stroke>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Stroke>
  );
}
