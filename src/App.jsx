import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Admin from "./Admin";
import Faculty from "./Faculty";
import Student from "./Student";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}


