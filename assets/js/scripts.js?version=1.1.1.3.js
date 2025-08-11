/**
 * These are the global variables.
 */
page_action = location.href.substr(location.href.lastIndexOf('/') + 1).replace('#','');
parts = location.href.split('/');
page_controller = parts[3];
page_method = parts[4];
intervals = [];

$(document).ready(function(){

	// Check for timeout.
	var now = moment();
	if (intervals["last_activity"] == undefined) {
		intervals["last_activity"] = now.format("YYYYMMDD HH:mm:ss");
	}
	var expiry = moment(intervals["last_activity"], "YYYYMMDD HH:mm:ss").add(30, "s");
	if (expiry.isBefore(now)) {
		// Log out.
		console.log("Logout");
	} else {
		// Update the last activity.
		intervals["last_activity"] = now.format("YYYYMMDD HH:mm:ss");
	}
	if (getCookie("loggedIn") != "") {
		intervals["inactivityWarning"] = setTimeout(logoutWarning, 1500000);
		intervals["loggedOut"] = setTimeout(logout, 1770000);
	}
	
	var path = window.location + '';
	var path_parts = path.split("/");
	var root = path_parts[2];

	ROOT_URL = '//'+root+'/';

	init_forms();

	$('a.prevent').click(function(e) {
		e.preventDefault();
		return false;
	});

	$(window).on('beforeunload', function(){
		load();
	});

	$('.form-datetime').each(function () {
		var format = $(this).hasClass('form-date-full') ? 'yyyy-mm-dd 00:00:00' : 'dd/mm/yyyy';
		$(this).datepicker({
			format: format
		});
	});

	init_contextual(page_controller,page_method);

	window['personnel_list'] = null;

});

function init_forms() {

	$('.form-date').each(function() {

		$(this).addClass('notype');
		$(this).keydown(function(){ return false });

		var format = ($(this).hasClass('form-date-full') ? 'yyyy-mm-dd 00:00:00' : ($(this).hasClass('form-date-db') ? 'yymmdd' : 'dd/mm/yy'));

		$(this).datepicker({
			dateFormat: format
			,widgetParent: $('#dateButton')
		}).on('changeDate', function (ev) {
			ev.preventDefault();
			if ($(this).attr('data-onClickFunc') != 'undefined') {
				var func = new Function($(this).attr('data-onClickFunc'));
				func();
			}
		});

		$(this).removeClass('form-date');
		$(this).attr("placeholder", format).datepicker();

	});

	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	});

	$('[data-toggle="tooltip"]').tooltip();

	setTimeout(function(){
		$('[data-toggle="tooltip_p"]').tooltip(
			{
				trigger: 'manual'
			}
		).tooltip('show');
	},500);

}


function init_contextual(controller,method){

	var controller_method = controller+'/'+method;
	controller_method = controller_method.split('#');
	controller_method = controller_method[0].split('?');
	controller_method = controller_method[0];

	var chat_id = getUrlParameter('chat');
	var inactive = getUrlParameter('inactive');

	switch (controller_method) {
		case 'reports/manageReports':
			$("#manageReports").bootstrapTable({
				search: true,
				sortable: true,
				showColumns: true,
				showColumnsToggleAll: true,
			});
			break;
		case 'user/login':
			if (inactive != "") {
				bootbox.alert({
					title: "Logged Out",
					message: "You were logged out due to inactivity."
				});
			}
			break;
		case 'commentary/edit':
			commentary.edit_load();
			break;
		case 'commentary/schedule':
			commentary.schedule_load();
			break;
		case "reports/viewPBIReport":
			const reportContainer = document.querySelector("#reportContainer");
			reportContainer.addEventListener("click", function (e) {
				console.log("Report Container Clicked");
			});
			break;
		default:
			break;
	}

	if (sessionUser != null) {
	}

}

function load(){
	var target = $('.body');
	$('body').addClass('load_spinner');
	$(target).addClass('blur');
}

function load_target(target){

	$(target).addClass('load_spinner_target');

}

function load_target_off(){

	$('.load_spinner_target').removeClass('load_spinner_target');

}

function load_target_rel(target){
	$(target).addClass('load_spinner_rel');
}

function load_target_rel_off(){

	$('.load_spinner_rel').removeClass('load_spinner_rel');

}

function load_off(){
	var target = $('.body');
	$('body').removeClass('load_spinner');
	$(target).removeClass('blur');
}

