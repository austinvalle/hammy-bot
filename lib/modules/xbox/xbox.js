var async = require('async');
var moment = require('moment');

var client = require('../../client');
var CONFIG = require('../../config/config');
var xbox = require('node-xbox')(CONFIG.XBOX.API_KEY);

var get_xbox_presences = function(match) {
    var gamertags = CONFIG.XBOX.GAMERTAGS;

    var parallelTasks = [];

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
};

var createPresenceTask = function(xuid, displayName) {
    return function(callback) {
        xbox.profile.presence(xuid, function(err, res) {
            var jsonResponse = JSON.parse(res);
            jsonResponse["displayName"] = displayName;

            callback(err, jsonResponse);
        });
    };
};

var buildPresenceMessage = function(presences) {
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
};

var buildOnlineText = function(builder, presence) {
    builder.text('🎮 ');

    var currentTitle = getCurrentTitle(presence.devices[0].titles);

    builder.bold(presence.displayName).linebreak().bold(currentTitle.name);

    if (currentTitle.activity) {
        builder.text(' - ').italic(currentTitle.activity.richPresence);
    }
};

var buildOfflineText = function(builder, presence) {
    builder.text('📴 ');
    builder.bold(presence.displayName).linebreak();

    if (presence.lastSeen) {
        builder.bold(getLastSeen(presence.lastSeen.timestamp));
        builder.text(' - ').italic(presence.lastSeen.titleName);
    } else {
        builder.bold('Offline');
    }
};

var getCurrentTitle = function(titles) {
    for (var i = 0; i < titles.length; i++) {
        if (titles[i].placement == 'Full') {
            return titles[i];
        }
    }
};

var getLastSeen = function(timestamp) {
    return 'Last seen ' + moment(timestamp).fromNow();
};

module.exports = {
    get_xbox_presences: get_xbox_presences
};
