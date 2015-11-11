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
        return (
          <div>
              <LoginTemplate is_logged={is_logged} />
              <If cond={is_logged}>
                  <div className='block add-event'>
                    <button onClick={this.add}>add event</button>
                  </div>
              </If>
              <ul id='main'>{list}</ul>
          </div>
        );
    },
    add: function () {
        var events = this.state.events;
        if (!events.findWhere({date: null}))
            events.add([{}], {at: 0});
    },
    componentWillMount: function () {
        var eventCollection = new EventCollection;
        var change_event = function (events) {
            if (!(events instanceof Backbone.Collection))
                return;
            this.setState({events: events});
        }.bind(this);
        eventCollection.on("sync", change_event);
        eventCollection.on("update", change_event);
        eventCollection.fetch();
        session.on('sync', function () {
           this.setState({
               login: session.get('login')
           })
        }.bind(this));
    }
});

function init() {
    ReactDOM.render(
      <MainTemplate />,
      document.getElementById('events')
    );


}