function enter_pressed(e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return false;
	return (keycode == 13);
}

function create_modal_basic(e,obj) { /* title, text */

	if (e) { e.preventDefault(); };

	$('*').blur();

	var modal = document.createElement('div');
	modal.className = 'modal fade';
	modal.role = 'dialog';
	modal.style.display = 'none';
	document.body.appendChild(modal);

	var modalDialog = document.createElement('div');
	modalDialog.className = 'modal-dialog modal-dialog-centered';
	modal.appendChild(modalDialog);

		var modalContent = document.createElement('div');
		modalContent.className = 'modal-content';
		modalDialog.appendChild(modalContent);

			var modalHeader = document.createElement('div');
			modalHeader.className = 'modal-header';
			modalContent.appendChild(modalHeader);

			var modalHeader_title = document.createElement('h4');
			modalHeader_title.className = 'modal-title';
			modalHeader_title.innerHTML = obj.title;
			modalHeader.appendChild(modalHeader_title);

			var modalHeader_close = document.createElement('button');
			modalHeader_close.className = 'close';
			modalHeader_close.type = 'button';
			modalHeader_close.setAttribute('data-dismiss','modal');
			modalHeader_close.setAttribute('aria-label','aria-label');
			modalHeader.appendChild(modalHeader_close);

			var modalHeader_aria = document.createElement('span');
			modalHeader_aria.innerHTML = 'x';
			modalHeader_aria.setAttribute('aria-hidden','true');
			modalHeader_close.appendChild(modalHeader_aria);

			var modalBody = document.createElement('div');
			modalBody.className = 'modal-body';
			modalBody.innerHTML = obj.text;
			modalContent.appendChild(modalBody);

			var modalFooter = document.createElement('div');
			modalFooter.className = 'modal-footer';
			modalContent.appendChild(modalFooter);

				var modalFooter_dismiss = document.createElement('button');
				modalFooter_dismiss.className = 'btn btn-primary';
				modalFooter_dismiss.type = 'button';
				modalFooter_dismiss.innerHTML = 'OK';
				modalFooter_dismiss.setAttribute('data-dismiss','modal');
				modalFooter.appendChild(modalFooter_dismiss);

	$(modal).modal('show');

	$(modal).on('hidden.bs.modal', function () {
		$(modal).data('bs.modal', null).remove();
	});

	return modal;

}

/**
 * 
 * @param {*} obj 
 */
function create_modal_content(obj) {

	$('*').blur();

	var modal = document.createElement('div');
	modal.id = obj.id;
	modal.className = 'modal fade';
	modal.role = 'dialog';
	modal.style.display = 'none';
	// modal.style.width = obj.width;
	document.body.appendChild(modal);

	var modalDialog = document.createElement('div');
	//console.log (typeof obj.classes);
	modalDialog.className = 'modal-dialog modal-dialog-centered ' + (typeof obj.classes != 'undefined' ? obj.classes : '');

	modal.appendChild(modalDialog);

	var modalContent = document.createElement('div');
	modalContent.className = 'modal-content';
	modalDialog.appendChild(modalContent);

	var modalHeader = document.createElement('div');
	modalHeader.className = 'modal-header';
	modalContent.appendChild(modalHeader);

	var modalHeader_title = document.createElement('h4');
	modalHeader_title.className = 'modal-title';
	modalHeader_title.innerHTML = obj.title;
	modalHeader.appendChild(modalHeader_title);

	var modalBody = document.createElement('div');
	modalBody.className = 'modal-body';
	modalContent.appendChild(modalBody);

	if (obj.footer) {
		var modalFooter = document.createElement('div');
		modalFooter.className = 'modal-footer';
		modalContent.appendChild(modalFooter);
	}
	if (obj.onShown) {
		$(modal).on('shown.bs.modal', () => {
			obj.onShown();
		});
	}

	$(modal).modal('show');

	$(modal).on('hidden.bs.modal', function () {
		$(modal).data('bs.modal', null).remove();
	});
	return modal;
}

function removeModal(modal) {

	$(modal).modal('hide').on('hidden.bs.modal', function () {
		$(modal).data('bs.modal', null);
	$	(modal).remove();
	});

}

