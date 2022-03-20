import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default class Markets extends React.Component {
    state = {
        openMarkets: [
            {
                _Id: 193,
                politician: "Tay Boon Siang",
                event: "elections",
                country: "singapore",
                description: "",
                timestampCreated: 1647775063000,
                timestampExpiry: 1742469438000,
                yesBalance: 1000,
                noBalance: 2000,
                invariantK: 2000000,
            },
            {
                _Id: 194,
                politician: "Goh Jian De",
                event: "elections",
                country: "singapore",
                description: "",
                timestampCreated: 1647775063000,
                timestampExpiry: 1742469438000,
                yesBalance: 1000,
                noBalance: 2000,
                invariantK: 2000000,
            },
        ],
        resolvingMarkets: [{}, {}],
        closedMarkets: [{}, {}],
    };

    async componentDidMount() {}

    render() {
        return (
            <>
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
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span>
                                    <i className="fa-solid fa-check-to-slot"></i>
                                </span>
                                <h5 className="card-title">Next President of Ukraine</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Expiry: 14/05/2022</h6>
                            </div>
                            <div>
                                <button type="button" className="btn btn-success">
                                    Go to Market
                                </button>
                            </div>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Volodmyr Zelensky</span>
                            <span className="text-success me-2">Yes: 10¢</span>
                            <span className="text-danger">No: 90¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Valdmir Putin</span>
                            <span className="text-success me-2">Yes: 49¢</span>
                            <span className="text-danger">No: 51¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Goh Jian De</span>
                            <span className="text-success me-2">Yes: 95¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;5¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Tay Boon Siang</span>
                            <span className="text-success me-2">Yes: 99¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;1¢</span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                            <i className="fa-solid fa-chart-column text-muted"></i>
                            <p className="card-text text-muted">&nbsp;$123,456</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span>
                                    <i className="fa-solid fa-check-to-slot"></i>
                                </span>
                                <h5 className="card-title">Next President of Ukraine</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Expiry: 14/02/2022</h6>
                            </div>
                            <div>
                                <button type="button" className="btn btn-secondary">
                                    Market Resolving
                                </button>
                            </div>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Volodmyr Zelensky</span>
                            <span className="text-success me-2">Yes: 10¢</span>
                            <span className="text-danger">No: 90¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Valdmir Putin</span>
                            <span className="text-success me-2">Yes: 49¢</span>
                            <span className="text-danger">No: 51¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Goh Jian De</span>
                            <span className="text-success me-2">Yes: 95¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;5¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Tay Boon Siang</span>
                            <span className="text-success me-2">Yes: 99¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;1¢</span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                            <i className="fa-solid fa-chart-column text-muted"></i>
                            <p className="card-text text-muted">&nbsp;$123,456</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span>
                                    <i className="fa-solid fa-check-to-slot"></i>
                                </span>
                                <h5 className="card-title">Next President of Ukraine</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Expiry: 14/01/2022</h6>
                            </div>
                            <div>
                                <button type="button" className="btn btn-danger">
                                    Market Closed
                                </button>
                            </div>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Volodmyr Zelensky</span>
                            <span className="text-success me-2">Yes: 10¢</span>
                            <span className="text-danger">No: 90¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Valdmir Putin</span>
                            <span className="text-success me-2">Yes: 49¢</span>
                            <span className="text-danger">No: 51¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Goh Jian De</span>
                            <span className="text-success me-2">Yes: 95¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;5¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Tay Boon Siang</span>
                            <span className="text-success me-2">Yes: 99¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;1¢</span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                            <i className="fa-solid fa-chart-column text-muted"></i>
                            <p className="card-text text-muted">&nbsp;$123,456</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span>
                                    <i className="fa-solid fa-check-to-slot"></i>
                                </span>
                                <h5 className="card-title">Add your own market here</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Expiry: 14/04/2022</h6>
                            </div>
                            <div>
                                <button type="button" className="btn btn-success">
                                    Go to Market
                                </button>
                            </div>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Volodmyr Zelensky</span>
                            <span className="text-success me-2">Yes: 10¢</span>
                            <span className="text-danger">No: 90¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Valdmir Putin</span>
                            <span className="text-success me-2">Yes: 49¢</span>
                            <span className="text-danger">No: 51¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Goh Jian De</span>
                            <span className="text-success me-2">Yes: 95¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;5¢</span>
                        </div>
                        <div className="border-bottom d-flex align-items-center justify-content-between">
                            <span className="card-text me-auto">Tay Boon Siang</span>
                            <span className="text-success me-2">Yes: 99¢</span>
                            <span className="text-danger">No: &nbsp;&nbsp;1¢</span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                            <i className="fa-solid fa-chart-column text-muted"></i>
                            <p className="card-text text-muted">&nbsp;$123,456</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
