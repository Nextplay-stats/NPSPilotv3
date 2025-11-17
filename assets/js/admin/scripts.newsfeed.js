let newsfeed = {
	add: (evt, sender) => {
		// Prevent button from being pressed again.
		sender.disabled = true;
		const id = parseInt(sender.dataset.id);
		$.ajax({
			url: "/admin/editNewsArticle",
			data: {rID: id},
			method: "POST"
		}).done(function(data, textStatus, jqXHR) {
			bootbox.confirm({
				title: "Add New",
				message: data,
				swapButtonOrder: true,
				callback: (r) => {
					// Save
					if (r) {
						const article = document.querySelector("#frmArticle");
						if (!article.checkValidity()) {
							article.classList.add("was-validated");
							return false;
						}
						newsfeed.save(document.querySelector("#txtID").value, document.querySelector("#txtHeading").value, document.querySelector("#txtContent").value);
					}
					return true;
				},
				onShown: (e) => {
					sender.disabled = false;
					document.querySelector("#txtHeading").focus();
				}
			});
		}).fail(function(jqXHR, textStatus, errorThrown ) {
			bootbox.alert({
				title: "Error",
				message: jqXHR.responseText
			});
			sender.disabled = false;
		});
	},
	save: (id, heading, content) => {
		load();
		$.ajax({
			url: "/admin/saveNewsArticle",
			method: "POST",
			data: {
				rID: id,
				rHeading: heading,
				rContent: content
			}
		}).done((data, textStatus, jqXHR) => {
			if (data != "OK") {
				bootbox.alert({
					title: "Error saving.",
					message: data
				});
			} else {
				document.location.reload();
			}
		}).fail((jqXHR, textStatus, errorThrown ) => {
			bootbox.alert({
				title: "Error",
				message: jqXHR.responseText
			});
		}).always(() => {
			load_off();
		});
	}
};
