const expect = require('chai').expect;

const getMemoryDataStore = require('../../utils/client').getMemoryDataStore;
const messageHandlers = require('../../../lib/data-store/message-handlers');

const getRTMMessageFixture = require('../../fixtures').getRTMMessage;

const GENERAL_CHANNEL_ID = 'C0CHZA86Q';


describe('RTM API Message Handlers: Reaction Events', function () {

  it('should add a reaction when a `reaction_added` event is received', function () {
    const dataStore = getMemoryDataStore();
    const channel = dataStore.getChannelById(GENERAL_CHANNEL_ID);
    const message = channel.getMessageByTs('1444959632.000002');

    messageHandlers.reaction_added(dataStore, getRTMMessageFixture('reaction_added'));
    expect(message.reactions).to.have.length(1);
    expect(message.reactions[0]).to.have.property('name', '+1');
  });

  it('should remove a reaction when a `reaction_removed` event is received', function () {
    const dataStore = getMemoryDataStore();
    const channel = dataStore.getChannelById(GENERAL_CHANNEL_ID);
    const message = channel.getMessageByTs('1444959632.000002');

    messageHandlers.reaction_added(dataStore, getRTMMessageFixture('reaction_added'));
    expect(message.reactions[0]).to.have.property('name', '+1');
    messageHandlers.reaction_removed(dataStore, getRTMMessageFixture('reaction_removed'));
    expect(message.reactions).to.have.length(0);
  });

});
