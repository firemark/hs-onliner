var LoginTemplate = React.createClass({displayName: "LoginTemplate",
    getInitialState: function () {
        return {
            'login': '',
            'password': ''
        };
    },
    render: function () {
        if(this.props.is_logged)
            return React.createElement("div", {className: "login-info"}, "You are logged as ", this.state.login);

        return (
          React.createElement("form", {className: "login", onSubmit: this.login}, 
              React.createElement("input", {type: "text", value: this.state.login, onChange: this.changeInput('login')}), 
              React.createElement("input", {type: "text", value: this.state.password, onChange: this.changeInput('password')}), 
              React.createElement("button", null, "Login")
          )
        );
    },
    changeInput: function (state) {
        return function (ev) {
            var obj = {};
            obj[state] = ev.target.value;
            this.setState(obj);
        }.bind(this);
    },
    login: function (ev) {
        ev.preventDefault();
        session.set({login: this.state.login});
        console.log(session.isNew());
        session.save({password: this.state.password}, {patch: true});
        this.setState({
            'password': ''
        });
    }
});
