var ParticipantTemplate = React.createClass({displayName: "ParticipantTemplate",
    getInitialState: function () {
        return {
            name: '',
            will_be: 'yes'
        };
    },
    render: function() {
        var attrs = this.props.participant.attributes;
        var is_logged = this.props.is_logged;
        var isNew = this.props.participant.isNew();
        var will_be = isNew? this.state.will_be : attrs.will_be;
        var className = 'participant participant-' + will_be;
        return (
            React.createElement("li", {className: className}, 
                React.createElement(If, {cond: !isNew}, 
                    "⚫ ", attrs.name
                ), 
                React.createElement(If, {cond: isNew}, 
                    React.createElement("input", {type: "text", value: this.state.name, onChange: this.changeName}), 
                    React.createElement("button", {onClick: this.add}, "✔")
                ), 
                React.createElement(If, {cond: is_logged}, 
                    React.createElement("button", {className: "del", onClick: this.props.del}, "❌")
                )
            )
        );
    },
    changeName: function (ev) {
        return this.setState({name: ev.target.value});
    },
    add: function () {
        var participant = this.props.participant;
        var isNew = participant.isNew();
        participant.set(this.state);
        participant.save(null, {type: isNew? 'POST' : 'PUT'}, function () {
            this.forceUpdate();
            this.replaceState({});
        }.bind(this));

    }
});


var ParticipantsTemplate = React.createClass({displayName: "ParticipantsTemplate",
    render: function() {
        var parts = this.props.participants.models;
        var is_logged = this.props.is_logged;
        if (!parts)
            return React.createElement("div", {className: "participants"});

        var delGenerator = this.delGenerator;

        var RenderedParts = parts.map(function (participant){
            return React.createElement(ParticipantTemplate, {
              key: participant.attributes.name, 
              del: delGenerator(participant), 
              participant: participant, 
              is_logged: is_logged})
        });

        return (
            React.createElement("div", {className: "participants"}, 
                React.createElement("span", null, "Total: ", parts.length), 
                React.createElement("ul", null, 
                    RenderedParts, 
                    React.createElement(If, {cond: is_logged}, 
                        React.createElement("li", null, 
                            React.createElement("button", {onClick: this.addParticipant}, "add")
                        )
                    )
                )
            )
        );
    },
    addParticipant: function () {
        this.props.participants.add([{}]);
        this.forceUpdate();
    },
    delGenerator: function (participant) {
        return function () {
            participant.destroy();
            this.forceUpdate();
        }.bind(this);
    }
});