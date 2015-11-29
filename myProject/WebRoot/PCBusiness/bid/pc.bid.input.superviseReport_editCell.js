var Vbean = "com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM";         //年度投资视图bean
var Mbean = "com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM";          //年度投资主表bean
var bean2="com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanD"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var gridPanel=null;
var m_grid_record=null;
var editWin=null;
var dataExchangeFlag = "0";

Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var fm = Ext.form;
	
	var array_yearMonth=getYearMonthBySjType(null,null);
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v']
	});
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
				maxHeight:150,
				listeners:{
	       			'expand':function(){
	       				pcTzglService.sjTypeFilter(edit_pid,Mbean,function(arr){
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
		 new Ext.grid.RowNumberer(),
		 	{
				id : 'sjType',
				type : 'string',
				header : "月度",
				dataIndex : "sjType",
				width:80,
				align:'center',
				editor:yearMonthCombo,
				renderer:function(k){
					for(var i = 0;i<array_yearMonth.length;i++){
						if(k == array_yearMonth[i][0]){
							return array_yearMonth[i][1];
						}
					}
				}
			}, {
				id : 'title',
				type : 'string',
				header :"报表名称",
				width:240,
				align:'center',
				dataIndex : 'title',
				renderer:function(v){
						return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
				}
			}, {
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:80,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')}
			}, {
				id : 'memoVar1',
				type : 'string',
				header : '单位负责人',
				dataIndex : 'memoVar1',
				width : 80,
				hidden:true,
				align : 'center',
				editor : new Ext.form.TextField({name : 'memoVar1', allowBlank : true})
			}, {
				id : 'memoVar2',
				type : 'string',
				header : '统计负责人',
				hidden:true,
				width : 80,
				dataIndex : 'memoVar2',
				align : 'center',
				editor : new Ext.form.TextField({name : 'memoVar2', allowBlank : true})
			}, {
				id : 'userId',
				type : 'string',
				header : "填报人",
				width:80,
				dataIndex : 'userId',
				align:'center'
			}, {
				id : 'memoVar3',
				type : 'string',
				header : '联系方式',
				width : 80,
				hidden:true,
				dataIndex : 'memoVar3',
				align : 'center',
				editor : new Ext.form.TextField({name : 'memoVar3', allowBlank : true})
			}, {
				id : 'state',
				type : 'string',
				header :"上报状态",
				width:60,
				align:'center',
				dataIndex : 'state',
				renderer:stateRender
			}
	]);
	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'sjType',
				type : 'string'
			},{
				name : 'pid',
				type : 'string'
			},{
				name : 'unitId',
				type : 'string'
			},{
				name : 'title',
				type : 'string'
			},{
				name : 'billState',
				type : 'string'
			},{
				name : 'state',
				type : 'string'
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
				name : 'lastModifyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name:'backUser',
				type:'string'
			},{
				name : 'reason',
				type : 'string'
			},{
				name : 'memoVar1',
				type : 'string'
			},{
				name : 'memoVar2',
				type : 'string'
			},{
				name : 'memoVar3',
				type : 'string'
			},{
				name : 'verifyState',
				type : 'string'
			},{
				name : 'upUnitname',
				type : 'string'
			},{
				name : 'backDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'reportDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : Vbean,
			business : business,
			method : listMethod,
			outFilter : outFilter,
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

	ds.load({callback: function(){
		}});
		
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt= {uids:'',pid:edit_pid,sjType:'',unitId:'',title:'',billState:'',state:'0',
					memo:'',userId:REALNAME,createDate:new Date(),lastModifyDate:'',memoVar1:'',memoVar2:'',memoVar3:'',reportDate:''}
	
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
		loadMask : true, // 加载时是否显示进度
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
			if(gridPanel.getTopToolbar().items.get('add')) gridPanel.getTopToolbar().items.get('add').disable();
			if(gridPanel.getTopToolbar().items.get('save')) gridPanel.getTopToolbar().items.get('save').disable();
			if(gridPanel.getTopToolbar().items.get('del')) gridPanel.getTopToolbar().items.get('del').enable();
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
							codes[codes.length] = m
						}
						var mrc = codes.length
						if (mrc > 0) {
							var ids = codes.join(",");
							gridPanel.doDelete(mrc, ids)
						} else {
							ds.reload();
						}
						if(gridPanel.getTopToolbar().items.get('add')) gridPanel.getTopToolbar().items.get('add').enable();
						if(gridPanel.getTopToolbar().items.get('del')) gridPanel.getTopToolbar().items.get('del').disable();
					}
				}, gridPanel);
			}
		},
		listeners:{
			'aftersave':function(grid, idsOfInsert, idsOfUpdate, _primaryKey,  _bean){
				if(m_grid_record)
					m_grid_record.set('uids',idsOfInsert);
				if(checkHasBtn(grid,'add')) grid.getTopToolbar().items.get('add').enable();
				if(checkHasBtn(grid,'save')) grid.getTopToolbar().items.get('save').disable();
				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
			},
			'render':function(grid){
				if(checkHasBtn(grid,'del'))  grid.getTopToolbar().items.get('del').disable();
				if(checkHasBtn(grid,'save'))  grid.getTopToolbar().items.get('save').disable();
			},
			'afterdelete':function(grid, ids){
				if(checkHasBtn(grid,'add')) grid.getTopToolbar().items.get('add').enable();
				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
			},
			'rowclick' : function(grid, rowIndex, e){
        		record = grid.getSelectionModel().getSelected();
        		if(record){
        			if(record.get('state')=="0"||record.get('state')=="2")
        			{
        				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').enable();
        				if(checkHasBtn(grid,'report'))Ext.getCmp('report').enable();
        			}
        			else
        			{	
        				if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
        				if(checkHasBtn(grid,'report'))Ext.getCmp('report').disable();
        			}
        		}else{
					if(checkHasBtn(grid,'del')) grid.getTopToolbar().items.get('del').disable();
        		}
        	},
        	'beforeedit':function(e){
        		if(e.record.get('state')=='1')return false;
        	},
        	'afteredit':function(o){
        		if(checkHasBtn(gridPanel,'save'))  gridPanel.getTopToolbar().items.get('save').enable();
        		if(o.field==="sjType"){
        			var display_value="";
        			for(var i = 0;i<array_yearMonth.length;i++){
						if(o.value == array_yearMonth[i][0]){
							display_value=array_yearMonth[i][1];
						}
					}
        			o.record.set("title",CURRENTAPPNAME+display_value+"招标(合同)月度报表");
        		}
        	}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : Mbean,
		business : business,
		primaryKey : primaryKey
	});


	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});
	if(ModuleLVL<3){
		gridPanel.getTopToolbar().addButton({
				id:'report',
				text: '上报',
				iconCls: 'upload',
				handler:reportFn
		});
	}
	
