import React, {Component} from 'react';
import SearchBar from "../components/SearchBar";
import SearchTable from "../components/SearchTable";

class Dashboard extends Component {
    render() {
        return (
            <div>
                <SearchBar onSearchClick={this.submitSearch} />
                <SearchTable data={this.props.data} />
            </div>
        );
    }
}

export default Dashboard;