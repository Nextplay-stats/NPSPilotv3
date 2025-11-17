window.onload = localStorage.clear();
var commentary = {
	edit_load: () => {
		tinymce.init({
			selector: '#txtComments',
			browser_spellcheck: true,
			contextmenu: false,
			init_instance_callback: function(editor) {
				editor.on('input', function(e) {
					commentary.pulse();
				});
			},
			readonly: document.querySelector('#txtComments').disabled
		});
		// const btnHelpText = document.querySelector('#btnHelpText');
		// const helpTextToast = bootstrap.Toast.getOrCreateInstance(document.querySelector('#helpTextToast'));
		// btnHelpText.addEventListener("click", () => {
		// 	helpTextToast.show();
		// });
	},
	edit: (evt, sender) => {
		document.querySelector('#txtID').value = sender.dataset.id;
		document.querySelector('#frmEdit').submit();
	},
	pulse: () => {
		document.querySelector('#btnSave').classList.add('pulse');
	},
	submit: (evt, sender) => {
		const frm = document.querySelector('#frmCommentary');
		tinyMCE.triggerSave();
		if (!frm.checkValidity()) {
			evt.preventDefault();
			evt.stopPropagation();
			frm.classList.add('was-validated');
			return false;
		}
		let msg = "";
		switch (evt.submitter.id) {
			case "btnEdit":
				msg = "Change status of report so you can edit it?";
				break;
			case "btnSave":
				msg = "Save changes?";
				break;
			case "btnComplete":
				msg = "Complete commentary report?";
				break;
			case "btnPublish":
				msg = "Publish report?";
				break;
		}
		const cnf = confirm(msg);
		return cnf;
	},
	reassign: (evt, sender) => {
		const dataObj = {
			rID: sender.dataset.id
		};
		$.ajax({
			url: "/commentary/reassign",
			method: "POST",
			data: dataObj
		}).done(function(data, textStatus, jqXHR) {
			const modal = document.querySelector('#mdlReassign');
			const mf = modal.querySelector('.modal-footer');
			const mb = modal.querySelector('.modal-body');
			mb.innerHTML = data;
			mf.innerHTML = "";
			const mm = new bootstrap.Modal(document.getElementById('mdlReassign'));
			modal.addEventListener('shown.bs.modal', function (event) {
				const btns = document.querySelectorAll('#grpButtons button');
				btns.forEach((btn) => {
					mf.appendChild(btn);
				});
			});
			modal.addEventListener('hidden.bs.modal', (evt) => {
				document.location.reload();
			});
			mm.show();
		}).fail(function( jqXHR, textStatus, errorThrown ) {

		});
	},
	btnReassignSave_click: (evt, sender) => {
		const frm = document.querySelector('#frmPeople');
		frm.classList.add('was-validated');
		if (frm.checkValidity() === false) {
			return false;
		}
		const dataObj = {
			rEmployeeID: document.querySelector('#cboPeople').value,
			rID: document.querySelector('#txtReportID').value,
			rSubmit: "reassign"
		};
		// Update the assignee.
		$.ajax({
			url: "/commentary/reassign",
			method: "POST",
			data: dataObj
		}).done(function(data, textStatus, jqXHR) {
			if (data == "true") {
				const modal = document.querySelector('#mdlReassign');
				const mm = bootstrap.Modal.getInstance(modal);
				mm.hide();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {

		});
	},
	/**
	 * Add persons to schedule.
	 * @param {*} evt 
	 * @param {*} sender 
	 */
	btnScheduleAdd_click: (evt, sender) => {
		const cboPeople = document.querySelector('#cboPeople');
		if (cboPeople.value == "") {
			alert("No one selected to add.");
			return;
		}
		let okToAdd = true;
		const newElement = cboPeople.selectedOptions[0];
		const cboTargetPeople = document.querySelector('#cboTargetPeople');
		// Check the person isn't already in the list.
		Object.values(cboTargetPeople.options).forEach((option) => {
			if (option == newElement.value) {
				// Don't add.
				okToAdd = false;
			}
		});
		if (okToAdd) {
			cboTargetPeople.appendChild(newElement);
		}
	},
	/**
	 * Remove person from the schedule.
	 * @param {*} evt 
	 * @param {*} sender 
	 */
	btnScheduleRemove_click: (evt, sender) => {
		const cboTargetPeople = document.querySelector('#cboTargetPeople');
		if (cboTargetPeople.selectedOptions.length != 1) {
			alert("You must select to some to remove.");
			return;
		}
		cboTargetPeople.removeChild(cboTargetPeople.selectedOptions[0]);
	},
	/**
	 * Save the schedule.
	 * @param {*} evt 
	 * @param {*} sender 
	 */
	frmSchedule_submit: (evt, sender) => {
		selectAll('cboTargetPeople', true);
		const frm = document.querySelector('#frmSchedule');
		if (!frm.checkValidity()) {
			evt.preventDefault();
			evt.stopPropagation();
			frm.classList.add('was-validated');
			return false;
		}

		return true;
	},
	btnEditSchedule: (evt, sender) => {
		const txtID = document.querySelector('#txtID');
		txtID.value = sender.dataset.id;
		const frmSchedule = document.querySelector('#frmSchedule');
		frmSchedule.submit();
	},
	btnChangeScheduleState: (evt, sender) => {
		let msg = "";
		let enabled = 0;
		if (sender.dataset.state == "0") {
			msg = "enable";
			enabled = 1;
		} else {
			msg = "disable";
		}
		let result = confirm("Are you sure you want to " + msg + " this schedule?");
		if (result) {
			load();
			const dataObj = {
				rScheduleID: sender.dataset.id,
				rEnabled: enabled
			};
			$.ajax({
				url: "/commentary/scheduleState",
				method: "POST",
				data: dataObj
			}).done(function(data, textStatus, jqXHR ) {
				if (data != "1" && data != "true") {
					alert(data);
				}
				load_off();
				window.document.location.reload();
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				alert(errorThrown);
				load_off();
				window.document.location.reload();
			});
		}
	},
	btnArchive_click: (evt, sender) => {
		let result = confirm("Are you sure you want to archive report:" + sender.dataset.id);
		if (result) {
			load();
			const dataObj = {
				rReportIDs: [sender.dataset.id],
				rStatus: sender.dataset.status
			};
			$.ajax({
				url: "/commentary/changeStatus",
				method: "POST",
				data: dataObj
			}).done(function(data, textStatus, jqXHR ) {
				if (data != "1" && data != "true") {
					alert(data);
				}
				load_off();
				alert("Archive successfully, please reload the page.")
				// window.document.location.reload();
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				alert(errorThrown);
				load_off();
				window.document.location.reload();
			});
		}
	},
	checkOnClick: (clicked_id) => {
		// alert(clicked_id);
		localStorage.setItem(clicked_id,true);
	},
	btnMultiArchive_click: (evt, sender) => {
		if (localStorage.length == 0) {
			alert("No reports selected.");
			return;
		}
		let result = confirm("Please confirm if you want to archive " + localStorage.length + " selected reports.");
		if (result) {
			load();
			let reportIDs = [];
			for (var i = 0,len = localStorage.length;i < len; ++i) {
				reportIDs.push(parseInt(localStorage.key(i)));
			}
			const dataObj = {
				rReportIDs: reportIDs,
				rStatus: 500
			};
			$.ajax({
				url: "/commentary/changeStatus",
				method: "POST",
				data: dataObj
			}).done(function(data, textStatus, jqXHR ) {
				if (isNaN(data)) {
					alert(data);
					return;
				}
				load_off();
				alert("Archive successfully, please reload the page.")
				localStorage.clear();
				// window.document.location.reload();
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				alert(errorThrown);
				load_off();
				window.document.location.reload();
				localStorage.clear();
			});
		}
	},
	btnClearStorage_click: function(evt, sender) {
		if (localStorage.length == 0) {
			alert("No reports selected.");
			return;
		}
		localStorage.clear();
		window.location.reload();
	},
	chkArchive_change: (evt, sender) => {
		const frm = document.querySelector('#frmEdit');
		frm.action ="/commentary/list";
		frm.submit();
	},
	listDateSorter: function(fieldA, fieldB, rowA, rowB) {
		var date1 = rowA._fCreated_data.sortdate;
		var date2 = rowB._fCreated_data.sortdate;
		return date1 - date2;
	}
	,
	scheduleDateSorter: function(fieldA, fieldB, rowA, rowB) {
		var date1 = rowA._fStartDate_data.sortdate;
		var date2 = rowB._fStartDate_data.sortdate;
		return date1 - date2;
	},
	schedule_load: () => {
		tinymce.init({
			selector: '#txtHelpText',
			browser_spellcheck: true,
			contextmenu: false,
			init_instance_callback: function(editor) {
				editor.on('input', function(e) {
					commentary.pulse();
				});
			}
		});
	}
}
