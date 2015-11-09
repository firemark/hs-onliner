var If = React.createClass({displayName: "If",
    render: function () {
        if (this.props.cond) {
            var children = this.props.children;
            return children.$$typeof? children : React.createElement("el", null, children);
        }
        return null;
    }
});