import {environment} from "./app/environment";
import "./app/chatbox";
import "./app/voice";
import "./styles.scss";

export default class Main {
    constructor() {
        console.log(`Typescript Webpack starter launched ${environment.TITLE}`)  ;
    }
}

const start: Main = new Main();
