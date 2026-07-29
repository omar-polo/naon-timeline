type Tone = 'accent' | 'gray' | 'success' | 'muted';

const toneClasses: Record<Tone, string> = {
  accent: 'text-accent bg-accent-bg',
  gray: 'text-gray bg-gray-bg',
  success: 'text-success bg-success-bg',
  muted: 'text-muted bg-gray-bg',
};

export default function Pill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
