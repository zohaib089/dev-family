import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mt-5 mb-4">Developer Community</h1>
                <p className="lead mt-3">
                  {' '}
                  Join us and share your thoughts through this platform which
                  could be a beacon for Others
                </p>
                <hr />
                <Link to="/register" className="btn btn-lg btn-light mr-2 mt-5">
                  Register
                </Link>
                <Link to="/login" className="btn btn-lg btn-dark mt-5">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
