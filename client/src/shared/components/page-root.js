import React from 'react';

export default class PageRoot extends React.Component {

  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>{this.props.heading}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
