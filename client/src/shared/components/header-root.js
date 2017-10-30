import React from 'react';
import Header from './header';
import {withRouter} from 'react-router-dom';

class HeaderRoot extends React.Component {

  render() {

    return (
      <div>
        <Header currentRoute={this.props.location.pathname}/>
      </div>
    )
  }
}

const HeaderRootWithRouter = withRouter(HeaderRoot);

export default HeaderRootWithRouter;
