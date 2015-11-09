var BASE_URL = 'serv';
var BaseCollection = Backbone.Collection.extend({
    parse: function (data) {
        return data.results;
    },
});

var BaseModel = Backbone.Model.extend({
    sync: function(method, model, options) {
        var headers = {};
        var id = session.get('id');
        var token = session.get('token');
        if (method != 'read') {
            headers.Authorization = "Basic " + btoa(id + ":" + token);
        }
        options.headers = headers;
        return Backbone.sync.call(this, method, model, options);
    }
});