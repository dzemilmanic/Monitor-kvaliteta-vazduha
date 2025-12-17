export const fetchWaqiMeasurements = async (stationId, token) => {
  try {
    // Podrška za alphanumeričke ID-ove (npr. A248989) i numeričke (npr. 12894)
    const idPrefix = typeof stationId === 'string' && stationId.startsWith('A') ? '' : '@';
    const response = await fetch(`https://api.waqi.info/feed/${idPrefix}${stationId}/?token=${token}`);
    if (!response.ok) {
      throw new Error('Neuspješno dohvatanje WAQI podataka');
    }
    const data = await response.json();
    console.log("RAW WAQI RESPONSE:", data);

    if (data.status !== 'ok') {
      throw new Error('WAQI API vratilo grešku');
    }

    return normalizeWaqiData(data.data);
  } catch (error) {
    console.error('Greška pri dohvatanju WAQI podataka:', error);
    throw error;
  }
};

const normalizeWaqiData = (data) => {
  const result = {
    source: 'sensor.community (WAQI)',
    aqi: data.aqi !== '-' ? parseFloat(data.aqi) : null,
    pm10: null,
    pm2_5: null,
    co: null,
    no2: null,
    so2: null,
    ozone: null,
    units: {},
    timestamp: data.time?.s || null
  };

  // WAQI vraća podatke u iaqi objektu, gdje svaki zagađivač ima {v: value}
  if (data.iaqi) {
    if (data.iaqi.pm25) {
      result.pm2_5 = data.iaqi.pm25.v;
      result.units.pm2_5 = 'µg/m³';
    }
    if (data.iaqi.pm10) {
      result.pm10 = data.iaqi.pm10.v;
      result.units.pm10 = 'µg/m³';
    }
    if (data.iaqi.no2) {
      result.no2 = data.iaqi.no2.v;
      result.units.no2 = 'µg/m³';
    }
    if (data.iaqi.so2) {
      result.so2 = data.iaqi.so2.v;
      result.units.so2 = 'µg/m³';
    }
    if (data.iaqi.co) {
      result.co = data.iaqi.co.v;
      result.units.co = 'mg/m³';
    }
    if (data.iaqi.o3) {
      result.ozone = data.iaqi.o3.v;
      result.units.ozone = 'µg/m³';
    }
  }

  return result;
};
