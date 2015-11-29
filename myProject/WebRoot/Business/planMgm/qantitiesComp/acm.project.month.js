var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
var primaryKey = "uids";
var orderColumn = "month desc";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var title = "<font color=#15428b><b>工程量投资完成</b></font>" 	
var billTypes = new Array();
var conComboxSelect = "ALL";
var gridPanel, conCombo, conStore;

Ext.onReady(function (){

 	DWREngine.setAsync(false);
	appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });    
	DWREngine.setAsync(true);
	conStore = new Ext.data.SimpleStore({
		fields : ['conid','conname','conno']
	})
	
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出工程合同，“详细设置”列包含GC
	var gcSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%GC%'";
	DWREngine.setAsync(false);
	baseMgm.getData(gcSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	
	
	var conSql = "select 'ALL' as conid,'所有合同' as conname,'ALL' as conno,'1' as type from dual union select conid,conname ,conno,'2' as type from con_ove t where t.partybno = (select cpid from con_partyb where partyb = '"+USERPOSNAME+"') order by type";
	if(showAllCon){
		//所有建筑安装的合同
		conSql = "select 'ALL' as conid,'所有合同' as conname,'ALL' as conno,'1' as type from dual union select conid,conname ,conno,'2' as type from con_ove t where t.condivno in ("+contFilterId+") and PID='" + CURRENTAPPID + "' order by type";
	}
	db2Json.selectSimpleData(conSql, function(dat){
		if(dat && dat!=null && dat.length>0) {
			conStore.loadData(eval(dat))
		}
	});
    DWREngine.setAsync(true);
    
    var editBtn = new Ext.Button({
    	id: 'edit',
    	text:'编辑',
    	iconCls:'btn',
    	handler: editFun
    })
    
    conCombo = new Ext.form.ComboBox({
    	name: "conId",
		fieldLabel: '选择合同',
		valueField: 'conid',
		displayField: 'conname', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: conStore,
        lazyRender: true,
        forceSelection: true,
        allowBlank:true,
        hidden : (isFlwTask || isFlwView),
        width : 300,
        listClass: 'x-combo-list-small',
		anchor:'95%'
    }) 
    conCombo.setValue("ALL");
    
    conCombo.on("select",function(obj,rec,inx){
   		conComboxSelect = obj.getValue()
    	ds.load({params:{start:0,limit: PAGE_SIZE}});
    });
    
	var fm = Ext.form; 
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})
	
	var fc = {		
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
    	}, 'monId': {
			name: 'monId',
			fieldLabel: '工程投资完成流程主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			allowBlank: false,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'month': {
			name: 'month',
			fieldLabel: '数据期别',
			anchor:'95%'
		}, 'decmoney': {
			name: 'decmoney',
			fieldLabel: '申报金额',
			allowNegative: false,
			anchor:'95%'
        }, 'checkmoney': {
			name: 'checkmoney',
			fieldLabel: '核定金额',
			allowNegative: false,
			anchor:'95%'
        }, 'ratiftmoney': {
			name: 'ratiftmoney',
			fieldLabel: '批准金额',
			allowNegative: false,
			anchor:'95%'
		}, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			emptyText: '请选择...',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            transform: 'billState', 
           // store: unitDs,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}
	}
	
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'monId', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'month', type: 'string'},
    	{name: 'decmoney', type: 'float'},
		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'billstate', type: 'string'}];
		
    var cm = new Ext.grid.ColumnModel([
    	sm,{
           id:'uids',
           header: fc['uids'].fieldLabel,
           dataIndex: fc['uids'].name,
		   hidden:true,
		   hideLabel:true
        }, {
           id:'monId',
           header: fc['monId'].fieldLabel,
           dataIndex: fc['monId'].name,
		   hidden:true,
		   hideLabel:true
        }, {
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           align : 'center',
           renderer: showContractName
        }, {
           id:'month',
           header: fc['month'].fieldLabel,
           dataIndex: fc['month'].name,
           width: 100,
           align : 'center',
           renderer: formatDate
        }, {
           id:'decmoney',
           header: fc['decmoney'].fieldLabel,
           dataIndex: fc['decmoney'].name,
           renderer: cnMoneyToPrec,
           align: 'right',
           width: 120
        }, {
           id:'checkmoney',
           header: fc['checkmoney'].fieldLabel,
           dataIndex: fc['checkmoney'].name,
           renderer: cnMoneyToPrec,
           align: 'right',
           width: 120
        }, {
           id:'ratiftmoney',
           header: fc['ratiftmoney'].fieldLabel,
           dataIndex: fc['ratiftmoney'].name,
           renderer: cnMoneyToPrec,
           align: 'right',
           width: 120
        }, {
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 80,
           allowBlank: true,
           align:'center',
           renderer: BillStateRender
        }
	])
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "unit_id = '" + USERDEPTID + "'"   // where 子句
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
    
	ds.on("beforeload",function(ds1){
    	var baseParams = ds1.baseParams
    	if(isFlwTask || isFlwView){ //流程任务节点
    		if(monid_flow != ""){
    			baseParams.params = "mon_id = '"+monid_flow+"'"
    		}else{
    			baseParams.params = "1=2"
    		}
    	}else{
    		if(conComboxSelect != "ALL"){    		
	    		baseParams.params = " conid = '"+conComboxSelect+"'"
	    	}else{
	    		//baseParams.params  = " unit_id = '"+USERDEPTID+"'"
	    		baseParams.params  = " conid in (select conid from com.sgepit.pmis.contract.hbm.ConOve where condivno in ("+contFilterId+"))"
	    	}
    	}	
    });
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panelas',
        ds: ds,
        cm: cm,
        sm: sm,
        height: 100,
        tbar: [{text:title},conCombo],
        iconCls: 'icon-by-category',
        border: false,
        region: 'center',
        saveBtn : false,
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        insertHandler:insertFun,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 6,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey	
	});
	ds.load({params:{start: 0,limit: PAGE_SIZE}});
	
	if(isFlwTask){
		ds.baseParams.params="mon_id='" + monid_flow +"' and billstate=0 ";
		ds.load()
	}
	
	ds.on('load', function(){
		if(parent.selectedInd) {
			sm.selectRow(parent.selectedInd);
		} else {
			sm.selectFirstRow();
		}
		if(isFlwTask){
			if(ds.getCount()>=1){
				gridPanel.getTopToolbar().items.get('add').setVisible(false);
			}
		}
	});
	
	sm.on('rowselect', function(o, rowIndex, rec){
		parent.masterRecordSelFun(rowIndex, rec);
	});
	
	function BillStateRender(value){
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
	}
   // 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        border: false,
        frame: false,
        items: [gridPanel]
    });
    
    if (ModuleLVL < 3) {
	   	gridPanel.getTopToolbar().add(editBtn);
    }
	if(isFlwView){
		with(gridPanel.getTopToolbar().items){
			get('add').setVisible(false);
			get('edit').setVisible(false);
			get('del').setVisible(false);
		}
	}
});

