var gridJit,grid2Qiy,gridXmdw,curMonth=(new Date()).getYear()+((new Date()).getMonth()+101+"").substring(1);
var edit_unitid=USERBELONGUNITID;
if(USERBELONGUNITTYPEID=="0"){
	edit_unitid = "103";
}
var reportId;
var sendBackFlag='0';
var comBaseParams = {
	ac : 'list', // 表示取列表
	bean : 'com.sgepit.pcmis.jdgk.hbm.VPcJdgkReport',
	business : 'baseMgm',
	method : 'findWhereOrderby'
};
var comColums = [
	{name : 'uids',type : 'string'}, 
	{name : 'pid',type : 'string'}, 
	{name : 'createperson',type : 'string'}, 
	{name : 'createdate',type : 'date', dateFormat : 'Y-m-d H:i:s'}, 
	{name : 'reportDate',type : 'date', dateFormat : 'Y-m-d H:i:s'}, 
	{name : 'reportname',type : 'string'}, 
	{name : 'state',type : 'string'	}, 
	{name : 'sjType',type : 'string'}, 
	{name : 'reason',type : 'string'}, 
	{name : 'backUser',type : 'string'}, 
	{name : 'unitTypeId',type : 'string'}, 
	{name : 'unitUsername',type : 'string'}, 
	{name : 'countUsername',type : 'string'}, 
	{name : 'createpersonTel',type : 'string'}, 
	{name : 'unitname',type : 'string'}
]
Ext.onReady(function(){
	//当前用户为集团公司用户
	if(USERBELONGUNITTYPEID=="0"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [gridJit = createGridJit()]
		});
		gridJit.store.baseParams.params = "unitTypeId='2' and state in ('1','2','3')"
		gridJit.store.load();
	}else if(USERBELONGUNITTYPEID=="2"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [grid2Qiy = createGrid2Qiy(),gridXmdw=createGridXmdw()]
		});
		grid2Qiy.store.baseParams.params = "pid = '"+USERBELONGUNITID+"' order by sj_type desc"
		grid2Qiy.store.load({params:{limit:10,start:0}});

		grid2Qiy.getSelectionModel().on('rowselect',function(_sm,inx,rec){
			DWREngine.setAsync(false);
				systemMgm.getPidsByUnitid(rec.get('pid'),function(lt){
					var pids = "''";
					for(var i=0,j=lt.length;i<j;i++){
						pids+=",'"+lt[i].unitid+"'"
					}
					if(rec.get('state')=='2'){sendBackFlag='2';}else{sendBackFlag='0';}			
					gridXmdw.store.baseParams.params = "pid in ("+pids+") and state in ('1','2','3') and sj_type = '"+rec.get('sjType')+"'";
					gridXmdw.store.load({callback: function(){
						if(gridXmdw.store.getTotalCount!=lt.length)
						{
							//grid2Qiy.getTopToolbar().disable();			
						}
					}});
				})
			DWREngine.setAsync(true);
			
			if(rec.get('state')=='1' || rec.get('state')=='3')
			{
				grid2Qiy.getTopToolbar().disable();
			}
			else
			{
				grid2Qiy.getTopToolbar().enable();;
			}
		})
	}
});
//集团
function createGridJit(config){
	var array_level2Unit=new Array();
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
	var	level2UnitCombo=new Ext.form.ComboBox({
			width:200,listWidth:200,
			store:new Ext.data.SimpleStore({fields: ['k', 'v'],data: array_level2Unit}),
        	displayField:'v',  valueField:'k',
        	editable:false,   mode: 'local',
        	triggerAction: 'all',
        	emptyText:"请选择...",
       		selectOnFocus:true,
       		value: edit_unitid,
       		listeners:{
				select:function(cb,rec,inx){
					gridJit.store.baseParams.params = "unitTypeId='2' and state in('1','2','3') and pid = '"+rec.get('k')+"' order by sjType desc"
					gridJit.store.load();
				}
			}
		});
	var tmpJitStroe = new Ext.data.Store({
				baseParams : Ext.apply({},comBaseParams),
				proxy : getProxy(),
				reader : getReader(comColums),
				remoteSort : true,
				pruneModifiedRecords : true
		});	
		
	var tmpGridJit = new Ext.grid.GridPanel(Ext.apply({
		region:'center',
		height:300,
		tbar:[level2UnitCombo],
		columns:[
			new Ext.grid.RowNumberer()
			,{
				header : '报表名称',dataIndex :'reportname',width:230,renderer:comRender,align: 'left'
			},{
				header : '填报人', width:80, dataIndex :'createperson',align: 'center'
			},{
				header : '填报日期', width:60, dataIndex :'createdate',renderer:Ext.util.Format.dateRenderer('Y-m-d'),align: 'center'
			},{
				header : '状态/审核', width:100, align:'center',	dataIndex :'state',	renderer:stateRender.createDelegate()
			}
		],
		sm:new Ext.grid.RowSelectionModel({}),
		store:tmpJitStroe,
		bbar:getBbar(tmpJitStroe),
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	},config));
	tmpGridJit.store.sort('sjType','DESC');
	return tmpGridJit;
};
//二级企业
function createGrid2Qiy(config){
	var tmpStore2Qy = new Ext.data.Store({
				baseParams : Ext.apply({params:"pid = '" + USERBELONGUNITID + "'"},comBaseParams),
				proxy : getProxy(),
				reader : getReader(comColums),
				remoteSort : true,
				pruneModifiedRecords : true
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
								//alert("'"+sign[i].label+"'为必填项");
								//return;
							}
						}	
                        /*
						Ext.Msg.confirm('提示','是否上报？',function(flag){
							if(flag=="yes"){
								var uids=record.get('uids');
								var pid =record.get('pid');
								var log = getLogSQL(pid,uids,"    ","上报");
								var up= getStateSQL("1",uids);
								
								var excHbm=new Object();
								excHbm.pid=pid;
								excHbm.spareC2=log;
								excHbm.spareC5=USERBELONGUNITID;
								excHbm.bizInfo="二级企业进度月度报表上报"
								excHbm.sqlData=up
								
								Ext.getBody().mask("提交中……");
								baseDao.updateByArrSQL([up,log],function(success){
									Ext.getBody().unmask();
									if(success){
										record.set("state","1");
										record.commit();
										Ext.example.msg('提示','操作成功!');
									}else{
										Ext.example.msg('提示','操作失败!');
									}
								})
							}
						})
                        */
                        DWREngine.setAsync(false);
                        //调整为二级公司不需要在上报到集团，直接可以审核通过
                        var count = gridXmdw.store.getTotalCount();
                        var pass = true;
                        for (var m = 0; m < count; m++) {
                            var rec1 = gridXmdw.store.getAt(m);
                            if(rec1.get('state') != '3'){
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
					header : '月度',	width:60,dataIndex :'sjType',renderer:sjTypeRender.createDelegate(),align: 'center'
				},{
					header : '报表名称',	width:200,dataIndex :'reportname',renderer: comRender,align: 'left'
				},{
					header : '填报人', width:100, dataIndex :'createperson',	align: 'center'
				},{
					header : '填报日期', width:80, dataIndex :'createdate',renderer:Ext.util.Format.dateRenderer('Y-m-d'),align: 'center'
				},{
					header : '报送状态', width:80, align:'center',	dataIndex :'state',	
					renderer:function(value,meta,record){
						var renderStr="";
						if(value=="0") return "<font color=gray>未上报</font>";
						if(value=="1") renderStr="<font color=black>已上报</font>";
						if(value=="2") renderStr="<font color=red>退回重报</font>";
						if(value=="3") renderStr="<font color=blue>审核通过</font>";
						return "<a title='点击查看详细信息' " +
								"href='javascript:void(0)' onclick='showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>" +
								""+renderStr+"</a>";
					}
				}
		],
		sm:new Ext.grid.RowSelectionModel({singleSelect : true}),
		store:tmpStore2Qy,
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 10,
			store : tmpStore2Qy,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	},config));
	return tmpGrid2Qity;
}
//项目单位
function createGridXmdw(config){
	var tmpGridXmdw = new Ext.grid.GridPanel({
			region : 'south',
			height:240,
			title:'项目单位报送情况',
			store:new Ext.data.Store({
				baseParams : Ext.apply({},comBaseParams),
				proxy : getProxy(),
				reader : getReader(comColums),
				remoteSort : true,
				pruneModifiedRecords : true
			}),
			columns:[
				new Ext.grid.RowNumberer(),
				{
					header : '月度',	width:60,dataIndex :'sjType',renderer:sjTypeRender.createDelegate(),align: 'center'
				},{
					header : '报表名称',	width:200,dataIndex :'reportname',renderer: comRender,align: 'left'
				},{
					header : '填报人', width:100, dataIndex :'createperson',	align: 'center'
				},{
					header : '填报日期', width:80, dataIndex :'createdate',renderer:Ext.util.Format.dateRenderer('Y-m-d'),align: 'center'
				},{
					header : '状态/审核', width:80, align:'center',	dataIndex :'state',	renderer:stateRender.createDelegate()
				}
			],
			sm:new Ext.grid.RowSelectionModel({singleSelect : true}),
			loadMask : true, // 加载时是否显示进度
			viewConfig : { forceFit : true,	ignoreAdd : true}
		});
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
	var renderStr="", op="";
	var _pid=record.get('pid'),_uids=record.get('uids');
	if(value=="0"){
		return "<font color=gray>未上报</font>";
	}else if(value=="1") {
		var imgDel="";
		var imgOk="";
		if(ModuleLVL<3){
			imgDel="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/sendBack2.png' title='退回'  onclick='verifyBack()'>";
			imgOk ="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/pass2.png' title='通过' onclick='verifyPass()'>";
		}
		renderStr="<font color=black>未审核</font>";
		op=imgOk+imgDel;
	}else if(value=="2"){
		renderStr="<font color=red>退回重报</font>";
	}else if(value=="3"){
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
	return "<a title='点击查看详细信息'  " +
			"href='javascript:void(0)' onclick='showReportLog(\""+_pid+"\",\""+_uids+"\")'>"+renderStr+"</a>"+op;
}
//操作日志
function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
//退回
function verifyBack(){
		var rec = null;
		if(USERBELONGUNITTYPEID=="2") 
			rec=gridXmdw.getSelectionModel().getSelected();
		else if(USERBELONGUNITTYPEID=="0")
			rec=gridJit.getSelectionModel().getSelected();
		else
			return;
		if(rec){
			var winPanel = new BackWindow({
				doBack:function(reason){
					var uids=rec.get('uids');
					var pid =rec.get('pid');
					var log = getLogSQL(pid,uids,reason,"退回重报");
					var back= getStateSQL("2",uids);
					
					var excHbm=new Object();
					excHbm.pid=pid;
					excHbm.spareC2=log;
					excHbm.spareC5=USERBELONGUNITID;
					excHbm.bizInfo="项目单位进度月度报表退回"
					excHbm.sqlData=back;
					
					
					var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
					if(USERBELONGUNITTYPEID=="2"){//二级企业退回项目单位,需要判断是否进行数据交互
						mask.show();
						pcDataExchangeService.sendExcData(excHbm, [back,log],function(success){
							mask.hide();
							if(success){
								rec.set("state","2");
								rec.commit();
								Ext.example.msg('提示','操作成功!');
								win.hide();
							}else{
								Ext.example.msg('提示','操作失败!');
							}
						})
					}else if(USERBELONGUNITTYPEID=="0"){//集团退回二级企业，不需要数据交互判断
						mask.hide();
						baseDao.updateByArrSQL([back,log],function(success){
							mask.hide();
							if(success){
								rec.set("state","2");
								rec.commit();
								Ext.example.msg('提示','操作成功!');
								win.hide();
							}else{
								Ext.example.msg('提示','操作失败!');
							}
						})
					}
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
					title:'报表操作日志',
					xtype : 'panel',
					html : '<iframe name="bidDetailFrame" src="'+CONTEXT_PATH+ 
					'/PCBusiness/bid/pc.businessBack.log.jsp?edit_pid='+rec.get('pid')+'&edit_uids='+rec.get('uids')
					+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				}]
			});
			win.show();
		}
}
//审核通过
function verifyPass(p){
	Ext.Msg.confirm('提示','您是否确认要"审核通过"此条记录？',function(txt){
		if(txt=='yes'){
			var record=null;
			if(USERBELONGUNITTYPEID=="2"){//二级企业审核项目单位,需要判断是否进行数据交互
				record=gridXmdw.getSelectionModel().getSelected();
			}else if(USERBELONGUNITTYPEID=="0"){//集团审核二级企业，不需要数据交互判断
				record=gridJit.getSelectionModel().getSelected();
			}else{
				return;
			}
            if( p == 0){
                record=grid2Qiy.getSelectionModel().getSelected();
            }
			var uids=record.get('uids');
			var pid =record.get('pid');
			var log = getLogSQL(pid,uids,"    ","审核通过");
			var pass= getStateSQL("3",uids);
			
			var excHbm=new Object();
			excHbm.pid=pid;
			excHbm.spareC2=log;
			excHbm.spareC5=USERBELONGUNITID;
			excHbm.bizInfo="项目单位进度月度报表审核通过"
			excHbm.sqlData=pass
			
			
			if(USERBELONGUNITTYPEID=="2"){//二级企业审核项目单位,需要判断是否进行数据交互
				Ext.getBody().mask("提交中……");
				pcDataExchangeService.sendExcData(excHbm, [pass,log],function(success){
					Ext.getBody().unmask();
					if(success){
						record.set("state","3");
						record.commit();
						Ext.example.msg('提示','操作成功!');
					}else{
						Ext.example.msg('提示','操作失败!');
					}
				})
			}else if(USERBELONGUNITTYPEID=="0"){//集团审核二级企业，不需要数据交互判断
				Ext.getBody().mask("提交中……");
				baseDao.updateByArrSQL([pass,log],function(success){
					Ext.getBody().unmask();
					if(success){
						record.set("state","3");
						record.commit();
						Ext.example.msg('提示','操作成功!');
					}else{
						Ext.example.msg('提示','操作失败!');
					}
				})
			}
		}
	})
}
//集团审查二级企业报表
//cell报表的过滤条件:二级公司审核通过的项目，并且所在的二级公司汇总表主记录已上报至集团

