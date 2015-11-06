var BASE_URL = 'serv';
var BaseCollection = Backbone.Collection.extend({
    parse: function (data) {
        return data.results;
    },
    sync: function(method, model, options) {
        //console.log(method);
        //console.log(model);
        return Backbone.sync.call(this, method, model, options);
    }
});

var BaseModel = Backbone.Model.extend({
});