function create_modal_load(e,obj) { /* title, text */

	if (e) { e.preventDefault(); };

	var modal = document.createElement('div');
	modal.id = obj.id;
	modal.className = 'modal fade validator';
	modal.role = 'dialog';
	modal.style.display = 'none';
	document.body.appendChild(modal);

	var modalDialog = document.createElement('div');
	modalDialog.className = 'modal-dialog modal-dialog-centered';
	modal.appendChild(modalDialog);

		var modalContent = document.createElement('div');
		modalContent.className = 'modal-content';
		modalDialog.appendChild(modalContent);

			var modalBody = document.createElement('div');
			modalBody.className = 'modal-body';
			modalBody.innerHTML = obj.text;
			modalContent.appendChild(modalBody);

			var progress = document.createElement('div');
			progress.className = 'progress w-100';
			// progress.style.width = 'progress';

			var progress_inner = document.createElement('div');
			progress_inner.className = 'progress-bar progress-bar-striped progress-bar-animated w-100';
			progress_inner.role = 'progressbar';
			progress.appendChild(progress_inner);

			modalBody.appendChild(progress);

	$(modal).modal('show');

	$(modal).on('hidden.bs.modal', function () {
		$(modal).data('bs.modal', null).remove();
	});

	return modal;

}

function create_toast_basic(obj) { /* title, text */

	// if (e) { e.preventDefault(); };

	var toaster = document.getElementById('toaster');

	var toast = document.createElement('div');
	toast.className = 'toast';
	toast.role = 'alert';
	// toast.id = obj.id;
	$(toast).attr('aria-live','assertive');
	$(toast).attr('aria-atomic','true');
	// $(toast).css('position','absolute');
	// $(toast).css('top','0');
	// $(toast).css('left','0');
	toaster.appendChild(toast);

	// <img src="..." class="rounded mr-2" alt="...">
	// <strong class="mr-auto">Bootstrap</strong>
	// <small class="text-muted">just now</small>
	// <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
	// <span aria-hidden="true">&times;</span>
	// </button>

		var toastHeader = document.createElement('div');
		toastHeader.className = 'toast-header';
		// $(toastHeader).html(obj.msg);
		toast.appendChild(toastHeader);

			var title = document.createElement('strong');
			title.className = 'mr-auto';
			$(title).html('Alert');
			toastHeader.appendChild(title);

			var small = document.createElement('small');
			small.className = 'text-muted';
			$(small).html('just now');
			toastHeader.appendChild(small);

			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'ml-2 mb-1 close';
			$(btn).attr('data-dismiss','toast');
			$(btn).attr('data-label','Close');
			$(btn).html('<span aria-hidden="true">&times;</span>');
			toastHeader.appendChild(btn);

		var toastBody = document.createElement('div');
		toastBody.className = 'toast-body';
		$(toastBody).html(obj.msg);
		toast.appendChild(toastBody);

	$(toast).toast({ delay: 5000 });
	$(toast).toast('show');
	
	$(toast).on('hidden.bs.toast', function () {
		$(toast).data('bs.toast', null).remove();
	});

	return toast;

}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function post(path, params, method) {

	method = method || "post"; // Set method to post by default if not specified.

	// The rest of this code assumes you are not using a library.
	// It can be made less wordy if you use one.
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", ROOT_URL + path);

	for(var key in params) {
			if(params.hasOwnProperty(key)) {
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", params[key]);

					form.appendChild(hiddenField);
			}
	}

	document.body.appendChild(form);
	form.submit();
}

function validateForm(e,id,callback) {

	e.preventDefault();
	
	var custom_checks = form_checks(id);

	var form = document.getElementById(id);
	if (form.checkValidity() === false) {
		// e.preventDefault();
		// e.stopPropagation();
	} else {
		if (typeof callback == 'function') {
			callback();
		}
	}
	form.classList.add('was-validated');

}

function target_selector_feedback(id,bool) {

	$('#'+id).nextAll(".target-selector-feedback:first").css('display',(bool ? 'block' : 'none'));

}

function testJSON(text){
	if (typeof text!=="string"){
		return false;
	}
	try{
		JSON.parse(text);
		return true;
	}
	catch (error){
		return false;
	}
}

