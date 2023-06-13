
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/type/Boolean",
	"sap/ui/model/SimpleType"
],
	function (Controller, JSONModel, MessageBox,Sorter,  Filter, FilterOperator, FilterType ){
		"use strict";
		var username, email;
		return Controller.extend("product.product.controller.View3", {

			onInit: function () {

				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("View3").attachMatched(this._onRouteMatched, this);
			},
			_onRouteMatched: function (oEvent) {
				username = oEvent.getParameter("arguments").username;
				var oModelup = new sap.ui.model.odata.v4.ODataModel({
					serviceUrl: "/productinventory/",
					synchronizationMode: "None",
				});
				var oContextBinding = oModelup.bindContext("/usermaster('" + username + "')");
				oContextBinding.requestObject().then(function (result) {
					email = result.email;
				});
				var u = username.slice(0, 1);
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
			onOpenAddDialog: function () {
				var c = "productmaster";
				this.getView().byId(c).open();
			},
			onCancelDialog: function (oEvent) {
				oEvent.getSource().getParent().close();
				//this.resetForm();
			},
			onCreate2: function () {

				this.getRouter().navTo("View7", {
					username: username
				});

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
			onHome: function () {

				this.getRouter().navTo("View2", {
					username: username
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
			onNavBack: function () {

				this.getRouter().navTo("RouteView1");

			},
			getRouter: function () {
				return this.getOwnerComponent().getRouter();
			},
			onCreate: function () {
				if (!this.getView().byId("idproductidin").getValue() ||
					!this.getView().byId("idproductcatin").getValue() ||
					!this.getView().byId("idproducttypein").getValue() ||
					!this.getView().byId("idproductnamein").getValue() ||
					!this.getView().byId("iduomin").getValue()) {
					MessageBox.error("Enter required fields");
					this.getView().byId("idproductidin").setValue("");
					this.getView().byId("idproductcatin").setValue("");
					this.getView().byId("idproducttypein").setValue("");
					this.getView().byId("idproductnamein").setValue("");
					this.getView().byId("iduomin").setValue("");
				}
				else {
					try {
						var oModel = this.getOwnerComponent().getModel(),
							oBinding = oModel.bindList("/productmaster");
							//active_value = this.getView().byId("idactivein").getValue();
						    //var newValue = Boolean(active_value);
						// Create a new entry through the table's list binding
						var oContext = oBinding.create({
							"prod_id": this.getView().byId("idproductidin").getValue(),
							"prod_cat": this.getView().byId("idproductcatin").getValue(),
							"prod_type": this.getView().byId("idproducttypein").getValue(),
							"prod_name": this.getView().byId("idproductnamein").getValue(),
							"uom": this.getView().byId("iduomin").getValue(),
							"created_by": username
							//"active": newValue
						});

						oContext.created()
							.then(() => {
								MessageBox.success("Record Created !");
								this.getView().byId("idproductidin").setValue("");
								this.getView().byId("idproductcatin").setValue("");
								this.getView().byId("idproducttypein").setValue("");
								this.getView().byId("idproductnamein").setValue("");
								this.getView().byId("iduomin").setValue("");
							});

					}
					catch (err) {
						MessageBox.error("Record Creation Failed !");
						this.getView().byId("idproductidin").setValue("");
						this.getView().byId("idproductcatin").setValue("");
						this.getView().byId("idproducttypein").setValue("");
						this.getView().byId("idproductnamein").setValue("");
						this.getView().byId("iduomin").setValue("");
					}

				}

			}


		});
	});