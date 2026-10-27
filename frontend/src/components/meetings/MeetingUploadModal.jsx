import { useState, useRef } from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Upload, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
  "audio/mp4",
  "text/plain",
  "application/json",
];

export function MeetingUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setSelectedFile(null);
    setMeetingTitle("");
    setAttendees("");
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateFile = (file) => {
    setError(null);
    if (!file) return false;

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return false;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["mp3", "wav", "m4a", "mp4", "txt", "json"];
    if (!validExtensions.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      setError("Supported file types are: MP3, WAV, M4A, TXT, JSON.");
      return false;
    }

    setSelectedFile(file);
    if (!meetingTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setMeetingTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartUpload = () => {
    if (!selectedFile) {
      setError("Please select an audio recording or transcript file.");
      return;
    }
    if (!meetingTitle.trim()) {
      setError("Please provide a title for this meeting.");
      return;
    }

    setIsUploading(true);
    setError(null);

    // Realistic upload progress
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newMeeting = {
            id: `MTG-${Math.floor(100 + Math.random() * 900)}`,
            title: meetingTitle.trim(),
            date: new Date().toISOString().split("T")[0],
            duration: "28 mins",
            durationSeconds: 1680,
            attendees: attendees ? attendees.split(",").map((s) => s.trim()) : ["Current User"],
            status: "Uploaded (Staged)",
            summary: `Newly ingested meeting: ${selectedFile.name}. Awaiting full institutional memory analysis.`,
            decisionsCount: 0,
            actionItemsCount: 0,
            openQuestionsCount: 0,
            audioUrl: URL.createObjectURL(selectedFile),
            audioMarkers: [],
            transcript: [
              { speaker: "Ingestion System", time: "00:00:01", text: `Uploaded file '${selectedFile.name}' (${(selectedFile.size / 1024).toFixed(1)} KB). Ready for human review.` }
            ],
          };
          onUploadSuccess(newMeeting);
          handleClose();
        }, 400);
      }
    }, 150);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Meeting Recording or Transcript"
      description="Add audio (.mp3, .wav, .m4a) or meeting transcripts (.txt, .json) into EchoVault's decision pipeline."
      maxWidth="560px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? "var(--accent-periwinkle)" : "var(--border-subtle)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "2rem 1.5rem",
            textAlign: "center",
            backgroundColor: dragActive ? "var(--section-subtle)" : "var(--surface-alt)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.mp4,.txt,.json"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateFile(e.target.files[0]);
              }
            }}
          />

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(166, 177, 225, 0.25)",
              color: "var(--indigo-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <Upload size={22} />
          </div>

          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--indigo-primary)" }}>
            {selectedFile ? selectedFile.name : "Drag & drop your meeting file here"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
            Supports MP3, WAV, M4A, TXT, JSON up to 50MB
          </div>

          {selectedFile && (
            <div style={{ marginTop: "0.75rem" }}>
              <Badge variant="indigo">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
              </Badge>
            </div>
          )}
        </div>

        {/* Error message if invalid file */}
        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--semantic-error-bg)",
              border: "1px solid var(--semantic-error-border)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: "var(--semantic-error)",
              fontSize: "0.825rem",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Meeting metadata inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.3rem" }}>
              Meeting Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Q4 Executive Product Strategy"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.3rem" }}>
              Attendees (comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Elena Rostova, Devon Chen, Marcus Vance"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
        </div>

        {/* Upload progress indicator */}
        {isUploading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.775rem", color: "var(--text-secondary)" }}>
              <span>Uploading & Parsing metadata...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "9999px",
                backgroundColor: "var(--section-subtle)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  backgroundColor: "var(--indigo-primary)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.6rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStartUpload}
            loading={isUploading}
            disabled={!selectedFile || !meetingTitle.trim()}
          >
            Begin Ingestion
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
