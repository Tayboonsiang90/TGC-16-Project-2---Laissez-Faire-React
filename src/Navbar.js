import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Navbar extends React.Component {
    state = {
        userSessionDetails: {},
    };

    isLoggedIn() {
        if (!this.props.userSessionDetails._id) {
            return (
                <>
                    <li className="nav-item">
                        <div
                            className="btn btn-outline-dark w-100 mb-1 border-0"
                            onClick={() => {
                                this.props.updateParentDisplay("Signup");
                            }}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            &nbsp; Register
                        </div>
                    </li>
                    <li className="nav-item">
                        <div
                            className="btn btn-outline-dark w-100 mb-1 border-0"
                            onClick={() => {
                                this.props.updateParentDisplay("Login");
                            }}
                        >
                            <i className="fa-solid fa-right-to-bracket"></i>&nbsp; Login
                        </div>
                    </li>
                </>
            );
        } else {
            return (
                <>
                    <li className="nav-item">
                        <span className="btn btn-outline-dark w-100 mb-1 border-0 disabled">
                            <i className="fa-solid fa-envelope"></i>
                            &nbsp;{this.props.userSessionDetails.email}
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="btn btn-outline-dark w-100 mb-1 border-0 disabled">
                            <i className="fa-solid fa-dollar-sign"></i>
                            &nbsp;Available Balance: ${this.props.userSessionDetails.USD}
                        </span>
                    </li>
                    <li className="nav-item">
                        <div
                            className="btn btn-outline-dark w-100 mb-1 border-0"
                            onClick={() => {
                                this.props.updateParentDisplay("Dashboard");
                            }}
                        >
                            <i className="fa-solid fa-circle-info"></i>&nbsp;Account Details
                        </div>
                    </li>
                    <li className="nav-item">
                        <div
                            className="btn btn-outline-dark w-100 mb-1 border-0"
                            onClick={() => {
                                this.props.updateParentDisplay("Portfolio");
                            }}
                        >
                            <i className="fa-solid fa-list"></i>&nbsp;Portfolio
                        </div>
                    </li>
                    <li className="nav-item">
                        <div className="btn btn-outline-dark w-100 mb-1 border-0" onClick={this.logoutButton}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout
                        </div>
                    </li>
                </>
            );
        }
    }

    logoutButton = () => {
        document.cookie = {};
        this.props.updateParentState("userSessionDetails", {
            USD: 0,
            _id: "",
            country: "",
            dateOfBirth: 0,
            email: "",
            name: "",
            password: "",
            timestamp: 0,
        });
    };

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <i className="fa-solid fa-people-group navbar__icon"></i>
                    <div className="navbar-brand">&nbsp; Laissez Faire</div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <div
                                    className="btn btn-outline-dark w-100 mb-1 border-0"
                                    onClick={() => {
                                        this.props.updateParentDisplay("Markets");
                                    }}
                                >
                                    <i className="fa-solid fa-money-bill-trend-up"></i>
                                    &nbsp;Markets
                                </div>
                            </li>
                            <li className="nav-item">
                                <div
                                    className="btn btn-outline-dark w-100 mb-1 border-0"
                                    onClick={() => {
                                        this.props.updateParentDisplay("Leaderboard");
                                    }}
                                >
                                    <i className="fa-solid fa-ranking-star"></i>
                                    &nbsp;Leaderboard
                                </div>
                            </li>
                            {this.isLoggedIn()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
