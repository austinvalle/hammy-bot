var async = require('async');
var moment = require('moment');

var CONFIG = require('../../config');
var client = require('../../client');

var xbox = require('node-xbox')(CONFIG.XBOX.API_KEY);

const PRESENCE_REGEX = /(?:^|\s)(!whosonline)(?=\s|$)/;

module.exports = {
    register: function() {

        client.chat.on('message', function(ev, msg) {
            var isMatch = PRESENCE_REGEX.test(msg);

            if (isMatch) {
                client.start_typing(ev);

                var parallelTasks = [];

                var gamertags = CONFIG.XBOX.GAMERTAGS;
                for (var i = 0; i < gamertags.length; i++) {
                    var task = createPresenceTask(gamertags[i].XUID, gamertags[i].DISPLAY_NAME);
                    parallelTasks.push(task);
                }

                async.parallel(parallelTasks,
                    function(err, presences) {
                        var msgSegments = buildPresenceMessage(presences);

                        return client.send_message(CONFIG.CLIENT_ID, msgSegments).then(function() {
                            client.stop_typing(ev);
                        });
                    }
                );
            }
        });
    }
}

function createPresenceTask(xuid, displayName) {
    return function(callback) {
        xbox.profile.presence(xuid, function(err, res) {
            var jsonResponse = JSON.parse(res);
            jsonResponse["displayName"] = displayName;

            callback(err, jsonResponse);
        });
    };
}

function buildPresenceMessage(presences) {
    var builder = new client.MessageBuilder();

    for (var i = 0; i < presences.length; i++) {
        if (presences[i].state == 'Online') {
            buildOnlineText(builder, presences[i]);
        } else {
            buildOfflineText(builder, presences[i])
        }

        if (i != presences.length - 1) {
            builder.linebreak().linebreak();
        }
    }

    return builder.toSegments();
}

function buildOnlineText(builder, presence) {
    builder.text('🎮 ');

    var currentTitle = getCurrentTitle(presence.devices[0].titles);

    builder.bold(presence.displayName).linebreak().bold(currentTitle.name);

    if (currentTitle.activity) {
        builder.text(' - ').italic(currentTitle.activity.richPresence);
    }
}

function buildOfflineText(builder, presence) {
    builder.text('📴 ');
    builder.bold(presence.displayName).linebreak();

    if (presence.lastSeen) {
        builder.bold(getLastSeen(presence.lastSeen.timestamp));
        builder.text(' - ').italic(presence.lastSeen.titleName);
    } else {
        builder.bold('Offline');
    }
}

function getCurrentTitle(titles) {
    for (var i = 0; i < titles.length; i++) {
        if (titles[i].placement == 'Full') {
            return titles[i];
        }
    }
}

function getLastSeen(timestamp) {
    return 'Last seen ' + moment(timestamp).fromNow();
}
