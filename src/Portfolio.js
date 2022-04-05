import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Portfolio extends React.Component {
    state = {
        portfolio: [],
    };

    renderLeaderboard = () => {
        let renderArray = [];

        for (let item of this.state.portfolio) {
            let name = "";
            let total = 0;
            if (item.market) {
                for (let i of item.market_details[0].politicians) {
                    if (i.market_id === item.market_id) {
                        name = i.politician;
                        total = i.liquidityShares;
                    }
                }

                renderArray.push(
                    <tr key={item._id}>
                        <td>{item.market_details[0].position}</td>
                        <td>{item.market_details[0].country}</td>
                        <td>{name}</td>
                        <td>{new Date(item.market_details[0].timestampExpiry).toDateString()}</td>
                        <td>
                            {(item.yes || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </td>
                        <td>
                            {(item.no || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </td>
                        <td>
                            {((item.liquidityShares * 100) / total || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            %
                        </td>
                        <td>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    this.props.updateParentDisplay("MarketDetails");
                                    this.props.updateParentState("market_id", item.market_details[0]._id);
                                }}
                            >
                                Trade
                            </button>
                        </td>
                    </tr>
                );
            }
        }
        return renderArray;
    };

    async componentDidMount() {
        let response = await axios.get(API_URL + "/portfolio/" + this.props.userSessionDetails._id);

        this.setState({
            portfolio: response.data.balances,
        });
    }

    render() {
        return (
            <>
                <h1 className="ms-2 mt-3">Portfolio</h1>
                <table className="table table-striped w-100 text-center">
                    <thead>
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Country</th>
                            <th scope="col">Name</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Yes Tokens</th>
                            <th scope="col">No Tokens</th>
                            <th scope="col">Liquidity % </th>
                            <th scope="col">Trade </th>
                        </tr>
                    </thead>
                    <tbody>{this.renderLeaderboard()}</tbody>
                </table>
            </>
        );
    }
}
