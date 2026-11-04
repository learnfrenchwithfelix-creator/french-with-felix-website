// Shared classes of the homepage membership parts (MembershipPart.astro and the four parts)
export const listClass = 'flex flex-col gap-3 text-[15px] text-body';
export const itemClass = 'flex items-center gap-3';
/** Round marker in place of a file icon, same 32px footprint */
export const iconClass =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface font-display text-[15px] font-bold text-accent';
export const linkClass =
  'mt-6 inline-flex items-center gap-1 font-display text-[15px] font-semibold text-accent hover:text-[var(--color-accent-dark)]';
