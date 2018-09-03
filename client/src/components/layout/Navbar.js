import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

export class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  };
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLink = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed" style={{ color: 'white' }}>
            Post Feeds
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard" style={{ color: 'white' }}>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick}
            className="nav-link"
            style={{ color: 'white' }}
          >
            <img
              className="rounded-circle"
              src={user.avatar}
              alt={user.name}
              style={{ width: '25px', marginRight: '5px' }}
            />
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLink = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register" style={{ color: 'white' }}>
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login" style={{ color: 'white' }}>
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      // <!-- Navbar -->
      <nav
        className="navbar navbar-expand-sm navbar-light   mb-4"
        style={{ backgroundColor: 'black', textColor: 'white' }}
      >
        <div className="container">
          <Link className="navbar-brand" to="/" style={{ color: 'white' }}>
            Dev-Family
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/profiles"
                  style={{ color: 'white' }}
                >
                  {' '}
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLink : guestLink}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
