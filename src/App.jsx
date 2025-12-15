import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Loader from './components/Loader.jsx';
import AirQualityDisplay from './components/AirQualityDisplay.jsx';
import HistoricalDataDisplay from './components/HistoricalDataDisplay.jsx';
import { fetchAirQuality, fetchHistoricalAirQuality } from './api/airQuality';

const NOVI_PAZAR = { name: 'Novi Pazar', lat: 43.1367, lng: 20.5122, sepaStationId: 71 };

function App() {
  const [airQualityData, setAirQualityData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalError, setHistoricalError] = useState(null);
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
      
      // Dohvatanje istorijskih podataka
      setHistoricalLoading(true);
      setHistoricalError(null);
      fetchHistoricalAirQuality(NOVI_PAZAR)
        .then((data) => {
          setHistoricalData(data);
          setHistoricalLoading(false);
        })
        .catch((err) => {
          setHistoricalError(err);
          setHistoricalLoading(false);
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
    <>
      <Navbar />
      <div className="app-container">
        <header id="header" className="app-header">
          <div className="header-content">
            <div className="header-badge">Uživo</div>
            <h1>Monitor kvaliteta vazduha</h1>
            <p className="app-subtitle">Novi Pazar - Praćenje zagađenja u realnom vremenu</p>
            <div className="header-pulse"></div>
          </div>
        </header>
        <AirQualityDisplay data={airQualityData} loading={loading} error={error} />
        <HistoricalDataDisplay 
          historicalData={historicalData} 
          loading={historicalLoading} 
          error={historicalError} 
        />
        <footer className="app-footer">
          <p>Podaci se ažuriraju svaki sat | Izvor: SEPA (Agencija za zaštitu životne sredine)</p>
          <p>Izradio: <a href="https://instagram.com/dzemilmanic" target='blank'>Džemil Manić</a></p>
          <p><a href="https://www.buymeacoffee.com/dzemil" target='blank'>Viči kahvu</a></p>
        </footer>
      </div>
    </>
  );
}

export default App;
