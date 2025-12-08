import { useState } from "react";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./component/CustomNavbar";
import HomePage from "./component/HomePage";
import ManageProjects from "./component/ManageProjects";
import Projects from "./component/Projects";
import Contact from "./component/Contact";
import Login from "./component/Login";
import AboutUs from "./component/AboutUs";
import BuildYourProject from "./component/BuildYourProject";
import ProjectDetailss from "./component/ProjectDetailss";
import Footer from "./component/Footer";
import ManageRequests from "./component/ManageRequests";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <Router>
      <CustomNavbar isOwnerLoggedIn={isAdminLoggedIn} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manage-projects" element={<ManageProjects />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setAdminLogin={setIsAdminLoggedIn}/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/buildyourproject" element={<BuildYourProject/>} />
        <Route path="/projects/:id" element={<ProjectDetailss/>} />
        <Route path="/manage-requests" element={<ManageRequests />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
