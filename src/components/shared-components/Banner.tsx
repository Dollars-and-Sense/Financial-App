import React from 'react';
import 'style/Banner.css';
import 'style/materialize.css';

const Banner = ({message}: {message: any}): JSX.Element => (
  <div className="banner">
    <h6>{message}</h6>
  </div>
);

export default Banner;
