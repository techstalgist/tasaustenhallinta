import React from 'react';
import {connect} from 'react-redux';
import {fetchAdjustments, addAdjustment, createAdjustments, updateAdjustments } from '../actions';
import { toFinnishDateString, handleAmountChange, handleUserChange, handleDateChange } from '../../shared/helpers';
import {changeAttribute} from '../../shared/actions';

import TableHeaders from '../../shared/components/table-headers';
import UserDropdown from '../../shared/components/user-dropdown';

class AdjustmentsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchAdjustments());
    }
  }

  render() {

    const {adjustments, users, addAdjustment, createAdjustments, updateAdjustments, successMessage} = this.props;
    const headersData = [
      {cssClass: "col-2", title: "#"},
      {cssClass: "col-2", title: "Käyttäjä"},
      {cssClass: "col text-right", title: "Summa"},
      {cssClass: "col text-right", title: "Pvm (pp.kk.vvvv)"},
    ];
    const target = "adjustment";
    const table = (
        <div>
          {successMessage
            ? <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            : null
           }
          <table className="table border">
            <TableHeaders headers={headersData} rowClass="table-row"/>
            <tbody>
              {adjustments.map((a, i) =>
                <tr key={a.id} id={i+1} className="table-row">
                    <th scope="row" className="col-2">
                      {i+1} {a.newadjustment ? <span className="badge badge-secondary">Uusi</span> : null}
                    </th>
                    <td className="col-2">
                      <UserDropdown next={this.props.handleAttributeChange} target={target} dataID={a.id} defaultValue={a.userid} users={users} domID="Adjustmentuser" changeFunction={handleUserChange} />
                    </td>
                    <td className="col text-right">
                      <input type="number" name="amount"
                          defaultValue={a.amount}
                          onBlur={(e) => handleAmountChange(this.props.handleAttributeChange, a.id, e, target)}
                          className="text-right"/>
                    </td>
                    <td className="col text-right">
                    <input type="text" name="date"
                        defaultValue={toFinnishDateString(a.date)}
                        onBlur={(e) => handleDateChange(this.props.handleAttributeChange, a.id, e, target)}
                        className="text-right"/>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    )
    return (
      <div>
        {adjustments.length > 0 ? table : null}
        <button onClick={addAdjustment} type="button" className="btn btn-primary">Lisää uusi tasaus</button>
        <button onClick={createAdjustments} type="button" className="btn btn-primary ml-1">Tallenna uudet tasaukset</button>
        <button onClick={updateAdjustments} type="button" className="btn btn-primary ml-1">Päivitä vanhat tasaukset</button>
      </div>
    )
  }
}


const mapStateToProps = (state) => (
  {
    adjustments: state.adjustmentsData.adjustments,
    users: state.sharedData.users,
    dataReceived: state.adjustmentsData.dataReceived,
    successMessage: state.adjustmentsData.successMessage
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    addAdjustment: () => (
      dispatch(addAdjustment())
    ),
    createAdjustments: () => (
      dispatch(createAdjustments())
    ),
    updateAdjustments: () => (
      dispatch(updateAdjustments())
    ),
    handleAttributeChange: (attribute, id, value, target) => (
      dispatch(changeAttribute(attribute, id, value, target))
    )
  }
);

AdjustmentsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdjustmentsTable);

export default AdjustmentsTable;
