import React, { useRef, useEffect, useState } from 'react';

const VideoBackground = ({ children, videoUrl }) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(1);
  const [videosLoaded, setVideosLoaded] = useState(false);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    let loadedCount = 0;

    const handleLoadedData = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setVideosLoaded(true);
        // Start playing the first video
        video1.play().catch(console.error);
      }
    };

    const handleVideo1Ended = () => {
      // Crossfade to video2
      video2.currentTime = 0;
      video2.play().catch(console.error);
      setCurrentVideo(2);
    };

    const handleVideo2Ended = () => {
      // Crossfade to video1
      video1.currentTime = 0;
      video1.play().catch(console.error);
      setCurrentVideo(1);
    };

    video1.addEventListener('loadeddata', handleLoadedData);
    video2.addEventListener('loadeddata', handleLoadedData);
    video1.addEventListener('ended', handleVideo1Ended);
    video2.addEventListener('ended', handleVideo2Ended);

    // Preload both videos
    video1.load();
    video2.load();

    return () => {
      video1.removeEventListener('loadeddata', handleLoadedData);
      video2.removeEventListener('loadeddata', handleLoadedData);
      video1.removeEventListener('ended', handleVideo1Ended);
      video2.removeEventListener('ended', handleVideo2Ended);
    };
  }, [videoUrl]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background Layer 1 */}
      <video
        ref={video1Ref}
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
          currentVideo === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Background Layer 2 */}
      <video
        ref={video2Ref}
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
          currentVideo === 2 ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      {/* Content Layer */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;
