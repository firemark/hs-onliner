var EventTemplate = React.createClass({
    getInitialState: function() {
        return {
            participants: []
        };
    },
    render: function() {
        var attrs = this.props.event.attributes;
        var date = attrs.date.split('-');

        var edit_button = '';
        if (this.props.is_logged) {
            edit_button = <button className="edit-event">✎</button>;
        }

        return (
            <li className='event block'>
                <div className='date'>
                    <h1>{date[0]}-{date[1]}</h1>
                    <small>{date[2]}</small>
                </div>
                <div className='main'>
                    <h1>
                        {attrs.topic || 'general event'}
                        {edit_button}
                    </h1>
                    <div className='info'>
                        <time className='start'>
                            <strong>Start: </strong>
                            {attrs.time_start}
                        </time>
                        <time className='end'>
                            <strong>End: </strong>
                            {attrs.time_end}
                        </time>
                    </div>

                    <p>{attrs.description || '-'}</p>
                    <ParticipantsTemplate participants={this.state.participants} />
                </div>
            </li>
        );
    },
    componentWillMount: function () {
        var self = this;
        console.log('mount');
        self.props.event.participants.on("update", function (participants) {
            self.setState({participants: participants.models});
        });
    }
});