function comRender(v, m, r){
	var v_reportId = r.get("uids");
	var pcorp = r.get('pid');
	var sjType = r.get('sjType');
	var v_unitTypeId = r.get('unitTypeId');
	var v_state = r.get('state');
	
	var p_type = '';  		//进度填报或展示的模板类型
	
	
	if(v_unitTypeId=='2') {//二级公司报表
		p_type="XMJD_MONTH_REPORT_2";
		if(USERBELONGUNITTYPEID=="0"){//当前用户是集团用户
			if(v_state=="0"){//二级公司未上报，集团用户不可以打开报表
				return v;
			}else{
				return "<a href='javascript:void(0)' onclick=showContent(\""+p_type+"\",\""+pcorp+"\",\""+sjType+"\",\""+v_state+"\",\""+v_reportId+"\")>"+v+"</a>";
			}
		}else{
			return "<a href='javascript:void(0)' onclick=showContent(\""+p_type+"\",\""+pcorp+"\",\""+sjType+"\",\""+v_state+"\",\""+v_reportId+"\")>"+v+"</a>";
		}
	} else if(v_unitTypeId=='A') {//项目单位
		p_type="XMJD_MONTH_REPORT";
		return "<a href='javascript:showContent(\""+p_type+"\",\""+pcorp+"\",\""+sjType+"\",\""+v_state+"\",\""+v_reportId+"\")'>"+v+"</a>";
	}
}	

