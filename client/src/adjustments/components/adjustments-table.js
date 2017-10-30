import React from 'react';
import {connect} from 'react-redux';
import {fetchAdjustments, dataNotReceived, addAdjustment, changeAmount, createAdjustments, updateAdjustments, changeDate} from '../actions';
import { toFinnishDateString, toISOCompatibleString, isValidFinnishDate } from '../../shared/helpers';

class AdjustmentsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchAdjustments());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(dataNotReceived());
  }

  handleAmountChange = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.handleAmountChange(id, e.target.value);
  }

  handleDateChange = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isValidFinnishDate(e.target.value)) {
      const isoDate = toISOCompatibleString(e.target.value);
      this.props.handleDateChange(id, isoDate);
    } else {
      // change CSS style, maybe via Redux dispatch
    }
  }

  render() {

    const {adjustments, addAdjustment, createAdjustments, updateAdjustments, successMessage} = this.props;
    const table = (
        <div>
          {successMessage
            ? <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            : null
           }
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Käyttäjä</th>
                <th scope="col">Summa</th>
                <th scope="col">Pvm (pp.kk.vvvv)</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((a, i) =>
                <tr key={i+1} id={i+1}>
                    <th scope="row">
                      {i+1}
                    </th>
                    <td>
                      {a.username}
                    </td>
                    <td>
                      <input type="number" name="amount"
                          defaultValue={a.amount}
                          onBlur={(e) => this.handleAmountChange(a.id, e)}
                          className="text-right"/>
                    </td>
                    <td>
                    <input type="text" name="date"
                        defaultValue={toFinnishDateString(a.date)}
                        onBlur={(e) => this.handleDateChange(a.id, e)}
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
    handleAmountChange: (id, value) => (
      dispatch(changeAmount(id,value))
    ),
    handleDateChange: (id, value) => (
      dispatch(changeDate(id,value))
    )
  }
);

AdjustmentsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdjustmentsTable);

export default AdjustmentsTable;
