import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Clock, MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatDuration } from "../../lib/utils";

export function AudioTimeline({
  meeting,
  onSeekDecision,
  selectedMarkerTime = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = meeting?.durationSeconds || 1800;
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);

  const [prevMarker, setPrevMarker] = useState(selectedMarkerTime);
  if (selectedMarkerTime !== prevMarker) {
    setPrevMarker(selectedMarkerTime);
    if (selectedMarkerTime != null) {
      setCurrentTime(selectedMarkerTime);
    }
  }

  // Audio playback simulation or HTML5 audio handler
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = Math.floor(percentage * duration);
    setCurrentTime(newTime);
  };

  // Generate synthetic waveform bars with high fidelity
  const waveformBars = 75;
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const currentBarIndex = Math.floor(progressRatio * waveformBars);

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem 1.5rem",
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-glass)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Player Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              padding: "0.4rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(166, 177, 225, 0.25)",
              color: "var(--indigo-primary)",
            }}
          >
            <Clock size={16} />
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--indigo-primary)" }}>
              Synchronized Audio & Decision Timeline
            </span>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Interactive scrubbing linked to transcript excerpt & decision markers
            </div>
          </div>
        </div>

        <Badge variant="indigo" style={{ fontFamily: "var(--font-mono)" }}>
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </Badge>
      </div>

      {/* Interactive Waveform Track */}
      <div
        onClick={handleSeek}
        style={{
          height: "64px",
          backgroundColor: "var(--surface-alt)",
          borderRadius: "var(--radius-md)",
          padding: "0.5rem 0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          cursor: "pointer",
          position: "relative",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
        }}
        title="Click anywhere to scrub playback"
      >
        {/* Render waveform bars */}
        {Array.from({ length: waveformBars }).map((_, i) => {
          // Dynamic wave pattern
          const pseudoHeight = 15 + Math.sin(i * 0.45) * 18 + Math.cos(i * 0.9) * 12 + 10;
          const isPassed = i <= currentBarIndex;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.min(100, Math.max(12, pseudoHeight))}%`,
                borderRadius: "2px",
                backgroundColor: isPassed ? "var(--indigo-primary)" : "var(--bg-secondary)",
                transition: "background-color 0.1s ease",
              }}
            />
          );
        })}

        {/* Decision Timestamp Markers Overlay */}
        {(meeting?.audioMarkers || []).map((marker, idx) => {
          const markerRatio = duration > 0 ? marker.time / duration : 0;
          const leftPercent = `${markerRatio * 100}%`;
          const isCurrent = Math.abs(currentTime - marker.time) < 15;

          return (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(marker.time);
                if (onSeekDecision) onSeekDecision(marker);
              }}
              style={{
                position: "absolute",
                left: leftPercent,
                top: 0,
                bottom: 0,
                width: "3px",
                backgroundColor: marker.decisionId ? "var(--indigo-primary)" : "var(--accent-periwinkle)",
                zIndex: 2,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              title={`Decision Marker [${formatDuration(marker.time)}]: ${marker.label}`}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: marker.decisionId ? "var(--indigo-primary)" : "var(--accent-periwinkle)",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 2px 5px rgba(66, 72, 116, 0.3)",
                  position: "absolute",
                  top: "2px",
                  transform: isCurrent ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Decision Markers Legend / Jump List */}
      {(meeting?.audioMarkers || []).length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Decision Markers:
          </span>
          {meeting.audioMarkers.map((marker, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentTime(marker.time);
                if (onSeekDecision) onSeekDecision(marker);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.6rem",
                borderRadius: "var(--radius-pill)",
                backgroundColor:
                  Math.abs(currentTime - marker.time) < 15
                    ? "var(--bg-secondary)"
                    : "var(--section-subtle)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--indigo-primary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <MapPin size={12} color="var(--indigo-primary)" />
              <span>{formatDuration(marker.time)}</span>
              <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                {marker.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Button
            variant="primary"
            size="sm"
            icon={isPlaying ? Pause : Play}
            onClick={togglePlay}
          >
            {isPlaying ? "Pause" : "Play Recording"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => setCurrentTime(0)}
          >
            Reset
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              padding: "0.4rem",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Playback rate: 1.0x
          </span>
        </div>
      </div>
    </div>
  );
}
