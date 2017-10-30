import * as $ from "jquery";
import {IRequestOptions, IServerResponse, ApiAiConstants, ApiAiClient} from "api-ai-javascript";
import { environment } from '../environments/environment';
import {VoiceService} from "./voice.service";

export class ChatboxComponent {
    private voiceBtn =  <HTMLElement>document.querySelector('.chat-input .chat-voice-submit');
    private chatLogs: JQuery = $(".chat-logs");
    private INDEX = 0;
    private client: ApiAiClient;
    constructor(voiceService: VoiceService) {
        this.client = new ApiAiClient({ accessToken: environment.API_AI_ACCESS_TOKEN, sessionId: environment.API_AI_SESSION_ID });

        if (voiceService.canUseSpeechRecognition) {
            this.voiceBtn.style.display = "";
        } else {
            this.voiceBtn.style.display = "none";
        }

        $("#chat-submit").click( (e: JQuery.Event) => {
            e.preventDefault();
            const msg: string = $("#chat-input").val().toString();
            if (msg.trim() === '') {
                return false;
            }

            this.generate_message(msg, 'self');

            this.client.textRequest(msg)
                .then((response: any) => {
                    const { result: { fulfillment: { speech } } } = response;
                    this.generate_message(speech, 'user');
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        });

        $("#chat-voice-submit").click( (e: JQuery.Event) => {
            e.preventDefault();
            voiceService.startListening().then( (msg: string) => {

                this.generate_message(msg, 'self');

                this.client.textRequest(msg)
                    .then((response: any) => {
                        const { result: { fulfillment: { speech } } } = response;
                        this.generate_message(speech, 'user');
                        voiceService.synthesisVoice(speech);
                    })
                    .catch((err: Error) => {
                        console.log(err);
                    });
            }).catch( (error: string) => {
                this.generate_message(error, 'user');
            });
        });

        $("#chat-circle").click( () => {
            $("#chat-circle").toggle('slow'); //.toggle('scale');
            $(".chat-box").toggle('slow'); //.toggle('scale');
            setTimeout( () => {
                this.generate_message('How can i help you?', 'user');
            }, 1000);
        });

        $(".chat-box-toggle").click( () => {
            $("#chat-circle").toggle('slow'); //.toggle('scale');
            $(".chat-box").toggle('slow'); //.toggle('scale');
        });

        const template = $("#bot-template").html(); //TODO: do interpolate?
        console.log(template);
    }

    private generate_message(msg: string, type: string): void {
        this.INDEX++;
        let str = "";
        str += "<div id='cm-msg-" + this.INDEX + "' class=\"chat-msg " + type + "\">";
        str += "<span class=\"msg-avatar\">";
        if (type === 'self') {
            str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator" +
                "\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        } else {
            str += "            <img src=\"https:\/\/image.winudf.com\/v2\/image" +
                "\/Y29tLm1la3VudS5kb3dubG9hZGJvdF9pY29uXzBfYzM0ODg5MTQ\/icon.png?w=170&fakeurl=1&type=.png\">";
        }
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        this.chatLogs.append(str);
        $("#cm-msg-" + this.INDEX).hide().fadeIn(300);
        if (type === 'self') {
            $("#chat-input").val('');
        }

        this.chatLogs.stop().animate({scrollTop: this.chatLogs[0].scrollHeight}, 1000);
    }

}
