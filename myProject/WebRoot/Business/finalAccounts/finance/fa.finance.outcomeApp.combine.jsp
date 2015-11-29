<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>分摊定义</title>
		<base href="<%=basePath%>">


		<!-- EXT -->


		<!-- PAGE -->
		<script type="text/javascript">
			var param = new Object();
		param.sj_type = '2010'; // 时间
		param.unit_id = '10000000000000'; // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.editable = true; // 是否能编辑，不传为不能编辑
		param.headtype = 'FA_OUTCOME_APP_03A';
		param.keycol = 'uids';
		param.xgridtype = 'simpletree';
		param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_outcome_app_report t2 ) order by t.bdgno";
		param.relatedCol = 'bdgid';
		param.bpnode = '01';
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		
			Ext.onReady(function(){
                        var tabs = new Ext.TabPanel({
                              region:'center',
                            activeTab: 0,
                            items:[
                                {html:'<iframe src="Business/finalAccounts/finance/fa.finance.outcomeApp.jsp" style="width:100%; height:100%" frameborder="0"></iframe>', title:'费用分摊定义'},
                               {html:'<iframe src="dhtmlxGridCommon/xgridview/templateXgridView.jsp?pagemode=tab" style="width:100%; height:100%" frameborder="0"></iframe>', title:'报表'}
                                                          ]
                        
                        
                        });
                        
                        new Ext.Viewport({
					      layout:"border",
					      items:[
					            tabs
					      ]
					});
                        
      
      
                        });
			
		</script>



	</head>
	<body>

	</body>
</html>
