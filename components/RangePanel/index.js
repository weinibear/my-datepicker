import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Panel from '../Panel';

import './index.scss';

class RangePanel extends PureComponent {
  static propTypes = {
    langData: PropTypes.object,
    shortcuts: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    isPanelOpen: PropTypes.bool,
    rangePanelDate:PropTypes.array,
    changeRangePanelDate:PropTypes.func,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      dateRangsTitle: [],
    };
  }

  componentDidMount() {
    this.initDateRangsTitle();
  }

  initDateRangsTitle = () => {
    const { shortcuts, langData } = this.props;
    let dateRangsTitle = [];
    if (Array.isArray(shortcuts)) {
      dateRangsTitle = shortcuts;
    } else if (shortcuts) {
      dateRangsTitle = [
        {
          text: '未来7天',
          start: new Date(),
          end: new Date(Date.now() + 3600 * 1000 * 24 * 7),
        },
        {
          text: '未来30天',
          start: new Date(),
          end: new Date(Date.now() + 3600 * 1000 * 24 * 30),
        },
        {
          text: '最近7天',
          start: new Date(Date.now() - 3600 * 1000 * 24 * 7),
          end: new Date(),
        },
        {
          text: '最近30天',
          start: new Date(Date.now() - 3600 * 1000 * 24 * 30),
          end: new Date(),
        },
      ];
      dateRangsTitle.forEach((v, i) => {
        v.text = langData.pickers[i];
      });
    }
    this.setState({
      dateRangsTitle,
    });
  };

  selectRange = (range) => {
    console.log(range);
  };

  getPanelStyle = () => {
    const { isPanelOpen } = this.props;
    let panel1Style = { width: '50%', boxShadow: '1px 0 rgba(0, 0, 0, .1)' };
    let panel2Style = { width: '50%' };
    const displayNone = { display: 'none' };
    panel1Style = isPanelOpen
      ? panel1Style
      : { ...panel1Style, ...displayNone };
    panel2Style = isPanelOpen
      ? panel2Style
      : { ...panel2Style, ...displayNone };
    return {
      panel1Style,
      panel2Style,
    };
  };

  render() {
    const { dateRangsTitle } = this.state;
    const {rangePanelDate, changeRangePanelDate} = this.props
    const { panel1Style, panel2Style } = this.getPanelStyle();
    return (
      <div style={{ overflow: 'hidden' }}>
        {dateRangsTitle.length && (
          <div className='xw-datepicker-top'>
            {dateRangsTitle.map((range, i) => (
              <span key={i} onClick={() => this.selectRange(range)}>
                {range.text}
              </span>
            ))}
          </div>
        )}

        <Panel
          panelDate={rangePanelDate[0]}
          endAt={rangePanelDate[1]}
          style={panel1Style}
          handleChangePanelDate={(date) => changeRangePanelDate(0, date)}
          {...this.props}
        />
        <Panel
          panelDate={rangePanelDate[1]}
          startAt={rangePanelDate[0]}
          style={panel2Style}
          handleChangePanelDate={(date) => changeRangePanelDate(1, date)}
          {...this.props}
        />
      </div>
    );
  }
}

export default RangePanel;
