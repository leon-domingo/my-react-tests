import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_ICON_TYPE = 'fal';

const button = function({caption, iconName, iconType, danger, clicked}) {
  const buttonStyle = {
    backgroundColor: danger ? '#c00' : '#444',
    color: '#fff',
    border: 0,
    borderRadius: '.25rem',
    padding: '.5rem 1rem',
    margin: '0 .5rem 0 0',
    fontWeight: 300,
    cursor: 'pointer',
  };

  let iconEl = null;
  if (iconName) {
    const iconClassName = `${iconType || DEFAULT_ICON_TYPE} fa-${iconName}`;
    iconEl = (
      <span>
        <i className={iconClassName} />
        &nbsp;
      </span>
    );
  }
  return (
    <button style={buttonStyle} onClick={clicked}>
      {iconEl}{caption}
    </button>
  );
};

button.propTypes = {
  caption: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  danger: PropTypes.bool,
  clicked: PropTypes.func.isRequired,
};

export default button;
