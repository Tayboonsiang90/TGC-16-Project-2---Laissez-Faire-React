import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ApexChart from "./ApexChart";

const API_URL = "https://project-2-express.herokuapp.com";

export default class Markets extends React.Component {
    state = {
        position: "",
        country: "",
        description: "",
        politicians: [],
        type: "",
        //Display
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
        //Interactive
        warningBuySellMessage: "",
        successBuySellMessage: false,
        warningMintRedeemMessage: "",
        successMintRedeemMessage: false,
        warningAddRemoveMessage: "",
        successAddRemoveMessage: false,
        tradeLiquidityButton: "TRADE",
        addRemoveButton: "ADD",
        addRemoveAmount: 0,
        mintRedeemButton: "MINT",
        mintRedeemAmount: 0,
        orderHistory: [],
        //Refresh child component
        refreshChildChart: false,
    };

    childChartUpdate = () => {
        this.setState({
            refreshChildChart: !this.state.refreshChildChart,
        });
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

    addRemoveNumber = (evt) => {
        //(this.state.addRemoveAmount * (this.state.politicians[this.state.displayMarket].no) / this.state.politicians[this.state.displayMarket].yes)
        this.setState({
            addRemoveAmount: Number(evt.currentTarget.value) * (this.state.politicians[this.state.displayMarket].yes / this.state.politicians[this.state.displayMarket].no),
        });
    };

    updateYesNoBalances = async (evt) => {
        let market_id = this.state.politicians[evt.currentTarget.value].market_id;
        if (this.props.userSessionDetails._id) {
            let response = await axios.get(API_URL + "/balances/" + market_id + "/" + this.props.userSessionDetails._id);

            this.setState({
                yesBalance: response.data.balances.yes,
                noBalance: response.data.balances.no,
            });
        }
    };

    submitTransaction = async () => {
        try {
            await axios.put(API_URL + "/trade/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                buyOrSell: this.state.buySellButton,
                yesOrNo: this.state.yesNoButton,
                amount: this.state.amount,
            });
            this.setState({
                successBuySellMessage: true,
            });
        } catch (error) {
            this.setState({
                warningBuySellMessage: error.response.data.message,
            });
        }

        this.props.updateSessionState();

        setTimeout(
            function () {
                this.props.updateSessionState();
                this.updateOpenMarketsState();
            }.bind(this),
            300
        );
    };

    submitMintRedeemTransaction = async () => {
        try {
            await axios.put(API_URL + "/mint_redeem/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                mintOrRedeem: this.state.mintRedeemButton,
                amount: this.state.mintRedeemAmount,
            });
            this.setState({
                successMintRedeemMessage: true,
            });
        } catch (error) {
            this.setState({
                warningMintRedeemMessage: error.response.data.message,
            });
        }

        this.props.updateSessionState();

