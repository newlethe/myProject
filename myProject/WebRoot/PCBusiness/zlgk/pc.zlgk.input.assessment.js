var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var hzWin,hzTabsUids,hzSjType,hzJyxmlx;
var initWin,tabs
var initBtn,upBtn
var ypSm,ypCm,jyxmDs

if(lvl != null && lvl != "") ModuleLVL = lvl;
if(pid ==null||pid=='') pid = pid;

var append=ModuleLVL<3?'':'and report_status=1';        //追加的过滤参数, 如果是只读只显示已经上传的验评信息,否则显示全部

var RW=ModuleLVL<3?true:false;
Ext.onReady(function() {
	var array_yearMonth=getYearMonthBySjType(null,null);
	var sjTypeStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['v', 't']
    });
	sjTypeStore.loadData(array_yearMonth);
	var ypColumns = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'projectId',type : 'string'},
		{name : 'createdate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'createperson',type : 'string'},
		{name : 'sjType',type : 'string'},
		{name : 'reportname',type : 'string'},
		{name : 'reportStatus',type : 'float'},
		{name : 'memo',type : 'string'}
	];

	var ypDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid='" + pid + "'" + append+" order by createdate desc",
			outFilter:outFilter
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

	var fm = Ext.form;
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '唯一约束'},
		'pid' : {name : 'pid',fieldLabel : '项目编号'},
		'projectId' : {name : 'projectId',fieldLabel : '验评信息表ID'},
		'createdate' : {name : 'createdate',fieldLabel : '填报时间',	format : 'Y-m-d',minValue : '2010-01-01'},
		'createperson' : {name : 'createperson',fieldLabel : '填报人',allowBlank: false},
		'sjType' : {name : 'sjType',fieldLabel : '报表期别'},
		'reportname' : {name : 'reportname',fieldLabel : '报表名称'},
		'reportStatus' : {name : 'reportStatus',fieldLabel : '上报状态'},
		'memo' : {name : 'memo',fieldLabel : '备注'}
	}
	

	var plant = Ext.data.Record.create(ypColumns);
	var plantInt = {
		uids : '',
		pid : pid,
		projectId : '',
		createdate : '',
		createperson : '',
		sjType : '',
		reportname : '',
		reportStatus : '0',
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
			id : 'projectId',
			header : fc['projectId'].fieldLabel,
			dataIndex : fc['projectId'].name,
			hidden : true
		}, {
			id : 'createdate',
			header : fc['createdate'].fieldLabel,
			dataIndex : fc['createdate'].name,
			align : 'center',
			width : 90,
			editor : RW?new fm.DateField(fc['createdate']):null,
			renderer : formatDate
		}, {
			id : 'createperson',
			header : fc['createperson'].fieldLabel,
			dataIndex : fc['createperson'].name,
			align : 'center',
			width : 90,
			editor : RW?new fm.TextField(fc['createperson']):null
		}, {
			id : 'sjType',
			header : fc['sjType'].fieldLabel,
			dataIndex : fc['sjType'].name,
			width:80,
			align:'center',
			editor : RW?new Ext.form.ComboBox({
		    	//fieldLabel: '数据期别',
		    	width:150,
		    	maxHeight:107,
		    	store: sjTypeStore,
		    	displayField:'t',
				valueField:'v',
				typeAhead: id,
				triggerAction: 'all',
				mode: 'local',
				editable :false,
				allowBlank: false,
				selectOnFocus:true,
				listeners:{
					'select':function(combo){
	        			var record = ypSm.getSelected();
	        			var sj = combo.getValue();
	        			var title = sj.substr(0,4)+'年'+parseInt(sj.substr(4,2),10)+'月质量验评统计报表'	;
	        			record.set('reportname',title)
					},
					'expand':function(){
	       				pcTzglService.sjTypeFilter(pid,bean,function(arr){
	       					if(arr.length>0){
		       				  sjTypeStore.filterBy(sjTypeFilter);
		       				  function sjTypeFilter(record,id){
		       				  	for(var i=0; i<arr.length; i++){
									if(record.get("k")==arr[i]) return false;
								}
		       				  	return true;
		       				  } 
		       				}
	       				});
	       			}
				}
		    }):null,
		    renderer : function(value,cell,record){
		    	if(value) return value.substr(0,4)+"年"+value.substr(4,6)+"月";
		    }
		}, {
			id : 'reportname',
			header : fc['reportname'].fieldLabel,
			dataIndex : fc['reportname'].name,
			align : 'center',
			width : 200,
			editor : RW?new fm.TextField(fc['reportname']):null,
			renderer : function(value,cell,record){
				return record.get('uids')==""?value:"<a href='javascript:zlgkHzTjWin(\""+record.get('uids')+"\",\""+record.get('sjType')+"\",\""+record.get('reportStatus')+"\")'>"+value+"</a>"
			}
		}, {
			// 这里附件id使用uids
			id : 'uids',
			header : '附件',
			dataIndex : 'uids',
			width : 50,
			align:'center',
			renderer : function(value,cell,record){
				return (record.get('uids')=="")?"上传":"<a href='javascript:uploadfile(\""+value+"\",\"PczlypReport\")'>"+(ModuleLVL=="3"?"查看":"上传")+"</a>"
			}
		}, {
			id : 'reportStatus',
			header : fc['reportStatus'].fieldLabel,
			dataIndex : fc['reportStatus'].name,
			width : 60,
			align:'center',
			renderer : function(value){
				return value==0?"未上报":"已上报"
			}
		}, {
			id : 'memo',
			header : fc['memo'].fieldLabel,
			dataIndex : fc['memo'].name,
			width : 220,
			editor : new fm.TextField(fc['memo'])
		}]);

	var ypGrid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : ypDs,
		cm : ypCm, // 列模型
		sm : ypSm,
		tbar : dydaView==false?['-']:["->"],
		border : false,
		clicksToEdit : 2,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		saveHandler : saveYpGrid,
		deleteHandler : deleteYpGrid,
		viewConfig : {
			forceFit : true,
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
			beforeEdit: function(o){
				var stat = o.record.get('reportStatus');
				return parseInt(stat)==1?false:true;
			}
		}
	});
	ypDs.load({params:{start:0,limit:PAGE_SIZE}});
	/*
	initBtn = new Ext.Button({
		text : '初始化统计报表',
		iconCls: 'copyUser',
		handler : initBaoBiao
	})
	*/
	
	upBtn = new Ext.Button({
		id:'up',
		text: '上报',
		iconCls: 'upload',
		handler: ReportUp
	})
	
