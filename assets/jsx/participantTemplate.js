var ParticipantTemplate = React.createClass({
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
            <li className={className}>
                <If cond={!isNew}>
                    ⚫ {attrs.name}
                </If>
                <If cond={isNew}>
                    <input type='text' value={this.state.name} onChange={this.changeName} />
                    <button onClick={this.add}>✔</button>
                </If>
                <If cond={is_logged}>
                    <button className='del' onClick={this.del} >❌</button>
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
        participant.save(null, {
            type: isNew? 'POST' : 'PUT',
            success: function () {
                this.setState(this.getInitialState());
            }.bind(this),
            error: function () {
                participant.set({name: null});
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


var ParticipantsTemplate = React.createClass({
    render: function() {
        var parts = this.props.participants;
        var is_logged = this.props.is_logged;
        if (_.isNull(parts))
            return <div className='participants'></div>;

        var RenderedParts = parts.map(function (participant){
            return <ParticipantTemplate
              key={participant.attributes.name}
              participant={participant}
              is_logged={is_logged} />
        });

        return (
            <div className='participants'>
                <span>Total: {parts.length}</span>
                <ul>
                    {RenderedParts}
                    <If cond={is_logged}>
                        <li><button onClick={this.add}>add</button></li>
                    </If>
                </ul>
            </div>
        );
    },
    add: function () {
        var parts = this.props.participants;
        if (!parts.findWhere({name: null}))
            this.props.participants.add([{}]);
    }
});