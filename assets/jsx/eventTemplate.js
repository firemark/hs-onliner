var EventTemplate = React.createClass({
    getInitialState: function() {
        return {
            participants: [],
            editable: false
        };
    },
    render: function() {
        var attrs = this.props.event.attributes;
        var is_logged = this.props.is_logged;
        var date = attrs.date.split('-');

        return (
            <li className='event block'>
                <div className='date'>
                    <h1>{date[0]}-{date[1]}</h1>
                    <small>{date[2]}</small>
                </div>
                <div className='main'>
                    <h1>
                        {attrs.topic || 'general event'}
                        <If cond={is_logged}>
                            <button className="edit-event">✎</button>
                        </If>
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
                    <ParticipantsTemplate
                      participants={this.state.participants}
                      is_logged={is_logged} />
                </div>
            </li>
        );
    },
    componentWillMount: function () {
        var self = this;
        self.props.event.participants.on("sync", function (participants) {
            self.setState({participants: participants});
        });
    }
});
