import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <h1 className="loader-title">Monitor kvaliteta vazduha - Novi Pazar</h1>
      <div className="loader-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default Loader;
