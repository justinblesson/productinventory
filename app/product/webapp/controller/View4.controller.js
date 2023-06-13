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
// @ts-ignore
// @ts-ignore
], function (Controller, MessageBox, MessageToast, JSONModel, Sorter, Filter, FilterOperator, FilterType) {
	"use strict";
var username,email;
	return Controller.extend("product.product.controller.View4", {

		onInit: function () {
			// @ts-ignore
			// @ts-ignore
			var emptyCol = [{
				"key": false,
				"labelName": "Beschreibung lang",
				"technicalName": "COL04",
				"uploadName": "EMPTY_COLUMN_1"
			  }];

			var prodcat = [],stocks_cat = 0,name_cat;

			var oData;
            //var obj = JSON.parse(prodcat1);
            // @ts-ignore
            jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/productinventory/getprodcatnumber()",
                dataType: "json",
                async: false,
                // @ts-ignore
                // @ts-ignore
                success: function (data, textStatus, jqXHR) {
                    console.log("User details fetch is successful ");
                    oData = data;
                    
                    oData.forEach(iData => { 
                      
                      prodcat.push(iData);

					  if(iData.stocks > stocks_cat ){
						stocks_cat = iData.stocks;
						name_cat = iData.prod_cat;

					}
                      
                    });
                    
                },
                // @ts-ignore
                // @ts-ignore
                error: function (data, textStatus, jqXHR) {
                    MessageBox.error("Error occurred in getting user details ");
                }
            });
			var oFeedCat = this.getView().byId("feed_cat");
            oFeedCat.setContentText(name_cat);
			oFeedCat.setValue(stocks_cat);
		var oModel = new sap.ui.model.json.JSONModel({ product: prodcat });
		// Add model name in setter
		  this.getView().setModel(oModel, 'product');			
		//},
		//***************************************************** */
		// @ts-ignore

		var prodqty = [];

			// @ts-ignore
	
			var oData1,stocks_product = 0,name_product;
            //var obj = JSON.parse(prodcat1);
            // @ts-ignore
         
            jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/productinventory/getprodnamesqty()",
                dataType: "json",
                async: false,
    
                // @ts-ignore
                success: function (data, textStatus, jqXHR) {
                    console.log("Product details fetch is successful ");
                    // @ts-ignore
                    oData1 = data;
                    
                    // @ts-ignore
                    oData1.forEach(tData => { 
                      
						// @ts-ignore
						prodqty.push(tData);

						if(tData.stocks > stocks_product ){
							stocks_product = tData.stocks;
							name_product = tData.prod_name;

						}
                    });  
                },
                // @ts-ignore
                error: function (data, textStatus, jqXHR) {
                    MessageBox.error("Error occurred in getting user details ");
                }
            // @ts-ignore
            });
		// @ts-ignore
	    var oFeedProd = this.getView().byId("feed_prod");
            oFeedProd.setContentText(name_product);
			oFeedProd.setValue(stocks_product);
		var oModel2 = new sap.ui.model.json.JSONModel({ productqty: prodqty });
		// Add model name in setter
		  // @ts-ignore
		  // @ts-ignore
		  this.getView().setModel(oModel2, 'productqty');	
		  
		  var prodtrend = [];

		  var oData2;
 
		//   jQuery.ajax({
		// 	  type: "GET",
		// 	  contentType: "application/json",
		// 	  url: "/productinventory/getprodtrend(prodcat='Fruits')",
		// 	  dataType: "json",
		// 	  async: false,
		// 	  success: function (data, textStatus, jqXHR) {
		// 		  console.log("User details fetch is successful ");
		// 		  oData2 = data;
				  
		// 		  oData2.forEach(iData => { 
		// 			 var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
		// 				 pattern: "YYYY/MM/dd"
		// 			 });
					 
		// 			 iData.added_on =  oDateFormat.format(new Date(iData.added_on));
		// 			 prodtrend.push(iData);
					
		// 		  });
				  
		// 	  },
		// 	  error: function (data, textStatus, jqXHR) {
		// 		  MessageBox.error("Error occurred in getting user details ");
		// 	  }
			 
		//   });
		  var oModel3 = new sap.ui.model.json.JSONModel({ producttrend : prodtrend });
		  // Add model name in setter		              
		  this.getView().setModel(oModel3, 'producttrend');  


			var prodtrend = [],stocks_type = 0,name_type;

			var oData3;
   
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/productinventory/getprodtrend()",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					console.log("User details fetch is successful ");
					oData3 = data;
					
					oData3.forEach(iData => { 
					   prodtrend.push(iData);
					   if(iData.stocks > stocks_type ){
						stocks_type = iData.stocks;
						name_type= iData.prod_type;

					}
					  
					});
					
				},
				error: function (data, textStatus, jqXHR) {
					MessageBox.error("Error occurred in getting user details ");
				}
			   
			});
			var oFeedType = this.getView().byId("feed_type");
            oFeedType.setContentText(name_type);
			oFeedType.setValue(stocks_type);
			var oModel4 = new sap.ui.model.json.JSONModel({ producttype : prodtrend });
			// Add model name in setter		              
			this.getView().setModel(oModel4, 'producttype');  
			//this.getRouter().navTo("View5",{
				//category: clickedData.Category
			//});
			var prodtrend1 = [];

			var oData4;
   
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/productinventory/getprodqty()",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					console.log("User details fetch is successful ");
					oData4 = data;
					
					oData4.forEach(iData => { 
					   var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						   pattern: "YYYY/MM/dd"
					   });
					   
					   iData.added_on =  oDateFormat.format(new Date(iData.createdat));
					   prodtrend1.push(iData);
					  
					});
					
				},
				error: function (data, textStatus, jqXHR) {
					MessageBox.error("Error occurred in getting user details ");
				}
			   
			});
			// var sum = 0,date = 0;
			// prodtrend1.sort(function(a, b){return a.added_on - b.added_on});
			// prodtrend1.forEach(data => { 
			// if (data.added_on == date )
			// { 
			// sum = sum + data.stocks;		    
			// }
		        
			// 	sum = sum + data.stocks; 
			// };
			
			   
			//  });

			var result = [];
			prodtrend1.sort(function(a, b){return a.added_on - b.added_on});
			prodtrend1.reduce(function(res, value) {
  if (!res[value.added_on]) {
    res[value.added_on] = { stocks: 0,added_on: value.added_on };
    result.push(res[value.added_on])
  }
  res[value.added_on].stocks += value.stocks;
  return res;
}, {});

