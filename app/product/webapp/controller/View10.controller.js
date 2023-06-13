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
	return Controller.extend("product.product.controller.View10", {
       
		onInit : function () {
			// var oJSONData = {
			// 	busy : false
			// };
			// var oModel = new JSONModel(oJSONData);
			// this.getView().setModel(oModel, "appView");
			var oSettingsModel = new JSONModel({ navigatedItem: ""});
			this.getView().setModel(oSettingsModel, 'settings');
            var oModelcheck= sap.ui.getCore().getModel( "checkout");
            this.getView().setModel(oModelcheck,"checkout");
			
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View10").attachMatched(this._onRouteMatched, this);
                
               
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
			var sMsg;
			if (iIndex < 0) {
				sMsg = "No Product Selected";
				MessageToast.show(sMsg);
			} else {
				sMsg = oTable.getContextByIndex(iIndex);
				if (sMsg.getProperty("status") === "Success" ){
				count = count + 1 ;
				var oBadge= this.byId("badgeid");
			    oBadge.setProperty("value", count);
				transfer_cart.forEach(transfer=> { 
					if(transfer.prod_id === sMsg.getProperty("prod_id")  ) {                      
						checkout.push(transfer);
						MessageToast.show("Product Added to Cart");
					}
				})
			 }else if (sMsg.getProperty("status") === "Warning" ){
				MessageToast.show("Product can't be added to cart due to shortage of stocks");
			 }else if (sMsg.getProperty("status") === "Error" ){
				MessageToast.show("Product can't be added to cart due to unavailability of stocks");
			 } 
			}
			//MessageToast.show(sMsg.getProperty("prod_id"));
			 //path is referring to element in array with index 1
			
		},
		onPress: function  (oEvent) {
			var oTable = this.byId('peopleList');
			//oBinding = oTable.getBinding('rows');
			var oItem = oEvent.getSource();
			this._setDetailArea(oItem.getBindingContext());
			//this._setDetailArea(oTable.getParameter("listItem").getBindingContext());
		},
        onSelectionChange : function (oEvent) {
			this._setDetailArea(oEvent.getParameter("listItem").getBindingContext());
		},
        _setDetailArea : function (oUserContext) {
			var oDetailArea = this.byId("detailArea"),
				oLayout = this.byId("defaultLayout"),
				oOldContext;
			if (!oDetailArea) {
				return; // do nothing during view destruction
			}

			oOldContext = oDetailArea.getBindingContext();
			if (oOldContext) {
				oOldContext.setKeepAlive(false);
			}
			if (oUserContext) {
				oUserContext.setKeepAlive(true,
					// hide details if kept entity was refreshed but does not exist any more
					this._setDetailArea.bind(this));
			}
			oDetailArea.setBindingContext(oUserContext || null);
			// resize view
			oDetailArea.setVisible(!!oUserContext);
			oLayout.setSize(oUserContext ? "60%" : "100%");
			oLayout.setResizable(!!oUserContext);
			
		},
		onDispatch1: function()
		{
          var oTable = this.byId("table1"),
		      List = oTable.getBinding("rows"),
			  products = List.oList;
			  var oModel = this.getView().getModel("checkout");
			  oModel.destroy( );
			 var oModeltr = this.getOwnerComponent().getModel(),
			  oBinding = oModeltr.bindList("/producttransfer"),
			  count = 0,flag,newStocks;
			  const UniqueID = globalThis.crypto.randomUUID();
			  var id = UniqueID.slice(0,7); 

			  products.forEach(product=> { 
				count = Number(count + 1);
				newStocks = Number(product.stocks);
			  // Create a new entry through the table's list binding
				var oContext = oBinding.create({
					"store_id": id,
					"item_no": count,
					"prod_id": product.prod_id,
					"prod_name": product.prod_name,
					"prod_cat": product.prod_cat,
					"prod_type": product.prod_type,
					"username": username,
					"stocks": newStocks,	
				}); 
				oContext.created()
                        .then(() => {
							flag = 1;
                            MessageBox.success("Record Created !");
                    });


			})

			if ( flag === 1)
			{ MessageBox.success("Record Created !"); }

		},

		onDispatch: function()
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
		onSearch : function (oEvent) {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter([
					//new Filter("item_no", FilterOperator.Contains, sValue),
					new Filter("prod_name", FilterOperator.Contains, sValue),
					new Filter("transfer_id",FilterOperator.Contains, sValue),
					new Filter("tostoremaster/store_name",FilterOperator.Contains, sValue),
					//new Filter("prod_id", FilterOperator.Contains, sValue),
					//new Filter("unit", FilterOperator.Contains, sValue)
				], false);
				//oFilter = new Filter("prod_type", FilterOperator.Contains, sValue);
                oView.byId("peopleList").getBinding("items").filter(oFilter, FilterType.Application);

		},
		onHome: function(){
		                      
			this.getRouter().navTo("View2",{
				username: username } );     	

	},
		onNavBack: function(){
						  
			this.getRouter().navTo("RouteView1");

		},
		onExport: function() {
			var aCols, oBinding, oSettings, oSheet, oTable;

			oTable = this.byId('peopleList');
			oBinding = oTable.getBinding('items');
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
		createColumnConfig: function() {
			return [
				{
					label: 'Transfer ID',
					property: 'transfer_id',
					type: EdmType.String,
				},
				{
					label: 'Item Number',
					property: 'item_no',
					type: EdmType.Number,
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
					label: 'Store Name',
					property: 'tostoremaster/store_name',
					type: EdmType.String,
				}];
		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		}

	});
});
