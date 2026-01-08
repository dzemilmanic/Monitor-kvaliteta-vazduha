import { AlertCircle, Wind, Droplets, Cloud, Factory, Flame, Activity, CloudOff } from 'lucide-react';
import './AirQualityDisplay.css';

const AirQualityDisplay = ({ data, loading, error, cityName }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Učitavanje podataka o kvalitetu vazduha...</p>
      </div>
    );
  }

  if (error) {
    const isNoData = error.message.includes('nema dostupnih podataka');
    
    return (
      <div className="error">
        {isNoData ? <CloudOff size={48} /> : <AlertCircle size={48} />}
        <p>{error.message}</p>
        {isNoData && <p className="error-subtext">Pokušajte ponovo kasnije.</p>}
      </div>
    );
  }

  // Check if we have data but all values are null (defensive check)
  const hasNoValues = data && Object.values(data).every(val => 
    val === null || typeof val === 'string' || (typeof val === 'object' && val !== null && Object.values(val).every(v => v === null))
  );

  if (!data || hasNoValues) {
    return (
      <div className="placeholder">
        <Cloud size={64} className="placeholder-icon" />
        <p>Učitavanje...</p>
      </div>
    );
  }

  const getQualityLevel = (pollutant, value) => {
    if (value === null) return { level: 'unknown', color: '#666', label: 'N/A' };

    const limits = {
      pm10: [
        { max: 20, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 40, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 50, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 100, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 150, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ],
      pm2_5: [
        { max: 10, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 20, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 25, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 50, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 75, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ],
      no2: [
        { max: 40, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 90, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 120, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 230, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 340, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ],
      so2: [
        { max: 100, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 200, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 350, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 500, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 750, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ],
      co: [
        { max: 4, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 7, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 10, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 20, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 30, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ],
      ozone: [
        { max: 60, level: 'excellent', color: '#22c55e', label: 'Odličan' },
        { max: 100, level: 'good', color: '#84cc16', label: 'Dobar' },
        { max: 140, level: 'moderate', color: '#eab308', label: 'Umjeren' },
        { max: 180, level: 'poor', color: '#f97316', label: 'Loš' },
        { max: 240, level: 'verypoor', color: '#ef4444', label: 'Vrlo loš' },
        { max: Infinity, level: 'hazardous', color: '#991b1b', label: 'Opasan' }
      ]
    };

    const pollutantLimits = limits[pollutant];
    if (!pollutantLimits) return { level: 'unknown', color: '#666', label: 'N/A' };

    for (const limit of pollutantLimits) {
      if (value <= limit.max) {
        return { level: limit.level, color: limit.color, label: limit.label };
      }
    }

    return { level: 'unknown', color: '#666', label: 'N/A' };
  };

  const getAqiQualityLevel = (aqiValue) => {
    if (aqiValue === null || aqiValue === undefined) return { level: 'unknown', color: '#666', label: 'N/A', description: '' };

    const aqiLevels = [
      { max: 50, level: 'good', color: '#22c55e', label: 'Dobro', description: 'Kvalitet vazduha se smatra zadovoljavajućim, a zagađenje vazduha predstavlja mali ili nikakav rizik' },
      { max: 100, level: 'moderate', color: '#eab308', label: 'Umereno', description: 'Kvalitet zraka je prihvatljiv; Međutim, neki zagađivači mogu imati umjereno zabrinjavajući utjecaj na zdravstveno stanje malog broja ljudi koji su veoma osjetljivi na zagađenje zraka.' },
      { max: 150, level: 'unhealthy-sensitive', color: '#f97316', label: 'Nezdravo za osetljive grupe', description: 'Može prouzrokovati zdravstvene poteškoće kod članova osjetljivih grupa. Većina verovatno neće biti pogođena.' },
      { max: 200, level: 'unhealthy', color: '#ef4444', label: 'Nezdravo', description: 'Svako može početi osjećati posljedice na zdravlje; članovi osjetljivih grupa mogu imati ozbiljnije zdravstvene posljedice' },
      { max: 300, level: 'very-unhealthy', color: '#991b1b', label: 'Veoma nezdravo', description: 'Upozorenja o hitnim slučajevima. Čitava populacija će biti pogođena.' },
      { max: Infinity, level: 'hazardous', color: '#7c2d12', label: 'Opasno', description: 'Zdravstveno upozorenje: svako može osjetiti ozbiljnije posljedice na zdravlje' }
    ];

    for (const level of aqiLevels) {
      if (aqiValue <= level.max) {
        return { level: level.level, color: level.color, label: level.label, description: level.description };
      }
    }

    return { level: 'unknown', color: '#666', label: 'N/A', description: '' };
  };

  const getOverallQuality = () => {
    const pollutants = [
      { name: 'pm10', value: data.pm10 },
      { name: 'pm2_5', value: data.pm2_5 },
      { name: 'no2', value: data.no2 },
      { name: 'so2', value: data.so2 },
      { name: 'co', value: data.co },
      { name: 'ozone', value: data.ozone }
    ];

    let worstLevel = 'excellent';
    let worstColor = '#22c55e';
    let worstLabel = 'Odličan';

    const levelPriority = {
      'excellent': 1,
      'good': 2,
      'moderate': 3,
      'poor': 4,
      'verypoor': 5,
      'hazardous': 6
    };

    pollutants.forEach(p => {
      if (p.value !== null) {
        const quality = getQualityLevel(p.name, p.value);
        if (levelPriority[quality.level] > levelPriority[worstLevel]) {
          worstLevel = quality.level;
          worstColor = quality.color;
          worstLabel = quality.label;
        }
      }
    });

    return { level: worstLevel, color: worstColor, label: worstLabel };
  };

  const overall = getOverallQuality();

  const particlesData = [
    {
      name: 'PM10',
      key: 'pm10',
      value: data.pm10,
      unit: data.units?.pm10 || 'µg/m³',
      icon: Droplets,
      description: 'Krupne čestice'
    },
    {
      name: 'PM2.5',
      key: 'pm2_5',
      value: data.pm2_5,
      unit: data.units?.pm2_5 || 'µg/m³',
      icon: Droplets,
      description: 'Fine čestice'
    }
  ];

  const gasesData = [
    {
      name: 'NO₂',
      key: 'no2',
      value: data.no2,
      unit: data.units?.no2 || 'µg/m³',
      icon: Factory,
      description: 'Azot-dioksid'
    },
    {
      name: 'SO₂',
      key: 'so2',
      value: data.so2,
      unit: data.units?.so2 || 'µg/m³',
      icon: Cloud,
      description: 'Sumpor-dioksid'
    },
    {
      name: 'CO',
      key: 'co',
      value: data.co,
      unit: data.units?.co || 'mg/m³',
      icon: Flame,
      description: 'Ugljik-monoksid'
    },
    {
      name: 'O₃',
      key: 'ozone',
      value: data.ozone,
      unit: data.units?.ozone || 'µg/m³',
      icon: Wind,
      description: 'Ozon'
    }
  ];

  const hasAqi = data.aqi !== null && data.aqi !== undefined;
  const aqiQuality = hasAqi ? getAqiQualityLevel(data.aqi) : null;

  return (
    <div className="air-quality-display">
      <div className="data-source">
        Izvor: <strong>{data.source}</strong>
      </div>

      {hasAqi && (
        <div id="aqi" className={`aqi-status ${aqiQuality.level}`} style={{ borderColor: aqiQuality.color }}>
          <Activity size={64} style={{ color: aqiQuality.color }} />
          <h2 style={{ color: aqiQuality.color }}>AQI Indeks</h2>
          <div className="aqi-value" style={{ color: aqiQuality.color }}>
            {data.aqi}
          </div>
          <div className="aqi-label" style={{ color: aqiQuality.color }}>
            {aqiQuality.label}
          </div>
          <p className="aqi-description">{aqiQuality.description}</p>
        </div>
      )}

      {/* <div id="overall" className={`overall-status ${overall.level}`} style={{ borderColor: overall.color }}>
        <Activity size={64} style={{ color: overall.color }} />
        <h2 style={{ color: overall.color }}>Kvalitet Vazduha</h2>
        <div className="overall-label" style={{ color: overall.color }}>
          {overall.label}
        </div>
      </div> */}

      <div id="particles" className="pollutants-section">
        <h3 className="section-title">Suspendovane čestice</h3>
        <div className="pollutants-grid particles">
          {particlesData.map((pollutant) => {
            const quality = getQualityLevel(pollutant.key, pollutant.value);
            const Icon = pollutant.icon;

            return (
              <div
                key={pollutant.name}
                className={`pollutant-card ${quality.level}`}
                style={{ borderLeftColor: quality.color }}
              >
                <div className="pollutant-header">
                  <Icon size={24} style={{ color: quality.color }} />
                  <h4>{pollutant.name}</h4>
                </div>
                <div className="pollutant-description">{pollutant.description}</div>
                <div className="pollutant-value" style={{ color: quality.color }}>
                  {pollutant.value !== null ? pollutant.value.toFixed(1) : '-'}
                </div>
                <div className="pollutant-unit">{pollutant.unit}</div>
                <div className="pollutant-status" style={{ backgroundColor: quality.color }}>
                  {quality.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cityName !== 'TUTIN' && (
        <div id="gases" className="pollutants-section">
          <h3 className="section-title">Gasovi</h3>
          <div className="pollutants-grid gases">
            {gasesData.map((pollutant) => {
              const quality = getQualityLevel(pollutant.key, pollutant.value);
              const Icon = pollutant.icon;

              return (
                <div
                  key={pollutant.name}
                  className={`pollutant-card ${quality.level}`}
                  style={{ borderLeftColor: quality.color }}
                >
                  <div className="pollutant-header">
                    <Icon size={24} style={{ color: quality.color }} />
                    <h4>{pollutant.name}</h4>
                  </div>
                  <div className="pollutant-description">{pollutant.description}</div>
                  <div className="pollutant-value" style={{ color: quality.color }}>
                    {pollutant.value !== null ? pollutant.value.toFixed(1) : '-'}
                  </div>
                  <div className="pollutant-unit">{pollutant.unit}</div>
                  <div className="pollutant-status" style={{ backgroundColor: quality.color }}>
                    {quality.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reference tables moved to shared ReferenceTablesSection component */}
    </div>
  );
};

export default AirQualityDisplay;
