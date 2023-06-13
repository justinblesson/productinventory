sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/type/Boolean",
	"sap/ui/model/SimpleType",
	"sap/ui/core/Fragment",

], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Sorter, FilterType, Fragment) {
	"use strict";
	var username, productid, email;
	return Controller.extend("product.product.controller.View7", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View7").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			username = oEvent.getParameter("arguments").username;
			var u = username.slice(0, 1);
			var oModelup = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/productinventory/",
				synchronizationMode: "None",
			});
			var oContextBinding = oModelup.bindContext("/usermaster('" + username + "')");
			oContextBinding.requestObject().then(function (result) {
				email = result.email;
			});
			var userdetails = [{
				"username": username,
				"email": email,
				"initial": u,
			}];
			//this.oModel = new sap.ui.model.json.JSONModel(userdetails );	
			var oModel = new sap.ui.model.json.JSONModel(userdetails);
			this.getView().setModel(oModel, 'userdetails');
		},
		handleButtonPress: function (oEvent) {
			var userdetails = [{
				"username": username,
				"email": email,
			}];
			var oModel = new sap.ui.model.json.JSONModel(userdetails);

			var oButton = oEvent.getSource(),
				oView = this.getView();


			if (!this._pPopover) {
				this._pPopover = this.loadFragment({
					id: oView.getId(),
					name: "product.product.view.Popover",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					//oPopover.bindElement("/ProductCollection/0");
					return oPopover;
				});
			}
			this._pPopover.then(function (oPopover) {
				oPopover.setModel(oModel, 'userdetails');
				oPopover.openBy(oButton);
			});
		},
		onNavBack: function () {

			this.getRouter().navTo("RouteView1");

		},
		onOpenAddDialog: function () {
			var c = "productmaster";
			this.getView().byId(c).open();
		},
		onCancelDialog: function (oEvent) {
			oEvent.getSource().getParent().close();
			//this.resetForm();
		},
		onCreate1: function () {

			this.getRouter().navTo("View3", {
				username: username
			});

		},
		onHome: function () {

			this.getRouter().navTo("View2", {
				username: username
			});

		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		onChange: function (oEvent) {
			//var productname = oEvent.getParameter("value");
			//var oData;
			//var prodname = [];
			//jQuery.ajax({
			//type: "GET",
			//contentType: "application/json",
			//url: "/productinventory/productmaster",
			//dataType: "json",
			//async: false,
			//success: function (data, textStatus, jqXHR) {
			//console.log("User details fetch is successful ");
			//oData = data.value;

			//oData.forEach(iData => { 
			//if (productname === iData.prod_name) {
			//prodname.push(iData);
			//}

			//});
			//},
			//error: function (data, textStatus, jqXHR) {
			//MessageBox.error("Error occurred in getting user details ");
			//}

			//});

			//var oModel_name = new sap.ui.model.json.JSONModel(prodname );
			// Add model name in setter		              
			//this.getView().setModel(oModel_name, 'product');
			//this.getView().getModel('product').refresh();
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
				], false);
				oView.byId("productinvent").getBinding("items").filter(oFilter, FilterType.Application);

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
		onCreate: function () {
			if (!this.getView().byId("idproductidin").getValue() ||
				!this.getView().byId("idproductcatin").getValue() ||
				!this.getView().byId("idproducttypein").getValue() ||
				!this.getView().byId("idproductnamein").getValue() ||
				!this.getView().byId("iduomin").getValue() ||
				!this.getView().byId("idexpiryin").getValue() ||
				!this.getView().byId("idunitin").getValue() ||
				!this.getView().byId("idbatchin").getValue() ||
				!this.getView().byId("idqtyin").getValue() ||
				!this.getView().byId("idstocksin").getValue()) {
				MessageBox.error("Enter required fields");
				this.getView().byId("idproductidin").setValue("");
				this.getView().byId("idproductcatin").setValue("");
				this.getView().byId("idproducttypein").setValue("");
				this.getView().byId("idproductnamein").setValue("");
				this.getView().byId("iduomin").setValue("");
				this.getView().byId("idexpiryin").setValue("");
				this.getView().byId("idunitin").setValue("");
				this.getView().byId("idbatchin").setValue("");
				this.getView().byId("idqtyin").setValue("");
				this.getView().byId("idstocksin").setValue("")
			}else {
			try {
				//this.getView().setModel("/productinvent");
				var oModel = this.getOwnerComponent().getModel(),
					oBinding = oModel.bindList("/productinvent");
				var newValue = Number(this.getView().byId("idbatchin").getValue()),
					newQty = Number(this.getView().byId("idqtyin").getValue()),
					newStocks = Number(this.getView().byId("idstocksin").getValue()),
					newDate = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString();
				//newDate = ISO;
				// Create a new entry through the table's list binding
				var oContext = oBinding.create({
					"prod_id": productid,//this.getView().byId("idproductidin").getValue(),
					"prod_cat": this.getView().byId("idproductcatin").getValue(),
					"prod_name": this.getView().byId("idproductnamein").getValue(),
					"prod_type": this.getView().byId("idproducttypein").getValue(),
					"added_on": newDate,
					"added_by": username,
					//this.getView().byId("idproductaddedonin").getValue(),
					"qty": newQty,
					"uom": this.getView().byId("iduomin").getValue(),
					"expiry_date": this.getView().byId("idexpiryin").getValue(),
					"batch_no": newValue,
					"stocks": newStocks,
					"unit": this.getView().byId("idunitin").getValue()
				});

				oContext.created()
					.then(() => {
						MessageBox.success("Record Created !");
						this.getView().byId("idproductidin").setValue("");
						this.getView().byId("idproductcatin").setValue("");
						this.getView().byId("idproducttypein").setValue("");
						this.getView().byId("idproductnamein").setValue("");
						this.getView().byId("iduomin").setValue("");
						this.getView().byId("idexpiryin").setValue("");
						this.getView().byId("idunitin").setValue("");
						this.getView().byId("idbatchin").setValue("");
						this.getView().byId("idqtyin").setValue("");
						this.getView().byId("idstocksin").setValue("")
					});

			}
			catch (err) {
				MessageBox.error("Record Creation Failed !");
				this.getView().byId("idproductidin").setValue("");
				this.getView().byId("idproductcatin").setValue("");
				this.getView().byId("idproducttypein").setValue("");
				this.getView().byId("idproductnamein").setValue("");
				this.getView().byId("iduomin").setValue("");
				this.getView().byId("idexpiryin").setValue("");
				this.getView().byId("idunitin").setValue("");
				this.getView().byId("idbatchin").setValue("");
				this.getView().byId("idqtyin").setValue("");
				this.getView().byId("idstocksin").setValue("")
			}
		}
		},
		// #region Value Help Dialog standard use case with filter bar without filter suggestions
		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = this.loadFragment({
					id: oView.getId(),
					name: "product.product.view.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("prod_name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new Filter("prod_name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);



		},

		onValueHelpDialogClose: function (oEvent) {
			var sDescription, category, type, uom,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();
			productid = sDescription;
			this.byId("idproductidin").setSelectedKey(sDescription);
			var prod_cat = this.getView().byId("idproductcatin"),
				prod_name = this.getView().byId("idproductnamein"),
				prod_type = this.getView().byId("idproducttypein"),
				prod_uom = this.getView().byId("iduomin");



			var oModelIn = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/productinventory/",
				synchronizationMode: "None",
			});
			var oContextBinding = oModelIn.bindContext("/productmaster");
			oContextBinding.requestObject().then(function (result) {
				var data = result;
				result.value.forEach(product => {
					if (product.prod_id === sDescription) {
						prod_cat.setValue(product.prod_cat);
						prod_type.setValue(product.prod_type);
						prod_name.setValue(product.prod_name);
						prod_uom.setValue(product.uom);
						oModelIn.destroy();
					}

				})
			})
		},

		onSuggestionItemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oText = oItem ? oItem.getKey() : "";
			productid = oText;
			this.byId("idproductidin").setSelectedKey(oText);
			var prod_cat = this.getView().byId("idproductcatin"),
				prod_name = this.getView().byId("idproductnamein"),
				prod_type = this.getView().byId("idproducttypein"),
				prod_uom = this.getView().byId("iduomin");



			var oModelIn = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/productinventory/",
				synchronizationMode: "None",
			});
			var oContextBinding = oModelIn.bindContext("/productmaster");
			oContextBinding.requestObject().then(function (result) {
				var data = result;
				result.value.forEach(product => {
					if (product.prod_id === oText) {
						prod_cat.setValue(product.prod_cat);
						prod_type.setValue(product.prod_type);
						prod_name.setValue(product.prod_name);
						prod_uom.setValue(product.uom);
						oModelIn.destroy();
					}

				})
			})
		}

	});
});