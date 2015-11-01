var Event = BaseModel.extend({
    url: BASE_URL,
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: '29-02-2000',
        time_start: '18:00',
        time_end: '24:00'
    }
});

var EventCollection = BaseCollection.extend({
    model: Event,
    url: BASE_URL
});
