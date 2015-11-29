if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}
if(parent.wanyuan){
    //parent.wanyuan.setVisible(false);
    parent.wanyuan.setText('');
}

// 质量管理信息子系统主界面JS
var _reg = /,/g // 正则表达式
var sqlPid = USERPIDS.replace(_reg, "','");
sqlPid = "('" + sqlPid + "')";
var editText = "查看";
var primaryKey = "uids";
var listMethod = "getNewLastedReportName";
Ext.onReady(function() {
			var currDate = new Date();
			var currMonth = (currDate.getMonth()+101+"").substring(1);
			var curSjType = currDate.getFullYear() +currMonth;
			var sjArr=getYearMonthBySjType(null,null);
			var monthDs = new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : sjArr
					})

			// ljhglStr();
			// 获取监理报告期别
			var monthCombo = new Ext.form.ComboBox({
						name : 'report-month',
						readOnly : true,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						triggerAction : 'all',
						store : monthDs,
						allowBlank : true,
						listClass : 'x-combo-list-small',
						value : curSjType,
						editable:false,
						width : 100,
						listeners : {
							select : function(combo) {
								projDS.removeAll();
								var month = combo.getValue();
								projDS.baseParams.params = "unitid" + SPLITB
										+ USERBELONGUNITID + SPLITA + "sjType"
										+ SPLITB + month;
								projDS.reload();
							}
						}
					})

			var projDS = new PC.Store({
						baseParams : {
							ac : 'list',
							business : 'zlgkImpl',
							method : listMethod,
							params : "unitid" + SPLITB + USERBELONGUNITID
									+ SPLITA + "sjType" + SPLITB + curSjType // 默认是集团公司，进入页面有用户可以选择集团公司的项目
						},

						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : "pid"
								}, [{
											name : 'pid',
											type : 'string'
										},
										{
											name : 'ljyll',
											type : 'string'
										},//累计验评优良率
										{
											name : 'ljhgl',
											type : 'string'
										}, // 累计验评合格率
										{
											name : 'byhgl',
											type : 'string'
										}, {
											name : 'ypStatisticalReports',
											type : 'string'
										},
											{
											name : 'jlCompList',
											type : 'string'
										}, 
											{
											name : 'jlReportList',
											type : 'string'
										}, {
											name : 'reportname',
											type : 'string'
										}, {
											name : 'reportuids',
											type : 'string'
										}]),
						remoteSort : true,
						pruneModifiedRecords : true
					});

			// 点击链接后跳转到批文办理信息查询页面传递的参数是项目编号

			var _columns = [{
						header : '本月验评合格率',
						dataIndex : "byhgl",
						align : 'right',
                        width : 120,
						hidden:true,
						renderer : function(value) {
							if (isNaN(parseFloat(value))) {
								value = 0;
							}
							value = parseFloat(value);
							if (value < 0)
								value = 0;
							return ((Math.round(value * 10000) / 100)) + "%";
						}
					}, {
						header : "累计验评优良率",
						dataIndex : "ljyll",
						align : 'right',
                        width : 120,
                        hidden:true,
						renderer : function(value) {
							if (isNaN(parseFloat(value))) {
								value = 0;
							}
							value = parseFloat(value);

							if (value < 0)
								value = 0;
							return ((Math.round(value * 10000) / 100)) + "%";
						}
					}, {
						header : "累计验评合格率",
						dataIndex : "ljhgl",
						align : 'right',
                        width : 120,
                        hidden:true,
						renderer : function(value) {
							if (isNaN(parseFloat(value))) {
								value = 0;
							}
							value = parseFloat(value);

							if (value < 0)
								value = 0;
							return ((Math.round(value * 10000) / 100)) + "%";
						}
					}, {
						header : '质量验评汇总查询',
						dataIndex : "jlCompList",
						align : 'center',
                        width : 120,
                        hidden:true,
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:openReport(\""+ pid +"\",\""+ prjName +"\",\"质量验评汇总查询\")'>"+editText+"</a>"
						}
					}, {
						hidden:true,
						header : '验评统计报表',
						dataIndex : "ypStatisticalReports",
						align : 'center',
						hidden:true,
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:jumpController(\"" + pid
									+ "\",\"" + prjName + "\",\"ypbg\")'>" + '查看'
									+ "</a>"
						}
					}, {
						hidden:true,
						header : '监理报告列表',
						dataIndex : "jlReportList",
						align : 'center',
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:jumpController(\"" + pid
									+ "\",\"" + prjName + "\",\"jlbg\")'>" + '查看'
									+ "</a>"
						}
					}, {
						header : '监理周报',
						dataIndex : "jlbg_zhou",
						align : 'center',
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:jumpController(\"" + pid
									+ "\",\"" + prjName + "\",\"jlbg_zhou\")'>" + '查看'
									+ "</a>"
						}
					}, {
						header : '监理月报',
						dataIndex : "jlbg_yue",
						align : 'center',
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:jumpController(\"" + pid
									+ "\",\"" + prjName + "\",\"jlbg_yue\")'>" + '查看'
									+ "</a>"
						}
					}, {
//						header : '工程质量情况报表',
						header : '工程质量月报表',
						dataIndex : "gczlQkReport",
						align : 'center',
						width:130,
						renderer : function(value, meta, record) {
							var pid = record.get('pid');
							var prjName = record.get('prjName');
							return "<a href='javascript:showGczlReport(\"" + pid
									+ "\")'>" + '查看'
									+ "</a>"
						}
					},{
						hidden:true,
						header : '最新监理周报',
						dataIndex : "reportname",
						align : 'center',
						renderer : function(value, meta, record) {
							var reportuids = record.get('reportuids');
							//return "<font color='blue'><u style='cursor:hand;' onclick=downloadFile('"+reportuids+"')>"+'附件'+"</u></font>";
							return "<a href='javascript:downloadFile(\""+reportuids+"\")'>附件</a>";
						}
					}]

			var p = new PC.ProjectStatisGrid({
						prjRenderer : function(value, meta, record, store) {
							var proNo = record.get("pid");
							var select_pid = record.get("pid");
							var select_prjName = record.get("prjName"); // 在具体选择办理状态时候传值，此处默认为全部
							return "<a href='javascript:jumpController(\""
									+ select_pid + "\",\"" + select_prjName
									+ "\",\"xmdw\")'>" + select_prjName + "</a>"
						},
						ds : projDS,
						//tbar : [/*'选择月份：&nbsp;', monthCombo,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'*/],
						columns : _columns,
						searchHandler : function(store, unitid, projName) {
							projDS.removeAll();
							var month = monthCombo.getValue();
							projName = projName || '%'
							projDS.baseParams.params = "unitid" + SPLITB
									+ unitid + SPLITA + "sjType" + SPLITB
									+ month + SPLITA + "projName" + SPLITB
									+ projName;
							projDS.load();
						},
						viewConfig : {
							forceFit : false
						}
					});

			projDS.load()

			new Ext.Viewport({
						layout : 'fit',
						items : [p]
					})
				//隐藏字段
				p.getColumnModel().setHidden(3,true);
				p.getColumnModel().setHidden(6,true);
				p.getColumnModel().setHidden(7,true);		

		});

