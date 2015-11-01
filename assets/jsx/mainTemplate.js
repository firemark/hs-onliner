var MainTemplate = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            username: null
        };
    },
    render: function() {
        var list = this.state.events.map(function (event) {
            return <EventTemplate event={event} />;
        });
        return <ul id='main'>{list}</ul>;
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
            console.log(eventCollection.models);
            template.setState({events: eventCollection.models});
        }
    })
}