var gridJit,grid2Qiy,gridXmdw;
var edit_unitid=USERBELONGUNITID;
if(USERBELONGUNITTYPEID=="0"){
	edit_unitid = "103";
}
var reportRecord;
var sendBackFlag='0';
var comBaseParams = {
	ac : 'list', // 表示取列表
	bean : 'com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthCompM',
	business : 'baseMgm',
	method : 'findWhereOrderby'
};

var comProxy = new Ext.data.HttpProxy({
	method : 'GET',
	url : MAIN_SERVLET
});
var comMeta = {
	root : 'topics',
	totalProperty : 'totalCount',
	id : "uids"
};
var comColums = [
	{name : 'uids',type : 'string'}, 
	{name : 'pid',type : 'string'}, 
	{name : 'createperson',type : 'string'}, 
	{name : 'createDate',type : 'date', dateFormat : 'Y-m-d H:i:s'}, 
	{name : 'backDate',type : 'date', dateFormat : 'Y-m-d H:i:s'}, 
	{name : 'title',type : 'string'}, 
	{name : 'reportStatus',type : 'string'	}, 
	{name : 'sjType',type : 'string'}, 
	{name : 'reason',type : 'string'}, 
	{name : 'backUser',type : 'string'}, 
	{name : 'unitTypeId',type : 'string'}, 
	{name : 'unitname',type : 'string'},
	{name : 'unitUsername',type : 'string'}, 
	{name : 'countUsername',type : 'string'},
	{name : 'createpersonTel',type : 'string'}
]
Ext.onReady(function(){
	//当前用户为集团公司用户
	if(USERBELONGUNITTYPEID=="0"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [gridJit = createGridJit()]
		});
		gridJit.store.baseParams.params = "unitTypeId='2' and reportStatus in('1','2','3') order by sjType desc"
		gridJit.store.load();
		
	}else if(USERBELONGUNITTYPEID=="2"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [grid2Qiy = createGrid2Qiy(),gridXmdw=createGridXmdw()]
		});
		//grid2Qiy.store.sort('sjType','DESC');
		grid2Qiy.store.load({params:{limit:10,start:0}});
		grid2Qiy.getSelectionModel().on('rowselect',function(_sm,inx,rec){
			
		DWREngine.setAsync(false);
			systemMgm.getPidsByUnitid(rec.get('pid'),function(lt){
				var pids = "''";
				for(var i=0,j=lt.length;i<j;i++){
					pids+=",'"+lt[i].unitid+"'"
				}
				if (rec.get('reportStatus')=='2'){
					sendBackFlag='2';
				}else {sendBackFlag='0';}			
				gridXmdw.store.baseParams.params = "pid in ("+pids+") and report_status in('1','2','3') and sj_type = '"+rec.get('sjType')+"' order by sj_type desc";
				gridXmdw.store.load({callback: function(){
					if(gridXmdw.store.getTotalCount!=lt.length)
					{
						return;
						grid2Qiy.getTopToolbar().disable();			
					}
				}});
			})
		DWREngine.setAsync(true);
			//如果已经进度已经报送给集团"上报"按钮将不在可以使用	
		if(rec.get('reportStatus')=='1' ||rec.get('reportStatus')=='3')
		{
			grid2Qiy.getTopToolbar().disable();
		}
		else
		{
			grid2Qiy.getTopToolbar().enable();;
		}
			
			//如果还有项目单位没有上报进度信息给二级公司, "上报"按钮不可使用
			
		})
	
	}
});

function createGridJit(config){
	var array_level2Unit=new Array();
	var dsCombo_level2Unit=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	DWREngine.setAsync(false);
	var bean="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean, "unitTypeId='2'",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_level2Unit.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	dsCombo_level2Unit.loadData(array_level2Unit);
	var	level2UnitCombo=new Ext.form.ComboBox({
			anchor : '95%',
			width:200,
			listWidth:200,
			store:dsCombo_level2Unit,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"请选择...",
        	value: edit_unitid,
       		selectOnFocus:true,
       		listeners:{
				select:function(cb,rec,inx){
					try{
						gridJit.store.baseParams.params = "unitTypeId='2' and reportStatus in('1','2','3') and pid = '"+rec.get('k')+"' order by sjType desc"
						gridJit.store.load();
					}catch(e){
					}
				}
			}
		});
		
	var tmpGridJit = new Ext.grid.GridPanel(Ext.apply({
		region:'center',
		height:300,
		tbar:[level2UnitCombo],
		columns:[
			new Ext.grid.RowNumberer()
			, {header : '报表名称',dataIndex :'title',width:140,
				renderer:comRender
			},{
				header : '填报人', width:50, dataIndex :'createperson',
				align: 'center'
			},{
				header : '填报日期', width:60, dataIndex :'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')},
				align: 'center'
			},{
				header : '状态/审核', width:70, align:'center',	dataIndex :'reportStatus',	renderer:stateRender
			},{
				header : '退回原因', hidden: true, width :400,dataIndex :'reason',renderer:reasonRender.createDelegate()
			}
		],
		sm:new Ext.grid.RowSelectionModel({}),
		store:new Ext.data.Store({
				baseParams : Ext.apply({params:"report_status in ('1','2','3') order by sj_type desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true
		}),
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	},config));
//	tmpGridJit.store.sort('sjType','DESC');
	return tmpGridJit;
};

