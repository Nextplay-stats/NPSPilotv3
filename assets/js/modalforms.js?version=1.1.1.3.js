var modalforms = {
	formAddReport: function(e,ref) {

		e.preventDefault();

		var dataObj = {};
		dataObj.src = 'modal';
		dataObj.rRef = ref;

		var modal = create_modal_content({ id: 'modal_formAddReport', title: 'Add Report', classes: 'modal-lg' });
		load_target($(modal).find('.modal-body'));

		ajaxCall('reports','formAddReport',dataObj,function(output){

			$(modal).find('.modal-body').html(
				output
			);
			load_target_off();
			Tags.init('#cboGroups');

		});

	},

	saveAddReport: function(e) {

		if (e) { e.preventDefault(); };

		form_disable_save();

		const data = $("#formAddReport").serializeArray();

		ajaxSave('reports','saveAddReport',data,function(output) {
			if (testJSON(output)) {
				output = JSON.parse(output);
				var result = output.result;
				var messages = output.messages;
			} else {
				var result = output;
				var messages = [];
			}
			if (result === true) {
				location.href = '/reports/manageReports/';
			} else {
				console.log(result);
				$('.saveReturn').show().html('<i class="fas fa-times text-danger"></i>&nbsp;Update failed: '+messages.join(', '));
			}
		});

	},

	deleteReport: function(e,id) {

		e.preventDefault();

		var dataObj = {};
		dataObj.src = 'modal';
		dataObj.rID = id;

		bootbox.confirm({
			closeButton: false,
			title: "Confirm",
			message: 'The report will be deleted. Are you sure?', 
			swapButtonOrder: true,
			callback: function(result){
				if (result) {
					ajaxCall('reports','deleteReport',dataObj,function(output){

						// console.log(output);
						// return false;

						if (testJSON(output)) {
							output = JSON.parse(output);
							var result = output.result;
							var messages = output.messages;
						} else {
							var result = output;
							var messages = [];
						}

						// console.log('['+result+']');
						if (result === true) {

							location.href = '/reports/manageReports/';

						} else {

							console.log(output);
							$('.saveReturn').show().html('<div class="alert alert-danger" role="alert"><i class="fas fa-times"></i>&nbsp;Delete failed: '+messages.join(', ')+'</div>');
						}
					});
				}
			}
		});
	},

	formModifyReport: function(e,id) {
		e.preventDefault();
		var dataObj = {};
		dataObj.src = 'modal';
		dataObj.rID = id;
		var modal = create_modal_content({id: 'modal_formModifyReport', title: 'Modify Report', classes: 'modal-lg'});
		load_target($(modal).find('.modal-body'));
		ajaxCall('reports', 'formModifyReport', dataObj, function(output) {
			$(modal).find('.modal-body').html(
				output
			);
			Tags.init('#cboGroups');
			load_target_off();
		});
	},
	saveModifyReport: function(e,id) {

		if (e) { e.preventDefault(); };

		form_disable_save();

		const data = $('#formModifyReport').serializeArray();

		ajaxSave('reports','saveModifyReport',data,function(output) {

			// console.log(output);

			if (testJSON(output)) {
				output = JSON.parse(output);
				var result = output.result;
				var messages = output.messages;
			} else {
				var result = output;
				var messages = [];
			}

			// console.log('['+result+']');
			if (result === true) {

				location.href = '/reports/manageReports/';
				
			} else {

				console.log(result);
				$('.saveReturn').show().html('<i class="fas fa-times text-danger"></i>&nbsp;Update failed: '+messages.join(', '));
			}
		});
	},
	btnCopy_click: function (evt, sender) {
		var confirmed = false;
		bootbox.confirm({
			title: "Copy to External",
			message: "Confirm copy of live reports to External site.",
			swapButtonOrder: true,
			callback: function(result) {
				if (result) {
					confirmed = result;
				}
			},
			onHidden: function (e) {
				if (confirmed) {
					modalforms.copyToExternal();
				}
			}
		})
	},
	copyToExternal: function () {
		load();
		
		$.ajax({
			url: "/reports/updateExternalPowerBI"
		}).done(function(data, textStatus, jqXHR) {
			if (data == "OK") {
				bootbox.alert({
					title: "Data Copied",
					message: "Data copied sucessfully."
				});
			} else {
				bootbox.alert({
					title: "Error Copying Data",
					message: data
				});
			}
			load_off();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
			load_off();
		});
	}
};
