var Event = Backbone.Model.extend({
    urlRoot: '/',
    idAttribute: 'date',
    defaults: {
        topic: '',
        description: '',
        date: '29-02-2000',
        time_start: '18:00',
        time_end: '24:00'
    }
});

var EventsTemplate = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            username: null
        };
    },
    renderElement: function(event) {
        attrs = event.attribues;
        return (
            <li>
                <h1>{attrs.topic}</h1>
                <h2>{attrs.date}</h2>
                <p>{attrs.description}</p>
                <time><strong>Start:</strong> {attrs.time_start}</time>
                <time><strong>End:</strong> {attrs.time_end}</time>
            </li>
        );
    },
    render: function() {
        var list = this.events.map(this.renderElement);
        return <ul>{list}</ul>;
    }
});