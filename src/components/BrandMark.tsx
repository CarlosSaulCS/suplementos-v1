type Props = {
  size?: number
  className?: string
}

export function BrandMark({ size = 28, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 18) rotate(55) scale(54)">
          <stop stopColor="#ff3750" stopOpacity="0.95" />
          <stop offset="0.7" stopColor="#d10b1c" stopOpacity="0.95" />
          <stop offset="1" stopColor="#3a0006" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#g)" />
      <circle cx="32" cy="32" r="30" stroke="rgba(11,11,12,.25)" />

      {/* stylized barbell */}
      <path
        d="M18 32c0-1 .8-1.8 1.8-1.8h3.4c1 0 1.8.8 1.8 1.8v8.6c0 1-.8 1.8-1.8 1.8h-3.4c-1 0-1.8-.8-1.8-1.8V32Zm28.8-1.8c-1 0-1.8.8-1.8 1.8v8.6c0 1 .8 1.8 1.8 1.8h3.4c1 0 1.8-.8 1.8-1.8V32c0-1-.8-1.8-1.8-1.8h-3.4Z"
        fill="rgba(255,255,255,.65)"
      />
      <path
        d="M24.9 35.4c2.4-3 5-4.5 7.1-4.5 2.2 0 4.7 1.6 7.2 4.5 2.1 2.6 4.4 4.2 6.9 4.8"
        stroke="rgba(255,255,255,.85)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M39.1 35.4c-2.4-3-5-4.5-7.1-4.5-2.2 0-4.7 1.6-7.2 4.5-2.1 2.6-4.4 4.2-6.9 4.8"
        stroke="rgba(255,255,255,.85)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
    </svg>
  )
}
