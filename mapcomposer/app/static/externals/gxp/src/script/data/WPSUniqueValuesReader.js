/**
* Copyright (c) 2014 Geosolutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.data
 *  class = WPSUniqueValuesReader
 *  base_link = `Ext.data.JsonReader <http://extjs.com/deploy/dev/docs/?class=Ext.data.JsonReader>`_
 */
Ext.namespace("gxp.data");

/** api: constructor
 *  .. class:: WPSUniqueValuesReader(conn)
 *   
 *      A reader for responses generated by Geoserver WPS PagedUnique process.
 *      See Ext.data.JsonReader for configuration parameters.
 */
gxp.data.WPSUniqueValuesReader = Ext.extend(Ext.data.JsonReader, {
    constructor: function(config) {
      	Ext.applyIf(config, {
            root: 'values',
            totalProperty: 'size',
            idProperty: 'value',
            fields: [{name:'value', mapping: '', convert: function (a,b) {
                    return b;
                }}]
        });
        gxp.data.WPSUniqueValuesReader.superclass.constructor.call(this, config);
    },
	//parser: new OpenLayers.Format.GML(),
    /**
     * This method is only used by a DataProxy which has retrieved data from a remote server.
     * @param {Object} response The XHR object which contains the JSON data in its responseText.
     * @return {Object} data A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
     
    read : function(response){
		//var gmlData = response.executeResponse.processOutputs[0].complexData.value;
        var jsonArray = this.parser.read({documentElement: gmlData});
        return this.readRecords({data:jsonArray});
    },*/
    /**
     * Decode a JSON response from server.
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Object} response The XHR object returned through an Ajax server request.
     * @return {Response} A {@link Ext.data.Response Response} object containing the data response, and also status information.
     */
    readResponse : function(action, response) {
        this.read(response);
    },
    
    /*
     * Overridden version of private method extractData in Ext.data.DataReader.
     * This version skips null values in the data root (no row will be 
     * created for these objects).
     */
    /**
     * returns extracted, type-cast rows of data.  Iterates to call #extractValues for each row
     * @param {Object[]/Object} data-root from server response
     * @param {Boolean} returnRecords [false] Set true to return instances of Ext.data.Record
     * @private
     */
    extractData : function(root, returnRecords) {
        // A bit ugly this, too bad the Record's raw data couldn't be saved in a common property named "raw" or something.
        var rawName = (this instanceof Ext.data.JsonReader) ? 'json' : 'node';

        var rs = [];

        // Had to add Check for XmlReader, #isData returns true if root is an Xml-object.  Want to check in order to re-factor
        // #extractData into DataReader base, since the implementations are almost identical for JsonReader, XmlReader
        if (this.isData(root) && !(this instanceof Ext.data.XmlReader)) {
            root = [root];
        }
        var f       = this.recordType.prototype.fields,
            fi      = f.items,
            fl      = f.length,
            rs      = [];
        if (returnRecords === true) {
            var Record = this.recordType;
            for (var i = 0; i < root.length; i++) {
                var n = root[i];
                // skip null values
                if (n !== null) {
                    var record = new Record(this.extractValues(n, fi, fl), this.getId(n));
                    record[rawName] = n;    // <-- There's implementation of ugly bit, setting the raw record-data.
                    rs.push(record);
                }
            }
        }
        else {
            for (var i = 0; i < root.length; i++) {
            	// skip null values
                if (root[i] !== null) {
                    var data = this.extractValues(root[i], fi, fl);
                    data[this.meta.idProperty] = this.getId(root[i]);
                    rs.push(data);
                }
            }
        }
        return rs;
    }
    
});
Ext.reg('gxp_wpsuniquereader', gxp.data.WPSUniqueValuesReader);