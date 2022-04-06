import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Footer extends React.Component {
    state = {
        userSessionDetails: {},
    };

    render() {
        return (
            <>
                <footer className="mt-5 bg-light text-center text-lg-start">
                    <div className="text-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                        <div className="text-center p-3">
                            <div>
                                <a className="btn btn-secondary m-2" id="facebook-btn" href="https://www.facebook.com/tbooons" role="button">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a className="btn btn-secondary m-2" id="linkedin-btn" href="https://sg.linkedin.com/in/tay-boon-siang-487537149" role="button">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a className="btn btn-secondary m-2" id="github-btn" href="https://github.com/Tayboonsiang90" role="button">
                                    <i className="fab fa-github"></i>
                                </a>
                            </div>
                            <div className="font-p1">© 2022 Tay Boon Siang</div>
                        </div>
                    </div>
                </footer>
            </>
        );
    }
}
