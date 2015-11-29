var reportStat = [['0', '<font color=gray>未上报</font>'], ['1', '<font color=blue>已上报</font>'],['2','<font color=red>退回重报</font>']];
var jdGrid;
if(lvl != null && lvl != "") ModuleLVL = lvl
var RW= parseInt(ModuleLVL)<3?true:false;  //全局判断是否显示顶部工具栏按钮以及附件上传还是查看

var reportRecord,outFilter ="1=1";
if(PID!=""&&PRONAME!="")  switchoverProj(PID,PRONAME);
if(UIDS!=""){
	var str ="";
	for(var i=0,len=UIDS.split(',');i<len.length;i++){str+="'"+len[i]+"',";}
	if(str.length>0) str= str.substring(0,str.length-1);
    outFilter=" uids in ("+str+")";
}
Ext.onReady(function() {
	var monthArray = getMonths();
	var monthDs = new Ext.data.SimpleStore({fields : ['k', 'v'],data : monthArray})
	
	var monthCombo = new Ext.form.ComboBox({
		name : 'report-month',
		readOnly : true,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : monthDs,
		emptyText: '请选择...',
		lazyRender : true,
		allowBlank : true,
		listClass : 'x-combo-list-small',
		width : 100,
		listeners : {
			select : function(combo) {
				var month = combo.getValue();
				var reportname = CURRENTAPPNAME+month.substr(0,4)+"年"+month.substr(4,6)+"月进度情况月度报表";
				var record = jdGrid.getSelectionModel().getSelected();
				record.set('reportname', reportname);
			},
			expand : function(){
				DWREngine.setAsync(false);
				var _sql = "select sj_type from pc_edo_report_input where pid='"+CURRENTAPPID+"' order by 'asc'";
				var sjArray = new Array();
				baseMgm.getData(_sql, function(list){
					sjArray = list.slice();
				})	
				DWREngine.setAsync(true);
				
				if(sjArray.length>0){
   				    monthDs.filterBy(sjTypeFilter);
   				    function sjTypeFilter(record,id){
   				  	for(var i=0; i<sjArray.length; i++){
						if(record.get("k")==sjArray[i]) return false;
					}
   				  	return true;
   				  } 
   				}
			}
		}
	})
	var jdColumns = [{
			name : 'uids',               
			type : 'string'
		}, {
			name : 'pid',
			type : 'string'
		}, {
			name : 'createdate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'createperson',
			type : 'string'
		}, {
			name : 'reportname',
			type : 'string'
		}, {
			name : 'memo',
			type : 'string'
		}, {
			name : 'state',
			type : 'string'
		}, {
			name : 'projectId',
			type : 'string'
		}, {
			name : 'billState',
			type : 'string'
		}, {
			name : 'sjType',
			type : 'string'
		},{
			name : 'unitUsername',
			type : 'string'
		},{
			name : 'countUsername',
			type : 'string'
		},{
			name : 'createpersonTel',
			type : 'string'
		},{
			name : 'reportDate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		},{
			name : 'backUser',
			type : 'string'
		},{
			name : 'reason',
			type : 'string'
	}]

	var jdDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : 'com.sgepit.pcmis.jdgk.hbm.VPcJdgkReport',
			business : 'baseMgm',
			method : 'findWhereOrderby',
			params : "pid='" + pid + "' order by sj_type desc",
			outFilter :outFilter
		},
		proxy : getProxy(),
		reader : getReader(jdColumns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'createdate' : {
			name : 'createdate',
			fieldLabel : '填报日期',
			hideLabel : true,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'reportname' : {
			name : 'reportname',
			fieldLabel : '报表名称',
			hideLabel : false,
			anchor : '95%'
		},
		'sjType' : {
			name : 'sjType',
			fieldLabel : '月度',
			hideLabel : false,
			anchor : '95%'
		}
	}
	var jdCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(), 
		{
				id : 'sjType',
				header : fc['sjType'].fieldLabel,
				dataIndex : fc['sjType'].name,
				hidden : false,
				width: 60,
				align: 'center',
				editor : monthCombo,
				renderer:function(k){
					var defalut = "";
					for(var i = 0;i<monthArray.length;i++){
						if(k == monthArray[i][0]){
							defalut = monthArray[i][1];
					  	}
					}
					return defalut;
				}
			}, {
				id : 'reportname',
				header : fc['reportname'].fieldLabel,
				dataIndex : fc['reportname'].name,
				hidden : false,
				width : 200,
				editor : (RW?new Ext.form.TextField(fc['reportname']):null),
				align: 'center',
				renderer:function(v,m,r){
					if(r.isNew===true){
						return "<a href='javascript:void()'>"+v+"</a>";
					}else{
						return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
					}
				}
			},{
				id : 'createperson',
				header : '填报人',
				dataIndex : 'createperson',
				align: 'center',
				width : 100
			},{
				id : 'createdate',
				header : fc['createdate'].fieldLabel,
				dataIndex : fc['createdate'].name,
				width : 80,
				editor : (RW?new Ext.form.DateField(fc['createdate']):null),
				renderer:function(v){if(v)return v.format('Y-m-d')},
				align: 'center'
			},  {
				id : 'state',
				header : '上报状态',
				dataIndex : 'state',
				align: 'center',
				width:80,
				renderer : stateRender.createDelegate(this)
			}
	]);
	// 列模型创建完毕

	// 创建显示批文办理情况的grid
	jdGrid = new Ext.grid.EditorGridTbarPanel({
			ds : jdDs,
			cm : jdCm, // 列模型
			sm : new Ext.grid.RowSelectionModel({singleSelect : true}),
			clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
			addBtn: RW,
			delBtn: RW,
			saveBtn: RW,
			viewConfig : {forceFit : true,ignoreAdd : true	},
			tbar : !RW||['-'],// 顶部工具栏，可选
			bbar : getBbar(jdDs),
			plant : Ext.data.Record.create(jdColumns),
			plantInt : {
				uids : '',
				pid : CURRENTAPPID,
				projectId : '',
				createdate : SYS_DATE_DATE,
				createperson : REALNAME,
				reportname :'',
				state : '0',
				sjType : '',
				memo : ''
			},
			servletUrl : MAIN_SERVLET,
			bean : 'com.sgepit.pcmis.jdgk.hbm.PcEdoReportInput',
			primaryKey : "uids",
			saveHandler: function() {
				var record = this.getSelectionModel().getSelected();
				if(record==null){
					return ;
				}else if((record.get('reportname')==''||record.get('reportname')==null)){
					Ext.example.msg('提示', '请填写的报告名称!');
					return;
				}else{
					this.defaultSaveHandler();
				}
			},
			deleteHandler : function() {
				var _grid_ = this;
				var record = this.getSelectionModel().getSelected();
				if(record==null){
					Ext.example.msg('提示', '请选中一条记录!');
					return ;
				}
				var stat = record.get('state');
				if (stat!='0') {
					Ext.example.msg('提示', '已上报的报告无法删除!');
					return;
				} else if(stat=='0'){
					Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
								text) {
						if(btn=='yes'){
							var unitid = record.get('pid');
							var sjType = record.get('sjType');
							var detailDel = "delete from pc_edo_project_month_d where sj_type='"+sjType+"' and unit_id='"+unitid+"'";//细表删除语句
							var masterDel = "delete from pc_edo_report_input where uids='"+record.get("uids")+"'"//主表删除语句
							baseDao.updateByArrSQL([detailDel,masterDel],function(flag){
								if(flag){
									Ext.example.msg("提示","操作成功!");
									_grid_.getStore().reload();
								}else{
									Ext.example.msg("提示","操作失败!");
								}
							});
						}
					},jdGrid);
				}
			},
			listeners:{
				beforeedit:function(o){
					var rec = o.record;
					var unedit = rec.get('state');
					if(unedit=='1'){
						return false
					}else{
						return true
					}
				},
				rowclick: function(){
					var record = jdGrid.getSelectionModel().getSelected();
					var able = record.get('state');
					
					if(able=='1'&&RW){
						jdGrid.getTopToolbar().items.get('up').disable();
						jdGrid.getTopToolbar().items.get('del').disable();
						jdGrid.getTopToolbar().items.get('save').disable();
						
					}else if(able=='0'&&RW){
						jdGrid.getTopToolbar().items.get('up').enable();
						jdGrid.getTopToolbar().items.get('del').enable();
						jdGrid.getTopToolbar().items.get('save').enable();
					}else if(able=='2'&&RW){
						jdGrid.getTopToolbar().items.get('up').enable();
					}else if(able=='3'&&RW){
						jdGrid.getTopToolbar().items.get('up').disable();
						jdGrid.getTopToolbar().items.get('del').disable();
						jdGrid.getTopToolbar().items.get('save').disable();
					}else{
						return;
					}
				}
			}
	});

	upBtn = new Ext.Button({
		id:'up',
		text: '上报',
		iconCls: 'upload',
		disabled : true,
		handler: ReportUp
	})
			
			
	//布局的实现-----------------------------------------------------------------
	var viewPort = new Ext.Viewport({
		layout : 'fit',
		items : [jdGrid]
	})
					
	jdDs.load();
	if(RW)
	{
		jdGrid.getTopToolbar().add(upBtn);
		jdGrid.header = null;
		jdGrid.tbar  = null;
	}
	
	// 将选中的报告通过数据交互提交到集团二级公司或集团
	function ReportUp() {
		var record = jdGrid.getSelectionModel().getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});
		if(record==null||record==undefined||record==''){
			Ext.example.msg('提示', '请选择一条进度管控记录');
			return;
		}else {
			if(record.get('uids')==''||record.get('uids')==null)
			{
				Ext.example.msg('提示', '新增的进度报告请先保存后再上报!');
				return;
			} else {
				for(var i in sign){
					if(Ext.isEmpty(record.get(sign[i].id))){
						alert("'"+sign[i].label+"'为必填项");
						return;
					}
				}
				  DWREngine.setAsync(false);
				  var hql="from PcEdoReportInput t where t.sjType='"+record.get('sjType')+"' and t.pid='"+pid+"'";
				 	baseDao.findByHql(hql,function(list){
						if(list[0].flagNull == '1'){
						     alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】"); 
						}else{
				             Ext.MessageBox.confirm('确认', '上报操作将不可恢复，上报后数据将不能修改，确认要上报吗？',
						          function(btn, text) {
										if (btn == 'yes') {
											var uids = record.get('uids');
											var fromUnit = record.get('pid');
											myMask.show();
											pcJdgkMgm.submitReport(uids, defaultOrgRootID,
													fromUnit, REALNAME, function(flag) {
														myMask.hide();
														if ('1' == flag) {
															Ext.example.msg('提示', '上报成功!');
															jdDs.reload();
														} else {
															Ext.Msg.show({
																		msg : '操作失败!',
																		title : '提示',
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.INFO
																	});
													}
												});
									}
								})
					}
				     DWREngine.setAsync(true);
				})
			}
		}
	}
	  
})// Ext.onReady()结束
//报送状态转换
function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0") return "<font color=gray>未上报</font>";
	if(value=="1") renderStr="<font color=black>已上报</font>";
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") renderStr="<font color=blue>审核通过</font>";
	return "<a title='点击查看详细信息' href='javascript:void(0)' " +
				"onclick='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}
