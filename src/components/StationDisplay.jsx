import AirQualityDisplay from './AirQualityDisplay.jsx';
import './StationDisplay.css';

const StationDisplay = ({ stationName, source, airQualityData, loading, error }) => {
  return (
    <div className="station-display">
      <div className="station-header">
        <h2 className="station-name">{stationName}</h2>
        <div className="station-source-badge">{source}</div>
      </div>
      <AirQualityDisplay data={airQualityData} loading={loading} error={error} source={source} />
    </div>
  );
};

export default StationDisplay;
