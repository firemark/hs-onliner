var Participant = BaseModel.extend({
    idAttribute: 'name',
    defaults: {
        name: null,
        will_be: 'yes'
    }
});

var ParticipantCollection = BaseCollection.extend({
    model: Participant,
    url: function () {
        return this.event.url() + '/participant';
    }
});
