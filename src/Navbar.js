import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Navbar extends React.Component {
    state = {};

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <i className="fa-solid fa-people-group"></i>
                    <a className="navbar-brand" href="#">
                        &nbsp; Laissez Faire
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Markets
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Portfolio
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Register
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
