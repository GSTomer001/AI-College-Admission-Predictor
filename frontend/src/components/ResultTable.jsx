/** Generic table renderer for results / college matches. */
export default function ResultTable({ columns, rows, emptyMessage = "No data yet." }) {
  if (!rows || rows.length === 0) {
    return <p className="subtitle">{emptyMessage}</p>;
  }
  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table className="result-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
