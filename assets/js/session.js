var Session = Backbone.Model.extend({
    urlRoot: BASE_URL + '/login',
    idAttribute: 'login',
    defaults: {
        login: null,
        id: null,
        token: null
    },
    sync: function (method, model, options) {
        model.unset('password');
        Backbone.sync.call(this, method, model, options);
    }
});

var session = new Session;