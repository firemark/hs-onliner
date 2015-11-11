var If = React.createClass({displayName: "If",
    render: function () {
        return this.props.cond? this.props.children : '';
    }
});