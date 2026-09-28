/**
 * Flag of India (tiranga) drawn to the official 3:2 proportions with the
 * 24-spoke Ashoka Chakra in navy blue. Used as a small "Made in India"
 * badge — not as part of the product logo or trademark.
 */
export function IndiaFlag({ className, title = "Flag of India" }: { className?: string; title?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);
  return (
    <svg viewBox="0 0 90 60" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="90" height="20" fill="#FF9933" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#138808" />
      <g transform="translate(45 30)" stroke="#000080" fill="none">
        <circle r="9.25" strokeWidth="1.1" />
        <circle r="1.6" fill="#000080" stroke="none" />
        {spokes.map((a) => (
          <line key={a} x1="0" y1="0" x2="0" y2="-9" strokeWidth="0.45" transform={`rotate(${a})`} />
        ))}
      </g>
      <rect width="90" height="60" fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="0.75" />
    </svg>
  );
}
