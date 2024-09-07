import * as Tone from "tone";

// server ambiente socket anche per i client
class WebAudio {
  constructor() {
    this.elem = document.documentElement;

    // VARIABILI TONEJS
    //pinkNoiseEdit
    this.nois = new Tone.Noise("pink").toDestination();
    this.noisInit = 1;
    this.nois.volume.value = -Infinity;

    //pinkNoiseEdit2
    this.nois2 = new Tone.Noise("pink").toDestination();
    this.nois2Init = 1;
    this.nois2.volume.value = -Infinity;

    //sineEdit
    this.sin = new Tone.Oscillator(440, "sine").toDestination();
    this.sin.volume.value = -Infinity;
    //sineEdit2
    this.sin2 = new Tone.Oscillator(440, "sine").toDestination();
    this.sin2.volume.value = -Infinity;
    //sawEdit
    this.saws = new Tone.Oscillator(440, "sawtooth6").toDestination();
    this.saws.volume.value = -Infinity;

    //sawEdit2
    this.saws2 = new Tone.Oscillator(440, "sawtooth6").toDestination();
    this.saws2.volume.value = -Infinity;

    //audioPlayerEdit
    this.player = new Tone.Player("sound-1.wav").toMaster();
    this.playerInit = 1;
    this.player.volume.value = -Infinity;

    //audioPlayerEdit2
    this.player2 = new Tone.Player("sound-1.wav").toMaster();
    this.playerInit2 = 1;
    this.player2.volume.value = -Infinity;

    //metroEdit
    this.intervalIdMetro = null;
    this.noise = null;
    this.envelope = null;

    //strobeEdit
    this.intervalIdStrobe = null;
  }

