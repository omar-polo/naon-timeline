import logo from './logo.svg';

const NAV_LINKS = [
  { href: 'https://loppure.it/chi-siamo', label: 'Chi siamo' },
  { href: 'https://loppure.it/sostienici', label: 'Sostienici' },
  { href: 'https://loppure.it/contatti', label: 'Contatti' },
];

export default function Header() {
  return (
    <header className="relative flex-none h-18 flex items-center px-7 border-b border-border font-sans">
      <span className="flex items-center gap-2">
        <img src={logo} alt="" className="h-6 w-6" />
        <span className="text-[20px] font-semibold text-ink">Naon Timeline</span>
      </span>
      {/* Centred on the header itself, not between the title and whatever
          sits on the right - so the links don't shift as the title changes. */}
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 min-[720px]:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            className="text-[15px] font-medium text-muted no-underline hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
