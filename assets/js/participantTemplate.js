var ParticipantTemplate = React.createClass({displayName: "ParticipantTemplate",
    render: function() {
        var attrs = this.props.participant.attributes;
        var className = 'participant participant-' + attrs.will_be;
        return (
            React.createElement("li", {className: className}, 
                "⚫ ", attrs.name
            )
        );
    }
});


var ParticipantsTemplate = React.createClass({displayName: "ParticipantsTemplate",
    render: function() {
        var parts = this.props.participants;
        if (!parts) {
            return React.createElement("div", {className: "participants"});
        }

        var RenderedParts = parts.map(function (participant){
            return React.createElement(ParticipantTemplate, {
              key: participant.attributes.name, 
              participant: participant})
        });

        return (
            React.createElement("div", {className: "participants"}, 
                React.createElement("span", null, "Total: ", parts.length), 
                React.createElement("ul", null, RenderedParts)
            )

        );
    }
});