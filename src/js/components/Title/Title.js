import React from 'react';
import PropTypes from 'prop-types';

const title = function({text}) {
  const titleStyle = {
    margin: '0 0 1rem',
    padding: '1rem',
    fontWeight: 300,
    backgroundColor: 'orange',
  };
  return (
    <h1 style={titleStyle}>{text}</h1>
  );
};

title.propTypes = {
  text: PropTypes.string.isRequired,
};

export default title;

