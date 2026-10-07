import logo from './logo-full.svg';

const NAV_LINKS = [
  { href: 'https://loppure.it/chi-siamo', label: 'Chi siamo' },
  { href: 'https://loppure.it/sostienici', label: 'Sostienici' },
  { href: 'https://loppure.it/contatti', label: 'Contatti' },
];

export default function Header() {
  return (
    <header className="relative flex-none h-18 flex items-center px-7 border-b border-border font-sans">
      {/* The wordmark is part of the artwork, so the name lives in alt rather
          than in a span beside it - otherwise it is announced twice. */}
      <img src={logo} alt="Naon Timeline" className="h-9 w-auto" />
      {/* Centred on the header itself, not between the title and whatever
          sits on the right - so the links don't shift as the title changes. */}
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 min-[720px]:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            className="text-[15px] font-medium text-muted no-underline underline-offset-2 hover:text-accent hover:underline"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
