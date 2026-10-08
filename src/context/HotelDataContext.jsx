import { API_BASE } from "../config/api";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const HotelDataContext = createContext();

export function HotelDataProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/cities`)
      .then((res) => {
        setCities(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const totalCities = cities.length;
  const totalHotels = cities.reduce(
    (acc, item) => acc + (item.hotels_count || 0),
    0
  );

  return (
    <HotelDataContext.Provider
      value={{ cities, totalCities, totalHotels, loading, error }}
    >
      {children}
    </HotelDataContext.Provider>
  );
}

export function useHotelData() {
  return useContext(HotelDataContext);
}