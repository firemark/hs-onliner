var BASE_URL = 'serv';
var BaseCollection = Backbone.Collection.extend({
    parse: function (data) {
        return data.results;
    },
    initialize: function () {
      this.isUpdated = false;
    }
});

var BaseModel = Backbone.Model.extend({
    initialize: function () {
      this.isUpdated = false;
    }
});