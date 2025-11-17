var users = {
	/**
	 * Get a list of users with access to object.
	 * @param {*} evt 
	 * @param {*} sender 
	 */
	btnInternal_click: function (evt, sender) {
		$('#colMembers').html('');
		var dataObj = {
			rObjectName: sender.dataset.objectName
		};
		$.ajax({
			url: "/users/accessList",
			method: "POST",
			data: dataObj
		}).done(function(data, textStatus, jqXHR) {
			// Convert the data from JSON to an object.
			try {
				var members = JSON.parse(data);
			} catch (e) {
				bootbox.alert({
					title: "Error",
					message: data
				});
				return;
			}
			// Show the members.
			for(var i = 0; i < members.length; i++) {
				var member = members[i];
				var memDesc = '<div class="border border-secondary rounded m-1 p-1"><i class="fas fa-user"></i>&nbsp;';
				memDesc+= (member.LRA_SHORT_DESC != "" ? member.LRA_SHORT_DESC + " " : "") + member.FIRSTNAME + " " + member.LASTNAME;
				memDesc+= '</div>';
				$('#colMembers').append(memDesc);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			bootbox.alert({
				title: "Error",
				message: errorThrown
			})
		});
	}
};
