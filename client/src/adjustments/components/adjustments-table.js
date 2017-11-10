import React from 'react';
import {connect} from 'react-redux';
import {fetchAdjustments, addAdjustment, createAdjustments, updateAdjustments, setAdjustmentToRemove, submitDeleteAdjustment, closeDeletePopup  } from '../actions';
import { toFinnishDateString } from '../../shared/helpers';
import { handleAmountChange, handleUserChange, handleDateChange } from '../../shared/components/table/change-handlers';
import {changeAttribute} from '../../shared/actions';

import TableHeaders from '../../shared/components/table/table-headers';
import UserDropdown from '../../shared/components/table/user-dropdown';
import DeletePopup from '../../shared/components/table/delete-popup';

class AdjustmentsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchAdjustments());
    }
  }

  render() {

    const {showPopup, submitDeleteAdjustment, closeDeletePopup, handleRemoveButtonClick, handleAttributeChange, removeSuccess, toRemove, adjustments, users, addAdjustment, createAdjustments, updateAdjustments, successMessage} = this.props;
    const headersData = [
      {cssClass: "col-2", title: "#"},
      {cssClass: "col-2", title: "Käyttäjä"},
      {cssClass: "col text-right", title: "Summa"},
      {cssClass: "col text-right", title: "Pvm (pp.kk.vvvv)"},
    ];
    const target = "adjustment";
    const table = (
        <div className="row">
          <div className="col-7">
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
                {adjustments.map((a, i) =>
                  <tr key={a.id} id={i+1} className="table-row">
                      <th scope="row" className="col-2">
                        {i+1} {a.newadjustment ? <span className="badge badge-secondary">Uusi</span> : null}
                      </th>
                      <td className="col-2">
                        <UserDropdown next={handleAttributeChange} target={target} dataID={a.id} defaultValue={a.userid} users={users} domID="Adjustmentuser" changeFunction={handleUserChange} />
                      </td>
                      <td className="col text-right">
                        <input type="number" name="amount"
                            defaultValue={a.amount}
                            onBlur={(e) => handleAmountChange(handleAttributeChange, a.id, e, target)}
                            className="text-right"/>
                      </td>
                      <td className="col text-right">
                        <input type="text" name="date"
                            defaultValue={toFinnishDateString(a.date)}
                            onBlur={(e) => handleDateChange(handleAttributeChange, a.id, e, target)}
                            className="text-right"/>
                      </td>
                      <td>
                        <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveButtonClick(a.id)}>
                      	  <span aria-hidden="true">&times;</span>
                    		</button>
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    )
    return (
      <div>
        {adjustments.length > 0 ? table : null}
        <div className="row mb-3">
          <div className="col-7">
            <button onClick={addAdjustment} type="button" className="btn btn-primary">Lisää uusi tasaus</button>
            <button onClick={createAdjustments} type="button" className="btn btn-primary ml-1">Tallenna uudet tasaukset</button>
            <button onClick={updateAdjustments} type="button" className="btn btn-primary ml-1">Päivitä vanhat tasaukset</button>
          </div>
          <div className="col-5">
            {successMessage
              ? <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              : null
             }
          </div>
        </div>
        {showPopup ?
           <DeletePopup title="tasaus" onSubmit={submitDeleteAdjustment} objectToRemove={toRemove} success={removeSuccess} onPopupClose={closeDeletePopup} />
         : null}
      </div>
    )
  }
}


const mapStateToProps = (state) => (
  {
    adjustments: state.adjustmentsData.adjustments,
    users: state.sharedData.users,
    dataReceived: state.adjustmentsData.dataReceived,
    successMessage: state.adjustmentsData.successMessage,
    toRemove: state.adjustmentsData.toRemove,
    showPopup: state.adjustmentsData.showPopup,
    removeSuccess: state.adjustmentsData.removeSuccess
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
    ),
    handleRemoveButtonClick: (id) => (
      dispatch(setAdjustmentToRemove(id))
    ),
    submitDeleteAdjustment: () => (
      dispatch(submitDeleteAdjustment())
    ),
    closeDeletePopup: () => (
      dispatch(closeDeletePopup())
    )
  }
);

AdjustmentsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdjustmentsTable);

export default AdjustmentsTable;
