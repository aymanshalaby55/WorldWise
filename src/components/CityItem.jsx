import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";
import PropTypes from "prop-types";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity,deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  function handleClick(e){
    e.preventDefault();
    deleteCity(id)
  }
  
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>&times;</button>
      </Link>
    </li>
  );
}

CityItem.propTypes = {
  city: PropTypes.shape({
    cityName: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
};

// CityItem.propTypes = {
//   city: PropTypes.shape({
//     cityName: PropTypes.string.isRequired,
//     emoji: PropTypes.string.isRequired,
//     date: PropTypes.string.isRequired,
//     id: PropTypes.number.isRequired,
//     position: PropTypes.shape({
//       lat: PropTypes.number.isRequired,
//       lng: PropTypes.number.isRequired
//     }).isRequired
//   }).isRequired,
// };

export default CityItem;
