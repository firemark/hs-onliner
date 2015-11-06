var MainTemplate = React.createClass({
    getInitialState: function () {
        return {
            events: [],
            login: null
        };
    },
    render: function () {
        var is_logged = this.state.login !== null;
        console.log(this.state.events);
        var list = this.state.events.map(function (event) {
            return <EventTemplate
                key={event.attributes.date}
                event={event}
                is_logged={is_logged} />;
        });
        return (
          <div>
            <LoginTemplate is_logged={is_logged} />
            <ul id='main'>{list}</ul>
          </div>
        );
    }
});

function init() {
    var template = ReactDOM.render(
      <MainTemplate />,
      document.getElementById('events')
    );
    var eventCollection = new EventCollection;
    eventCollection.fetch({
        success: function () {
            template.setState({events: eventCollection.models});
        }
    });
    session.on('sync', function () {
       template.setState({
           login: session.get('login')
       })
    });

}