import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header";
import ControlPanel from "./components/Control";
import HomePage from "./components/homepage";
import Terms from "./terms";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import { AuthProvider } from "./components/AuthContext";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <AuthProvider>
     <Router>  
      <Header />  
      <Routes>  
        <Route path="/" element={<HomePage />} />  
        <Route path="/work" element={<ControlPanel />} />  
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
      </Routes>  
    </Router>  
    </AuthProvider>
  </React.StrictMode>
);
