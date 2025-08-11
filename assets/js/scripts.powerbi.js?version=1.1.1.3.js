var _powerbi = (function () {
	return {
		getReport: function (rID) {

			ajaxCall('reports','loadPowerbiReport',{ view: page_action, rID: rID },function(output){
				var report = JSON.parse(output);
				if (report.message != undefined) {
					$('#reportContainer').html(report.message);
					return;
				}
				var reportId = report.reportId;
				var rtype = report.rtype;
				var url = report.url;
				var token = report.token;
				_powerbi.showReport_v2(reportId,rtype,url,token);
			});
		},
		showReport: function (reportID,rtype,url,token) {

			// console.log(output);
			// return false;

			// var output = JSON.parse(output);
			// var url = output.url;
			// var token = output.token;

			// Get models. models contains enums that can be used.

			var models = window['powerbi-client'].models;

			// Embed configuration used to describe the what and how to embed.
			// This object is used when calling powerbi.embed.
			// This also includes settings and options such as filters.
			// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.

			var embedConfiguration = {
				type: rtype,
				// id: '3a4e5e99-f854-48c8-a40f-31139b7459c7', // the report ID
				// id: reportID, // the report ID
				embedUrl: url,
				accessToken: token,

				settings: {
					// hideErrors: true
					filterPaneEnabled: false,
					bars:{
						actionBar: {
							visible: true
						}
					}
					// navContentPaneEnabled: false
				}
			};

			switch (typeof reportID != null) {
				case 'report':
					embedConfiguration.id = reportID
					break;
			}

			// console.log(embedConfiguration);

			var $reportContainer = $('#reportContainer');

			var report = powerbi.embed($reportContainer.get(0), embedConfiguration);

		},

		showReport_v2: function (reportID,rtype,embedUrl,token) {

			window.onpopstate = function (popstate) {
				console.log("popstate fired!");
				console.log(popstate);
				// check if popstate is available; this means user is hitting back button and 
				// we need to load the associated powerbi artifact for that nav history
				if (popstate.state != null) {
					powerbi_embed(popstate.state.type, popstate.state.id, popstate.state.embedUrl,
						popstate.state.viewMode, popstate.state.pageName);
				}
			};
			// I pass in a Model from MVC; if page is manually refreshed, load dash from Model always
			$(document).ready(function () {
				// _powerbi.powerbi_embed('@Model.Type', '@Model.Id', '@Model.EmbedUrl', '@Model.ViewMode', "", token);
				_powerbi.powerbi_embed(rtype, reportID, embedUrl, "reportsTest", token);
			});

		},

		// Core helper to embed a powerbi artifact into the page dynamically
		powerbi_embed: function(type, id, embedUrl, pageName, token) {

			var models = window['powerbi-client'].models;
			// console.log(models);

			var retObj = null;

			// create embed config
			var embedConfig = {
				type: type,
				id: id,
				embedUrl: embedUrl,
				viewMode: models.ViewMode.View,
				tokenType: 1,
				tokenType: models.TokenType.Aad,
				accessToken: token,
				pageView: 'fitToWidth', // applies to Dashboard only; for Report, see below
				pageName: pageName,
				// See https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_powerbi_models_dist_models_d_.isettings.html
				settings: {
					filterPaneEnabled: false,
					navContentPaneEnabled: true,
					// background: models.BackgroundType.Transparent,
					// START Report specific settings
					// layoutType: models.LayoutType.Custom,
					customLayout: {
						displayOption: models.DisplayOption.FitToPage
					}
				}
			}
			
			// console.log(embedConfig);

			// switch (typeof reportID != null) {
			//	 case 'report':
			//		 embedConfig.id = reportID
			//		 break;
			// }

			// create new embed element (workaround due to errors from powerbi wrt embedding pbi into an already embedded element)
			$('#topLevelContainer').html("");
			var newEl = $("<div id='reportContainer' class='powerbi-reportContainer'></div>");
			$('#topLevelContainer').append(newEl);

			// embed
			retObj = powerbi.embed(newEl.get(0), embedConfig);

			retObj.on("pageChanged", function (e) {
				keepAlive();
			});

			// store the CURRENT embedConfig in the page's popstate
			history.replaceState(embedConfig, 'title');

			/************ HANDLE CLICKTHRU SCENARIOS ****************/
			// register for tileClicked event only for dashboards (reports are not clickable, and do not raise this event)
			if (type === 'dashboard') {
				retObj.on('tileClicked', function (event) {
					// console.log(event);
					// in some cases, powerbi event does not contain a valid reportEmbedUrl
					if (event.detail.reportEmbedUrl === "") {
						// console.log("reportEmbedUrl is empty in tileClicked event, no-oping. This happens for filtered links.")
						return;
					}

					// preserve history so back nav works
					// console.log("tileClicked fired; save CURRENT powerbi state in popstate");
					history.pushState(embedConfig, 'title');

					_powerbi.powerbi_embed(
						"report",
						"", // can be left empty as reportId comes as part of reportEmbedUrl
						event.detail.reportEmbedUrl,
						// models.ViewMode.View,
						event.detail.pageName
						,token
						);
				});
			}
			return retObj;
		},
		fullscreen: function() {
			var reportContainer = $('#reportContainer')[0];
			report = powerbi.get(reportContainer);
			report.fullscreen();
		}
	};

})();
