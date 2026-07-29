// react-aria-components only exposes toast primitives under UNSTABLE_ in the
// installed version - a plain aria-live region is the stable choice for now.
export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-20 rounded-lg bg-ink px-4 py-2.5 text-[13px] text-white shadow-[0_4px_14px_rgba(0,0,0,.2)]"
    >
      {message}
    </div>
  );
}