        setTimeout(
            function () {
                this.updateOpenMarketsState();
            }.bind(this),
            100
        );
    };

    submitAddRemoveTransaction = async () => {
        try {
            await axios.put(API_URL + "/liquidity/" + this.state.politicians[this.state.displayMarket].market_id + "/" + this.props.userSessionDetails._id, {
                addOrRemove: this.state.addRemoveButton,
                amount: this.state.addRemoveAmount,
            });
            this.setState({
                successAddRemoveMessage: true,
            });
        } catch (error) {
            this.setState({
                warningAddRemoveMessage: error.response.data.message,
            });
        }

        this.props.updateSessionState();

        setTimeout(
            function () {
                this.updateOpenMarketsState();
            }.bind(this),
            100
        );
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
                        className={"shadow-none w-100 d-block btn btn-outline-light" + (this.state.displayMarket === count ? " active" : "")}
                        data-bs-toggle="button"
                        value={count}
                        name="displayMarket"
                        onClick={(e) => {
                            this.onEventNumber(e);
                            this.updateYesNoBalances(e);
                            setTimeout(
                                function () {
                                    this.props.updateSessionState();
                                    this.updateOpenMarketsState();
                                }.bind(this),
                                300
                            );
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
                                <span className="text-success me-2">Yes: {(yesPrice * 100).toFixed(0)}??</span>
                                <span className="text-danger">No: {(noPrice * 100).toFixed(0)}??</span>
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
        if (this.state.timestampExpiry) {
            if (this.state.timestampExpiry > new Date().getTime()) {
                return (
                    <React.Fragment>
                        <div className="border rounded-3 border-5 p-3">
                            <div className="mt-2 border-bottom border-5 pb-4 d-flex align-items-center justify-content-evenly">
                                <button type="button" className={"shadow-none btn btn-outline-light w-100" + (this.state.tradeLiquidityButton === "TRADE" ? " active" : "")} data-bs-toggle="button" name="tradeLiquidityButton" value="TRADE" onClick={this.onEventString}>
                                    TRADE
                                </button>
                                <button type="button" className={"shadow-none btn btn-outline-light w-100" + (this.state.tradeLiquidityButton === "LIQUIDITY" ? " active" : "")} data-bs-toggle="button" name="tradeLiquidityButton" value="LIQUIDITY" onClick={this.onEventString}>
                                    LIQUIDITY
                                </button>
                            </div>
                            {this.state.tradeLiquidityButton === "TRADE" ? this.renderTradeSidebar() : this.renderLiquiditySidebar()}
                        </div>
                    </React.Fragment>
                );
            } else if (this.state.timestampExpiry <= new Date().getTime() && this.state.type === "open") {
                return (
                    <React.Fragment>
                        <div className="border rounded-3 border-5 p-3">
                            <h1> This market has reached settlement date and is being resolved. </h1>
                        </div>
                    </React.Fragment>
                );
            } else if (this.state.timestampExpiry <= new Date().getTime() && this.state.type === "closed") {
                return (
                    <React.Fragment>
                        <div className="border border-5 p-3">
                            <h1> This market has reached settlement date and has been resolved. All contracts have been settled and paid. </h1>
                        </div>
                    </React.Fragment>
                );
            }
        }
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
                    <div className="mt-4 border-top border-5 pt-4 d-flex align-items-center justify-content-evenly">
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
                        {this.state.addRemoveButton === "ADD" ? <i className="fa-solid fa-y me-3"></i> : <i className="fa-solid fa-percent me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" value={this.state.addRemoveAmount} name="addRemoveAmount" onChange={this.onEventNumber}></input>
                        <button
                            type="button"
                            className="shadow-none btn btn-dark"
                            name="addRemoveAmount"
                            value={this.state.addRemoveButton === "ADD" ? Math.min(this.state.yesBalance, this.state.noBalance * (this.state.politicians[this.state.displayMarket].yes / this.state.politicians[this.state.displayMarket].no)) : this.state.liquidityBalance}
                            onClick={this.onEventNumber}
                        >
                            MAX
                        </button>
                    </div>
                    <div className={"align-items-center justify-content-evenly"} style={{ display: this.state.addRemoveButton === "ADD" ? "flex" : "none" }}>
                        <i className="fa-solid fa-n me-3"></i>
                        <input
                            autoComplete="off"
                            className="form-control shadow-none"
                            type="number"
                            value={(this.state.addRemoveAmount * this.state.politicians[this.state.displayMarket].no) / this.state.politicians[this.state.displayMarket].yes}
                            name="addRemoveAmount"
                            onChange={this.addRemoveNumber}
                        ></input>
                        <button
                            type="button"
                            className="shadow-none btn btn-dark"
                            name="addRemoveAmount"
                            value={Math.min(this.state.noBalance, this.state.yesBalance * (this.state.politicians[this.state.displayMarket].no / this.state.politicians[this.state.displayMarket].yes))}
                            onClick={this.addRemoveNumber}
                        >
                            MAX
                        </button>
                    </div>
                    <input
                        type="range"
                        className="mt-2 form-range"
                        step="0.001"
                        min="0"
                        max={this.state.addRemoveButton === "ADD" ? Math.min(this.state.yesBalance, this.state.noBalance * (this.state.politicians[this.state.displayMarket].yes / this.state.politicians[this.state.displayMarket].no)) : this.state.liquidityBalance}
                        value={this.state.addRemoveAmount}
                        name="addRemoveAmount"
                        onChange={this.onEventNumber}
                    ></input>
                    {this.liquidityDetails()}
                    <button
                        type="button"
                        className="shadow-none btn btn-secondary w-100 mt-3"
                        name="submitButton"
                        onClick={this.submitLiquidityTransaction}
                        disabled={
                            this.state.addRemoveAmount <= 0 ||
                            this.state.addRemoveAmount > (this.state.addRemoveButton === "ADD" ? Math.min(this.state.yesBalance, this.state.noBalance * (this.state.politicians[this.state.displayMarket].yes / this.state.politicians[this.state.displayMarket].no)) : this.state.liquidityBalance)
                        }
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
                                        this.setState({ successAddRemoveMessage: false });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successAddRemoveMessage ? "block" : "none" }}>
                                    <strong>Your liquidity provision request has been successfully processed.</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningAddRemoveMessage ? "block" : "none" }}>
                                    <strong>{this.state.warningAddRemoveMessage}</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                                {this.liquidityDetails()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.submitAddRemoveTransaction} className="btn btn-success">
                                    Submit Transaction
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        this.setState({ successAddRemoveMessage: false });
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

    renderTradeHistory() {
        let renderArray = [];

        for (let item of this.state.orderHistory) {
            renderArray.push(
                <tr key={item.timestamp}>
                    <th>{item.type === "TRADE" ? item.buyOrSell : item.type}</th>
                    <td>
                        {(item.type === "TRADE" ? (item.yesOrNo === "YES" ? item.quantity : 0) : item.type === "MINT" || item.type === "REDEEM" ? item.quantity : item.quantityYes).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </td>
                    <td>
                        {(item.type === "TRADE" ? (item.yesOrNo === "NO" ? item.quantity : 0) : item.type === "MINT" || item.type === "REDEEM" ? item.quantity : item.quantityNo).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </td>
                    <td>
                        $
                        {(item.type === "TRADE" ? item.quantityInUSD : item.type === "MINT" || item.type === "REDEEM" ? item.quantity : "-").toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
            );
        }

        return renderArray;
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
                                <td>Your Liquidity Shares Balance Before</td>
                                <td>{this.state.liquidityBalance.toFixed(2) || 0} </td>
                            </tr>
                            <tr>
                                <td>Your Current % of Pool</td>
                                <td>{((this.state.liquidityBalance * 100) / this.state.politicians[this.state.displayMarket].liquidityShares).toFixed(2) || 0} %</td>
                            </tr>
                            <tr>
                                <td>Liquidity Shares Minted</td>
                                <td>{((this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].yes) * this.state.politicians[this.state.displayMarket].liquidityShares).toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>Your Liquidity Shares Balance After</td>
                                <td>{(this.state.liquidityBalance + (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].yes) * this.state.politicians[this.state.displayMarket].liquidityShares).toFixed(2) || 0} </td>
                            </tr>
                            <tr>
                                <td>Your % of Pool After</td>
                                <td>
                                    {(
                                        ((this.state.liquidityBalance + (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].yes) * this.state.politicians[this.state.displayMarket].liquidityShares) /
                                            ((this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].yes) * this.state.politicians[this.state.displayMarket].liquidityShares + this.state.politicians[this.state.displayMarket].liquidityShares)) *
                                        100
                                    ).toFixed(2) || 0}
                                    %
                                </td>
                            </tr>
                            <tr>
                                <td>YES Tokens in Pool Before</td>
                                <td>{this.state.politicians[this.state.displayMarket].yes.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens in Pool Before</td>
                                <td>{this.state.politicians[this.state.displayMarket].no.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>YES Tokens in Pool After</td>
                                <td>{(this.state.politicians[this.state.displayMarket].yes + this.state.addRemoveAmount).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens in Pool After</td>
                                <td>{(this.state.politicians[this.state.displayMarket].no + this.state.addRemoveAmount * (this.state.politicians[this.state.displayMarket].no / this.state.politicians[this.state.displayMarket].yes)).toFixed(2) || 0} NO</td>
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
                                <td>Total Liquidity Shares</td>
                                <td>{this.state.politicians[this.state.displayMarket].liquidityShares.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>Your Liquidity Shares Balance Before</td>
                                <td>{this.state.liquidityBalance.toFixed(2) || 0} </td>
                            </tr>
                            <tr>
                                <td>Your Current % of Pool</td>
                                <td>{((this.state.liquidityBalance * 100) / this.state.politicians[this.state.displayMarket].liquidityShares).toFixed(2) || 0} %</td>
                            </tr>
                            <tr>
                                <td>Liquidity Shares Redeemed</td>
                                <td>{this.state.addRemoveAmount.toFixed(2) || 0}</td>
                            </tr>
                            <tr>
                                <td>Your Liquidity Shares Balance After</td>
                                <td>{(this.state.liquidityBalance - this.state.addRemoveAmount).toFixed(2) || 0} </td>
                            </tr>
                            <tr>
                                <td>Your % of Pool After</td>
                                <td>{(((this.state.liquidityBalance - this.state.addRemoveAmount) * 100) / (this.state.politicians[this.state.displayMarket].liquidityShares - this.state.addRemoveAmount)).toFixed(2) || 0}%</td>
                            </tr>
                            <tr>
                                <td>YES Tokens Recieved</td>
                                <td>{(this.state.politicians[this.state.displayMarket].yes * (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].liquidityShares)).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens Recieved</td>
                                <td>{(this.state.politicians[this.state.displayMarket].no * (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].liquidityShares)).toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>YES Tokens in Pool Before</td>
                                <td>{this.state.politicians[this.state.displayMarket].yes.toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens in Pool Before</td>
                                <td>{this.state.politicians[this.state.displayMarket].no.toFixed(2) || 0} NO</td>
                            </tr>
                            <tr>
                                <td>YES Tokens in Pool After</td>
                                <td>{(this.state.politicians[this.state.displayMarket].yes - this.state.politicians[this.state.displayMarket].yes * (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].liquidityShares)).toFixed(2) || 0} YES</td>
                            </tr>
                            <tr>
                                <td>NO Tokens in Pool After</td>
                                <td>{(this.state.politicians[this.state.displayMarket].no - this.state.politicians[this.state.displayMarket].no * (this.state.addRemoveAmount / this.state.politicians[this.state.displayMarket].liquidityShares)).toFixed(2) || 0} NO</td>
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
                    <div className="mt-4 border-bottom border-5 pb-4 d-flex align-items-center justify-content-evenly">
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
                                <td>{Number(((this.state.amount * 100) / this.computeTokensFromDollar()).toFixed(0)) || 0}??</td>
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
                                <td>{(this.computeNewPriceFromDollar() * 100).toFixed(0)}??</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton === "YES" ? "NO" : "YES"}</td>
                                <td>{(100 - this.computeNewPriceFromDollar() * 100).toFixed(0)}??</td>
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
                                <td>{(((this.state.amount - this.computeDollarFromTokens()) * 100) / this.state.amount || 0).toFixed(0)}??</td>
                            </tr>
                            <tr>
                                <td>Slippage</td>
                                <td>{Math.max(-this.computeSellSlippageFromToken(), 0).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton}</td>
                                <td>{(this.computeNewPriceFromToken() * 100).toFixed(0)}??</td>
                            </tr>
                            <tr>
                                <td>New Price of {this.state.yesNoButton === "YES" ? "NO" : "YES"}</td>
                                <td>{(100 - this.computeNewPriceFromToken() * 100).toFixed(0)}??</td>
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
            type: response1.data.openMarkets[0].type,
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
        //if logged in
        if (this.props.userSessionDetails._id) {
            let response2 = await axios.get(API_URL + "/balances/" + market_id + "/" + this.props.userSessionDetails._id);

            this.setState({
                yesBalance: response2.data.balances.yes,
                noBalance: response2.data.balances.no,
                liquidityBalance: response2.data.balances.liquidityShares,
            });
        }

        //Pull Order History tokens for market 0
        if (this.props.userSessionDetails._id) {
            let response3 = await axios.get(API_URL + "/order_history/" + market_id + "/" + this.props.userSessionDetails._id);
            this.setState({
                orderHistory: response3.data,
            });
        }
    }

    async updateOpenMarketsState() {
        //Pull all politician markets
        let response1 = await axios.get(API_URL + "/open_markets/" + this.props.market_id);
        this.setState({
            position: response1.data.openMarkets[0].position,
            country: response1.data.openMarkets[0].country,
            description: response1.data.openMarkets[0].description,
            politicians: response1.data.openMarkets[0].politicians,
            type: response1.data.openMarkets[0].type,
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

        //Pull yes no tokens for current market
        let market_id = this.state.politicians[this.state.displayMarket].market_id;
        //if logged in
        if (this.props.userSessionDetails._id) {
            let response2 = await axios.get(API_URL + "/balances/" + market_id + "/" + this.props.userSessionDetails._id);

            this.setState({
                yesBalance: response2.data.balances.yes,
                noBalance: response2.data.balances.no,
                liquidityBalance: response2.data.balances.liquidityShares,
            });
        }

        //Pull Order History tokens for market 0
        if (this.props.userSessionDetails._id) {
            let response3 = await axios.get(API_URL + "/order_history/" + market_id + "/" + this.props.userSessionDetails._id);
            this.setState({
                orderHistory: response3.data,
            });
        }

        this.childChartUpdate();
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
                                <div className="card-body style-neutral text-center">
                                    <h5>Market Ends on</h5>
                                    <p>{new Date(this.state.timestampExpiry).toDateString()}</p>
                                </div>
                            </div>
                            <div className="card style-neutral w-100">
                                <div className="card-body text-center">
                                    <h5>Volume to Date</h5>
                                    <p>${this.state.globalVolume.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="card style-neutral w-100">
                                <div className="card-body text-center">
                                    <h5>Current Liquidity</h5>
                                    <p>${this.state.globalLiquidity.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4" id="markets">
                            {this.renderPoliticianMarkets()}
                        </div>
                        <div className="mt-4 background-dark">
                            <ApexChart market_id={this.props.market_id} refreshChildChart={this.state.refreshChildChart} displayMarket={this.state.displayMarket} />
                        </div>
                        {/* Rules and Details  */}
                        <h1 className="ms-2 mt-5 background-dark">Rules and Details</h1>
                        <p className="background-dark">{this.state.description}</p>
                        <p className="background-dark">On expiry date, the adminstrators of Laissez Faire reserve the sole authority to judge the settlement of a market. In case of any ambiguity or uncertainty, there may be a delay in settlement.</p>
                        {/* Trade History  */}
                        <h1 className="ms-2 mt-5 background-dark">Trade History</h1>
                        <table className="table w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Transaction Type</th>
                                    <th scope="col">Yes quantity</th>
                                    <th scope="col">No quantity</th>
                                    <th scope="col">USD Value</th>
                                    <th scope="col">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderTradeHistory()}</tbody>
                        </table>
                    </div>
                    <div className="mt-5 col-12 col-lg-4 style-neutral">{this.renderSidebar()}</div>
                </div>
            </>
        );
    }
}
