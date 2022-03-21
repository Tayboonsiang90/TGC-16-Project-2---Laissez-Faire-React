import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import Navbar from "./Navbar";
import Signup from "./Signup";
import Markets from "./Markets";
import MarketDetails from "./MarketDetails";

class App extends React.Component {
    state = {
        display: "MarketDetails",
    };

    //Signup, Markets
    setDisplay() {
        if (this.state.display === "Markets") {
            return (
                <React.Fragment>
                    <Markets />
                </React.Fragment>
            );
        } else if (this.state.display === "Signup") {
            return (
                <React.Fragment>
                    <Signup />
                </React.Fragment>
            );
        } else if (this.state.display === "MarketDetails") {
            return (
                <React.Fragment>
                    <MarketDetails />
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <>
                <Navbar />
                <div className="container">{this.setDisplay()}</div>
            </>
        );
    }
}

export default App;
