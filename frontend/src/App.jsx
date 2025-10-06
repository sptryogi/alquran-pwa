import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import WritePractice from "./pages/WritePractice";
import ReadPractice from "./pages/ReadPractice";
import ProgressPage from "./pages/ProgressPage";
import ProfileUser from "./pages/ProfileUser";
import Book from "./pages/Book";   // pastikan ini
import Ask from "./pages/Ask";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/write" element={<WritePractice />} />
      <Route path="/read" element={<ReadPractice />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/profile" element={<ProfileUser />} />
      <Route path="/book" element={<Book />} />  {/* tambahkan ini */}
      <Route path="/ask" element={<Ask />} />
      </Routes>
    </Router>
  );
}

export default App;
