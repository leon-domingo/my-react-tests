import React from 'react';
import PropTypes from 'prop-types';

const frecuency = function({frecuency}) {
  const frecuencyStyle = {
    backgroundColor: 'purple',
    color: '#fff',
    padding: '1rem',
    margin: '0 .5rem 0 0',
    display: 'inline-block',
    border: '.25rem solid #444',
    borderRadius: '.25rem',
    fontSize: '1.5rem',
  };
  return (
    <span style={frecuencyStyle}>
      <i className="fal fa-tachometer-fast" />&nbsp;
      {frecuency}
    </span>
  );
};

frecuency.protoTypes = {
  frecuency: PropTypes.number.isRequired,
};

export default frecuency;
