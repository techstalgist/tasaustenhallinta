import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Header extends React.Component {

  render() {
    const {loggedIn, currentRoute} = this.props;
    const links = !loggedIn ? [
      {
        title: "Kirjautuminen",
        url: "/login"
      },
    ] : [
      {
        title: "Tasaukset",
        url: "/auth/adjustments"
      },
      {
        title: "Laskut",
        url: "/auth/bills"
      },
      {
        title: "Kategoriat",
        url: "/auth/categories"
      },
      {
        title: "Kirjaudu ulos",
        url: "/login"
      }
    ];
    const updatedLinks = links.map((link) => {
      link.className = "nav-item nav-link";
      link.className = link.url === currentRoute ? link.className + " active" : link.className;
      return link;
    });
    return(
        <header>
          <div className="container">
            <div className="row">
              <div className="col">
                <nav className="navbar navbar-expand-lg navbar-light bg-light no-left-padding">
                  <Link to="/login" className="navbar-brand">Tasaustenhallinta</Link>
                  <div className="navbar-nav">
                    {updatedLinks.map( link =>
                       (
                           <Link key={link.url} className={link.className} to={link.url}>{link.title}</Link>
                       )
                     )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
       </header>
    )
  }
}


const mapStateToProps = (state) => (
  {
    loggedIn: state.loginData.logInInfo.loggedIn
  }
);

Header = connect(
  mapStateToProps,
  null
)(Header)

export default Header;
