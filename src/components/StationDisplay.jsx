import AirQualityDisplay from './AirQualityDisplay.jsx';
import HistoricalDataDisplay from './HistoricalDataDisplay.jsx';
import './StationDisplay.css';

const StationDisplay = ({ stationName, source, airQualityData, historicalData, loading, error, historicalLoading, historicalError }) => {
  return (
    <div className="station-display">
      <div className="station-header">
        <h2 className="station-name">{stationName}</h2>
        <div className="station-source-badge">{source}</div>
      </div>
      <AirQualityDisplay data={airQualityData} loading={loading} error={error} />
      {historicalData && (
        <HistoricalDataDisplay 
          historicalData={historicalData} 
          loading={historicalLoading} 
          error={historicalError} 
        />
      )}
    </div>
  );
};

export default StationDisplay;
