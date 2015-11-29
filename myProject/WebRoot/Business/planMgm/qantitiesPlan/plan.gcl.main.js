var bean = "com.sgepit.pmis.planMgm.hbm.PlanMaster";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "sjType"
var selectConId = "";
var selectConIdOld = "";
var selectMasterId = ""; 
var selectSjType = "";
var detailUrl = "";
var conComboxSelect = "ALL";
var editEnalbe = true;
var sjFlag = "Y";
//页面布局描述
/*
   north部分展示投资计划的期别，主要显示流程编号，期别，状态，备注，概要文件，附件等信息,根据期别分组显示不同合同的计划
   center 的west显示该合同分摊的概算树，center显示合同分摊的工程量，并可以结合概算树进行过滤
*/
Ext.onReady(function(){
	//选择合同
	DWREngine.setAsync(false);  
	billStateArr = new Array();
	appMgm.getCodeValue('流程状态',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billStateArr.push(temp);			
		}
    }); 
	conStore = new Ext.data.SimpleStore({
		fields : ['conid','conname','conno']
	})
	var conSql = "select 'ALL' as conid,'所有合同' as conname,'ALL' as conno,'1' as type from dual union select conid,conname ,conno,'2' as type from con_ove t where t.partybno = (select cpid from con_partyb where partyb = '"+USERPOSNAME+"') order by type";
	if(showAllCon){
		conSql = "select 'ALL' as conid,'所有合同' as conname,'ALL' as conno,'1' as type from dual union select conid,conname ,conno,'2' as type from con_ove t where t.conid in(select distinct conid from plan_master where business_type = '"+businessType+" and pid='" + CURRENTAPPID + "') order by type";
	}
	db2Json.selectSimpleData(conSql,
		function(dat){
			conStore.loadData(eval(dat))
	});
    DWREngine.setAsync(true);
    var editBtn = new Ext.Button({
    	text:'编辑',
    	iconCls:'btn',
    	handler: editPlan
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
    conCombo.setValue("ALL")
    
	// 3. 定义记录集
	var Columns = [
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'uids', type: 'string'},
		{name: 'sjType', type: 'string'},
		{name: 'unitId', type: 'string'},
		{name: 'unitName', type: 'string'},
		{name: 'businessType', type: 'string'},
		{name: 'billState', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'operator', type: 'string'},
		{name: 'operatorTime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'flowbh', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'fileLsh', type: 'string'},
		{name: 'fileName', type: 'string'}
	];	
	ds = new Ext.data.GroupingStore({ // 分组
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params : "business_type = '"+businessType+"' and unit_id = '"+USERDEPTID+"'"
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        remoteGroup: true,
        pruneModifiedRecords: true,
		//sortInfo: {field: 'conno', direction: "DESC"},	// 分组
		groupField: ''	// 分组
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    ds.on("beforeload",function(ds1){
    	var baseParams = ds1.baseParams
    	if(isFlwTask || isFlwView){ //流程任务节点
    		if(flowbh != ""){
    			baseParams.params = "flowbh = '"+flowbh+"'"
    		}else{
    			baseParams.params = "1=2"
    		}
    	}else{
    		if(conComboxSelect != "ALL"){    		
	    		baseParams.params = "business_type = '"+businessType+"' and conid = '"+conComboxSelect+"'"
	    	}else{
	    		baseParams.params  = "business_type = '"+businessType+"' and unit_id = '"+USERDEPTID+"'"
	    	}
    	}	
    })
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect : true})
    ds.on("load",function(ds1){
    	if(isFlwTask && ds1.getTotalCount()==0){//如果是流程的任务 节点，并且还没有新增投资计划，那么默认增加投资计划数据
    		insertFun();
    	}
    	sm.selectFirstRow()
    })
	
	
	conCombo.on("select",function(obj,rec,inx){
   		conComboxSelect = obj.getValue()
    	ds.load({params:{start:0,limit: PAGE_SIZE}});
    } )
	var fc = {
		'pid':   {name: 'pid',fieldLabel: '工程项目编号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		,'conid':   {name: 'conid',fieldLabel: '合同内部流水号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		, 'conno': {name: 'conno',fieldLabel: '合同编号',disabled: true,allowBlank: false,anchor: '95%'}
		, 'conname': {name: 'conname',fieldLabel: '合同名称',disabled: true,anchor: '95%'}
		, 'uids': {	name: 'uids',fieldLabel: '主键',allowBlank: false,anchor:'95%',hidden: true,hideLabel: true}
		, 'sjType': {name: 'sjType',fieldLabel: '数据期别',allowBlank: false,anchor:'95%'}
		, 'unitId': {name: 'unitId',fieldLabel: '单位ID',allowNegative: false,hidden: true,hideLabel: true,allowBlank: false,anchor:'95%'}
		, 'unitName': {name: 'unitName',fieldLabel: '填报单位',allowNegative: false,allowBlank: false,anchor:'95%',disabled: true}
		, 'businessType': {name: 'businessType',fieldLabel: '业务类型',anchor:'95%',hidden: true,hideLabel: true}
		, 'billState': {name: 'billState',fieldLabel: '流程审批状态',anchor:'95%'}
		, 'state': {name: 'state',fieldLabel: '报送状态',anchor:'95%',hidden: true,hideLabel: true}
		, 'operator': {name: 'operator',fieldLabel: '填报人',anchor:'95%'}
		, 'operatorTime': {name: 'operatorTime',fieldLabel: '填报时间',format: 'Y-m-d H:i:s',anchor:'95%',disabled: true}
		, 'flowbh': {name: 'flowbh',fieldLabel: '流程编号',anchor:'95%',hidden: true,hideLabel: true}
		, 'remark': {name: 'remark',fieldLabel: '备注',hideLabel: true,anchor:'95%'}
		,'fileLsh':{name:'fileLsh',fieldLabel:'概要文件流水号',anchor:'95%',hidden: true,hideLabel: true}
		,'fileName':{name:'fileName',fieldLabel:'概要文件',anchor:'95%',hidden: true,hideLabel: true}
	};
	
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'uids',
           header: fc['uids'].fieldLabel,
           dataIndex: fc['uids'].name,
           hidden:true,
           width: 0
        }, {
           id:'conname',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 200
        }, {
           id:'sjType',
           header: fc['sjType'].fieldLabel,
           dataIndex: fc['sjType'].name,
           width: 80,
           renderer : function(val,met,rec,rowinx,colinx,store){
				if(businessType.indexOf("P_M")>-1){ //月计划
					var year = val.substring(0,4)
					var month = val.substring(4,6)
					return year +"年"+month+"月"
				}else if(businessType.indexOf("P_Q")>-1){ //季度计划
					var year = val.substring(0,4)
					var quarter = val.substring(4,5)
					return year +"年"+quarter+"季度"
				}else{
					return val +"年"
				}
			}
        }, {
           id:'billState',
           header: fc['billState'].fieldLabel,
           dataIndex: fc['billState'].name,
           width: 80, 
           renderer : function(val,met,rec,rowinx,colinx,store){
				for(var i=0;i<billStateArr.length;i++){
					if(billStateArr[i][0]==val){
						return billStateArr[i][1]
					}
				}
			}
        }, {
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           width:280
        }
	])
    cm.defaultSortable = true;	
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [{xtype: 'tbtext', text: '<b>工程量投资计划</b>'},conCombo],					//顶部工具栏，可选
        //title: "",		//面板标题
        //iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'north',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        height: 220,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        saveBtn : false,
        addBtn : !(isFlwTask || isFlwView),
        delBtn : !(isFlwTask || isFlwView),
		view: new Ext.grid.GroupingView({	// 分组
            forceFit: true,
            groupTextTpl: '{text}(共{[values.rs.length]}个合同)'
        }),
        insertHandler: insertFun,	//自定义的新增方法
        deleteHandler: checkDeleteHandler,
        // expend properties	
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey
	});
	
	
	detailPanel = new Ext.Panel({
		 title: '工程量投资计划明细',
         border: true,
         region: "center",
         height: 220,
         split: true,
         html: "<iframe name='detailFrame' src='' frameborder=0 style='width:100%;height:100%;'></iframe>"
		
	})
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel,detailPanel]
	});
	if (ModuleLVL < 3) {
		gridPanel.getTopToolbar().add(editBtn)
	}
	sm.on("rowselect",function(obj,rinx,rec){
		selectMasterId = rec.data.uids;
		selectConId = rec.data.conid;
		selectSjType = rec.data.sjType;
		editEnalbe = rec.data.billState != "0"&&(!isFlwTask||isFlwView)?false:true;
		if (ModuleLVL < 3) {
			editEnalbe = false;
		}
		if(!editEnalbe){
			Ext.getCmp("del").setDisabled(true)
		}else{
			Ext.getCmp("del").setDisabled(false)
		}		
		try{
			if(window.frames["detailFrame"].ds.getModifiedRecords().length>0){
				if(confirm("有修改的数据未进行保存，请确认是否进行保存")){
					window.frames["detailFrame"].gridSave();
					return;
				}
			}
			if(selectConIdOld != selectConId){
				selectConIdOld = selectConId;
				window.frames["detailFrame"].location.href = detailUrl;
			}else{
				window.frames["detailFrame"].ds.load({params:{start:0,limit: PAGE_SIZE}});
			}
				
		}catch(e){
			
		}
	})
	ds.load({params:{start:0,limit: PAGE_SIZE}});
	if(businessType.indexOf("P_M")>-1){
		sjFlag = "M";
		detailUrl = CONTEXT_PATH+"/Business/planMgm/qantitiesPlan/plan.gcl.detail.month.jsp"
	}else if(businessType.indexOf("P_Q")>-1){
		sjFlag = "Q";
		detailUrl = CONTEXT_PATH+"/Business/planMgm/qantitiesPlan/plan.gcl.detail.quarter.jsp"
	}else if(businessType.indexOf("P_Y")>-1){
		sjFlag = "Y";
		detailUrl = CONTEXT_PATH+"/Business/planMgm/qantitiesPlan/plan.gcl.detail.year.jsp"
	}
	window.frames["detailFrame"].location.href = detailUrl;
})
function insertFun(){
	var obj = new Object();
	var _conid = conCombo.getValue();
	/*
	if(_conid == "ALL"){
		conCombo.expand();
		Ext.MessageBox.alert("操作提示","请先选择您要增加投资计划的合同!")		
		return;
	}*/
	var inx = conStore.find("conid",_conid)
	var record = conStore.getAt(inx);	
	var _conno = record.data.conno
	var _conname = record.data.conname
	var _editMode = "insert";	
	var _editEnable = true;
	var style = "dialogWidth:850px;dialogHeight:550px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var url = CONTEXT_PATH+"/Business/planMgm/qantitiesPlan/plan.gcl.addInfo.jsp?editMode="+_editMode+"&editEnable="+_editEnable+"&conid="+_conid;
	url += "&conno="+_conno+"&conname="+_conname+"&unitId="+USERDEPTID+"&unitName="+USERPOSNAME+"&businessType="+businessType
	url += "&isView="+isFlwView+"&isTask="+isFlwTask+"&flowbh="+flowbh
	var rtn = window.showModalDialog(encodeURI(url), null, style);
	if(rtn==null||rtn==""){
		ds.reload();
	}
}
function editPlan(){
	var rec = gridPanel.getSelectionModel().getSelected();
	if(rec == null){
		Ext.Msg.alert("提示","请先选择您要编辑的行！")
		return;
	}
	var _uids = rec.data.uids
	var _conid = rec.data.conid
	var _conno = rec.data.conno
	var _conname = rec.data.conname
	var _editMode = "update";
	var _sjType = rec.data.sjType;
	var _editEnable = editEnalbe;
	if(!isFlwTask && !isFlwView){	
		if(rec.data.billState !=0){
			_editEnable = false;
		}
	}	
	var style = "dialogWidth:850px;dialogHeight:550px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var url = CONTEXT_PATH+"/Business/planMgm/qantitiesPlan/plan.gcl.addInfo.jsp?editMode="+_editMode+"&editEnable="+_editEnable+"&conid="+_conid;
	url += "&uids="+_uids+"&conno="+_conno+"&conname="+_conname+"&unitId="+USERDEPTID+"&unitName="+USERPOSNAME+"&sjType="+_sjType+"&businessType="+businessType
	url += "&isView="+isFlwView+"&isTask="+isFlwTask+"&flowbh="+flowbh
	var rtn = window.showModalDialog(encodeURI(url), null, style);
	if(rtn==null||rtn==""){
		ds.reload();
	}
}

