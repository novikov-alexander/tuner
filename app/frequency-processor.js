//import aubio from "aubiojs";
//import {noteStrings, getStandardFrequency, semitone} from "./tunerCommon";

/*interface Note {
    name: string;
    value: number;
    cents: number;
    octave: number;
    frequency: number;
  }*/

console.log("kokoko");
//aubio();

class FrequencyProcessor extends AudioWorkletProcessor {

    /*private pitchDetector: InstanceType<Awaited<ReturnType<typeof aubio>>['Pitch']>;*/

    // Custom AudioParams can be defined with this static getter.
    static get parameterDescriptors() {
        return [{ name: 'middleA', defaultValue: 440 }];
    }

    constructor() {
      // The super constructor call is required.
      super();

      //var self = this;
      let bufferSize = 4096;
      let sampleRate = 44100;

      /*.then(function(aubio) {
        self.pitchDetector = new aubio.Pitch(
          'default',
          bufferSize,
          1,
          sampleRate
        )
      })*/
    }
    //port: MessagePort;
  
    process(inputs, outputs, parameters) {
      /*const frequency = this.pitchDetector.do(
        inputs[0][0]
      )
      if (frequency) {
        const note = this.getNote(frequency, parameters.middleA)
        this.port.postMessage({
            name: noteStrings[note % 12],
            value: note,
            cents: this.getCents(frequency, note, parameters.middleA),
            octave: Math.floor(note / 12) - 1,
            frequency: frequency
          });
      }*/
      //var a = aubio();
      return true;
    }

    /**
     * get musical note from frequency
     *
     * @param {number} frequency
     * @returns {number}
     */
    getNote (frequency, middleA) {
        const note = 12 * (Math.log(frequency / middleA) / Math.log(2))
        return Math.round(note) /*+ semitone*/
    }

    /**
     * get cents difference between given frequency and musical note's standard frequency
     *
     * @param {number} frequency
     * @param {number} note
     * @returns {number}
     */
    getCents (frequency, note, middleA) {
        return Math.floor(
        (1200 * Math.log(frequency /*/ getStandardFrequency(note, middleA)*/)) / Math.log(2)
        )
    }
  }
  
  registerProcessor('frequency-processor', FrequencyProcessor);

  export default FrequencyProcessor;
