var LoginTemplate = React.createClass({
    getInitialState: function () {
        return {
            'login': '',
            'password': ''
        };
    },
    render: function () {
        if(this.props.is_logged)
            return <div className='login block'>You are logged as {this.state.login}</div>;

        return (
          <form className='login block' onSubmit={this.login}>
              <div>
                  <label>Login</label>
                  <input type='text' value={this.state.login} onChange={this.changeInput('login')} />
              </div>
              <div>
                  <label>Password</label>
                  <input type='text' value={this.state.password} onChange={this.changeInput('password')} />
              </div>

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
        session.save({password: this.state.password}, {patch: true});
        this.setState({
            'password': ''
        });
    }
});
