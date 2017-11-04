import React from 'react';
import TableHeaders from '../../shared/components/table-headers';

class CategoriesTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      //this.props.dispatch(fetchAdjustments());
    }
  }

  componentWillUnmount() {
    //this.props.dispatch(dataNotReceived());
  }

  render() {
    const headersData = [
      {cssClass: "col-4", title: "#"},
      {cssClass: "col-8", title: "Kategoria"}
    ];
    const table = (
        <div className="row">
          <div className="col-4">
            <table className="table border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
                  <tr className="table-row">
                      <th className="col-4">
                      1
                      </th>
                      <td className="col-8">
                      Ruokaostokset
                      </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
    )
    return (
      <div>
        {table}
        <button type="button" className="btn btn-primary">Lisää uusi kategoria</button>
        <button type="button" className="btn btn-primary ml-1">Tallenna uudet kategoriat</button>
        <button type="button" className="btn btn-primary ml-1">Päivitä vanhat kategoriat</button>
      </div>
    )
  }
}

export default CategoriesTable;
