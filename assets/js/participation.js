var Participant = BaseModel.extend({
    url: 'participant/',
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: '29-02-2000',
        time_start: '18:00',
        time_end: '24:00'
    }
});

var ParticipantCollection = BaseCollection.extend({
    model: Event,
    url: 'participant/'
});
