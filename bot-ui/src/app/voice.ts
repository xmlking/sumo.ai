import {environment} from "./environment";

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const voiceBtn =  <HTMLElement>document.querySelector('.chat-input .chat-voice-submit');

const SpeechRecognition = (window as any).webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition ||
    (window as any).SpeechRecognition;

let recognition: any;

if (SpeechRecognition === undefined) {
    voiceBtn.style.display = "none";
} else {
    voiceBtn.style.display = "";
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

const synth: SpeechSynthesis = (window as any).speechSynthesis;
let voices: SpeechSynthesisVoice[];
let selectedVoice: SpeechSynthesisVoice;

if (synth !== undefined || synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = (ev: Event): void => {
        voices = synth.getVoices();
        selectedVoice = voices[48];
        console.log(voices);
        console.log(selectedVoice);
    };
}

export function synthesisVoice(text: string): void {

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = selectedVoice;
    utterance.text = text;
    // utterance.pitch =
    // utterance.rate =
    synth.speak(utterance);
}

export function startListening(): Promise<string> {

    return new Promise((resolve, reject): void => {
        recognition.start();

        recognition.addEventListener('speechstart', () => {
            console.log('Speech has been detected.');
        });

        recognition.addEventListener('result', (e: any) => {
            console.log('Result has been detected.');

            const last = e.results.length - 1;
            const text = e.results[last][0].transcript;

            //outputYou.textContent = text;
            console.log('Result: ' + text);
            console.log('Confidence: ' + e.results[0][0].confidence);

            //generate_message(text, 'self');
            resolve(text);

        });
        recognition.addEventListener('speechend', (ev: Event) => {
            recognition.stop();
        });

        recognition.addEventListener('error', (error: any) => {
            //outputBot.textContent = 'Error: ' + e.error;
            console.log('Error: ' + error.error);
            reject(error);
        });

    });

}
