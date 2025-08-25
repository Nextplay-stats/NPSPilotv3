// assets/js/modalforms.js

// Base path for Netlify Functions
const API = '/.netlify/functions';

var modalforms = {

  // 1) Show Add Report modal
  formAddReport: function (e) {
    e.preventDefault();

    $('#modal_formAddReport').remove();

    const $modal = $(create_modal_content({
      id:      'modal_formAddReport',
      title:   'Add Report',
      classes: 'modal-lg'
    }));
    $('#modal-container').append($modal);

    load_target($modal.find('.modal-body'));

    $.get('formAddReport.html')
      .done(html => {
        $modal.find('.modal-body').html(html);
        load_target_off();
        Tags.init('#cboGroups');
        new bootstrap.Modal($modal.get(0)).show();
      })
      .fail((_, __, err) => {
        load_target_off();
        console.error('Failed to load AddReport form:', err);
      });
  },

  // 2) Submit Add Report via FormData
  saveAddReport: function (e) {
    e.preventDefault();
    form_disable_save();

    // Grab the <form> and its file input
    const formEl = document.getElementById('formAddReport');
    const data   = new FormData(formEl);

    $.ajax({
      url:         `${API}/addReport`,
      method:      'POST',
      data:        data,
      processData: false,  // don't transform FormData into query string
      contentType: false,  // let the browser set the multipart boundary
      success: function () {
        removeModal('#modal_formAddReport');
        $('#manageReports').bootstrapTable('refresh');
      },
      error: function (xhr) {
        console.error('Add Report failed', xhr);
        $('.saveReturn')
          .html(
            '<i class="fas fa-times text-danger"></i>&nbsp;Add failed: ' +
            (xhr.responseText || xhr.statusText)
          )
          .show();
      }
    });
  },

  // 3) Delete report
  deleteReport: function (e, id) {
    e.preventDefault();

    bootbox.confirm({
      title: 'Confirm Delete',
      message: 'This report will be deleted permanently. Proceed?',
      swapButtonOrder: true,
      callback: function (confirmed) {
        if (!confirmed) return;

        $.ajax({
          url:    `${API}/deleteReport`,
          method: 'POST',
          data:   `rID=${encodeURIComponent(id)}`,
          success: function () {
            $('#manageReports').bootstrapTable('refresh');
          },
          error: function (xhr) {
            console.error('Delete failed', xhr);
            $('.saveReturn')
              .html(
                '<div class="alert alert-danger">' +
                '<i class="fas fa-times"></i>&nbsp;Delete failed: ' +
                (xhr.responseText || xhr.statusText) +
                '</div>'
              )
              .show();
          }
        });
      }
    });
  },

  // 4) Show Modify Report modal
  <form id="formModifyReport" enctype="multipart/form-data">
  <input type="hidden" name="rID">

  <!-- Type -->
  <div class="form-group row">
    <label for="cboType" class="col-sm-2 col-form-label">Type</label>
    <div class="col-sm">
      <select name="rType" id="cboType" class="form-select">
        <option value="report">Report</option>
        <option value="dashboard">Dashboard</option>
      </select>
    </div>
  </div>

  <!-- Description -->
  <div class="form-group row">
    <label for="txtDesc" class="col-sm-2 col-form-label">Description</label>
    <div class="col-sm">
      <input
        type="text"
        name="rDesc"
        id="txtDesc"
        class="form-control"
        required
      >
    </div>
  </div>

  <!-- Comments -->
  <div class="form-group row">
    <label for="txtComments" class="col-sm-2 col-form-label">Comments</label>
    <div class="col-sm">
      <input
        type="text"
        name="rComments"
        id="txtComments"
        class="form-control"
        maxlength="500"
      >
    </div>
  </div>

  <!-- App Group ID -->
  <div class="form-group row">
    <label for="txtAppGroupID" class="col-sm-2 col-form-label">App Group ID</label>
    <div class="col-sm">
      <input
        type="text"
        name="rAppGroupID"
        id="txtAppGroupID"
        class="form-control"
        required
      >
    </div>
  </div>

  <!-- Report ID -->
  <div class="form-group row">
    <label for="txtReportID" class="col-sm-2 col-form-label">Report ID</label>
    <div class="col-sm">
      <input
        type="text"
        name="rReportID"
        id="txtReportID"
        class="form-control"
      >
    </div>
  </div>

  <!-- Icon File & Preview -->
  <div class="form-group row">
    <label for="fileIcon" class="col-sm-2 col-form-label">Icon Image</label>
    <div class="col-sm">
      <input
        type="file"
        name="rIconFile"
        id="fileIcon"
        class="form-control"
        accept="image/*"
        onchange="previewIcon(event)"
      >
      <img
        id="iconPreview"
        class="mt-2"
        style="max-height:5em; display:none;"
        alt="Icon preview"
      >
    </div>
  </div>

  <!-- Class -->
  <div class="form-group row">
    <label for="cboClass" class="col-sm-2 col-form-label">Class</label>
    <div class="col-sm">
      <select name="rClass" id="cboClass" class="form-select">
        <option value="primary">Primary</option>
        <option value="info">Info</option>
      </select>
    </div>
  </div>

  <!-- Access Mode, Status, Tags, Category, Display Groups… -->
  <!-- (replicate the same pattern: blank inputs/selects with matching name) -->

</form>

<div class="modal-footer">
  <button
    type="button"
    class="btn btn-primary"
    onclick="modalforms.saveModifyReport(event)"
  >
    <i class="fas fa-save"></i>&nbsp;Save
  </button>
  <button
    type="button"
    class="btn btn-secondary"
    onclick="removeModal('#modal_formModifyReport')"
  >
    Cancel
  </button>
</div>

<script>
  // Live‐preview your existing or newly‐chosen icon file
  function previewIcon(evt) {
    const file = evt.target.files[0];
    const img  = document.getElementById('iconPreview');
    if (!file) {
      img.style.display = 'none';
      return;
    }
    img.src          = URL.createObjectURL(file);
    img.onload       = () => URL.revokeObjectURL(img.src);
    img.style.display = 'block';
  }
</script>

  // 5) Submit Modify Report
  saveModifyReport: function (e) {
    e.preventDefault();
    form_disable_save();

    const formEl = document.getElementById('formModifyReport');
    const data   = new FormData(formEl);

    $.ajax({
      url:         `${API}/modifyReport`,
      method:      'POST',
      data:        data,
      processData: false,
      contentType: false,
      success: function () {
        removeModal('#modal_formModifyReport');
        $('#manageReports').bootstrapTable('refresh');
      },
      error: function (xhr) {
        console.error('Modify failed', xhr);
        $('.saveReturn')
          .html(
            '<i class="fas fa-times text-danger"></i>&nbsp;Update failed: ' +
            (xhr.responseText || xhr.statusText)
          )
          .show();
      }
    });
  },

  // 6) Copy to external
  btnCopy_click: function (evt, sender) {
    evt.preventDefault();
    let confirmed = false;

    bootbox.confirm({
      title: 'Copy to External',
      message: 'Confirm copy of live reports to External site.',
      swapButtonOrder: true,
      callback: function (res) { confirmed = res; },
      onHidden: function () {
        if (confirmed) modalforms.copyToExternal();
      }
    });
  },

  copyToExternal: function () {
    load();
    $.ajax({ url: '/reports/updateExternalPowerBI' })
      .done(data => {
        const title = data === 'OK' ? 'Data Copied' : 'Error Copying Data';
        const msg   = data === 'OK' ? 'Data copied successfully.' : data;
        bootbox.alert({ title, message: msg });
        load_off();
      })
      .fail((_, __, err) => {
        bootbox.alert({ title: 'Error', message: err });
        load_off();
      });
  }

};  // end of modalforms
