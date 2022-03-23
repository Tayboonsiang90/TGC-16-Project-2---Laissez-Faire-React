import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import Markets from "./Markets";
import MarketDetails from "./MarketDetails";
import Leaderboard from "./Leaderboard";
import Dashboard from "./Dashboard";
import NewMarket from "./NewMarket";
import Portfolio from "./Portfolio";

class App extends React.Component {
    state = {
        display: "Markets",
        userSessionDetails: {
            USD: 0,
            _id: "",
            country: "",
            dateOfBirth: 0,
            email: "",
            name: "",
            password: "",
            timestamp: 0,
        },
    };

    updateParentState = (key, value) => {
        this.setState({
            [key]: value,
        });
    };

    updateParentDisplay = (value) => {
        this.setState({
            display: value,
        });
    };

    async componentDidMount() {
        try {
            let cookiesDetails = JSON.parse(document.cookie);
            this.setState({
                userSessionDetails: cookiesDetails,
            });
        } catch (e) {
            this.setState({
                userSessionDetails: {
                    USD: 0,
                    _id: "",
                    country: "",
                    dateOfBirth: 0,
                    email: "",
                    name: "",
                    password: "",
                    timestamp: 0,
                },
            });
        }
    }

    //Signup, Markets
    setDisplay() {
        if (this.state.display === "Markets") {
            return (
                <React.Fragment>
                    <Markets updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Signup") {
            return (
                <React.Fragment>
                    <Signup updateParentDisplay={this.updateParentDisplay} updateParentState={this.updateParentState} />
                </React.Fragment>
            );
        } else if (this.state.display === "MarketDetails") {
            return (
                <React.Fragment>
                    <MarketDetails updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Login") {
            return (
                <React.Fragment>
                    <Login updateParentState={this.updateParentState} updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Leaderboard") {
            return (
                <React.Fragment>
                    <Leaderboard updateParentState={this.updateParentState} updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Dashboard") {
            return (
                <React.Fragment>
                    <Dashboard userSessionDetails={this.state.userSessionDetails} updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "NewMarket") {
            return (
                <React.Fragment>
                    <NewMarket updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Portfolio") {
            return (
                <React.Fragment>
                    <Portfolio updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } 
    }

    render() {
        return (
            <>
                <Navbar userSessionDetails={this.state.userSessionDetails} updateParentDisplay={this.updateParentDisplay} updateParentState={this.updateParentState} />
                <div className="container">{this.setDisplay()}</div>
            </>
        );
    }
}

export default App;
