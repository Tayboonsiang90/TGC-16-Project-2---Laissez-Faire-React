import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Dashboard extends React.Component {
    state = {
        depositAmount: 0,
        withdrawAmount: 0,
        depositSuccessFlag: false,
        withdrawSuccessFlag: false,
        withdrawalMessage: "",
        transactions: [],
    };

    updateState = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    };

    depositButton = async () => {
        await axios.post(API_URL + "/deposit", {
            _id: this.props.userSessionDetails._id,
            quantity: this.state.depositAmount,
        });

        this.setState({
            depositSuccessFlag: true,
        });

        this.props.updateSessionState();

        //Update the table state data
        let response = await axios.get(API_URL + "/transactions/" + this.props.userSessionDetails._id);

        this.setState({
            transactions: response.data.transactions,
        });
    };

    withdrawButton = async () => {
        this.setState({
            withdrawSuccessFlag: true,
            withdrawalMessage: "",
        });
        await axios
            .post(API_URL + "/withdraw", {
                _id: this.props.userSessionDetails._id,
                quantity: this.state.withdrawAmount,
            })
            .catch((error) => {
                this.setState({
                    withdrawalMessage: error.response.data.message,
                    withdrawSuccessFlag: false,
                });
            });

        this.props.updateSessionState();

        //Update the table state data
        let response = await axios.get(API_URL + "/transactions/" + this.props.userSessionDetails._id);

        this.setState({
            transactions: response.data.transactions,
        });
    };

    renderTableEntries() {
        let renderArray = [];

        for (let item of this.state.transactions) {
            let dateString = new Date(item.timestamp);
            renderArray.push(
                <tr className={item.type === "DEPOSIT" ? "table-success" : "table-danger"} key={item.timestamp}>
                    <th>{item.type}</th>
                    <td>$ {item.quantity}</td>
                    <td>{dateString.toLocaleString()}</td>
                </tr>
            );
        }

        return renderArray;
    }

    async componentDidMount() {
        let response = await axios.get(API_URL + "/transactions/" + this.props.userSessionDetails._id);

        this.setState({
            transactions: response.data.transactions,
        });
    }

    render() {
        return (
            <>
                <h1 className="text-center mt-5 display-1 fancy">Account Dashboard</h1>
                {/* Account details cards  */}
                <div className="d-flex mt-5">
                    <div className="card w-50">
                        <div className="card-body text-center">
                            <h1 className="card-title fancy">Account Id</h1>
                            <h3 className="card-subtitle mb-2">{this.props.userSessionDetails._id}</h3>
                        </div>
                    </div>
                    <div className="card w-50">
                        <div className="card-body text-center">
                            <h1 className="card-title fancy">Account Balance</h1>
                            <h3 className="card-subtitle mb-2">$&nbsp;{this.props.userSessionDetails.USD}</h3>
                        </div>
                    </div>
                </div>
                {/* Deposit Button  */}
                <button type="button" className="shadow-none btn btn-success w-50" data-bs-toggle="modal" data-bs-target="#depositModal">
                    DEPOSIT
                </button>
                {/* <!-- Deposit Modal --> */}
                <div className="modal fade" id="depositModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">DEPOSIT</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({
                                            depositSuccessFlag: false,
                                        });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.depositSuccessFlag ? "block" : "none" }}>
                                    <strong>Your deposit has been successfully processed.</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="depositAmount" className="form-label">
                                            Amount
                                        </label>
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-dollar-sign me-3"></i>
                                            <input type="number" className="form-control" id="depositAmount" name="depositAmount" value={this.state.depositAmount} onChange={this.updateState}></input>
                                        </div>
                                        <div id="emailHelp" className="form-text">
                                            Deposits will happen instantly thanks to our latest quantum transaction technology.
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.depositButton} className="btn btn-success">
                                    Submit Deposit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({
                                            depositSuccessFlag: false,
                                        });
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Withdraw Button  */}
                <button type="button" className="shadow-none btn btn-danger w-50" data-bs-toggle="modal" data-bs-target="#withdrawModal">
                    WITHDRAW
                </button>
                {/* <!-- Withdraw Modal --> */}
                <div className="modal fade" id="withdrawModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">WITHDRAWAL</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({
                                            withdrawSuccessFlag: false,
                                        });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.withdrawSuccessFlag ? "block" : "none" }}>
                                    <strong>Your withdrawal has been successfully processed.</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.withdrawalMessage ? "block" : "none" }}>
                                    <strong>{this.state.withdrawalMessage}</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="withdrawAmount" className="form-label">
                                            Amount
                                        </label>
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-dollar-sign me-3"></i>
                                            <input type="number" className="form-control" id="withdrawAmount" name="withdrawAmount" value={this.state.withdrawAmount} onChange={this.updateState}></input>
                                        </div>
                                        <div id="emailHelp" className="form-text">
                                            Withdrawals will happen instantly thanks to our latest quantum transaction technology.
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.withdrawButton} className="btn btn-success">
                                    Submit Withdrawal
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({
                                            withdrawSuccessFlag: false,
                                        });
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Information Carousel  */}
                <div className="card w-100 mt-5">
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-center">
                                        <h1>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </h1>
                                        <h1 className="card-subtitle mb-2 fancy">&nbsp;Interesting Fact 1</h1>
                                    </div>
                                    <h2 className="card-text">You created your account {new Date(new Date().getTime() - this.props.userSessionDetails.timestamp).getDay()} days ago.</h2>
                                </div>
                            </div>
                            <div className="carousel-item">
                                {" "}
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-center">
                                        <h1>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </h1>
                                        <h1 className="card-subtitle mb-2 fancy">&nbsp;Interesting Fact 2</h1>
                                    </div>
                                    <h2 className="card-text">Your total lifetime deposits is $ {this.props.userSessionDetails.totalDeposited}. </h2>
                                </div>
                            </div>
                            <div className="carousel-item">
                                {" "}
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-center">
                                        <h1>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </h1>
                                        <h1 className="card-subtitle mb-2 fancy">&nbsp;Interesting Fact 3</h1>
                                    </div>
                                    <h2 className="card-text">You total lifetime withdrawals is $ {this.props.userSessionDetails.totalWithdrew}. </h2>
                                </div>
                            </div>
                            <div className="carousel-item">
                                {" "}
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-center">
                                        <h1>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </h1>
                                        <h1 className="card-subtitle mb-2 fancy">&nbsp;Interesting Fact 4</h1>
                                    </div>
                                    <h2 className="card-text">Your lifetime ROI is {(((this.props.userSessionDetails.totalWithdrew + this.props.userSessionDetails.USD) * 100) / this.props.userSessionDetails.totalDeposited - 100).toFixed(2)}%. </h2>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                {/* User Details  */}
                <div className="mb-3 row mt-5">
                    <label htmlFor="staticEmail" className="ps-3 col-sm-2 col-form-label">
                        Email
                    </label>
                    <div className="col-sm-10">
                        <input type="text" readOnly className="ps-3 form-control-plaintext" id="staticEmail" value={this.props.userSessionDetails.email}></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="ps-3 col-sm-2 col-form-label">
                        Password
                    </label>
                    <div className="col-sm-10">
                        <input type="password" readOnly className="ps-3 form-control-plaintext" id="inputPassword" value={this.props.userSessionDetails.password}></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputName" className="ps-3 col-sm-2 col-form-label">
                        Name
                    </label>
                    <div className="col-sm-10">
                        <input type="text" readOnly className="ps-3 form-control-plaintext" id="inputName" value={this.props.userSessionDetails.name}></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputCountry" className="ps-3 col-sm-2 col-form-label">
                        Country
                    </label>
                    <div className="col-sm-10">
                        <input type="text" readOnly className="ps-3 form-control-plaintext" id="inputCountry" value={this.props.userSessionDetails.country}></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputDoB" className="ps-3 col-sm-2 col-form-label">
                        Date of Birth
                    </label>
                    <div className="col-sm-10">
                        <input type="text" readOnly className="ps-3 form-control-plaintext" id="inputDoB" value={new Date(this.props.userSessionDetails.dateOfBirth).toLocaleDateString()}></input>
                    </div>
                </div>
                {/* Transaction List  */}
                <table className="table table-striped w-100 mt-5">
                    <thead>
                        <tr>
                            <th scope="col">Transaction Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Transaction Time</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderTableEntries()}</tbody>
                </table>
            </>
        );
    }
}
