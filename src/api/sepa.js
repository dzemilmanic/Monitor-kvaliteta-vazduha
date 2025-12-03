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