function form_checks(formname) {

	// alert(formname);

	$('#'+formname+' .checklist').each(function(){

		// only run this if one box is REQUIRED to start with
		if ($(this).find('.custom-control-input:required').length > 0) {

			// alert($(this).attr('name'));
			// console.log('checklist');

			var one_checked = false;
			$(this).find('.custom-control-input').each(function(){

				// custom-control-input
				// console.log($(this).prop('checked'));
				if ($(this).prop('checked')) {
					one_checked = true;
				}

			});

			// console.log(one_checked);

			if (one_checked) {
				$(this).find('.custom-control-input').attr('required',false);
			} else {
				$(this).find('.custom-control-input').attr('required',true);
			}
		}

	});


}

function highlight_pulse(id) {

	var original_colour = $('#'+id+'_card').css('background-color');
	// console.log(original_colour);

	$('#'+id+'_card').css('background-color','#f4f4b6');

	setTimeout(function() {
		$('#'+id+'_card').animate({
			backgroundColor: original_colour
		}, 1000 );
	},1000);

}

function set_dependents(jsn,val) {

	var jsn = JSON.parse(jsn);

	// console.log(jsn,val);

	for (var i=0; i<jsn.length; i++) {
		// console.log(jsn[i]);

		var list = jsn[i].fConditional_value_list.split(',');

		// console.log('[name="'+jsn[i].fieldID+'[]"]');
		// console.log(	$('[name="'+jsn[i].fieldID+'[]"]').length );

		if (list.includes(val)) {
			// alert(jsn[i].fieldID);
			// $('#'+jsn[i].fieldID+'-wrapper').show();
			// $('#'+jsn[i].fieldID+'-wrapper').css('display','-ms-flexbox');
			// $('#'+jsn[i].fieldID+'-wrapper').css('display','flex');
			$('#'+jsn[i].fieldID+'-wrapper').css('display','block');
			$('[name="'+jsn[i].fieldID+'[]"]').prop('required',true);

			var new_label = $('#'+jsn[i].fieldID+'-wrapper').find('label:first').html().replace(' *','');
			new_label = new_label + ' *';
			$('#'+jsn[i].fieldID+'-wrapper').find('label:first').html(new_label);

		} else {
			$('[name="'+jsn[i].fieldID+'[]"]').attr('required',false);
			$('#'+jsn[i].fieldID+'-wrapper').css('display','none');

			var new_label = $('#'+jsn[i].fieldID+'-wrapper').find('label:first').html().replace(' *','');
			$('#'+jsn[i].fieldID+'-wrapper').find('label:first').html(new_label);

		}

	}

	// console.log(jsn.fConditional_value_list);

}

function checkAll(src,classn) {
	// $("."+classn).click(function(){
		$('.'+classn).not(src).prop('checked', src.checked);
	// });
}

function checkReset(selectAll,classn) {

	// $('.'+classn).not('#'+selectAll).prop('checked', src.checked);

	var numCheckboxes = $('.'+classn).not('#'+selectAll);
	var numChecked = $('.'+classn+':checked').not('#'+selectAll);

	if (numCheckboxes != numChecked) {
		$('#'+selectAll).prop('checked',false);
	}

}

function form_disable_save(mode) {

	if (mode === undefined) {
		mode = 'save';
	}
	// console.log(mode);

	switch (mode) {
		case 'save':
			var text = 'Saving...';
			var icon = 'save';
			break;
	
		case 'submit':
			var text = 'Submitting...';
			var icon = 'paper-plane';
			break;

		default:
			var text = 'Saving...';
			var icon = 'save';
			break;
	}

	var newButton = document.createElement('a');
	$(newButton).addClass('btn btn-primary disabled text-white');
	$(newButton).prop('disabled',true);
	$(newButton).html('<i class="fas fa-'+icon+'"></i>&nbsp;'+text);

	$(newButton).insertAfter($('.form-save'));
	// $('.form-save').parent().append(newButton);
	$('.form-save').hide();

	$('.form-save-hide').hide();

}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

function updateURL(params) {

	// console.log(params);
	// return false;

	var append = '';
	var counter = 0;
	// for (const [key, value] of Object.entries(params)) {
	for (var key in params) {
		var value = params[key];

		append+= (counter == 0 ? '?' : '&');
		append+= key+'='+value;
		counter++;
	}

	if (history.pushState) {
		// var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+param+'='+value;

		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + append;
		window.history.pushState({path:newurl},'',newurl);
	}
}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function diff_minutes(dt2, dt1) {

	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= 60;
	return Math.abs(Math.round(diff));
  
}

