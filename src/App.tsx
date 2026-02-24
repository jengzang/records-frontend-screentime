import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Trends from './pages/Trends';
import Categories from './pages/Categories';
import CrossDeviceAnalysis from './pages/CrossDeviceAnalysis';
import WorkLifeBalance from './pages/WorkLifeBalance';
import TimeAllocation from './pages/TimeAllocation';
import UserProfile from './pages/UserProfile';
import AppEcosystem from './pages/AppEcosystem';

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
          <Route path="/time-allocation" element={<TimeAllocation />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/app-ecosystem" element={<AppEcosystem />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