function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
function showEditWindow2(){
	var m_record = jdGrid.getSelectionModel().getSelected();
	reportRecord = m_record;
	var flag = reportRecord.get('state')=='0' || reportRecord.get('state')=='2';
	var reportParams = {
		p_type:'XMJD_MONTH_REPORT',
		p_corp:CURRENTAPPID,
		p_date:m_record.get('sjType'),
		p_key_col : 'REPORT_ID',
		p_key_val : m_record.get('uids'),
		p_checkNull : true,
		savable:RW?flag:false,
		onCellOpened:onCellOpened,
		afterCellSaved: afterCellSaved,
		beforeCellSaved: beforeCellSaved
	};
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	window.showModalDialog(
			"/"+ROOT_CELL+"/cell/eReport.jsp",
			reportParams,"dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
	jdGrid.getStore().reload();
}
//打开报表时，写入备注字段
var CellDoc=null;
function onCellOpened(CellWeb1){
	var reportId = reportRecord.get('uids');
	CellDoc=new CellXmlDoc(CellWeb1);
	if(reportRecord){
		pcTzglService.findDataByTableId("pc_edo_report_input","uids='"+reportRecord.get('uids')+"'",function(data){
			CellDoc.replaceSign(data);
		});
	}
}
//报表保存的时候，只保存填写的备注字段的数据。
function afterCellSaved(CellWeb1,v_checkNullResult){
	var flag = 0;
	var sql = '';
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0&&reportRecord){
		pcTzglService.updateDataByTableId("pc_edo_report_input", " uids='" + reportRecord.get('uids') + "'", dataMap, function(){
			if(v_checkNullResult == true){
			   flag = '0';
			}else{
			  flag = '1';
			}
			sql = "update PC_EDO_REPORT_INPUT t set t.FLAG_NULL='"+flag+"' where t.sj_type='"+reportRecord.get('sjType')+"' and t.pid='"+pid+"'";
		    baseDao.updateBySQL(sql);
			jdGrid.getStore().load();
		});
	}
}
var sign = {
		UNIT_USERNAME:{label:'单位负责人',id:'unitUsername'},
		COUNT_USERNAME:{label:'统计负责人',id:'countUsername'},
		CREATEPERSON_TEL:{label:'联系方式',id:'createpersonTel'},
		CREATEPERSON:{label:'填报人',id:'createperson'}
	}
function beforeCellSaved(CellWeb1,win){	
	var signCells=CellDoc.signCells;
	for(var tag in sign){
		var flag =  win.isNull(signCells[tag].c,signCells[tag].r,signCells[tag].s);
		if(flag=="1"){//单元格数据为空
			return {success:false,msg:"'"+sign[tag].label+"'为必填项"}
		}
	}
	return {success:true};	
}