import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Create_ticket from './pages/create_ticket/create_ticket';
import Myticket from './pages/myticket/myticket';
import Update_status from './pages/update_status/update_status';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<Create_ticket />} />
        <Route path="/myticket" element={<Myticket />} />
        <Route path="/" element={<Update_status />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
