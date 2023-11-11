import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveformDisplay = ({ audioUrl }) => {
    const waveformRef = useRef(null);

    useEffect(() => {
        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'cyan',
          progressColor: 'darkcyan',
          cursorColor: 'red',
          barWidth:1,
          cursorWidth: 0,
          height: 100,
          responsive: true,
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on('interaction', () => {
      wavesurfer.play()
    })

      return () => wavesurfer.destroy();
    }, [audioUrl]);

    return <div className='wave' ref={waveformRef} style={{ height: '100px' }} />;
};

export default WaveformDisplay;
