import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Loader from './components/Loader.jsx';
import StationDisplay from './components/StationDisplay.jsx';
import { fetchAirQuality, fetchHistoricalAirQuality } from './api/airQuality';

const CITIES = {
  NOVI_PAZAR: {
    name: 'Novi Pazar',
    stations: [
      { 
        name: 'SEPA Stanica', 
        source: 'SEPA',
        sepaStationId: 71 
      },
      { 
        name: 'Citizen Science', 
        source: 'sensor.community',
        waqiStationId: 12894 
      }
    ]
  },
  TUTIN: {
    name: 'Tutin',
    stations: [
      { 
        name: 'Revolucije', 
        source: 'WAQI',
        waqiStationId: 'A248989'
      },
      { 
        name: 'Pod Gradac', 
        source: 'WAQI',
        waqiStationId: 'A516535'
      }
    ]
  }
};

function App() {
  const [selectedCity, setSelectedCity] = useState('NOVI_PAZAR');
  const [stationsData, setStationsData] = useState({});
  const [stationsLoading, setStationsLoading] = useState({});
  const [stationsError, setStationsError] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [historicalLoading, setHistoricalLoading] = useState({});
  const [historicalError, setHistoricalError] = useState({});

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (!showLoader) {
      const currentCityStations = CITIES[selectedCity].stations;
      
      currentCityStations.forEach((station, index) => {
        const stationKey = `${selectedCity}_${index}`;
        
        // Fetch station data
        setStationsLoading(prev => ({ ...prev, [stationKey]: true }));
        setStationsError(prev => ({ ...prev, [stationKey]: null }));
        
        fetchAirQuality(station)
          .then((data) => {
            setStationsData(prev => ({ ...prev, [stationKey]: data }));
            setStationsLoading(prev => ({ ...prev, [stationKey]: false }));
          })
          .catch((err) => {
            setStationsError(prev => ({ ...prev, [stationKey]: err }));
            setStationsLoading(prev => ({ ...prev, [stationKey]: false }));
          });
        
        // Fetch historical data (only for SEPA stations)
        if (station.sepaStationId) {
          setHistoricalLoading(prev => ({ ...prev, [stationKey]: true }));
          setHistoricalError(prev => ({ ...prev, [stationKey]: null }));
          
          fetchHistoricalAirQuality(station)
            .then((data) => {
              setHistoricalData(prev => ({ ...prev, [stationKey]: data }));
              setHistoricalLoading(prev => ({ ...prev, [stationKey]: false }));
            })
            .catch((err) => {
              setHistoricalError(prev => ({ ...prev, [stationKey]: err }));
              setHistoricalLoading(prev => ({ ...prev, [stationKey]: false }));
            });
        }
      });
    }
  }, [showLoader, selectedCity]);

  useEffect(() => {
    document.title = `Monitor kvaliteta vazduha - ${CITIES[selectedCity].name}`;
  }, [selectedCity]);

  if (showLoader) {
    return <Loader />;
  }

  const currentCity = CITIES[selectedCity];

  return (
    <>
      <Navbar />
      <div className="app-container">
        <header id="header" className="app-header">
          <div className="header-content">
            <div className="header-badge">Uživo</div>
            <h1>Monitor kvaliteta vazduha</h1>
            <div className="city-selector">
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="city-dropdown"
              >
                {Object.entries(CITIES).map(([key, city]) => (
                  <option key={key} value={key}>{city.name}</option>
                ))}
              </select>
            </div>
            <p className="app-subtitle">{currentCity.name} - Uporedna analiza stanica</p>
            <div className="header-pulse"></div>
          </div>
        </header>

        <div className="stations-container">
          {currentCity.stations.map((station, index) => {
            const stationKey = `${selectedCity}_${index}`;
            return (
              <StationDisplay 
                key={stationKey}
                stationName={station.name}
                source={station.source}
                airQualityData={stationsData[stationKey]}
                historicalData={historicalData[stationKey] || null}
                loading={stationsLoading[stationKey]}
                error={stationsError[stationKey]}
                historicalLoading={historicalLoading[stationKey] || false}
                historicalError={historicalError[stationKey] || null}
              />
            );
          })}
        </div>

        <footer className="app-footer">
          <p>Podaci se ažuriraju svaki sat | Izvori: SEPA, WAQI i sensor.community</p>
          <p>Izradio: <a href="https://instagram.com/dzemilmanic" target='blank'>Džemil Manić</a></p>
          <p><a href="https://www.buymeacoffee.com/dzemil" target='blank'>Viči kahvu</a></p>
        </footer>
      </div>
    </>
  );
}

export default App;
