//公用部分
var comBaseParams = {
	ac : 'list',business : 'baseMgm',method : 'findWhereOrderby',
	bean : 'com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM'
};
var edit_unitid=USERBELONGUNITID;
if(USERBELONGUNITTYPEID=="0"){
	edit_unitid = "103";
}
var sendBackFlag='0';
var comProxy = new Ext.data.HttpProxy({method : 'GET',url : MAIN_SERVLET});
var comMeta = {root : 'topics',totalProperty : 'totalCount',id : "uids"};
var comColums = [{
		name : 'uids',type : 'string'
	},{
		name : 'pid',type : 'string'
	},{
		name : 'sjType',type : 'string'
	},{
		name : 'unitId',type : 'string'
	},{
		name : 'title',type : 'string'
	},{
		name : 'billState',type : 'string'
	},{
		name : 'state',type : 'string'
	},{
		name : 'memo',type : 'string'
	},{
		name : 'userId',type : 'string'
	},{
		name : 'createDate',type : 'date',dateFormat : 'Y-m-d H:i:s'
	},{
		name : 'lastModifyDate',type : 'date',dateFormat : 'Y-m-d H:i:s'
	},{
		name:'backUser',type:'string'
	},{
		name : 'reason',type : 'string'
	},{
		name : 'unitname',type : 'string'
	},{
		name : 'memoVar1',type : 'string'
	},{
		name : 'memoVar2',type : 'string'
	},{
		name : 'memoVar3',type : 'string'
	},{
		name : 'verifyState',type : 'string'
	},{
		name : 'reportDate',type : 'date',dateFormat : 'Y-m-d H:i:s'
	}
];
Ext.util.Format.comboRenderer = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
		return record?record.get(combo.displayField): "";
	}
}
//时间数组
var array_yearMonth=new Array();
var curr_year=new Date().getYear();
var curr_month = new Date().getMonth();
var months=["01","02","03","04","05","06","07","08","09","10","11","12"];
for(var i =curr_year ; i>=2007; i--) {
	for(var j=months.length-1;j>=0;j--){
		if(curr_year==i&&curr_month<j) continue;//最大显示到本年本月
		var temp = new Array();	
		temp.push(i+""+months[j]);		
		temp.push(i+"年"+months[j]+"月");	
		array_yearMonth.push(temp);
	}
};
var sjCombo = new Ext.form.ComboBox({
		triggerAction : 'all',mode : 'local',valueField : 'k',displayField : 'v',
		store :new Ext.data.SimpleStore({fields: ['k', 'v'],data: array_yearMonth})
	});
//公用部分 end
var gridJt,grid2Qiy,gridXmdw;//集团grid、二级企业grid、项目单位grid
var SelectRecord = null;//选择中grid记录（全局变量）
var shenHeCombo = new Ext.form.ComboBox({
	triggerAction : 'all',mode : 'local',valueField : 'k',displayField : 'v',editable:false,
	store :new Ext.data.SimpleStore({fields: ['k', 'v'],data: [['0','未审核'],['1','审核通过'],['2','退回']]})
});

Ext.onReady(function(){
	//当前用户为集团公司用户
	if(USERBELONGUNITTYPEID=="0"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [gridJt = createGridJt()]
		});
		var sj=((new Date()).getYear() + months[(new Date()).getMonth()]);
		gridJt.store.load({params:{start:0,limit:10}});
	}else if(USERBELONGUNITTYPEID=="2"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [grid2Qiy = createGrid2Qiy(),gridXmdw = createGridXmdw()]
		});

		grid2Qiy.store.reload({params:{limit:10,start:0}});
	}
});

