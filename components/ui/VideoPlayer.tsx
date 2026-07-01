import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Hls from "hls.js";
import { useAuthStore } from "../../services/authStore";

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
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Watermark State
  const currentUser = useAuthStore((state) => state.currentUser);
  const email = currentUser?.email || "anonymous@multiserwis.pl";
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });

  // Sync interval ref
  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  // Watermark position randomized interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Random position: top between 10% and 80%, left between 10% and 70%
      const top = Math.floor(Math.random() * 70) + 10;
      const left = Math.floor(Math.random() * 60) + 10;
      setWatermarkPos({ top, left });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setIsPlaying(false);

    // Cleanup previous HLS instance if exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

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

    const isHls = src.includes(".m3u8");

    if (isHls) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = src;
      } else if (Hls.isSupported()) {
        // Hls.js support
        const hls = new Hls({
          maxMaxBufferLength: 10,
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsReady(true);
        });
      } else {
        console.error("HLS streaming is not supported in this browser.");
        video.src = src; // fallback
      }
    } else {
      // Regular progressive video (MP4)
      video.src = src;
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
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
    <div className="relative group bg-black rounded-sm shadow-xl overflow-hidden aspect-video select-none">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
        playsInline
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Dynamic Watermark overlay */}
      {isPlaying && (
        <div
          className="absolute text-white/20 text-xs sm:text-sm font-mono pointer-events-none transition-all duration-1000 select-none whitespace-nowrap bg-black/10 px-2 py-1 rounded backdrop-blur-[0.5px]"
          style={{
            top: `${watermarkPos.top}%`,
            left: `${watermarkPos.left}%`,
          }}
        >
          {email} | MultiSerwis LMS
        </div>
      )}

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
export default VideoPlayer;
