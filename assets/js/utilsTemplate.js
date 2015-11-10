var If = React.createClass({displayName: "If",
    render: function () {
        if (this.props.cond) {
            var children = this.props.children;
            return children.$$typeof? children : React.createElement("el", null, children);
        }
        return null;
    }
});

var TimeObj = function (value) {
    this.hour = value/60 | 0;
    this.minute = value % 60;
    this.add_zero = this.minute > 10? '' : '0';
};

TimeObj.prototype.show = function () {
    return this.hour + ":" + this.add_zero + this.minute;
};

var TimeEdit = React.createClass({displayName: "TimeEdit",
   render: function () {
       var value = this.props.value;
       var time = new TimeObj(value);
       return (
         React.createElement("div", null, 
             time.show(), 
             React.createElement("br", null), 
             React.createElement("input", {
               value: value, 
               onChange: this.props.onChange, 
               type: "range", min: "0", max: "1440", step: "15"})
         )
       )
   }
});