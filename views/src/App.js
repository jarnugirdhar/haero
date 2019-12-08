import React, {Component} from 'react';
import './App.css';
import SearchBar from "./components/SearchBar";
import SearchTable from "./components/SearchTable";

class App extends Component {
    render() {
        return (
            <div>
                <SearchBar />
                <br />
                <SearchTable />
            </div>
        );
    }
}

export default App;
