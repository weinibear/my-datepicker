import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../utils';
import Panel from '../Panel';

import './index.scss';

class DatePicker extends PureComponent {
  static propTypes = {
    type: PropTypes.string, // 面板类型(日期，年，月等)
    firstDayOfWeek: PropTypes.number, // 一周第一天显示星期几[1,7]
    format: PropTypes.string, // input日期展示格式
    minuteStep: PropTypes.number, // 时、分、秒显示跨度 [0,60]
    editable: PropTypes.bool,
  };

  static defaultProps = {
    type: 'date',
    firstDayOfWeek: 7,
    format: 'yyyy-MM-dd',
    minuteStep: 0,
    editable: true,
  };

  constructor(props) {
    super(props);
    const initVal = formatDate(new Date(), props.format);
    this.panelRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      isPanelOpen: false,
      panelVal: initVal, // 当前面板时间
      userInput: initVal,
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
    document.addEventListener(
      'click',
      (e) => {
        console.log(this.panelRef);
        console.log(this.inputRef);
        console.log(e.target);
        console.log(this.panelRef.current.contains(e.target));
        console.log(this.inputRef.current.contains(e.target));
        if (
          !this.panelRef.current.contains(e.target) &&
          !this.inputRef.current.contains(e.target)
        ) {
          console.log(
            '要关闭弹框了*******************************************'
          );
          this.setState({ isPanelOpen: false });
        }
      },
      true
    );
  };

  asyncPanel = () => {
    const { userInput, panelVal } = this.state;
    const { format } = this.props;
    // 如果输入日期合乎规范，改变面板日期，否则，还原输入日期
    if (this.isValidDate(userInput)) {
      const val = formatDate(new Date(userInput), format);
      this.setState({
        panelVal: val,
        userInput: val,
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
    const { format } = this.props;
    const val = formatDate(date, format);
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
    const { type, firstDayOfWeek, format, minuteStep, editable } = this.props;
    return (
      <div className='xw-datepicker'>
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
          className='xw-datepicker-popup'
          style={!isPanelOpen ? { display: 'none' } : {}}
        >
          <Panel
            type={type}
            firstDayOfWeek={firstDayOfWeek}
            format={format}
            minuteStep={minuteStep}
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
