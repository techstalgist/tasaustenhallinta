import React from 'react';
import { getMonths, getCurrentMonth } from '../months';
class BillsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      //this.props.dispatch(fetchAdjustments());
    }
  }

  componentWillUnmount() {
    //this.props.dispatch(dataNotReceived());
  }

  render() {
    const months = getMonths(new Date());
    const currentMonth = getCurrentMonth(months);
    const table = (
        <div>
          <div className="row">
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="months"><strong>Kuukausi</strong></label>
                <select className="form-control" id="months" defaultValue={currentMonth.toString()}>
                  {months.map((m) => {
                    return (<option value={m.toString()} key={m.toString()}>{m.toString()}</option>);
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Käyttäjä</th>
                  <th scope="col">Summa</th>
                  <th scope="col">Kategoria</th>
                  <th scope="col">Pvm (pp.kk.vvvv)</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                      <th scope="row">
                      1
                      </th>
                      <td>
                      t
                      </td>
                      <td>
                        50
                      </td>
                      <td>
                        Ruokaostokset
                      </td>
                      <td>
                        1.10.2017
                      </td>
                  </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
    )
    return (
      <div>
        {table}
        <button type="button" className="btn btn-primary">Lisää uusi lasku</button>
        <button type="button" className="btn btn-primary ml-1">Tallenna uudet laskut</button>
        <button type="button" className="btn btn-primary ml-1">Päivitä vanhat laskut</button>
      </div>
    )
  }
}

export default BillsTable;
