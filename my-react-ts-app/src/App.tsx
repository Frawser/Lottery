import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Lottery from "./pages/Lottery";
import React from "react";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Lottery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
