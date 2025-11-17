// Admin Scripts.
let admin = {
	btnEditGroup_click: (evt, sender) => {
		load();
		const dataObj = {
			rID: sender.dataset.id
		};
		$.ajax({
			url: "/admin/editGroup",
			method: "POST",
			data: dataObj
		}).done(function(data, textStatus, jqXHR) {
			let saveForm;
			let formFields;
			bootbox.confirm({
				title: "Group Details",
				message: data,
				swapButtonOrder: true,
				callback: (result) => {
					if (result) {
						// Validate form.
						let validForm = false;
						const frm = document.querySelector('#frmGroup');
						formFields = $(frm).serializeArray();
						if (frm.checkValidity()) {
							validForm = true;
							saveForm = true;
						}
						frm.classList.add("was-validated");
						return validForm;
					} else {
						return true;
					}
				},
				onHide: (evt) => {
					if (saveForm) {
						console.log(formFields);
					}
				},
				onHidden: (evt) => {
					// Save the form.
					$.ajax({
						url: "/admin/saveGroup",
						method: "POST",
						data: formFields
					}).done(function(data, textStatus, jqXHR) {
						document.location.reload();
					}).fail(function(jqXHR, textStatus, errorThrown) {
						
					});
				}
			});
		}).fail(function(jqXHR, textStatus, errorThrown) {
			bootbox.alert(errorThrown);
		}).always(function() {
			load_off();
		});
	}
}
