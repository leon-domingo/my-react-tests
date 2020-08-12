import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Title from '../Title/Title';
import Counter from '../Counter/Counter';
import Button from '../Button/Button';
import Frecuency from '../Frecuency/Frecuency';

const frecuencyStep = 50;

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     frecuency: this.props.initialFrecuency,
  //     interval: null,
  //     counter: 0,
  //   };
  // }

  state = {
    frecuency: this.props.initialFrecuency,
    interval: null,
    counter: 0,
  };

  increaseCounter = () => {
    this.setState(({counter}) => ({counter: counter + 1}));
  }

  resetCounterClickHandler = () => {
    this.setState({counter: 0});
  }

  resetInterval = (frecuency) => {
    return setInterval(this.increaseCounter, frecuency);
  }

  startCount = () => {
    this.setState(({interval}) => {
      interval && clearInterval(interval);
      const newInterval = this.resetInterval(this.props.initialFrecuency);
      return {interval: newInterval};
    });
  }

  stopCount = () => {
    this.setState(({interval}) => {
      interval && clearInterval(interval);
      return {interval: null};
    });
  }

  stopAndResetHandler = () => {
    this.stopCount();
    this.resetCounterClickHandler();
    this.setState({frecuency: this.props.initialFrecuency});
  }

  increaseSpeedClickHandler = (frecuencyStep) => {
    if (this.state.frecuency > frecuencyStep) {
      this.setState(({interval, frecuency}) => {
        interval && clearInterval(interval);
        const newInterval = this.resetInterval(frecuency);
        return {
          interval: newInterval,
          frecuency: frecuency - frecuencyStep,
        };
      });
    }
  }

  decreaseSpeedClickHandler = (frecuencyStep) => {
    this.setState(({interval, frecuency}) => {
      interval && clearInterval(interval);
      const newInterval = this.resetInterval(frecuency);
      return {
        interval: newInterval,
        frecuency: frecuency + frecuencyStep,
      };
    });
  }

  isRunning = () => this.state.interval !== null;

  componentWillUnmount() {
    this.state.interval && clearInterval(this.state.interval);
  }

  render() {
    let startStopCaption,
      startStopIcon,
      startStopHandler,
      speedButtons = null;
    if (this.isRunning()) {
      startStopCaption = 'Stop';
      startStopIcon = 'stop-circle';
      startStopHandler = this.stopCount;

      speedButtons = (
        <div style={{margin: '.5rem 0 0', backgroundColor: 'purple'}}>
          <Button
            caption={`Increase speed by ${frecuencyStep}ms`}
            iconName="caret-circle-up"
            clicked={this.increaseSpeedClickHandler.bind(this, frecuencyStep)}
          />
          <Button
            caption={`Increase speed by ${frecuencyStep * 2}ms`}
            iconName="caret-circle-up"
            clicked={this.increaseSpeedClickHandler.bind(this, frecuencyStep * 2)}
          />
          <Button
            caption={`Decrease speed by ${frecuencyStep}ms`}
            iconName="caret-circle-down"
            clicked={this.decreaseSpeedClickHandler.bind(this, frecuencyStep)}
          />
          <Button
            caption={`Decrease speed by ${frecuencyStep * 2}ms`}
            iconName="caret-circle-down"
            clicked={this.decreaseSpeedClickHandler.bind(this, frecuencyStep * 2)}
          />
        </div>
      );
    } else {
      startStopCaption = 'Start!';
      startStopHandler = this.startCount;
      startStopIcon = 'play-circle';
    }

    let statusIconName = (this.state.interval)
      ? 'rabbit-fast'
      : 'turtle';

    return (
      <React.Fragment>
        <Title text={this.props.title}/>
        <span style={{
          padding: '1rem',
          border: '1px solid #ddd',
          marginRight: '.5rem',
          fontSize: '1.5rem',
          borderRadius: '.25rem',
        }}>
          <i className={`fal fa-${statusIconName}`} />
        </span>
        <Counter counter={this.state.counter} />
        <Frecuency frecuency={`every ${this.state.frecuency}ms`} />
        <hr/>
        <Button
          caption={startStopCaption}
          iconType="fal"
          iconName={startStopIcon}
          clicked={startStopHandler}
        />

        {this.state.counter > 0 && <Button
          caption="Reset counter"
          iconName="redo"
          clicked={this.resetCounterClickHandler}
        />}

        {this.isRunning() && <Button
          caption="Stop & Reset"
          iconName="power-off"
          danger
          clicked={this.stopAndResetHandler}
        />}
        <br/>
        {speedButtons}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  title: PropTypes.string.isRequired,
  initialFrecuency: PropTypes.number.isRequired,
};

export default App;
