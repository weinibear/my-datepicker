import React, { PureComponent } from 'react';
import Panel from '../Panel';

import Languages from '../languages';
import './index.scss';

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPanelOpen: false,
      langs: 'zh',
      translationData: Languages['zh'],
      firstDayOfWeek: 7,
      userInput: '',
    };
  }

  static defaultProps = {
    type: 'date',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.langs !== this.state.langs) {
      this.setState({
        translationData: Languages(this.state.langs),
      });
    }
  }

  handleInputClick = () => {
    this.setState((prevState) => {
      return {
        isPanelOpen: !prevState.isPanelOpen,
      };
    });
  };

  handleInput = (e) => {
    console.log(date);
    this.setState({
      userInput: e.target.value,
    });
  };

  render() {
    const { isPanelOpen, translationData, firstDayOfWeek } = this.state;
    const { type } = this.props;
    return (
      <div>
        <input
          type='text'
          className='input'
          onClick={this.handleInputClick}
          onInput={this.handleInput}
        />
        <div className='panel' style={!isPanelOpen ? { display: 'none' } : {}}>
          <Panel
            translationData={translationData}
            firstDayOfWeek={firstDayOfWeek}
            show={isPanelOpen}
            type={type}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
