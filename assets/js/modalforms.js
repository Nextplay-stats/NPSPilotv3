// assets/js/modalforms.js

// Base path for Netlify Functions
const API = '/.netlify/functions';

var modalforms = {

  // 1) Show Add Report modal
  formAddReport: function (e) {
    e.preventDefault();

    // Remove any existing Add Report modal
    $('#modal_formAddReport').remove();

    // Build the Bootstrap modal wrapper
    const $modal = $(create_modal_content({
      id:      'modal_formAddReport',
      title:   'Add Report',
      classes: 'modal-lg'
    }));

    // Inject into placeholder and show spinner
    $('#modal-container').append($modal);
    load_target($modal.find('.modal-body'));

    // Fetch the Add Report form (located alongside manageReports.html in /reports)
    $.get('formAddReport.html')
      .done(function (html) {
        $modal.find('.modal-body').html(html);
        load_target_off();
        Tags.init('#cboGroups');
        new bootstrap.Modal($modal.get(0)).show();
      })
      .fail(function (_, __, err) {
        load_target_off();
        console.error('Failed to load AddReport form:', err);
      });
  },

  // 2) Submit Add Report
   saveAddReport: function (e) {
   e.preventDefault();
   form_disable_save();

  // Gather form + file input
   const formEl = document.getElementById('formAddReport');
   const data   = new FormData(formEl);

   $.ajax({
     url:       `${API}/addReport`,
     method:    'POST',
     data:      data,
     processData: false, // tell jQuery not to process the FormData
     contentType: false, // tell jQuery not to set Content-Type
     success: function () {
       removeModal('#modal_formAddReport');
       $('#manageReports').bootstrapTable('refresh');
     },
     error: function (xhr) {
       console.error('Add Report failed', xhr);
       $('.saveReturn')
         .html('<i class="fas fa-times text-danger"></i>&nbsp;Add failed: ' +
               (xhr.responseText || xhr.statusText))
         .show();
     }
   });
 },

  // 3) Delete report
  deleteReport: function (e, id) {
    e.preventDefault();

    bootbox.confirm({
      title: 'Confirm Delete',
      message: 'The report will be deleted permanently. Proceed?',
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
              .html('<div class="alert alert-danger">' +
                    '<i class="fas fa-times"></i>&nbsp;Delete failed: ' +
                    (xhr.responseText || xhr.statusText) +
                    '</div>')
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

    // Build the Bootstrap modal wrapper
    const $modal = $(create_modal_content({
      id:      'modal_formModifyReport',
      title:   'Modify Report',
      classes: 'modal-lg'
    }));
    $('#modal-container').append($modal);
    load_target($modal.find('.modal-body'));

    // Fetch the Modify Report form skeleton
    $.get('formModifyReport.html')
      .done(function (html) {
        $modal.find('.modal-body').html(html);

        // Then load the existing report data
        $.getJSON(`${API}/getReport`, { rID: id })
          .done(function (report) {
            Object.entries(report).forEach(function ([key, val]) {
              const $el = $modal.find(`[name=${key}]`);
              if ($el.length) $el.val(val);
            });
            Tags.init('#cboGroups');
            load_target_off();
            new bootstrap.Modal($modal.get(0)).show();
          })
          .fail(function (_, __, err) {
            load_target_off();
            console.error('Failed to load report data:', err);
          });
      })
      .fail(function (_, __, err) {
        load_target_off();
        console.error('Failed to load ModifyReport form:', err);
      });
  },

  // 5) Submit Modify Report
  saveModifyReport: function (e) {
    e.preventDefault();
    form_disable_save();

    const formData = $('#formModifyReport').serialize();
    $.ajax({
      url:    `${API}/modifyReport`,
      method: 'POST',
      data:   formData,
      success: function () {
        removeModal('#modal_formModifyReport');
        $('#manageReports').bootstrapTable('refresh');
      },
      error: function (xhr) {
        console.error('Modify failed', xhr);
        $('.saveReturn')
          .html('<i class="fas fa-times text-danger"></i>&nbsp;Update failed: ' +
                (xhr.responseText || xhr.statusText))
          .show();
      }
    });
  },

  // 6) Copy to external remains unchanged
  btnCopy_click: function (evt, sender) {
    evt.preventDefault();
    let confirmed = false;

    bootbox.confirm({
      title: 'Copy to External',
      message: 'Confirm copy of live reports to External site.',
      swapButtonOrder: true,
      callback: function (result) {
        confirmed = result;
      },
      onHidden: function () {
        if (confirmed) modalforms.copyToExternal();
      }
    });
  },

  copyToExternal: function () {
    load();
    $.ajax({ url: '/reports/updateExternalPowerBI' })
      .done(function (data) {
        const title = data === 'OK' ? 'Data Copied' : 'Error Copying Data';
        const msg   = data === 'OK' ? 'Data copied successfully.' : data;
        bootbox.alert({ title, message: msg });
        load_off();
      })
      .fail(function (_, __, err) {
        bootbox.alert({ title: 'Error', message: err });
        load_off();
      });
  }

}; 
