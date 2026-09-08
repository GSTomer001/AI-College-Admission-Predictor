/** Visual 0..1 probability bar. */
export default function ProbabilityBar({ value = 0 }) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  return (
    <div className="probability-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}
