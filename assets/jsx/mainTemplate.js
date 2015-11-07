var MainTemplate = React.createClass({
    getInitialState: function () {
        return {
            events: [],
            login: null
        };
    },
    render: function () {
        var is_logged = this.state.login !== null;
        var list = this.state.events.map(function (event) {
            return <EventTemplate
                key={event.attributes.date}
                event={event}
                is_logged={is_logged} />;
        });

        var add_event = '';
        if (is_logged) {
            add_event = (
              <div className='block add-event'>
                add event
              </div>
            );
        }

        return (
          <div>
              <LoginTemplate is_logged={is_logged} />
              {add_event}
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