import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Leaderboard extends React.Component {
    state = {
        leaderboard: [],
    };

    renderLeaderboard = () => {
        let renderArray = [];
        let count = 0;

        for (let item of this.state.leaderboard) {
            count++;
            renderArray.push(
                <tr className={(item.timestamp === this.props.userSessionDetails.timestamp ? "table-success " : "") + (count < 4 ? "h" + (count + 3) : "")} key={item._id}>
                    <th>
                        {count} &nbsp; <i className={"fa-solid fa-trophy " + (count === 1 ? "d-inline" : "d-none")}></i>
                        <i className={"fa-solid fa-medal " + (count === 2 ? "d-inline" : "d-none")}></i>
                        <i className={"fa-solid fa-award " + (count === 3 ? "d-inline" : "d-none")}></i>
                    </th>
                    <td>{item._id}</td>
                    <td className="d-none d-sm-table-cell">{item.email}</td>
                    <td className="d-none d-lg-table-cell">{new Date(item.timestamp).toDateString()}</td>
                    <td>
                        {item.roi.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        %
                    </td>
                </tr>
            );
        }

        return renderArray;
    };

    async componentDidMount() {
        let response = await axios.get(API_URL + "/leaderboard/");

        this.setState({
            leaderboard: response.data.message,
        });
    }

    render() {
        return (
            <>
                <h1 className="ms-2 mt-3">Cash Leaderboard</h1>
                <table className="table table-striped w-100">
                    <thead>
                        <tr>
                            <th scope="col">Ranking</th>
                            <th scope="col">Account ID</th>
                            <th className="d-none d-sm-table-cell" scope="col">
                                Email
                            </th>
                            <th className="d-none d-lg-table-cell" scope="col">
                                Date Joined
                            </th>
                            <th scope="col">ROI</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderLeaderboard()}</tbody>
                </table>
            </>
        );
    }
}