function showContent(p_type, pcorp, sjType, v_state, v_reportId) {
	reportId = v_reportId;
	var unitfilter = (USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="2")?getFile("Filter_Jdgk.java"):"";
	var savable=false;
	if(USERBELONGUNITTYPEID=='0') savable=false;
	else if(v_state=='0' || v_state=='2') savable=true;
	var reportParams = {
		p_type:p_type,
		p_corp:pcorp,
		p_date:sjType,
		p_inx:"1",
		savable: savable,
		openCellType:'open',
		onCellOpened:onCellOpened,
		afterCellSaved: afterCellSaved,
		beforeCellSaved:beforeCellSaved,
		p_unitfilter:unitfilter
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
	if(grid2Qiy&&(reportParams.savable)) {
		grid2Qiy.getStore().reload();
	}
}
//打开报表时，写入备注字段
var CellDoc=null;
function onCellOpened(CellWeb1){
	CellDoc=new CellXmlDoc(CellWeb1);
	if(reportId){
		pcTzglService.findDataByTableId("v_pc_jdgk_report","uids='"+reportId+"'",function(data){
//			alert(Ext.encode(data));
			if(data.CREATEPERSON ==null)data.CREATEPERSON=REALNAME;
			CellDoc.replaceSign(data);
		});
	}
}
//报表保存的时候，只保存填写的备注字段的数据。
function afterCellSaved(CellWeb1){
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0&&reportId){
		pcTzglService.updateDataByTableId("pc_edo_report_input", " uids='" + reportId + "'", dataMap, function(b){
			//jdGrid.getStore().load();
		});
	}
}
function getLSH(){
	var date = new Date()
	var s = date.getYear()
		+ (date.getMonth()+101+"").substring(1)
		+ (date.getDate()+100+"").substring(1)
		+ (date.getHours()+100+"").substring(1)
		+ (date.getMinutes()+100+"").substring(1)
		+ (date.getSeconds()+100+"").substring(1)
		+ (date.getMilliseconds()+1000+"").substring(1)
		+ (Math.random()*1000+1000).toFixed(0).substring(1)
	return s
}
//操作日志sql，可以是退回，也可以是审核通过
function getLogSQL(pid,uids,backReason,type){
	var logsql = "insert into pc_busniess_back (uids,pid,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason) " +
				  "values ('"+getLSH()+"','"+pid+"','"+uids+"','"+REALNAME+"'," +
				  "to_date('"+(new Date()).format('Ymd His')+"','yyyymmdd hh24miss'),'"+type+"','"+type+"','"+USERBELONGUNITNAME+"','"+backReason+"')";
	return 	logsql;		  
}
function getStateSQL(state,uids){
	return "update pc_edo_report_input set state='"+state+"' where uids='"+uids+"'";
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