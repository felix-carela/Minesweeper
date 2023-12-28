import React, { useState } from 'react';
import Board from './Board';
import Header from './Header';
import Footer from './Footer';
import AudioComponent from './Audio';
import clickSound from './sounds/click.mp3';

function App() {
  const [playClickSound, setPlayClickSound] = useState(false);


  const toggleSound = () => {
    setPlayClickSound(!playClickSound);
  };

  return (
    <div className="App" onClick={toggleSound}>
      <Header />
      <Board />
      <Footer />
      <AudioComponent sound={clickSound} play={playClickSound} />
    </div>
  );
}

export default App;
