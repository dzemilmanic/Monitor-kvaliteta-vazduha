import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Loader from './components/Loader.jsx';
import StationDisplay from './components/StationDisplay.jsx';
import { fetchAirQuality, fetchHistoricalAirQuality } from './api/airQuality';

const SEPA_STATION = { 
  name: 'SEPA Stanica', 
  source: 'SEPA',
  sepaStationId: 71 
};

const WAQI_STATION = { 
  name: 'Citizen Science', 
  source: 'sensor.community',
  waqiStationId: 12894 
};

function App() {
  // SEPA station state
  const [sepaData, setSepaData] = useState(null);
  const [sepaHistoricalData, setSepaHistoricalData] = useState(null);
  const [sepaLoading, setSepaLoading] = useState(false);
  const [sepaHistoricalLoading, setSepaHistoricalLoading] = useState(false);
  const [sepaError, setSepaError] = useState(null);
  const [sepaHistoricalError, setSepaHistoricalError] = useState(null);

  // WAQI station state
  const [waqiData, setWaqiData] = useState(null);
  const [waqiLoading, setWaqiLoading] = useState(false);
  const [waqiError, setWaqiError] = useState(null);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (!showLoader) {
      // Fetch SEPA station data
      setSepaLoading(true);
      setSepaError(null);
      fetchAirQuality(SEPA_STATION)
        .then((data) => {
          setSepaData(data);
          setSepaLoading(false);
        })
        .catch((err) => {
          setSepaError(err);
          setSepaLoading(false);
        });
      
      // Fetch SEPA historical data
      setSepaHistoricalLoading(true);
      setSepaHistoricalError(null);
      fetchHistoricalAirQuality(SEPA_STATION)
        .then((data) => {
          setSepaHistoricalData(data);
          setSepaHistoricalLoading(false);
        })
        .catch((err) => {
          setSepaHistoricalError(err);
          setSepaHistoricalLoading(false);
        });

      // Fetch WAQI station data
      setWaqiLoading(true);
      setWaqiError(null);
      fetchAirQuality(WAQI_STATION)
        .then((data) => {
          setWaqiData(data);
          setWaqiLoading(false);
        })
        .catch((err) => {
          setWaqiError(err);
          setWaqiLoading(false);
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
            <p className="app-subtitle">Novi Pazar - Uporedna analiza stanica</p>
            <div className="header-pulse"></div>
          </div>
        </header>

        <div className="stations-container">
          <StationDisplay 
            stationName={SEPA_STATION.name}
            source={SEPA_STATION.source}
            airQualityData={sepaData}
            historicalData={sepaHistoricalData}
            loading={sepaLoading}
            error={sepaError}
            historicalLoading={sepaHistoricalLoading}
            historicalError={sepaHistoricalError}
          />
          
          <StationDisplay 
            stationName={WAQI_STATION.name}
            source={WAQI_STATION.source}
            airQualityData={waqiData}
            historicalData={null}
            loading={waqiLoading}
            error={waqiError}
            historicalLoading={false}
            historicalError={null}
          />
        </div>

        <footer className="app-footer">
          <p>Podaci se ažuriraju svaki sat | Izvori: SEPA i sensor.community</p>
          <p>Izradio: <a href="https://instagram.com/dzemilmanic" target='blank'>Džemil Manić</a></p>
          <p><a href="https://www.buymeacoffee.com/dzemil" target='blank'>Viči kahvu</a></p>
        </footer>
      </div>
    </>
  );
}

export default App;
