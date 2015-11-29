<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>工程质量验评统计报表</title>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css"
			href="jsp/res/css/column-tree.css" />
			
		<script type='text/javascript'>
		
		
		/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
	  		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		
		/* 普通模块调用 */
		var editable = "<%=request.getParameter("editable") %>"=="true"?true:false;
		
		//主表id
		var statId = "<%=request.getParameter("statid") == null ? ""
					: request.getParameter("statid")%>";
		//编制年月
		var sjType = "<%=request.getParameter("sjtype") == null ? ""
					: request.getParameter("sjtype")%>";
	</script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/gczl/ColumnTree.js"></script>
		<script type="text/javascript"
			src="Business/gczl/gczl.zlyp.selectTree.js"></script>

	</head>
	<script type="text/javascript">
	//添加单位工程窗口
	var addDwPrjWin;
	
	Ext.onReady(function (){

		var saveBtn = new Ext.Button({
			id: 'save',
			text: '保存',
			tooltip: '保存数据',
			iconCls: 'save',
			handler: function(){
				window.frames["xgrid"].saveXgrid();
			}
		});
		
		var deleteBtn = new Ext.Button({
			id : 'del-item',
			text:'删除',
			tooltip : '删除选中行',
			iconCls:'remove',
			handler: function(){
				window.frames["xgrid"].deleteFun();
			}
		});
		
		var addItemBtn = new Ext.Button({
			id: 'add-item',
			text: '添加单位工程',
			iconCls: 'btn',
			handler: function(){
				showAddDwPrjWin();
			}
		});
		
		var xgridUrl = "Business/gczl/gczl.zlyp.detail.xGrid.jsp?statid=" + statId+'&isTask='+isFlwTask+'&isView='+isFlwView+'&editable='+editable;
		//报表标题
		var sjStr = '';
		var record = parent.curRecord;
		if ( record ){	//日期字符串
			sjStr = record.data['sjType'].substring(0,4) + '年' + record.data['sjType'].substr(4) + '月';
		}
		var unitSpecStr = '';
		if ( parent.unitRec ){
			unitSpecStr += '单位: ' + parent.unitRec.get('value');
		}
		if ( parent.specRec ){
			unitSpecStr += '&nbsp;&nbsp;&nbsp;专业: ' + parent.specRec.get('value');
		}
		
		
		
		//第二行工具栏，显示工具按钮
		var toolBtns = [addItemBtn, '-', deleteBtn ,'-',saveBtn];
		
		var subBar = new Ext.Toolbar({
			items : toolBtns
		});
		
		
		gridPanel = new Ext.Panel({
	        tbar: new Ext.Toolbar({
			items : ['<font color=#15428b><b>&nbsp;' + sjStr + '质量验评统计报表 &nbsp;</b></font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', '<font color=#15428b><b>&nbsp;' + unitSpecStr + '</b></font>']
			
		}),
		listeners : {
							'render' : function() {
							if ( editable )
								subBar.render(this.tbar);
							}
						},
		
	        border: false,
	        region: 'center',
	        autoScroll: true,
	        collapsible: false,
	        animCollapse: false,
	        loadMask: true,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			html: '<iframe name="xgrid" src="' + xgridUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		});	
		
	   // 9. 创建viewport，加入面板action和content
	    var viewport = new Ext.Viewport({
	        layout: 'border',
	        items: [gridPanel]
	    });

	    var gridTopBar = gridPanel.getTopToolbar()
		with(gridTopBar){
	    	add();
		}
	});
	
	function showAddDwPrjWin(){
		if ( !addDwPrjWin ){
			addDwPrjWin = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 500,
				height : 300,
				title : '选择单位工程',
				modal : true,
				maximizable : true,
				closeAction : 'hide',
				plain : true,
				items : [treePanel]
			});
		}
		
		
		root.reload(function(){
			root.expandChildNodes();
		});
		
		addDwPrjWin.show();
		
			
			
	}    
	    
  </script>
</html>
