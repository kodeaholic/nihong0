import React, { PureComponent } from 'react';
import Icon from '../Icon';
import Mask from '../Mask';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;

/**
 * 全屏搜索
 */
class SearchBox extends PureComponent {
  render() {
    const { visible, onClose } = this.props;
    return (
      <Mask visible={visible} onClose={onClose} className="search-box" closable>
        <div className="search-box-input">
          <input ref="input" type="text" placeholder="Search..." />
          <a className="search-box-btn"><Icon type="SearchOutlined" antd /></a>
        </div>
        <div className="search-box-content">
          <RadioGroup name="radiogroup" defaultValue={1}>
            <Radio value={1}>N1</Radio>
            <Radio value={2}>N2</Radio>
            <Radio value={3}>N3</Radio>
            <Radio value={4}>N4</Radio>
          </RadioGroup>
        </div>
      </Mask>
    );
  }
}

export default SearchBox;