function changeFilter(){
	var filterSelect = document.getElementById("filterSelect");
	var filterByWords = document.getElementById("filterByWords");
	var filterByCategories = document.getElementById("filterByCategories");
	var filterSelected = filterSelect.options[filterSelect.selectedIndex].value;

	if (filterSelected == 1) {
		filterByWords.classList = "form-group row text-left";
		filterByCategories.classList = "form-group row text-left d-none";
		$('.btn-sq').show(); 
		if ($('.btn-sq:visible').length == 0) {
			$('.filter-none-found').css('display','block');
		} else {
			$('.filter-none-found').hide();
		}
	}
	if (filterSelected == 2) {
		filterByWords.classList = "form-group row text-left d-none";
		filterByCategories.classList = "form-group row text-left";
		$('.btn-sq').show(); 
		if ($('.btn-sq:visible').length == 0) {
			$('.filter-none-found').css('display','block');
		} else {
			$('.filter-none-found').hide();
		}
	}

}

function toggleKeyword(val) {

	if (val != '') {
		$('.btn-sq').each(function() {
			var keywords = $(this).attr('data-keywords');

			if (keywords !== undefined) {
				keywords = keywords.split(',');
				var one_match = false;
				for (var i=0; i<keywords.length; i++) {
					if (keywords[i].indexOf(val.toLowerCase()) != -1) {
						one_match = true;
					}
				}
				if (keywords.join(' ').indexOf(val.toLowerCase()) != -1) {
					one_match = true;
				}
				if (one_match) {
					$(this).show();
				} else {
					$(this).hide();
				}
			} else {
				$(this).hide();
			}
		});
		if ($('.btn-sq:visible').length == 0) {
			$('.filter-none-found').css('display','block');
		} else {
			$('.filter-none-found').hide();
		}
	} else {
		$('.btn-sq').show();
		$('.filter-none-found').hide();
	}
}

function categoryFilter() {
	var select = document.getElementById("select");
	var selected = select.options[select.selectedIndex].value;
	var selectedCategory = select.options[select.selectedIndex].innerHTML;

	if (selected){
		// console.log(selectedCategory);
		$('.btn-sq').each(function() {
			var category = $(this).attr('data-category');
			var one_match = false;
			if (category == selectedCategory) {
				one_match = true;
				if (one_match) {
					$(this).show();
				} else {
					$(this).hide();
				}
			} else {
				$(this).hide();
			}
		});
		if ($('.btn-sq:visible').length == 0) {
			$('.filter-none-found').css('display','block');
		} else {
			$('.filter-none-found').hide();
		}
	} else {
		$('.btn-sq').show();
		$('.filter-none-found').hide();
	}
}

/** Logout Warning. */
function logoutWarning() {
	bootbox.confirm({
		title: "Logout Warning.",
		message: "You will be logged out in 5 minutes due to inactivity.  Click OK to continue without logging out.",
		swapButtonOrder: true,
		callback: function(result) {
			// If the use clicked OK then reset the timer, but also run an AJAX request to reset the timer on the server too.
			if (result) {
				keepAlive();
			} else {
				// Do nothing.
			}
		}
	});
}

/**
 * Keep Alive
 */
function keepAlive() {
	$.ajax({
		url: "/home/keepalive"
	}).done(function (data, textStatus, jqXHR) {
		console.log(data);
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log(errorThrown);
	});
	// Set the warning timer.
	clearTimeout(intervals["inactivityWarning"]);
	intervals["inactivityWarning"] = setTimeout(logoutWarning, 1500000);
	// Reset the logout timer.
	clearTimeout(intervals["loggedOut"]);
	intervals["loggedOut"] = setTimeout(logout, 1770000);
}
/** Logout */
function logout() {
	// bootbox.hideAll();
	// bootbox.alert({
	// 	title: "Logged Out.",
	// 	message: "You have been logged out due to inactivity.",
	// 	onHidden: function (e) {
			window.location.href = "/user/logout?inactivity=true";
	// 	}
	// });
}
/**
 * Get cookie
 * @param {*} cname 
 */
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function selectAll(selectBox,selectAll) {
	// have we been passed an ID 
	if (typeof selectBox == "string") {
		selectBox = document.getElementById(selectBox);
	}
	// is the select box a multiple select box?
	if (selectBox.type == "select-multiple") {
		for (var i = 0; i < selectBox.options.length; i++) {
			 selectBox.options[i].selected = selectAll;
		}
	}
}
