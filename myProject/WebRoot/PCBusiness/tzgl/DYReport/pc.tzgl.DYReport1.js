var bean =null;
var bean2=null;
var typeOfTitle=null;
var sqlOfTable=null;
if(dyreportType==1){
	var bean ="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1M";
	var Vbean = "com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport1M"   //投资完成视图bean
	var bean2="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1D";
	var typeOfTitle=CURRENTAPPNAME+"电源固定资产投资完成情况月报";
	var sqlOfTable="PC_TZGL_DYREPORT1_M";
}
if(dyreportType==2){
	var bean ="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2M";
	var Vbean = "com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport2M"     //建设规模和新增生产能力视图bean
	var bean2="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2D";
	var typeOfTitle=CURRENTAPPNAME+"电源项目建设规模和新增生产能力月报";
	var sqlOfTable="PC_TZGL_DYREPORT2_M";
}
if(dyreportType==3){
	var bean ="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3M";
	var Vbean = "com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport3M"    //资金到位情况视图bean
	var bean2="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3D";
	var typeOfTitle=CURRENTAPPNAME+"电源固定资产投资本年资金到位情况";
	var sqlOfTable="PC_TZGL_DYREPORT3_M";
}
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";
var edit_pid=CURRENTAPPID;
var gridPanel=null;
var formPanel=null;
var editWin=null;
Ext.onReady(function() {
	
	var sm = new Ext.grid.CheckboxSelectionModel({
				header: '',
				singleSelect : true
			})
			
	//月报使用的下拉框store		
	var array_yearMonth=getYearMonthBySjType(null,null);
	//年报使用年作为combo的下拉框store
	var array_year =getYearBysjType(null,null);
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v']
	});
	
	//月报, 让dscombo加载array_yearMonth, 如果是年报加载array_year
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
				allowBlank : false,
				hiddenValue:true,
				listeners:{
	       			'expand':function(){
	       				pcTzglService.sjTypeFilter(edit_pid,bean,function(arr){
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
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		sm,{
				id : 'uids',
				type : 'string',
				header : "主键",
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : "项目编码",
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'sjType',
				type : 'string',
				header : '月度',
				width:60,
				dataIndex : "sjType",
				align:'center',
				editor:yearMonthCombo,
				renderer:function(k){
					if(k&&(k.length==4||k.length==6)){
						if(k.length==6){
							return k.substring(0,4)+"年"+k.substring(4,6)+"月";
						}else{
							return k+"年";
						}
					}else{
						return "";
					}
				}
			}, {
				id : 'title',
				type : 'string',
				header :"报表名称",
				width:200,
				align:'center',
				dataIndex : 'title',
				renderer:function(v){
						return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
				}
			}, {
				id : 'userId',
				type : 'string',
				header : "填报人",
				width:60,
				align:'center',
				dataIndex : 'userId'
			},{
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:80,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			
			},  {
				id : 'state',
				type : 'float',
				header :"上报状态",
				width:40,
				align:'center',
				dataIndex : 'state',
				renderer:stateRender
			},{
				id : 'flagNull',
				type : 'string',
				header : '报表是否填写完整',
				hidden : true,
				dataIndex : 'flagNull'
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'pid',
				type : 'string'
			},{
				name : 'unitId',
				type : 'string'
			},{
				name : 'sjType',
				type : 'string'
			},{
				name : 'unitId',
				type : 'string'
			},{
				name : 'title',
				type : 'string'
			},{
				name : 'billState',
				type : 'float'
			},{
				name : 'state',
				type : 'float'
			},{
				name : 'memo',
				type : 'string'
			},{
				name : 'userId',
				type : 'string'
			},{
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'memoNumber1',
				type : 'float'
			},{
				name : 'memoNumber2',
				type : 'float'
			},{
				name : 'memoNumber3',
				type : 'float'
			},{
				name : 'memoVarchar1',
				type : 'string'
			},{
				name : 'memoVarchar2',
				type : 'string'
			},{
				name : 'memoVarchar3',
				type : 'string'
			},{
				name : 'memoDate1',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'memoDate2',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'flagNull',
				type : 'string'
			},
			
			//新增字段
			{
				name : 'reason',
				type : 'string'
			}];
/**
 * 创建数据源
 */
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : Vbean,
			business : business,
			method : listMethod,
			params : "pid='"+edit_pid+"' order by sjType desc" 
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
		});
		ds.load();

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt= {uids:'',pid:edit_pid,sjType:'',unitId:edit_pid,title:'',billState:'',state:'0',flagNull:'1',
					memo:'',userId:REALNAME,createDate:new Date(),memoNumber1:'',memoNumber2:'',
					memoNumber3:'',memoVarchar1:'',memoVarchar2:'',memoVarchar3:'',memoDate1:'',memoDate2:''}
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		insertHandler:function(){
			gridPanel.defaultInsertHandler();
			gridPanel.getTopToolbar().items.get('add').disable();
			gridPanel.getTopToolbar().items.get('save').disable();
			gridPanel.getTopToolbar().items.get('del').enable();
		},
		deleteHandler:function(){
			var sm = gridPanel.getSelectionModel();
			var ds = gridPanel.getStore();
			if (sm.getCount() > 0) {
				Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
						text) {
					if (btn == "yes") {
						var records = sm.getSelections()
						var codes = []
						for (var i = 0; i < records.length; i++) {
							var m = records[i].get(gridPanel.primaryKey)
							if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
								continue;
							}
							codes[codes.length] = m;
							if(records[i].get('sjType')!="" && records[i].get('unitId')!=""){
								var hql="delete from "+bean2+" where sjType='"+records[i].get('sjType')+"' and unitId='"+records[i].get('unitId')+"'";
								baseDao.executeHQL(hql);
							}
						}
						var mrc = codes.length
						if (mrc > 0) {
							var ids = codes.join(",");
							gridPanel.doDelete(mrc, ids)
						} else {
							ds.reload();
						}
						gridPanel.getTopToolbar().items.get('add').enable();
						gridPanel.getTopToolbar().items.get('del').disable();
					}
				}, gridPanel);
			}
		},
		listeners:{
			'aftersave':function(grid, idsOfInsert, idsOfUpdate, _primaryKey,  _bean){
				if(grid.getTopToolbar().items.get('add')) grid.getTopToolbar().items.get('add').enable();
				if(grid.getTopToolbar().items.get('save')) grid.getTopToolbar().items.get('save').disable();
				if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').disable();
			},
			'render':function(grid){
				if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').disable();
				if(grid.getTopToolbar().items.get('save')) grid.getTopToolbar().items.get('save').disable();
			},
			'afterdelete':function(grid, ids){
				if(grid.getTopToolbar().items.get('add')) grid.getTopToolbar().items.get('add').enable();
				if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').disable();
				if(grid.getTopToolbar().items.get('report')) grid.getTopToolbar().items.get('report').disable();
			},
			'rowclick' : function(grid, rowIndex, e){
        		var m_grid_record = grid.getSelectionModel().getSelected();
        		if(m_grid_record){
        			if(m_grid_record.get('state')==0||m_grid_record.get('state')==2){
        				if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').enable();
        				if(grid.getTopToolbar().items.get('report')) grid.getTopToolbar().items.get('report').enable();
        			}else {
        			 	if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').disable();
        			 	if(grid.getTopToolbar().items.get('report')) grid.getTopToolbar().items.get('report').disable();
        			}	
        		}else{
					if(grid.getTopToolbar().items.get('del')) grid.getTopToolbar().items.get('del').disable();	
					if(grid.getTopToolbar().items.get('report')) grid.getTopToolbar().items.get('report').disable();
        		}
        	},
        	'beforeedit':function(e){
        		if(e.record.get('state')==1)return false;
        		else{
        			if(gridPanel.getTopToolbar().items.get('report')) gridPanel.getTopToolbar().items.get('report').disable();
        		}
        		if(e.record.isNew!==true) return false;
        	},
        	'afteredit':function(o){
        		if(o.grid.getTopToolbar().items.get('save')) o.grid.getTopToolbar().items.get('save').enable();
        		if(o.field==="sjType"){
        			var display_value="";
        			var sj=o.value;
        			if(sj&&(sj.length==4||sj.length==6)){
        				if(sj.length==4){
        					o.record.set("title",sj+"年"+typeOfTitle);
        				}else{
        					o.record.set("title",sj.substring(0,4)+"年"+sj.substring(4,6)+"月"+typeOfTitle);
        				}
        			}
        		}
        	}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	


	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});
   	gridPanel.getTopToolbar().addButton({
		id:'report',
		text: '上报',
		iconCls: 'upload',
		disabled:true,
		handler:reportFn
	});

	
	function reportFn(){
		var m_record=gridPanel.getSelectionModel().getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});		
		if(m_record==null)
		{
			Ext.example.msg('提示','请选中一条记录!');
			return;
		}
		var unitId=m_record.get('unitId');
		var sjType=m_record.get('sjType');
		var flag=false;
		var flagNull = m_record.get('flagNull');
		if(flagNull != '0'){
			alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】");
			return false;
		}
		DWREngine.setAsync(false);
		baseDao.findByWhere2(bean2,"unitId='"+unitId+"' and sjType='"+sjType+"'",function(list){
			if(list.length>0)flag=true;
		});
		if(flag){
			Ext.MessageBox.confirm('确认', '上报后将不可修改，确认要上报吗？', function(btn,
					text) {
				if (btn == "yes") {
					var selectRecords = gridPanel.getSelectionModel().getSelected();
					var uids="";
					if(selectRecords !=""){
							var reportStatus = selectRecords.get('state')
							if(reportStatus !=1){
								uids=selectRecords.get('uids');
								//var sql = "update "+sqlOfTable+" set STATE=1 where uids='"+uids+"'";		
								//baseDao.updateBySQL(sql);
								
								myMask.show();
								pcTzglService.mis2jtOfDYReport(uids,edit_pid,dyreportType,edit_pid,defaultOrgRootID,REALNAME,function(flag){
								myMask.hide();
									if(flag=="1"){
										Ext.example.msg('','操作成功！');
										gridPanel.store.reload();
									}else{
										Ext.example.msg('','操作失败！',2);
									}
								});
							}
					}			
				
					gridPanel.getStore().reload();
				}
			}, this);
		}else{
			alert("报表未录入，不可上报，请先录入！");
			showEditWindow2();
		}
		DWREngine.setAsync(true);	
	}
});

function stateRender(value,meta,record){
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

function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}  

function showEditWindow2(){
	var m_record=gridPanel.getSelectionModel().getSelected();
	if(m_record.get('uids')==''){
		alert("请先保存此条记录");
	}else{
		if(dyreportType==1){
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.report.jsp",
					m_record,"dialogWidth:830px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
		}else if(dyreportType==2){
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport2.report.jsp",
					m_record,"dialogWidth:1020px;dialogHeight:520px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
		}else if(dyreportType==3){
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport3.report.jsp",
					m_record,"dialogWidth:1020px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
		}
		gridPanel.getStore().reload();
	}
}

