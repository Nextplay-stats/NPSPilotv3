var external = {
	activate: function(evt, sender) {
		var dataObj = {
			rUniqueID: sender.dataset.uniqueId
		};
		$.ajax({
			url: '/users/activateExternalAccount',
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR){
			bootbox.confirm({
				title: "Activate External Account",
				message: data,
				buttons: {
					confirm: {
						label: 'Activate',
						className: 'btn-primary'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-secondary'
					}
				},
				swapButtonOrder: true,
				callback: function (result) {
					// Confirm.
					if (result) {
						var form = document.getElementById("frmActivate");
						var dataObj = $(form).serializeArray();
						if (form.checkValidity() === false) {
							form.classList.add("was-validated");
						} else {
							$.ajax({
								url: "/users/activateExternalAccount",
								method: "POST",
								data: dataObj
							}).done(function (data, textStatus, jqXHR) {
								if (data == "OK") {
									bootbox.hideAll();
								} else {
									var errorResult = document.getElementById("errorResult");
									errorResult.innerHTML = data;
								}
							}).fail(function (jqXHR, textStatus, errorThrown) {
								var errorResult = document.getElementById("errorResult");
								errorResult.innerHTML = jqXHR.responseText;
							});
						}
						return false;
					} else {
						return true;
					}
				},
				onShown: function (e) {
					$("#txtValidStart,#txtValidEnd").datepicker({
						dateFormat: "dd/mm/yy",
						firstDay: 1
					});
				},
				onHidden: function (e) {
					window.document.location.reload();
				}
			})
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	},
	deactivate: function(evt, sender) {
		var dataObj = {
			rUniqueID: sender.dataset.uniqueId
		};
		$.ajax({
			url: '/users/deactivateExternalAccount',
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR){
			bootbox.confirm({
				title: "Deactivate External Account",
				message: data,
				buttons: {
					confirm: {
						label: 'Deactivate',
						className: 'btn-primary'
					},
					cancel: {
						label: 'Cancel',
						className: 'btn-secondary'
					}
				},
				swapButtonOrder: true,
				callback: function (result) {
					// Confirm.
					var rVal = true;
					if (result) {
						var form = document.getElementById("frmDeactivate");
						var dataObj = $(form).serializeArray();
						if (form.checkValidity() === false) {
							form.classList.add("was-validated");
						} else {
							$.ajax({
								url: "/users/deactivateExternalAccount",
								method: "POST",
								data: dataObj
							}).done(function (data, textStatus, jqXHR) {
								if (data == "OK") {
									rVal = true;
								} else {
									rVal = false;
								}
							}).fail(function (jqXHR, textStatus, errorThrown) {
								var errorResult = document.getElementById("errorResult");
								errorResult.innerHTML = errorThrown;
								rVal = false;
							});
						}
					}
					return rVal;
				},
				onShown: function (e) {
					$("#txtValidEnd").datepicker({
						dateFormat: "dd/mm/yy",
						firstDay: 1
					});
				},
				onHidden: function (e) {
					window.document.location.reload();
				}
			})
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	}
};
