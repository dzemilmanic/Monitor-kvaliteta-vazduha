export const fetchSepaMeasurements = async (stationId) => {
  try {
    const response = await fetch('https://opendata.kosava.cloud/1/measurements/last_hour');
    if (!response.ok) {
      throw new Error('Neuspješno dohvatanje SEPA podataka');
    }
    const data = await response.json();
    console.log("RAW SEPA RESPONSE:", data);

    const stationMeasurements = data.filter(
      (m) => m.k_station_id === stationId
    );

    return stationMeasurements;
  } catch (error) {
    console.error('Greška pri dohvatanju SEPA podataka:', error);
    throw error;
  }
};

export const fetchSepaHistoricalMeasurements = async (stationId) => {
  try {
    // Trenutno vreme
    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    
    // Kreiramo niz sati za poslednjih 5 sati
    const hours = [];
    for (let i = 0; i <= 5; i++) {
      const hourTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push(hourTime);
    }

    // Dohvatamo podatke - API vraća podatke sa vremenskim oznakama
    const response = await fetch('https://opendata.kosava.cloud/1/measurements/last_hour');
    if (!response.ok) {
      throw new Error('Neuspješno dohvatanje istorijskih SEPA podataka');
    }
    const data = await response.json();
    
    const stationMeasurements = data.filter(
      (m) => m.k_station_id === stationId
    );

    // Grupisanje po satu
    const hourlyData = hours.map(hourTime => {
      const hourKey = hourTime.toISOString().substring(0, 13); // YYYY-MM-DDTHH
      
      // Filtriramo merenja za ovaj sat
      const measurementsForHour = stationMeasurements.filter(m => {
        if (!m.k_aop_date) return false;
        const measurementTime = new Date(m.k_aop_date);
        const measurementHour = measurementTime.toISOString().substring(0, 13);
        return measurementHour === hourKey;
      });

      return {
        timestamp: hourTime,
        measurements: measurementsForHour,
        hasData: measurementsForHour.length > 0
      };
    });

    return hourlyData;
  } catch (error) {
    console.error('Greška pri dohvatanju istorijskih SEPA podataka:', error);
    throw error;
  }
};
