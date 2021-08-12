import React from "react";

export default function LoaderComponent() {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
