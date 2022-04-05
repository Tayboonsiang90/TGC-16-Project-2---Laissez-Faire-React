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
                    <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                        © 2022 Student of Trent Global College
                    </div>
                </footer>
            </>
        );
    }
}
