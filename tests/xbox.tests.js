var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require("rewire");
var moment = require('moment');

var xbox = rewire('../lib/modules/xbox/xbox');

describe('xbox module', function() {
    describe('get xbox presences', function() {
        var fakeProfile,
            profileStub;

        beforeEach(function() {
            fakeProfile = {
                presence: function(xuid, callback) {}
            };

            var fakeXboxClient = {
                profile: fakeProfile
            };

            profileStub = sinon.stub(fakeProfile, 'presence');

            xbox.__set__('xbox', fakeXboxClient);
        });

        it('should get gamertags presence who\'s online', function(done) {
            var fakeConfig = {
                XBOX: {
                    GAMERTAGS: [{
                        XUID: 1,
                        DISPLAY_NAME: 'FakeOnlinePerson'
                    }]
                }
            };

            xbox.__set__('CONFIG', fakeConfig);

            var xboxData = {
                state: 'Online',
                displayName: 'Fake Online Guy',
                devices: [{
                    titles: [{
                        placement: 'Full',
                        name: 'Fake Game'
                    }]
                }]
            };

            profileStub.callsArgWith(1, null, JSON.stringify(xboxData));

            xbox.get_xbox_presences('doesnt matter').then(function(msg) {
                try {
                    expect(msg.segments[1][1]).to.equal(fakeConfig.XBOX.GAMERTAGS[0].DISPLAY_NAME);
                    expect(msg.segments[3][1]).to.equal(xboxData.devices[0].titles[0].name);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should get gamertags presence who\'s online w/ activity', function(done) {
            var fakeConfig = {
                XBOX: {
                    GAMERTAGS: [{
                        XUID: 1,
                        DISPLAY_NAME: 'FakeOnlinePerson'
                    }]
                }
            };

            xbox.__set__('CONFIG', fakeConfig);

            var xboxData = {
                state: 'Online',
                displayName: 'Fake Online Guy',
                devices: [{
                    titles: [{
                        placement: 'Full',
                        name: 'Fake Game',
                        activity: {
                            richPresence: 'Doing fake things!'
                        }
                    }]
                }]
            };

            profileStub.callsArgWith(1, null, JSON.stringify(xboxData));

            xbox.get_xbox_presences('doesnt matter').then(function(msg) {
                try {
                    expect(msg.segments[1][1]).to.equal(fakeConfig.XBOX.GAMERTAGS[0].DISPLAY_NAME);
                    expect(msg.segments[3][1]).to.equal(xboxData.devices[0].titles[0].name);
                    expect(msg.segments[5][1]).to.equal(xboxData.devices[0].titles[0].activity.richPresence);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should get gamertags presence who\'s offline', function(done) {
            var fakeConfig = {
                XBOX: {
                    GAMERTAGS: [{
                        XUID: 1,
                        DISPLAY_NAME: 'FakeOfflinePerson'
                    }]
                }
            };

            xbox.__set__('CONFIG', fakeConfig);

            var xboxData = {
                state: 'Offline',
                displayName: 'Fake Offline Guy'
            };

            profileStub.callsArgWith(1, null, JSON.stringify(xboxData));

            xbox.get_xbox_presences('doesnt matter').then(function(msg) {
                try {
                    expect(msg.segments[1][1]).to.equal(fakeConfig.XBOX.GAMERTAGS[0].DISPLAY_NAME);
                    expect(msg.segments[3][1]).to.equal('Offline');

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should get gamertags presence who\'s offline w/ last seen', function(done) {
            var fakeConfig = {
                XBOX: {
                    GAMERTAGS: [{
                        XUID: 1,
                        DISPLAY_NAME: 'FakeOfflinePerson'
                    }]
                }
            };

            xbox.__set__('CONFIG', fakeConfig);

            var xboxData = {
                state: 'Offline',
                displayName: 'Fake Offline Guy',
                lastSeen: {
                    titleName: 'LastPlayedGame',
                    timestamp: moment().format()
                }
            };

            profileStub.callsArgWith(1, null, JSON.stringify(xboxData));

            xbox.get_xbox_presences('doesnt matter').then(function(msg) {
                try {
                    expect(msg.segments[1][1]).to.equal(fakeConfig.XBOX.GAMERTAGS[0].DISPLAY_NAME);
                    expect(msg.segments[3][1]).to.equal('Last seen a few seconds ago');
                    expect(msg.segments[5][1]).to.equal(xboxData.lastSeen.titleName);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
