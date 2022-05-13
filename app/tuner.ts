import { WorkerUrl } from 'worker-url';
import FrequencyProcessor from './frequency-processor'

interface Note {
  name: string;
  value: number;
  cents: number;
  octave: number;
  frequency: number;
}

export default class Tuner {

  private middleA: number;
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private analyser: AnalyserNode;
  private audioWorklet: AudioWorkletNode;

  private onNoteDetected: (note: Note) => void

  constructor(a4 :number, onNoteDetected:  (note: Note) => void){
    this.middleA = a4 || 440
    this.onNoteDetected = onNoteDetected;
  
    this.initGetUserMedia()
  }

  initGetUserMedia () {
    window.AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!window.AudioContext) {
      return alert('AudioContext not supported')
    }

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
      (navigator.mediaDevices as any) = {}
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        const getUserMedia =
          (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          alert('getUserMedia is not implemented in this browser')
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }
  }

  startRecord () {
    const self = this
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function(stream) {
        self.audioContext.createMediaStreamSource(stream).connect(self.analyser)
        self.analyser.connect(self.audioWorklet)
        self.audioWorklet.connect(self.audioContext.destination)
      })
      .catch(function(error) {
        alert(error.name + ': ' + error.message)
      })
  }

  init () {
    this.audioContext = new window.AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    const self = this
  
    this.audioContext.audioWorklet.addModule(new URL('frequency-processor-worklet.js', import.meta.url)).then(() => {
      self.audioWorklet = new AudioWorkletNode(self.audioContext, "frequency-processor");
      this.audioWorklet.port.onmessage = (event) => {
        self.onNoteDetected(event.data);
      };
      self.startRecord();
    }).catch((err) => 
    console.error(err));
  }
   
  /**
   * play the musical note
   *
   * @param {number} frequency
   */
  play (frequency: number) {
    if (!this.oscillator) {
      this.oscillator = this.audioContext.createOscillator()
      this.oscillator.connect(this.audioContext.destination)
      this.oscillator.start()
    }
    this.oscillator.frequency.value = frequency
  }
  
  stop () {
    this.oscillator.stop()
    this.oscillator = null
  }
  
}







