export default function Admin() {
  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      <h5 className="mt-3">Upload Results</h5>
      <input type="file" className="form-control mb-3" />

      <h5>Message Template</h5>
      <textarea className="form-control mb-3" rows="3">
Dear Student, your result is published.
      </textarea>

      <h5>Notification Logs</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ritik</td>
            <td>Sent</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


