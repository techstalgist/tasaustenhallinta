import React from 'react';
import {connect} from 'react-redux';

import TableHeaders from '../../shared/components/table-headers';
import {fetchCategories} from '../actions';

class CategoriesTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchCategories());
    }
  }

  render() {
    const { categories } = this.props;
    const headersData = [
      {cssClass: "col-4", title: "#"},
      {cssClass: "col-8", title: "Kategoria"}
    ];
    const table = (
        <div className="row">
          <div className="col-4">
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
              {categories.map((c, i) =>
                <tr key={c.id} id={i+1} className="table-row">
                    <th scope="row" className="col-4">
                      {i+1} {c.newcategory ? <span className="badge badge-secondary">Uusi</span> : null}
                    </th>
                    <td className="col-8">
                      {c.name}
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
        {table}
        <button type="button" className="btn btn-primary">Lisää uusi kategoria</button>
        <button type="button" className="btn btn-primary ml-1">Tallenna uudet kategoriat</button>
        <button type="button" className="btn btn-primary ml-1">Päivitä vanhat kategoriat</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    categories: state.categoriesData.categories,
    dataReceived: state.categoriesData.dataReceived
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

CategoriesTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesTable);

export default CategoriesTable;