//--------方法
	function reportFn(){
		var m_record=gridPanel.getSelectionModel().getSelected();
		if(m_record==null) return;
		for(var i in sign){
			if(Ext.isEmpty(m_record.get(sign[i].id))){
				alert("'"+sign[i].label+"'  不能为空! 请在报表中填写完整。");
				return;
			}
		}
		var sjType = m_record.get('sjType');
		var sql = "select count(*) from pc_bid_supervisereport_d where sj_type='"+sjType+"' and unit_id='"+m_record.get('pid')+"'";
		baseDao.getData(sql,function(list){
			if(list[0]==0){
 				Ext.Msg.confirm('提示', '招标内容为空，是否上报?', function(btn,text) {
								if (btn == "no") {
									return;
								}else if(btn=="yes"){
									reportConfirm(m_record);//招标内容为空时也上报
								}
 				});
			}else{
				reportConfirm(m_record);//招标内容不为空时
			};
		});
	}
	
});
function reportConfirm(m_record){
	  var hql="from PcBidSupervisereportM t where t.sjType='"+m_record.get('sjType')+"' and t.pid='"+edit_pid+"'";
	  baseDao.findByHql(hql,function(list){
			if(list[0].flagNull == '1'){
			   alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】");     
			}else{ 
			   Ext.Msg.confirm('确认', '上报后将不可修改，确认要上报吗？', function(btn,text) {
					if (btn == "yes") {
						DWREngine.setAsync(false);
						var selectRecords = gridPanel.getSelectionModel().getSelected();
						if(selectRecords){
							var uids=selectRecords.get('uids');
							Ext.getBody().mask();
							PCBidDWR.misToLev2OfSuperviseReport(uids,edit_pid,defaultOrgRootID,REALNAME, dataExchangeFlag, function(flag){
								Ext.getBody().unmask();
								if(flag==1){
									Ext.example.msg('','操作成功！')
									gridPanel.store.reload();//刷新页面
									gridPanel.getTopToolbar().items.get('del').disable();
									gridPanel.getTopToolbar().items.get('report').disable();
								}else{
									Ext.example.msg('','操作失败！',2)
								}
							});
						}			
					}
				}, this);	      
			}
      })	
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

function reasonRender(val,meta,rec,rInx,cInx,store){
	if(val!="") meta.attr = 'title="' + val + '"';
    return val;
}

function showEditWindow2(){
	var m_record=gridPanel.getSelectionModel().getSelected();
	if(!m_record) return;
	if(m_record.get('uids')==''){
		Ext.example.msg("提示","请先保存此条记录");
		return
	}
	var savable=true;
	if(m_record.get('state')=="1"||m_record.get('state')=="3"){
		savable=false;
	}

	var reportParams = {
		p_type:"ZTB_MONTH_REPORT",
		pid : m_record.get('pid'),
		sjType : m_record.get('sjType'),
		savable : savable,
		rec : m_record,
		gridPanel : gridPanel
	};
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	window.showModalDialog(
			CONTEXT_PATH + "/PCBusiness/bid/pc.bid.input.superviseReport_editCell_cell.jsp",
			reportParams,"dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
}

var sign = {
	memoVar1:{label:'单位负责人',id:'memoVar1',column:'MEMO_VAR1'},
	memoVar2:{label:'统计负责人',id:'memoVar2',column:'MEMO_VAR2'},
	memoVar3:{label:'联系方式',id:'memoVar3',column:'MEMO_VAR3'},
	userId:{label:'填报人',id:'userId',column:'USER_ID'}
}