  getRandomInt(number) {
    let min = Math.ceil(-number);
    let max = Math.floor(number);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pinkNoiseEdit(args) {
    if (this.noisInit == 1) {
      this.nois.volume.value = -Infinity; // Set initial volume to -Infinity
      this.noisInit = 0;
      this.nois.start();
      this.nois.volume.rampTo(args[0], args[1] / 1000);
    }
    this.nois.start();
    this.nois.volume.rampTo(args[0], args[1] / 1000);
  }

  // funzione tone js crea nota
  sineEdit(args) {
    // attack or release to avoid detunig swith on release
    if (args[2] < -60 || args[2] === "-Infinity") {
      this.sin.volume.rampTo(args[2], args[3] / 1000);
    } else {
      this.sin.frequency.value = Number(args[0]) + this.getRandomInt(args[1]);
      this.sin.start();
      this.sin.volume.rampTo(args[2], args[3] / 1000);
    }
  }

  // funzione tone js crea nota
  sawEdit(args) {
    // attack or release to avoid detunig swith on release
    if (args[2] < -60 || args[2] === "-Infinity") {
      this.saws.volume.rampTo(args[2], args[3] / 1000);
    } else {
      this.saws.frequency.value = Number(args[0]) + this.getRandomInt(args[1]);
      this.saws.start();
      this.saws.volume.rampTo(args[2], args[3] / 1000);
    }
  }

  // funzione tone js crea nota
  pinkNoiseEdit2(args) {
    if (this.nois2Init == 1) {
      this.nois2.volume.value = -Infinity; // Set initial volume to -Infinity
      this.nois2Init = 0;
      this.nois2.start();
      this.nois2.volume.rampTo(args[0], args[1] / 1000);
    }
    this.nois2.start();
    this.nois2.volume.rampTo(args[0], args[1] / 1000);
  }
  // funzione tone js crea nota
  sineEdit2(args) {
    // attack or release to avoid detunig swith on release
    if (args[2] < -60 || args[2] === "-Infinity") {
      this.sin2.volume.rampTo(args[2], args[3] / 1000);
    } else {
      this.sin2.frequency.value = Number(args[0]) + this.getRandomInt(args[1]);
      this.sin2.start();
      this.sin2.volume.rampTo(args[2], args[3] / 1000);
    }
  }

  // funzione tone js crea nota
  sawEdit2(args) {
    // attack or release to avoid detunig swith on release
    if (args[2] < -60 || args[2] === "-Infinity") {
      this.saws2.volume.rampTo(args[2], args[3] / 1000);
    } else {
      this.saws2.frequency.value = Number(args[0]) + this.getRandomInt(args[1]);
      this.saws2.start();
      this.saws2.volume.rampTo(args[2], args[3] / 1000);
    }
  }

  // AudioPlayer
  audioPlayerEdit(args) {
    const $this = this;
    let text1 =
      "https://raw.githubusercontent.com/csytp/file_audio_icsc/main/sound-";
    let text2 = ".mp3";
    let file = text1.concat(args[0], text2);

    // If a player instance exists, stop and dispose it
    if (this.player) {
      this.player.stop();
      this.player.dispose();
    }

    // Create a new player instance without autostart
    this.player = new Tone.Player({
      url: file,
      autostart: false, // Autostart is false to wait for onload
      loop: Number(args[2]),
      onload: function () {
        // Start playback after the player has loaded the audio
        $this.player.start();
        // Set the volume
        $this.player.volume.rampTo(args[1], 0.5);
      },
    }).toDestination();
  }

  audioPlayerEdit2(args) {
    const $this = this;
    let text1 =
      "https://raw.githubusercontent.com/csytp/file_audio_icsc/main/sound-";
    let text2 = ".mp3";
    let file = text1.concat(args[0], text2);

    // If a player instance exists, stop and dispose it
    if (this.player2) {
      this.player2.stop();
      this.player2.dispose();
    }

    // Create a new player instance without autostart
    this.player2 = new Tone.Player({
      url: file,
      autostart: false, // Autostart is false to wait for onload
      loop: Number(args[2]),
      onload: function () {
        // Start playback after the player has loaded the audio
        $this.player2.start();
        // Set the volume
        $this.player2.volume.rampTo(args[1], 0.5);
      },
    }).toDestination();
  }

  // Function to start the metronome
  metroEdit(args, action = "start") {
    const volumeDb = args[0]; // Volume in dB
    const intervalMs = args[1]; // Interval in milliseconds

    // Function to stop and dispose of noise and envelope
    const stopAndDispose = () => {
      if (this.intervalIdMetro) {
        clearInterval(this.intervalIdMetro);
        this.intervalIdMetro = null;
      }
      if (this.noise) {
        this.noise.stop();
        this.noise.dispose();
        this.noise = null;
      }
      if (this.envelope) {
        this.envelope.dispose();
        this.envelope = null;
      }
    };

    if (action === "stop") {
      // If action is stop, clean up and exit
      stopAndDispose();
      return;
    }

    // Clean up any existing noise or intervals
    stopAndDispose();

    // Resume the audio context if it's suspended
    Tone.start();

    // Create a new noise source
    this.noise = new Tone.Noise("white").start();

    // Create a gain node to control volume
    const gain = new Tone.Gain(Tone.dbToGain(volumeDb)).toDestination();

    // Create an envelope to control the noise
    this.envelope = new Tone.AmplitudeEnvelope({
      attack: 0.05, // Attack time
      decay: 0.05, // Decay time (50 ms)
      sustain: 0,
      release: 0,
    }).connect(gain);

    // Connect the noise source to the envelope
    this.noise.connect(this.envelope);

    // Trigger the first sound immediately
    this.envelope.triggerAttackRelease(0.5);

    // Play the noise signal at the defined interval
    this.intervalIdMetro = setInterval(() => {
      this.envelope.triggerAttackRelease(0.5); // Trigger the envelope
    }, intervalMs);
  }
  // STROBO
  initRGBEdit(args) {
    const targetColor = args.slice(0, 3);
    const durationMs = args[4];
    // VERSIONE VECCHIA
    //const startColor = window.getComputedStyle(document.body).backgroundColor;
    // VERSIONE NUOVA
    const superDiv = document.getElementById("superDiv");
    const startColor = window.getComputedStyle(superDiv).backgroundColor;
    document.getElementById("superDiv").classList.remove("hidden");
    //const startColor = window.getComputedStyle(document.body.getElementById("superDiv")).backgroundColor;

    const startRgba = startColor.match(/\d+/g).map(Number); // Extract RGB values

    const targetRgba = targetColor.map(Number); // Target RGBA values

    const startTime = performance.now();

    function updateColor(timestamp) {
      const elapsedMs = timestamp - startTime;
      if (elapsedMs >= durationMs) {
        // OLD
        //document.body.style.backgroundColor = `rgba(${targetRgba.join(", ")})`;
        // NUOVA
        document.getElementById(
          "superDiv"
        ).style.backgroundColor = `rgba(${targetRgba.join(", ")})`;
        if (args[3] == -1) {
          document.getElementById("superDiv").classList.add("hidden");
        }
        return;
      }

      const progress = elapsedMs / durationMs;
      const interpolatedRgba = startRgba.map((startVal, i) =>
        Math.round(startVal + (targetRgba[i] - startVal) * progress)
      );
      //OLD
      // document.body.style.backgroundColor = `rgba(${interpolatedRgba.join(", ")})`;
      // NUOVO
      document.getElementById(
        "superDiv"
      ).style.backgroundColor = `rgba(${interpolatedRgba.join(", ")})`;

      requestAnimationFrame(updateColor);
    }

    requestAnimationFrame(updateColor);
  }

  strobeEdit(args) {
    //let intervalIdStrobe; // Store the interval ID outside the function

    console.log(args[3]);

    if (args[3] > 0) {
      clearInterval(this.intervalIdStrobe); // Clear any existing interval before starting a new one

      let swapColor = 0;
      const getRandomColor = () => {
        const r = args[0];
        const g = args[1];
        const b = args[2];
        swapColor = 1 - swapColor;
        return `rgba(${r * swapColor}, ${g * swapColor}, ${b * swapColor}, 1)`;
      };

      this.intervalIdStrobe = setInterval(() => {
        const newColor = getRandomColor();
        document.getElementById("strobe_container").classList.remove("hidden");
        document.getElementById("strobe_container").style.backgroundColor =
          newColor;
      }, args[3]);
    }
    if (args[3] == -1) {
      clearInterval(this.intervalIdStrobe);
      document.getElementById("strobe_container").classList.add("hidden");
    }
  }

  // rimuove bottone
  removeButton(e) {
    let button_container = document.getElementById("hideButton_container");
    button_container.remove();
    //create a synth and connect it to the main output (your speakers)
    const debug = new Tone.Synth().toDestination();
    debug.volume.value = -Infinity;
    //play a middle 'C' for the duration of an 8th note
    debug.triggerAttackRelease("C4", "16n");

    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Safari */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE11 */
      this.elem.msRequestFullscreen();
    }
  }
}
export default WebAudio;
