var grid2Qiy,lvl2TreePanel,jtTreePanel,treePanel;
var Vbean = "com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM";      
var Mbean = "com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM";      
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var m_grid_record;
var curSjStr,curSjType="",nowPID=USERBELONGUNITID;
var comBaseParams = {
	ac : 'list', // 表示取列表
	bean : 'com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM',
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
var comColums = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'pid',
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
			}];
Ext.onReady(function(){
	//当前用户为集团公司用户
	if(USERBELONGUNITTYPEID=="0"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [jtTreePanel = createjtTreePanel()]
		});
	}else if(USERBELONGUNITTYPEID=="2"){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [grid2Qiy = createGrid2Qiy(),lvl2TreePanel=treePanel=createTreePanel()]
		});
		grid2Qiy.store.sort('sjType','DESC');
		grid2Qiy.store.load({params:{limit:10,start:0}});
	}
});

//集团月报
function createjtTreePanel(){
	var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	var sjArr=new Array();
	var curDate = new Date();
	var curYear=curDate.getFullYear()+0;
	for(var i =curYear ; i >=2007 ; i--) {
		for(j=0;j<12;j++){
			sjArr.push([i+months[j],i+"年"+months[j]+"月"]);
		}			
	}
	curSjType=curYear + months[curDate.getMonth()];
	nowPID="0";
	var monthCombo = new Ext.form.ComboBox({
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			triggerAction : 'all',
			store : new Ext.data.SimpleStore({fields:['k','v'],data:sjArr}),
			width : 100,
			editable:false,
			value: curSjType,
			listeners:{
				select:function(cb,rec,inx){
					try{
						curSjType=rec.get('k');
						treePanel.getRootNode().reload();
					}catch(e){}
				}
			}
	});
	
	var config=new Object();
	config.unitType = "2";
	config.rootpid = "1";
	treePanel=createTreePanel(config);
	treePanel.setTitle("二级公司招标(合同)月报情况");

	var jtTreePanel = new Ext.Panel({
		id: 'main-panel',
		tbar:["年月：",monthCombo],
		region : 'center',
			layout: 'fit',
//			frame: true,
			items: treePanel
	});
	
	return jtTreePanel;
};

