export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioUrl: string | null = null;
  private audioReader: HTMLAudioElement | null = null;
  private blob: Blob | null = null;

  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.addEventListener("dataavailable", (event) => {
      this.audioChunks.push(event.data);
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.blob = new Blob(this.audioChunks, { type: "audio/wav" });
      this.audioUrl = URL.createObjectURL(this.blob);
      this.audioChunks = [];
      this.audioReader = new Audio(this.audioUrl);
    });

    this.mediaRecorder.start();
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  playAudio() {
    if (this.audioReader) {
      this.audioReader.play();
    }
  }

  pauseAudio() {
    if (this.audioReader) {
      this.audioReader.pause();
    }
  }

  getAudioUrl(): string | null {
    return this.audioUrl;
  }

  getDuration(): number {
    return this.audioReader ? this.audioReader.duration : 0;
  }

  getBlob(): Blob | null {
    return this.blob;
  }

  getAudioCurrentTime(): number {
    return this.audioReader ? this.audioReader.currentTime : 0;
  }

  setAudioCurrentTime(time: number) {
    if (this.audioReader) {
      this.audioReader.currentTime = time;
    }
  }

  addTimeUpdateListener(listener: () => void) {
    if (this.audioReader) {
      this.audioReader.addEventListener("timeupdate", listener);
    }
  }
}
