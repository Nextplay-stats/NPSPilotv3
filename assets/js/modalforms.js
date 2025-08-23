// modalforms.js

// 1) Your Function App host + endpoints
const FUNC_HOST = 'https://npsbackend-adg7dug3anash7hm.uksouth-01.azurewebsites.net';
const FUNC_API  = {
  add:    `${FUNC_HOST}/api/AddReport?code=ugiVcp0NhP-PH1Q3kFGDhPdMjBUkRTq4XgxfwN8AW5DdAzFuS7GgMw==`,
  modify: `${FUNC_HOST}/api/ModifyReport?code=pzWA7THnAQXTtv5o36iYa5_oo-woDEtksUbuHEQxujIvAzFu9oYVpg==`,
  delete: `${FUNC_HOST}/api/DeleteReport?code=<DELETE_KEY>`   // ← insert real key
};

var modalforms = {

  // ------------------------------------------------------------------------------------------------
  // 1) Load the AddReport form (GET from Pages, not POST)
  // ------------------------------------------------------------------------------------------------
  formAddReport: function(e, ref) {
    e.preventDefault();

    var modal = create_modal_content({
      id:      'modal_formAddReport',
      title:   'Add Report',
      classes: 'modal-lg'
    });
    load_target($(modal).find('.modal-body'));

    // GET the partial HTML from GitHub Pages under /NPSPilotv3
    $.get(
      '/NPSPilotv3/reports/formAddReport',
      { src: 'modal', rRef: ref },
      function(html) {
        $(modal).find('.modal-body').html(html);
        load_target_off();
        Tags.init('#cboGroups');
      }
    );
  },

  // ------------------------------------------------------------------------------------------------
  // 2) Save new report (POST to Azure Function)
  // ------------------------------------------------------------------------------------------------
  saveAddReport: async function(e) {
    if (e) e.preventDefault();
    form_disable_save();

    const payload = Object.fromEntries(
      new FormData(document.getElementById('formAddReport')).entries()
    );

    try {
      const res = await fetch(FUNC_API.add, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }

      // on success, redirect within your Pages site
      window.location.href = '/NPSPilotv3/reports/manageReports/';
    }
    catch (err) {
      console.error('saveAddReport error:', err);
      const el = document.querySelector('.saveReturn');
      el.innerHTML = `<i class="fas fa-times text-danger"></i>&nbsp;Add failed: ${err.message}`;
      el.style.display = 'block';
    }
  },

  // ------------------------------------------------------------------------------------------------
  // 3) Delete a report (DELETE to Azure Function)
  // ------------------------------------------------------------------------------------------------
  deleteReport: function(e, id) {
    e.preventDefault();

    bootbox.confirm({
      closeButton:    false,
      title:          'Confirm Delete',
      message:        'The report will be deleted permanently. Proceed?',
      swapButtonOrder: true,
      callback: async function(confirmed) {
        if (!confirmed) return;

        try {
          const res = await fetch(FUNC_API.delete, {
            method:  'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ rID: id })
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || res.statusText);
          }

          window.location.href = '/NPSPilotv3/reports/manageReports/';
        }
        catch (err) {
          console.error('deleteReport error:', err);
          const el = document.querySelector('.saveReturn');
          el.innerHTML = `<div class="alert alert-danger" role="alert">
                            <i class="fas fa-times"></i>&nbsp;Delete failed: ${err.message}
                          </div>`;
          el.style.display = 'block';
        }
      }
    });
  },

  // ------------------------------------------------------------------------------------------------
  // 4) Load the ModifyReport form (GET from Pages)
  // ------------------------------------------------------------------------------------------------
  formModifyReport: function(e, id) {
    e.preventDefault();

    var modal = create_modal_content({
      id:      'modal_formModifyReport',
      title:   'Modify Report',
      classes: 'modal-lg'
    });
    load_target($(modal).find('.modal-body'));

    $.get(
      '/NPSPilotv3/reports/formModifyReport',
      { src: 'modal', rID: id },
      function(html) {
        $(modal).find('.modal-body').html(html);
        load_target_off();
        Tags.init('#cboGroups');
      }
    );
  },

  // ------------------------------------------------------------------------------------------------
  // 5) Save modified report (POST to Azure Function)
  // ------------------------------------------------------------------------------------------------
  saveModifyReport: async function(e) {
    if (e) e.preventDefault();
    form_disable_save();

    const payload = Object.fromEntries(
      new FormData(document.getElementById('formModifyReport')).entries()
    );

    try {
      const res = await fetch(FUNC_API.modify, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }

      window.location.href = '/NPSPilotv3/reports/manageReports/';
    }
    catch (err) {
      console.error('saveModifyReport error:', err);
      const el = document.querySelector('.saveReturn');
      el.innerHTML = `<i class="fas fa-times text-danger"></i>&nbsp;Update failed: ${err.message}`;
      el.style.display = 'block';
    }
  },

  // ------------------------------------------------------------------------------------------------
  // 6) Copy to external (unchanged)
  // ------------------------------------------------------------------------------------------------
  btnCopy_click: function(evt, sender) {
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

  copyToExternal: function() {
    load();
    $.ajax({ url: '/reports/updateExternalPowerBI' })
     .done(function(data) {
       const title = data === 'OK' ? 'Data Copied' : 'Error Copying Data';
       const msg   = data === 'OK' ? 'Data copied successfully.' : data;
       bootbox.alert({ title, message: msg });
       load_off();
     })
     .fail(function(_, __, err) {
       bootbox.alert({ title: 'Error', message: err });
       load_off();
     });
  }

}; // end modalforms
