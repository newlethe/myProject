var centerPanel
var grid;
var dsResult;
var sm;
var recordView;
var users=new Array();
var pid=CURRENTAPPID;
var m_record;
Ext.onReady(function() {  		 
			var dataGridRs = Ext.data.Record.create([{
						name : 'period',
						type : 'string'
					}, {
						name : 'reportName',
						type : 'string'
					}, {
						name : 'reportPerson',
						type : 'string'
					}, {
						name : 'reportTime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'state',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					},{
						name : 'uids',
						type : 'string'
					},{
						name : 'pid',
						type : 'string'
					}]);
			var dataGridDsReader = new Ext.data.JsonReader({
						id : "uids",
						root : 'topics',
						totalProperty : 'totalCount'
					}, dataGridRs)

			dsResult = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : CONTEXT_PATH
											+ '/servlet/PcBidServlet'
								}),
						reader : dataGridDsReader
					});
			dsResult.on("beforeload", function(ds1) {

						Ext.apply(ds1.baseParams, {
									ac : 'getJiaJieReportIndex',
									//orderby : "createtime desc",
									pid : CURRENTAPPID
								})
					});
			// 创建选择模型
			sm = new Ext.grid.CheckboxSelectionModel({
					});
			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm, {
				header : '期别',
				dataIndex : 'period',
				align : 'left',
				width : 180,
				// 鼠标悬停时显示完整新闻
						renderer : function(value, metadata, record, rowIndex,
								columnIndex, store) {
							if(value.length==4){
								return value+"年";
							}else{
								var year=value.substring(0,4);
								var month=value.substring(4,6);
								return year+"年"+month+"月";
							}

						}
			}, {
						header : '报表名称',
						dataIndex : 'reportName',
						align : 'left',
						width: document.body.clientWidth-660,
						renderer : function(value,cell,record){
				        return record.get('uids')==""?value:"<a href='javascript:showEditWindow2()'>"+value+"</a>"
			}
					},{
						header : '填报人',
						dataIndex : 'reportPerson',
						align : 'center',
						width : 150
					}, 
					 {
						header : '填报时间',
						dataIndex : 'reportTime',
						align : 'center',
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), // Ext内置日期renderer
						width : 150
					},  
					{
						header : '上报状态',
						dataIndex : 'state',
						align : 'center',
						width : 150,
						renderer : stateRender
					}]);	
			// 创建Grid
			grid = new Ext.grid.GridPanel({
						id : 'file-grid',
						ds : dsResult,
						sm : sm,
						cm : columnModel,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							//forceFit : true
						}

					});							
			grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
			});
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [ grid]
					});
			dsResult.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
			sm.on('rowselect', function(sm) { // grid 行选择事件
				m_record = sm.getSelected();
			});						
function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0"||value=="null") return "<font color=gray>未上报</font>";
	if(value=="1") {
		renderStr="<font color=black>已上报</font>";
	}
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") renderStr="<font color=blue>审核通过</font>";
	return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}
			
});
function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
function showEditWindow2() {
	if (m_record.get('uids') == '') {
		Ext.example.msg("提示", "请先保存此条记录");
	} else {
		var record = m_record;
		var type=record.get('type');
		var ptype="";
		if(type=="VPcTzglYearPlanM"){
			m_record.set('issueStatus',m_record.get('state'));
			m_record.set('sjType',m_record.get('period'));
			window.showModalDialog(
						CONTEXT_PATH
								+ "/PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.yearInvest.form.jsp",
						m_record,
						"dialogWidth:820px;dialogHeight:540px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
			return;
		}else if(type=="VPcTzglMonthCompM"){
			ptype="TZGK_MONTH_REPORT";
		}else if(type=="VPcJdgkReport"){
			ptype="XMJD_MONTH_REPORT";
		}else if(type=="VPcTzglDyreport1M"){
			m_record.set('unitId',pid);
			m_record.set('sjType',m_record.get('period'));
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.report.jsp",
					m_record,"dialogWidth:830px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
					return;
		}else if(type=="VPcTzglDyreport2M"){
			m_record.set('unitId',pid);
			m_record.set('sjType',m_record.get('period'));			
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport2.report.jsp",
					m_record,"dialogWidth:1024px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");	
					return;
			
		}else if(type=="VPcTzglDyreport3M"){
			m_record.set('unitId',pid);
			m_record.set('sjType',m_record.get('period'));			
			window.showModalDialog(
					CONTEXT_PATH+ "/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport3.report.jsp",
					m_record,"dialogWidth:1024px;dialogHeight:320px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");	
					return;
		}else if(type=="VPcBidSupervisereportM"){
			ptype="ZTB_MONTH_REPORT";
		}
		var params = {
			p_type :ptype,
			p_date : record.get('period'),
			p_corp : pid,
			p_key_col : 'MASTER_ID',
			p_key_val : record.get('uids'),
			p_checkNull : true,
			openCellType : 'open',
			savable :false,
			onCellOpened : onCellOpened,
			beforeCellSaved:beforeCellSaved
		}
		var cellUrl = "/" + ROOT_CELL + "/cell/eReport.jsp";
		window.showModalDialog(cellUrl, params, "dialogWidth:"
						+ screen.availWidth + ";dialogHeight:"
						+ screen.availHeight + ";center:yes;resizable:yes;");
		//dsResult.getStore().reload();
	}
}		
//打开报表时，写入备注字段
var CellDoc=null;
function onCellOpened(CellWeb1,win){
	var reportId = m_record.get('uids');
	CellDoc=new CellXmlDoc(CellWeb1);
	var type=m_record.get('type');
	if(m_record){
		if(type=="VPcJdgkReport"){
			DWREngine.setAsync(false);
			pcTzglService.findDataByTableId("v_pc_jdgk_report","uids='"+reportId+"'",function(data){
			if(data.CREATEPERSON ==null)data.CREATEPERSON=REALNAME;
			CellDoc.replaceSign(data);
		});		
		DWREngine.setAsync(true);	
		}else if(type=="VPcTzglYearPlanM"){
			DWREngine.setAsync(false);
			pcTzglService.findDataByTableId("v_pc_tzgl_year_plan_m","uids='"+reportId+"'",function(masterRecord){
			CellDoc.replaceSign(masterRecord);
			});
			DWREngine.setAsync(true);			
		}else if(type=="VPcTzglMonthCompM"){
			DWREngine.setAsync(false);
			pcTzglService.findDataByTableId("Pc_Tzgl_Month_Comp_M","uids='"+reportId+"'",function(masterRecord){
				CellDoc.replaceSign(masterRecord);
			});
			DWREngine.setAsync(true);	
		}else if(type=="VPcBidSupervisereportM"){
			var SelectRecord=m_record;
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
						sql=" select zb_seqno, unitname, unit_id from pc_bid_supervisereport_d where sj_type='"+SelectRecord.get('sjType')+"' " +
								"and unit_id='"+SelectRecord.get('pid')+"' and zb_seqno is not null order by unit_id asc,nvl(kbrq,'00000000') desc";
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





