import { useState, useEffect } from 'react';
import './App.css';
import Loader from './components/Loader.jsx';
import AirQualityDisplay from './components/AirQualityDisplay.jsx';
import { fetchAirQuality } from './api/airQuality';

const NOVI_PAZAR = { name: 'Novi Pazar', lat: 43.1367, lng: 20.5122, sepaStationId: 71 };

function App() {
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (!showLoader) {
      setLoading(true);
      setError(null);
      fetchAirQuality(NOVI_PAZAR)
        .then((data) => {
          setAirQualityData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [showLoader]);

  useEffect(() => {
    document.title = 'Monitor kvaliteta vazduha - Novi Pazar';
  }, []);

  if (showLoader) {
    return <Loader />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-badge">Uživo</div>
          <h1>Monitor kvaliteta vazduha</h1>
          <p className="app-subtitle">Novi Pazar - Praćenje zagađenja u realnom vremenu</p>
          <div className="header-pulse"></div>
        </div>
      </header>
      <AirQualityDisplay data={airQualityData} loading={loading} error={error} />
      <footer className="app-footer">
        <p>Podaci se ažuriraju svaki sat | Izvor: SEPA (Agencija za zaštitu životne sredine)</p>
        <p>Izradio: <a href="https://instagram.com/dzemilmanic" target='blank'>Džemil Manić</a></p>
      </footer>
    </div>
  );
}

export default App;
