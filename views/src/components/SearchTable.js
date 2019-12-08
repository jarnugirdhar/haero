import React, {Component} from 'react';
import {Table, Button} from 'antd';

class SearchTable extends Component {
    render() {
        const columns = [
            {
                title: "Airline",
                dataIndex: "airline",
                name: "airline"
            },
            {
                title: "Source",
                dataIndex: "from",
                name: "from"
            },
            {
                title: "Destination",
                dataIndex: "to",
                name: "to"
            },
            {
                title: "Departure Time",
                dataIndex: "departure_time",
                name: "departure_time"
            },
            {
                title: "Arrival Time",
                dataIndex: "arrival_time",
                name: "arrival_time"
            },
            {
                title: "Connected Via",
                dataIndex: "connected_via",
                name: "connected_via"
            },
            {
                title: "Travel Time",
                dataIndex: "travel_time",
                name: "travel_time"
            },
            {
                title: "Price",
                dataIndex: "price",
                name: "price"
            },
            {
                title: "Action",
                name: "action",
                render: () =>
                    <div>
                        <Button>More Details</Button>
                        <Button>Book</Button>
                    </div>
            }
        ];
        const data = [];
        return (
            <Table columns={columns} dataSource={data} />
        );
    }
}

export default SearchTable;