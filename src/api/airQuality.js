import { fetchSepaMeasurements, fetchSepaHistoricalMeasurements } from './sepa';
import { fetchWaqiMeasurements } from './waqi';

export const fetchAirQuality = async (city) => {
  try {
    if (city.sepaStationId) {
      console.log('Dohvatanje podataka iz SEPA za stanicu:', city.sepaStationId);
      const measurements = await fetchSepaMeasurements(city.sepaStationId);
      console.log('SEPA mjerenja:', measurements);
      if (!measurements || measurements.length === 0) {
        throw new Error('Stanica za merenje kvaliteta vazduha trenutno nije u funkciji.');
      }
      return normalizeSepaData(measurements);
    } else if (city.waqiStationId) {
      console.log('Dohvatanje podataka iz WAQI za stanicu:', city.waqiStationId);
      const token = import.meta.env.VITE_WAQI_TOKEN;
      if (!token) {
        throw new Error('WAQI API token nije konfigurisan');
      }
      const data = await fetchWaqiMeasurements(city.waqiStationId, token);
      console.log('WAQI podaci:', data);
      return data;
    } else if (city.lat && city.lng) {
      console.log('Dohvatanje podataka iz Open-Meteo za:', city.lat, city.lng);
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
      );
      if (!response.ok) {
        throw new Error('Neuspješno dohvatanje podataka o kvalitetu vazduha iz Open-Meteo');
      }
      const data = await response.json();
      console.log('Open-Meteo podaci:', data);
      return normalizeOpenMeteoData(data);
    } else {
      throw new Error('Nevažeći podaci grada: nedostaju koordinate ili ID stanice');
    }
  } catch (error) {
    console.error('Greška pri dohvatanju podataka o kvalitetu vazduha:', error);
    throw error;
  }
};

const normalizeSepaData = (measurements) => {
  const result = {
    source: 'SEPA',
    aqi: null,
    pm10: null,
    pm2_5: null,
    co: null,
    no2: null,
    so2: null,
    ozone: null,
    units: {}
  };

  measurements.forEach(m => {
    const val = m.k_aop_value;
    switch (m.k_component_id) {
      case 5:
        result.pm10 = val;
        result.units.pm10 = 'µg/m³';
        break;
      case 6001:
        result.pm2_5 = val;
        result.units.pm2_5 = 'µg/m³';
        break;
      case 8:
        result.no2 = val;
        result.units.no2 = 'µg/m³';
        break;
      case 1:
        result.so2 = val;
        result.units.so2 = 'µg/m³';
        break;
      case 10:
        result.co = val;
        result.units.co = 'mg/m³';
        break;
      case 7:
        result.ozone = val;
        result.units.ozone = 'µg/m³';
        break;
      default:
        break;
    }
  });

  return result;
};

const normalizeOpenMeteoData = (data) => {
  const { current, current_units } = data;
  return {
    source: 'Open-Meteo',
    aqi: current.us_aqi,
    pm10: current.pm10,
    pm2_5: current.pm2_5,
    co: current.carbon_monoxide,
    no2: current.nitrogen_dioxide,
    so2: current.sulphur_dioxide,
    ozone: current.ozone,
    units: {
      pm10: current_units.pm10,
      pm2_5: current_units.pm2_5,
      co: current_units.carbon_monoxide,
      no2: current_units.nitrogen_dioxide,
      so2: current_units.sulphur_dioxide,
      ozone: current_units.ozone
    }
  };
};

export const fetchHistoricalAirQuality = async (city) => {
  try {
    if (city.sepaStationId) {
      console.log('Dohvatanje istorijskih podataka iz SEPA za stanicu:', city.sepaStationId);
      const hourlyData = await fetchSepaHistoricalMeasurements(city.sepaStationId);
      
      // Normalizujemo podatke za svaki sat
      const normalizedHistory = hourlyData.map(hourData => {
        if (!hourData.hasData) {
          return {
            timestamp: hourData.timestamp,
            hasData: false,
            data: null
          };
        }
        
        return {
          timestamp: hourData.timestamp,
          hasData: true,
          data: normalizeSepaData(hourData.measurements)
        };
      });
      
      return normalizedHistory;
    } else {
      // Za Open-Meteo ne podržavamo istorijske podatke
      return [];
    }
  } catch (error) {
    console.error('Greška pri dohvatanju istorijskih podataka:', error);
    throw error;
  }
};