/*
	//==========初始化报表============
	var beanJyxm = "com.sgepit.frame.flow.hbm.GczlJyxm"
	
	var jyxmColumns = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'xmbh',type : 'string'},
		{name : 'xmmc',type : 'string'},
		{name : 'gcType',type : 'string'}
	];

	jyxmDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : "com.sgepit.frame.flow.hbm.GczlJyxm",
			business : business,
			method : listMethod,
			params : "pid='"+pid+"' and gcType='1'"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, jyxmColumns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	jyxmDs.setDefaultSort('xmbh', 'desc');
	
	var jyxmSm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
	
	var jyxmCm = new Ext.grid.ColumnModel([
		jyxmSm,
		{id : 'uids',header : '主键',dataIndex : 'uids',	hidden : true},
		{id : 'pid',header : '编号',dataIndex : 'pid',hidden : true},
		{id : 'xmbh',header : '项目编号',dataIndex : 'xmbh',hidden : true},
		{id : 'xmmc',header : '项目名称',dataIndex : 'xmmc',width : 430}
	])
	
	var selectBtn = new Ext.Button({
    	text:'选择单位工程',
    	iconCls:'btn',
    	handler:selectDwgcFun
    })
    function selectDwgcFun(){
    	var records = jyxmSm.getSelections();
    	var record = ypSm.getSelected(); 
    	if(records.length == 0){
    		Ext.example.msg('出现错误！', '请先选择单位工程！');
			return;
    	}
    	var uidsArr = new Array();
    	for (var i = 0; i < records.length; i++) {
    		uidsArr.push(records[i].get('uids'));
    	}
    	var sj = record.get('sjType');
    	var id = record.get('uids');
    	DWREngine.setAsync(false); 
    	zlgkMgm.initZlgkGczlJyxm(uidsArr,sj,id,pid,function(bool){
    		if(bool){
    			initWin.hide();
    			Ext.example.msg('操作成功！', '质量验评统计报表初始化成功！');
    			var frame = tabs.getActiveTab().id+"Frame";
    			window.frames[frame].location.reload();
    		}else{
    			Ext.example.msg('出现错误！', '请先选择单位工程！');
				return;
    		}
    	})
    	DWREngine.setAsync(true); 
    }
	
	var dwgcGridPanel = new Ext.grid.GridPanel({
		ds:jyxmDs,
		sm:jyxmSm,
		cm:jyxmCm,
		tbar : ['->',selectBtn],
		border : false,
		autoScroll : true,
		loadMask : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : jyxmDs,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	jyxmDs.load({params:{start:0,limit:PAGE_SIZE}});
	initWin = new Ext.Window({
		title: '单位工程列表',
		width: 490,
		height: 400,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout: 'fit',
		items:[dwgcGridPanel]
	})
*/
	//上报执行函数
	function ReportUp(){
		var record = ypSm.getSelected();
		if(record == null || record =='' || record.get('uids')==''){
			Ext.example.msg('出现错误！', '请先选择统计报表！');
			return;
		}
		Ext.MessageBox.confirm('确认','上报操作将不可恢复，上报后数据将不能修改，确认要上报吗？',function(btn,text){
			if(btn=="yes"){
				DWREngine.setAsync(false);
				//ypGrid.body.mask('数据上报中，请稍后！', 'x-mask-loading');
				//Ext.getBody().mask('数据上报中，请稍后！', 'x-mask-loading');    
				//修改上报状态，并执行数据交互，包括主表和从表
				var uids = record.get('uids');
				zlgkMgm.pcZlgkExchangeDataToQueue(uids,pid,function(str){
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
				});
				DWREngine.setAsync(true); 
				ypDs.reload();
			}
		});
	}
	ypGrid.on("afterinsert",function(){
		var rec = ypSm.getSelected();
		rec.set("createdate",SYS_DATE_DATE);
	})
	function saveYpGrid(){
		var bool = true;
		var record = ypSm.getSelected();
		if(record == null || record ==''){
			Ext.example.msg('出现错误！', '请先选择统计报表！');
			return;
		}else if(record.get('createperson') == ''){
			Ext.example.msg('出现错误！', '请填写完整，[填报人]必须填写！');
			return;
		}else if(record.get('sjType') == ''){
			Ext.example.msg('出现错误！', '请填写完整，[报表期别]必须填写！');
			return;
		}else{
			ypGrid.defaultSaveHandler();
		}
	}
	function deleteYpGrid(){
		var record = ypSm.getSelected();
		if(record == null || record =='' || record.get('uids')==''){
			Ext.example.msg('出现错误！', '请先选择统计报表！');
			return;
		}
		Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
			if(btn=="yes"){
				var uids =  record.get('uids');
				DWREngine.setAsync(false); 
				zlgkMgm.deletePcZlgkQuaInfoById(uids,function(bool){
					if(bool)
					{
						Ext.example.msg('删除成功！', '您成功删除了 一条记录！');
						ypDs.reload();
						return;
					}
					else
					{
						Ext.Msg.show({
							title: '提示',
							msg: '删除失败!',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO
						});
						
						return;
					}
				})
				DWREngine.setAsync(true); 
			}else if(btn=="no"){
				return;
			}
		});

	}
