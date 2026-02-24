import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Trends from './pages/Trends';
import Categories from './pages/Categories';
import CrossDeviceAnalysis from './pages/CrossDeviceAnalysis';
import WorkLifeBalance from './pages/WorkLifeBalance';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cross-device" element={<CrossDeviceAnalysis />} />
          <Route path="/work-life-balance" element={<WorkLifeBalance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