prodtrend1 = result;

var sum1 = 0,sum2 = 0;
const d = new Date();
let month = d.getMonth();
let year = d.getFullYear();
const month_name = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let name1 = month_name[month - 1];
let name2 = month_name[month];
prodtrend1.forEach(prod=>{
	if (Number(prod.added_on.slice(6,7)) === ( month + 1 ) ){
        sum2 = sum2 + prod.stocks;
	}
	if (Number(prod.added_on.slice(6,7)) === month ){
        sum1 = sum1 + prod.stocks;
	}
})
	var percent	= ( ( sum2 - sum1 ) / sum1 ) * 100;
	var oGeneric= this.getView().byId("generic");
	oGeneric.setSubheader("("+name1+"-"+name2+")("+year+")")
	var oNumContent= this.getView().byId("num_content");
	oNumContent.setValue(percent);
	if ( percent < 0 ){
		oNumContent.setIndicator('Down');
	}else{
		oNumContent.setIndicator('Up');
	}

			var oModel5 = new sap.ui.model.json.JSONModel({ producttrend : prodtrend1 });
			// Add model name in setter		              
			this.getView().setModel(oModel5, 'producttrend');  
			//this.getRouter().navTo("View5",{
				//category: clickedData.Category
			//});
		
			var prodstore = [],stocks_store = 0,name_store;
   
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/productinventory/getStore()",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					console.log("User details fetch is successful ");					
					data.forEach(iData => { 
						prodstore.push(iData);
					   if(iData.stocks > stocks_store ){
						stocks_store = iData.stocks;
						name_store= iData.store_name;

					}
					  
					});
					
				},
				error: function (data, textStatus, jqXHR) {
					MessageBox.error("Error occurred in getting user details ");
				}
			   
			});
			var oFeedStore = this.getView().byId("feed_store");
            oFeedStore.setContentText(name_store);
			oFeedStore.setValue(stocks_store);
			var oModel6 = new sap.ui.model.json.JSONModel({ store : prodstore });
			// Add model name in setter		              
			this.getView().setModel(oModel6, 'store');  
			//this.getRouter().navTo("View5",{
				//category: clickedData.Category
			//});	
			
			
		  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("View4").attachMatched(this._onRouteMatched, this);
		},
        //***************************************************** */
		// @ts-ignore
		// @ts-ignore
		OnClickHandler:function(oEvent) {
			
			// var clickedData = oEvent.getParameter("data")[0].data;

			// var category = clickedData.Category;

			// var prodtrend = [];

			// var oData2;
   
			// jQuery.ajax({
			// 	type: "GET",
			// 	contentType: "application/json",
			// 	url: "/productinventory/getprodtrend()",
			// 	dataType: "json",
			// 	async: false,
			// 	success: function (data, textStatus, jqXHR) {
			// 		console.log("User details fetch is successful ");
			// 		oData2 = data;
					
			// 		oData2.forEach(iData => { 
			// 		   prodtrend.push(iData);
					  
			// 		});
					
			// 	},
			// 	error: function (data, textStatus, jqXHR) {
			// 		MessageBox.error("Error occurred in getting user details ");
			// 	}
			   
			// });
			// var oModel3 = new sap.ui.model.json.JSONModel({ producttrend : prodtrend });
			// // Add model name in setter		              
			// this.getView().setModel(oModel3, 'producttrend');  
			// //this.getRouter().navTo("View5",{
			// 	//category: clickedData.Category
			// //});
			
			
		},
		OnClickHandler1:function(oEvent) {
			
			var clickedData = oEvent.getParameter("data")[0].data;

			var name = clickedData.Product_Name;

			var prodtrend = [];

			var oData3;
   
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/productinventory/getprodqty()",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					console.log("User details fetch is successful ");
					oData3 = data;
					
					oData3.forEach(iData => { 
					   var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						   pattern: "YYYY/MM/dd"
					   });
					   
					   iData.added_on =  oDateFormat.format(new Date(iData.added_on));
					   prodtrend.push(iData);
					  
					});
					
				},
				error: function (data, textStatus, jqXHR) {
					MessageBox.error("Error occurred in getting user details ");
				}
			   
			});
			var oModel4 = new sap.ui.model.json.JSONModel({ producttrend1 : prodtrend });
			// Add model name in setter		              
			this.getView().setModel(oModel4, 'producttrend1');  
			//this.getRouter().navTo("View5",{
				//category: clickedData.Category
			//});
			
			
		},
		_onRouteMatched: function(oEvent) {
			 username  = oEvent.getParameter("arguments").username;
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
		onHome: function(){
		                      
			this.getRouter().navTo("View2",{
				username: username } );     	

	},
			onNavBack: function(){
		                      
				this.getRouter().navTo("RouteView1");
	
			},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

	// @ts-ignore
	// @ts-ignore
	});
// @ts-ignore
// @ts-ignore
});
