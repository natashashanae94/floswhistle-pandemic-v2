import React from "react";
import "../assets/App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Analytics from 'react-router-ga';

import Header from "../components/header/Header";
import HomePage from "./homepage/HomePage";
import ReportPledgePage from "./reportpledgepage/ReportPledgePage";
import ReportFormPage from "./reportformpage/ReportFormPage";
import ThankYouPage from "./thankyoupage/ThankYouPage";
import Dashboard from "./dashboard/Dashboard";
import DownloadPage from "./downloadpage/DownloadPage";


function App() {
  return (
    <div className="App">
      <div className="page">
        <BrowserRouter>
          <Analytics id="UA-49480678-8">
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/pledge" component={ReportPledgePage} />
              <Route exact path="/report" component={ReportFormPage} />
              <Route exact path="/results" component={Dashboard} />
              <Route exact path="/thanks" component={ThankYouPage} />
              <Route exact path="/download" component={DownloadPage} />
            </Switch>
          </Analytics>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
