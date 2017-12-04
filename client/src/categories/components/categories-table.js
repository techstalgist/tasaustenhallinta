import React from 'react';
import {connect} from 'react-redux';
import TableHeaders from '../../shared/components/table/table-headers';
import {fetchCategories, createCategories, addCategory, updateCategories, setCategoryToRemove, submitDeleteCategory, closeDeletePopup, hideMessages } from '../actions';
import { getCssForTextField } from '../../shared/helpers';
import { changeAttribute } from '../../shared/actions';
import { handleNameChange } from '../../shared/components/table/change-handlers';
import DeletePopup from '../../shared/components/table/delete-popup';

class CategoriesTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchCategories());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(hideMessages());
  }

  render() {
    const { categories, addCategory, createCategories, updateCategories,
            handleAttributeChange, successMessage, errorMessage, handleRemoveButtonClick,
            showPopup, submitDeleteCategory, toRemove, closeDeletePopup, removeSuccess } = this.props;
    const headersData = [
      {cssClass: "col-2", title: "#"},
      {cssClass: "col-6", title: "Kategoria"},
      {cssClass: "col-2 text-right", title: "Laskujen lkm"},
      {cssClass: "col text-center", title:""}
    ];
    const target = "category";
    const table = (
        <div className="row">
          <div className="col-lg-8 col">
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
              {categories.map((c, i) =>
                <tr key={c.id} id={i+1} className="table-row">
                    <th scope="row" className="col-2">
                      {i+1} {c.newcategory ? <span className="badge badge-secondary small-font">Uusi</span> : null}
                      {c.changed ? <span className="badge badge-secondary small-font">Muutos</span> : null}
                    </th>
                    <td className="col-6">
                      <input type="text" name="date"
                          defaultValue={c.name}
                          onBlur={(e) => handleNameChange(handleAttributeChange, c.id, e, target)}
                          className={getCssForTextField("text-left form-control p-1", c.name)}/>
                    </td>
                    <td className="col-2 text-right">
                      {c.bills_count}
                    </td>
                    <td className="col text-center">
                      <button type="button" className="btn btn-outline-danger px-2 py-1" onClick={() => handleRemoveButtonClick(c.id)}>
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
      <div className="row">
        <div className="col">
          {table}
          <div className="row mb-3">
            <div className="col-7">
              <button onClick={addCategory} type="button" className="btn btn-primary ml-1 mb-1">Lisää uusi kategoria</button>
              <button onClick={createCategories} type="button" className="btn btn-primary ml-1 mb-1">Tallenna uudet kategoriat</button>
              <button onClick={updateCategories} type="button" className="btn btn-primary ml-1 mb-1">Tallenna muutetut kategoriat</button>
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
            {showPopup ?
               <DeletePopup title="kategoria" onSubmit={submitDeleteCategory} objectToRemove={toRemove} success={removeSuccess} onPopupClose={closeDeletePopup} />
             : null}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    categories: state.categoriesData.categories,
    dataReceived: state.categoriesData.dataReceived,
    successMessage: state.categoriesData.successMessage,
    errorMessage: state.categoriesData.errorMessage,
    toRemove: state.categoriesData.toRemove,
    showPopup: state.categoriesData.showPopup,
    removeSuccess: state.categoriesData.removeSuccess
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    handleAttributeChange: (attribute, id, value, target, isValid) => (
      dispatch(changeAttribute(attribute, id, value, target, isValid))
    ),
    addCategory: () => (
      dispatch(addCategory())
    ),
    createCategories: () => (
      dispatch(createCategories())
    ),
    updateCategories: () => (
      dispatch(updateCategories())
    ),
    handleRemoveButtonClick: (id) => (
      dispatch(setCategoryToRemove(id))
    ),
    submitDeleteCategory: () => (
      dispatch(submitDeleteCategory())
    ),
    closeDeletePopup: () => (
      dispatch(closeDeletePopup())
    )
  }
);

CategoriesTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesTable);

export default CategoriesTable;