//二级企业
function createGrid2Qiy(config){
	var tmpStore2Qy = new Ext.data.Store({
				baseParams : Ext.apply({params:"pid = '" + USERBELONGUNITID + "' order by sj_type desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true,
				listeners:{
					load: function(){
				  	}
				}
	});
	var tmpGrid2Qity = new Ext.grid.GridPanel(Ext.apply({
		region:'center',
		height:300,
		tbar:[ModuleLVL<3?{
			//text:'上报',
            text : '审核通过',
			iconCls : 'option',
			handler:function(){
					var record = grid2Qiy.getSelectionModel().getSelected();
					if(record==null||record==undefined||record==''){
						Ext.example.msg('提示', '请选择一条记录');
						return;
					}
					else
					{
						for(var i in sign){
							if(Ext.isEmpty(record.get(sign[i].id))){
								//alert("'"+sign[i].label+"'  不能为空! 请在报表中填写完整。");
								//return;
							}
						}
						DWREngine.setAsync(false);
                        /*
							pcTzglService.comp2TojtOfMonthCmp(record.get('uids'), REALNAME,USERBELONGUNITNAME, function(flag){
								if ('1'==flag) 
									{
										Ext.example.msg('提示', '上报成功!');
										grid2Qiy.store.reload();
									}
									else
									{
										Ext.Msg.show({
											msg:'操作失败!',
											title: '提示',
									        buttons: Ext.MessageBox.OK,
			          						icon: Ext.MessageBox.INFO
										});					
							        }
							})
                        */
                        //调整为二级公司不需要在上报到集团，直接可以审核通过
                        var count = gridXmdw.store.getTotalCount();
                        var pass = true;
                        for (var m = 0; m < count; m++) {
                            var rec1 = gridXmdw.store.getAt(m);
                            if(rec1.get('reportStatus') != '3'){
                                Ext.example.msg('提示','项目单位报送内容没有全部审核通过！');
                                pass = false;
                                return false;
                            }
                        }
                        if(pass)verifyPass(0);
						DWREngine.setAsync(true);
					}
			}
		}:""],
		columns:[
			new Ext.grid.RowNumberer(),
			{
				header : '月度',
				width:80,
				dataIndex :'sjType',
				renderer:sjTypeRender.createDelegate(),
				align: 'center'
			},{
				header : '报表名称',
				width:200,
				dataIndex :'title',
				renderer: comRender,
				align: 'left'
			},{
				header : '填报人', width:100, dataIndex :'createperson',
				align: 'center'
			},{
				header : '填报日期', width:80, dataIndex :'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')},
				align: 'center'
			},{
				header : '报送状态', width:80, align:'center',	dataIndex :'reportStatus',	
				renderer:function(value,meta,record){
					var renderStr="";
					if(value=="0") return "<font color=gray>未上报</font>";
					if(value=="1") {
						renderStr="<font color=black>已上报</font>";
					}
					if(value=="2") renderStr="<font color=red>退回重报</font>";
					if(value=="3") renderStr="<font color=blue>审核通过</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
				}
			},{
				header : '退回原因', hidden: true, width :400,dataIndex :'reason',renderer:reasonRender.createDelegate()
			}
		],
		sm:new Ext.grid.RowSelectionModel({singleSelect : true}),
		store:tmpStore2Qy,
		bbar:getBbar(tmpStore2Qy,10),
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	},config));
	//tmpGrid2Qity.store.sort('sjType','DESC');
	return tmpGrid2Qity;
}

