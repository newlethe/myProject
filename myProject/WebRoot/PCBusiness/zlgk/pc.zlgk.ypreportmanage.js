// 质量管理信息输入主界面JS
var _reg = /,/g // 正则表达式
var sqlPid = USERPIDS.replace(_reg, "','");
sqlPid = "('" + sqlPid + "')";
var primaryKey = "uids";
var listMethod = "findWhereOrderby";

var reportName // 最新监理报告名称
Ext.onReady(function() {
	var projDS = new PC.Store({
				baseParams : {
					ac : 'list',
					business : "baseMgm",
					bean : "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo",
					method : listMethod,
					params : "pid in" + sqlPid // 默认是集团公司，进入页面有用户可以选择集团公司的项目
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
								}, {
									name : 'cumulativePassRate',// 累计验评合格率
									type : 'string'
								}, 
								{
									name : 'ThisMonthPassRate', // 本月验评合格率
									type : 'string'
								}, {
									name : 'ypStatisticalReports',
									type : 'string'
								}, {
									name : 'jlReportList',
									type : 'string'
								}, {
									name : 'latestSuperReport',
									type : 'string'
								}]),

				pruneModifiedRecords : true
			});

	// 取得不同项目的批文汇总信息
	// DWREngine.setAsync(false);
	// approvlMgm.getProjectsApprolInfoByUnitid(null, null, null, unitids,
	// function(list){
	// appStatics = list;
	// })
	// DWREngine.setAsync(true);

	// 点击链接后跳转到批文办理信息查询页面传递的参数是项目编号

	// var url = "PCBusiness/approvl/pc.approvl.pw.query.main.jsp";
	var _columns = [{
		header : "累计验评合格率",
		dataIndex : "cumulativePassRate",
		renderer : function(value, meta, record) {
		  /*
		   * 在这里实现合格率计算的算法或者写在后台此处调用
		  */
			return '100%'
		}
	}, {
		header : '本月验评合格率',
		dataIndex : "ThisMonthPassRate",
		renderer : function(value, meta, record) {
		  /*
		   * 在这里实现合格率计算的算法或者写在后台此处调用
		  */
			return '100%'
		}
	}, {
		header : '验评统计报表',
		dataIndex : "ypStatisticalReports",
		renderer : function(value, meta, record) {
			// var num = Math.floor(Math.random()*100);
			var pid = record.get('pid');
			var prjName = record.get('prjName');
			return "<a href='javascript:loadFirstModule(\"" + pid + "\",\""
					+ prjName + "\",\"\")'>" + '查看' + "</a>";
		}
	}, {
		header : '监理报告列表',
		dataIndex : "jlReportList",
		renderer : function(value, meta, record) {
			var pid = record.get('pid');
			var prjName = record.get('prjName');
			return "<a href='javascript:toQuerySuperJsp(\"" + pid + "\",\""
					+ prjName + "\",\"\")'>" + '查看' + "</a>";
		}
	}, {
		header : '最新监理周报',
		dataIndex : "latestSuperReport",
		renderer : function(value, meta, record) {
			var pid = record.get('pid');
			var reportName = "";

			// 获取最各个项目最新监理周报的名字
			DWREngine.setAsync(false);
			zlgkMgm.getLastedReportName(pid, function(list) {
						reportName = list
					});
			DWREngine.setAsync(true);
			var prjName = record.get('prjName');
			return "<a href='javascript:loadFirstModule(\"" + pid + "\",\""
					+ prjName + "\",\"0\")'>" + reportName + "</a>"
		}
	}]

	var p = new PC.ProjectStatisGrid({
				prjRenderer : function(value, meta, record, store) {
					var proNo = record.get("pid");
					// return "<a href='"+url+"?pid="+proNo+"'
					// target='contentFrame'>" + value +"</a>"
					var select_pid = record.get("pid");
					var select_prjName = record.get("prjName"); // 在具体选择办理状态时候传值，此处默认为全部
					return "<a href='javascript:loadFirstModule(\""
							+ select_pid + "\",\"" + select_prjName
							+ "\",\"\")'>" + select_prjName + "</a>"
				},
				title : '<center><b><font size=3>质量信息查询一览表</font></b></center>',
				ds : projDS,
				columns : _columns,
				searchHandler : function(store, unitid, projName) {
					store.baseParams.params = "prjName like '%"+projName+"%'"; 
					store.reload()
				}
			})

	projDS.load({
				callback : function() {
					// alert(projDS.getCount())
				}
			})

	// 指定comboBox选中后处理函数
	p.treeCombo.on('select', appFiterByProject);

	function appFiterByProject(combo) {
		var prjid = combo.getValue();
		projDS.baseParams.params = "pid=" + prjid;
		projDS.reload();
	}
	//	
	new Ext.Viewport({
				layout : 'fit',
				items : [p]
			})

	function getLatestReportName() {
		var _SQL = "select "
	}
});

function toQuerySuperJsp(selPid, selPrjName) {
	switchoverProj(selPid, selPrjName);
	parent.frames['contentFrame'].location.href = BASE_PATH
			+ 'PCBusiness/zlgk/pc.zlgk.query.supervison.jsp';
}
