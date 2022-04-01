import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Markets extends React.Component {
    state = {
        openMarkets: [],
        resolvingMarkets: [{}, {}],
        closedMarkets: [{}, {}],
        sortOptions: 1, //1. Expiry Date, 2. Volume, 3. Liquidity
        ascendDescend: 1, //1. Descending, 2. Ascending
        marketType: [1, 2, 3], //1,2,3 (Open, Resolving, Closed)
        search: "",
    };

    updateFormFieldString = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    };

    updateFormFieldNumber = (evt) => {
        this.setState({
            [evt.target.name]: Number(evt.target.value),
        });
    };

    updateCheckboxNumber = (evt) => {
        let checkedNumber = Number(evt.target.value);
        //Case 1, already inside, unchecked
        if (this.state.marketType.includes(checkedNumber)) {
            let indexToRemove = this.state.marketType.findIndex((eachMarketType) => {
                return eachMarketType === checkedNumber;
            });
            this.setState({
                marketType: [...this.state.marketType.slice(0, indexToRemove), ...this.state.marketType.slice(indexToRemove + 1)],
            });
        } //Case 2, not inside, checked
        else {
            this.setState({
                marketType: [...this.state.marketType, checkedNumber],
            });
        }
    };

    renderOpenMarkets() {
        let renderArray = [];
        for (let market of this.state.openMarkets) {
            let globalVolume = 0;
            let globalLiquidity = 0;
            renderArray.push(
                <React.Fragment key={market._id}>
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span>
                                        <i className="fa-solid fa-check-to-slot"></i>
                                    </span>
                                    <h5 className="card-title">
                                        Next {market.position} of {market.country}
                                    </h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Created: {new Date(market.timestampCreated).toDateString()}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">Expiry: {new Date(market.timestampExpiry).toDateString()}</h6>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => {
                                            this.props.updateParentDisplay("MarketDetails");
                                            this.props.updateParentState("market_id", market._id);
                                        }}
                                    >
                                        Go to Market
                                    </button>
                                </div>
                            </div>
                            {(function () {
                                let renderArray = [];
                                for (let politicianEntry of market.politicians) {
                                    let yesTokens = politicianEntry.yes;
                                    let noTokens = politicianEntry.no;
                                    let yesPrice = noTokens / (yesTokens + noTokens);
                                    let noPrice = yesTokens / (yesTokens + noTokens);
                                    globalVolume += politicianEntry.volume;
                                    globalLiquidity += yesPrice * yesTokens * 2;
                                    renderArray.push(
                                        <div className="border-bottom d-flex align-items-center justify-content-between" key={politicianEntry.politician}>
                                            <span className="card-text me-auto">{politicianEntry.politician}</span>
                                            <span className="text-success me-2">Yes: {(yesPrice * 100).toFixed(0)}¢</span>
                                            <span className="text-danger">No: {(noPrice * 100).toFixed(0)}¢</span>
                                        </div>
                                    );
                                }
                                return renderArray;
                            })()}
                            <div className="mt-2 d-flex align-items-center">
                                <i className="fa-solid fa-chart-column text-muted tooltipHTML">
                                    <span className="tooltiptextHTML">Volume</span>
                                </i>
                                <span className="card-text text-muted">&nbsp;${globalVolume.toFixed(2)}&nbsp;</span>
                                <i className="fa-solid fa-water text-muted ms-3 tooltipHTML">
                                    <span className="tooltiptextHTML">Liquidity</span>
                                </i>
                                <span className="card-text text-muted">&nbsp;${globalLiquidity.toFixed(2)}&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
        return renderArray;
    }

    async componentDidMount() {
        let response = await axios.get(API_URL + "/open_markets");
        this.setState({
            openMarkets: response.data.openMarkets,
        });
    }

    render() {
        return (
            <>
                {/* Carousel  */}
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item position-relative active">
                            <img src="https://http.cat/400" className="d-block w-100" alt="Meaningful Text"></img>
                            <div className="position-absolute top-50 start-50 translate-middle text-center w-100" style={{ background: "rgba(0, 0, 0, 0.65)", color: "rgba(247,147,26)" }}>
                                <h1>Laissez Faire</h1>
                                <p>'let the people do'</p>
                                <h5>Binary Political Prediction Markets</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://http.cat/102" className="d-block w-100" alt="Meaningful Text"></img>
                        </div>
                        <div className="carousel-item">
                            <img src="https://http.cat/100" className="d-block w-100" alt="Meaningful Text"></img>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                {/* Search Engine */}
                <div className="mt-4 text-center">
                    <h1>Prediction Markets</h1>
                </div>
                <div className="d-flex justify-content-center mt-4 mb-4">
                    <div className="btn-group">
                        <button className="shadow-none btn btn-secondary d-flex align-items-center" type="button" id="dropdownMenuClickableOutside" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                            <i className="fa-solid fa-filter"></i> <span>&nbsp;Filter</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <span className="dropdown-item disabled">Sort By</span>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={1}
                                        checked={this.state.sortOptions === 1}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="sortOptions"
                                        id="sortOptions1"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="sortOptions1">
                                        Expiry Date
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={2}
                                        checked={this.state.sortOptions === 2}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="sortOptions"
                                        id="sortOptions1"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="sortOptions1">
                                        Creation Date
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={3}
                                        checked={this.state.sortOptions === 3}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="sortOptions"
                                        id="sortOptions2"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="sortOptions2">
                                        Volume
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={4}
                                        checked={this.state.sortOptions === 4}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="sortOptions"
                                        id="sortOptions3"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="sortOptions3">
                                        Liquidity
                                    </label>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Ascending/Descending</span>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={1}
                                        checked={this.state.ascendDescend === 1}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="ascendDescend"
                                        id="ascendDescend1"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="ascendDescend1">
                                        Descending
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={2}
                                        checked={this.state.ascendDescend === 2}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="ascendDescend"
                                        id="ascendDescend2"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="ascendDescend2">
                                        Ascending
                                    </label>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Show/Hide</span>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={1}
                                        checked={this.state.marketType.includes(1)}
                                        onChange={(evt) => {
                                            this.updateCheckboxNumber(evt);
                                        }}
                                        type="checkbox"
                                        id="marketType"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType">
                                        Open Markets
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={2}
                                        checked={this.state.marketType.includes(2)}
                                        onChange={(evt) => {
                                            this.updateCheckboxNumber(evt);
                                        }}
                                        type="checkbox"
                                        id="marketType"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType">
                                        Resolving Markets
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="form-check">
                                    <input
                                        className="shadow-none form-check-input ms-1"
                                        value={3}
                                        checked={this.state.marketType.includes(3)}
                                        onChange={(evt) => {
                                            this.updateCheckboxNumber(evt);
                                        }}
                                        type="checkbox"
                                        id="marketType"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType">
                                        Closed Markets
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <input
                        className="form-control shadow-none"
                        type="search"
                        placeholder="Search"
                        value={this.state.search}
                        onChange={(evt) => {
                            this.updateFormFieldString(evt);
                        }}
                        name="search"
                    ></input>
                </div>

                {/* Cards  */}
                {this.renderOpenMarkets()}
            </>
        );
    }
}
