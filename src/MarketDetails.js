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

    renderPoliticianMarkets() {
        let renderArray = [];
        let count = 0;
        for (let politicianEntry of this.state.politicians) {
            let yesTokens = politicianEntry.yes;
            let noTokens = politicianEntry.no;
            let yesPrice = yesTokens / (yesTokens + noTokens);
            let noPrice = noTokens / (yesTokens + noTokens);

            renderArray.push(
                <React.Fragment key={politicianEntry.politician}>
                    <button type="button" className={"shadow-none w-100 d-block btn btn-outline-dark" + (this.state.displayMarket === count ? " active" : "")} data-bs-toggle="button" value={count} name="displayMarket" onClick={this.onEventNumber}>
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

    renderBuySidebar() {
        return (
            <React.Fragment>
                <div className="border border-5 p-3 border-warning">
                    <div className="mt-2 border-bottom border-warning border-5 pb-4 d-flex align-items-center justify-content-evenly">
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
                    <div className="mt-4 text-end text-muted"> ${this.props.userSessionDetails.USD.toFixed(2)} : Available Balance </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        {this.state.buySellButton === "BUY" ? <i className="fa-solid fa-dollar-sign me-3"></i> : <i className="fa-solid fa-coins me-3"></i>}
                        <input autoComplete="off" className="form-control shadow-none" type="number" placeholder="Amount" value={this.state.amount} name="amount" onChange={this.onEventNumber}></input>
                        <button type="button" className="shadow-none btn btn-dark" name="amount" value={this.props.userSessionDetails.USD} onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    {this.transactionDetails()}
                    <button type="button" className="shadow-none btn btn-secondary w-100 mt-3" name="submitButton" onClick={this.submitButton} disabled={this.state.amount < 0 || this.state.amount > this.props.userSessionDetails.USD} data-bs-toggle="modal" data-bs-target="#withdrawModal">
                        SUBMIT
                    </button>
                    {/* <!-- Withdraw Modal --> */}
                    <div className="modal fade" id="withdrawModal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">WITHDRAWAL</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
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
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    transactionDetails = () => {
        return (
            <>
                <input type="range" className="mt-2 form-range" step="0.05" min="0" max={this.props.userSessionDetails.USD} value={this.state.amount} name="amount" onChange={this.onEventNumber}></input>
                <span className="d-block p-2">You will pay ${this.state.amount.toFixed(2) || 0}.</span>
                <span className="d-block p-2">
                    You will buy {this.computeTokensFromDollar().toFixed(2)} {this.state.yesNoButton} tokens.
                </span>
                <span className="d-block p-2">The price paid per token is {Number(((this.state.amount * 100) / this.computeTokensFromDollar()).toFixed(0)) || 0}¢.</span>
                <span className="d-block p-2">Transaction Slippage: {this.computeSlippageFromDollar().toFixed(2)}%</span>
                <span className="d-block p-2">
                    Winnings if {this.state.yesNoButton === "YES" ? "NO" : "YES"} outcome is true: ${(this.computeTokensFromDollar().toFixed(2) - this.state.amount).toFixed(2)}
                </span>
                <span className="d-block p-2">
                    ROI if {this.state.yesNoButton === "YES" ? "NO" : "YES"} outcome is true: {(((this.computeTokensFromDollar().toFixed(2) - this.state.amount) * 100) / this.state.amount || 0).toFixed(2)}%.
                </span>
                <span className="d-block p-2">New price of YES after your transaction {this.state.yesNoButton === "YES" ? (100 - this.computeNewPriceFromDollar() * 100).toFixed(0) : (this.computeNewPriceFromDollar() * 100).toFixed(0)}¢.</span>
                <span className="d-block p-2">New price of NO after your transaction {this.state.yesNoButton === "YES" ? (this.computeNewPriceFromDollar() * 100).toFixed(0) : (100 - this.computeNewPriceFromDollar() * 100).toFixed(0)}¢.</span>
            </>
        );
    };

    computeTokensFromDollar = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let invariantK = yesTokens * noTokens;
            let amount = this.state.amount;
            if (this.state.yesNoButton === "NO") {
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
            return invariantK / (yesTokens + amount) / (yesTokens + amount + invariantK / (yesTokens + amount));
        } else {
            return 0;
        }
    };

    computeSlippageFromDollar = () => {
        if (this.state.position) {
            let index = this.state.displayMarket;
            let yesTokens = this.state.politicians[index].yes;
            let noTokens = this.state.politicians[index].no;
            let yesPrice = yesTokens / (yesTokens + noTokens);
            let noPrice = noTokens / (yesTokens + noTokens);
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

    async componentDidMount() {
        let response = await axios.get(API_URL + "/open_markets/" + this.props.market_id);
        this.setState({
            position: response.data.openMarkets[0].position,
            country: response.data.openMarkets[0].country,
            description: response.data.openMarkets[0].description,
            politicians: response.data.openMarkets[0].politicians,
            timestampCreated: response.data.openMarkets[0].timestampCreated,
            timestampExpiry: response.data.openMarkets[0].timestampExpiry,
        });
        let globalVolume = 0;
        let globalLiquidity = 0;
        for (let politicianEntry of this.state.politicians) {
            let yesTokens = politicianEntry.yes;
            let noTokens = politicianEntry.no;
            let yesPrice = yesTokens / (yesTokens + noTokens);
            globalVolume += politicianEntry.volume;
            globalLiquidity += yesPrice * yesTokens * 2;
        }
        this.setState({
            globalLiquidity: globalLiquidity,
            globalVolume: globalVolume,
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
                    <div className="mt-5 col-12 col-lg-4">{this.renderBuySidebar()}</div>
                </div>
            </>
        );
    }
}
