var EventTemplate = React.createClass({
    getInitialState: function() {
        return {
            participants: [],
            isEditable: false
        };
    },
    render: function() {
        var attrs = this.props.event.attributes;
        var isEditable = this.state.isEditable;
        var is_logged = this.props.is_logged;
        var date = attrs.date.split('-');

        return (
            <li className='event block'>
                <div className='date'>
                    <h1>{date[0]}-{date[1]}</h1>
                    <small>{date[2]}</small>
                </div>
                <div className='main'>
                    <If cond={!isEditable}>
                        <h1>
                            {attrs.topic}
                            <If cond={is_logged}>
                                <button className="edit-event del">❌</button>
                                <button className="edit-event" onClick={this.edit}>✎</button>
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
                        <p>{attrs.description}</p>
                    </If>
                    <If cond={isEditable && is_logged}>
                        <h1>
                            <input value={attrs.topic} />
                            <button className="edit-event del">❌</button>
                            <button className="edit-event">✔</button>
                        </h1>
                        <div className='info'>
                            <time className='start'>
                                <strong>Start: </strong>
                                <input value={attrs.time_start} />
                            </time>
                            <time className='end'>
                                <strong>End: </strong>
                                <input value={attrs.time_end} />
                            </time>
                        </div>
                        <textarea>{attrs.description}</textarea>
                    </If>

                    <ParticipantsTemplate
                      participants={this.state.participants}
                      is_logged={is_logged} />
                </div>
            </li>
        );
    },
    componentWillMount: function () {
        this.setState({isEditable: this.props.event.isNew()});
        this.props.event.participants.on("update", function (participants) {
            this.setState({participants: participants});
        }.bind(this));
    },
    edit: function () {
        this.setState({isEditable: true});
    }
});
