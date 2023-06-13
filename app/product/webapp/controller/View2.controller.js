sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/TablePersoController"

], function(Controller,JSONModel, Filter,  FilterOperator,FilterType, MessageBox,Fragment, TablePersoController) {
	"use strict";
	var username,email;
	return Controller.extend("product.product.controller.View2", {
       
		onInit : function () {
			var oJSONData = {
				busy : false
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View2").attachMatched(this._onRouteMatched, this);

			// this._oTPC = new TablePersoController({
			// 	table: this.byId("productinvent"),
			// 	//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
			// 	componentName: "demoApp"
			// }).activate();

		},
		// onExit: function () {
		// 	this._oTPC.destroy();
		// },

		// onPersoButtonPressed: function (oEvent) {
		// 	this._oTPC.openDialog();
		// },

		// // onTablePersoRefresh : function() {
		// // 	DemoPersoService.resetPersData().done(
		// // 		function() {
		// // 			this._oTPC.refresh();
		// // 		}.bind(this)
		// // 	);
		// // },

		// onTableGrouping : function(oEvent) {
		// 	this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		// },

		_onRouteMatched: function(oEvent) {
			 username  = oEvent.getParameter("arguments").username;
			 //email = oEvent.getParameter("arguments").email;
			 var oModelup = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/productinventory/",
				synchronizationMode: "None",
			});
			var oContextBinding = oModelup.bindContext("/usermaster('" + username + "')");
			oContextBinding.requestObject().then(function(result){
				email = result.email;
			});
			 var u = username.slice(0,1); 
			 var userdetails = [{
				"username": username,
				"email": email,
				"initial": u,
			  }];
			  //this.oModel = new sap.ui.model.json.JSONModel(userdetails );	
			  var oModel = new sap.ui.model.json.JSONModel( userdetails );              
			  this.getView().setModel(oModel, 'userdetails');
			 
		},
		handleButtonPress: function (oEvent) {
			var userdetails = [{
				"username": username,
				"email": email,
			  }];
			  var oModel = new sap.ui.model.json.JSONModel(userdetails );	
			
			var oButton = oEvent.getSource(),
				oView = this.getView();
 
			
				if (!this._pPopover) {
					this._pPopover = this.loadFragment({
						id: oView.getId(),
						name: "product.product.view.Popover",
						controller: this
					}).then(function(oPopover) {
						oView.addDependent(oPopover);
						//oPopover.bindElement("/ProductCollection/0");
						return oPopover;
					});
				}
				this._pPopover.then(function(oPopover) {
					oPopover.setModel(oModel, 'userdetails');
					oPopover.openBy(oButton);
				});
		},
		onRefresh : function () {
	
			var oBinding = this.byId("productinvent").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("Refresh Not Possible");
				return;
			}
			oBinding.refresh();
			MessageBox.success("Data Refreshed");
		},
		onSearch : function (oEvent) {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				//oFilter = new Filter("prod_type", FilterOperator.Contains, sValue);
				oFilter = new Filter([
					new Filter("prod_type", FilterOperator.Contains, sValue),
					new Filter("prod_name", FilterOperator.Contains, sValue),
					new Filter("prod_cat", FilterOperator.Contains, sValue),
					new Filter("prod_id", FilterOperator.Contains, sValue),
					new Filter("unit", FilterOperator.Contains, sValue)
				], false);
                oView.byId("productinvent").getBinding("items").filter(oFilter, FilterType.Application);
		}, onCreate1: function(){		                      
					this.getRouter().navTo("View3",{
						username: username } );          		

			}, onCreate2: function(){
		                      
				this.getRouter().navTo("View7",{
					username: username } );     		
			}, onTransfer: function(){
		                      
				this.getRouter().navTo("View8",{
					username: username } );     		
			},
			onTrack: function(){
		                      
				this.getRouter().navTo("View10",{
					username: username } );     		
			},
			 onAnalytics: function(){
		                      
				this.getRouter().navTo("View4",{
					username: username } );     	
	
		}
			,
			onNavBack: function(){
		                      
				this.getRouter().navTo("RouteView1");
	
			},
			getRouter: function() {
				return this.getOwnerComponent().getRouter();
			},

			
	

	});
});
