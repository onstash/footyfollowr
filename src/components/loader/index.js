import React from 'react';

import CSSTransition from 'react-transition-group/CSSTransition';

const Loader = ({ message }) => (
  <CSSTransition
    in={true}
    timeout={5000}
    classNames="fa-fade"
  >
    <div className="fa-loader-backdrop">
      <div className="fa-loader-container">
        <div className="fa-loader-circle" />
        <div className="fa-loader-message">
          {message || 'Loading...'}
        </div>
      </div>
    </div>
  </CSSTransition>
);

export default Loader;
