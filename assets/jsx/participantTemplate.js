var ParticipantTemplate = React.createClass({
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
            <li className={className}>
                <If cond={!isNew}>
                    ⚫ {attrs.name}
                </If>
                <If cond={isNew}>
                    <input type='text' value={this.state.name} onChange={this.changeName} />
                    <button onClick={this.add}>✔</button>
                </If>
                <If cond={is_logged}>
                    <button className='del' onClick={this.props.del} >❌</button>
                </If>
            </li>
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


var ParticipantsTemplate = React.createClass({
    render: function() {
        var parts = this.props.participants.models;
        var is_logged = this.props.is_logged;
        if (!parts)
            return <div className='participants'></div>;

        var delGenerator = this.delGenerator;

        var RenderedParts = parts.map(function (participant){
            return <ParticipantTemplate
              key={participant.attributes.name}
              del={delGenerator(participant)}
              participant={participant}
              is_logged={is_logged} />
        });

        return (
            <div className='participants'>
                <span>Total: {parts.length}</span>
                <ul>
                    {RenderedParts}
                    <If cond={is_logged}>
                        <li>
                            <button onClick={this.addParticipant}>add</button>
                        </li>
                    </If>
                </ul>
            </div>
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