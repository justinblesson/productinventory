sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/p13n/Engine",
	"sap/m/p13n/SelectionController",
	"sap/m/p13n/SortController",
	"sap/m/p13n/GroupController",
	"sap/m/p13n/MetadataHelper",
	"sap/ui/model/Sorter",
	"sap/m/ColumnListItem",
	"sap/m/Text",
	'sap/ui/table/library'

], function (Controller, JSONModel, Filter, FilterOperator, FilterType, MessageBox, Fragment, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, ColumnListItem, Text, tableLibrary) {
	"use strict";
	var username, email;

	return Controller.extend("product.product.controller.View2", {

		onInit: function () {
			var oJSONData = {
				busy: false
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View2").attachMatched(this._onRouteMatched, this);
			this._registerForP13n();
		},
		_registerForP13n: function () {
			var oTable = this.byId("productinvent");
			this.oMetadataHelper = new MetadataHelper([
				{key: "prod_id", label: "ProductID", path: "prod_id"},
                {key: "prod_type", label: "Product Type", path: "prod_type"},
                {key: "prod_cat", label: "Product Category", path: "prod_cat"},
                {key: "prod_name", label: "Product Name", path: "prod_name"},
                {key: "expiry_date", label: "Expiry Date", path: "expiry_date"},
                {key: "qty", label: "Net Quantity", path: "qty"},
                {key: "uom", label: "Unit of Measure", path: "uom"},
                {key: "stocks", label: "Stocks", path: "stocks"},
                {key: "unit", label: "Unit", path: "unit"},
                {key: "added_on", label: "Added On", path: "added_on"}
			]);
			Engine.getInstance().register(oTable, {
				helper: this.oMetadataHelper,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable
					}),
					Sorter: new SortController({
						control: oTable
					}),
					Groups: new GroupController({
						control: oTable
					})
				}
			});

			Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
		},
		openPersoDialog: function (oEvt) {
			var oTable = this.byId("productinvent");

			Engine.getInstance().show(oTable, ["Columns","Sorter","Groups"], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oEvt.getSource()
			});
		}, _getKey: function (oControl) {
			return this.getView().getLocalId(oControl.getId());
		},

		handleStateChange: function (oEvt) {
			var oTable = this.byId("productinvent");
			var oState = oEvt.getParameter("state");

			if (!oState) {
				return;
			}

			var aSorter = [];
			oState.Sorter.forEach(function (oSorter) {
				aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
			}.bind(this));

			oState.Groups.forEach(function (oGroup) {
				var oExistingSorter = aSorter.find(function (oSorter) {
					return oSorter.sPath === oGroup.key;
				});

				if (oExistingSorter) {
					oExistingSorter.vGroup = true;
				} else {
					aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
				}
			}.bind(this));
			oTable.getColumns().forEach(function (oColumn, iIndex) {
				oColumn.setVisible(false);
			});

			oState.Columns.forEach(function (oProp, iIndex) {
				var oCol = this.byId(oProp.key);
				oCol.setVisible(true);

				oTable.removeColumn(oCol);
				oTable.insertColumn(oCol, iIndex);
			}.bind(this));


			var aCells = oState.Columns.map(function (oColumnState) {
				return new Text({
					text: "{" + oColumnState.key + "}"
				});
			});

			oTable.bindItems({
				templateShareable: false,
				path: '/productinvent',
				sorter: aSorter,
				template: new ColumnListItem({
					cells: aCells
				})
			});

		},

		openPersoDialog1: function (event) {
			var that = this;
			var List = that.byId("List");
			var popOver = this.byId("popOver");
			if (List !== undefined) {
				List.destroy();
			}
			if (popOver !== undefined) {
				popOver.destroy();
			}
			/*----- PopOver on Clicking ------ */
			var popover = new sap.m.Popover(this.createId("popOver"), {
				showHeader: true,
				//showFooter: true,
				contentWidth: "250px",
				title: "Select Columns",
				placement: sap.m.PlacementType.PreferredBottomOrFlip,
				content: []
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			/*----- Adding List to the PopOver -----*/
			var oList = new sap.m.List(this.createId("List"), {});
			this.byId("popOver").addContent(oList);
			var openAssetTable = this.getView().byId("productinvent"),
				columnHeader = openAssetTable.getColumns();
			var openAssetColumns = [];
			for (var i = 0; i < columnHeader.length; i++) {
				var hText = columnHeader[i].getAggregation("header").getProperty("text");
				var columnObject = {};
				columnObject.column = hText;
				openAssetColumns.push(columnObject);
			}
			var oModel1 = new sap.ui.model.json.JSONModel({
				list: openAssetColumns
			});
			var itemTemplate = new sap.m.StandardListItem({
				title: "{oList>column}"
			});
			oList.setMode("MultiSelect");
			oList.setModel(oModel1);
			sap.ui.getCore().setModel(oModel1, "oList");
			var oBindingInfo = {
				path: 'oList>/list',
				template: itemTemplate
			};
			oList.bindItems(oBindingInfo);
			var footer = new sap.m.Bar({
				contentLeft: [new sap.m.Button({
					//text: "Add",
					icon: "sap-icon://multiselect-all",
					press: function () {
						that.onAdd();
					}

				}),
				new sap.m.Button({
					//text: "Add",
					icon: "sap-icon://clear-all",
					press: function () {
						that.onRemove();
					}

				})],
				contentMiddle: [new sap.m.Button({
					text: "Cancel",
					press: function () {
						that.onCancel();
					}
				})
					// new sap.m.Button({
					// 	text: "Save",
					// 	press: function () {
					// 		that.onSave();
					// 	}
					// })
				],
				contentRight: [new sap.m.Button({
					text: "Save",
					type: "Emphasized",
					press: function () {
						that.onSave();
					}
				})]

			});
			this.byId("popOver").setSubHeader(footer);
			this.byId("popOver").setFooter(footer);
			var oList1 = this.byId("List");
			var table = this.byId("productinvent").getColumns();
			/*=== Update finished after list binded for selected visible columns ==*/
			oList1.attachEventOnce("updateFinished", function () {
				var a = [];
				for (var j = 0; j < table.length; j++) {
					var list = oList1.oModels.undefined.oData.list[j].column;
					a.push(list);
					var Text = table[j].getHeader().getProperty("text");
					var v = table[j].getProperty("visible");
					if (v === true) {
						if (a.indexOf(Text) > -1) {
							var firstItem = oList1.getItems()[j];
							oList1.setSelectedItem(firstItem, true);
						}
					}
				}
			});
			popover.openBy(event.getSource());
		},
		onAdd: function () {
			this.byId("List").selectAll();
		},
		onRemove: function () {
			this.byId("List").removeSelections();
		},
		/*================ Closing the PopOver =================*/
		onCancel: function () {
			this.byId("popOver").close();
		},
		/*============== Saving User Preferences ==================*/
		onSave: function () {
			var that = this;
			var oList = this.byId("List");
			var array = [];
			var items = oList.getSelectedItems();

			// Getting the Selected Columns header Text.
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var context = item.getBindingContext("oList");
				var obj = context.getProperty(null, context);
				var column = obj.column;
				array.push(column);
			}
			/*---- Displaying Columns Based on the selection of List ----*/
			var table = this.byId("productinvent").getColumns();
			for (var j = 0; j < table.length; j++) {
				var Text = table[j].getHeader().getProperty("text");
				var Column = table[j].getId();
				var columnId = this.getView().byId(Column);
				if (array.indexOf(Text) > -1) {
					columnId.setVisible(true);
				} else {
					columnId.setVisible(false);
				}
			}
			this.byId("popOver").close();
		},
		_onRouteMatched: function (oEvent) {
			username = oEvent.getParameter("arguments").username;
			//email = oEvent.getParameter("arguments").email;
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
		onRefresh: function () {

			var oBinding = this.byId("productinvent").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("Refresh Not Possible");
				return;
			}
			oBinding.refresh();
			MessageBox.success("Data Refreshed");
		},
		onSearch: function (oEvent) {
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
		}, onCreate1: function () {
			this.getRouter().navTo("View3", {
				username: username
			});

		}, onCreate2: function () {

			this.getRouter().navTo("View7", {
				username: username
			});
		}, onTransfer: function () {

			this.getRouter().navTo("View8", {
				username: username
			});
		},
		onTrack: function () {

			this.getRouter().navTo("View10", {
				username: username
			});
		},
		onAnalytics: function () {

			this.getRouter().navTo("View4", {
				username: username
			});

		}
		,
		onNavBack: function () {

			this.getRouter().navTo("RouteView1");

		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},




	});
});
