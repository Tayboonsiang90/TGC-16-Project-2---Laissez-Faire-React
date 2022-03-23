import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Dashboard extends React.Component {
    state = {};

    render() {
        return (
            <>
                <div className="d-flex">
                    <div className="card w-50">
                        <div className="card-body text-center">
                            <h1 className="card-title">Account Id</h1>
                            <h3 className="card-subtitle mb-2">{this.props.userSessionDetails._id}</h3>
                        </div>
                    </div>
                    <div className="card w-50">
                        <div className="card-body text-center">
                            <h1 className="card-title">Account Balance</h1>
                            <h1 className="card-subtitle mb-2">$&nbsp;{this.props.userSessionDetails.USD}</h1>
                        </div>
                    </div>
                </div>
                <button type="button" className="shadow-none btn btn-success w-50" name="buySellButton" value="SELL" onClick={this.onEventString}>
                    DEPOSIT
                </button>
                <button type="button" className="shadow-none btn btn-danger w-50" name="buySellButton" value="SELL" onClick={this.onEventString}>
                    WITHDRAW
                </button>
                <div className="card w-100">
                    <div className="card-body">
                        <h1 className="card-title">$ Balance</h1>
                        <h2 className="card-subtitle mb-2">Card subtitle</h2>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </>
        );
    }
}
