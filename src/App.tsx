import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { FidelidadPage } from './pages/fidelidad/FidelidadPage';
import { ResetearPasswordPage } from './pages/fidelidad/ResetearPasswordPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mi-fidelidad" element={<FidelidadPage />} />
      <Route path="/mi-fidelidad/" element={<FidelidadPage />} />
      <Route path="/mi-fidelidad/resetear" element={<ResetearPasswordPage />} />
    </Routes>
  );
}

export default App;
