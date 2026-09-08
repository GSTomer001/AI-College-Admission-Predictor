/** Inline spinner; use inside buttons or as a full-page loader. */
export default function Loader({ full = false }) {
  return (
    <div className={full ? "loader-full" : undefined} role="status" aria-label="Loading">
      <span className="loader" />
    </div>
  );
}
