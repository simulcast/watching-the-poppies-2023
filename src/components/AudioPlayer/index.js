import React, { useEffect } from "react";
import * as Tone from "tone";
import "./AudioPlayer.css";

function AudioPlayer({ timeOfDayBucket }) {
  useEffect(() => {
    // Load and play audio files based on the time of day bucket
    // ...
  }, [timeOfDayBucket]);

  return (
    <div className="audio-player">
      <p>You are watching the poppies at {timeOfDayBucket}</p>
    </div>
  );
}

export default AudioPlayer;
