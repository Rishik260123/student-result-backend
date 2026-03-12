export default function Faculty() {
  return (
    <div className="container mt-4">
      <h2>Faculty Panel</h2>

      <select className="form-control mb-3">
        <option>DBMS</option>
        <option>AI</option>
      </select>

      <input className="form-control mb-3" placeholder="Student ID" />
      <input className="form-control mb-3" placeholder="Marks" />

      <button className="btn btn-success">Submit Marks</button>
    </div>
  );
}

