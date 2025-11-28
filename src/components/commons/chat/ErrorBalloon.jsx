import React from "react";

const ErrorBalloon = (props) => {

    return (
        <div className="error-balloon">{props.errorMessage}</div>
    )
}

export default ErrorBalloon;
