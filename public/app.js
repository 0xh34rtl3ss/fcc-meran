let ioConnection = new io();
var count =100;

$(document).ready(() => {
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
    });
})

function connect() {
    let uniqueId = $('#uniqueIdInput').val();
    if (uniqueId !== '') {
        ioConnection.emit('setUniqueId', uniqueId);
        $('#stateText').text('Connecting...');
    } else {
        alert('no username entered');
    }
}

function sanitize(text) {
    return text.replace(/</g, '&lt;')
}

function addChatItem(color, data, text, summarize) {
    if ($('.chat').find('div').length > 500) {
        $('.chat').find('div').slice(0, 200).remove();
    }

    $('.chat').find('.temporary').remove();;

    $('.chat').append(`
        <div class=static>
            <img src="${data.profilePictureUrl}">
            <span>
            </span>
        </div>
    `);

    $(".chat").stop();
    $(".chat").animate({
        scrollTop: $('.chat')[0].scrollHeight
    }, 800);
}

// Control events
ioConnection.on('setUniqueIdSuccess', (state) => {
    $('#stateText').text(`Connected`);
    //$('#stateText').text(`Connected to roomId ${state.roomId}`);
})

ioConnection.on('setUniqueIdFailed', (errorMessage) => {
    $('#stateText').text(errorMessage);
})

ioConnection.on('streamEnd', () => {
    $('#stateText').text('Stream ended.');
})

// Room stats
ioConnection.on('roomUser', (msg) => {
    $('#roomUserText').html(`Count: <b>${count}</b>, Viewers: <b>${msg.viewerCount.toLocaleString()}</b>`);
})

// // Chat events
// ioConnection.on('member', (msg) => {
//     addChatItem('#21b2c2', msg, 'joined', true);
// })

// ioConnection.on('chat', (msg) => {
//     console.log(msg.comment)
//     addChatItem('', msg, msg.comment);
// })

ioConnection.on('gift', (msg) => {
    count--;
    console.log(msg)
    addChatItem('#c2a821', msg, `Gifted giftId=${msg.giftId}`);
})