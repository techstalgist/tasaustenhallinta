import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Logout from '../../login/components/logout';

class Header extends React.Component {

   getLinks (loggedIn, loggedIntoGroup) {
     let links;
      if (!loggedIn) {
        links = [
          {
            title: "Kirjautuminen",
            url: "/login"
          },
          {
            title: "Unohtunut salasana",
            url: "/forgotpass"
          },
          {
            title: "Test",
            url: "/reset-password/123"
          }
        ];
        if (loggedIntoGroup) {
          links.push({
            title: "Käyttäjän luonti",
            url: "/auth/signup"
          });
        } else {
          links.push({
            title: "Käyttäjäryhmään kirjautuminen",
            url: "/grouplogin"
          });
          links.push({
            title: "Käyttäjäryhmän luonti",
            url: "/groupsignup"
          });
        }
        return links;
      } else {
        links = [
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
            title: "Analyysi",
            url: "/auth/analysis"
          },
          {
            title: "Käyttäjän tiedot",
            url: "/auth/user"
          }
        ];
        return links;
      }
  }
  render() {
    const {loggedIn, currentRoute, loggedIntoGroup} = this.props;
    const links = this.getLinks(loggedIn, loggedIntoGroup);
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
                <nav className="navbar navbar-expand-lg navbar-light bg-light short-left-padding">
                  <Link to="/login" className="navbar-brand">Tasaustenhallinta</Link>
                  <div className="navbar-nav">
                    {updatedLinks.map( link =>
                       (
                           <Link key={link.url} className={link.className} to={link.url}>{link.title}</Link>
                       )
                     )}
                     <Logout/>
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
    loggedIn: state.loginData.logInInfo.loggedIn,
    loggedIntoGroup: state.signUpData.loggedIntoGroup
  }
);

Header = connect(
  mapStateToProps,
  null
)(Header)

export default Header;
