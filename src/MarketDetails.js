import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Markets extends React.Component {
    state = {
        market_id: "62380bd95277817d6cf2411b",
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
        amount: "Amount",
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
                    <button type="button" className={"w-100 d-block btn btn-outline-dark" + (this.state.displayMarket === count ? " active" : "")} data-bs-toggle="button" value={count} name="displayMarket" onClick={this.onEventNumber}>
                        <div className="d-flex align-items-center justify-content-between ">
                            <div className="text-start">
                                <div>{politicianEntry.politician}</div>
                                <div>
                                    <span className="text-muted">Volume</span>
                                    <span className="card-text text-muted">&nbsp;${politicianEntry.volume}&nbsp;</span>

                                    <span className="text-muted ms-3">Liquidity</span>
                                    <span className="card-text text-muted">&nbsp;${yesTokens * yesPrice * 2}&nbsp;</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-success me-2">Yes: {yesPrice * 100}¢</span>
                                <span className="text-danger">No: {noPrice * 100}¢</span>
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
        let politicianDetails = this.state.politicians[this.state.displayMarket];
        return (
            <React.Fragment>
                <div className="">
                    <div className="d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"btn btn-outline-success w-100" + (this.state.buySellButton === "BUY" ? " active" : "")} data-bs-toggle="button" name="buySellButton" value="BUY" onClick={this.onEventString}>
                            BUY
                        </button>
                        <button type="button" className={"btn btn-outline-danger w-100" + (this.state.buySellButton === "SELL" ? " active" : "")} data-bs-toggle="button" name="buySellButton" value="SELL" onClick={this.onEventString}>
                            SELL
                        </button>
                    </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        <button type="button" className={"btn btn-outline-success w-100" + (this.state.yesNoButton === "YES" ? " active" : "")} data-bs-toggle="button" name="yesNoButton" value="YES" onClick={this.onEventString}>
                            YES
                        </button>
                        <button type="button" className={"btn btn-outline-danger w-100" + (this.state.yesNoButton === "NO" ? " active" : "")} data-bs-toggle="button" name="yesNoButton" value="NO" onClick={this.onEventString}>
                            NO
                        </button>
                    </div>
                    <div className="d-flex align-items-center justify-content-evenly">
                        <input className="form-control" type="search" placeholder="Amount" value={this.state.amount} name="amount" onChange={this.onEventNumber}></input>
                        <button type="button" className="btn btn-dark" name="amount" value="1000" onClick={this.onEventNumber}>
                            MAX
                        </button>
                    </div>
                    <input type="range" className="form-range" step="0.1" min="0" max="5"></input>
                </div>
            </React.Fragment>
        );
    }

    async componentDidMount() {
        let response = await axios.get(API_URL + "/open_markets/" + this.state.market_id);
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
                <div>
                    <h1 className="">
                        {this.state.position} of {this.state.country}
                    </h1>
                    <div className="d-flex">
                        <div className="card">
                            <div className="card-body text-center">
                                <h5>Market Ends on</h5>
                                <p>{new Date(this.state.timestampExpiry).toDateString()}</p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <h5>Volume to Date</h5>
                                <p>${this.state.globalVolume}</p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <h5>Current Liquidity</h5>
                                <p>${this.state.globalLiquidity}</p>
                            </div>
                        </div>
                    </div>
                    {this.renderPoliticianMarkets()}
                    {this.renderBuySidebar()}
                </div>
            </>
        );
    }
}
