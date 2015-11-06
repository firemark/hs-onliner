var LoginTemplate = React.createClass({
    getInitialState: function () {
        return {
            'login': '',
            'password': ''
        };
    },
    render: function () {
        if(this.props.is_logged)
            return <div className='login-info'>You are logged as {this.state.login}</div>;

        return (
          <form className='login' onSubmit={this.login}>
              <input type='text' value={this.state.login} onChange={this.changeInput('login')} />
              <input type='text' value={this.state.password} onChange={this.changeInput('password')} />
              <button>Login</button>
          </form>
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
