import * as $ from "jquery";
import {IRequestOptions, IServerResponse, ApiAiConstants} from "api-ai-javascript";
import {environment} from "./environment";
import {startListening, synthesisVoice} from "./voice";

const chatLogs: JQuery = $(".chat-logs");
let INDEX = 0;
const client = environment.apiAiClient;

$("#chat-submit").click( (e: JQuery.Event) => {
    console.log("in chat-submit");
    e.preventDefault();
    const msg: string = $("#chat-input").val().toString();
    if (msg.trim() === '') {
        return false;
    }

    generate_message(msg, 'self');

    client.textRequest(msg)
        .then((response: any) => {
            const { result: { fulfillment: { speech } } } = response;
            generate_message(speech, 'user');
        })
        .catch((err: Error) => {
            console.log(err);
        });
});

$("#chat-voice-submit").click( (e: JQuery.Event) => {
    console.log("chat-voice-submit");
    e.preventDefault();
    startListening().then( (msg: string) => {

        generate_message(msg, 'self');

        client.textRequest(msg)
            .then((response: any) => {
                const { result: { fulfillment: { speech } } } = response;
                generate_message(speech, 'user');
                synthesisVoice(speech);
            })
            .catch((err: Error) => {
                console.log(err);
            });
    }).catch( (error: string) => {
        generate_message(error, 'user');
    });
});

export function generate_message(msg: string, type: string): void {
    INDEX++;
    let str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
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
    chatLogs.append(str);
    $("#cm-msg-" + INDEX).hide().fadeIn(300);
    if (type === 'self') {
        $("#chat-input").val('');
    }

    chatLogs.stop().animate({scrollTop: chatLogs[0].scrollHeight}, 1000);
}

$("#chat-circle").click( () => {
    $("#chat-circle").toggle('slow'); //.toggle('scale');
    $(".chat-box").toggle('slow'); //.toggle('scale');
    setTimeout( () => {
        generate_message('How can i help you?', 'user');
    }, 1000);
});

$(".chat-box-toggle").click( () => {
    $("#chat-circle").toggle('slow'); //.toggle('scale');
    $(".chat-box").toggle('slow'); //.toggle('scale');
});
