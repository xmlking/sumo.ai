$(function () {

    var chatLogs = $(".chat-logs");
    var INDEX = 0;

    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() === '') {
            return false;
        }
        generate_message(msg, 'self');

        setTimeout(function () {
            generate_message(msg, 'user');
        }, 1000)

    });

    function generate_message(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        str += "<span class=\"msg-avatar\">";
        if (type === 'self') {
            str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        } else {
            str += "            <img src=\"https:\/\/image.winudf.com\/v2\/image\/Y29tLm1la3VudS5kb3dubG9hZGJvdF9pY29uXzBfYzM0ODg5MTQ\/icon.png?w=170&fakeurl=1&type=.png\">";
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

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
        setTimeout(function () {
            generate_message('How can i help you?', 'user');
        }, 1000);
    });

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

});