// 生成从2010年1月至本年度初的月份显示在下拉框列表中
function getMonths() {
	var months = new Array();
	var currentYear = SYS_DATE_DATE.getYear();

	for (var i = 2010; i < parseInt(currentYear, 10); i++) {
		for (var j = 1; j <= 12; j++) {
			if (j < 10) {
				months.push([i + '0' + j, i + '年' + j + '月']);
			} else {
				months.push([i + '' + j, i + '年' + j + '月']);
			}
		}
	}
	// 添加本年度1月到当前月份到下拉框中
	for (var i = 1; i <= SYS_DATE_DATE.getMonth() + 1; i++) {
		if (i < 10) {
			months.push([currentYear + '0' + i, currentYear + '年' + i + '月']);
		} else {
			months.push([currentYear + '' + i, currentYear + '年' + i + '月']);
		}
	}
	return months;
}

//显示附件中文件列表
function downloadFile(val){
	var param = {
		businessId:val,
		businessType:'PCJianLiBaoGao',
		editable : false
	};
	showMultiFileWin(param);
}

//跳转控制器, append用来确定点击的是"监理报告"还是"质量验评", lvl实现权限的页面传递
function jumpController(selPid, selPrjName, append){
	if(selPid==null||selPid==undefined)
		return;
	switchoverProj(selPid, selPrjName);
	parent.lt.expand();
	parent.proTreeCombo.show();
	parent.proTreeCombo.setValue(CURRENTAPPID)
	parent.backToSubSystemBtn.show();
	if(append.indexOf('jlbg') == 0||append=='xmdw'){
        if(parent.CT_TOOL_DISPLAY){
		    parent.CT_TOOL_DISPLAY(true);
		}
		if(top.pathButton&&top.pathButton.setText&&top.selectedSubSystemName)
	   		//top.pathButton.setText("<b>当前位置:"+top.selectedSubSystemName+"/质量信息管控/监理报告信息</b>");
	   		top.pathButton.setText("<font color=#15428b><b>&nbsp;监理报告信息</b></font>");
	
	   	var url = BASE_PATH +'PCBusiness/zlgk/pc.zlgk.input.supervison.jsp?lvl=3';
	   	if(append == "jlbg_zhou"){
	   		url += "&type=1";
	   	}else if(append == "jlbg_yue"){
	   		url += "&type=2";
	   	}
	   	
		parent.frames['contentFrame'].location.href = url;
				
	} else if(append=='ypbg'){ 
        if(parent.CT_TOOL_DISPLAY){
            parent.CT_TOOL_DISPLAY(true);
        }
		if(top.pathButton&&top.pathButton.setText&&top.selectedSubSystemName)
	         //top.pathButton.setText("<b>当前位置:"+top.selectedSubSystemName+"/质量信息管控/质量验评信息</b>");
	         top.pathButton.setText("<font color=#15428b><b>&nbsp;质量验评信息</b></font>");
	
		parent.frames['contentFrame'].location.href = 
				BASE_PATH +'PCBusiness/zlgk/pc.zlgk.input.assessment.jsp?lvl=3&pid='+selPid;
	}   else {
			return;		
	} 
}	
//工程质量情况报表
function showGczlReport(pid){
	var url = "";
	DWREngine.setAsync(false);
	appMgm.getCodeValue("工程质量情况报表路径",function(list){
		if(list && list !=null && list.length>0){
			url = list[0].detailType;
		}
	});
	DWREngine.setAsync(true);
	parent.frames['contentFrame'].location.href = 
				BASE_PATH +url+"&pid="+pid;
}
//质量验评汇总查询
function openReport(pid, pname, type)
{
	switchoverProj(pid,pname);
	var aw = screen.availWidth, ah = screen.availHeight;
	var url = BASE_PATH+"PCBusiness/zlgk/pc.zlgk.comp.gcjd.jsp";
		window.showModalDialog(url,null,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");	
}