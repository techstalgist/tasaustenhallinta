import React from 'react';

const DeletePopup = (props) => {

    const {title, onSubmit, objectToRemove, success, onPopupClose} = props;
    let successAlert;
    if (success) {
      successAlert = (<div className="alert alert-success">
        {title.charAt(0).toUpperCase() + title.substring(1)} poistettiin onnistuneesti.
      </div>);
    } else {
      successAlert = null;
    }
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
                  <div className="row">
                    <div className="col">
                        <p>Poistettava {title}: <br/>
                          <span id={"objectToRemove_" + title}>
                            <strong>{objectToRemove.toString()}</strong>
                          </span>. <br/><br/>
                        Vahvista poistaminen klikkaamalla Poista.</p>
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
