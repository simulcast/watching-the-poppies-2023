import React, { useState, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import AudioPlayer from "./components/AudioPlayer";
import AboutModal from "./components/AboutModal";
import Chat from "./components/Chat";
import "./App.css";
import "regenerator-runtime/runtime"; // Required for async/await to work with Babel

function App() {
  const [timeOfDayBucket, setTimeOfDayBucket] = useState("");
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  useEffect(() => {
    async function initializeTimeOfDayBucket() {
      setTimeOfDayBucket(await getTimeOfDayBucket());
    }

    initializeTimeOfDayBucket();
    scheduleTimeOfDayBucketUpdate();
  }, []);

  useEffect(() => {
    scheduleTimeOfDayBucketUpdate();
  }, []);

  async function getTimeOfDayBucket() {
    const southernCaliforniaCoordinates = {
      latitude: 34.052235,
      longitude: -118.243683,
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${southernCaliforniaCoordinates.latitude}&lng=${southernCaliforniaCoordinates.longitude}&date=${formattedDate}&formatted=0`
    );
    const data = await response.json();

    const sunrise = new Date(data.results.sunrise);
    const sunset = new Date(data.results.sunset);
    const dawn = new Date(sunrise.getTime() - 60 * 60 * 1000); // 1 hour before sunrise
    const dusk = new Date(sunset.getTime() + 60 * 60 * 1000); // 1 hour after sunset

    if (currentDate >= dawn && currentDate < sunrise) {
      return "Dawn";
    } else if (currentDate >= sunrise && currentDate < sunset) {
      return "Day";
    } else if (currentDate >= sunset && currentDate < dusk) {
      return "Dusk";
    } else {
      return "Night";
    }
  }

  async function scheduleTimeOfDayBucketUpdate() {
    const currentTime = new Date();
    const nextBucketTime = await getNextBucketTime(currentTime);
    const timeRemaining = nextBucketTime - currentTime;

    setTimeout(async () => {
      setTimeOfDayBucket(await getTimeOfDayBucket());
      scheduleTimeOfDayBucketUpdate();
    }, timeRemaining);
  }

  async function getNextBucketTime(currentTime) {
    const data = await getTimeOfDayData();

    const sunrise = new Date(data.results.sunrise);
    const sunset = new Date(data.results.sunset);
    const dawn = new Date(sunrise.getTime() - 60 * 60 * 1000); // 1 hour before sunrise
    const dusk = new Date(sunset.getTime() + 60 * 60 * 1000); // 1 hour after sunset

    if (currentTime < dawn) {
      return dawn;
    } else if (currentTime < sunrise) {
      return sunrise;
    } else if (currentTime < sunset) {
      return sunset;
    } else if (currentTime < dusk) {
      return dusk;
    } else {
      // Add a day to the current date and calculate the next dawn time
      const nextDay = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      const nextDayData = await getTimeOfDayData(nextDay);
      const nextDawn = new Date(nextDayData.results.sunrise - 60 * 60 * 1000);
      return nextDawn;
    }
  }

  async function getTimeOfDayData(date = new Date()) {
    const southernCaliforniaCoordinates = {
      latitude: 34.052235,
      longitude: -118.243683,
    };

    const formattedDate = date.toISOString().split("T")[0];

    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${southernCaliforniaCoordinates.latitude}&lng=${southernCaliforniaCoordinates.longitude}&date=${formattedDate}&formatted=0`
    );

    return await response.json();
  }

  return (
    <div className="App">
      <VideoPlayer onVideoStarted={() => setIsVideoStarted(true)} />
      <AudioPlayer timeOfDayBucket={timeOfDayBucket} isStarted={true} />
      <AboutModal />
      <Chat />
    </div>
  );
}

export default App;
