/*  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
*  http://www.geo-solutions.it
*
*  GPLv3 + Classpath exception
*
*  This program is free software: you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation, either version 3 of the License, or
*  (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  You should have received a copy of the GNU General Public License
*  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.widgets
 *  class = WFSChangeMatrixResume
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets");

/** api: constructor
 *  .. class:: WFSResume(config)
 *
 *    Show a resume for a record
 */
gxp.widgets.WFSChangeMatrixResume = Ext.extend(gxp.widgets.WFSResume, {

	/** api: ptype = gxp_changematrixresume */
	ptype : "gxp_changematrixresume",
	
	// Begin i18n.

	/** api: config[chgMatrixFieldSetTitle]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	chgMatrixFieldSetTitle : 'Change Matrix Inputs',

	/** api: config[scatterChartTabTitle]
	 * ``String``
	 * Text for Scatter Chart Tab Panel (i18n).
	 */
	scatterChartTabTitle : "Scatter Chart",

	/** api: config[pieChartMenuLabel]
	 * ``String``
	 * Text for the Change Matrix Grid Menu Label (i18n).
	 */
	pieChartMenuLabel : "Print Pie Chart",
	
	/** api: config[interactiveChgMatrixLabel]
	 * ``String``
	 * Text for the Change Matrix Menu Label (i18n).
	 */
	interactiveChgMatrixLabel : "Interactive Change Matrix",
	
	/** api: config[pieChartTabTitle]
	 * ``String``
	 * Text for Pie Chart Tab Panel (i18n).
	 */
	pieChartTabTitle : "Pie Chart",
	
	/** api: config[scatterChartTitle]
	 * ``String``
	 * Text for Scatter Chart Main Title (i18n).
	 */
	scatterChartTitle : "Reference Versus Current Classes",

	/** api: config[scatterChartSubTitle]
	 * ``String``
	 * Text for Scatter Chart Sub Title (i18n).
	 */
	scatterChartSubTitle : " - ChangeMatrix Process - ",

	/** api: config[scatterChartYAxisLabel]
	 * ``String``
	 * Text for Scatter Chart Y-Axis (i18n).
	 */
	scatterChartYAxisLabel : "Current",

	/** api: config[scatterChartXAxisLabel]
	 * ``String``
	 * Text for Scatter Chart X-Axis (i18n).
	 */
	scatterChartXAxisLabel : "Reference",

	/** api: config[changeMatrixActionTip]
	 *  ``String``
	 *  Text for add action tooltip (i18n).
	 */
	changeMatrixActionTip : "Get a change matrix for a raster layer",

	/** api: config[changeMatrixDialogTitle]
	 *  ``String``
	 *  Title of the changeMatrix form window (i18n).
	 */
	changeMatrixDialogTitle : "Change matrix",

	/** api: config[changeMatrixClassesFieldLabel]
	 *  ``String``
	 *  Text for the Classes field label (i18n).
	 */
	changeMatrixClassesFieldLabel : "Classes",

	/** api: config[changeMatrixRasterFieldLabel]
	 *  ``String``
	 *  Text for the Raster field label (i18n).
	 */
	changeMatrixRasterFieldLabel : "Raster Layer",

	/** api: config[changeMatrixCQLFilterT0FieldLabel]
	 *  ``String``
	 *  Text for the CQL Filter T0 field label (i18n).
	 */
	changeMatrixCQLFilterT0FieldLabel : "Time Filter (reference)",

	/** api: config[changeMatrixCQLFilterT1FieldLabel]
	 *  ``String``
	 *  Text for the CQL Filter T1 field label (i18n).
	 */
	changeMatrixCQLFilterT1FieldLabel : "Time Filter (current)",

	/** api: config[changeMatrixResetButtonText]
	 *  ``String``
	 *  Text for the changeMatrix form submit button (i18n).
	 */
	changeMatrixSubmitButtonText : "Submit",

	/** api: config[changeMatrixResetButtonText]
	 *  ``String``
	 *  Text for the changeMatrix form reset button (i18n).
	 */
	changeMatrixResetButtonText : "Reset",

	/** api: config[changeMatrixResultsTitle]
	 *  ``String``
	 *  Text for the changeMatrix results container (i18n).
	 */
	changeMatrixResultsTitle : "Change Matrix",

	// EoF i18n
    
    /** api: config[url]
     *  ``String`` URL for the layer creation
     */
	url: null,

	/** private: method[addOutput]
	 *  :arg config: ``Object``
	 */
	addOutput : function(config) {

		var finalConfig = {};

		Ext.apply(finalConfig, config || {});

		// Get panel
		if(finalConfig.data 
			&& finalConfig.name 
			&& finalConfig.referenceName){
			var resultGrid = this.createResultsGrid(finalConfig.data, finalConfig.name, finalConfig.referenceName);
			Ext.apply(finalConfig, resultGrid);
		}

		// ///////////////////
		// Call super class addOutput method and return the panel instance
		// ///////////////////
		return gxp.widgets.WFSResume.superclass.addOutput.call(this, config);
	},

	/**
	 * Add support for some classes.
	 **/
	addSupport: function(classesIndexes, classes, geocoderConfig){
		// TODO: add classes and classes indexes
		this.classesIndexes = classesIndexes;
		this.classes = classes;
		this.geocoderConfig = geocoderConfig;
	},

	/**
	 *
	 * @param {Object} data
	 */
	guessIndexes : function(data, classDataIndex) {
		var changeMatrix = data;
		var xs = [], ys = [];
		axisy = [], axisx = [];
		var dim = Math.sqrt(data.length);

		//create output matrix
		var matrix = new Array(dim + 1);
		for (var i = 0; i < dim + 1; i++) {
			matrix[i] = new Array(dim + 1);
		}
		var xAttribute = "now";
		var yAttribute = "ref";
		var dataAttribute = "pixels";

		for (var i = 0; i < changeMatrix.length; i++) {
			var el = changeMatrix[i];
			if (axisx.indexOf(el[xAttribute]) < 0) {
				axisx.push(el[xAttribute]);
			}

		}
		axisx.sort(function(a, b) {
			return parseInt(a) - parseInt(b)
		});
		for (var i = 0; i < changeMatrix.length; i++) {
			var el = changeMatrix[i];
			var x = axisx.indexOf(el[xAttribute]);
			var y = axisx.indexOf(el[yAttribute]);
			matrix[x][y + 1] = el[dataAttribute];

			// Partial Sum
			matrix[x][matrix.length] = (matrix[x][matrix.length] && !isNaN(matrix[x][matrix.length]) ? matrix[x][matrix.length] : 0) + el[dataAttribute];
			matrix[matrix.length-1][y + 1] = (matrix[matrix.length-1][y + 1] && !isNaN(matrix[matrix.length-1][y + 1]) ? matrix[matrix.length-1][y + 1] : 0) + el[dataAttribute];

			// Total Sum
			matrix[matrix.length-1][matrix.length] = (matrix[matrix.length-1][matrix.length] && !isNaN(matrix[matrix.length-1][matrix.length]) ? matrix[matrix.length-1][matrix.length] : 0) + el[dataAttribute];
		}

		for (var i = 0; i < matrix.length - 1; i++) {
			// ////////////////////
			// To be changed with this.classes values
			// ////////////////////
			matrix[i][0] = this.classesIndexes[this.classes[classDataIndex].level-1][1][axisx[i]-1][1];
			axisx[i] = axisx[i] + "";

			// ///////////////////
			// Adding Pie Chart buttons
			// ///////////////////
			matrix[i][matrix.length]       = "<img src='theme/app/img/silk/information.png' style='vertical-align: middle;width: 16px;'/> " + matrix[i][matrix.length];
			matrix[matrix.length-1][i + 1] = "<img src='theme/app/img/silk/information.png' style='vertical-align: middle;width: 16px;'/> " + matrix[matrix.length-1][i + 1];
		}
		
		matrix[matrix.length-1][0] = "[Sum]";
		axisx[matrix.length - 1] = "[Sum]";

		// descending x
		// ascending y
		//axisy.sort(function(a,b){return parseInt(b)-parseInt(a)});
		var fields = [];
		fields.push(" ");
		for (var i = 0; i < axisx.length; i++) {
			fields.push(axisx[i]);
		}
		return {
			fields : fields,
			data : matrix
		};

	},

	/**
	 *
	 * @param {Object} responseData
	 */
	createResultsGrid : function(responseData, rasterName, referenceName) {
		var me = this;
		var data = responseData.changeMatrix;
		
		//layer level
		var classDataIndex = 0;
		for ( classDataIndex = 0; classDataIndex < me.classes.length; classDataIndex++) {
			if (me.classes[classDataIndex].layer == referenceName)
				break;
		}
		if (classDataIndex >= me.classes.length) {
			return;
		}
		
		var settings = this.guessIndexes(data, classDataIndex);

		//store
		var changeMatrixStore = new Ext.data.ArrayStore({
			storeId : 'changeMatrixStore',
			autoLoad : false,
			fields : settings.fields,
			data : settings.data
		});

		//calculate min/max values, to scale values down to a 0-100 range
		var min, max;
		changeMatrixStore.each(function(record) {
			if (min == null || record.get('pixels') < min)
				min = record.get('pixels');
			if (max == null || record.get('pixels') > max)
				max = record.get('pixels');
		});

		var colmodel = [];
		for (var i = 0; i < settings.fields.length - 1; i++) {
			// ////////////////////
			// To be changed with this.classes values
			// ////////////////////
			colmodel.push({
				header : (typeof parseInt(settings.fields[i]) === 'number' && parseInt(settings.fields[i]) % 1 == 0?this.classesIndexes[me.classes[classDataIndex].level-1][1][parseInt(settings.fields[i])-1][1]:settings.fields[i]),
				dataIndex : settings.fields[i]
			});
		}
		colmodel.push({
			header : settings.fields[settings.fields.length - 1],
			dataIndex : settings.fields[settings.fields.length - 1]
		});

		colmodel[0].id = 'leftaxis';
		// to assign css
		colmodel[0].header = '-';

		// ///////////////////////////////////////
		// Grid Panel
		// ///////////////////////////////////////
		var changeMatrixGridPanel = new Ext.grid.GridPanel({
			title : this.changeMatrixResultsTitle,
			store : changeMatrixStore,
			height : 300,
			width : 300,
			columns : colmodel,
			viewConfig : {
				getRowClass : function(record, index, rowParams) {
					// calculate the percentage
					var percentValue = Math.round(((record.get('pixels') - min) / max) * 100);

					// calculate color (0 = green, 100 = red)
					var r = Math.round((255 * percentValue) / 100);
					var g = Math.round((255 * (100 - percentValue)) / 100);
					var b = 0;

					// add inline styles to the row
					rowParams.tstyle = 'width:' + this.getTotalWidth() + ';';
					rowParams.tstyle += "background-color: rgb(" + r + "," + g + "," + b + ");";
				}
			},
			sm : new Ext.grid.CellSelectionModel(),
			listeners : {
				cellclick : function(grid, rowIndex, columnIndex, e) {
					var record = grid.getStore().getAt(rowIndex);
					// Get the Record
					var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
					// Get field name
					var data = record.get(fieldName);
					
					/**
					 * Checks on row click. Either print a Pie-Chart or load interactive matrix on the map.
					 */
					var gridRowLabel = record.json[0];
					var gridColLabel = grid.getColumnModel().getColumnHeader(columnIndex);
					//console.log(gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
					
					// ///////////////////////////////////////////
					// If the Row or Column Labels match the wordi
					// ng '[Sum]', we are at an extrema of the gri
					// d. In this case we need to collect data for
					// a new Pie Chart to be loaded in the Tab Pan
					// el.
					// ///////////////////////////////////////////
					if ((gridRowLabel && gridRowLabel == '[Sum]') || (gridColLabel && gridColLabel == '[Sum]')) {
						if (!(gridRowLabel == '[Sum]' && gridColLabel == '[Sum]')) {
							var menu_grid = new Ext.menu.Menu({
								items : [{
									iconCls : 'icon-piechart',
									text : me.pieChartMenuLabel,
									handler : function() {
										//console.log("Print Pie Chart -> " + gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
										// //////////////////////////////
										// Creating the pie chart series
										// //////////////////////////////
										var pieChartTitle = null;
										var pieChartSubTitle = null;
										var dataSeries = [];
										// Check if either a row or a column has been clicked
										if (gridColLabel == '[Sum]') { // Row
											/**
											 * Reference -> Current
											 */
											pieChartTitle = me.scatterChartXAxisLabel + " -> " + me.scatterChartYAxisLabel;
											pieChartSubTitle = " - " + gridRowLabel + " - ";
											
											/**
											 * Populate the data series by selecting the row dataset
											 */
											var total = data.substring(data.indexOf("> ")+2);
											for (var r=1;r<record.json.length-1;r++) {
												var dataItem = [];
												dataItem.push(me.classesIndexes[me.classes[classDataIndex].level-1][1][grid.getColumnModel().getDataIndex(r)-1][1]);
												dataItem.push(parseFloat(record.json[r])*100/parseFloat(total));
												if (dataItem[0] != gridRowLabel)
													dataSeries.push(dataItem);
											}
											
											/**
											 * Dynamically create the chart
											 */
											addPieChartToTabPanel(me.pieChartTabTitle, pieChartTitle, pieChartSubTitle, dataSeries);
										}
										else if (gridRowLabel == '[Sum]') { // Column
											/**
											 * Reference -> Current
											 */
											pieChartTitle = me.scatterChartYAxisLabel + " -> " + me.scatterChartXAxisLabel;
											pieChartSubTitle = " - " + gridColLabel + " - ";
											
											/**
											 * Populate the data series by selecting the column dataset
											 */
											var total = data.substring(data.indexOf("> ")+2);
											for (var r=1;r<record.json.length-1;r++) {
												var dataItem = [];
												var row = grid.getStore().getAt(r-1);
												dataItem.push(row.json[0]);
												dataItem.push(parseFloat(row.json[columnIndex])*100/parseFloat(total));
												if (dataItem[0] != gridColLabel)
													dataSeries.push(dataItem);
											}
											
											/**
											 * Dynamically create the chart
											 */
											addPieChartToTabPanel(me.pieChartTabTitle, pieChartTitle, pieChartSubTitle, dataSeries);
										}
									}
								}, {
									iconCls : 'data-table',
									text : me.interactiveChgMatrixLabel,
									//disabled: true,
									handler : function() {
										//console.log("Interactive Change Matrix ("+rasterName+") -> " + gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
										// Check if either a row or a column has been clicked
										var map = me.target.mapPanel.map;
										
										if (gridColLabel == '[Sum]') { // Row
											/**
											 * Style ENV Parameter
											 */
											var referenceClassIndex = 0;
											for (var ci=0;ci<me.classesIndexes[me.classes[classDataIndex].level-1][1].length;ci++) {
												if (me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][1] == gridRowLabel) {
													referenceClassIndex=me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][0];
												}
											}
											
											/**
											 * Dynamically create the layer
											 */
				                            //create the properties
				                            var name = "[ref]"+me.interactiveChgMatrixLabel+" - "+gridRowLabel;
    										var src;				                            
											for (var id in me.target.layerSources) {
												  var s = me.target.layerSources[id];    
												  
												  // //////////////////////////////////////////
												  // Checking if source URL aldready exists
												  // //////////////////////////////////////////
												  if(s != undefined && s.id == me.geocoderConfig.source){
													  src = s;
													  break;
												  }
											} 
				                            
				                            if (src) {
					                            var props ={
					                            			source: me.target.layerSources.jrc.id,
					                                        name: me.geocoderConfig.nsPrefix+":"+rasterName,
					                                        url: me.url,
					                                        title: name,
					                                        tiled:true,
					                                        layers: rasterName,
					                                        env: "dataEnv:ref="+referenceClassIndex+",cur=0"
					                                };

												src.on('ready', function(){
													me.addLayerRecord(src, props);
												}, me);
												
											    var index = src.store.findExact("name", me.geocoderConfig.nsPrefix+":"+rasterName);
												
												if (index < 0) {
													// ///////////////////////////////////////////////////////////////
													// In this case is necessary reload the local store to refresh 
													// the getCapabilities records 
													// ///////////////////////////////////////////////////////////////
													src.store.reload();
												}else{
													me.addLayerRecord(src, props);
												}
				                            }
    										
    										/*
											 * Check if tabs exists and if so switch to View Tab 
											 */
											var hasTabPanel = false;
											if (me.target.renderToTab && me.renderToTab) {
												var container = Ext.getCmp(me.target.renderToTab);
												if (container.isXType('tabpanel'))
													hasTabPanel = true;
											}
									
											if (hasTabPanel) {
												if (me.win)
													me.win.destroy();
												container.setActiveTab(0);
											}
										}
										else if (gridRowLabel == '[Sum]') { // Column
											/**
											 * Style ENV Parameter
											 */
											var currClassIndex = 0;
											for (var ci=0;ci<me.classesIndexes[me.classes[classDataIndex].level-1][1].length;ci++) {
												if (me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][1] == gridColLabel) {
													currClassIndex=me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][0];
												}
											}
											
											//console.log("currClassIndex -> " + currClassIndex);
											
											/**
											 * Dynamically create the layer
											 */
				                            //create the properties
				                            var name = "[cur]"+me.interactiveChgMatrixLabel+" - "+gridColLabel;
    										var src;				                            
											for (var id in me.target.layerSources) {
												  var s = me.target.layerSources[id];    
												  
												  // //////////////////////////////////////////
												  // Checking if source URL aldready exists
												  // //////////////////////////////////////////
												  if(s != undefined && s.id == me.geocoderConfig.source){
													  src = s;
													  break;
												  }
											} 
				                            
				                            if (src) {
					                            var props ={
					                            			source: me.target.layerSources.jrc.id,
					                                        name: me.geocoderConfig.nsPrefix+":"+rasterName,
					                                        url: me.url,
					                                        title: name,
					                                        tiled:true,
					                                        layers: rasterName,
					                                        env: "dataEnv:ref=0,cur="+currClassIndex
					                                };

												src.on('ready', function(){
													me.addLayerRecord(src, props);
												}, me);
												
											    var index = src.store.findExact("name", me.geocoderConfig.nsPrefix+":"+rasterName);
												
												if (index < 0) {
													// ///////////////////////////////////////////////////////////////
													// In this case is necessary reload the local store to refresh 
													// the getCapabilities records 
													// ///////////////////////////////////////////////////////////////
													src.store.reload();
												}else{
													me.addLayerRecord(src, props);
												}
				                            }

    										/*
											 * Check if tabs exists and if so switch to View Tab 
											 */
											var hasTabPanel = false;
											if (me.target.renderToTab && me.renderToTab) {
												var container = Ext.getCmp(me.target.renderToTab);
												if (container.isXType('tabpanel'))
													hasTabPanel = true;
											}
									
											if (hasTabPanel) {
												if (me.win)
													me.win.destroy();
												container.setActiveTab(0);
											}
										}
									}
								}]
							});
							var position = e.getXY();
	                        e.stopEvent();
	                        menu_grid.showAt(position);
                        }
					}
				}
			}
		});
		
		// ///////////////////////////////////////
		// Scatter High-Chart Panel
		// ///////////////////////////////////////
		var series = [];
		for (var d = 0; d < settings.data.length - 1; d++) {
			var data = {};
			var dataMatrix = [];
			for (var dd = 0; dd < settings.data[d].length - 2; dd++) {
				var dataRow = [];
				dataRow.push(d + 1);
				dataRow.push(dd + 1);
				dataRow.push(settings.data[d][dd + 1]);

				dataMatrix.push(dataRow);
			}
			data.data = dataMatrix;
			series.push(data);
		}

		var changeMatrixScatterChart = this.generateScatterChart(settings, series);

		// ///////////////////////////////////////
		// Main Tab Panel
		// ///////////////////////////////////////
		var changeMatrixOutcomeTabPanel = new Ext.TabPanel({
			title : this.changeMatrixResultsTitle,
			height : 300,
			width : 300,
			closable : true,
			renderTo : Ext.getBody(),
			activeTab : 0,
			items : [changeMatrixGridPanel, changeMatrixScatterChart]
		});

		// ///////////////////////////////////////
		// Pie High-Chart Panel
		// ///////////////////////////////////////
		var addPieChartToTabPanel = function(pieChartTabTitle, pieChartTitle, pieChartSubTitle, data) {
			var changeMatrixPieChart = new Ext.ux.HighChart({
				title : pieChartTabTitle,
				animation : true,
				animShift : true,
				closable : true,
				series : [{
					type : 'pie',
					data : data
				}],
				chartConfig : {
					chart : {
						plotBackgroundColor : null,
						plotBorderWidth : null,
						plotShadow : true,
						spacingBottom : 65
					},
					title : {
						text : pieChartTitle
					},
					subtitle : {
						text : pieChartSubTitle
					},
					tooltip : {
						pointFormat : '{point.name}: <b>{point.percentage:.4f}%</b>'
					},
					plotOptions : {
						pie : {
							allowPointSelect : true,
							cursor : 'pointer',
							dataLabels : {
								enabled : true,
								color : '#000000',
								connectorColor : '#000000',
								format : '<b>{point.name}</b>: {point.percentage:.4f} %'
							}
						}
					}
					/*,exporting: {
					 enabled: true,
					 width: 1200,
					 url: this.highChartExportUrl
					 },*/
				}
			});
			
			changeMatrixOutcomeTabPanel.add(changeMatrixPieChart);
			changeMatrixOutcomeTabPanel.doLayout();
		};
		
		// ///////////////////////////////////////
		// Drawing the Panel
		// ///////////////////////////////////////
		//return changeMatrixGridPanel;		
		return changeMatrixOutcomeTabPanel;
	},

	generateScatterChart: function(settings, series){
		return new Ext.ux.HighChart({
			title : this.scatterChartTabTitle,
			animation : true,
			animShift : true,
			series : series,
			chartConfig : {
				chart : {
					type : 'bubble',
					zoomType : 'xy',
					spacingBottom : 65
				},
				title : {
					text : this.scatterChartTitle
				},
				subtitle : {
					text : this.scatterChartSubTitle
				},
				yAxis : [{
					title : {
						enabled : true,
						text : this.scatterChartYAxisLabel
					},
					gridLineWidth : 1,
					style : {
						backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
					},
					labels : {
						style : {
							backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
						},
						rotation : 320,
						y : 0,
						formatter : function() {
							if (typeof this.value === 'number' && this.value % 1 == 0)
								if (settings.data[this.value - 1] && settings.data[this.value-1][0] && settings.data[this.value-1][0] != '[Sum]')
									return settings.data[this.value-1][0];
						}
					}
				}],
				xAxis : [{
					title : {
						enabled : true,
						text : this.scatterChartXAxisLabel
					},
					gridLineWidth : 1,
					style : {
						backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
					},
					labels : {
						style : {
							backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
						},
						rotation : 320,
						y : +22,
						formatter : function() {
							if ( typeof this.value === 'number' && this.value % 1 == 0)
								if (settings.data[this.value - 1] && settings.data[this.value-1][0] && settings.data[this.value-1][0] != '[Sum]')
									return settings.data[this.value-1][0];
						}
					}
				}]
				/*,exporting: {
				 enabled: true,
				 width: 1200,
				 url: this.highChartExportUrl
				 },*/
			}
		});
	},

	/**  
	 * api: method[addLayerRecord]
     */
	addLayerRecord: function(src, props){
		var record = src.createLayerRecord(props);   
				  
		if (record) {
			var layerStore = this.target.mapPanel.layers;  
			layerStore.add([record]);

			modified = true; // TODO: refactor this

			// Merge Params
            var layerObject = record.get("layer");
            if (layerObject){
                layerObject.mergeNewParams({
                    env : props.env
                });
            }
					
		    //
			// If tabs are used the View tab is Activated
			//
			if(this.target.renderToTab && this.enableViewTab){
				var portalContainer = Ext.getCmp(this.target.renderToTab);
				
				if(portalContainer instanceof Ext.TabPanel){
					portalContainer.setActiveTab(1);
				}				
			}					
						
			// //////////////////////////
			// Zoom To Layer extent
			// //////////////////////////
			var layer = record.get('layer');
			var extent = layer.restrictedExtent || layer.maxExtent || this.target.mapPanel.map.maxExtent;
			var map = this.target.mapPanel.map;

			// ///////////////////////////
			// Respect map properties
			// ///////////////////////////
			var restricted = map.restrictedExtent || map.maxExtent;
			if (restricted) {
				extent = new OpenLayers.Bounds(
					Math.max(extent.left, restricted.left),
					Math.max(extent.bottom, restricted.bottom),
					Math.min(extent.right, restricted.right),
					Math.min(extent.top, restricted.top)
				);
			}

			map.zoomToExtent(extent, true);
		}
	}

});

Ext.preg(gxp.widgets.WFSChangeMatrixResume.prototype.ptype, gxp.widgets.WFSChangeMatrixResume);