//二级企业
function createGrid2Qiy(config){
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	var fm = Ext.form;
	
	var array_yearMonth=new Array();
	var curr_year=new Date().getYear();
	var curr_month = new Date().getMonth();
	var months=["01","02","03","04","05","06","07","08","09","10","11","12"];
	for(i =0 ; i <24; i++) {
		if(curr_month<0){
			curr_year=curr_year-1;
			curr_month=11;
		}
		var temp = new Array();	
		temp.push(curr_year+months[curr_month]);		
		temp.push(curr_year+"年"+months[curr_month]+"月");	
		array_yearMonth.push(temp);
		curr_month=curr_month-1;
	}
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
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
				maxHeight:107,
				listeners:{
	       			'expand':function(){
	       				pcTzglService.sjTypeFilter(nowPID,Mbean,function(arr){
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
		new Ext.grid.RowNumberer(),{
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
				hidden :false
			}, {
				id : 'sjType',
				type : 'string',
				header : "年份",
				dataIndex : "sjType",
				width:60,
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
				id : 'userId',
				type : 'string',
				header : "填报人",
				width:50,
				dataIndex : 'userId',
				align:'center'
			}, {
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:80,
				hidden:true,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d H:i:s')}
			
			}, {
				id : 'title',
				type : 'string',
				header :"报表名称",
				width:160,
				align:'center',
				dataIndex : 'title',
				renderer:function(v){
						return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
				}
			}, {
				id : 'state',
				type : 'string',
				header :"上报状态",
				width:40,
				align:'center',
				dataIndex : 'state',
				renderer:function(v){
					if(v=="0") return "<font color=gray>未上报</font>";
					if(v=="1") return "<font color=blue>已上报</font>";
					if(v=="2") return "<font color=red>退回重报</font>";
				}
			},{
				id : 'memo',
				type : 'string',
				header :"备注",
				width:150,
				hidden: true,
				dataIndex : 'memo',
				editor:new Ext.form.TextField()
			},
			{
				id : 'backUser',
				type : 'string',
				header :"回退人",
				width:35,
				dataIndex : 'backUser'
			},
			{
				id : 'reason',
				type : 'string',
				header :"退回原因",
				width:150,
				dataIndex : 'reason'
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序


	var tmpStore2Qy = new Ext.data.Store({
				baseParams : Ext.apply({params:"pid ='"+nowPID+"'"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true,
				listeners:{
					load: function(){
				  	}
				}
	});
	var Plant = Ext.data.Record.create(comColums);

	var PlantInt= {uids:'',pid:nowPID,sjType:'',unitId:'',title:'',billState:'',state:'0',
					memo:'',userId:REALNAME,createDate:new Date(),lastModifyDate:''}
	var tmpGrid2Qity = new Ext.grid.EditorGridTbarPanel({
						store : tmpStore2Qy,
						cm : cm,
						sm : sm,
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
							tmpGrid2Qity.getTopToolbar().items.get('add').disable();
							tmpGrid2Qity.getTopToolbar().items.get('save').disable();
							tmpGrid2Qity.getTopToolbar().items.get('del').enable();
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
										tmpGrid2Qity.getTopToolbar().items.get('add').enable();
										tmpGrid2Qity.getTopToolbar().items.get('del').disable();
									}
								}, tmpGrid2Qity);
							}
						},
						listeners:{
							'aftersave':function(grid, idsOfInsert, idsOfUpdate, _primaryKey,  _bean){
								if(m_grid_record)
									m_grid_record.set('uids',idsOfInsert);
								grid.getTopToolbar().items.get('add').enable();
								grid.getTopToolbar().items.get('save').disable();
								grid.getTopToolbar().items.get('del').disable();
							},
							'render':function(grid){
								grid.getTopToolbar().items.get('del').disable();
								grid.getTopToolbar().items.get('save').disable();
								grid.getTopToolbar().addButton({
										id:'report',
										text: '上报',
										iconCls: 'upload',
										handler:""
								});
							},
							'afterdelete':function(grid, ids){
//								var hql="delete from "+bean2+" where masterUids='"+ids+"'";
//								baseDao.executeHQL(hql);
								m_grid_record=null;
								grid.getTopToolbar().items.get('add').enable();
								grid.getTopToolbar().items.get('del').disable();
							},
							'rowclick' : function(grid, rowIndex, e){
				        		record = grid.getSelectionModel().getSelected();
				        		if(record){
				        			if(record.get('state')=="0"||record.get('state')=="2")
				        			{
				        				grid.getTopToolbar().items.get('del').enable();
				        				Ext.getCmp('report').enable();
				        			}
				        			else
				        			{
				        				Ext.getCmp('report').disable();
				        			}
				        			if(record.get('sjType')){
				        				curSjType=record.get('sjType');
				        				treePanel.getRootNode().reload();
				        			}
				        		}else{
									grid.getTopToolbar().items.get('del').disable();
				        		}
				        	},
				        	'beforeedit':function(e){
				        		if(e.record.get('state')=='1')return false;
				        	},
				        	'afteredit':function(o){
				        		tmpGrid2Qity.getTopToolbar().items.get('save').enable();
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
						bean : "com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM",
						business : business,
						primaryKey : primaryKey
					});
	tmpGrid2Qity.store.sort('sjType','DESC');
	return tmpGrid2Qity;
}

//项目单位
function createTreePanel(config){
	var dsCombo=new Ext.data.SimpleStore({
	    fields: ['v'],   
	    data: ['未审核','审核通过','退回']
	});
	var Combo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store :dsCombo,
				emptyText:"未审核",
				editable:false,
				maxHeight: 70,
				allowBlank : false,
				listeners:{}
			});
	var root = new Ext.tree.AsyncTreeNode({
			cls : 'master-task',
            text:""
    })
	var treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "SuperviseReportTree",
					businessName : "pcBidService",
					rootpid : USERBELONGUNITID,
					sjtype : curSjType,
					unitType:""
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
	});
	       				
//	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				treeLoader.baseParams.sjtype = curSjType;
				curSjStr = curSjType.substr(0,4)+'年'+curSjType.substr(4,2) + '月';
				if(config){
					treeLoader.baseParams.rootpid = config.rootpid;
					treeLoader.baseParams.unitType = config.unitType;
				}
			})
	var treePanel = new Ext.tree.ColumnTree({
        id:'month-report-tree-panel',
        iconCls: 'icon-by-category',
        region:'south',
        frame: false,
        border: false,
        title:'项目单位招标（合同）月报情况',
		height:300,
        autoScroll:true,
        rootVisible: false,
        columns:[{
            header:'项目名称',
            width:370,
            dataIndex:'unitname'
        },{
            header:'标题',
            width:360,
            dataIndex:'title',
            renderer : function(value, metaData, record, rowIndex,
					colIndex, store) {
			if ( record.uids  ){
				return '<span style="color:blue;font-weight:bold" title="打开' + value + '" onclick="openReport(\'' + record.pid + '\')">' + value + '</span>';
			}
			else{
				return curSjStr + "招标(合同)月度报表";
			}

	}
            
        },{
        	header : '填报时间',
        	width : 70,
        	dataIndex : 'createDate',
        	renderer:function(v){
        		if(v){
        			var yearMonth=v.split(" ");
        			return yearMonth[0];
        		}
				return v;
        	}
        },{
        	header : '填报人',
        	width : 65,
        	dataIndex : 'userId'
        },{
            header:'上报状态',
            width:60,
            dataIndex:'state',
            align: 'center',
            renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						if ( value == '1' ){
							return '已上报';
						}
						else if(value=="2"){
							return '退回重报';
						}else{
							var style = ' style="color:grey" ';
							return '<span' + style + '>未上报</span>';
						}
					}
            
        },{
            header:'审核',
            width:110,
            dataIndex:'verifyState',
            align: 'center',
            renderer:function(v, metaData, record, rowIndex,
							colIndex, store){
				var uids=record.uids;
            	var htmlStr="";
            	var a="",b="",c="";
            	if(v=="0"){
            		a=" selected=\"selected\"";
            	}else if(v=="1"){
            		b=" selected=\"selected\"";
            	}else if(v=="2"){
            		c=" selected=\"selected\"";
            	}
            	htmlStr="<select id=\""+uids+"\" onchange=\"showReasonBackWindow('"+uids+"','"+v+"','"+nowPID+"')\">"+
				  			"<option value =\"未审核\""+a+">未审核</option>"+
				  			"<option value =\"审核通过\""+b+">审核通过</option>"+
				  			"<option value=\"退回\""+c+">退回</option>"+
						"</select>";
				if(uids=="")htmlStr="";
				return htmlStr;
            }
           
        }],       
        loader: treeLoader,
        root: root,
        rootVisible : false
	});
	root.expand();
	return treePanel;
}
function sjTypeRender(val,meta,rec,rInx,cInx,store){
	if(val.length==6){
		return val.substring(0,4)+"年"+val.substring(4,6)+"月";
	}else{
		return val;
	}
}
function stateRender(val,meta,rec,rInx,cInx,store){
	var text = "未报送";
    switch(val){
        case "0":
            text = "<font color=gray>未报送</font>";
        break;
        case "1":
             text = "<font color=blue>已报送</font>";
        break;
        case "2":
            text = "<font color=red>退回重报</font>";
        break;
    }
    return text;
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
	
	return "<a href='javascript:showEditWindow2(\""+unitType+"\")'>"+v+"</a>";
}	

