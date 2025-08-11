/**
 * 
 * @param {string} controller 
 * @param {string} action 
 * @param {object} params 
 * @param {function} callback 
 */
function ajaxCall(controller,action,params,callback) {

	//console.log($params);

	// $(".tooltip").tooltip("destroy");

	var returnMe = false;

	var params = typeof params == undefined ? {} : params;
	var dataObj = params;

	if (typeof params.load == 'undefined' || params.load) {
		load();
	}

	if (typeof params.target != 'undefined') {
		// load_target(params.target);
		$(params.target).html('Loading...');
	}

	dataObj.syncTime = new Date();

	var ajaxObj = {
		type: "POST",
		// url: '/index.php?controller='+controller+'&action='+action,
		url: '/'+controller+'/'+action,
		data: dataObj,
		success: function(data){

			if (typeof callback == 'function') {
				setTimeout(function() {
					callback(data);
				},200);
			};

			setTimeout(function() {
				init_forms();
			},200);

			load_off();
			load_target_off();
			// $(".tooltip").tooltip("destroy");

		},
		error: function (xhr, status, errorThrown) {
			console.log(xhr.status);
			console.log(xhr.responseText);
			load_off();
			// $(".tooltip").tooltip("dispose");
		}
	};

	$.ajax(ajaxObj);

}

function ajaxSave(controller,action,params,callback) {

	// console.log(controller);
	// console.log(action);
	// console.log(params);

	$(".tooltip").tooltip("hide");

	var params = typeof params == undefined ? {} : params;
	var dataObj = params;

	if (typeof params.load == 'undefined' || params.load) {
		load();
	}

	// console.log(dataObj);

	dataObj.syncTime = new Date();

	$.ajax({
		type: "POST",
		// url: "ajax/ajax.php",
		// url: "ajax/"+$view+"/index.php",
		// url: $view,
		// url: '?controller=employeeSearch&action=doSearchFunction',
		url: '?controller='+controller+'&action='+action,
		data: dataObj,
		success: function(data){
			// console.log(data);

			// var obj = JSON.parse(data);

			// var returnRcvr = obj.string;

			// $("#fResults").html(data);
			// return data;
			callback(data);

			// function callback(data){ console.log(data); };

			load_off();

		},
		error: function (xhr, status, errorThrown) {
			console.log(xhr.status);
			console.log(xhr.responseText);
			load_off();
		}
	});

}

// function ajaxCall_external(url,params,callback) {

// 	var returnMe = false;

// 	var params = typeof params == undefined ? {} : params;
// 	var dataObj = params;

// 	if (typeof params.load == 'undefined' || params.load) {
// 		load();
// 	}

// 	dataObj.syncTime = new Date();

// 	var ajaxObj = {
// 	    type: "POST",
// 	    url: url,
// 	    data: dataObj,
// 	    success: function(data){

// 	        if (typeof callback == 'function') {
// 	        	setTimeout(function() {
// 	        		callback(data);
// 	        	},200);
// 	        };

// 	        setTimeout(function() {
//         		init_forms();
//         	},200);

// 	        load_off();
// 	        // $(".tooltip").tooltip("destroy");

// 	    },
// 		error: function (xhr, status, errorThrown) {
// 			console.log(xhr.status);
// 			console.log(xhr.responseText);
// 			load_off();
// 			// $(".tooltip").tooltip("dispose");
// 		}
// 	};

// 	$.ajax(ajaxObj);

// }
