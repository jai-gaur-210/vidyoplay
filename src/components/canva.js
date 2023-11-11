import React, { useRef, useState, useEffect } from 'react';

const VideoPlayer = ({onFileChange }) => {
    const canvas = useRef();
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const [videoName, setVideoName] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoSize, setVideoSize] = useState(0);
    const myvid=document.getElementById('video')
    const [videoPaused, setVideoPaused] = useState(false);

    const handlePlayPause = () => {
        if(videoPaused===false){
            myvid?.play();
            setVideoPaused(true);
        }else{
            myvid?.pause();
            setVideoPaused(false);
        }
    };
    function updateCanvas() {
        const context = canvas.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.current.width, canvas.current.height);
        window.requestAnimationFrame(updateCanvas);
    }

    useEffect(() => {
        requestAnimationFrame(updateCanvas);
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const video = videoRef.current;

        const handleLoadedMetadata = () => {
          setVideoDuration(video.duration);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      onFileChange(file);

      if (file) {
        checkVideoAudio(file)
          .then((hasAudio) => {
            const video = videoRef.current;

            if (hasAudio) {
              video.src = URL.createObjectURL(file);
              setVideoName(file.name);
              setVideoSize(file.size);
            } else {
              video.src = null;
              setVideoName('');
              setVideoDuration(0);
              setVideoSize(0);
              window.location.reload();

              alert('Selected video does not have audio. Please choose a different video.');

            }
          })
          .catch((error) => {
            alert('Selected video does not have audio or Error decoding audio data. Please choose a different video.');
            const video = videoRef.current;
            video.src = null;
            setVideoName('');
            setVideoDuration(0);
            setVideoSize(0);
            window.location.reload();
          });
      }
    };

    const checkVideoAudio = (file) => {
      return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const reader = new FileReader();
    
        reader.onload = (event) => {
          const buffer = event.target.result;
    
          audioContext.decodeAudioData(
            buffer,
            () => resolve(true),
            (decodeError) => {
              console.error('Error decoding audio data:', decodeError);
              if (decodeError.message.includes('audio buffer is empty')) {
                resolve(false);
              } else {
                reject(decodeError);
              }
            }
          );
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };
    
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
      <div>

        <div className='dabba1'> 
            <button  onClick={handleFileButtonClick}> <i class='bx bxs-up-arrow-circle' ></i> Upload Video</button>
        </div>
        <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            style={{ display: 'none' }} 
        />
        
        <div className='dabba2'>
            <div >
              <video id='video' ref={videoRef} width={0} height={0} controls />
              <canvas ref={canvas} onClick={()=>handlePlayPause()}></canvas>
            </div>
            <div>
              <div className='metadata'>
                  <p> Name:  {videoName}</p>
                  <p> Duration:  {videoDuration.toFixed(2)} seconds</p>
                  <p> Size:  {formatBytes(videoSize)}</p>
              </div>
              <p className='note'> Note: Tap on video to play and pause.</p>
            </div>   
        </div>

      </div>
    );
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default VideoPlayer;
