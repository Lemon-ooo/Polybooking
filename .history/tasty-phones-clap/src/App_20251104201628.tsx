import React from "react";
import ReactDOM from "react-dom/client";
import { Refine } from "@refinedev/core";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter } from "react-router-dom";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { notificationProvider } from "@refinedev/antd";
import { dataProvider } from "./dataProvider";

const App = () => {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
          routerProvider={routerBindings}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: "posts",
              list: "/posts",
            },
          ]}
        />
        <RefineKbar />
        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </RefineKbarProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
