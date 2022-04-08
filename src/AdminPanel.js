import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://project-2-express.herokuapp.com";

export default class AdminPanel extends React.Component {
    state = {
        openMarkets: [],
        //maximum of 20 markets (i hope)
        selected: ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
        updateIndex: -1,
        updatePosition: "",
        updateCountry: "",
        updateExpiry: "",
        updateMarketId: "",
        countryList: [],
        positionList: [],
        country: "Country",
        position: "Position",
        addNewCountry: "",
        addNewPosition: "",
        updateIndividualCountry: "",
        updateIndividualPosition: "",
        editCountryFlag: false,
        addNewCountryFlag: false,
        deleteCountryFlag: false,
        editPositionFlag: false,
        addNewPositionFlag: false,
        deletePositionFlag: false,
        warningMessage1: "",
        successMessage1: false,
        warningMessage2: "",
        successMessage2: false,
    };

    updateFormField = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    };

    submitResolution = async (e) => {
        await axios.delete(API_URL + "/open_markets/" + e.target.name, {
            data: {
                resolutionArray: this.state.selected.slice(0, e.target.value),
            },
        });
        this.updateState();
    };

    submitUpdate = async () => {
        await axios.put(API_URL + "/open_markets/" + this.state.updateMarketId, {
            updatePosition: this.state.updatePosition,
            updateCountry: this.state.updateCountry,
            updateExpiry: new Date(this.state.updateExpiry).getTime(),
        });
        this.updateState();
    };

    submitNewCountry = async () => {
        try {
            await axios.post(API_URL + "/country", {
                country: this.state.addNewCountry,
            });
            this.setState({
                successMessage1: true,
                editCountryFlag: false,
                addNewCountryFlag: false,
                deleteCountryFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage1: error.response.data.message,
            });
        }
    };

    submitEditCountry = async () => {
        try {
            console.log("Put", this.state.country, this.state.updateIndividualCountry);

            await axios.put(API_URL + "/country/" + this.state.country, {
                country: this.state.updateIndividualCountry,
            });
            this.setState({
                successMessage1: true,
                country: this.state.updateIndividualCountry,
                editCountryFlag: false,
                addNewCountryFlag: false,
                deleteCountryFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage1: error.response.data.message,
            });
        }
    };

    submitDeleteCountry = async () => {
        try {
            console.log("Deletion", this.state.country);
            await axios.delete(API_URL + "/country/" + this.state.country);
            this.setState({
                successMessage1: true,
                country: "Country",
                editCountryFlag: false,
                addNewCountryFlag: false,
                deleteCountryFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage1: error.response.data.message,
            });
        }
    };

    submitNewPosition = async () => {
        try {
            console.log(this.state.addNewPosition);
            await axios.post(API_URL + "/position", {
                position: this.state.addNewPosition,
            });
            this.setState({
                successMessage2: true,
                editPositionFlag: false,
                addNewPositionFlag: false,
                deletePositionFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage2: error.response.data.message,
            });
        }
    };

    submitEditPosition = async () => {
        try {
            console.log("Put", this.state.position, this.state.updateIndividualPosition);

            await axios.put(API_URL + "/position/" + this.state.position, {
                position: this.state.updateIndividualPosition,
            });
            this.setState({
                successMessage2: true,
                position: this.state.updateIndividualPosition,
                editPositionFlag: false,
                addNewPositionFlag: false,
                deletePositionFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage2: error.response.data.message,
            });
        }
    };

    submitDeletePosition = async () => {
        try {
            console.log("Deletion", this.state.position);
            await axios.delete(API_URL + "/position/" + this.state.position);
            this.setState({
                successMessage2: true,
                position: "Position",
                editPositionFlag: false,
                addNewPositionFlag: false,
                deletePositionFlag: false,
            });
            this.updateState();
        } catch (error) {
            this.setState({
                warningMessage2: error.response.data.message,
            });
        }
    };

    renderExistingMarkets = () => {
        let renderArray = [];
        for (const [index, item] of this.state.openMarkets.entries()) {
            if (item.type === "open") {
                if (index === this.state.updateIndex) {
                    renderArray.push(
                        <tr key={item._id}>
                            <td>
                                <input type="text" value={this.state.updatePosition} name="updatePosition" onChange={this.updateFormField}></input>
                            </td>
                            <td>
                                <input type="text" value={this.state.updateCountry} name="updateCountry" onChange={this.updateFormField}></input>
                            </td>
                            <td>
                                <input type="date" value={this.state.updateExpiry} name="updateExpiry" onChange={this.updateFormField}></input>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-success ms-4"
                                    onClick={() => {
                                        this.submitUpdate();
                                        this.setState({
                                            updateIndex: -1,
                                            updatePosition: "",
                                            updateCountry: "",
                                            updateExpiry: "",
                                            updateMarketId: "",
                                        });
                                    }}
                                >
                                    Confirm Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger ms-4"
                                    onClick={() => {
                                        this.setState({
                                            updateIndex: -1,
                                            updatePosition: "",
                                            updateCountry: "",
                                            updateExpiry: "",
                                            updateMarketId: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    );
                } else {
                    renderArray.push(
                        <tr key={item._id}>
                            <td>{item.position}</td>
                            <td>{item.country}</td>
                            <td>{new Date(item.timestampExpiry).toLocaleString()}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-success ms-4"
                                    onClick={() => {
                                        this.setState({
                                            updateIndex: Number(index),
                                            updatePosition: item.position,
                                            updateCountry: item.country,
                                            updateExpiry: new Date(item.timestampExpiry).toISOString().split("T")[0],
                                            updateMarketId: item._id,
                                        });
                                    }}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    );
                }
            }
        }
        return renderArray;
    };

    renderResolutionMarkets = () => {
        let renderArray = [];

        for (let item of this.state.openMarkets) {
            if (item.timestampExpiry <= new Date().getTime() && item.type === "open") {
                for (const [v, i] of item.politicians.entries()) {
                    renderArray.push(
                        <tr key={item._id + i.politician}>
                            <td>{item.position}</td>
                            <td>{item.country}</td>
                            <td>{i.politician}</td>
                            <td>{new Date(item.timestampExpiry).toLocaleString()}</td>
                            <td>
                                <select
                                    className="form-select form-select-sm mb-2"
                                    value={this.state.selected[v]}
                                    name={v}
                                    onChange={(e) => {
                                        let temp = this.state.selected;
                                        temp[e.target.name] = e.target.value;
                                        this.setState({
                                            selected: temp,
                                        });
                                    }}
                                >
                                    <option value={"yes"}>Yes</option>
                                    <option value={"no"}>No</option>
                                </select>
                            </td>
                        </tr>
                    );
                }
                renderArray.push(
                    <tr key={item._id + 1}>
                        <td>
                            <button type="button" className="btn btn-success ms-4" name={item._id} value={item.politicians.length} onClick={this.submitResolution}>
                                Confirm Submit
                            </button>
                        </td>
                    </tr>
                );
            }
        }
        return renderArray;
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

    async componentDidMount() {
        let queryParams = {
            sortOptions: 0,
            ascendDescend: 0,
            marketType: this.state.marketType,
            search: this.state.search,
            expiryDateGreater: new Date(this.state.expiryDateGreater).getTime(),
            expiryDateLesser: new Date(this.state.expiryDateLesser).getTime(),
            creationDateGreater: new Date(this.state.creationDateGreater).getTime(),
            creationDateLesser: new Date(this.state.creationDateLesser).getTime(),
            volumeGreater: this.state.volumeGreater,
            volumeLesser: this.state.volumeLesser,
        };

        let response1 = await axios.get(API_URL + "/open_markets", {
            params: queryParams,
        });
        this.setState({
            openMarkets: response1.data.openMarkets,
        });

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

    async updateState() {
        let queryParams = {
            sortOptions: 0,
            ascendDescend: 0,
            marketType: this.state.marketType,
            search: this.state.search,
            expiryDateGreater: new Date(this.state.expiryDateGreater).getTime(),
            expiryDateLesser: new Date(this.state.expiryDateLesser).getTime(),
            creationDateGreater: new Date(this.state.creationDateGreater).getTime(),
            creationDateLesser: new Date(this.state.creationDateLesser).getTime(),
            volumeGreater: this.state.volumeGreater,
            volumeLesser: this.state.volumeLesser,
        };

        let response1 = await axios.get(API_URL + "/open_markets", {
            params: queryParams,
        });
        this.setState({
            openMarkets: response1.data.openMarkets,
        });

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

    render() {
        return (
            <>
                <h1 className="ms-2 mt-5">Edit Existing Markets</h1>
                <table className="table table-striped w-100 text-center">
                    <thead>
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Country</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderExistingMarkets()}</tbody>
                </table>
                <h1 className="ms-2 mt-5">Expired Markets Waiting for Resolution and Deletion</h1>
                <div>
                    <table className="table table-striped w-100 text-center">
                        <thead>
                            <tr>
                                <th scope="col">Position</th>
                                <th scope="col">Country</th>
                                <th scope="col">Politician</th>
                                <th scope="col">Expiry</th>
                                <th scope="col">Resolution Option</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderResolutionMarkets()}</tbody>
                    </table>
                    <h1 className="ms-2 mt-5">Add/Edit/Delete List of Countries</h1>
                    <select
                        className="form-select"
                        name="country"
                        onChange={(e) => {
                            this.updateFormField(e);
                            this.setState({
                                updateIndividualCountry: e.target.value,
                            });
                        }}
                        value={this.state.country}
                    >
                        {this.renderCountryDropdown()}
                    </select>
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMessage1 ? "block" : "none" }}>
                        <strong>{this.state.warningMessage1}</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                this.setState({
                                    warningMessage1: "",
                                    successMessage1: false,
                                });
                            }}
                        ></button>
                    </div>
                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successMessage1 ? "block" : "none" }}>
                        <strong>Your request has been successfully processed.</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                this.setState({
                                    warningMessage1: "",
                                    successMessage1: false,
                                });
                            }}
                        ></button>
                    </div>
                    <div className="d-flex mt-1 align-items-center">
                        <button
                            type="button"
                            className={"btn btn-success mt-1 me-4 " + (this.state.addNewCountryFlag ? "d-none" : "")}
                            onClick={() => {
                                this.setState({
                                    addNewCountryFlag: true,
                                });
                            }}
                        >
                            Add New
                        </button>
                        <div className={this.state.addNewCountryFlag ? "" : "d-none"}>
                            <input className="me-2 mt-1" type="text" value={this.state.addNewCountry} name="addNewCountry" onChange={this.updateFormField} />
                            <button type="button" className="btn btn-success me-2" onClick={this.submitNewCountry}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    this.setState({
                                        editCountryFlag: false,
                                        addNewCountryFlag: false,
                                        deleteCountryFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            disabled={this.state.country === "Country"}
                            className={"btn btn-success mt-1 me-4 " + (this.state.editCountryFlag ? "d-none" : "")}
                            onClick={() => {
                                this.setState({
                                    editCountryFlag: true,
                                });
                            }}
                        >
                            Edit
                        </button>
                        <div className={this.state.editCountryFlag ? "" : "d-none"}>
                            <input className="me-2 mt-1" type="text" value={this.state.updateIndividualCountry} name="updateIndividualCountry" onChange={this.updateFormField} />
                            <button type="button" className="btn btn-success me-2" onClick={this.submitEditCountry}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => {
                                    this.setState({
                                        editCountryFlag: false,
                                        addNewCountryFlag: false,
                                        deleteCountryFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className={"btn btn-danger mt-1 " + (this.state.deleteCountryFlag ? "d-none" : "")}
                            disabled={this.state.country === "Country"}
                            onClick={() => {
                                this.setState({ deleteCountryFlag: true });
                            }}
                        >
                            Delete
                        </button>
                        <div className={this.state.deleteCountryFlag ? "" : "d-none"}>
                            <button type="button" className="btn btn-success me-2 mt-1" onClick={this.submitDeleteCountry}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => {
                                    this.setState({
                                        editCountryFlag: false,
                                        addNewCountryFlag: false,
                                        deleteCountryFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <h1 className="ms-2 mt-5">Add/Edit/Delete List of Positions</h1>
                <div>
                    <select
                        className="form-select"
                        name="position"
                        onChange={(e) => {
                            this.updateFormField(e);
                            this.setState({
                                updateIndividualPosition: e.target.value,
                            });
                        }}
                        value={this.state.position}
                    >
                        {this.renderPositionDropdown()}
                    </select>

                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMessage2 ? "block" : "none" }}>
                        <strong>{this.state.warningMessage2}</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                this.setState({
                                    warningMessage2: "",
                                    successMessage2: false,
                                });
                            }}
                        ></button>
                    </div>
                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.successMessage2 ? "block" : "none" }}>
                        <strong>Your request has been successfully processed.</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                this.setState({
                                    warningMessage2: "",
                                    successMessage2: false,
                                });
                            }}
                        ></button>
                    </div>

                    <div className="d-flex mt-1 align-items-center">
                        <button
                            type="button"
                            className={"btn btn-success mt-1 me-4 " + (this.state.addNewPositionFlag ? "d-none" : "")}
                            onClick={() => {
                                this.setState({
                                    addNewPositionFlag: true,
                                });
                            }}
                        >
                            Add New
                        </button>
                        <div className={this.state.addNewPositionFlag ? "" : "d-none"}>
                            <input className="me-2 mt-1" type="text" value={this.state.addNewPosition} name="addNewPosition" onChange={this.updateFormField} />
                            <button type="button" className="btn btn-success me-2" onClick={this.submitNewPosition}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    this.setState({
                                        editPositionFlag: false,
                                        addNewPositionFlag: false,
                                        deletePositionFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            disabled={this.state.position === "Position"}
                            className={"btn btn-success mt-1 me-4 " + (this.state.editPositionFlag ? "d-none" : "")}
                            onClick={() => {
                                this.setState({
                                    editPositionFlag: true,
                                });
                            }}
                        >
                            Edit
                        </button>
                        <div className={this.state.editPositionFlag ? "" : "d-none"}>
                            <input className="me-2 mt-1" type="text" value={this.state.updateIndividualPosition} name="updateIndividualPosition" onChange={this.updateFormField} />
                            <button type="button" className="btn btn-success me-2" onClick={this.submitEditPosition}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => {
                                    this.setState({
                                        editPositionFlag: false,
                                        addNewPositionFlag: false,
                                        deletePositionFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className={"btn btn-danger mt-1 " + (this.state.deletePositionFlag ? "d-none" : "")}
                            disabled={this.state.position === "Position"}
                            onClick={() => {
                                this.setState({ deletePositionFlag: true });
                            }}
                        >
                            Delete
                        </button>
                        <div className={this.state.deletePositionFlag ? "" : "d-none"}>
                            <button type="button" className="btn btn-success me-2 mt-1" onClick={this.submitDeletePosition}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => {
                                    this.setState({
                                        editPositionFlag: false,
                                        addNewPositionFlag: false,
                                        deletePositionFlag: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
