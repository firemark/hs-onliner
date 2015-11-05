var BASE_URL = 'serv';
var BaseCollection = Backbone.Collection.extend({
    parse: function (data) {
        return data.results;
    },
    initialize: function () {
        this.isUpdated = false;
    },
    sync: function(method, model, options) {
        console.log(method);
        console.log(model);
        return Backbone.sync.call(this, method, model, options);
    }
});

var BaseModel = Backbone.Model.extend({
    initialize: function () {
        this.isUpdated = false;
    }
});