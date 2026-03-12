import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="container col-4 mt-5">
      <h3 className="mb-4">Student Result Alert System</h3>

      <input className="form-control mb-3" placeholder="Email" />

      <select id="role" className="form-control mb-3">
        <option>Admin</option>
        <option>Faculty</option>
        <option>Student</option>
      </select>

      <button
        className="btn btn-primary w-100"
        onClick={() =>
          navigate("/" + document.getElementById("role").value.toLowerCase())
        }
      >
        Login
      </button>
    </div>
  );
}