//项目单位
function createGridXmdw(config){
	var tmpGridXmdw = new Ext.grid.GridPanel({
			region : 'south',
			height:240,
			title:'项目单位报送情况',
			store:new Ext.data.Store({
				baseParams : Ext.apply({params:"report_status in ('1','2','3')"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta, comColums),
				remoteSort : true,
				pruneModifiedRecords : true
			}),
			columns:[
				new Ext.grid.RowNumberer(),
				{
					header : '月度',	width:80,dataIndex :'sjType',renderer:sjTypeRender.createDelegate(),
					align: 'center'
				},{
					header : '报表名称',
					align: 'left',
					width:200,
					dataIndex :'title',
					renderer: comRender
				},{
					header : '填报人', width:100, dataIndex :'createperson',
					align: 'center'
				},{
					header : '填报日期', width:80, dataIndex :'createDate',
					renderer:function(v){if(v)return v.format('Y-m-d')},
					align: 'center'
				},{
					header : '状态/审核', width:80, align:'center',	dataIndex :'reportStatus',	renderer:stateRender
				},{
					header : '退回原因', hidden: true, width :400,dataIndex :'reason',renderer:reasonRender.createDelegate()
				}
			],
			sm:new Ext.grid.RowSelectionModel({singleSelect : true}),
			loadMask : true, // 加载时是否显示进度
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			}
		});
//		tmpGridXmdw.store.sort('sjType','DESC');
		return tmpGridXmdw;
}
function sjTypeRender(val,meta,rec,rInx,cInx,store){
	if(val.length==6){
		return val.substring(0,4)+"年"+val.substring(4,6)+"月";
	}else{
		return val;
	}
}

function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0") return "<font color=gray>未上报</font>";
	if(value=="1") {
		var imgDel="";
		var imgOk="";
		if(ModuleLVL<3){
			imgDel="<img src='" + BASE_PATH +"/jsp/res/images/sendBack2.png' title='退回'  onclick='verifyBack()'>";
			imgOk="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/pass2.png' title='通过' onclick='verifyPass()'>&nbsp;&nbsp;";
		}
		renderStr="<font color=black>未审核</font>";
		return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>"+imgOk+imgDel;
	}
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") {
		if(sendBackFlag=='2'&&USERBELONGUNITTYPEID=="2"){
			var imgDel="";
			if(ModuleLVL<3){
				imgDel="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/sendBack2.png' title='退回'  onclick='verifyBack()'>";
			}
			renderStr="<font color=blue>审核通过</font>";
			return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>"+imgDel;
		}
		renderStr="<font color=blue>审核通过</font>";
	
	}
	return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}
function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
function verifyPass(){
	Ext.Msg.confirm('提示','您是否确认要"审核通过"此条记录？',function(txt){
		if(txt=='yes'){
			var record=null;
			if(USERBELONGUNITTYPEID=="2") record=gridXmdw.getSelectionModel().getSelected();
			else if(USERBELONGUNITTYPEID=="0")record=gridJit.getSelectionModel().getSelected();
            if(p == 0)record=grid2Qiy.getSelectionModel().getSelected();
			var uids=record.get('uids');
			Ext.getBody().mask("提交中……");
			pcTzglService.updateState(uids,REALNAME,USERBELONGUNITNAME," ",USERBELONGUNITID,3, function(flag){
				Ext.getBody().unmask();
				if(flag=="1"){
					Ext.example.msg('提示','操作成功');													
				}else{
					Ext.example.msg('提示','操作失败',2);													
				}
				//if(USERBELONGUNITTYPEID=="2")gridXmdw.getStore().reload();
				if(USERBELONGUNITTYPEID=="2")grid2Qiy.getStore().reload();
				else if(USERBELONGUNITTYPEID=="0")gridJit.getStore().reload();
			})
		}
	})
}

function verifyBack(){
	
	try{
		var rec = null;
		if(USERBELONGUNITTYPEID=="2") rec=gridXmdw.getSelectionModel().getSelected();
		else if(USERBELONGUNITTYPEID=="0")rec=gridJit.getSelectionModel().getSelected();
		if(rec){
			var winPanel = new BackWindow({
				doBack:function(reason){
					var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
					mask.show();
					pcTzglService.updateState(rec.get('uids'),REALNAME,USERBELONGUNITNAME,reason,USERBELONGUNITID,2, function(flag){
					mask.hide();
						if(flag=="1"){
							Ext.example.msg('提示','操作成功!');	
							win.hide();
						}else{
							Ext.example.msg('提示','操作失败!');										
						}
						if(USERBELONGUNITTYPEID=="2")gridXmdw.getStore().reload();
						else if(USERBELONGUNITTYPEID=="0")gridJit.getStore().reload();
					})
				}
			});
			var win=new Ext.Window({
				id:'backWin',
				width: 700, minWidth: 460, height: 400,
				layout: 'border', closeAction: 'close',
				border: false, constrain: true, maximizable: true, modal: true,
				items: [winPanel,{
					region : 'south',
					height:240,
					title:'交互记录',
					xtype : 'panel',
//					autoScroll:true,
					html : '<iframe name="bidDetailFrame" src="'+CONTEXT_PATH+ 
					'/PCBusiness/bid/pc.businessBack.log.jsp?edit_pid='+rec.get('pid')+'&edit_uids='+rec.get('uids')
					+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				}]
			});
			win.show();
		}
	}catch(e){
	}
					
}

