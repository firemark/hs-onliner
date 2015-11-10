var If = React.createClass({
    render: function () {
        if (this.props.cond) {
            var children = this.props.children;
            return children.$$typeof? children : <el>{children}</el>;
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

var TimeEdit = React.createClass({
   render: function () {
       var value = this.props.value;
       var time = new TimeObj(value);
       return (
         <div>
             {time.show()}
             <br/>
             <input
               value={value}
               onChange={this.props.onChange}
               type="range" min="0" max="1440" step="15" />
         </div>
       )
   }
});