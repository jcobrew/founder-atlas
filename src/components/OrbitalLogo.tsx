type Props = {
  /** `lockup` shows mark + wordmark; `mark` shows the icon only. */
  variant?: 'lockup' | 'mark';
  className?: string;
  label?: string;
};

export default function OrbitalLogo({ variant = 'lockup', className = '', label = '0rbital (Orbital)' }: Props) {
  return (
    <img
      src={variant === 'mark' ? '/orbital-mark.svg' : '/orbital-logo.svg'}
      alt={label}
      className={`orbital-logo orbital-logo--${variant} ${className}`.trim()}
    />
  );
}
