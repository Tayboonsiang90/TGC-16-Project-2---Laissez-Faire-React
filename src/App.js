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
import axios from "axios";

// const API_URL = "https://project-2-express.herokuapp.com";
const API_URL = "https://project-2-express.herokuapp.com";

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
        market_id: "",
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

    updateSessionState = async () => {
        if (this.state.userSessionDetails._id) {
            let userDetails = await axios.get(API_URL + "/login/" + this.state.userSessionDetails._id);
            this.setState({
                userSessionDetails: userDetails.data.message,
            });
            document.cookie = JSON.stringify(userDetails.data.message);
        }
    };

    async componentDidMount() {
        try {
            let cookiesDetails = JSON.parse(document.cookie);
            if (cookiesDetails._id) {
                let userDetails = await axios.get(API_URL + "/login/" + cookiesDetails._id);
                this.setState({
                    userSessionDetails: userDetails.data.message,
                });
                document.cookie = JSON.stringify(userDetails.data.message);
            }

            // this.setState({
            //     userSessionDetails: cookiesDetails,
            // });
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
                    <Markets updateParentDisplay={this.updateParentDisplay} updateParentState={this.updateParentState} />
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
                    <MarketDetails updateSessionState={this.updateSessionState} userSessionDetails={this.state.userSessionDetails} updateParentDisplay={this.updateParentDisplay} market_id={this.state.market_id} />
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
                    <Leaderboard userSessionDetails={this.state.userSessionDetails} updateParentState={this.updateParentState} updateParentDisplay={this.updateParentDisplay} />
                </React.Fragment>
            );
        } else if (this.state.display === "Dashboard") {
            return (
                <React.Fragment>
                    <Dashboard updateSessionState={this.updateSessionState} userSessionDetails={this.state.userSessionDetails} updateParentDisplay={this.updateParentDisplay} />
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