/*	
	var panelDwgc = new Ext.Panel({
		id:'dwgc',
		title:'单位工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="dwgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFxgc = new Ext.Panel({
		id:'fxgc',
		title:'分项工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="fxgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFbgc = new Ext.Panel({
		id:'fbgc',
		title:'分部工程',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="fbgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelJyp = new Ext.Panel({
		id:'jyp',
		title:'检验批',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="jypFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: true,
        region: 'center',
        forceFit: true,
        items:[panelDwgc,panelFbgc,panelFxgc,panelJyp]
    });
    
    
	tabs.on('tabchange',function(value){
		var panelId = value.getActiveTab().id;
		var xgridUrl = CONTEXT_PATH+"/PCBusiness/zlgk/templateXgridView.jsp";
		var sj_type = '2011'; // 时间
		var unit_id = UNITID; // 取表头用
		var editable = true; // 是否能编辑，不传为不能编辑
		var headtype = 'PC_ZLGK_ZLPY';
		var keycol = 'uids';
		var ordercol = 'uids'
		var hasInsertBtn = false;
//		var hasSaveBtn = false; //更具上报状态隐藏xGrid中的保存按钮
		var hasDelBtn = true;
		var skin = 'light';		//设置皮肤外观
		var hasFooter = false;	//隐藏底部统计栏
		var filter = " and pid='"+pid+"' and sj_Type='"+hzSjType+"' and master_id='"+hzTabsUids+"'"
		xgridUrl = xgridUrl+"?unit_id="+unit_id+"&editable="+editable+"&headtype="+headtype+"&keycol="+keycol+"&ordercol="+ordercol+"&hasInsertBtn="+hasInsertBtn+"&hasDelBtn="+hasDelBtn+"&hasFooter="+hasFooter+"&skin="+skin
		hzJyxmlx = 1;
		if(panelId=='dwgc'){
			hzJyxmlx = 1;
			filter = filter +' and jyxmlx=1';
			sj_type = '201101';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
			window.frames["dwgcFrame"].location.href = xgridUrl;
		}
    	if(panelId=='fxgc'){
    		hzJyxmlx = 2;
    		filter = filter +' and jyxmlx=2'
    		sj_type = '201102';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fxgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='fbgc'){
    		hzJyxmlx = 3;
    		filter = filter +' and jyxmlx=3'
    		sj_type = '201103';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fbgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='jyp'){
    		hzJyxmlx = 4;
    		filter = filter +' and jyxmlx=4'
    		sj_type = '201104';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["jypFrame"].location.href = xgridUrl;
    	}
    })
    
    hzWin = new Ext.Window({
		title: '质量管控子系统汇总统计表',
		width: 947,
		height: document.body.clientHeight*0.65,
		//tbar:['<b>质量管控子系统汇总统计表</b>','-',initBtn],
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout: 'fit',
		items:[tabs]
	})
	hzWin.on('hide',function(){
		window.location.reload();
	})
*/
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
		if(!dydaView){
			ypGrid.getTopToolbar().add(upBtn);
		}
		ypSm.on('rowselect',function(){
			var record = ypSm.getSelected();
			if(!dydaView){
				if(record.get('reportStatus') != "0"){
					ypGrid.getTopToolbar().items.get('save').disable();
					ypGrid.getTopToolbar().items.get('del').disable();
					ypGrid.getTopToolbar().items.get('up').disable();
				}else{
					ypGrid.getTopToolbar().items.get('save').enable();
					ypGrid.getTopToolbar().items.get('del').enable();
					ypGrid.getTopToolbar().items.get('up').enable();
				}
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
		
		if(ModuleLVL == '3'||status=='1') editflag = false;
		
		var param = {
			businessId:pid,
			businessType:biztype,
			editable : editflag
		};
		showMultiFileWin(param);
	}
	
	//点击标题填报【汇总统计表】
	function zlgkHzTjWin(uids,sj, status){
		/*
		hzTabsUids = uids;
		hzSjType = sj;
		hzWin.show();
		*/
		var param = new Object();
		param.hzSjType = sj;
		param.hzTabsUids = uids;
		param.hzStatus = status;
		var reportUrl = CONTEXT_PATH+"/PCBusiness/zlgk/pc.zlgl.input.assessment.report.jsp";
		window.showModelessDialog(
						reportUrl,
						param,
						"dialogLeft:240px; dialogTop:260px; dialogWidth:940px;dialogHeight:400px;location:no;status:no;center:no;resizable:yes;Minimize=yes;Maximize=yes");
	}

/*	
	function initBaoBiao(){
		var record = ypSm.getSelected();
		if(record == null || record =='' || record.get('uids')==''){
			Ext.example.msg('出现错误！', '请先选择统计报表！');
			return;
		}
		var xmbhSql = "select jyxmbh from PcZlgkQuaDetail where masterId = '"+record.get('uids')+"' and pid = '"+pid+"' and sjType = '"+record.get('sjType')+"'";
		jyxmDs.baseParams.params = "pid='"+pid+"' and gcType='1' and uids not in ("+xmbhSql+")";    		
		jyxmDs.reload();
		initWin.show();
	}
*/