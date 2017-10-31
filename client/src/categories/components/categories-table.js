import React from 'react';

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
    const table = (
        <div>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Kategoria</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">
                    1
                    </th>
                    <td>
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