function showEditWindow2(unitType){
	if(unitType=='A')
	{
		var m_record=treePanel.getSelectionModel().getSelected();
		
		window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.monthInvest.form.jsp",
		m_record,"dialogWidth:820px;dialogHeight:440px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
	}
	else
	{
		if(jtTreePanel==null)
		{
			var m_record=grid2Qiy.getSelectionModel().getSelected();
		}
		else
		{
			var m_record=jtTreePanel.getSelectionModel().getSelected();
		}
		
		window.showModalDialog(
						CONTEXT_PATH+ "/PCBusiness/tzgl/query/pc.tzgl.monthInvest.multiPro.report.jsp",
						m_record,"dialogWidth:1000px;dialogHeight:1080px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
}

function showReasonBackWindow(uids, value,pid){
	
	var selecValue="";
	var fromSel = document.getElementById(uids);   
    if(fromSel==null){   
         return false;   
     }   
    for(var i = 0;i < fromSel.options.length;i++){   
        var _option = fromSel.options[i];   
       //是否选中   
        if(_option.selected){   
            selecValue=_option.value;
        }   
   }
   if(selecValue=="未审核"){
   		if(value=="0") {
   			return;
   		}else{
   			DWREngine.setAsync(true);
   			var sql="update PC_BID_SUPERVISEREPORT_M set state='1',verify_state='0' where uids='"+uids+"'";
			baseDao.updateBySQL(sql,function(flag){
				if(flag==1){
					treePanel.getRootNode().reload();
					Ext.example.msg('提示','操作成功!');
				}else{
					Ext.example.msg('提示','操作失败!',2);
				}
			});
			DWREngine.setAsync(true);
   		}
   }else if(selecValue=="审核通过"){
		if(value=="1") {
			return;
   		}else{
   			DWREngine.setAsync(true);
   			var sql="update PC_BID_SUPERVISEREPORT_M set state='1',verify_state='1' where uids='"+uids+"'";
			baseDao.updateBySQL(sql,function(flag){
				if(flag==1){
					treePanel.getRootNode().reload();
					Ext.example.msg('提示','操作成功!');
				}else{
					Ext.example.msg('提示','操作失败!',2);
				}
			});
			DWREngine.setAsync(true);
   		}
   }else if(selecValue=="退回"){
   		try{
			var win = new BackWindow({
				doBack:function(reason){
					var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
					mask.show();
					PCBidDWR.sendBackSuperviseReport(uids,reason,REALNAME,pid,function(flag){
					mask.hide();
						if(flag=="1"){
							Ext.example.msg('提示','操作成功!');	
							treePanel.getRootNode().reload();
							win.hide();
						}else{
							Ext.example.msg('提示','操作失败!');										
						}
					})
				}
			});
			win.show();
		}catch(e){
		}
   }
	
}