import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://project-2-express.herokuapp.com";

export default class Signup extends React.Component {
    state = {
        countryList: [],
        email: "",
        password: "",
        retypePassword: "",
        name: "",
        dateOfBirth: "",
        country: "Country",
        tAndC: false,
        warningMessage: "",
    };

    updateFormField = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    };

    updateSingleCheckbox = (evt) => {
        this.setState({
            [evt.target.name]: !this.state[evt.target.name],
        });
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

    registerButton = async () => {
        if (this.state.password !== this.state.retypePassword) {
            this.setState({
                warningMessage: "Your passwords do not match. Please try again.",
            });
        } else {
            try {
                await axios.post(API_URL + "/signup", {
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name,
                    country: this.state.country,
                    dateOfBirth: this.state.dateOfBirth,
                });

                let response = await axios.get(API_URL + "/login", {
                    params: {
                        email: this.state.email,
                        password: this.state.password,
                    },
                });
                //store in cookies
                document.cookie = JSON.stringify(response.data.message);
                //update parent state variables
                this.props.updateParentState("userSessionDetails", response.data.message);
                //redirect to markets
                this.props.updateParentDisplay("Markets");
            } catch (error) {
                this.setState({
                    warningMessage: error.response.data.message,
                });
            }
        }
    };

    async componentDidMount() {
        let response = await axios.get(API_URL + "/country");
        this.setState({
            countryList: response.data.countryArray,
        });
    }

    render() {
        return (
            <>
                <div className="mask d-flex align-items-center h-100">
                    <div className="container h-100 mt-4">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div className="card style-neutral">
                                    <div className="card-body p-5">
                                        <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                                        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMessage ? "block" : "none" }}>
                                            <strong>{this.state.warningMessage}</strong>
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>

                                        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                            <strong>Limited Time Offer:</strong> Sign up now for bonus credits of $1000.
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>

                                        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
                                            <strong>Security Warning:</strong> Passwords are not encrypted and stored in your cookies in this beta app! Do not re-use passwords!
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>

                                        <form>
                                            <div className="form-outline mb-4">
                                                <input type="email" className="form-control form-control-lg" placeholder="Email" name="email" onChange={this.updateFormField} value={this.state.email} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="password" name="password" className="form-control form-control-lg" placeholder="Password" onChange={this.updateFormField} value={this.state.password} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="password" name="retypePassword" className="form-control form-control-lg" placeholder="Retype Password" onChange={this.updateFormField} value={this.state.retypePassword} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="text" name="name" className="form-control form-control-lg" placeholder="Full Name" onChange={this.updateFormField} value={this.state.name} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input placeholder="Date of Birth" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} name="dateOfBirth" className="form-control form-control-lg" onChange={this.updateFormField} value={this.state.dateOfBirth} />
                                            </div>

                                            <select className="form-select form-select-lg mb-4" name="country" onChange={this.updateFormField} value={this.state.country}>
                                                {this.renderCountryDropdown()}
                                            </select>

                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input className="form-check-input me-2" type="checkbox" value={true} name="tAndC" onChange={this.updateSingleCheckbox} checked={this.state.tAndC} />
                                                <label className="form-check-label">
                                                    I agree all statements in&nbsp;
                                                    <a href="#!" className="text-body" data-bs-toggle="modal" data-bs-target="#tOSModal">
                                                        <u>Terms of Service</u>
                                                    </a>
                                                </label>
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <button type="button" className="btn btn-success btn-block btn-lg" onClick={this.registerButton} disabled={!this.state.tAndC}>
                                                    Register
                                                </button>
                                            </div>

                                            <p className="text-center text-muted mt-5 mb-0">
                                                Have already an account?&nbsp;
                                                <a
                                                    href="/#"
                                                    className="fw-bold text-body"
                                                    onClick={() => {
                                                        //redirect to markets
                                                        this.props.updateParentDisplay("Login");
                                                    }}
                                                >
                                                    <u>Login here</u>
                                                </a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal --> */}
                <div className="modal fade" id="tOSModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tOSModalLabel">
                                    Terms of Service
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                The Laissez Faire website is for informational and educational purposes only. This website takes no custody of any real assets. None of the material on the Site is intended to be, nor does it constitute, a solicitation, recommendation or offer to buy or sell any
                                security, commodity interest, derivative, financial product or instrument. Users are responsible for complying with all applicable laws and should conduct their own analysis and consult with professional advisors prior to entering into any financial contracts. Trading
                                is not available to Restricted Persons.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
