// 

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import Spinner from "./Spinner";

import useUrlPosition from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";

const BaseURL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [mapLat, mapLng] = useUrlPosition();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const {createCity, isLoading} = useCities();
  const [isLoadingGecoding, setIsLoadingGecoding] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    if (!mapLat || !mapLng) return;
    
    async function fetchCityData() {
      try {
        setIsLoadingGecoding(true);
        setError("");
        const res = await fetch(`${BaseURL}?latitude=${mapLat}&longitude=${mapLng}`);
        const data = await res.json();
        console.log(data);
        
        if (!data.countryCode) {
          throw new Error("That doesn't seem to be a valid location. Click somewhere else!");
        }
        
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoadingGecoding(false);
      }
    }
    
    fetchCityData();
  }, [mapLat, mapLng]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!cityName || !date) return;
    
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng }
    };
    
    await createCity(newCity);
    navigate('/app/cities');
  }

  if(isLoadingGecoding){
    return <Spinner/>
  }

  if(error){
    return <div className={styles.error}>{error}</div>
  }
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>

      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
       <DatePicker onChange={(date)=>setDate(date)} selected={date}/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
