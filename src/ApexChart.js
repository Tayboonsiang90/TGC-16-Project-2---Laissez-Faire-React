import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Chart from "react-apexcharts";
const ApexCharts = window.ApexCharts;

const API_URL = "http://127.0.0.1:8888";

export default class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            position: "",
            country: "",
            description: "",
            politicians: [],
            timestampCreated: 0,
            timestampExpiry: 0,
            //Apex Charts stuff
            options: {
                chart: {
                    id: "realtime",
                    type: "line",
                    //disable chart zooming
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                    animations: {
                        enabled: true,
                        easing: "linear",
                        dynamicAnimation: {
                            speed: 1000,
                        },
                    },
                },
                //Pre-loading title while fetching price data
                title: {
                    text: "Loading Charts...",
                    align: "center",
                    style: {
                        fontFamily: "Source Code Pro, monospace",
                    },
                },
                //Data Labels are labels with value on the chart
                dataLabels: {
                    enabled: false,
                },
                //Defining chart color
                colors: ["#00802b", "#cc0000", "#e6e6e6"],
                //Line Stroke
                stroke: {
                    show: true,
                    curve: "smooth",
                    lineCap: "butt",
                    width: 3,
                    dashArray: 0,
                },
                xaxis: {
                    type: "datetime",
                    labels: {
                        style: {
                            fontFamily: "Source Code Pro, monospace",
                            datetimeUTC: false,
                        },
                    },
                    //vertical crosshairs styling
                    crosshairs: {
                        show: true,
                        width: 1,
                        stroke: {
                            colors: "#f0f0f0",
                            width: 2,
                            dashArray: 0,
                        },
                    },
                    //x-axis tooltip
                    tooltip: {
                        enabled: false,
                    },
                },
                yaxis: {
                    max: 100,
                    min: 0,
                    tickAmount: 10,
                    labels: {
                        formatter: function (val, index) {
                            return val.toFixed(0) + "¢";
                        },
                    },
                },
                //Words to show then chart is loading
                noData: {
                    text: "Loading Charts...",
                    align: "center",
                    verticalAlign: "middle",
                    style: {
                        color: "#FF9900",
                        fontSize: "1em",
                        fontFamily: "Tourney, cursive",
                    },
                },
            },
            series: [
                {
                    data: [],
                },
            ],
        };
    }

    async componentDidUpdate(prevProps) {
        if (this.props.refreshChildChart !== prevProps.refreshChildChart) {
            //Pull all politician markets
            let response1 = await axios.get(API_URL + "/open_markets/" + this.props.market_id);
            this.setState({
                politicians: response1.data.openMarkets[0].politicians,
            });

            let yesTokens = this.state.politicians[this.props.displayMarket].yes;
            let noTokens = this.state.politicians[this.props.displayMarket].no;
            let yesPrice = (noTokens * 100) / (yesTokens + noTokens);
            //Update chart
            ApexCharts.exec("realtime", "updateSeries", [
                {
                    name: "Yes Price",
                    type: "line",
                    data: [...this.state.politicians[this.props.displayMarket].chart1, [new Date().getTime(), yesPrice]],
                },
                {
                    name: "No Price",
                    type: "line",
                    data: [...this.state.politicians[this.props.displayMarket].chart2, [new Date().getTime(), 100 - yesPrice]],
                },
                // {
                //     name: "Volume",
                //     type: "bar",
                //     data: [...this.state.politicians[this.props.displayMarket].chart3, [new Date().getTime(), 0]],
                // },
            ]);
            ApexCharts.exec("realtime", "updateOptions", {
                title: {
                    text: `${this.state.politicians[this.props.displayMarket].politician} Contract Prices`,
                },
            });
        }
    }

    async componentDidMount() {
        //Pull all politician markets
        let response1 = await axios.get(API_URL + "/open_markets/" + this.props.market_id);
        this.setState({
            politicians: response1.data.openMarkets[0].politicians,
        });

        let yesTokens = this.state.politicians[0].yes;
        let noTokens = this.state.politicians[0].no;
        let yesPrice = (noTokens * 100) / (yesTokens + noTokens);
        //Update chart
        ApexCharts.exec("realtime", "updateSeries", [
            {
                name: "Yes Price",
                type: "line",
                data: [...this.state.politicians[0].chart1, [new Date().getTime(), yesPrice]],
            },
            {
                name: "No Price",
                type: "line",
                data: [...this.state.politicians[0].chart2, [new Date().getTime(), 100 - yesPrice]],
            },
            // {
            //     name: "Volume",
            //     type: "bar",
            //     data: [...this.state.politicians[0].chart3, [new Date().getTime(), 0]],
            // },
        ]);
        ApexCharts.exec("realtime", "updateOptions", {
            title: {
                text: `${this.state.politicians[this.props.displayMarket].politician} Contract Prices`,
            },
        });
    }

    render() {
        return (
            <>
                <Chart options={this.state.options} series={this.state.series} type="line" />
            </>
        );
    }
}
