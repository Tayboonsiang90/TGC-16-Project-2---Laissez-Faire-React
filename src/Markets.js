import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Markets extends React.Component {
    state = {
        countryList: [],
        positionList: [],
        openMarkets: [],
        resolvingMarkets: [{}, {}],
        closedMarkets: [{}, {}],
        sortOptions: 0, //0. Expiry Date, 1. Creation Date, 2. Volume
        expiryDateGreater: "",
        expiryDateLesser: "",
        creationDateGreater: "",
        creationDateLesser: "",
        volumeGreater: 0,
        volumeLesser: 0,
        ascendDescend: 0, //0. Descending, 1. Ascending
        marketType: [0, 1, 2], //0,1,2 (Open, Resolving, Closed)
        search: "",
        createMarketCountry: "Country",
        createMarketPosition: "Position",
        createMarketExpiry: "",
        createMarketDescription: "",
        createMarketPeople: [],
        createMarketPeopleField: "",
        successCreateMessage: false,
        warningCreateMessage: "",
    };

    //Because windows refuses to support political flags, have to use a png. to replace emojis
    flagemojiToPNG = (flag) => {
        var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
            .map((char) => String.fromCharCode(char - 127397).toLowerCase())
            .join("");
        return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />;
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

    submitCreation = async () => {
        try {
            await axios.post(API_URL + "/open_markets", {
                position: this.state.createMarketPosition,
                country: this.state.createMarketCountry,
                description: this.state.createMarketDescription,
                politicians: this.state.createMarketPeople,
                timestampExpiry: new Date(this.state.createMarketExpiry).getTime(),
            });

            this.setState({
                successCreateMessage: true,
            });
        } catch (error) {
            this.setState({
                warningCreateMessage: error.response.data.message,
            });
        }
    };

    renderCountryDropdown() {
        let renderArray = [
            <option key="country" disabled>
                Country
            </option>,
        ];
        for (let item of this.state.countryList) {
            renderArray.push(
                <option key={item} value={item}>
                    {item}
                </option>
            );
        }
        return renderArray;
    }

    renderPositionDropdown() {
        let renderArray = [
            <option key="position" disabled>
                Position
            </option>,
        ];
        for (let item of this.state.positionList) {
            renderArray.push(
                <option key={item} value={item}>
                    {item}
                </option>
            );
        }
        return renderArray;
    }

    renderOpenMarkets() {
        let renderArray = [];
        for (let market of this.state.openMarkets) {
            let globalVolume = 0;
            let globalLiquidity = 0;
            renderArray.push(
                <React.Fragment key={market._id}>
                    <div className="col-12 align-items-stretch col-lg-6 col-xl-4">
                        <div className="card mb-3" style={market.timestampExpiry <= new Date().getTime() ? { backgroundColor: "#ffffe6" } : { backgroundColor: "#e6ffe6" }}>
                            <div className="card-body  d-flex flex-column justify-content-between" style={{ minHeight: "300px" }}>
                                <div className="">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <span>
                                                <i className="fa-solid fa-check-to-slot"></i>
                                            </span>
                                            <h5 className="card-title">
                                                {market.position} of {market.country} {this.flagemojiToPNG(String.fromCodePoint("0x" + market.countryDetails[0].unicode1) + String.fromCodePoint("0x" + market.countryDetails[0].unicode2))}
                                            </h5>
                                            <h6 className="card-subtitle mb-2 text-muted">Created: {new Date(market.timestampCreated).toDateString()}</h6>
                                            <h6 className="card-subtitle mb-2 text-muted">Expiry: {new Date(market.timestampExpiry).toDateString()}</h6>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-success ms-4"
                                                onClick={() => {
                                                    this.props.updateParentDisplay("MarketDetails");
                                                    this.props.updateParentState("market_id", market._id);
                                                }}
                                            >
                                                Trade
                                            </button>
                                        </div>
                                    </div>
                                    {(function () {
                                        let renderArray = [];
                                        let count = 0;
                                        for (let politicianEntry of market.politicians) {
                                            if (count < 3) {
                                                count++;
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
                                            } else {
                                                renderArray.push(
                                                    <div className="border-bottom d-flex align-items-center justify-content-between" key="more">
                                                        <span className="card-text me-auto text-muted">+ {market.politicians.length - 3} more</span>
                                                    </div>
                                                );
                                                break;
                                            }
                                        }
                                        return renderArray;
                                    })()}
                                </div>
                                <div className="mt-2 d-flex align-items-center ">
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
                    </div>
                </React.Fragment>
            );
        }
        return renderArray;
    }

    renderNewMarket() {
        return (
            <React.Fragment>
                <div className="col-12 align-items-stretch col-lg-6 col-xl-4">
                    <div className="card mb-3">
                        <div className="card-body" style={{ minHeight: "300px" }}>
                            <div className=" d-flex align-items-center justify-content-between">
                                <div className=" col-9">
                                    <h3 className="card-title">Create Your Own Market</h3>
                                    <div className="d-flex align-items-center">
                                        <select className="form-select form-select-sm mb-2" name="createMarketPosition" onChange={this.updateFormFieldString} value={this.state.createMarketPosition}>
                                            {this.renderPositionDropdown()}
                                        </select>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <select className="form-select form-select-sm mb-2" name="createMarketCountry" onChange={this.updateFormFieldString} value={this.state.createMarketCountry}>
                                            {this.renderCountryDropdown()}
                                        </select>
                                    </div>
                                    <div className="d-flex align-items-center input-group-sm mb-2">
                                        <h6 className="card-subtitle text-muted">Expiry&nbsp;Date:&nbsp;</h6>
                                        <input
                                            className="form-control shadow-none"
                                            type="date"
                                            value={this.state.createMarketExpiry}
                                            onChange={(evt) => {
                                                this.updateFormFieldString(evt);
                                            }}
                                            name="createMarketExpiry"
                                        ></input>
                                    </div>
                                </div>
                                <div className="">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!this.state.createMarketPeople.length || this.state.createMarketCountry === "Country" || this.state.createMarketPosition === "Position" || !this.state.createMarketExpiry}
                                        data-bs-toggle="modal"
                                        data-bs-target="#createModal"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                            {/* Confirmation modal  */}
                            <div className="modal fade" id="createModal" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Please fill in the details of the market and confirm.</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                onClick={() => {
                                                    this.setState({ successCreateMessage: false, warningCreateMessage: "" });
                                                }}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                                <strong>Opening Promotion: </strong>
                                                All markets created will be seeded with an initial liquidity of $2000 per politician for free at a 50:50 ratio.
                                                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                            </div>
                                            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successCreateMessage ? "block" : "none" }}>
                                                <strong>The prediction market has been successfully created! </strong>
                                                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                            </div>
                                            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningCreateMessage ? "block" : "none" }}>
                                                <strong>{this.state.warningCreateMessage}</strong>
                                                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                            </div>
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Political Position </td>
                                                        <td>{this.state.createMarketPosition}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Country </td>
                                                        <td>{this.state.createMarketCountry}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Expiry Date </td>
                                                        <td>{this.state.createMarketExpiry}</td>
                                                    </tr>
                                                    {(() => {
                                                        let renderArray = [];
                                                        let count = 0;
                                                        for (let i of this.state.createMarketPeople) {
                                                            count++;
                                                            renderArray.push(
                                                                <tr key={count}>
                                                                    <td>Contenders </td>
                                                                    <td>
                                                                        {count}. {i}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                        return renderArray;
                                                    })()}
                                                    <tr>
                                                        <td>Description</td>
                                                        <td>
                                                            <div className="input-group">
                                                                <textarea
                                                                    style={{ minHeight: "300px" }}
                                                                    className="form-control"
                                                                    placeholder={`The contract that resolves to Yes shall be that which identifies the ${this.state.createMarketPosition} of the ${this.state.createMarketCountry} upon the Expiry Date listed.`}
                                                                    value={this.state.createMarketDescription}
                                                                    name="createMarketDescription"
                                                                    onChange={(evt) => {
                                                                        this.updateFormFieldString(evt);
                                                                    }}
                                                                ></textarea>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" onClick={this.submitCreation} className="btn btn-success">
                                                Create Prediction Market
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                data-bs-dismiss="modal"
                                                onClick={() => {
                                                    this.setState({ successCreateMessage: false, warningCreateMessage: "" });
                                                }}
                                            >
                                                Exit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Politicians List  */}
                            <div className="border-bottom border-top d-flex align-items-center flex-row">
                                <span className="card-text me-auto">Politicians</span>
                            </div>
                            {(() => {
                                let renderArray = [];
                                let count = 0;
                                for (let i of this.state.createMarketPeople) {
                                    count++;
                                    renderArray.push(
                                        <div className="border-bottom d-flex align-items-center justify-content-between" key={count}>
                                            <span className="card-text me-auto">
                                                {count} : {i}
                                            </span>
                                        </div>
                                    );
                                }
                                return renderArray;
                            })()}
                            <div className="d-flex flex-row align-items-center">
                                <span className="card-text me-auto input-group-sm">
                                    <input
                                        className="form-control shadow-none me-2"
                                        type="text"
                                        placeholder="Add new politician name"
                                        value={this.state.createMarketPeopleField}
                                        onChange={(evt) => {
                                            this.updateFormFieldString(evt);
                                        }}
                                        name="createMarketPeopleField"
                                    ></input>
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={!this.state.createMarketPeopleField}
                                    onClick={(evt) => {
                                        this.setState({ createMarketPeople: [...this.state.createMarketPeople, this.state.createMarketPeopleField], createMarketPeopleField: "" });
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    async componentDidMount() {
        let response1 = await axios.get(API_URL + "/open_markets", {
            params: {
                sortOptions: this.state.sortOptions,
                ascendDescend: this.state.ascendDescend,
                marketType: this.state.marketType,
                search: this.state.search,
                expiryDateGreater: new Date(this.state.expiryDateGreater).getTime(),
                expiryDateLesser: new Date(this.state.expiryDateLesser).getTime(),
                creationDateGreater: new Date(this.state.creationDateGreater).getTime(),
                creationDateLesser: new Date(this.state.creationDateLesser).getTime(),
                volumeGreater: this.state.volumeGreater,
                volumeLesser: this.state.volumeLesser,
            },
        });
        this.setState({
            openMarkets: response1.data.openMarkets,
        });

        // Country list
        let response2 = await axios.get(API_URL + "/country");
        this.setState({
            countryList: response2.data.countryArray,
        });
        // Position list
        let response3 = await axios.get(API_URL + "/position");
        this.setState({
            positionList: response3.data.positionArray,
        });
    }

    updateStateMarkets = async () => {
        let response = await axios.get(API_URL + "/open_markets", {
            params: {
                sortOptions: this.state.sortOptions,
                ascendDescend: this.state.ascendDescend,
                marketType: this.state.marketType,
                search: this.state.search,
                expiryDateGreater: new Date(this.state.expiryDateGreater).getTime(),
                expiryDateLesser: new Date(this.state.expiryDateLesser).getTime(),
                creationDateGreater: new Date(this.state.creationDateGreater).getTime(),
                creationDateLesser: new Date(this.state.creationDateLesser).getTime(),
                volumeGreater: this.state.volumeGreater,
                volumeLesser: this.state.volumeLesser,
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
                    <div className="carousel-inner " style={{ maxHeight: "400px" }}>
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
                                    <i className="fas fa-dollar-sign me-2"></i>
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
                                    <i className="fas fa-dollar-sign me-2"></i>
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
                        </ul>
                    </div>
                    <input
                        className="form-control shadow-none"
                        type="search"
                        placeholder="Search Prediction Markets"
                        value={this.state.search}
                        onChange={(evt) => {
                            this.updateFormFieldString(evt);
                        }}
                        name="search"
                    ></input>
                </div>

                {/* Cards  */}
                <div className="row">
                    {this.renderNewMarket()}
                    {this.renderOpenMarkets()}
                </div>
            </>
        );
    }
}
