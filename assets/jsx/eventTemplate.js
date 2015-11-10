var eventSelectRangeMap = function (a, b) {
    var aa = b !== undefined? a : 1;
    var bb = b !== undefined? b : a;
    return _.range(aa, bb + 1).map(function (i) {
        var add_zero = i < 10? '0' : '';
        return <option key={i} value={i}>{add_zero + i}</option>;
    })
};

var EventTemplate = React.createClass({
    getInitialState: function() {
        return {
            participants: [],
            isEditable: false,
            topic: '',
            description: '',
            time_start_min: 1080,
            time_end_min: 1200,
            date: new Date()
        };
    },
    render: function() {
        var attrs = this.props.event.attributes;
        var state = this.state;
        var isEditable = this.state.isEditable;
        var is_logged = this.props.is_logged;
        var days = new Date(state.date.getYear(), state.date.getDay(), 0).getDate();
        var date = ['XX', 'XX', 'XXXX'];
        if (attrs.date)
            date = attrs.date.split('-');

        return (
            <li className='event block'>
                <If cond={!this.props.event.isNew()}>
                    <div className='date'>
                        <h1>{date[0]}-{date[1]}</h1>
                        <small>{date[2]}</small>
                    </div>
                </If>
                <If cond={this.props.event.isNew()}>
                    <div className='date'>
                        <h1>
                            <select value={state.date.getDay()} onChange={this.setDay}>
                                {eventSelectRangeMap(days)}
                            </select>
                            -
                            <select value={state.date.getMonth() + 1} onChange={this.setMonth}>
                                {eventSelectRangeMap(12)}
                            </select>
                        </h1>
                        <small>
                            <select value={state.date.getFullYear()} onChange={this.setYear}>
                                {eventSelectRangeMap(2014, state.date.getFullYear() + 2)}
                            </select>
                        </small>
                    </div>
                </If>
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
                            <input value={state.topic} onChange={this.changeInput('topic')} />
                            <button className="edit-event del" onClick={this.del}>❌</button>
                            <button className="edit-event" onClick={this.add}>✔</button>
                        </h1>
                        <div className='info'>
                            <time className='start'>
                                <strong>Start: </strong>
                                <TimeEdit
                                  value={this.state.time_start_min}
                                  onChange={this.changeInput('time_start_min')} />
                            </time>
                            <time className='end'>
                                <strong>End: </strong>
                                <TimeEdit
                                  value={this.state.time_end_min}
                                  onChange={this.changeInput('time_end_min')} />
                            </time>
                        </div>
                        <textarea onChange={this.changeInput('description')} value={state.description}></textarea>
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
        var attrs = this.props.event.attributes;
        this.setState({isEditable: true});
        var time_start = attrs.time_start.split(':');
        var time_end = attrs.time_start.split(':');
        this.setState({
            topic: attrs.topic,
            description: attrs.descritption

        });
    },
    del: function () {
        this.props.event.destroy();
    },
    add: function () {
        var event = this.props.event;
        var state = this.state;
        var isNew = event.isNew();
        var time_start = new TimeObj(state.time_start_min).show();
        var time_end = new TimeObj(state.time_end_min).show();
        event.set({
            topic: state.topic,
            description: state.description,
            time_start: time_start,
            time_end: time_end
        });
        if (isNew) {
            var date = state.date;
            event.set({
                date: (
                    date.getDay() + '-' +
                    (date.getMonth() + 1) + '-' +
                    date.getFullYear()
                )
            })
        }
        event.save(null, {
            type: isNew? 'POST' : 'PUT',
            success: function () {
                this.setState(this.getInitialState());
            }.bind(this),
            error: function () {
                if (isNew)
                    event.set({date: null});
            }.bind(this)
        });
    },
    changeInput: function (state) {
        return function (ev) {
            var obj = {};
            obj[state] = ev.target.value;
            this.setState(obj);
        }.bind(this);
    },
    setDay: function(ev) {
        this.setState({date: this.date.setDate(ev.target.value)});
    },
    setMonth: function(ev) {
        this.setState({date: this.date.setDate(ev.target.value)});
    },
    setYear: function(ev) {
        this.setState({date: this.date.setDate(ev.target.value)});
    }
});
