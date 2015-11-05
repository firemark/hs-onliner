var Event = BaseModel.extend({
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: '29-02-2000',
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
    model: Event,
    url: BASE_URL
});
