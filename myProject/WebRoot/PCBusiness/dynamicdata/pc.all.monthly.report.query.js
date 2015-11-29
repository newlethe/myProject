var bean = "com.sgepit.pcmis.dynamicview.hbm.PcStatements";
var cellUrl = "/" + ROOT_CELL + "/cell/eReport.jsp";
var gridPanel = null;

Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : true
			})
	
	//创建列模型
	var cm = new Ext.grid.ColumnModel([sm, 
			{
				id : 'uids',
				type : 'string',
				header : "报表主键",
				hidden: true,
				editor: new Ext.form.TextField(),
				dataIndex : 'uids'
			}, {
				id : 'ptype',
				type : 'string',
				header : "模板类型",
				hidden: true,
				dataIndex : 'ptype'
			}, {
				id : 'sjType',
				type : 'string',
				header : "时间",
				width : 60,
				dataIndex : "sjType",
				align : 'center',
				renderer : function(v) {
					return v.substr(0,4)+"年"+v.substr(4)+"月";
				}
			}, {
				id : 'title',
				type : 'string',
				header : "报表名称",
				width : 200,
				align : 'center',
				dataIndex : 'title',
				renderer: function(value, meta, record){
					if(value!='')
					{
						return "<a href='javascript:showReport()'>"+value+"</a>";
					}
				}
			}, {
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width : 80,
				align : 'center',
				dataIndex : 'createDate',
				renderer : function(v) {
					if(v){
						return v.format('Y-m-d');
					}
				}
			}, {
				id : 'createperson',
				type : 'string',
				header : "填报人",
				width : 100,
				dataIndex : 'createperson',
				align : 'center'
			}, {
				id : 'reportStatus',
				type : 'float',
				header : "上报状态",
				width : 60,
				align : 'center',
				dataIndex : 'reportStatus',
				renderer :stateRender
			}
	]);
	
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type: 'string'
			},{
				name : 'ptype',
				type: 'string'
			},{
				name : 'sjType',
				type : 'string'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'createperson',
				type : 'string'
			},{
				name : 'title',
				type : 'string'
			}, {
				name : 'reportStatus',
				type : 'float'
			}, {
				name : 'backUser',
				type : 'string'
			},{
				name : 'tableName',
				type : 'string'
			}];
	/**
	 * 创建数据源
	 */
	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
	        		business: 'pcDynamicDataService',
	        		method :'getAllStatements',
					params: "pid"+SPLITB+pid+SPLITA+"time"+SPLITB+time
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
			
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
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
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel]
			});
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
			"href='javascript:showReportLog(\""+ pid +"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}

function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}

//电源报表的展示
   var mRecord = Ext.data.Record.create([{
						name : 'pid',
						type : 'string'
					}, {
						name : 'unitId',
						type : 'string'
					}, {
						name : 'sjType',
						type : 'string' 
					}, {
						name : 'state',
						type : 'string'
					}
				]);

//非扩展cell报表打开方法
function onCellOpened(CellWeb1,win){
	CellDoc = new CellXmlDoc(CellWeb1);
	
	var record = gridPanel.getSelectionModel().getSelected();
	var tableName = record.get('tableName');
	var reportId = record.get('uids');
	
	DWREngine.setAsync(false);
		pcTzglService.findDataByTableId(tableName,"uids='"+reportId+"'",function(data){
			CellDoc.replaceSign(data);
		});
	DWREngine.setAsync(true);
}

//扩展cell报表打开方法
function onExCellOpened(CellWeb1,win) {
	var record = gridPanel.getSelectionModel().getSelected();
	var reportId = record.get('uids');
	var tableName = record.get('tableName');
	
	if(tableName=='PC_BID_SUPERVISEREPORT_M')
	{
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
		//报表记录的扩展
		baseDao.getData("select zb_seqno,unitname,unit_id from V_PC_ZB_REPORT where zb_seqno in " +
					"(select zb_seqno from pc_bid_supervisereport_d where sj_type='"+record.get('sjType')+"'" +
					" and unit_id='"+ pid +"' and zb_seqno is not null) order by unit_id asc,nvl(kbrq,'00000000') desc",
			function(lt){
				var preUnitname = "";
				var maxRow = row+1;
				var startRow = maxRow;
				for(var i=0;i<lt.length;i++){
					CellWeb1.InsertRow(maxRow+i, 1,0);
					CellWeb1.SetRowHeight(1, 25, maxRow+i,0);
					CellWeb1.SetCellString(col,maxRow+i,0,lt[i][0]+"/"+lt[i][2]);//混合报表
					if(col>1){
						var curUnitname = lt[i][1];
						CellWeb1.SetCellString(col-1,maxRow+i,0,curUnitname);
						CellWeb1.SetCellAlign(col-1,maxRow+i,0,4);
						CellWeb1.SetCellAlign(col-1,maxRow+i,0,32);
						if(preUnitname==curUnitname){
							CellWeb1.MergeCells(col-1,startRow,col-1,row+1+i);
						}else{
							startRow = startRow+i;
							preUnitname = curUnitname;
						}
						CellDoc=new CellXmlDoc(CellWeb1);
					} 
				}
				
				CellDoc=new CellXmlDoc(CellWeb1);
				DWREngine.setAsync(false);
				pcTzglService.findDataByTableId("PC_BID_SUPERVISEREPORT_M","uids='"+record.get('uids')+"'",function(masterRecord){
					CellDoc.replaceSign(masterRecord);
				});
				DWREngine.setAsync(true);
				win.loadXMLData();
		})
	  }
	}
}

