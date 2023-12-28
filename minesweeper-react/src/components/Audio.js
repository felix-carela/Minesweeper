// AudioComponent.js
import React from 'react';

const Audio = ({ sound, play }) => {
  // Ref to the audio element
  const audioRef = React.useRef(new Audio(sound));

  // Play the sound whenever the 'play' prop changes
  React.useEffect(() => {
    if (play) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [play]);

  return null; // This component doesn't render anything
};

export default Audio;
