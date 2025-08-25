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
  formModifyReport: function (e, id) {
    e.preventDefault();
    $('#modal_formModifyReport').remove();

    const $modal = $(create_modal_content({
      id:      'modal_formModifyReport',
      title:   'Modify Report',
      classes: 'modal-lg'
    }));
    $('#modal-container').append($modal);

    load_target($modal.find('.modal-body'));

    $.get('formModifyReport.html')
      .done(html => {
        $modal.find('.modal-body').html(html);

        $.getJSON(`${API}/getReport`, { rID: id })
          .done(report => {
            Object.entries(report).forEach(([key, val]) => {
              const $el = $modal.find(`[name="${key}"]`);
              if (!$el.length) return;

              if ($el.prop('multiple')) {
                $el.val(val).trigger('change');
              } else {
                $el.val(val);
              }
            });

            Tags.init('#cboGroups');
            load_target_off();
            new bootstrap.Modal($modal.get(0)).show();
          })
          .fail((_, __, err) => {
            load_target_off();
            console.error('Failed to load report data:', err);
          });

      })
      .fail((_, __, err) => {
        load_target_off();
        console.error('Failed to load ModifyReport form:', err);
      });
  },

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
