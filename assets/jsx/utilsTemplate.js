var If = React.createClass({
    render: function () {
        if (this.props.cond) {
            var children = this.props.children;
            return children.$$typeof? children : <el>{children}</el>;
        }
        return null;
    }
});