function reasonRender(val,meta,rec,rInx,cInx,store){
	if(val!=""){
		meta.attr = 'title="' + val + '"';
	}
    return val;
}

function comRender(v, m, r)
{
	var unitType = r.get('unitTypeId');
	var repState=r.get('reportStatus');
	if(repState=="0"&&unitType=="A")return v;
	return "<a href='javascript:showEditWindow2(\""+unitType+"\")'>"+v+"</a>";
}	
var selectGrid=null;
function showEditWindow2(unitType){
	if(unitType=='A') {
		var record = gridXmdw.getSelectionModel().getSelected();
		selectGrid=gridXmdw;
		reportRecord = record;
		var params = {
			p_type : 'TZGK_MONTH_REPORT',
			p_date : record.get('sjType'),
			p_corp : record.get('pid'),
			p_key_col : 'MASTER_ID',
			p_key_val : record.get('uids'),
			openCellType : 'iframe',
			onCellOpened : onCellOpened,
			afterCellSaved : afterCellSaved
			
		}
		var cellUrl = "/"+ROOT_CELL+ "/cell/eReport.jsp";
		window.showModalDialog(cellUrl,params,"dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
		gridXmdw.getStore().reload();
	} else	{
		var record;
		if(gridJit==null) {
			record=grid2Qiy.getSelectionModel().getSelected();
			selectGrid=grid2Qiy;
		}else {
			record=gridJit.getSelectionModel().getSelected();
			selectGrid=gridJit;
		}
		reportRecord = record;
		var savable=false;
		if(USERBELONGUNITTYPEID=='0') savable=false;
		else if(reportRecord.get('reportStatus')=='0' || reportRecord.get('reportStatus')=='2') savable=true;
		var params = {
			p_type : 'TZGK_MONTH_REPORT_2',
			p_date : record.get('sjType'),
			p_corp : record.get('pid'),
			p_key_col : 'MASTER_ID',
			p_key_val : record.get('uids'),
			openCellType : 'iframe',
			savable : savable,
			onCellOpened : onCellOpened,
			afterCellSaved : afterCellSaved,
			beforeCellSaved : beforeCellSaved,
			p_unitfilter:getFile("extfilter.java")
		}
		var cellUrl = "/"+ROOT_CELL+ "/cell/eReport.jsp";
		window.showModalDialog(cellUrl,params,"dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
		if(grid2Qiy) {
			grid2Qiy.getStore().reload();
		}
		/*
		window.showModalDialog(
						CONTEXT_PATH+ "/PCBusiness/tzgl/query/pc.tzgl.monthInvest.multiPro.report.jsp",
						m_record,"dialogWidth:1000px;dialogHeight:1080px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		*/
	}
}

var sign = {
	memoVar1:{label:'单位负责人',id:'unitUsername',column:'UNIT_USERNAME'},
	memoVar2:{label:'统计负责人',id:'countUsername',column:'COUNT_USERNAME'},
	memoVar3:{label:'联系方式',id:'createpersonTel',column:'CREATEPERSON_TEL'},
	userId:{label:'填报人',id:'createperson',column:'CREATEPERSON'}
}
var CellDoc=null;
//打开报表时，写入备注字段
function onCellOpened(CellWeb1){
	var reportId = reportRecord.get('uids');
	
	CellDoc=new CellXmlDoc(CellWeb1);
	DWREngine.setAsync(false);
	pcTzglService.findDataByTableId("V_PC_TZGL_MONTH_REPORT_M","uids='"+reportId+"'",function(masterRecord){
//		alert(Ext.encode(masterRecord));
		if(masterRecord.CREATEPERSON==null)masterRecord.CREATEPERSON=REALNAME;
		CellDoc.replaceSign(masterRecord);
	});
	DWREngine.setAsync(true);
	
}

//报表保存的时候，只保存填写的备注字段的数据。
function afterCellSaved(CellWeb1){
	var reportId = reportRecord.get('uids');
//	alert(selectGrid);
//	return;
	if(!reportRecord) return;
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0){
		pcTzglService.updateDataByTableId("Pc_Tzgl_Month_Comp_M", " uids='" + reportRecord.get('uids') + "'", dataMap, function(){
			if(USERBELONGUNITTYPEID=="2")grid2Qiy.getStore().reload();
				else if(USERBELONGUNITTYPEID=="0")gridJit.getStore().reload();
			});
	}

}

function beforeCellSaved(CellWeb1,win){
	var signCells=CellDoc.signCells;
	for(var i in sign){
		var tag=sign[i].column;
		var flag =  win.isNull(signCells[tag].c,signCells[tag].r,signCells[tag].s);
		if(flag=="1"){//单元格数据为空
			return {success:false,msg:"'"+sign[i].label+"为必填项'"}
		}
	}
	return {success:true};	
}
