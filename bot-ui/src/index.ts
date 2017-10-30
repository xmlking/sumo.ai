import * as $ from "jquery";
import {environment} from "./environments/environment";
import {ChatboxComponent} from "./app/chatbox.component";
import {VoiceService} from "./app/voice.service";

import "./styles.scss";
import * as chatboxTpl from './templates.html';

export default class Main {
    constructor() {
        console.log(`Typescript Webpack starter launched ${environment.TITLE}`);
        $("body").append($(chatboxTpl));
        const template = $("#botui-template").html();
        $("#botui").append(template);

        const voiceService = new VoiceService();
        const chatboxComponent = new ChatboxComponent(voiceService);
    }
}

$(() => {
    const start: Main = new Main();
});
