import { useEffect, useState } from "react";
import Button from "./components/Button";

const apiKey = import.meta.env.VITE_API_KEY;

function App() {
  const [coordinates, setCoordinates] = useState(null);
  const [mayPasok, setMayPasok] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [rain, setRain] = useState(null);
  const [rainColor, setRainColor] = useState("");
  const [wind, setWind] = useState(null);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setCoordinates({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error(`Error getting location: ${error.message}`);
        },
        {
          // enableHighAccuracy: true,
          // timeout: 5000,
          // maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "May Pasok Ba?",
        url: "www.maypasokba.test",
      });
      console.log("Content shared successfully!");
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  useEffect(() => {
    if (coordinates) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();

          setTemperature(data.main.temp - 273.15);
          setLocation(data.name);
          setWind(data.wind.speed * 3.6);
          setRain(data.rain["1h"]);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [coordinates]);

  useEffect(() => {
    if (wind >= 30 && wind <= 60) {
      setStatus("Signal #1");
      setMayPasok(false);
    }
  }, [wind]);

  useEffect(() => {
    if (rain > 30) {
      setRainColor("red");
      setMayPasok(false);
    } else if (rain > 15) {
      setRainColor("orange");
      setMayPasok(false);
    } else if (rain > 7.5) {
      setRainColor("yellow");
    } else {
      setRainColor("");
    }
  }, [rain]);

  return (
    <div className=" border-red-200 flex flex-col h-screen">
      <header className="bg-blue-400 p-4">
        <div>May Pasok Ba? (v2)</div>
      </header>

      <main className="flex flex-col grow">
        <div className="bg-blue-400">
          <h1 className="text-white text-5xl font-bold uppercase mb-4 p-4">
            <p>Weather</p>
            <p>Alert</p>
          </h1>
        </div>

        {isLoading && (
          <p className="flex items-center justify-center h-full text-3xl">
            Loading...
          </p>
        )}

        {location && (
          <>
            <div className="bg-blue-400 grid grid-cols-2">
              <div className="p-4 flex flex-col justify-center items-center gap-2">
                <p className="text-white text-4xl font-bold">
                  {temperature.toFixed(0)} °C
                </p>
                <p className="text-white uppercase font-bold">{location}</p>
              </div>
              <div className=" p-4  flex items-center justify-center">
                <i className="fa-solid fa-cloud text-7xl text-white"></i>
              </div>
            </div>

            <div className="grid grid-cols-2 text-white">
              <div className="bg-gray-400 p-8">
                <h3 className="uppercase font-bold mb-4 text-3xl">Wind</h3>
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-wind text-4xl"></i>
                  <p className="text-2xl">{wind.toFixed(2)} km/h</p>
                </div>
              </div>
              <div className="bg-blue-500 p-8">
                <h3 className="uppercase font-bold mb-4 text-3xl">Rain</h3>
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-cloud-showers-heavy text-4xl"></i>
                  <p className="text-2xl"> {rain} mm (last hour)</p>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-orange-200">
              {status || rainColor ? (
                <div>
                  <p className="mb-4 text-2xl uppercase font-bold">Signal #1</p>
                  <div
                    className={`space-x-2 p-4 text-white bg-${rainColor}-400`}
                  >
                    <span className="uppercase font-bold">{rainColor}</span>
                    <span>warning</span>
                    <span>|</span>
                    <span>Lumikas</span>
                  </div>
                </div>
              ) : (
                <p>No Tropical Cyclone Warning</p>
              )}
            </div>

            <div
              className={`text-center py-12 grow flex flex-col items-center justify-center ${
                mayPasok ? "bg-green-400" : "bg-red-400"
              }`}
            >
              <h3 className="font-bold text-4xl mb-4 text-white">
                May Pasok Ba?
              </h3>
              <p className="text-3xl text-white uppercase">
                {mayPasok ? "Meron" : "Wala"}
              </p>
            </div>
          </>
        )}

        <div className="flex bg-gray-300 gap-2 mt-auto justify-center py-4">
          <Button onClick={handleGetLocation}>
            <i className="fa-solid fa-location-dot mr-2"></i>
            <span>Get location</span>
          </Button>
          <Button onClick={handleRefresh}>
            <i className="fa-solid fa-arrows-rotate mr-2"></i>
            <span>Refresh</span>
          </Button>
          <Button onClick={handleShare}>
            <i className="fa-solid fa-share mr-2"></i>
            <span>Share</span>
          </Button>
        </div>
      </main>

      <footer className="bg-gray-400 text-center p-4 mt-auto">
        <p>May Pasok Ba - 2024</p>
      </footer>
    </div>
  );
}

export default App;
