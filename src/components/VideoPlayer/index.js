import React, { useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import "./VideoPlayer.css";

function VideoPlayer() {
  const hlsUrl =
    "https://video.parks.ca.gov/PoppyReserve/Poppies.stream/playlist.m3u8";
  const playerRef = useRef(null);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);

  const handlePlayButtonClick = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      if (player.paused) {
        player.play();
        setPlayButtonVisible(false);
      } else {
        player.pause();
        setPlayButtonVisible(true);
      }
    }
  };

  return (
    <div className="video-player">
      <ReactHlsPlayer
        src="https://video.parks.ca.gov/PoppyReserve/Poppies.stream/playlist.m3u8"
        playerRef={playerRef}
        width="100%"
        controls={false}
      />
      {playButtonVisible && (
        <button onClick={handlePlayButtonClick}>Start</button>
      )}
    </div>
  );
}

export default VideoPlayer;
