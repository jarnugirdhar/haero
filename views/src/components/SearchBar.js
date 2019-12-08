import React, {Component} from 'react';
import {AutoComplete, DatePicker, Button, Radio, Icon, InputNumber, Select} from 'antd';

class SearchBar extends Component {
    state = {
        isReturn: false,
        value: 1,
        from: "",
        to: "",
        departure_date: "",
        return_date: "",
        booking_count: 0
    };
    handleOnChange = (date, dateString) => {
        console.log(date, dateString);
    };

    handleRadioChange = (e) => {
        let returnState = e.target.value !== 1;
        this.setState({
            isReturn: returnState,
            value: e.target.value
        });
    };

    handleFromChange = (e) => {
        console.log(e)
    };

    handleToChange = (e) => {
        console.log(e);
    };

    handleSearch = (e) => {
        e.preventDefault();
        console.log(this.state);
    };

    handleCountChange = (value) => {
        console.log(value);
    };

    render() {
        const from = ["Goa", "Hyderabad", "Bangalore"];
        const to = ["Goa", "Hyderabad", "Bangalore"];
        const {Option} = Select;
        return (
            <div style={{margin: "0 auto"}}>
                <Radio.Group onChange={this.handleRadioChange} value={this.state.value} >
                    <Radio value={1}>One Way</Radio>
                    <Radio value={2}>Return</Radio>
                </Radio.Group>
                <AutoComplete
                    style={{ width: 200 }}
                    dataSource={from}
                    placeholder="from"
                    filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onChange={this.handleFromChange}
                />
                <AutoComplete
                    style={{ width: 200 }}
                    dataSource={to}
                    placeholder="to"
                    filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onChange={this.handleToChange}
                />
                <DatePicker placeholder="Select departure date" onChange={this.handleOnChange} />
                <DatePicker placeholder="Select return date" disabled={!this.state.isReturn} onChange={this.handleOnChange} />
                <Select style={{width: "240px"}} placeholder="Select flight class">
                    <Option value="economy"> Economy </Option>
                    <Option value="business_class"> Business Class </Option>
                </Select>
                <InputNumber style={{width: "50px"}} min={1} max={10} defaultValue={1} />
                <Button onClick={this.handleSearch} placeholder={"Search"}>Search <Icon type={"search"} /></Button>
            </div>
        );
    }
}

export default SearchBar;