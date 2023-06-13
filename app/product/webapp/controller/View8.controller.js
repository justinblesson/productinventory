sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library"

], function(Controller,JSONModel, Filter,  FilterOperator,FilterType, MessageBox, MessageToast,Fragment,Spreadsheet,exportLibrary) {
	"use strict";
	var username,email,count = 0,checkout = [],transfer_cart = [];
	var EdmType = exportLibrary.EdmType;
	return Controller.extend("product.product.controller.View8", {
       
		onInit : function () {
			// var oJSONData = {
			// 	busy : false
			// };
			// var oModel = new JSONModel(oJSONData);
			

			//this.getView().setModel(oModel, "appView");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View8").attachMatched(this._onRouteMatched, this);
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var d =  oDateFormat.format(new Date());
                var tranferdetails = [];
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/productinventory/productinvent",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        console.log("User details fetch is successful " );                       

                      data.value.forEach(transfer=> { 
						    if (oDateFormat.format(new Date(transfer.expiry_date)) < d ){
								transfer.status = "Error" 
								transfer.icon = "sap-icon://error"
								transfer.status_text = "Product Expired"                     
                                tranferdetails.push(transfer);
							}
                            else 
							if(transfer.stocks >= 500 ) {  
								transfer.status = "Success" 
								transfer.icon = "sap-icon://sys-enter-2"
								transfer.status_text = "In Stock"                     
                                tranferdetails.push(transfer);
                            }else if(transfer.stocks > 0 && transfer.stocks < 500 ){
                                transfer.status = "Warning" 
								transfer.icon = "sap-icon://alert"
								transfer.status_text = "Shortage"                     
                                tranferdetails.push(transfer);
							}
							else if(transfer.stocks === 0 ){
                                transfer.status = "Indication01" 
								transfer.icon = "sap-icon://error"
								transfer.status_text = "Out of Stock"                     
                                tranferdetails.push(transfer);
							}                              
                        })
                    
                    },
                    error: function (data, textStatus, jqXHR) {
                        MessageBox.error("Error occurred in getting user details ");
                    }
                });
			  transfer_cart = tranferdetails;
              var oModelt = new sap.ui.model.json.JSONModel( { transfer : tranferdetails} );              
			  this.getView().setModel(oModelt, 'transfer');
		},
		_onRouteMatched: function(oEvent) {
			 username  = oEvent.getParameter("arguments").username;
			 //email = oEvent.getParameter("arguments").email;
			 var u = username.slice(0,1); 
			 var oModelup = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/productinventory/",
				synchronizationMode: "None",
			});
			var oContextBinding = oModelup.bindContext("/usermaster('" + username + "')");
			oContextBinding.requestObject().then(function(result){
				email = result.email;
			});
			 var userdetails = [{
				"username": username,
				"email": email,
				"initial": u,
			  }];
			  //this.oModel = new sap.ui.model.json.JSONModel(userdetails );	
			  var oModel = new sap.ui.model.json.JSONModel( userdetails );              
			  this.getView().setModel(oModel, 'userdetails');
			 
		},
		handleDetailsPress: function(oEvent) {
			var oTable = this.byId("table1");
			var iIndex = oTable.getSelectedIndex();
			var sMsg,flag = 0;
			if (iIndex < 0) {
				
				sMsg = "No Product Selected";
				MessageToast.show(sMsg);
			} else {
				sMsg = oTable.getContextByIndex(iIndex);
				if (sMsg.getProperty("status") === "Success" ){
				// count = count + 1 ;
				// var oBadge= this.byId("badgeid");
			    // oBadge.setProperty("value", count);
				transfer_cart.forEach(transfer=> { 
					if(transfer.prod_id === sMsg.getProperty("prod_id")  ) { 
						flag = 0;   
						checkout.forEach(checkoutline=> {
							if ( checkoutline.prod_id === transfer.prod_id ){
								flag = 1;
								MessageToast.show("Product already added to cart");
							}
						 }) 
						 if ( flag === 0 ) {      
						checkout.push(transfer);
						MessageToast.show("Product added to cart");
						count = count + 1 ;
				var oBadge= this.byId("badgeid");
			    oBadge.setProperty("value", count);
						 }
						}
				})
			 }else if (sMsg.getProperty("status") === "Warning" ){
				MessageToast.show("Product can't be added to cart due to shortage of stocks");
			 }else if (sMsg.getProperty("status") === "Indication01" ){
				MessageToast.show("Product can't be added to cart due to unavailability of stocks");
			 }else if (sMsg.getProperty("status") === "Error" ){
				MessageToast.show("Product can't be added to cart it has been expired");
			 } 
			}
			//MessageToast.show(sMsg.getProperty("prod_id"));
			 //path is referring to element in array with index 1
			
		},		
		onSearch : function (oEvent) {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter([
					new Filter("prod_type", FilterOperator.Contains, sValue),
					new Filter("prod_name", FilterOperator.Contains, sValue),
					new Filter("prod_cat", FilterOperator.Contains, sValue),
					new Filter("prod_id", FilterOperator.Contains, sValue),
					new Filter("status_text", FilterOperator.Contains, sValue),
					new Filter("unit", FilterOperator.Contains, sValue)
				], false);
				//oFilter = new Filter("prod_type", FilterOperator.Contains, sValue);
                oView.byId("table1").getBinding("rows").filter(oFilter, FilterType.Application);

		},
		onCheckout: function(){
			var oModelcheck = new sap.ui.model.json.JSONModel();
			var oData = {
			   checkout: checkout
			}
			oModelcheck.setData(oData);
			sap.ui.getCore().setModel(oModelcheck, "checkout");             
			this.getRouter().navTo("View9",{
				username: username  } );     		
		},
				getRouter: function() {
				return this.getOwnerComponent().getRouter();
			},
		onCart: function()
		{
			var c = "StoreInfo";
			this.getView().byId(c).open();
		},
		onCancelDialog: function (oEvent) {
			oEvent.getSource().getParent().close();
			//this.resetForm();
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
		createColumnConfig: function() {
			return [
				{
					label: 'Product ID',
					property: 'prod_id',
					type: EdmType.String,
				},
				{
					label: 'Product Category',
					property: 'prod_cat',
					type: EdmType.String,
				},
				{
					label: 'Product Type',
					property: 'prod_type',
					type: EdmType.String,
				},
				{
					label: 'Product Name',
					property: 'prod_name',
					type: EdmType.String,
				},
				{
					label: 'Stocks',
					property: 'stocks',
					type: EdmType.Number,
				},
				{
					label: 'Units',
					property: 'unit',
					type: EdmType.Number,
				},
				{
					label: 'Status',
					property: 'status_text',
					type: EdmType.String,
				}];
		},
        onRefresh : function () {
	
			var oModelc = this.getView().getModel("transfer");

			// if (oBinding.hasPendingChanges()) {
			// 	MessageBox.error("Refresh Not Possible");
			// 	return;
			// }
			//oBinding.refresh();
			var tranferdetails = [];
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/productinventory/productinvent",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        console.log("User details fetch is successful " );                       

                      data.value.forEach(transfer=> { 
                            if(transfer.stocks >= 500 ) {  
								transfer.status = "Success" 
								transfer.icon = "sap-icon://sys-enter-2"
								transfer.status_text = "In Stock"                     
                                tranferdetails.push(transfer);
                            }else if(transfer.stocks > 0 && transfer.stocks < 500 ){
                                transfer.status = "Warning" 
								transfer.icon = "sap-icon://alert"
								transfer.status_text = "Shortage"                     
                                tranferdetails.push(transfer);
							}
							else if(transfer.stocks === 0 ){
                                transfer.status = "Indication01" 
								transfer.icon = "sap-icon://error"
								transfer.status_text = "Out of Stock"                     
                                tranferdetails.push(transfer);
							}                              
                        })
                    
                    },
                    error: function (data, textStatus, jqXHR) {
                        MessageBox.error("Error occurred in getting user details ");
                    }
                });
			;
			  var oData = {
				transfer: tranferdetails
			 }
			oModelc.setData(oData);
			var oBadge= this.byId("badgeid");
			    oBadge.setProperty("value", 0);
				oBadge.destroy();
		},
		onExport: function() {
			var aCols, oBinding, oSettings, oSheet, oTable;

			oTable = this.byId('table1');
			oBinding = oTable.getBinding('rows');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: { columns: aCols },
				dataSource: oBinding
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function() {
					MessageToast.show('Spreadsheet export has finished');
				}).finally(function() {
					oSheet.destroy();
				});
		},
		onHome: function(){
		                      
			this.getRouter().navTo("View2",{
				username: username } );     	

	},
			onNavBack: function(){
		                      
				this.getRouter().navTo("RouteView1");
	
			}
	});
});
