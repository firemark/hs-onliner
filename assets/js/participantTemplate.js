var ParticipantTemplate = React.createClass({displayName: "ParticipantTemplate",
    getInitialState: function () {
        return {
            name: '',
            will_be: 'yes',
            isEditable: false
        };
    },
    render: function() {
        var attrs = this.props.participant.attributes;
        var is_logged = this.props.is_logged;
        var isNew = this.state.isEditable;
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
                    React.createElement("button", {className: "del", onClick: this.del}, "❌")
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
        participant.save(null, {
            type: isNew? 'POST' : 'PUT',
            success: function () {
                this.setState(this.getInitialState());
            }.bind(this),
            error: function () {
                participant.clear();
            }.bind(this)
        });
    },
    del: function () {
        this.props.participant.destroy();
    },
    componentWillMount: function () {
        this.setState({isEditable: this.props.participant.isNew()})
    }
});


var ParticipantsTemplate = React.createClass({displayName: "ParticipantsTemplate",
    render: function() {
        var parts = this.props.participants.models;
        var is_logged = this.props.is_logged;
        if (!parts)
            return React.createElement("div", {className: "participants"});


        var RenderedParts = parts.map(function (participant){
            return React.createElement(ParticipantTemplate, {
              key: participant.attributes.name, 
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
    }
});