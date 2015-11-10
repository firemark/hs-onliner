var MainTemplate = React.createClass({displayName: "MainTemplate",
    getInitialState: function () {
        return {
            events: [],
            login: null
        };
    },
    render: function () {
        var is_logged = this.state.login !== null;
        var list = this.state.events.map(function (event) {
            return React.createElement(EventTemplate, {
                key: event.attributes.date, 
                event: event, 
                is_logged: is_logged});
        });
        return (
          React.createElement("div", null, 
              React.createElement(LoginTemplate, {is_logged: is_logged}), 
              React.createElement(If, {cond: is_logged}, 
                  React.createElement("div", {className: "block add-event"}, 
                    React.createElement("button", {onClick: this.add}, "add event")
                  )
              ), 
              React.createElement("ul", {id: "main"}, list)
          )
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
      React.createElement(MainTemplate, null),
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