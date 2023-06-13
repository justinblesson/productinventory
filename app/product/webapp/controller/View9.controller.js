sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"

], function(Controller,JSONModel, Filter,  FilterOperator,FilterType, MessageBox, MessageToast,Fragment) {
	"use strict";
	var username,email,count = 0,checkout = [],transfer_cart = [], productinvent = [],store_id;
	return Controller.extend("product.product.controller.View9", {
       
		onInit : function () {
			// var oJSONData = {
			// 	busy : false
			// };
			// var oModel = new JSONModel(oJSONData);
			// this.getView().setModel(oModel, "appView");
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/productinventory/productinvent",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					console.log("User details fetch is successful " );                       

				  data.value.forEach(pduct=> { 
					productinvent.push(pduct);   
					})
				
				},
				error: function (data, textStatus, jqXHR) {
					MessageBox.error("Error occurred in getting user details ");
				}
			});
            var oModelcheck= sap.ui.getCore().getModel( "checkout");
            this.getView().setModel(oModelcheck,"checkout");
			
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View9").attachMatched(this._onRouteMatched, this);
                
               
		},
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
		onDispatch1: function()
		{
          var oTable = this.byId("table1"),
		      List = oTable.getBinding("rows"),
			  products = List.oList;
			  var oModel = this.getView().getModel("checkout");
			  oModel.destroy( );
			 var oModeltr = this.getOwnerComponent().getModel(),
			  oBinding = oModeltr.bindList("/producttransfer"),
			  count = 0,flag = 0,newStocks;
			  const UniqueID = globalThis.crypto.randomUUID();
			  var id = UniqueID.slice(0,8); 
			  var oldStocks;

			  products.forEach(product=> { 
				count = Number(count + 1);
				newStocks = Number(product.stocks);
			  // Create a new entry through the table's list binding
				var oContext = oBinding.create({
					"transfer_id": id,
					"item_no": count,
					"prod_id": product.prod_id,
					"prod_name": product.prod_name,
					"prod_cat": product.prod_cat,
					"prod_type": product.prod_type,
					"store_id": store_id,//this.getView().byId("storeidinput").getValue(),
					"username": username,
					"stocks": newStocks,	
				}); 
				oContext.created()
                        .then(() => {
							var oModelup = new sap.ui.model.odata.v4.ODataModel({
								serviceUrl: "/productinventory/",
								synchronizationMode: "None",
							});
							var oContextBinding = oModelup.bindContext("/productinvent('" + product.prod_id + "')");
							productinvent.forEach(pduct=> { 
								if (pduct.prod_id === product.prod_id){
									oldStocks = pduct.stocks;
								}  
								})
							oContextBinding.getBoundContext().setProperty("stocks", oldStocks - newStocks);
							if ( flag === 0 ){
								MessageBox.success("Transfer Initiated !");
								flag = 1;			    //oModelcheck = this.getModel("checkout"),
			    

                                 this.getView().byId("StoreInfo").close(); 
				// 			var	oTable = this.byId("table1"),
				//  oModeld = this.getView().getModel("checkout"),
				// List = oTable.getBinding("rows");
				// var products = List.oList;
				// var l = products.length;
				// var remove = products.splice(0, l);
				// var oData = {
				// 	checkout: products
				//  }
				// oModeld.setData(oData);
							}                            
                    });


			})

			if ( flag === 1)
			{ MessageBox.success("Transfer Initiated"); }

		},
		onDelete : function () {
			var oContext,
			    //oModelcheck = this.getModel("checkout"),
			    oTable = this.byId("table1"),
				oModelcheck = oTable.getModel(),
				oModel = this.getView().getModel("checkout"),
				oSelected = oTable.getSelectedIndex(),
				List = oTable.getBinding("rows"),
				
				oContext = oTable.getContextByIndex(oSelected);
				var sID = oContext.getProperty("prod_id");	
				var prod_in = this.getView().byId("idin");
				var products = List.oList;
				var array = [];
				// products.forEach(product=> { 
				// 	array.push(product.getAggregation("cells")[0].getProperty("text"));
				// 	});


				var remove = products.splice(oSelected, 1);
				var oData = {
					checkout: products
				 }
				oModel.setData(oData);



			
				// var oRow = oTable.getRows(oSelected)
                // var oRowD = oTable.removeRow(oRow);
				   //oContext = oSelected.getBindingContext();
					
				       		
			// 	   oContext.removeRow().then(function () {
		    // MessageToast.show("Product Deleted from Cart");	});				
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
		remove: function (oEvent) {
			var oTable = this.getView().byId("table1");
			oTable.removeItem(oEvent.getSource().getParent());
		},
		// #region Value Help Dialog standard use case with filter bar without filter suggestions
		onValueHelpRequest: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
	
				if (!this._pValueHelpDialog) {
					this._pValueHelpDialog = this.loadFragment({
						id: oView.getId(),
						name: "product.product.view.ValueHelpDialogStore",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialog.then(function (oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("store_name", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open(sInputValue);
				});
			},
			onValueHelpDialogSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");

				var oFilter = new Filter("store_name", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);


				
			},
	
			onValueHelpDialogClose: function (oEvent) {
				var sDescription,category,type,uom,
					oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
	
				if (!oSelectedItem) {
					return;
				}
	
				sDescription = oSelectedItem.getDescription();
				store_id = sDescription;
				this.byId("storeidinput").setSelectedKey(sDescription);	            
			},
	
			onSuggestionItemSelected: function (oEvent) {
				var oItem = oEvent.getParameter("selectedItem");
				var oText = oItem ? oItem.getKey() : "";
				store_id = oText;
				this.byId("storeidinput").setSelectedKey(oText);
			},
			onHome: function(){
		                      
				this.getRouter().navTo("View2",{
					username: username } );     	
	
		},
		onSearch : function (oEvent) {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter([
					new Filter("prod_type", FilterOperator.Contains, sValue),
					new Filter("prod_name", FilterOperator.Contains, sValue),
					new Filter("prod_cat", FilterOperator.Contains, sValue),
					new Filter("prod_id", FilterOperator.Contains, sValue),
					new Filter("unit", FilterOperator.Contains, sValue)
				], false);
				//oFilter = new Filter("prod_type", FilterOperator.Contains, sValue);
                oView.byId("table1").getBinding("rows").filter(oFilter, FilterType.Application);

		},
			onNavBack: function(){
		                      
				this.getRouter().navTo("RouteView1");
	
			},
			
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		}
	});
});
