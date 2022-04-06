import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class AdminPanel extends React.Component {
    state = {
        openMarkets: [],
        selected: "",
    };

    renderMarkets = () => {
        let renderArray = [];

        for (let item of this.state.openMarkets) {
            if (item.timestampExpiry <= new Date().getTime() && item.type === "open") {
                renderArray.push(
                    <tr key={item._id}>
                        <td>{item.position}</td>
                        <td>{item.country}</td>
                        <td>{new Date(item.timestampExpiry).toLocaleString()}</td>
                        <td>
                            <button
                                type="button"
                                className="me-3 btn btn-success"
                                onClick={() => {
                                    this.setState({
                                        selected: "YES",
                                    });
                                }}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="me-3 btn btn-danger"
                                onClick={() => {
                                    this.setState({
                                        selected: "NO",
                                    });
                                }}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                className={"me-3 btn btn-secondary"}
                                style={{ display: this.state.selected ? "inline-block" : "none" }}
                                onClick={() => {
                                    //Fire the resolution process
                                    this.setState({
                                        selected: false,
                                    });
                                }}
                            >
                                Confirm the selection?
                            </button>
                            <button
                                type="button"
                                className={"btn btn-secondary"}
                                style={{ display: this.state.selected ? "inline-block" : "none" }}
                                onClick={() => {
                                    //Fire the resolution process
                                    this.setState({
                                        selected: false,
                                    });
                                }}
                            >
                                Cancel
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
                <h1 className="ms-2 mt-3">Expired markets waiting for resolution</h1>
                <table className="table table-striped w-100 text-center">
                    <thead>
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Country</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Resolve</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderMarkets()}</tbody>
                </table>
            </>
        );
    }
}
