import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel';

import './index.scss';

class DatePicker extends PureComponent {
  static propTypes = {
    type: PropTypes.string, // 面板类型(日期，年，月等)
    firstDayOfWeek: PropTypes.number, // 一周第一天显示星期几[1,7]
    editable: PropTypes.bool,
  };

  static defaultProps = {
    type: 'date',
    firstDayOfWeek: 7,
    editable: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      isPanelOpen: false,
      panelVal: new Date().toLocaleDateString(), // 当前面板时间
      userInput: new Date().toLocaleDateString(),
    };
  }

  componentDidMount() {
    this.initClickoutSide();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isPanelOpen !== this.state.isPanelOpen &&
      this.state.userInput !== this.state.panelVal
    ) {
      this.asyncPanel();
    }
  }

  // 点击区域外关闭弹框
  initClickoutSide = () => {
    this.panelRef = React.createRef();
    this.inputRef = React.createRef();
    window.addEventListener('click', (e) => {
      if (
        !this.panelRef.current.contains(e.target) &&
        !this.inputRef.current.contains(e.target)
      ) {
        this.setState({ isPanelOpen: false });
      }
    });
  };

  asyncPanel = () => {
    const { userInput, panelVal } = this.state;
    // 如果输入日期合乎规范，改变面板日期，否则，还原输入日期
    if (this.isValidDate(userInput)) {
      this.setState({
        panelVal: new Date(userInput).toLocaleDateString(),
        userInput: new Date(userInput).toLocaleDateString(),
      });
    } else {
      this.setState({
        userInput: panelVal,
      });
    }
  };

  // 点击输入框
  handleInputClick = () => {
    this.setState((prevState) => ({
      isPanelOpen: !prevState.isPanelOpen,
    }));
  };

  // 用户输入
  handleInputChange = (e) => {
    const { value } = e.target;
    console.log(value);
    this.setState({
      userInput: value,
    });
  };

  // 改变面板日期，改变input
  handleChangePanelValue = (date) => {
    console.log(date);
    const val = date.toLocaleDateString();
    this.setState({
      panelVal: val,
      userInput: val,
    });
  };

  isValidDate = (date) => {
    return !!new Date(date).getTime();
  };

  render() {
    const { isPanelOpen, panelVal, userInput } = this.state;
    const { type, firstDayOfWeek, editable } = this.props;
    return (
      <div>
        <input
          type='text'
          className='input'
          ref={this.inputRef}
          value={userInput}
          onClick={this.handleInputClick}
          readOnly={!editable}
          onChange={this.handleInputChange}
        />
        <div
          ref={this.panelRef}
          className='panel'
          style={!isPanelOpen ? { display: 'none' } : {}}
        >
          <Panel
            type={type}
            firstDayOfWeek={firstDayOfWeek}
            panelVal={panelVal}
            handleChangePanelValue={this.handleChangePanelValue}
            isPanelOpen={isPanelOpen}
            handleClosePanel={() => this.setState({ isPanelOpen: false })}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
