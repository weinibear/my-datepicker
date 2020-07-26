import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';

import { formatDate } from '../utils';
import Panel from '../../components/Panel';
import RangePanel from '../../components/RangePanel';

import Languages from '../languages';
import './index.scss';

class DatePicker extends PureComponent {
  static propTypes = {
    lang: PropTypes.string, // 语言
    type: PropTypes.string, // 面板类型(日期，年，月等)
    range: PropTypes.bool, // 选择日期范围模式
    shortcuts: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    firstDayOfWeek: PropTypes.number, // 一周第一天显示星期几[1,7]
    format: PropTypes.string, // input日期展示格式
    minuteStep: PropTypes.number, // 时、分、秒显示跨度 [0,60]
    editable: PropTypes.bool,
  };

  static defaultProps = {
    lang: 'zh',
    type: 'date',
    range: false,
    shortcuts: true,
    firstDayOfWeek: 7,
    format: 'yyyy-MM-dd',
    minuteStep: 0,
    editable: true,
  };

  constructor(props) {
    super(props);
    this.panelRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      isPanelOpen: false,
      inputVal: formatDate(new Date(), props.format),
      panelDate: new Date(), // 面板日期
      rangePanelDate: [new Date(), new Date()]
    };
  }

  componentDidMount() {
    this.initClickoutSide();
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputVal, panelDate } = this.state;
    if (
      prevState.isPanelOpen !== this.state.isPanelOpen &&
      inputVal !== formatDate(panelDate, this.props.format)
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
    const { inputVal, panelDate } = this.state;
    const { format } = this.props;
    // 如果输入日期合乎规范，改变面板日期，否则，还原输入日期
    if (this.isValidDate(inputVal)) {
      this.setState({
        panelDate: new Date(inputVal),
        inputVal: formatDate(new Date(inputVal), format),
      });
    } else {
      this.setState({
        inputVal: formatDate(panelDate, format),
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
    this.setState({
      inputVal: value,
    });
  };

  // 改变面板日期，改变input
  handleChangeDate = (date) => {
    this.handleChangePanelDate(date);
    this.setState({
      inputVal: formatDate(date, this.props.format),
    });
  };

  // 改变面板日期
  handleChangePanelDate = (date) => {
    this.setState({
      panelDate: date,
    });
  };

  // 改变rangePanel
  changeRangePanelDate = (i, date) => {
    const { rangePanelDate } = this.state;
    const copyDate = cloneDeep(rangePanelDate);
    copyDate[i] = date;
    this.setState({
      rangePanelDate: copyDate,
    });
  };

  isValidDate = (date) => {
    return !!new Date(date).getTime();
  };

  render() {
    const { isPanelOpen, panelDate,rangePanelDate, inputVal } = this.state;
    const { lang, range, editable } = this.props;
    const popCls = range
      ? classNames('xw-datepicker-popup', 'range')
      : 'xw-datepicker-popup';
    return (
      <div className='xw-datepicker'>
        <input
          type='text'
          className='input'
          ref={this.inputRef}
          value={inputVal}
          onClick={this.handleInputClick}
          readOnly={!editable}
          onChange={this.handleInputChange}
        />
        <div
          ref={this.panelRef}
          className={popCls}
          style={!isPanelOpen ? { display: 'none' } : {}}
        >
          {range ? (
            <RangePanel
              langData={Languages[lang]}
              isPanelOpen={isPanelOpen}
              rangePanelDate={rangePanelDate}
              changeRangePanelDate={this.changeRangePanelDate}
              {...this.props}
            />
          ) : ( 
            <Panel
              langData={Languages[lang]}
              panelDate={panelDate}
              inputVal={inputVal}
              handleChangePanelDate={this.handleChangePanelDate}
              handleChangeDate={this.handleChangeDate}
              isPanelOpen={isPanelOpen}
              handleClosePanel={() => this.setState({ isPanelOpen: false })}
              {...this.props}
            />
          )}
        </div>
      </div>
    );
  }
}

export default DatePicker;
