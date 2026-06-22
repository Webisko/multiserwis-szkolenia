import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onProgressUpdate: (playedSeconds: number, totalSeconds: number) => void;
  initialProgress?: number; // In seconds
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onProgressUpdate,
  initialProgress = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Sync interval ref
  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialProgress > 0 && initialProgress < video.duration) {
        video.currentTime = initialProgress;
        setCurrentTime(initialProgress);
      }
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (syncInterval.current) clearInterval(syncInterval.current);
      onProgressUpdate(video.duration, video.duration); // Mark full completion
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  // Cleanup interval
  useEffect(() => {
    return () => {
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current || !isReady) return;

    if (isPlaying) {
      videoRef.current.pause();
      if (syncInterval.current) clearInterval(syncInterval.current);
      // Sync on pause
      onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration);
    } else {
      videoRef.current.play();
      // Start periodic sync (every 10s)
      syncInterval.current = setInterval(() => {
        if (videoRef.current) {
          onProgressUpdate(
            videoRef.current.currentTime,
            videoRef.current.duration,
          );
        }
      }, 10000);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="relative group bg-black rounded-sm shadow-xl overflow-hidden aspect-video">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
      />

      {/* Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent"
          />
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-brand-accent">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <span className="text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <button onClick={toggleMute} className="hover:text-brand-accent">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Big Play Button Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-brand-accent/90 flex items-center justify-center hover:scale-110 transition-transform shadow-lg backdrop-blur-sm">
            <Play size={32} className="text-white ml-2" />
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
