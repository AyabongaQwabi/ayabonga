type NavHamburgerProps = {
  open: boolean;
  onToggle: () => void;
  controlsId: string;
};

export function NavHamburger({ open, onToggle, controlsId }: NavHamburgerProps) {
  return (
    <button
      type="button"
      className="interactive-button flex min-h-11 min-w-11 items-center justify-center p-2 text-[var(--warm-white)] md:hidden"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <span className="relative block h-5 w-6" aria-hidden>
        <span
          className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
            open ? 'top-[9px] rotate-45' : 'top-0'
          }`}
        />
        <span
          className={`absolute left-0 top-[9px] block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
            open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
          }`}
        />
        <span
          className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
            open ? 'top-[9px] -rotate-45' : 'top-[18px]'
          }`}
        />
      </span>
    </button>
  );
}
