import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { connect } from 'react-redux';
import { registeruser } from '../../actions/authActions';
export class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registeruser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Register</h1>
              <p className="lead text-center">
                Join Dev-Family and create your account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Enter Your Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="this site use gravatar so use a Gravatar email"
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <input type="submit" className="btn btn-dark btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registeruser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registeruser }
)(withRouter(Register));
