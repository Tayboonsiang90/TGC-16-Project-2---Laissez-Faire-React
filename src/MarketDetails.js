import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Markets extends React.Component {
    state = {
        position: "",
        country: "",
        description: "",
        politicians: [],
        timestampCreated: 0,
        timestampExpiry: 0,
        globalVolume: 0,
        globalLiquidity: 0,
        displayMarket: 0,
        buySellButton: "BUY",
        yesNoButton: "YES",
        amount: 0,
        yesBalance: 0,
        noBalance: 0,
        liquidityBalance: 0,
        warningBuySellMessage: "",
        successBuySellMessage: false,
        warningMintRedeemMessage: "",
        successMintRedeemMessage: false,
        tradeLiquidityButton: "TRADE",
        addRemoveButton: "ADD",
        addRemoveAmount: 0,
        mintRedeemButton: "MINT",
        mintRedeemAmount: 0,
    };

    onEventString = (evt) => {
        this.setState({
            [evt.currentTarget.name]: evt.currentTarget.value,
        });
    };

    onEventNumber = (evt) => {
        this.setState({
            [evt.currentTarget.name]: Number(evt.currentTarget.value),
        });
    };

    updateYesNoBalances = async (evt) => {
        let market_id = this.state.politicians[evt.currentTarget.value].market_id;
        let response = await axios.get(API_URL + "/balances/" + market_id + "/" + this.props.userSessionDetails._id);

        this.setState({
            yesBalance: response.data.balances.yes,
            noBalance: response.data.balances.no,
        });
    };

    submitTransaction = async () => {
        await axios
            .put(API_URL + "/trade/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                buyOrSell: this.state.buySellButton,
                yesOrNo: this.state.yesNoButton,
                amount: this.state.amount,
            })
            .catch((error) => {
                this.setState({
                    warningBuySellMessage: error.response.data.message,
                });
            });
        this.setState({
            successBuySellMessage: true,
        });
    };

    submitMintRedeemTransaction = async () => {
        await axios
            .put(API_URL + "/mint_redeem/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                mintOrRedeem: this.state.mintRedeemButton,
                amount: this.state.mintRedeemAmount,
            })
            .catch((error) => {
                this.setState({
                    warningMintRedeemMessage: error.response.data.message,
                });
            });
        this.setState({
            successMintRedeemMessage: true,
        });
    };

    submitLiquidityTransaction = async () => {
        await axios
            .put(API_URL + "/mint_redeem/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                mintOrRedeem: this.state.mintRedeemButton,
                amount: this.state.mintRedeemAmount,
            })
            .catch((error) => {
                this.setState({
                    warningMintRedeemMessage: error.response.data.message,
                });
            });
        this.setState({
            successMintRedeemMessage: true,
        });
    };

    renderPoliticianMarkets() {
        let renderArray = [];
        let count = 0;
        for (let politicianEntry of this.state.politicians) {
            let yesTokens = politicianEntry.yes;
            let noTokens = politicianEntry.no;
            let yesPrice = noTokens / (yesTokens + noTokens);
            let noPrice = yesTokens / (yesTokens + noTokens);

            renderArray.push(
                <React.Fragment key={politicianEntry.politician}>
                    <button
                        type="button"
                        className={"shadow-none w-100 d-block btn btn-outline-dark" + (this.state.displayMarket === count ? " active" : "")}
                        data-bs-toggle="button"
                        value={count}
                        name="displayMarket"
                        onClick={(e) => {
                            this.onEventNumber(e);
                            this.updateYesNoBalances(e);
                        }}
                    >
                        <div className="d-flex align-items-center justify-content-between ">
                            <div className="text-start">
                                <div>{politicianEntry.politician}</div>
                                <div>
                                    <span className="text-muted">Volume</span>
                                    <span className="card-text text-muted">&nbsp;${politicianEntry.volume.toFixed(2)}&nbsp;</span>

                                    <span className="text-muted ms-3">Liquidity</span>
                                    <span className="card-text text-muted">&nbsp;${(yesTokens * yesPrice * 2).toFixed(2)}&nbsp;</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-success me-2">Yes: {(yesPrice * 100).toFixed(0)}¢</span>
                                <span className="text-danger">No: {(noPrice * 100).toFixed(0)}¢</span>
                            </div>
                        </div>
                    </button>
                </React.Fragment>
            );
            count++;
        }
        return renderArray;
    }

    renderSidebar() {
        return (
            <React.Fragment>
                <div className="border border-5 p-3 border-warning">
                    <div className="mt-2 border-bottom border-warning border-5 pb-4 d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-dark w-100" + (this.state.tradeLiquidityButton === "TRADE" ? " active" : "")} data-bs-toggle="button" name="tradeLiquidityButton" value="TRADE" onClick={this.onEventString}>
                            TRADE
                        </button>
                        <button type="button" className={"shadow-none btn btn-outline-dark w-100" + (this.state.tradeLiquidityButton === "LIQUIDITY" ? " active" : "")} data-bs-toggle="button" name="tradeLiquidityButton" value="LIQUIDITY" onClick={this.onEventString}>
                            LIQUIDITY
                        </button>
                    </div>
                    {this.state.tradeLiquidityButton === "TRADE" ? this.renderTradeSidebar() : this.renderLiquiditySidebar()}
                </div>
            </React.Fragment>
        );
    }

    renderLiquiditySidebar() {
        return (
            <>
                {/* Mint Redeem  */}
                <>
                    <div className="mt-4 d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-success w-100" + (this.state.mintRedeemButton === "MINT" ? " active" : "")} data-bs-toggle="button" name="mintRedeemButton" value="MINT" onClick={this.onEventString}>
                            MINT
                        </button>
                        <button type="button" className={"shadow-none btn btn-outline-danger w-100" + (this.state.mintRedeemButton === "REDEEM" ? " active" : "")} data-bs-toggle="button" name="mintRedeemButton" value="REDEEM" onClick={this.onEventString}>
                            REDEEM
                        </button>
                    </div>
                    <div className="mt-4 text-end text-muted">${this.props.userSessionDetails.USD.toFixed(2)} : Available Balance</div>
                    <div className="text-end text-muted">{this.state.yesBalance.toFixed(2)} : YES Balance</div>
                    <div className="text-end text-muted">{this.state.noBalance.toFixed(2)} : NO Balance</div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        {this.state.mintRedeemButton === "MINT" ? <i className="fa-solid fa-dollar-sign me-3"></i> : <i className="fa-solid fa-coins me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" placeholder="Amount" value={this.state.mintRedeemAmount} name="mintRedeemAmount" onChange={this.onEventNumber}></input>
                        <button type="button" className="shadow-none btn btn-dark" name="mintRedeemAmount" value={this.state.mintRedeemButton === "MINT" ? this.props.userSessionDetails.USD : Math.min(this.state.yesBalance, this.state.noBalance)} onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    <input
                        type="range"
                        className="mt-2 form-range"
                        step="0.05"
                        min="0"
                        max={this.state.mintRedeemButton === "MINT" ? this.props.userSessionDetails.USD : Math.min(this.state.yesBalance, this.state.noBalance)}
                        value={this.state.mintRedeemAmount}
                        name="mintRedeemAmount"
                        onChange={this.onEventNumber}
                    ></input>
                    {this.mintRedeemDetails()}
                    <button
                        type="button"
                        className="shadow-none btn btn-secondary w-100 mt-3"
                        name="submitButton"
                        onClick={this.submitButton}
                        disabled={this.state.mintRedeemAmount <= 0 || this.state.mintRedeemAmount > (this.state.mintRedeemButton === "MINT" ? this.props.userSessionDetails.USD : Math.min(this.state.yesBalance, this.state.noBalance))}
                        data-bs-toggle="modal"
                        data-bs-target="#mintRedeemModal"
                    >
                        SUBMIT
                    </button>
                </>
                {/* Confirmation modal  */}
                <div className="modal fade" id="mintRedeemModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Please check your minting/redemption details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({ successMintRedeemMessage: false });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successMintRedeemMessage ? "block" : "none" }}>
                                    <strong>Your minting/redemption has been successfully processed.</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMintRedeemMessage ? "block" : "none" }}>
                                    <strong>{this.state.warningMintRedeemMessage}</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                {this.mintRedeemDetails()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.submitMintRedeemTransaction} className="btn btn-success">
                                    Submit Transaction
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({ successMintRedeemMessage: false });
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add Remove Liquidity */}
                <>
                    <div className="mt-4 border-top border-warning border-5 pt-4 d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-success w-100" + (this.state.addRemoveButton === "ADD" ? " active" : "")} data-bs-toggle="button" name="addRemoveButton" value="ADD" onClick={this.onEventString}>
                            ADD
                        </button>
                        <button type="button" className={"shadow-none btn btn-outline-danger w-100" + (this.state.addRemoveButton === "REMOVE" ? " active" : "")} data-bs-toggle="button" name="addRemoveButton" value="REMOVE" onClick={this.onEventString}>
                            REMOVE
                        </button>
                    </div>
                    <div className="mt-4 text-end text-muted">{this.state.liquidityBalance.toFixed(2)} : Liquidity Shares Balance</div>
                    <div className=" text-end text-muted">{this.state.yesBalance.toFixed(2)} : YES Balance</div>
                    <div className="text-end text-muted">{this.state.noBalance.toFixed(2)} : NO Balance</div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        {this.state.addRemoveButton === "ADD" ? <i className="fa-solid fa-coins me-3"></i> : <i className="fa-solid fa-percent me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" placeholder="Amount" value={this.state.addRemoveAmount} name="addRemoveAmount" onChange={this.onEventNumber}></input>
                        <button type="button" className="shadow-none btn btn-dark" name="addRemoveAmount" value={this.state.addRemoveButton === "ADD" ? this.state.liquidityBalance : this.state.liquidityBalance} onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        {this.state.addRemoveButton === "ADD" ? <i className="fa-solid fa-coins me-3"></i> : <i className="fa-solid fa-percent me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" placeholder="Amount" value={this.state.addRemoveAmount} name="addRemoveAmount" onChange={this.onEventNumber}></input>
                        <button type="button" className="shadow-none btn btn-dark" name="addRemoveAmount" value={this.state.addRemoveButton === "ADD" ? this.state.liquidityBalance : this.state.liquidityBalance} onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    <input type="range" className="mt-2 form-range" step="0.05" min="0" max={this.state.addRemoveButton === "ADD" ? this.state.liquidityBalance : this.state.liquidityBalance} value={this.state.amount} name="amount" onChange={this.onEventNumber}></input>
                    {this.liquidityDetails()}
                    <button
                        type="button"
                        className="shadow-none btn btn-secondary w-100 mt-3"
                        name="submitButton"
                        onClick={this.submitLiquidityTransaction}
                        disabled={this.state.addRemoveAmount <= 0 || this.state.addRemoveAmount > (this.state.addRemoveButton === "ADD" ? this.state.liquidityBalance : this.state.liquidityBalance)}
                        data-bs-toggle="modal"
                        data-bs-target="#liquidityModal"
                    >
                        SUBMIT
                    </button>
                </>
                {/* Confirmation modal  */}
                <div className="modal fade" id="liquidityModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Please check your liquidity provision details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({ successMintRedeemMessage: false });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successMintRedeemMessage ? "block" : "none" }}>
                                    <strong>Your liquidity provision request has been successfully processed.</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMintRedeemMessage ? "block" : "none" }}>
                                    <strong>{this.state.warningMintRedeemMessage}</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                {this.mintRedeemDetails()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.submitMintRedeemTransaction} className="btn btn-success">
                                    Submit Transaction
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({ successMintRedeemMessage: false });
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    liquidityDetails = () => {
        if (this.state.addRemoveButton === "ADD") {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Total Liquidity Shares</td>
                                <td>{this.state.politicians[this.state.displayMarket].liquidityShares.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>YES Tokens in Pool</td>
                                <td>{this.state.politicians[this.state.displayMarket].yes.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens in Pool</td>
                                <td>{this.state.politicians[this.state.displayMarket].no.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>YES Balance after Minting</td>
                                <td>{(this.state.mintRedeemAmount + this.state.yesBalance).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Balance after Minting</td>
                                <td>{(this.state.mintRedeemAmount + this.state.noBalance).toFixed(2) || 0} NO</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        } else {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>YES Tokens Redeemed</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens Redeemed</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>$ Recieved</td>
                                <td>${this.state.mintRedeemAmount.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>YES Balance after Redemption</td>
                                <td>{(-this.state.mintRedeemAmount + this.state.yesBalance).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Balance after Redemption</td>
                                <td>{(-this.state.mintRedeemAmount + this.state.noBalance).toFixed(2) || 0} NO</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        }
    };

    mintRedeemDetails = () => {
        if (this.state.mintRedeemButton === "MINT") {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Cost</td>
                                <td>${this.state.mintRedeemAmount.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>YES Tokens Minted</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens Minted</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>YES Balance after Minting</td>
                                <td>{(this.state.mintRedeemAmount + this.state.yesBalance).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Balance after Minting</td>
                                <td>{(this.state.mintRedeemAmount + this.state.noBalance).toFixed(2) || 0} NO</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        } else {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>YES Tokens Redeemed</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens Redeemed</td>
                                <td>{this.state.mintRedeemAmount.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>$ Recieved</td>
                                <td>${this.state.mintRedeemAmount.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>YES Balance after Redemption</td>
                                <td>{(-this.state.mintRedeemAmount + this.state.yesBalance).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Balance after Redemption</td>
                                <td>{(-this.state.mintRedeemAmount + this.state.noBalance).toFixed(2) || 0} NO</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        }
    };

    // Trade Sidebar
    renderTradeSidebar() {
        return (
            <>
                <React.Fragment>
                    <div className="mt-4 border-bottom border-warning border-5 pb-4 d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-success w-100" + (this.state.buySellButton === "BUY" ? " active" : "")} data-bs-toggle="button" name="buySellButton" value="BUY" onClick={this.onEventString}>
                            BUY
                        </button>
                        <button type="button" className={"shadow-none btn btn-outline-danger w-100" + (this.state.buySellButton === "SELL" ? " active" : "")} data-bs-toggle="button" name="buySellButton" value="SELL" onClick={this.onEventString}>
                            SELL
                        </button>
                    </div>
                    <div className="mt-4 d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-success w-100" + (this.state.yesNoButton === "YES" ? " active" : "")} data-bs-toggle="button" name="yesNoButton" value="YES" onClick={this.onEventString}>
                            YES
                        </button>
                    </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"shadow-none btn btn-outline-danger w-100" + (this.state.yesNoButton === "NO" ? " active" : "")} data-bs-toggle="button" name="yesNoButton" value="NO" onClick={this.onEventString}>
                            NO
                        </button>
                    </div>
                    <div className="mt-4 text-end text-muted">
                        {this.state.buySellButton === "BUY" ? "$" : this.state.yesNoButton + " "}
                        {this.state.buySellButton === "BUY" ? this.props.userSessionDetails.USD.toFixed(2) : this.state.yesNoButton === "YES" ? this.state.yesBalance.toFixed(2) : this.state.noBalance.toFixed(2)} : Available Balance
                    </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        {this.state.buySellButton === "BUY" ? <i className="fa-solid fa-dollar-sign me-3"></i> : <i className="fa-solid fa-coins me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" placeholder="Amount" value={this.state.amount} name="amount" onChange={this.onEventNumber}></input>
                        <button type="button" className="shadow-none btn btn-dark" name="amount" value={this.state.buySellButton === "BUY" ? this.props.userSessionDetails.USD : this.state.yesNoButton === "YES" ? this.state.yesBalance : this.state.noBalance} onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    <input
                        type="range"
                        className="mt-2 form-range"
                        step="0.05"
                        min="0"
                        max={this.state.buySellButton === "BUY" ? this.props.userSessionDetails.USD : this.state.yesNoButton === "YES" ? this.state.yesBalance : this.state.noBalance}
                        value={this.state.amount}
                        name="amount"
                        onChange={this.onEventNumber}
                    ></input>

                    {this.transactionBuySellDetails()}
                    <button
                        type="button"
                        className="shadow-none btn btn-secondary w-100 mt-3"
                        name="submitButton"
                        onClick={this.submitButton}
                        disabled={this.state.amount <= 0 || this.state.amount > (this.state.buySellButton === "BUY" ? this.props.userSessionDetails.USD : this.state.yesNoButton === "YES" ? this.state.yesBalance : this.state.noBalance)}
                        data-bs-toggle="modal"
                        data-bs-target="#buySellModal"
                    >
                        SUBMIT
                    </button>
                    {/* Confirmation modal  */}
                    <div className="modal fade" id="buySellModal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Please check your transactions details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            this.setState({ successBuySellMessage: false });
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successBuySellMessage ? "block" : "none" }}>
                                        <strong>Your transaction has been successfully processed.</strong>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                    </div>
                                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningBuySellMessage ? "block" : "none" }}>
                                        <strong>{this.state.warningBuySellMessage}</strong>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                    </div>
                                    {this.transactionBuySellDetails()}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={this.submitTransaction} className="btn btn-success">
                                        Submit Transaction
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            this.setState({ successBuySellMessage: false });
                                        }}
                                    >
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </>
        );
    }
    // Transaction Details
    transactionBuySellDetails = () => {
        if (this.state.buySellButton === "BUY") {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Cost</td>
                                <td>${this.state.amount.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>Tokens Purchased</td>
                                <td>
                                    {this.computeTokensFromDollar().toFixed(2)} {this.state.yesNoButton}
                                </td>
                            </tr>
                            <tr>
                                <td>Price Per Token</td>
                                <td>{Number(((this.state.amount * 100) / this.computeTokensFromDollar()).toFixed(0)) || 0}¢</td>
                            </tr>
                            <tr>
                                <td>Slippage</td>
                                <td>{Math.max(this.computeBuySlippageFromDollar(), 0).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>Potential Winnings</td>
                                <td>${(this.computeTokensFromDollar().toFixed(2) - this.state.amount).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Potential ROI</td>
                                <td>{(((this.computeTokensFromDollar().toFixed(2) - this.state.amount) * 100) / this.state.amount || 0).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton}</td>
                                <td>{(this.computeNewPriceFromDollar() * 100).toFixed(0)}¢</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton === "YES" ? "NO" : "YES"}</td>
                                <td>{(100 - this.computeNewPriceFromDollar() * 100).toFixed(0)}¢</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        } else {
            return (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Tokens Sold</td>
                                <td>
                                    {this.state.amount.toFixed(2)} {this.state.yesNoButton}
                                </td>
                            </tr>
                            <tr>
                                <td>Amount recieved</td>
                                <td>${(this.state.amount - this.computeDollarFromTokens()).toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>Price Per Token</td>
                                <td>{(((this.state.amount - this.computeDollarFromTokens()) * 100) / this.state.amount || 0).toFixed(0)}¢</td>
                            </tr>
                            <tr>
                                <td>Slippage</td>
                                <td>{Math.max(-this.computeSellSlippageFromToken(), 0).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton}</td>
                                <td>{(this.computeNewPriceFromToken() * 100).toFixed(0)}¢</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton === "YES" ? "NO" : "YES"}</td>
                                <td>{(100 - this.computeNewPriceFromToken() * 100).toFixed(0)}¢</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        }
    };
    computeDollarFromTokens = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let amount = this.state.amount;
            if (this.state.yesNoButton === "YES") {
                return (amount - yesTokens - noTokens + Math.sqrt((yesTokens + noTokens - amount) ** 2 + 4 * amount * yesTokens)) / 2;
            } else {
                return (amount - yesTokens - noTokens + Math.sqrt((yesTokens + noTokens - amount) ** 2 + 4 * amount * noTokens)) / 2;
            }
        } else {
            return 0;
        }
    };
    computeTokensFromDollar = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let invariantK = yesTokens * noTokens;
            let amount = this.state.amount;
            if (this.state.yesNoButton === "YES") {
                return yesTokens + amount - invariantK / (noTokens + amount);
            } else {
                return noTokens + amount - invariantK / (yesTokens + amount);
            }
        } else {
            return 0;
        }
    };
    computeNewPriceFromDollar = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let invariantK = yesTokens * noTokens;
            let amount = this.state.amount;
            if (this.state.yesNoButton === "YES") {
                return (noTokens + amount) / (noTokens + amount + invariantK / (noTokens + amount));
            } else {
                return (yesTokens + amount) / (yesTokens + amount + invariantK / (yesTokens + amount));
            }
        } else {
            return 0;
        }
    };
    computeNewPriceFromToken = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let invariantK = yesTokens * noTokens;
            let money = this.computeDollarFromTokens();
            if (this.state.yesNoButton === "YES") {
                let newYes = yesTokens + money;
                let newNo = invariantK / (yesTokens + money);
                return newNo / (newNo + newYes);
            } else {
                let newNo = noTokens + money;
                let newYes = invariantK / (noTokens + money);
                return newYes / (newNo + newYes);
            }
        } else {
            return 0;
        }
    };
    computeBuySlippageFromDollar = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let yesPrice = noTokens / (yesTokens + noTokens);
            let noPrice = yesTokens / (yesTokens + noTokens);
            let priceToPay = (this.state.amount * 100) / this.computeTokensFromDollar();
            if (this.state.yesNoButton === "YES") {
                return Math.abs(priceToPay - yesPrice) / yesPrice - 100 || 0;
            } else {
                return Math.abs(priceToPay - noPrice) / noPrice - 100 || 0;
            }
        } else {
            return 0;
        }
    };
    computeSellSlippageFromToken = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let yesPrice = noTokens / (yesTokens + noTokens);
            let noPrice = yesTokens / (yesTokens + noTokens);
            let priceToPay = ((this.state.amount - this.computeDollarFromTokens()) * 100) / this.state.amount;
            if (this.state.yesNoButton === "YES") {
                return Math.abs(priceToPay - yesPrice) / yesPrice - 100 || 0;
            } else {
                return Math.abs(priceToPay - noPrice) / noPrice - 100 || 0;
            }
        } else {
            return 0;
        }
    };

    async componentDidMount() {
        //Pull all politician markets
        let response1 = await axios.get(API_URL + "/open_markets/" + this.props.market_id);
        this.setState({
            position: response1.data.openMarkets[0].position,
            country: response1.data.openMarkets[0].country,
            description: response1.data.openMarkets[0].description,
            politicians: response1.data.openMarkets[0].politicians,
            timestampCreated: response1.data.openMarkets[0].timestampCreated,
            timestampExpiry: response1.data.openMarkets[0].timestampExpiry,
        });

        //Compute global liquidity and global volume
        let globalVolume = 0;
        let globalLiquidity = 0;
        for (let politicianEntry of this.state.politicians) {
            let yesTokens = politicianEntry.yes;
            let noTokens = politicianEntry.no;
            let yesPrice = noTokens / (yesTokens + noTokens);
            globalVolume += politicianEntry.volume;
            globalLiquidity += yesPrice * yesTokens * 2;
        }
        this.setState({
            globalLiquidity: globalLiquidity,
            globalVolume: globalVolume,
        });

        //Pull yes no tokens for market 0
        let market_id = this.state.politicians[0].market_id;
        let response2 = await axios.get(API_URL + "/balances/" + market_id + "/" + this.props.userSessionDetails._id);

        this.setState({
            yesBalance: response2.data.balances.yes,
            noBalance: response2.data.balances.no,
            liquidityBalance: response2.data.balances.liquidityShares,
        });
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12 col-lg-8">
                        {/* Title of the market  */}
                        <h1 className="ms-2 mt-3">
                            Market: {this.state.position} of {this.state.country}
                        </h1>
                        {/* Data cards of the market  */}
                        <div className="d-flex mt-4">
                            <div className="card w-100">
                                <div className="card-body text-center">
                                    <h5>Market Ends on</h5>
                                    <p>{new Date(this.state.timestampExpiry).toDateString()}</p>
                                </div>
                            </div>
                            <div className="card w-100">
                                <div className="card-body text-center">
                                    <h5>Volume to Date</h5>
                                    <p>${this.state.globalVolume.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="card w-100">
                                <div className="card-body text-center">
                                    <h5>Current Liquidity</h5>
                                    <p>${this.state.globalLiquidity.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">{this.renderPoliticianMarkets()}</div>
                        <img className="img-fluid mt-4" src="https://www.presentationpoint.com/wp-content/uploads/2018/12/MS-Graph-in-PowerPoint-inserted-graph.jpg"></img>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam malesuada elementum justo ac semper. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus semper, diam id sollicitudin tempus, mi nisl facilisis tortor, eu eleifend urna ligula eu quam.
                            Sed ultrices sollicitudin lacus, eget semper libero ornare eget. Morbi erat mauris, scelerisque at gravida vel, lacinia eget neque. Donec fringilla diam a dolor mollis bibendum. Nam egestas orci id mattis tempus. Cras in velit eu quam eleifend ultricies. Curabitur id
                            porta lacus, id finibus arcu. Cras sed accumsan lorem, non tempor orci. Sed dictum odio ac metus gravida, eget condimentum orci malesuada. Aenean id mollis quam. Aenean vitae enim elit. Mauris a rutrum dolor. Donec pretium eros vitae tellus maximus tincidunt. Donec id
                            iaculis metus. Mauris ac diam quis augue luctus cursus. Mauris mi mi, condimentum a interdum eget, sollicitudin ac mauris. Pellentesque maximus vitae mi in tristique. Maecenas eget vestibulum magna. Fusce fringilla est sed quam iaculis, id sagittis augue pellentesque.
                            Nulla et diam erat. Nam eu mi viverra, aliquam diam at, vestibulum elit. Nam pharetra magna ac lacinia dignissim. Aenean et enim at nulla vestibulum lobortis. Morbi ac tincidunt arcu. Duis ullamcorper suscipit venenatis. Phasellus porta eget dolor vulputate blandit. Etiam
                            lorem ipsum, ullamcorper tincidunt fringilla vel, sodales a sapien. Maecenas nulla elit, sollicitudin non enim fringilla, elementum sagittis magna. Mauris laoreet diam et justo egestas vehicula. Cras eu dapibus mi. Nunc eget iaculis ipsum. Ut mauris magna, rutrum a ante
                            a, pellentesque dapibus ipsum. Sed sed sodales dui. Cras iaculis, eros id molestie gravida, orci diam viverra orci, vitae scelerisque arcu augue eu justo. Suspendisse erat lorem, feugiat eget metus eu, rutrum lobortis nisi. Mauris in condimentum lectus, eget malesuada
                            sem. Cras elementum ullamcorper ex, vel ornare ligula eleifend ut. Ut sit amet fermentum dui, non tristique tortor. Integer ullamcorper vitae ex et aliquet. Nam vel felis et urna vestibulum ultrices. Integer nec purus fermentum, interdum purus bibendum, tristique est. Sed
                            ac nunc et augue gravida iaculis sed a tortor. Nam fermentum tortor eget magna mattis, sed sagittis tellus suscipit. Sed est odio, hendrerit sit amet urna et, sagittis tincidunt mi. Duis faucibus tempus dui, ut cursus lectus vehicula vitae. Aliquam a convallis risus, ac
                            suscipit ipsum. Donec a felis elementum enim volutpat ornare sed sit amet eros. In id dapibus nibh. Nunc sem urna, luctus aliquet ante ac, pulvinar sagittis elit. Curabitur id elementum urna, ut tincidunt erat. Vestibulum ante ipsum primis in faucibus orci luctus et
                            ultrices posuere cubilia curae; Sed tristique vulputate quam, id pharetra erat elementum vitae. Duis vitae dolor a purus aliquet aliquam sit amet sed risus. Donec gravida lacus non porttitor pellentesque. Vivamus maximus efficitur ligula sagittis malesuada. Duis eu
                            hendrerit tortor, nec viverra nibh. Praesent id eros commodo nulla pretium suscipit sit amet vel turpis. Etiam tristique, risus fermentum sodales tempus, erat metus tincidunt justo, vel consequat purus purus sed nibh.
                        </p>
                    </div>
                    <div className="mt-5 col-12 col-lg-4">{this.renderSidebar()}</div>
                </div>
            </>
        );
    }
}
