import React from 'react';
import {toProperCase} from '../../helpers';

const DeletePopup = (props) => {

    const {title, onSubmit, objectToRemove, success, onPopupClose} = props;
    let successAlert;
    if (success) {
      successAlert = (<div className="alert alert-success">
        {toProperCase(title)} poistettiin onnistuneesti.
      </div>);
    } else {
      successAlert = null;
    }
    const objectToShow = objectToRemove.toUIObject();
    return(
        <div className="modal custom-modal" id={"deletePopup_"+title}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vahvista poistaminen</h5>
                <button type="button" className="btn btn-secondary" onClick={() => onPopupClose()}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                  <div className="row mb-2">
                    <div className="col">
                        <strong>Poistettava {title}</strong>
                          <hr/>
                          <p>
                            {Object.keys(objectToShow).map((k, i) => {
                                  return (<span id={k} key={k}>{k}: {objectToShow[k]}<br/></span>)
                              })}
                          </p>
                          <hr />
                        Vahvista poistaminen klikkaamalla <strong>Poista.</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      {successAlert}
                    </div>
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => onSubmit()}>Poista</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => onPopupClose()}>Sulje</button>
              </div>
            </div>
          </div>
        </div>
    )
}

export default DeletePopup;
