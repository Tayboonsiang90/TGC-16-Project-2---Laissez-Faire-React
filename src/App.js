import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import Navbar from "./Navbar";
import Signup from "./Signup";
import Markets from "./Markets";

class App extends React.Component {
    state = {
        display: "Markets",
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
        }
    }

    render() {
        return (
            <>
                <Navbar />
                {this.setDisplay()}
            </>
        );
    }
}

export default App;
