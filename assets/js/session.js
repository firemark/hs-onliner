var Session = BaseModel.extend({
    urlRoot: BASE_URL + '/login',
    idAttribute: 'login',
    defaults: {
        login: null,
        id: null,
        token: null
    }
});

var session = new Session;