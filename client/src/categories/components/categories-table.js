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
      {cssClass: "col-1", title: "#"},
      {cssClass: "col-3", title: "Kategoria"}
    ];
    const table = (
        <div>
          <table className="table">
            <TableHeaders headers={headersData} />
            <tbody>
                <tr className="row">
                    <th className="col-1">
                    1
                    </th>
                    <td className="col-3">
                    Ruokaostokset
                    </td>
                </tr>
            </tbody>
          </table>
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