function formatDate(sj, m, rec){
	return sj ? (sj.substring(0,4)+"年"+sj.substring(4,6)+"月") : '';
};

//新增
function insertFun(){
   	var obj = new Object();
   	
   	var _conid = "";
   	if(conId && conId!="") {
   		_conid = conId;
   	} else {
		_conid = conCombo.getValue();
   	}
	var inx = conStore.find("conid", _conid)
	var _editMode = "insert";	
	var _editEnable = true;
	var style = "dialogWidth:850px;dialogHeight:350px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var url = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/comp.gcl.addInfo.jsp?editMode="+_editMode+"&editEnable="+_editEnable+"&conid="+_conid;
	url += "&unitId="+USERDEPTID;
	url += "&mon_id="+monid_flow;
	url += "&isView="+isFlwView+"&isTask="+isFlwTask;
	var rtn = window.showModalDialog(encodeURI(url), null, style);
	if(rtn==null||rtn==""){
		gridPanel.getStore().reload();
	}
}

function showContractName(value){
	var str = '';
	for(var i=0; i<conOveArr.length; i++) {
		if (conOveArr[i][0] == value) {
			str = conOveArr[i][1]
			break;
		}
	}
	return str;
}

function editFun(){
	var rec = gridPanel.getSelectionModel().getSelected();
	if(rec == null){
		Ext.Msg.alert("提示","请先选择您要编辑的行！")
		return;
	}
	var _uids = rec.data.uids
	var _conid = rec.data.conid
	var _editMode = "update";
	var _sjType = rec.data.sjType;
	var _editEnable = rec.data.billstate != "0"&&(!isFlwTask||isFlwView)?false:true;;
	var style = "dialogWidth:850px;dialogHeight:350px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var url = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/comp.gcl.addInfo.jsp?editMode="+_editMode+"&editEnable="+_editEnable+"&conid="+_conid;
	url += "&uids="+_uids;
	url += "&mon_id="+monid_flow;
	url += "&isView="+isFlwView+"&isTask="+isFlwTask;
	var rtn = window.showModalDialog(encodeURI(url), null, style);
	if(rtn==null||rtn==""){
		gridPanel.getStore().reload();
	}
}
    