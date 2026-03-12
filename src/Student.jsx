export default function Student() {
  return (
    <div className="container mt-4">
      <h2>Student Result</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DBMS</td>
            <td>85</td>
            <td>A</td>
          </tr>
        </tbody>
      </table>

      <h5>Notification History</h5>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Today</td>
            <td>Sent</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

