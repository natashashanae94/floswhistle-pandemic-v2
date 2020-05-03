import React, { Component } from "react";
// import { StyledButton } from "../../components/button/StyledButton";
// import { Link } from "react-router-dom";
import Mapv2 from "./Mapv2";
import MapInfov2 from "./MapInfov2";
import DateRangeFilter from "./DateRangeFilter";

import { sortDataByDate } from "../../assets/utils/dates";
import { findNumberOfReportsByDate } from "./parsingmethods/findNumberofReportsByDate";
import { filterByRequested } from "./parsingmethods/filterByRequested";
import {
  formattedDistrictsArray,
  reducedDistrictObjects,
} from "./parsingmethods/districtParsing";
import { formatDataForTable } from "./parsingmethods/tableParsing";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData: null,
      dateObjects: null,
      requestedReport: null,
      cumulativeReports: null,
      allReportsFilteredByRequested: null,
      currentDistrict: null,
    };
    this.setRequestedReport = this.setRequestedReport.bind(this);
    this.updateMapInfoDisplay = this.updateMapInfoDisplay.bind(this);
  }
  componentDidMount() {
    fetch(`https://api.floswhistle.com/v1/reports`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        const reportData = sortDataByDate(response);
        const dateObjects = findNumberOfReportsByDate(reportData);
        const districtObjectArr = formattedDistrictsArray(reportData);
        const tableObjectsArr = formatDataForTable(reportData);
        const mapData = reducedDistrictObjects(districtObjectArr);
        this.setState({
          // raw data sorted by date - earliest to latest
          reportData: reportData,
          // report data then parsed and reduced to condense all reports with the same date to aa array of date objects
          // that have the date and number of reports made on that specific date
          dateObjects,
          // specific date object found within dateObjects array that contains the selected date and
          // number of reports made on that date
          requestedReport: dateObjects[dateObjects.length - 1],
          // initially set to the length of raw reportData, is updated in setRequestedReport to be the length of filtered reportData
          cumulativeReports: reportData.length,
          // initially set to match reportData, is updated to be the the reduced total of reports between filtered range of report dates
          allReportsFilteredByRequested: reportData,
          // initial set with reportData, is an array reformatted objects used for District data
          districtObjectArr,
          // initially set with reprotData, is an array of reformatted objects used for Tables
          tableObjectsArr,
          // districtObjectArr reduced to populate the DistrictsMap
          mapData,
        });
      })
      .catch((error) => console.log(error));
  }
  // slider event that sets requestedReport and filtered reportData by date range
  setRequestedReport(e) {
    const { dateObjects, reportData } = this.state;
    // declares indexToFind as the target value of the range slider
    const indexToFind = parseInt(e.target.value);
    // finds the index of the selected date via slider from within the date objects array
    // that provides the min and max range to the slider
    const requestedReport = dateObjects.find(
      (report, idx) => idx === indexToFind
    );
    // filters all report data by dates before or the same as the date of the requestedReport
    const allReportsFilteredByRequested = filterByRequested(
      reportData,
      requestedReport
    );
    // filters the date object array dates before or the same as the date of the requestedReport
    const filteredReports = dateObjects.filter((el, idx) => {
      return idx <= indexToFind;
    });
    // returns the total number of reports made between the first date object and requestedReport (selected date)
    const cumulativeReports = filteredReports
      .map(({ numberOfReports }) => numberOfReports)
      .reduce((a, b) => a + b, 0);
    // returns districtObjectArr based on the reports filtered by date ranges
    const districtObjectArr = formattedDistrictsArray(
      allReportsFilteredByRequested
    );
    // returns tableObjectArr based on the reports filtered by date ranges
    const tableObjectsArr = formatDataForTable(allReportsFilteredByRequested);
    // districtObjectArr reduced to populate the DistrictsMap
    const mapData = reducedDistrictObjects(districtObjectArr);

    this.setState((prevSt) => {
      return {
        ...prevSt,
        requestedReport,
        cumulativeReports,
        allReportsFilteredByRequested,
        districtObjectArr,
        tableObjectsArr,
        mapData,
      };
    });
  }
  updateMapInfoDisplay(district) {
    const currentDistrict = district;
    this.setState((prevSt) => {
      return {
        ...prevSt,
        currentDistrict,
      };
    });
  }
  render() {
    const {
      reportData,
      dateObjects,
      cumulativeReports,
      requestedReport,
      allReportsFilteredByRequested,
      mapData,
      currentDistrict,
      districtObjectArr,
      tableObjectsArr,
    } = this.state;
    return (
      <React.Fragment>
        {dateObjects && allReportsFilteredByRequested ? (
          <div className="Dashboard_Page">
            <DateRangeFilter
              numberOfReports={reportData.length}
              dateObjects={dateObjects}
              setRequestedReport={this.setRequestedReport}
              requestedReport={requestedReport}
              cumulativeReports={cumulativeReports}
            />
            <h3 className="color-dark-blue">Overview</h3>
            <div className="Dashboard_Container">
              <MapInfov2
                cumulativeReports={cumulativeReports}
                allReportsFilteredByRequested={allReportsFilteredByRequested}
                requestedReport={requestedReport}
                dateObjects={dateObjects}
                districtObjectArr={districtObjectArr}
                currentDistrict={currentDistrict}
                tableObjectsArr={tableObjectsArr}
              />
              <Mapv2
                mapData={mapData}
                updateMapInfoDisplay={this.updateMapInfoDisplay}
              />
              {/* <StyledButton component={Link} to="/">
                GO BACK
              </StyledButton> */}
            </div>
          </div>
        ) : (
          <p>Loading</p>
        )}
      </React.Fragment>
    );
  }
}

export default Dashboard;
