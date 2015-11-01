var ParticipantTemplate = React.createClass({
    render: function() {
        var attrs = this.props.participant.attributes;
        var className = 'participant participant-' + attrs.will_be;
        return (
            <li className={className}>
                ⚫ {attrs.name}
            </li>
        );
    }
});


var ParticipantsTemplate = React.createClass({
    render: function() {
        var parts = this.props.participants || [];

        var RenderedParts = parts.map(function (participant){
            return <ParticipantTemplate
              key={participant.attributes.name}
              participant={participant} />
        });
        return (
            <div className='participants'>
                <span>Total: {parts.length}</span>
                <ul>{RenderedParts}</ul>
            </div>

        );
    }
});