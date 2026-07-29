import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';

type Variant = 'primary' | 'ghost' | 'ghostSmall' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white px-4 py-2 text-[13px]',
  ghost: 'bg-page text-muted border border-border px-3.5 py-2 text-[13px]',
  ghostSmall: 'bg-page text-ink border border-border px-3 py-2 text-[12.5px]',
  danger: 'bg-danger text-white px-4 py-2 text-[13px]',
};

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: AriaButtonProps & { variant?: Variant }) {
  return (
    <AriaButton
      {...props}
      className={`rounded-[7px] font-semibold cursor-pointer whitespace-nowrap
        data-[hovered]:brightness-95 data-[pressed]:brightness-90
        data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-accent
        data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
        ${variantClasses[variant]} ${className}`}
    />
  );
}
