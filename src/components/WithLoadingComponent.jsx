import React from "react";
import LoaderComponent from "../components/LoaderComponent";

export default function WithLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return <LoaderComponent />;
  };
}
