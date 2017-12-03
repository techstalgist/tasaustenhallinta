import React from 'react';
import {connect} from 'react-redux';
import TableHeaders from '../../shared/components/table/table-headers';
import {fetchAnalysisData, changeSelectedUser} from '../actions';
import { showRounded } from '../../shared/helpers';
import { handleSelectedChange } from '../../shared/components/table/change-handlers';

class Analysis extends React.Component {

  componentWillMount() {
    if (!this.props.analysisDataReceived) {
      this.props.dispatch(fetchAnalysisData());
    }
  }

  showValue(value) {
    return value > 0 ? showRounded(value, 0) + " €" : null;
  }

  render() {
    const { analysisData, users, handleAttributeChange } = this.props;
    let cols = [];
    // TODO sarakkeet backendistä frontin lähettämien tietojen perusteella
    if (Object.keys(analysisData) !== undefined) {
      const first = analysisData[Object.keys(analysisData)[0]];
      if (first !== undefined) {
        cols = Object.keys(first);
      }
    }
    const colsToObjects = cols.map((c) => {
      return {cssClass: "col text-right", title: c};
    });

    const headersData = [
      {cssClass: "col", title: "Kategoria"},
      ...colsToObjects
    ];
    const target = "user";
    const table = (
          <table className="table table-sm border">
            <TableHeaders headers={headersData} rowClass="table-row"/>
            <tbody>
            {Object.keys(analysisData).map((c, i) =>
              <tr key={c} className="table-row">
                  <td className="col">
                   {c === "Yhteensä" ? (<strong>{c}</strong>) : c}
                  </td>
                  {Object.keys(analysisData[c]).map((y) => {
                    const value = parseFloat(analysisData[c][y]);
                    return (
                      <td key={y} className="col text-right">
                        {
                          c === "Yhteensä" ?
                            (<strong>{this.showValue(value)}</strong>)
                          : this.showValue(value)
                        }
                      </td>
                    )
                  })}
              </tr>
            )}
            </tbody>
          </table>
    )
    return (
      <div className="row">
        <div className="col-lg-8 col">
            <div className="row">
              <div className="col">
                <ul className="list-inline mb-1">
                  <li className="list-inline-item">
                    <span className="mr-1">Rajaa käyttäjän mukaan: </span>
                  </li>
                  <li className="list-inline-item">
                    {users.map((u) => {
                      return (
                        <div className="form-check form-check-inline" key={u.id}>
                          <label className="form-check-label nonselectable-text">
                            <input type="checkbox" className="form-check-input" checked={u.selectedForAnalysis}
                              onChange={(e) => handleSelectedChange(handleAttributeChange, u.id, e, target)}/>
                              {u.username}
                          </label>
                        </div>
                      )
                    })}
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col">
                {table}
              </div>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    analysisData: state.categoriesData.analysisData,
    analysisDataReceived: state.categoriesData.analysisDataReceived,
    users: state.sharedData.users
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    handleAttributeChange: (attribute, id, value, target, isValid) => (
      dispatch(changeSelectedUser(attribute, id, value, target, isValid))
    ),
  }
);

Analysis = connect(
  mapStateToProps,
  mapDispatchToProps
)(Analysis);

export default Analysis;
