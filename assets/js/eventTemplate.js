var EventTemplate = React.createClass({displayName: "EventTemplate",
    getInitialState: function() {
        return {
            participants: []
        };
    },
    render: function() {
        var attrs = this.props.event.attributes;
        var date = attrs.date.split('-');

        return (
            React.createElement("li", {className: "event"}, 
                React.createElement("div", {className: "date"}, 
                    React.createElement("h1", null, date[0], "-", date[1]), 
                    React.createElement("small", null, date[2])
                ), 
                React.createElement("div", {className: "main"}, 
                    React.createElement("h1", null, attrs.topic || 'general event'), 
                    React.createElement("div", {className: "info"}, 
                        React.createElement("time", {className: "start"}, 
                            React.createElement("strong", null, "Start: "), 
                            attrs.time_start
                        ), 
                        React.createElement("time", {className: "end"}, 
                            React.createElement("strong", null, "End: "), 
                            attrs.time_end
                        )
                    ), 

                    React.createElement("p", null, attrs.description || '-'), 
                    React.createElement(ParticipantsTemplate, {participants: this.state.participants})
                )


            )
        );
    },
    componentWillMount: function () {
        var self = this;
        var partCol = self.props.event.participants;
        if (partCol.length == 0) {
            partCol.fetch({
                success: function () {
                    self.setState({participants: partCol.models});
                }
            })
        }
    }
});
