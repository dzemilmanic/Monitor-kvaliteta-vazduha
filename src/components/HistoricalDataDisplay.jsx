import { Clock, CloudOff } from 'lucide-react';
import './HistoricalDataDisplay.css';

const HistoricalDataDisplay = ({ historicalData, loading, error }) => {
  if (loading) {
    return (
      <div className="historical-loading">
        <div className="spinner"></div>
        <p>Učitavanje istorijskih podataka...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historical-error">
        <CloudOff size={32} />
        <p>Nije moguće učitati istorijske podatke</p>
      </div>
    );
  }

  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const getQualityColor = (pollutant, value) => {
    if (value === null) return '#666';

    const limits = {
      pm10: [20, 40, 50, 100, 150],
      pm2_5: [10, 20, 25, 50, 75],
      no2: [40, 90, 120, 230, 340],
      so2: [100, 200, 350, 500, 750],
      co: [4, 7, 10, 20, 30],
      ozone: [60, 100, 140, 180, 240]
    };

    const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#991b1b'];
    const pollutantLimits = limits[pollutant];
    
    if (!pollutantLimits) return '#666';

    for (let i = 0; i < pollutantLimits.length; i++) {
      if (value <= pollutantLimits[i]) {
        return colors[i];
      }
    }

    return colors[colors.length - 1];
  };

  return (
    <div className="historical-data-section">
      <h3 className="historical-title">
        <Clock size={24} />
        Podaci iz poslednjih 5 sati
      </h3>
      
      <div className="historical-table-container">
        <table className="historical-table">
          <thead>
            <tr>
              <th>Vreme</th>
              <th>PM10<br/><span className="unit-label">µg/m³</span></th>
              <th>PM2.5<br/><span className="unit-label">µg/m³</span></th>
            </tr>
          </thead>
          <tbody>
            {historicalData.map((hourData, index) => {
              const isNoData = !hourData.hasData || !hourData.data;
              
              return (
                <tr key={index} className={isNoData ? 'no-data-row' : ''}>
                  <td className="time-cell">
                    {formatDateTime(hourData.timestamp)}
                  </td>
                  {isNoData ? (
                    <td colSpan="2" className="no-data-cell">
                      <CloudOff size={16} />
                      <span>Stanica nije radila</span>
                    </td>
                  ) : (
                    <>
                      <td style={{ color: getQualityColor('pm10', hourData.data.pm10) }}>
                        {hourData.data.pm10 !== null ? hourData.data.pm10.toFixed(1) : '-'}
                      </td>
                      <td style={{ color: getQualityColor('pm2_5', hourData.data.pm2_5) }}>
                        {hourData.data.pm2_5 !== null ? hourData.data.pm2_5.toFixed(1) : '-'}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricalDataDisplay;
