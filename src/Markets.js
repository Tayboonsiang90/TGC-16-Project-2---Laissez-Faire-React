import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Markets extends React.Component {
    state = {
        openMarkets: [],
        resolvingMarkets: [{}, {}],
        closedMarkets: [{}, {}],
        sortOptions: 0, //0. Expiry Date, 1. Creation Date, 2. Volume, 3. Liquidity
        expiryDateGreater: 0,
        expiryDateLesser: 0,
        creationDateGreater: 0,
        creationDateLesser: 0,
        volumeGreater: 0,
        volumeLesser: 0,
        liquidityGreater: 0,
        liquidityLesser: 0,
        ascendDescend: 0, //0. Descending, 1. Ascending
        marketType: [0, 1, 2], //0,1,2 (Open, Resolving, Closed)
        search: "",
    };

    updateFormFieldString = (evt) => {
        this.setState(
            {
                [evt.target.name]: evt.target.value,
            },
            () => {
                this.updateStateMarkets();
            }
        );
    };

    updateFormFieldNumber = (evt) => {
        this.setState(
            {
                [evt.target.name]: Number(evt.target.value),
            },
            () => {
                this.updateStateMarkets();
            }
        );
    };

    updateCheckboxNumber = (evt) => {
        let checkedNumber = Number(evt.target.value);
        //Case 1, already inside, unchecked
        if (this.state.marketType.includes(checkedNumber)) {
            let indexToRemove = this.state.marketType.findIndex((eachMarketType) => {
                return eachMarketType === checkedNumber;
            });
            this.setState(
                {
                    marketType: [...this.state.marketType.slice(0, indexToRemove), ...this.state.marketType.slice(indexToRemove + 1)],
                },
                () => {
                    this.updateStateMarkets();
                }
            );
        } //Case 2, not inside, checked
        else {
            this.setState(
                {
                    marketType: [...this.state.marketType, checkedNumber],
                },
                () => {
                    this.updateStateMarkets();
                }
            );
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
        let response = await axios.get(API_URL + "/open_markets", {
            params: {
                sortOptions: this.state.sortOptions,
                ascendDescend: this.state.ascendDescend,
                marketType: this.state.marketType,
                search: this.state.search,
            },
        });
        this.setState({
            openMarkets: response.data.openMarkets,
        });
    }

    updateStateMarkets = async () => {
        let response = await axios.get(API_URL + "/open_markets", {
            params: {
                sortOptions: this.state.sortOptions,
                ascendDescend: this.state.ascendDescend,
                marketType: this.state.marketType,
                search: this.state.search,
            },
        });
        this.setState({
            openMarkets: response.data.openMarkets,
        });
    };

    render() {
        return (
            <>
                {/* Carousel */}
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
                                        value={0}
                                        checked={this.state.sortOptions === 0}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="sortOptions"
                                        id="sortOptions0"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="sortOptions0">
                                        Expiry Date
                                    </label>
                                </div>
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
                                        Creation Date
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
                                        value={3}
                                        checked={this.state.sortOptions === 3}
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
                                        value={0}
                                        checked={this.state.ascendDescend === 0}
                                        onChange={(evt) => {
                                            this.updateFormFieldNumber(evt);
                                        }}
                                        type="radio"
                                        name="ascendDescend"
                                        id="ascendDescend1"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="ascendDescend1">
                                        Ascending
                                    </label>
                                </div>
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
                                        id="ascendDescend2"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="ascendDescend2">
                                        Descending
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
                                        value={0}
                                        checked={this.state.marketType.includes(0)}
                                        onChange={(evt) => {
                                            this.updateCheckboxNumber(evt);
                                        }}
                                        type="checkbox"
                                        id="marketType0"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType0">
                                        Open Markets
                                    </label>
                                </div>
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
                                        id="marketType1"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType1">
                                        Resolving Markets
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
                                        id="marketType2"
                                    ></input>
                                    <label className="form-check-label ms-1" htmlFor="marketType2">
                                        Closed Markets
                                    </label>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Filter By Expiry Date</span>
                                {/* Filters */}
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-greater-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="date"
                                        value={this.state.expiryDateGreater}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="expiryDateGreater"
                                    ></input>
                                </div>
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-less-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="date"
                                        value={this.state.expiryDateLesser}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="expiryDateLesser"
                                    ></input>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Filter By Creation Date</span>
                                {/* Filters */}
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-greater-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="date"
                                        value={this.state.creationDateGreater}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="creationDateGreater"
                                    ></input>
                                </div>
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-less-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="date"
                                        value={this.state.creationDateLesser}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="creationDateLesser"
                                    ></input>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Filter By Volume</span>
                                {/* Filters */}
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-greater-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="number"
                                        value={this.state.volumeGreater}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="volumeGreater"
                                    ></input>
                                </div>
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-less-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="number"
                                        value={this.state.volumeLesser}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="volumeLesser"
                                    ></input>
                                </div>
                            </li>
                            <li>
                                <span className="dropdown-item disabled">Filter By Liquidity</span>
                                {/* Filters */}
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-greater-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="number"
                                        value={this.state.liquidityGreater}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="liquidityGreater"
                                    ></input>
                                </div>
                                <div className="d-flex form-check align-items-center">
                                    <i className="fa-solid fa-less-than-equal me-2"></i>
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="number"
                                        value={this.state.liquidityLesser}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="liquidityLesser"
                                    ></input>
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
