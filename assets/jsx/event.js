var EventModel = BaseModel.extend({
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: null,
        time_start: '18:00',
        time_end: '24:00'
    },

    initialize: function () {
        this.participants = new ParticipantCollection;
        this.participants.event = this;
        this.participants.fetch();
    }
});

var EventCollection = BaseCollection.extend({
    model: EventModel,
    url: BASE_URL
});
