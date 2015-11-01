var EventTemplate = React.createClass({
    render: function() {
        var attrs = this.props.event.attributes;
        var date = attrs.date.split('-');
        return (
            <li key={attrs.date} className='event'>
                <div className='date'>
                    <h1>{date[0]}-{date[1]}</h1>
                    <small>{date[2]}</small>
                </div>
                <div className='main'>
                    <h1>{attrs.topic || 'general event'}</h1>
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
                </div>

            </li>
        );
    }
});
