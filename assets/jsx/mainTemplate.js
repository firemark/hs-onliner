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
    }
});

function init() {
    var template = ReactDOM.render(
      <MainTemplate />,
      document.getElementById('events')
    );
    var eventCollection = new EventCollection;
    eventCollection.on('update', function () {
        template.setState({events: eventCollection});
    });
    eventCollection.fetch();
    session.on('sync', function () {
       template.setState({
           login: session.get('login')
       })
    });

}