function checkDeleteHandler(){
	var sm = gridPanel.getSelectionModel()
	if(sm.getCount() == 0){
		Ext.Msg.alert('提示!','您尚未选择一条记录!')
		return
	} else {
		Ext.Msg.confirm('确认','您确认删除所选记录及其相关的明细数据信息？', function(btn, text) {
			if (btn == "yes") {
				var records = sm.getSelections()
				var codes = []
				for (var i = 0; i < records.length; i++) {
					var m = records[i].get(this.primaryKey)
					if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
						continue;
					}
					codes[codes.length] = m
				}
				var mrc = codes.length
				DWREngine.setAsync(false);
				if (mrc > 0) {
					var ids = codes.join(",");
					investmentPlanService.deleteMasterAndDetailData(sjFlag, ids, function (d) {
						if (d) {
							Ext.example.msg('删除成功！', '您成功删除了 {0} 条主记录及关联的明细数据信息。', mrc);
							ds.reload();
						} else {
							Ext.example.msg('删除失败！', '删除失败！', mrc);
						}
					});
				} else {
					ds.reload();
				}
				DWREngine.setAsync(true);
			}
		});
	}
}

//导出数据
function exportDataFile(){
	var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportData&sjType=" + selectSjType + "&businessType=" + businessType + "&unitId=" + USERDEPTID + "&contractId=" + selectConId;
	document.all.formAc.action =openUrl
	document.all.formAc.submit();
}