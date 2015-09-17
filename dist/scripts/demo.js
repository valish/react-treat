/*

  React Treat Driver Demo
  ~~~~~~~~~~~~~~~~~~~~~~~

*/

var Driver = React.createClass({
  render: function() {
    return (
      <li className="driver-demo-driver">
        <h5>{this.props.first_name} {this.props.last_name}</h5>
      </li>
    );
  }
});

var DriverBox = React.createClass({
  loadDriversFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleDriverSubmit: function(driver) {
    var drivers = this.state.data;
    var newDrivers = drivers.concat([driver]);
    this.setState({data: newDrivers});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: driver,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadDriversFromServer();
    setInterval(this.loadDriversFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="driver-demo">
        <h2>Who drives this vehicle?</h2>
        <p>Please add everyone that will operate this vehicle.</p>
        <DriverList data={this.state.data} />
        <DriverForm onDriverSubmit={this.handleDriverSubmit} />
      </div>
    );
  }
});

var DriverList = React.createClass({
  render: function() {
    var driverNodes = this.props.data.map(function(driver, index) {
      return (
        <Driver first_name={driver.first_name} last_name={driver.last_name}>

        </Driver>
      );
    });
    return (
      <ul className="driver-demo-list">
        {driverNodes}
      </ul>
    );
  }
});

var DriverForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var first_name = React.findDOMNode(this.refs.first_name).value.trim();
    var last_name = React.findDOMNode(this.refs.last_name).value.trim();
    var birth_date = React.findDOMNode(this.refs.birth_date).value.trim();
    var sex = React.findDOMNode(this.refs.sex).value.trim();
    if (!first_name || !last_name || !birth_date) {
      return;
    }
    this.props.onDriverSubmit(
      {
        first_name: first_name, 
        last_name: last_name,
        birth_date: birth_date,
        sex: sex
      }
    );
    React.findDOMNode(this.refs.first_name).value = '';
    React.findDOMNode(this.refs.last_name).value = '';
    React.findDOMNode(this.refs.birth_date).value = '';
    React.findDOMNode(this.refs.sex).value = '';
  },
  render: function() {
    return (
      <form className="t-form t-form--small" onSubmit={this.handleSubmit}>
        <div className="t-grid-column--3">
          <div className="t-form-field">
            <input type="text" placeholder="First name" ref="first_name" />
          </div>
        </div>
        <div className="t-grid-column--3">
          <div className="t-form-field">
            <input type="text" placeholder="Last name" ref="last_name" />
          </div>
        </div>
        <div className="t-grid-column--2">
          <div className="t-form-field">
            <input type="text" placeholder="D.O.B." ref="birth_date" />
          </div>
        </div>
        <div className="t-grid-column--3">
          <div className="t-form-field">
            <div className="t-form-select">
              <select ref="sex">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <input type="submit" className="btn--blue" value="Add Driver" />
      </form>
    );
  }
});

React.render(
  <DriverBox url="drivers.json" pollInterval={2000} />,
  document.getElementById('react_driver_demo')
);
