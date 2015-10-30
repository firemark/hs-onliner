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

var EventTemplate = React.createClass({
    render: function() {
        var attrs = this.props.event.attributes;
        return (
            <li>
                <h1>{attrs.topic}</h1>
                <h2>{attrs.date}</h2>
                <p>{attrs.description}</p>
                <time><strong>Start:</strong> {attrs.time_start}</time>
                <time><strong>End:</strong> {attrs.time_end}</time>
            </li>
        );
    }
});

var MainTemplate = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            username: null
        };
    },
    renderElement: function(event) {
        var attrs = event.attributes;
        return (
            <li>
                <h1>{attrs.topic}</h1>
                <h2>{attrs.date}</h2>
                <p>{attrs.description}</p>
                <time><strong>Start:</strong> {attrs.time_start}</time>
                <time><strong>End:</strong> {attrs.time_end}</time>
            </li>
        );
    },
    render: function() {
        var list = this.state.events.map(function (event) {
            return <EventTemplate event={event} />;
        });
        return <ul>{list}</ul>;
    }
});

function init() {
    var template = ReactDOM.render(
      <MainTemplate />,
      document.getElementById('events')
    );
    var eventCollection = new EventCollection();
    eventCollection.fetch({
        success: function () {
            template.setState({events: eventCollection.models});
        }
    })
}