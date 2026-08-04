import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { FidelidadPage } from './pages/fidelidad/FidelidadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mi-fidelidad" element={<FidelidadPage />} />
    </Routes>
  );
}

export default App;
