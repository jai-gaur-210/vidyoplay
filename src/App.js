import './App.css';
import React from 'react'
import WaveformDisplay from './components/audio.js';
import VideoPlayer from './components/canva.js';
import { useState } from 'react';

function App() {
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (file) => {

    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl);
    }
  };
  return (
      <div className='dabba'>
          <h1>Vidyo<span>Play</span></h1>
          <VideoPlayer onFileChange={handleFileChange} />
          <WaveformDisplay audioUrl={audioUrl} />
      </div>
  );
}

export default App;

