var bean = "com.sgepit.pcmis.zhxx.hbm.PcProBaseInfoM"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var hzTabsUids,hzSjType;
var upBtn
var ypSm,ypCm,ypGrid
ModuleLVL=dydaView=='true'?'3':ModuleLVL;
var RW=ModuleLVL<3?true:false;
Ext.onReady(function() {
	var ypColumns = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'createdate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'createperson',type : 'string'},
		{name : 'sjType',type : 'string'},
		{name : 'reportname',type : 'string'},
		{name : 'reportStatus',type : 'float'},
		{name : 'dutyPerson',type : 'float'},
		{name : 'memo',type : 'string'}
	];

	var ypDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : dydaView=='true'?("pid='" + CURRENTAPPID + "' and reportStatus=1 order by createdate desc"):("pid='" + CURRENTAPPID + "' order by createdate desc")
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, ypColumns),
		remoteSort : true,
		pruneModifiedRecords : true // 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
	ypDs.on("load",function(){
		if(ModuleLVL!="3"){
			if(ypDs.getTotalCount()>0){
				ypGrid.getTopToolbar().items.get('add').disable();
			}else{
				ypGrid.getTopToolbar().items.get('add').enable();
			}
		}
	});
	var fm = Ext.form;
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : '项目编号'},
		'createdate' : {name : 'createdate',fieldLabel : '填报日期',	format : 'Y-m-d',minValue : '2012-01-01'},
		'createperson' : {name : 'createperson',fieldLabel : '填报人',allowBlank: false},
		'sjType' : {name : 'sjType',fieldLabel : '月度'},
		'reportname' : {name : 'reportname',fieldLabel : '报表名称'},
		'reportStatus' : {name : 'reportStatus',fieldLabel : '上报状态'},
		'dutyPerson' : {name : 'dutyPerson',fieldLabel : '责任人'},
		'memo' : {name : 'memo',fieldLabel : '备注'}
	}
	

	var plant = Ext.data.Record.create(ypColumns);
	var plantInt = {
		uids : '',
		pid : CURRENTAPPID,
		createdate : '',
		createperson : REALNAME,
		sjType : '',
		reportname : CURRENTAPPNAME+"项目基本情况表",
		reportStatus : '0',
		dutyPerson : REALNAME,
		memo : ''
	}
	
	ypSm = new Ext.grid.CheckboxSelectionModel({header:'',singleSelect : true});
	
	ypCm = new Ext.grid.ColumnModel([
		ypSm,{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		}, {
			id : 'reportname',
			header : fc['reportname'].fieldLabel,
			dataIndex : fc['reportname'].name,
			align : 'center',
			width : 250,
			editor : RW?new fm.TextField(fc['reportname']):null,
			renderer : function(value,cell,record){
				return record.get('uids')==""?value:"<a href='javascript:showTaskList()'>"+value+"</a>"
			}
		},{
			id : 'createperson',
			header : fc['createperson'].fieldLabel,
			dataIndex : fc['createperson'].name,
			align : 'center',
			width : 90,
			editor : RW?new fm.TextField(fc['createperson']):null
		},{
			id : 'createdate',
			header : fc['createdate'].fieldLabel,
			dataIndex : fc['createdate'].name,
			align : 'center',
			width : 90,
			editor : RW?new fm.DateField(fc['createdate']):null,
			renderer : formatDate
		}, {
			id : 'reportStatus',
			header : fc['reportStatus'].fieldLabel,
			dataIndex : fc['reportStatus'].name,
			width : 80,
			align:'center',
//			hidden : true,
			renderer : stateRender
		}, {
			id : 'memo',
			header : fc['memo'].fieldLabel,
			dataIndex : fc['memo'].name,
			width : 150,
			editor : new fm.TextField(fc['memo'])
		}]);

		ypGrid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : ypDs,
		cm : ypCm, // 列模型
		sm : ypSm,
		tbar : ['-'],
		border : false,
		clicksToEdit : 2,
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		//saveHandler : saveYpGrid,
		//deleteHandler : deleteYpGrid,
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ypDs,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : plant,
		plantInt : plantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		primaryKey : primaryKey,
		listeners:{
			beforeEdit : function(o){
				var stat = o.record.get('reportStatus');
				return parseInt(stat)==1?false:true;
			},
            aftersave : function(grid, idsOfInsert, idsOfUpdate){
                if(idsOfInsert){
	                var insertUids = idsOfInsert.split(",");
	                pcPrjService.initBaseInfoD(CURRENTAPPID,idsOfInsert,function(){});
	                //pcJdgkMgm.initWeekWorkList(CURRENTAPPID,CURRENTAPPNAME,idsOfInsert,function(){});
                }
            },
            afterdelete : function(grid,ids){
            	pcPrjService.deleteBaseInfoD(ids,CURRENTAPPID,function(){});
                //pcJdgkMgm.deleteWeekWorkList(ids,null,function(){});
            }
		}
	});
	ypDs.load({params:{start:0,limit:PAGE_SIZE}});
	
	upBtn = new Ext.Button({
		id:'up',
		text: '上报',
//        hidden : true,
		iconCls: 'upload',
		handler: ReportUp
	})
	
	//上报执行函数
	function ReportUp(){
		var record = ypSm.getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});		
		if(record == null || record =='' || record.get('uids')==''){
			Ext.example.msg('提示', '请选中一条记录！', 2);
			return;
		}
		DWREngine.setAsync(false);
		Ext.MessageBox.confirm('确认','上报操作将不可恢复，上报后数据将不能修改，确认要上报吗？',function(btn,text){
			if(btn=="yes"){
				//ypGrid.body.mask('数据上报中，请稍后！', 'x-mask-loading');
				//Ext.getBody().mask('数据上报中，请稍后！', 'x-mask-loading');    
				//修改上报状态，并执行数据交互，包括主表和从表
				var uids = record.get('uids');
				myMask.show();
				pcPrjService.doProBaseInfoExchangeDataToQueue(uids,CURRENTAPPID,function(str){
					myMask.hide();
					if(str!=null&&str!=""){
						Ext.Msg.show({
							title : '提示',
							msg : str,
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO,
							fn : function(value){
								//ypGrid.body.unmask();
								//Ext.getBody().unmask(); 
							}
						});
					}
					ypDs.reload();
				});
			}
		});
		DWREngine.setAsync(true); 
	}
	ypGrid.on("afterinsert",function(){
		var rec = ypSm.getSelected();
		rec.set("createdate",SYS_DATE_DATE);
	})

	var viewPort = new Ext.Viewport({
		layout : 'border',
		items : [ypGrid]
	})
	if(ModuleLVL=="3"){
		//隐藏grid的tbar；
		ypGrid.tbar.setVisibilityMode(Ext.Element.DISPLAY);
        ypGrid.tbar.hide();
        ypGrid.syncSize();
	}else{
		ypGrid.getTopToolbar().add(upBtn);
		ypSm.on('rowselect',function(){
			var record = ypSm.getSelected();
				if(record.get('reportStatus') == "0" || record.get('reportStatus') == "2"){
					ypGrid.getTopToolbar().items.get('save').enable();
					ypGrid.getTopToolbar().items.get('del').enable();
					ypGrid.getTopToolbar().items.get('up').enable();
				}else{
					ypGrid.getTopToolbar().items.get('save').disable();
					ypGrid.getTopToolbar().items.get('del').disable();
					ypGrid.getTopToolbar().items.get('up').disable();
				}
		})
	}
	
	// 其他自定义函数(日期格式化)
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};	
});

	//附件上传
	function uploadfile(pid,biztype){
		var editflag = true;
		var status = ypSm.getSelected().get('reportStatus');
		
		if(ModuleLVL == '3'||status=='1'||status=='3') editflag = false;
		
		var param = {
			businessId:pid,
			businessType:biztype,
			editable : editflag
		};
		showMultiFileWin(param);
        if(multiFileWin){
            multiFileWin.on('hide',function(){
                ypGrid.getStore().reload();
            })
        }
	}
	

