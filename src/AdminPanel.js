import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class AdminPanel extends React.Component {
    state = {
        openMarkets: [],
        //maximum of 20 markets
        selected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    submitResolution = (e) => {};

    renderApprovalMarkets = () => {};

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
                                        temp[e.target.name] = Number(e.target.value);
                                        this.setState({
                                            selected: temp,
                                        });
                                    }}
                                >
                                    <option value={0}>Yes</option>
                                    <option value={1}>No</option>
                                </select>
                            </td>
                        </tr>
                    );
                }
                renderArray.push(
                    <tr key={item._id + 1}>
                        <td>
                            <button type="button" className="btn btn-success ms-4" name={item._id} onClick={this.submitResolution}>
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
                <h1 className="ms-2 mt-3">User Submitted Markets waiting for Approval or Rejection</h1>
                <table className="table table-striped w-100 text-center">
                    <thead>
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Country</th>
                            <th scope="col">Politician</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderApprovalMarkets()}</tbody>
                </table>
                <h1 className="ms-2 mt-3">Expired markets waiting for resolution</h1>
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
