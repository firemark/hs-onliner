var Event = Backbone.Model.extend({
    urlRoot: '/',
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: '29-02-2000',
        time_start: '18:00',
        time_end: '24:00'
    }
});

var EventCollection = Backbone.Collection.extend({
    model: Event,
    url: 'http:/localhost:5000/'
});

var EventsTemplate = React.createClass({displayName: "EventsTemplate",
    getInitialState: function() {
        return {
            events: [],
            username: null
        };
    },
    renderElement: function(event) {
        var attrs = event.attributes;
        return (
            React.createElement("li", null, 
                React.createElement("h1", null, attrs.topic), 
                React.createElement("h2", null, attrs.date), 
                React.createElement("p", null, attrs.description), 
                React.createElement("time", null, React.createElement("strong", null, "Start:"), " ", attrs.time_start), 
                React.createElement("time", null, React.createElement("strong", null, "End:"), " ", attrs.time_end)
            )
        );
    },
    render: function() {
        var list = this.state.events.map(this.renderElement);
        return React.createElement("ul", null, list);
    }
});

var EventView = Backbone.View.extend({
    el: '#events',

    initialize: function () {
        var self = this;
        self.events = new EventCollection();
        self.template = new EventsTemplate();
        self.events.sync = function (method, model) {
            console.log(method, model);
            self.template.setState({events: self.events.models});
        };
        self.events.fetch();
    },
    render: function() {
        React.renderComponent(this.template);
        return this;
    }
});

function init() {
    var template = ReactDOM.render(
      React.createElement(EventsTemplate, null),
      document.getElementById('events')
    );
    var eventCollection = new EventCollection();
    eventCollection.fetch({
        success: function () {
            template.setState({events: eventCollection.models});
        }
    })
}