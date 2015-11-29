var g_smEqu = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
var g_cmEqu = new Ext.grid.ColumnModel([
	g_smEqu,{
		id: 'equid',
		header: '设备主键',
		dataIndex: 'equid',
		hidden: true,
		width: 200
	},{
		id: 'ggid',
		header: '到货主键',
		dataIndex: 'equid',
		hidden: true,
		width: 200
	},{   
		id: 'conid',
		header: '合同主键',
		dataIndex: 'conid',
		hidden: true,
		width: 200
	},{
		id: 'equName',
		header: '设备名称',
		dataIndex: 'equName',
		width: 200
	}
]);
g_cmEqu.defaultSortable = true;

var g_columnsEqu = [
	{name: 'equid', type: 'string'},
	{name: 'ggid', type: 'string'},
	{name: 'conid', type: 'string'},
	{name: 'equName', type: 'string'}
];

var g_storeEqu = new Ext.data.Store({
	baseParams: {
    	ac: 'list',
    	bean: bean,
    	business: business,
    	method: 'findWhereOrderBy'
	},
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'equid'
    }, g_columnsEqu),

    // 设置是否可以服务器端排序
    remoteSort: true,
    pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
});

var btnSaveSel = new Ext.Button({
	text: '保存',
	iconCls: 'save',
	handler: saveSelected
});

var g_gridEqu = new Ext.grid.GridPanel({
    store: g_storeEqu,
    cm: g_cmEqu,
    sm: g_smEqu,
    iconCls: 'icon-show-all',
    tbar: [
		new Ext.Button({
			text: '<font color=#15428b><b>&nbsp;设备</b></font>',
			iconCls: 'title'
		})
	],
    border: false,
    width: 200,
//    height: 100,
    split: true,
    autoScroll: true,
    region: 'center',
    loadMask: true,
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: g_storeEqu,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    })
});

g_smEqu.on('selectionchange', selectEquInfoPart);
////////////////////////////  设备  end  ////////////////////////////

////////////////////////////  部件  begin  ////////////////////////////
var g_smEquSub = new Ext.grid.CheckboxSelectionModel();

var g_cmEquSub = new Ext.grid.ColumnModel([
	g_smEquSub,
	{
		id: 'partid',
		header: '部件主键',
		dataIndex: 'partid',
		hidden: true,
		width: 200
	},{
		id: 'equid',
		header: '设备主键',
		dataIndex: 'equid',
		hidden: true,
		width: 200
	},{
		id: 'ggid',
		header: '到货主键',
		dataIndex: 'equid',
		hidden: true,
		width: 200
	},{
		id: 'partName',
		header: '部件名称',
		dataIndex: 'partName',
		width: 200
	}
]);
g_cmEquSub.defaultSortable = true;

var g_columnsEquSub = [
	{name: 'partid', type: 'string'},
	{name: 'equid', type: 'string'},
	{name: 'ggid', type: 'string'},
	{name: 'partName', type: 'string'}
];

var g_storeEquSub = new Ext.data.Store({
	baseParams: {
    	ac: 'list',
    	bean: beanPart,
    	business: business,
    	method: listMethod,
    	params: null
	},
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'partid'
    }, g_columnsEquSub),

    // 设置是否可以服务器端排序
    remoteSort: true,
    pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
});

var titleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;部件</b></font>',
	iconCls: 'title'
});

var g_gridEquSub = new Ext.grid.GridPanel({
    store: g_storeEquSub,
    cm: g_cmEquSub,
    sm: g_smEquSub,
    iconCls: 'icon-show-all',
    tbar: [
    	titleBar, '->', 
		new Ext.Button({
			text: '保存',
			iconCls: 'save',
			handler: saveSelectedPart
		})],
    border: false,
    header: false,
    collapseMode: 'mini',
    maxSize: 360,
    minSize: 360,
    region: 'east',
    width: 360,
    //height: 260,
    split: true,
    autoScroll: true,
    loadMask: true,
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	}
//	bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
//        pageSize: PAGE_SIZE,
//        store: g_storeEquSub,
//        displayInfo: true,
//        displayMsg: ' {0} - {1} / {2}',
//        emptyMsg: "无记录。"
//    })
});
////////////////////////////  部件  end  ////////////////////////////
function selectEquInfoPart(){
	var record = g_smEqu.getSelected();
	if (record){
		var g_equid = record.get("equid");
		var g_equName = record.get("equName");
		var text = '<font color=#15428b><b>&nbsp;'+g_equName+' - 部件</b></font>';
		titleBar.setText(text);
		var partids;
		DWREngine.setAsync(false); 
   		equGetGoodsMgm.getEquInfoPartList(g_equid, function(list){
   			if (list.length > 0) {
				partids = "(";
				for (var i = 0; i < list.length; i++){
					partids += "'"+list[i]+"'";
					if (i < list.length - 1) partids += ",";
				}
				partids += ")";
			}else{
				partids = "('')";
			}
   		});
   		DWREngine.setAsync(true); 
    	g_storeEquSub.baseParams.method = 'findWhereOrderBy';
    	g_storeEquSub.baseParams.params = 'partid in '+partids;
    	g_storeEquSub.load();
	}
}

function saveSelected(){
	var records = g_smEqu.getSelections();
	if (records){
		var equids = new Array();
		for (var i = 0; i < records.length; i++) {
			equids.push(records[i].get('equid'));
		}
		if (selectedGgId != ""){
			equGetGoodsMgm.saveSelectedInfo(equids, selectedGgId, function(){
				Ext.example.msg('保存成功！', '您成功保存所选信息！');
				storeEqu.baseParams.method = "findByProperty";
		    	storeEqu.baseParams.params = "ggid"+SPLITB+selectedGgId;
		    	storeEqu.load();
		    	formWindow.hide();
			});
		} else {
			Ext.example.msg('操作错误！', '请先选择[设备到货]数据！');
			formWindow.hide();
		}
	}
}

function saveSelectedPart(){
	var records = g_smEquSub.getSelections();
	if (records && records.length > 0){
		var partids = new Array();
		for (var i = 0; i < records.length; i++) {
			partids.push(records[i].get('partid'));
		}
		if (selectedGgId != ""){
			equGetGoodsMgm.saveSelectedPart(partids, records[0].get('equid'), selectedGgId, function(){
				Ext.example.msg('保存成功！', '您成功保存所选信息！');
		    	equGetGoodsMgm.getGoodsSub(selectedGgId, function(list){
		    		var data_sub = new Array();
		    		for (var i = 0; i < list.length; i++) {
		    			var obj = new Array();
		    			obj.push(list[i].GETID);
		    			obj.push(list[i].PID);
		    			obj.push(list[i].PARTID);
		    			obj.push(list[i].EQUID);
		    			obj.push(list[i].GGID);
		    			obj.push(list[i].GG_NUM);
		    			obj.push(list[i].MACHINE_NO);
		    			obj.push(list[i].EQU_NAME);
		    			obj.push(list[i].PART_NAME);
			    		obj.push(list[i].PART_NUM);
			    		data_sub.push(obj);
					}
					storeEquSub.loadData(data_sub);
		    	});
		    	partWindow.hide();
			});
		} else {
			Ext.example.msg('操作错误！', '请先选择[设备到货]数据！');
			partWindow.hide();
		}
	} else {
		Ext.example.msg('操作错误！', '请先选择[设备]数据！');
	}
}

