import React from 'react';
import {connect} from 'react-redux';
import {fetchAdjustments, addAdjustment, createAdjustments, updateAdjustments, setAdjustmentToRemove, submitDeleteAdjustment, closeDeletePopup, hideMessages  } from '../actions';
import { toFinnishDateString, getCssForDateField, getCssForNumberField } from '../../shared/helpers';
import { handleAmountChange, handleUserChange, handleDateChange, handleCommentChange } from '../../shared/components/table/change-handlers';
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

  componentWillUnmount() {
    this.props.dispatch(hideMessages());
  }

  render() {

    const {showPopup, submitDeleteAdjustment, closeDeletePopup, handleRemoveButtonClick, handleAttributeChange,
          removeSuccess, toRemove, adjustments, users, addAdjustment, createAdjustments,
          updateAdjustments, successMessage, errorMessage} = this.props;
    const headersData = [
      {cssClass: "col-1", title: "#"},
      {cssClass: "col-2", title: "Käyttäjä"},
      {cssClass: "col-2 text-right", title: "Summa"},
      {cssClass: "col-2 text-right", title: "Pvm"},
      {cssClass: "col-3", title: "Kommentti"},
      {cssClass: "col-2 text-center", title:""}
    ];
    const target = "adjustment";
    const table = (
        <div className="row">
          <div className="col">
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
                {adjustments.map((a, i) =>
                  <tr key={a.id} id={i+1} className="table-row">
                      <th scope="row" className="col-1">
                        {i+1} {a.newadjustment ? <span className="badge badge-secondary small-font">Uusi</span> : null}
                        {a.changed ? <span className="badge badge-secondary small-font">Muutos</span> : null}
                      </th>
                      <td className="col-2">
                        <UserDropdown next={handleAttributeChange} target={target} dataID={a.id} defaultValue={a.userid} users={users} domID="Adjustmentuser" changeFunction={handleUserChange} />
                      </td>
                      <td className="col-2 text-right">
                        <input type="number" name="amount"
                            defaultValue={a.amount}
                            onBlur={(e) => handleAmountChange(handleAttributeChange, a.id, e, target)}
                            className={getCssForNumberField("text-right form-control p-1", a.amount)}/>
                      </td>
                      <td className="col-2 text-right">
                        <input type="text" name="date"
                            defaultValue={toFinnishDateString(a.date)}
                            onBlur={(e) => handleDateChange(handleAttributeChange, a.id, e, target)}
                            className={getCssForDateField("text-right form-control p-1", a.date)}/>
                      </td>
                      <td className="col-3">
                        <input type="text" name="comment"
                            defaultValue={a.comment}
                            onBlur={(e) => handleCommentChange(handleAttributeChange, a.id, e, target)}
                            className="form-control"/>
                      </td>
                      <td className="col-2 text-center">
                        <button type="button" className="btn btn-outline-danger px-2 py-1" onClick={() => handleRemoveButtonClick(a.id)}>
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
            <button onClick={addAdjustment} type="button" className="btn btn-primary mb-1 ml-1">Lisää uusi tasaus</button>
            <button onClick={createAdjustments} type="button" className="btn btn-primary ml-1 mb-1">Tallenna uudet tasaukset</button>
            <button onClick={updateAdjustments} type="button" className="btn btn-primary ml-1 mb-1">Tallenna muutetut tasaukset</button>
          </div>
          <div className="col-5">
            {successMessage
              ? <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              : null
             }
             {errorMessage
               ? <div className="alert alert-danger" role="alert">
                   {errorMessage}
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
    errorMessage: state.adjustmentsData.errorMessage,
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
    handleAttributeChange: (attribute, id, value, target, isValid) => (
      dispatch(changeAttribute(attribute, id, value, target, isValid))
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
