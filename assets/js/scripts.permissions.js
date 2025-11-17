var permissions = {
	reportAccess_onLoad: function () {

	},
	btnAddGroup_click: function (evt, sender) {
		// Load the modal.
		var dataObj = {
			rObjectName: $("#rObjectName").val()
		};
		$.ajax({
			url: "/permissions/addGroup",
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR) {
			bootbox.confirm({
				title: "Add Group",
				message: data,
				swapButtonOrder: true,
				buttons: {
					confirm: {
						label: 'Save'
					},
					cancel: {
						label: 'Cancel'
					}
				},
				callback: function(result) {
					if (result) {
						permissions.saveGroup();
					}
				}
			});
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	},
	btnAddIndividual_click: function(evt, sender) {
		// Load the modal.
		var dataObj = {
			rObjectName: $("#rObjectName").val()
		};
		$.ajax({
			url: "/permissions/addPeople",
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR) {
			bootbox.confirm({
				title: "Add Individual",
				message: data,
				swapButtonOrder: true,
				buttons: {
					confirm: {
						label: 'Save'
					},
					cancel: {
						label: 'Cancel'
					}
				},
				callback: function(result) {
					if (result) {
						permissions.savePerson();
					}
				}
			});
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	},
	txtSearchText_input: function (evt, sender) {
		if (sender.value.length > 2) {
			var dataObj = {
				rSearchTerm: sender.value,
				rExternal: sender.dataset.external
			};
			$.ajax({
				url: "/permissions/searchPeople",
				method: "POST",
				data: dataObj
			}).done(function(data, textStatus, jqXHR) {
				// Clear the select list and re-populate.
				$('#cboPeople option').remove();
				$('#errorText').html('');
				try {
					var people = JSON.parse(data);
					for(var i = 0; i < people.length; i++) {
						var person = people[i];
						$('#cboPeople').append($('<option>', {
							value: person.PERSONNEL_NUMBER,
							text: (person.LRA_SHORT_DESC == null ? '' : person.LRA_SHORT_DESC + ' ') + person.FIRSTNAME + ' ' + person.LASTNAME + ' (' + person.ESM_ESTAB_DESC + ')',
							class: (person.SOURCE == "External" ? 'bg-dark text-white' : '')
						}).attr('data-source', person.SOURCE));
					}
				} catch (e) {
					$('#errorText').html(e.message);
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				$('#errorText').html(errorThrown);
			});
		}
	},
	/**
	 * Save the selected groups.
	 */
	saveGroup: function() {
		var groups = $('#cboGroupList').val();
		var objectName = $('#rAddGroupObjectName').val();
		var dataObj = {
			rGroupRefs: groups,
			rObjectName: objectName
		};
		$.ajax({
			url: "/permissions/addAccessGroups",
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR) {
			if (data != "OK") {
				bootbox.alert({
					title: "Error adding group.",
					message: data
				});
			} else {
				window.location.reload();
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	},
	/**
	 * Save the selectec person to a group.
	 */
	savePerson: function() {
		var personRef = $('#cboPeople').val();
		var objectName = $('#rAddGroupObjectName').val();
		var personSource = $('#cboPeople option:selected').data("source");
		var dataObj = {
			rPersonRef: personRef,
			rObjectName: objectName,
			rSource: personSource
		};
		$.ajax({
			url: "/permissions/addAccessPerson",
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR) {
			if (data != "OK") {
				bootbox.alert({
					title: "Error adding group.",
					message: data
				});
			} else {
				window.location.reload();
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown + '<br>' + jqXHR.responseText
			});
		});
	},
	/**
	 * Remove access to an object.
	 * @param {*} evt 
	 * @param {*} sender 
	 */
	btnRemoveAccess_click: function (evt, sender) {
		var linkRef = sender.dataset.linkRef;
		var objectName = sender.dataset.objectName;
		bootbox.confirm({
			title: "Remove Permissions",
			message: "Confirm you want to remove access.",
			buttons: {
				confirm: {
					label: "Yes"
				},
				cancel: {
					label: "No"
				}
			},
			swapButtonOrder: true,
			callback: function(result) {
				if (result) {
					permissions.removeAccessToObject(objectName, linkRef);
				}
			}
		})
	},
	/**
	 * 
	 * @param {*} objectName 
	 * @param {*} linkRef 
	 */
	removeAccessToObject(objectName, linkRef) {
		var dataObj = {
			rObjectName: objectName,
			rLinkRef: linkRef
		};
		$.ajax({
			url: "/permissions/removeAccess",
			method: "POST",
			data: dataObj
		}).done(function (data, textStatus, jqXHR) {
			if (data != "OK") {
				bootbox.alert({
					title: "Error Removing Access",
					message: data
				});
			} else {
				window.location.reload();
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	},
	btnGroupMembers_click: function(evt, sender) {
		var dataObj = {
			rLinkRef: sender.dataset.linkRef,
			rObjectName: sender.dataset.objectName
		};
		$.ajax({
			url: "/permissions/groupMembers",
			method: "POST",
			data: dataObj
		}).done(function(data, textStatus, jqXHR) {
			bootbox.alert({
				title: "Group Members",
				message: data
			});
		}).fail(function(jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			});
		});
	}
}
