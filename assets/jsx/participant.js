var Participant = BaseModel.extend({
    idAttribute: 'name',
    defaults: {
        name: '',
        will_be: ''
    }
});

var ParticipantCollection = BaseCollection.extend({
    model: Participant,
    url: function () {
        return this.event.url() + '/participant';
    }
});
