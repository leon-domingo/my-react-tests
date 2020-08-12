import React from 'react';
import PropTypes from 'prop-types';

const counter = function({counter}) {
  const counterStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    padding: '1rem',
    margin: '0 .5rem 0 0',
    display: 'inline-block',
    border: '.25rem solid #444',
    borderRadius: '.25rem',
    minWidth: '4rem',
    textAlign: 'center',
    boxSizing: 'border-box',
  };
  return (
    <span style={counterStyle}>{counter}</span>
  );
};

counter.protoTypes = {
  counter: PropTypes.number.isRequired,
};

export default counter;
