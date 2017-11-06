import React from 'react';
import {connect} from 'react-redux';
import TableHeaders from '../../shared/components/table-headers';
import {fetchAnalysisData} from '../actions';
import { showRounded } from '../../shared/helpers';

class Analysis extends React.Component {

  componentWillMount() {
    if (!this.props.analysisDataReceived) {
      this.props.dispatch(fetchAnalysisData());
    }
  }

  render() {
    const { analysisData } = this.props;
    const headersData = [
      {cssClass: "col-4", title: "Kategoria"},
      {cssClass: "col-2 text-right", title: "2014"},
      {cssClass: "col-2 text-right", title: "2015"},
      {cssClass: "col-2 text-right", title: "2016"},
      {cssClass: "col-2 text-right", title: "2017"}
    ];
    const table = (
          <table className="table table-sm border">
            <TableHeaders headers={headersData} rowClass="table-row"/>
            <tbody>
            {Object.keys(analysisData).map((c, i) =>
              <tr key={c} className="table-row">
                  <td className="col-4">{c}
                  </td>
                  {Object.keys(analysisData[c]).map((y) => {
                    const value = parseFloat(analysisData[c][y]);
                    return (
                      <td key={y} className="col-2 text-right">{value > 0 ? showRounded(value, 0) + " €" : null}
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
        <div className="col-7">
         TODO tähän checkboxit joka käyttäjälle. Niiden perusteella rajataan analyysin dataa.
          {table}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    analysisData: state.categoriesData.analysisData,
    analysisDataReceived: state.categoriesData.analysisDataReceived
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

Analysis = connect(
  mapStateToProps,
  mapDispatchToProps
)(Analysis);

export default Analysis;
