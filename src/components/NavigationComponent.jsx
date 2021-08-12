import React from "react";

export default function NavigationComponent(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="#!">
          Brandname
        </a>
        <div className="ml-auto">
          <button
            className="btn btn-sm btn-light shadow border-0 rounded-lg"
            onClick={props.openPopover}
          >
            Button
          </button>
        </div>
      </div>
    </nav>
  );
}
