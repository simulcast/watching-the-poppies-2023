import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import "./AudioPlayer.css";

function AudioPlayer({ timeOfDayBucket, isStarted }) {
  const [audioStarted, setAudioStarted] = useState(false);

  const getAudioFileFromServer = async () => {
    try {
      const response = await fetch(
        `https://watching-the-poppies-server.up.railway.app/api/audio/Day`
      );
      const audio_file_url = await response.json();
      console.log("Fetched audio file URL:", audio_file_url.url);
      return audio_file_url.url;
    } catch (error) {
      console.error("Error fetching audio files:", error);
    }
  };

  const scheduleAudio = async (url) => {
    console.log("Scheduling audio with URL:", url);
    const buffer = await Tone.Buffer.fromUrl(url);
    const bufferSource = new Tone.BufferSource(buffer).toDestination();
    bufferSource.start();

    const halfDuration = buffer.duration / 2;
    setTimeout(async () => {
      console.log("Fetching next audio file...");
      const nextAudioFileURL = await getAudioFileFromServer();
      scheduleAudio(nextAudioFileURL);
    }, halfDuration * 1000);
  };

  const handleStartAudioClick = async () => {
    setAudioStarted(true);
  };

  useEffect(() => {
    (async () => {
      if (audioStarted) {
        console.log("Component loaded, fetching initial audio file...");
        const url = await getAudioFileFromServer();
        scheduleAudio(url);
      }
    })();
  }, [audioStarted]);

  return (
    <div className="audio-player">
      <p>You are watching the poppies at {timeOfDayBucket}</p>
      {!audioStarted && (
        <button onClick={handleStartAudioClick}>Start Audio</button>
      )}
    </div>
  );
}

export default AudioPlayer;
