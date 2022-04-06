import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class AdminPanel extends React.Component {
    state = {
        openMarkets: [],
        //maximum of 20 markets (i hope)
        selected: ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
        updateIndex: 0,
        updatePosition: "",
        updateCountry: "",
        updateExpiry: "04/04/1990",
        updateMarketId: "",
    };

    submitResolution = async (e) => {
        console.log(e.target.name);
        console.log(this.state.selected.slice(0, e.target.value));
        await axios.delete(API_URL + "/open_markets/" + e.target.name, {
            data: {
                resolutionArray: this.state.selected.slice(0, e.target.value),
            },
        });
    };

    renderExistingMarkets = () => {
        let renderArray = [];
        for (const [index, item] of this.state.openMarkets.entries()) {
            if (item.type === "open") {
                if (index === this.state.updateIndex) {
                    renderArray.push(
                        <tr key={item._id}>
                            <td>
                                <input type="text" value={this.state.updatePosition}></input>
                            </td>
                            <td>
                                <input type="text" value={this.state.updateCountry}></input>
                            </td>
                            <td>
                                <input type="date" value={this.state.updateExpiry}></input>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-success ms-4"
                                    onClick={() => {
                                        this.setState({
                                            updateIndex: Number(index),
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
                                            updateIndex: 0,
                                            updatePosition: "",
                                            updateCountry: "",
                                            updateExpiry: "",
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
                                            updateExpiry: new Date(item.timestampExpiry),
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

    async componentDidMount() {
        let queryParams = {
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
        };

        let response1 = await axios.get(API_URL + "/open_markets", {
            params: queryParams,
        });
        this.setState({
            openMarkets: response1.data.openMarkets,
        });
    }

    render() {
        return (
            <>
                <h1 className="ms-2 mt-3">Edit existing markets</h1>
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
                <h1 className="ms-2 mt-3">Expired markets waiting for resolution + deletion</h1>
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
            </>
        );
    }
}