function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0") return "<font color=gray>未上报</font>";
	if(value=="1") {
		renderStr="<font color=black>已上报</font>";
	}
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") renderStr="<font color=blue>审核通过</font>";
	return renderStr;
//	return "<a title='点击查看详细信息' " +
//			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}

function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}

function showTaskList() {
	var xgridUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
	var m_record = ypGrid.getSelectionModel().getSelected();
	if (m_record.get('uids') == '') {
		Ext.example.msg("提示", "请先保存此条记录");
	} else {
		var record = ypGrid.getSelectionModel().getSelected();
		var param = new Object()
		param.sj_type = '2013'; // 时间
		param.unit_id = CURRENTAPPID; // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.editable = true; // 是否能编辑，不传为不能编辑
		param.hasSaveBtn = true;
		if(!RW||record.get('reportStatus') == '1'){
        	param.editable=false;
        	param.hasSaveBtn = false;
        }
        param.headtype = 'PRO_BASE_INFO_REPORT';
		param.keycol = 'uids';
		param.xgridtype = 'grid';
		param.initInsertData = "pid`" + CURRENTAPPID;
		param.filter = " and pc_pro_base_info_d.pid='"+CURRENTAPPID+"'"
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window.showModelessDialog(xgridUrl, param,
						"dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
        
	}
}


