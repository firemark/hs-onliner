var MainTemplate = React.createClass({displayName: "MainTemplate",
    getInitialState: function() {
        return {
            events: [],
            username: null
        };
    },
    render: function() {
        var list = this.state.events.map(function (event) {
            return React.createElement(EventTemplate, {event: event});
        });
        return React.createElement("ul", {id: "main"}, list);
    }
});

function init() {
    var template = ReactDOM.render(
      React.createElement(MainTemplate, null),
      document.getElementById('events')
    );
    var eventCollection = new EventCollection();
    eventCollection.fetch({
        success: function () {
            console.log(eventCollection.models);
            template.setState({events: eventCollection.models});
        }
    })
}