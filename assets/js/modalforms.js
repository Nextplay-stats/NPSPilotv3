// assets/js/modalforms.js

// Base path for Netlify Functions
const API = '/.netlify/functions';

var modalforms = {

  // 1) Show Add Report modal
  formAddReport: function (e) {
  e.preventDefault();

  },  !

    // Remove any existing Add Report modal
    $('#modal_formAddReport').remove();

    // Create a new modal element and wrap it in jQuery
    const $modal = $(create_modal_content({
      id:      'modal_formAddReport',
      title:   'Add Report',
      classes: 'modal-lg'
    }));

    // Append the modal to our placeholder container
    $('#modal-container').append($modal);

    // Show a loading spinner in the modal body
    load_target($modal.find('.modal-body'));

    // Fetch the empty form reports and inject it
    $.get('/formAddReport.html')
      .done(html => {
       $modal.find('.modal-body').html(html);
       load_target_off();
       Tags.init('#cboGroups');
   
       const modalEl = $modal.get(0);
       new bootstrap.Modal(modalEl).show();
     })
     .fail((_, __, err) => {
       load_target_off();
       console.error('Failed to load AddReport form:', err);
     });

  // 2) Submit Add Report
  saveAddReport: function (e) {
    e.preventDefault();
    form_disable_save();

    const formData = $('#formAddReport').serialize();
    $.ajax({
      url:    `${API}/addReport`,
      method: 'POST',
      data:   formData,
      success() {
        removeModal('#modal_formAddReport');
        $('#manageReports').bootstrapTable('refresh');
      },
      error(xhr) {
        console.error('Add Report failed', xhr);
        $('.saveReturn')
          .html(`<i class="fas fa-times text-danger"></i>&nbsp;Add failed: ${xhr.responseText || xhr.statusText}`)
          .show();
      }
    });
  },


  // 3) Delete report
  deleteReport: function (e, id) {
    e.preventDefault();

    bootbox.confirm({
      title:           'Confirm Delete',
      message:         'The report will be deleted permanently. Proceed?',
      swapOrder: true,
      callback(confirmed) {
        if (!confirmed) return;

        $.ajax({
          url:    `${API}/deleteReport`,
          method: 'POST',
          data:   `rID=${encodeURIComponent(id)}`,
          success() {
            $('#manageReports').bootstrapTable('refresh');
          },
          error(xhr) {
            console.error('Delete failed', xhr);
            $('.saveReturn')
              .html(`<div class="alert alert-danger"><i class="fas fa-times"></i>&nbsp;Delete failed: ${xhr.responseText || xhr.statusText}</div>`)
              .show();
          }
        });
      }
    });
  },


  // 4) Show Modify Report modal
  formModifyReport: function (e, id) {
    e.preventDefault();

    // Remove any existing Modify Report modal
    $('#modal_formModifyReport').remove();

    // Create and wrap the modal
    const $modal = $(create_modal_content({
      id:      'modal_formModifyReport',
      title:   'Modify Report',
      classes: 'modal-lg'
    }));

    $('#modal-container').append($modal);
    load_target($modal.find('.modal-body'));

    // Load the blank skeleton first
    $.get('/reports/formModifyReport.html')
      .done(html => {
        $modal.find('.modal-body').html(html);

        // Then fetch the existing report data
        $.getJSON(`${API}/getReport`, { rID: id })
          .done(report => {
            Object.entries(report).forEach(([key, val]) => {
              const $el = $modal.find(`[name=${key}]`);
              if ($el.length) $el.val(val);
            });
            Tags.init('#cboGroups');
            load_target_off();

            // Show the modal once populated
            const modalEl = $modal.get(0);
            new bootstrap.Modal(modalEl).show();
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

    const formData = $('#formModifyReport').serialize();
    $.ajax({
      url:    `${API}/modifyReport`,
      method: 'POST',
      data:   formData,
      success() {
        removeModal('#modal_formModifyReport');
        $('#manageReports').bootstrapTable('refresh');
      },
      error(xhr) {
        console.error('Modify failed', xhr);
        $('.saveReturn')
          .html(`<i class="fas fa-times text-danger"></i>&nbsp;Update failed: ${xhr.responseText || xhr.statusText}`)
          .show();
      }
    });
  },


  // 6) Copy to external remains unchanged
  btnCopy_click: function (evt, sender) {
    let confirmed = false;
    bootbox.confirm({
      title:           'Copy to External',
      message:         'Confirm copy of live reports to External site.',
      swapButtonOrder: true,
      callback(result) { confirmed = result; },
      onHidden() {
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

};
