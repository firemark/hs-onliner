var BASE_URL = 'serv';
var BaseCollection = Backbone.Collection.extend({
    parse: function (data) {
        return data.results;
    }
});

var BaseModel = Backbone.Model.extend({

});