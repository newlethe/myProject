var g_smEquSub = new Ext.grid.CheckboxSelectionModel({singleSelect: false});
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];

var g_cmEquSub = new Ext.grid.ColumnModel([
	g_smEquSub,
		{
			id: 'sb_id',
			header: '设备主键',
			dataIndex: 'SB_ID',
			hidden: true,
			width: 100
		}, {   
			id: 'wztype',
			header: '货物类别',
			dataIndex: 'WZTYPE',
			renderer:wztypeRender,
			width: 150
		}, {   
			id: 'sbmc',
			header: '货物名称',
			dataIndex: 'SB_MC',
			width: 150
		}, {
			id: 'ggxh',
			header: '规格型号',
			dataIndex: 'GGXH',
			width: 100
		}, {
			id: 'dw',
			header: '单位',
			dataIndex: 'DW',
			width: 50
		}, {
			id: 'zs',
			header: '总数量',
			dataIndex: 'ZS',
			width: 80
		}, {
			id: 'dhsl',
			header: '到货总数',
			dataIndex: 'DHSL',
			width: 80
		}, {
			id: 'sccj',
			header: '生产厂家',
			dataIndex: 'SCCJ',
			width: 150
		}, {
			id: 'jzh',
			header: '机组号',
			dataIndex: 'JZH',
			renderer:jzhRender,
			width: 80
		}
]);
g_cmEquSub.defaultSortable = true;

function showEquData(obj){
    	if (selectedRecId != "" && obj != null){
    		data_rec.length = 0;
    		DWREngine.setAsync(false);
    		equRecMgm.equGoodsSub(selectedConId, function(list){
    			for (var i = 0; i < list.length; i++) {
	    			var obj = new Array();
		    		obj.push(list[i].SB_ID);
		    		obj.push(list[i].SB_MC);
		    		obj.push(list[i].GGXH);
		    		obj.push(list[i].DW);
		    		obj.push(list[i].ZS);
		    		obj.push(list[i].DHSL);
		    		obj.push(list[i].SCCJ);
		    		obj.push(list[i].JZH);
		    		obj.push(list[i].WZTYPE);
		    		data_rec.push(obj);
    			}
    		});
    		DWREngine.setAsync(true);
    		g_storeEquSub.loadData(data_rec);
    }
}
    
var g_columnsEquSub = [
	{name: 'SB_ID', type: 'string'},
	{name: 'SB_MC', type: 'string'},
	{name: 'GGXH', type: 'string'},
	{name: 'DW', type: 'string'},
	{name: 'ZS', type: 'float'},	
	{name: 'DHSL', type: 'float'},
	{name: 'SCCJ', type: 'string'},	
	{name: 'JZH', type: 'string'},
	{name: 'WZTYPE', type: 'string'}
];

var g_storeEquSub = new Ext.data.SimpleStore({
	fields: g_columnsEquSub
});

var titleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;到货设备与部件</b></font>',
	iconCls: 'title'
});

var btnFind = new Ext.Button({
	text: '查询',
	iconCls: 'btn',
	handler: findEqu
});

var btnSaveSel = new Ext.Button({
	text: '保存',
	iconCls: 'save',
	handler: saveSelected
});

var sbMc = new Ext.form.TextField({
    id: 'sbMc',
    name: 'sbMc'
});

var scCj = new Ext.form.TextField({
    id: 'scCj',
    name: 'scCj'
});

var jzH = new Ext.form.TextField({
    id: 'jzH',
    name: 'jzH'
});

var g_gridEquSub = new Ext.grid.GridPanel({
    store: g_storeEquSub,
    cm: g_cmEquSub,
    sm: g_smEquSub,
    iconCls: 'icon-show-all',
    border: false,
    tbar: [titleBar, '->', 
    	new Ext.Button({
        	text: "<font color=#15428b><b>&nbsp;货物名称</b></font>", 
        	iconCls: 'refresh'
        }),sbMc, 
        new Ext.Button({
        	text: "<font color=#15428b><b>&nbsp;生产厂家</b></font>", 
        	iconCls: 'refresh'
        }),scCj, 
        new Ext.Button({
        	text: "<font color=#15428b><b>&nbsp;机组号</b></font>", 
        	iconCls: 'refresh'
        }),jzH, 
    	btnFind, '->', btnSaveSel],
    region: 'center',
    width: 670,
    split: true,
    autoScroll: true,
    loadMask: true,
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	}
});

function saveSelected(){
	var records = g_smEquSub.getSelections();
	if (records){
		var equids = new Array();
		var dhsls = new Array();
		var jzhs = new Array();
		for (var i = 0; i < records.length; i++) {
			equids.push(records[i].get('SB_ID'));
			dhsls.push(records[i].get('DHSL'));
			jzhs.push(records[i].get('JZH'));
		}
		var failnote;
		if (equids.length > 0){
			DWREngine.setAsync(false); 
			equRecMgm.insertRec(selectedRecId, equids, dhsls, jzhs, function(state){
				if (state == "success") {
					Ext.example.msg('保存成功！', '您成功新增（' + equids.length + '）条设备领用从表信息！');
					formWindow.hide();
					data_rec.length = 0;
	    			//DWREngine.setAsync(false); 
	    			equRecMgm.equRecSub(selectedRecId, function(list){
	    				for (var i = 0; i < list.length; i++) {
		    				var obj = new Array();
		    				obj.push(list[i].RECSUBID);
		    				obj.push(list[i].RECID);
		    				obj.push(list[i].EQUID);
		    				obj.push(list[i].SB_MC);
		    				obj.push(list[i].PARENTMC);
		    				obj.push(list[i].GGXH);
		    				obj.push(list[i].DW);
		    				obj.push(list[i].ZS);
		    				obj.push(list[i].DHSL);
		    				obj.push(list[i].SCCJ);
		    				obj.push(list[i].PLE_RECNUM);
		    				obj.push(list[i].RECNUM);
		    				obj.push(list[i].MACHINE_NO);
		    				obj.push(list[i].RECDATE);
		    				obj.push(list[i].REMARK);
		    				obj.push(list[i].WZTYPE);
			    			data_rec.push(obj);
	    				}
	    			});
	    			//DWREngine.setAsync(true);
	    			dsSub.loadData(data_rec);
				}
				else {
					failnote = state;
					alert(failnote);
				}
			});
   			DWREngine.setAsync(true);
		}
	}
}

function formatDate(value){
       return value ? value.dateFormat('Y-m-d') : '';
};

function findEqu(){
	data_rec.length = 0;
	DWREngine.setAsync(false);
	equRecMgm.findRecEqu(sbMc.getValue(), scCj.getValue(), jzH.getValue(), function(list){
		for (var i = 0; i < list.length; i++) {
			var obj = new Array();
		    obj.push(list[i].SB_ID);
		    obj.push(list[i].SB_MC);
		    obj.push(list[i].GGXH);
		    obj.push(list[i].DW);
		    obj.push(list[i].ZS);
		    obj.push(list[i].DHSL);
		    obj.push(list[i].SCCJ);
		    obj.push(list[i].JZH);
		    obj.push(list[i].WZTYPE);
		    data_rec.push(obj);
		}	
	});
	DWREngine.setAsync(true);
	g_storeEquSub.loadData(data_rec);
}

   function jzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }    
   
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}   
