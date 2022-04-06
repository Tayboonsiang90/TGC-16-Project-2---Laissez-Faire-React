import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8888";

export default class Login extends React.Component {
    state = {
        email: "",
        password: "",
        warningMessage: "",
    };

    updateFormField = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    };

    loginButton = async () => {
        try {
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
        } catch (e) {
            this.setState({
                warningMessage: e.response.data.message,
            });
        }
    };

    render() {
        return (
            <>
                <div className="mask d-flex align-items-center h-100">
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div className="card">
                                    <div className="card-body p-5">
                                        <h2 className="text-uppercase text-center mb-5">Login</h2>

                                        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert" style={{ display: this.state.warningMessage ? "block" : "none" }}>
                                            <strong>{this.state.warningMessage}</strong>
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>

                                        <form>
                                            <div className="form-outline mb-4">
                                                <input type="email" className="form-control form-control-lg" placeholder="Email" name="email" onChange={this.updateFormField} value={this.state.email} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="password" name="password" className="form-control form-control-lg" placeholder="Password" onChange={this.updateFormField} value={this.state.password} />
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <button type="button" className="btn btn-success btn-block btn-lg" onClick={this.loginButton}>
                                                    Login
                                                </button>
                                            </div>

                                            <p className="text-center text-muted mt-5 mb-0">
                                                Don't have an account?&nbsp;
                                                <a
                                                    href="/#"
                                                    className="fw-bold text-body"
                                                    onClick={() => {
                                                        //redirect to markets
                                                        this.props.updateParentDisplay("Signup");
                                                    }}
                                                >
                                                    <u>Create here</u>
                                                </a>
                                            </p>
                                            <p className="text-center text-muted mt-3 mb-0">
                                                Test User Account Login Details&nbsp;
                                                <a
                                                    href="/#"
                                                    className="fw-bold text-body"
                                                    onClick={() => {
                                                        this.setState({
                                                            email: "user@admin.com",
                                                            password: "password",
                                                        });
                                                    }}
                                                >
                                                    <u>Click here</u>
                                                </a>
                                            </p>
                                            <p className="text-center text-muted mb-0">
                                                Test Admin Account Login Details&nbsp;
                                                <a
                                                    href="/#"
                                                    className="fw-bold text-body"
                                                    onClick={() => {
                                                        this.setState({
                                                            email: "root@admin.com",
                                                            password: "password",
                                                        });
                                                    }}
                                                >
                                                    <u>Click here</u>
                                                </a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