//集团月报
function createGridJt(){
	
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
						gridJt.store.baseParams.params = "unitTypeId='2' and state in('1','2','3') and pid = '"+rec.get('k')+"' order by sjType desc"
						gridJt.store.load();
					}catch(e){
					}
				}
			}
		});
		
	var cmJt = new Ext.grid.ColumnModel([ // 创建列模型
		new Ext.grid.RowNumberer(),{
				header : "月度",
				dataIndex : "sjType",
				hidden:true,
				align:'center',
				renderer:Ext.util.Format.comboRenderer(sjCombo),
				width:120
			}, {
				header :"报表名称",
				width:190,
				align:'left',
				dataIndex : 'title',
				renderer:function(v){return "<a href='javascript:showEditWindow2(\"gridJt\",false)'>"+v+"</a>";}
			}, {
				header : "填报人",
				width:50,
				dataIndex : 'userId',
				align:'center'
			}, {
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:80,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			}, {
				id : 'state',
				type : 'string',
				header :"状态/审核",
				width:60,
				align:'center',
				dataIndex : 'state',
				renderer:stateRender.createDelegate()
			}
	]);
	var tmpStoreJt = new Ext.data.Store({
				baseParams : Ext.apply({params:"unitTypeId='2' and state in('1','2','3') order by sjType desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true
	});
	var tmpGridJt = new Ext.grid.EditorGridPanel({
				tbar:[level2UnitCombo],
				store : tmpStoreJt,
				cm : cmJt,
				sm : new Ext.grid.CheckboxSelectionModel({singleSelect : true}),
				border : false,
//				layout : 'fit',
				region : 'center',
				header : false,
				viewConfig : {
					forceFit : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 10,
					store : tmpStoreJt,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});
	return tmpGridJt;
};
//二级企业
function createGrid2Qiy(config){
	var dsCombo_yearMonth=new Ext.data.SimpleStore({fields: ['k', 'v']});
	dsCombo_yearMonth.loadData(array_yearMonth);
	var yearMonthCombo = new Ext.form.ComboBox({
		typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		lazyRender : true,
		store :dsCombo_yearMonth,
		valueField : 'k',
		displayField : 'v',
		editable:false,
		emptyText:"请选择",
		allowBlank : false,
		hiddenValue:true,
		maxHeight:157,
		listeners:{
   			'expand':function(){
   				var Mbean = "com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM";
   				pcTzglService.sjTypeFilter(USERBELONGUNITID,Mbean,function(arr){
   					if(arr.length>0){
       				  dsCombo_yearMonth.filterBy(sjTypeFilter);
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
	});
	var cm2Qiy = new Ext.grid.ColumnModel([ // 创建列模型
		new Ext.grid.RowNumberer(),{
				id : 'sjType',
				type : 'string',
				header : "月度",
				dataIndex : "sjType",
				width:60,
				align:'center',
//				editor:yearMonthCombo,
				renderer:Ext.util.Format.comboRenderer(sjCombo)
			}, {
				id : 'title',
				type : 'string',
				header :"报表名称",
				width:240,
				align:'left',
				dataIndex : 'title',
				renderer:function(v,meta,rec){
					var saveable = true;
					if(rec.get('state')=='1' || rec.get('state')=='3') saveable = false;
					return "<a href='javascript:showEditWindow2(\"grid2Qiy\","+saveable+")'>"+v+"</a>";}
			},  {
				id : 'memoVar1',
				type : 'string',
				header : '单位负责人',
				dataIndex : 'memoVar1',
				width : 80,
				hidden:true,
//				editor : new Ext.form.TextField({name : 'memoVar1', allowBlank : true}),
				align : 'center'
			}, {
				id : 'memoVar2',
				type : 'string',
				header : '统计负责人',
				width : 80,
				dataIndex : 'memoVar2',
				hidden:true,
//				editor : new Ext.form.TextField({name : 'memoVar2', allowBlank : true}),
				align : 'center'
			}, {
				id : 'userId',
				type : 'string',
				header : "填报人",
				width:80,
				dataIndex : 'userId',
				align:'center'
			},{
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:80,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			
			}, {
				id : 'memoVar3',
				type : 'string',
				header : '联系方式',
				hidden:true,
				width : 80,
				dataIndex : 'memoVar3',
//				editor : new Ext.form.TextField({name : 'memoVar3', allowBlank : true}),
				align : 'center'
			}, {
				id : 'state',
				type : 'string',
				header :"报送状态",
				width:60,
				align:'center',
				dataIndex : 'state',
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
				id : 'verifyState',
				type : 'string',
				header :"上级审核意见",
				width:60,
				align:'center',
				hidden:true,
				dataIndex : 'verifyState',
				renderer:function(v,meta,r){
					if(v=="0")  return "<font color=gray>未审核</font>";
					else if(v=="1") return "<font color=blue>审核通过</font>";
					else if(v=="2") return "<font color=red>退回</font>";
					else return "<font color=gray>未审核</font>";
				}	
			}
	]);
	var tmpStore2Qy = new Ext.data.Store({
				baseParams : Ext.apply({params:"pid ='"+USERBELONGUNITID+"' order by sj_type desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true
	});
	var Plant = Ext.data.Record.create(comColums);

	var PlantInt= {uids:'',pid:USERBELONGUNITID,sjType:'',unitId:'',title:'',billState:'',state:'0',
					memo:'',userId:REALNAME,createDate:new Date(),lastModifyDate:'',memoVar1:'',memoVar2:'',memoVar3:''}
	var tmpGrid2Qity = new Ext.grid.EditorGridTbarPanel({
						store : tmpStore2Qy,
						cm : cm2Qiy,
						sm : new Ext.grid.CheckboxSelectionModel({singleSelect : true}),
						tbar :[],
						border : false,
						layout : 'fit',
						region : 'center',
						header : false,
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						trackMouseOver : true,
						viewConfig : {
							forceFit : true,
							ignoreAdd : true
						},
						bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
							pageSize : 10,
							store : tmpStore2Qy,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						}),
						insertHandler:function(){
							tmpGrid2Qity.defaultInsertHandler();
							
							if(checkHasBtn(tmpGrid2Qity,'add')) tmpGrid2Qity.getTopToolbar().items.get('add').disable();
							if(checkHasBtn(tmpGrid2Qity,'save')) tmpGrid2Qity.getTopToolbar().items.get('save').disable();
							if(checkHasBtn(tmpGrid2Qity,'del')) tmpGrid2Qity.getTopToolbar().items.get('del').enable();
						},
						deleteHandler:function(){
							var sm = tmpGrid2Qity.getSelectionModel();
							var ds = tmpGrid2Qity.getStore();
							if (sm.getCount() > 0) {
								Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
										text) {
									if (btn == "yes") {
										var records = sm.getSelections()
										var codes = []
										for (var i = 0; i < records.length; i++) {
											var m = records[i].get(tmpGrid2Qity.primaryKey)
											if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
												continue;
											}
											codes[codes.length] = m
										}
										var mrc = codes.length
										if (mrc > 0) {
											var ids = codes.join(",");
											tmpGrid2Qity.doDelete(mrc, ids)
										} else {
											ds.reload();
										}
										if(checkHasBtn(tmpGrid2Qity,'add')) tmpGrid2Qity.getTopToolbar().items.get('add').enable();
										if(checkHasBtn(tmpGrid2Qity,'del')) tmpGrid2Qity.getTopToolbar().items.get('del').disable();
									}
								}, tmpGrid2Qity);
							}
						},
						listeners:{
							'aftersave':function(grid, idsOfInsert, idsOfUpdate, _primaryKey,  _bean){
								if(checkHasBtn(grid,'add')) grid.getTopToolbar().items.get('add').enable();
								if(checkHasBtn(grid,'save')) grid.getTopToolbar().items.get('save').disable();
								if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
							},
							'render':function(grid){
								if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
								if(checkHasBtn(grid,'save')) grid.getTopToolbar().items.get('save').disable();
								if(ModuleLVL<3){
									grid.getTopToolbar().addButton({
											id:'report',
											text: '上报',
											iconCls: 'upload',
											handler:function(){
												var selRec = grid.getSelectionModel().getSelected();
												if(selRec==null) return;
												for(var i in sign){
													if(Ext.isEmpty(selRec.get(sign[i].id))){
														alert("'"+sign[i].label+"'  不能为空! 请在报表中填写完整。");
														return;
													}
												}
												if(selRec&&selRec.isNew!=true){
													var sql = "select zb_seqno from pc_bid_supervisereport_d where sj_type='"+selRec.get('sjType')+"' " +
														"and unit_id in (select unitid from (select unitid from sgcc_ini_unit where unit_type_id='A' "+
														"connect by prior unitid=upunit start with unitid='"+selRec.get('pid')+"') where unitid in "+
														"(select pid from pc_bid_supervisereport_m where state='3' and sj_type='"+selRec.get('sjType')+"' " +
									                    ")) and zb_seqno is not null order by unit_id asc,nvl(kbrq,'00000000') desc";
									                baseDao.getData(sql,function(lt){
									                	if(lt.length>0){
									                		Ext.Msg.confirm('提示','是否上报？',function(txt){
																if(txt=='yes'){
																	var upSql = "update pc_bid_supervisereport_m set state='1' where " +
																			"uids = '"+selRec.get('uids')+"'";
																	var dt=new Date();
																	var newUids=getSN();
																	var bussBacksql="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,"
																				+"back_date,busniess_type,spare_c1,spare_c2,back_reason)"
																				+"values('"+selRec.get('pid')+"','"
																				  +newUids+"','"
																				  +selRec.get('uids')+"','"
																				  +REALNAME+"',to_date('"
																				  +dt.format('Y-m-d H:i:s')+"','YYYY-MM-DD HH24:MI:SS'),'"
																				  +"招投标（合同）月报上报【二级企业->集团】','上报','"
																				  +USERBELONGUNITNAME+"',' ')";
																	PCBidDWR.secondReport(upSql,bussBacksql,function(flag){
																		if(flag=="1"){
																			grid.getStore().reload();
																			Ext.example.msg('提示','操作成功');													
																		}else{
																			Ext.example.msg('提示','操作失败',2);													
																		}
																	})
																}
																grid.getStore().reload();
															})
									                	}else{
									                		Ext.example.msg('提示','没有"审核通过"的记录');
									                	}
									                });
												}
											}
									});
								}
							},
							'afterdelete':function(grid, ids){
								if(checkHasBtn(grid,'add')) grid.getTopToolbar().items.get('add').enable();
								if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
							},
							'cellclick' : function(grid, rowIndex,columnIndex, e){
				        		var record = grid.getSelectionModel().getSelected();
				        		if(record){
				        			if(record.get('state')=="0"||record.get('state')=="2")
				        			{
				        				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').enable();
				        				if(checkHasBtn(grid,'report')) Ext.getCmp('report').enable();
				        			}
				        			else
				        			{
				        				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
				        				if(checkHasBtn(grid,'report')) Ext.getCmp('report').disable();
				        			}
				        			if(gridXmdw){
				        				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				        				if(fieldName !='state'){
											systemMgm.getPidsByUnitid(record.get('pid'),function(lt){
												var pids = "''";
												for(var i=0,j=lt.length;i<j;i++){
													pids+=",'"+lt[i].unitid+"'"
												}	
												if(record.get('state')=='2'){sendBackFlag='2';}else{sendBackFlag='0';}			
												gridXmdw.store.baseParams.params = "pid in ("+pids+") and state in ('1','2','3') and sj_type = '"+record.get('sjType')+"'";
												gridXmdw.store.reload();
											})
				        				}
				        			}
				        		}else{
				        			if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
				        		}
				        	},
				        	'beforeedit':function(e){
				        		if(e.record.get('state')=='1')return false;
				        	},
				        	'afteredit':function(o){
				        		if(checkHasBtn(tmpGrid2Qity,'save')) tmpGrid2Qity.getTopToolbar().items.get('save').enable();
				        		if(o.field==="sjType"){
				        			var display_value="";
				        			for(var i = 0;i<array_yearMonth.length;i++){
										if(o.value == array_yearMonth[i][0]){
											display_value=array_yearMonth[i][1];
										}
									}
				        			o.record.set("title",USERBELONGUNITNAME+display_value+"招标(合同)月度报表");
				        		}
				        	}
						},
						plant : Plant,
						plantInt : PlantInt,
						servletUrl : MAIN_SERVLET,
						addBtn : false, // 是否显示新增按钮
						saveBtn : false, // 是否显示保存按钮
						delBtn : false, // 是否显示删除按钮
						bean : "com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM",
						business : "baseMgm",
						primaryKey : "uids"
					});
	return tmpGrid2Qity;
}
//项目单位
function createGridXmdw(config){
	var cmXmdw = new Ext.grid.ColumnModel([ // 创建列模型
		new Ext.grid.RowNumberer(),
			{
				header : "月度",
				dataIndex : "sjType",
				align:'center',
				renderer:Ext.util.Format.comboRenderer(sjCombo),
				width:60
			}, {
				header :"报表名称",
				width:160,
				align:'left',
				dataIndex : 'title',
				renderer:function(v){return "<a href='javascript:showEditWindow2(\"gridXmdw\",false)'>"+v+"</a>";}
			}, {
				header : "填报人",
				width:50,
				dataIndex : 'userId',
				align:'center'
			},{
				header : "填报日期",
				width:50,
				dataIndex : 'createDate',
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			}, {
				header : "上报时间",
				width:50,
				dataIndex : 'reportDate',
				hidden:true,
				align:'center',
				dataIndex : 'reportDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			},  {
				header :"状态/审核",
				width:90,
				align:'center',
				dataIndex : 'state',
				renderer:stateRender.createDelegate()
			}
	]);
	var tmpStoreXmdw = new Ext.data.Store({
				baseParams : Ext.apply({params:"state in ('1','2','3') order by sj_type desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true
	});
	var tmpGridXmdw = new Ext.grid.EditorGridPanel({
		        title:"项目单位报送情况",
				store : tmpStoreXmdw,
				cm : cmXmdw,
				sm : new Ext.grid.CheckboxSelectionModel({singleSelect : true}),
				border : false,
				layout : 'fit',
				height : 220,
				region : 'south',
				autoScroll : true, // 自动出现滚动条
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 10,
					store : tmpStoreXmdw,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
				
			});
	return tmpGridXmdw;
}

function checkHasBtn(gridTmp, type){
	try{
		if(gridTmp.getTopToolbar().items.get(type)){
			return true;
		}else{
			return false;
		}
	}catch(e){
		return false;
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
			else if(USERBELONGUNITTYPEID=="0")record=gridJt.getSelectionModel().getSelected();
			var uids=record.get('uids');
			Ext.getBody().mask("提交中……");
			PCBidDWR.updateState(uids,REALNAME,USERBELONGUNITNAME," ",USERBELONGUNITID,"3", function(flag){
				Ext.getBody().unmask();
				if(flag=="1"){
					Ext.example.msg('提示','操作成功');													
				}else{
					Ext.example.msg('提示','操作失败',2);													
				}
				if(USERBELONGUNITTYPEID=="2")gridXmdw.getStore().reload();
				else if(USERBELONGUNITTYPEID=="0")gridJt.getStore().reload();
			})
		}
	})
}

function verifyBack(){
	try{
		var rec = null;
		if(USERBELONGUNITTYPEID=="2") rec=gridXmdw.getSelectionModel().getSelected();
		else if(USERBELONGUNITTYPEID=="0")rec=gridJt.getSelectionModel().getSelected();
		if(rec){
			var winPanel = new BackWindow({
				doBack:function(reason){
					var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
					mask.show();
					PCBidDWR.updateState(rec.get('uids'),REALNAME,USERBELONGUNITNAME,reason,USERBELONGUNITID,"2", function(flag){
					mask.hide();
						if(flag=="1"){
							Ext.example.msg('提示','操作成功!');	
							win.hide();
						}else{
							Ext.example.msg('提示','操作失败!');										
						}
						if(USERBELONGUNITTYPEID=="2")gridXmdw.getStore().reload();
						else if(USERBELONGUNITTYPEID=="0")gridJt.getStore().reload();
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
	if(val!="") meta.attr = 'title="' + val + '"';
    return val;
}
var selectGrid=null;
function showEditWindow2(gridType, saveabled){
	if(!window[gridType]) return;
	SelectRecord = window[gridType].getSelectionModel().getSelected();
	selectGrid=gridType;
	if(SelectRecord.get('uids')==''){
		Ext.example.log("提示","请先保存此条记录");
		return
	}
	
	var reportParams;
	if(saveabled) {
		reportParams = {
			p_type:"ZTB_MONTH_REPORT",
			p_corp:SelectRecord.get('pid')+"/1",
			p_date:SelectRecord.get('sjType'),
			savable:saveabled,
			openCellType:'open',
			onCellOpened:onCellOpened,
			afterCellSaved:afterCellSaved,
			beforeCellSaved : beforeCellSaved
		};
	} else {
		reportParams = {
			p_type:"ZTB_MONTH_REPORT",
			p_corp:SelectRecord.get('pid')+"/1",
			p_date:SelectRecord.get('sjType'),
			savable:saveabled,
			openCellType:'open',
			onCellOpened:onCellOpened
		};
	}
	
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	window.showModalDialog(
			"/"+ROOT_CELL+"/cell/eReport.jsp",
			reportParams,"dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
}

var sign = {
	memoVar1:{label:'单位负责人',id:'memoVar1',column:'MEMO_VAR1'},
	memoVar2:{label:'统计负责人',id:'memoVar2',column:'MEMO_VAR2'},
	memoVar3:{label:'联系方式',id:'memoVar3',column:'MEMO_VAR3'},
	userId:{label:'填报人',id:'userId',column:'USER_ID'}
}
var CellDoc=null;
function onCellOpened(CellWeb1,win){
	if(!SelectRecord) return;
	var row,col;
	with(CellWeb1) {
			var maxCol = GetCols(0)
			var maxRow = GetRows(0)
			for( var c=1; c<maxCol; c++ ) {
				for( var r=1; r<maxRow; r++ ) {
					var cellStr = GetCellString(c, r, 0)
					if(cellStr.indexOf("table:")>-1) {
						col = c;
						row = r;
						break;
					}
				}
			}
	}
	if(col&&row){
		
		var sql = "select zb_seqno,unitname,unit_id from pc_bid_supervisereport_d where zb_seqno in " +
					"(select zb_seqno from pc_bid_supervisereport_d where sj_type='"+SelectRecord.get('sjType')+"' " +
					"and unit_id in (select unitid from (select unitid from sgcc_ini_unit where unit_type_id='A' "+
					"connect by prior unitid=upunit start with unitid='"+SelectRecord.get('pid')+"') where unitid in "+
					"(select pid from pc_bid_supervisereport_m where state='3' and sj_type='"+SelectRecord.get('sjType')+"' " +
                    ")) and zb_seqno is not null) and sj_type='" + SelectRecord.get('sjType') + "' order by unit_id asc,nvl(kbrq,'00000000') desc";
		if(selectGrid=='gridXmdw'){
			sql=" select zb_seqno, unitname, unit_id from pc_bid_supervisereport_d where sj_type='"+SelectRecord.get('sjType')+"' " +
					"and unit_id='"+SelectRecord.get('pid')+"' and zb_seqno is not null order by unit_id asc,nvl(kbrq,'00000000') desc";
		}
		baseDao.getData(sql,function(lt){
			var preUnitname = "";
			var startRow = row+1;
			if(lt.length>0) {
				for(var i=0;i<lt.length;i++){
					CellWeb1.InsertRow(row+1+i, 1, 0);
					CellWeb1.SetRowHeight(1, 25, row+1+i,0);
					CellWeb1.SetCellString(col,row+i+1,0,lt[i][0]+"/"+lt[i][2]);//混合报表
					if(col>1){
						var curUnitname = lt[i][1];
						CellWeb1.SetCellString(col-1,row+i+1,0,curUnitname);
						CellWeb1.SetCellAlign(col-1,row+i+1,0,4);
						CellWeb1.SetCellAlign(col-1,row+i+1,0,32);
						if(preUnitname==curUnitname){
							CellWeb1.MergeCells(col-1,startRow,col-1,row+1+i);
						}else{
							startRow = startRow+i;
							preUnitname = curUnitname;
						}
					} 
				}
			}
			
			CellDoc=new CellXmlDoc(CellWeb1);
			DWREngine.setAsync(false);
			pcTzglService.findDataByTableId("V_PC_BID_SUPERVISEREPORT_M","uids='"+SelectRecord.get('uids')+"'",function(masterRecord){
				if(masterRecord.USER_ID ==null)masterRecord.USER_ID=REALNAME;
				CellDoc.replaceSign(masterRecord);
			});
			DWREngine.setAsync(true);
			win.loadXMLData();
		})
	}
}
function afterCellSaved(CellWeb1){
	if(!SelectRecord) return;
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0){
		pcTzglService.updateDataByTableId("PC_BID_SUPERVISEREPORT_M", " uids='" + SelectRecord.get('uids') + "'", dataMap, function(){
			window[selectGrid].getStore().reload();
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