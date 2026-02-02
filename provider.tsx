"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <Toaster position="top-right" />
      {children}
    </ReduxProvider>
  );
};

export default Provider;