//报表的展示分为cell报表和非cell报表
function showReport()
{
	var record = gridPanel.getSelectionModel().getSelected();
	var tableName = record.get('tableName');
	var uids = record.get('uids');
	var sjType = record.get('sjType');
	
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	//非cell报表, 电源固定资产投资完成情况
	if('V_PC_TZGL_DYREPORT1_M'==tableName)
	{
		var URL = "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.report.jsp";
		var m_record = getReportDetail(tableName, uids, sjType);
		window.showModalDialog(CONTEXT_PATH + URL, m_record, 
			"dialogWidth:830px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	//非cell报表, 电源项目建设规模和新增生产能力
	else if('V_PC_TZGL_DYREPORT2_M'==tableName){
		var URL = "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport2.report.jsp";
		var m_record = getReportDetail(tableName, uids, sjType);
		window.showModalDialog(CONTEXT_PATH + URL, m_record, 
			"dialogWidth:1020px;dialogHeight:520px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	//非cell报表, 电源固定资产投资本年到位情况
	else if('V_PC_TZGL_DYREPORT3_M'==tableName){
		var URL = "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport3.report.jsp";
		var m_record = getReportDetail(tableName, uids, sjType);
		window.showModalDialog(CONTEXT_PATH + URL, m_record, 
			"dialogWidth:1020px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	//cell报表未扩展, 投资管理月报
	else if('V_PC_TZGL_MONTH_REPORT_M'==tableName){
		var params = {
			p_type: "TZGK_MONTH_REPORT",
			p_date: sjType,
			p_corp: pid,
			p_key_col : 'REPORT_ID',
			p_key_val : uids,
			onCellOpened: onCellOpened
		};
		window.showModalDialog(cellUrl, params, "dialogWidth:"+ w + ";dialogHeight:"+ h + 
								";center:yes;resizable:yes;");
	}
	//cell报表未扩展, 进度管控月报
	else if("V_PC_JDGK_REPORT"==tableName){
		var params = {
				p_type: "XMJD_MONTH_REPORT",
				p_date: sjType,
				p_corp: pid,
				p_key_col : 'REPORT_ID',
				p_key_val : uids,
				onCellOpened: onCellOpened
			};
		window.showModalDialog(cellUrl, params, "dialogWidth:"+ w + ";dialogHeight:"+ h + 
								";center:yes;resizable:yes;");
	}
	//cell报表未扩展, 质量验评月报
	else if("PC_ZLGK_QUA_INFO"==tableName){
		var params = {
				p_type: "ZLGL_ZLYP_MONTH_REPORT",
				p_date: sjType,
				p_corp: pid,
				p_key_col : 'REPORT_ID',
				p_key_val : uids,
				onCellOpened: onCellOpened
			};
		window.showModalDialog(cellUrl, params, "dialogWidth:"+ w + ";dialogHeight:"+ h + 
								";center:yes;resizable:yes;");
	}
	//cell报表扩展, 招投标月报
	else if("PC_BID_SUPERVISEREPORT_M"==tableName){
		var params = {
				p_type: "ZTB_MONTH_REPORT",
				p_date: sjType,
				p_corp: pid,
				p_key_col : 'REPORT_ID',
				p_key_val : uids,
				onCellOpened: onExCellOpened   //
			};
		window.showModalDialog(cellUrl, params, "dialogWidth:"+ w + ";dialogHeight:"+ h + 
								";center:yes;resizable:yes;");
	}
}

//通过表名称和该表一条主键找到报表的详细数据
function getReportDetail(tableName, uids, sjType){
	var m_record;
	var sql = "select t.unit_id, t.state from " + tableName + " t where uids='"+uids+"'";
	DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list){
		   m_record = new mRecord({pid:pid, unitId:list[0][0], sjType:sjType, state:list[0][1]});
		});
	DWREngine.setAsync(true);
	
	return m_record;
}