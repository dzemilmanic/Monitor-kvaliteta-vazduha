import './ReferenceTablesSection.css';

const ReferenceTablesSection = ({ hasAqi = false }) => {
  return (
    <div id="limits" className="reference-tables-section">
      <h3>Granične vrijednosti (WHO smjernice)</h3>

      <div className="tables-grid">
        <div className="info-table">
          <h4>Suspendovane čestice</h4>
          <table>
            <thead>
              <tr>
                <th>Nivo</th>
                <th>PM10 (µg/m³)</th>
                <th>PM2.5 (µg/m³)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="excellent-row">
                <td>Odličan</td>
                <td>&lt; 20</td>
                <td>&lt; 10</td>
              </tr>
              <tr className="good-row">
                <td>Dobar</td>
                <td>20-40</td>
                <td>10-20</td>
              </tr>
              <tr className="moderate-row">
                <td>Umjeren</td>
                <td>40-50</td>
                <td>20-25</td>
              </tr>
              <tr className="poor-row">
                <td>Loš</td>
                <td>50-100</td>
                <td>25-50</td>
              </tr>
              <tr className="verypoor-row">
                <td>Vrlo loš</td>
                <td>100-150</td>
                <td>50-75</td>
              </tr>
              <tr className="hazardous-row">
                <td>Opasan</td>
                <td>&gt; 150</td>
                <td>&gt; 75</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-table">
          <h4>Gasovi</h4>
          <table>
            <thead>
              <tr>
                <th>Nivo</th>
                <th>NO₂ (µg/m³)</th>
                <th>SO₂ (µg/m³)</th>
                <th>O₃ (µg/m³)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="excellent-row">
                <td>Odličan</td>
                <td>&lt; 40</td>
                <td>&lt; 100</td>
                <td>&lt; 60</td>
              </tr>
              <tr className="good-row">
                <td>Dobar</td>
                <td>40-90</td>
                <td>100-200</td>
                <td>60-100</td>
              </tr>
              <tr className="moderate-row">
                <td>Umjeren</td>
                <td>90-120</td>
                <td>200-350</td>
                <td>100-140</td>
              </tr>
              <tr className="poor-row">
                <td>Loš</td>
                <td>120-230</td>
                <td>350-500</td>
                <td>140-180</td>
              </tr>
              <tr className="verypoor-row">
                <td>Vrlo loš</td>
                <td>230-340</td>
                <td>500-750</td>
                <td>180-240</td>
              </tr>
              <tr className="hazardous-row">
                <td>Opasan</td>
                <td>&gt; 340</td>
                <td>&gt; 750</td>
                <td>&gt; 240</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {hasAqi && (
        <div id="aqi-table" className="aqi-index-info">
          <h4>AQI Indeks Vrednosti</h4>
          <table className="aqi-table">
            <thead>
              <tr>
                <th>AQI Raspon</th>
                <th>Nivo</th>
                <th>Opis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="good-row">
                <td>0 - 50</td>
                <td>Dobro</td>
                <td>Kvalitet vazduha se smatra zadovoljavajućim, a zagađenje vazduha predstavlja mali ili nikakav rizik</td>
              </tr>
              <tr className="moderate-row">
                <td>51 - 100</td>
                <td>Umereno</td>
                <td>Kvalitet zraka je prihvatljiv; Međutim, neki zagađivači mogu imati umjereno zabrinjavajući utjecaj na zdravstveno stanje malog broja ljudi koji su veoma osjetljivi na zagađenje zraka.</td>
              </tr>
              <tr className="unhealthy-sensitive-row">
                <td>101 - 150</td>
                <td>Nezdravo za osetljive grupe</td>
                <td>Može prouzrokovati zdravstvene poteškoće kod članova osjetljivih grupa. Većina verovatno neće biti pogođena.</td>
              </tr>
              <tr className="unhealthy-row">
                <td>151 - 200</td>
                <td>Nezdravo</td>
                <td>Svako može početi osjećati posljedice na zdravlje; članovi osjetljivih grupa mogu imati ozbiljnije zdravstvene posljedice</td>
              </tr>
              <tr className="very-unhealthy-row">
                <td>201 - 300</td>
                <td>Veoma nezdravo</td>
                <td>Upozorenja o hitnim slučajevima. Čitava populacija će biti pogođena.</td>
              </tr>
              <tr className="hazardous-row">
                <td>300+</td>
                <td>Opasno</td>
                <td>Zdravstveno upozorenje: svako može osjetiti ozbiljnije posljedice na zdravlje</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div id="health" className="health-info">
        <h4>Zdravstvene preporuke</h4>
        <div className="health-grid">
          <div className="health-item excellent-bg">
            <strong>Odličan:</strong> Idealan za sve aktivnosti na otvorenom
          </div>
          <div className="health-item good-bg">
            <strong>Dobar:</strong> Prihvatljiv kvalitet vazduha za sve grupe
          </div>
          <div className="health-item moderate-bg">
            <strong>Umjeren:</strong> Osjetljive osobe treba da smanje aktivnosti na otvorenom
          </div>
          <div className="health-item poor-bg">
            <strong>Loš:</strong> Ograničite aktivnosti na otvorenom
          </div>
          <div className="health-item verypoor-bg">
            <strong>Vrlo loš:</strong> Izbjegavajte aktivnosti na otvorenom
          </div>
          <div className="health-item hazardous-bg">
            <strong>Opasan:</strong> Ostanite u zatvorenom prostoru
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceTablesSection;
