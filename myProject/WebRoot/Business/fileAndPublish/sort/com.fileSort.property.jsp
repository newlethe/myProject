<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<%
	String isSortIssue = request.getParameter("isSortIssue") == null ? "0"
			: request.getParameter("isSortIssue");
	String rootId = request.getParameter("rootId") == null ? "0"
			: request.getParameter("rootId").toString() ;
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>文档分类树维护</title>
		<base href="<%=basePath%>">
		<!-- 拓全局变量设置 -->

		<!-- 拓展的Ext -->

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'>
</script>
		<script type='text/javascript' src='dwr/engine.js'>
</script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'>
</script>
		<script type="text/javascript">
//是否具有分类下放功能
var isSortIssue = "<%=isSortIssue%>";
var g_rootId = "<%=rootId%>";
</script>
		<!-- 功能JS -->
	</head>
	<body>
	</body>
	<script type="text/javascript">
Ext.onReady(function() {
	sortBhField = new Ext.form.TextField( {
		allowBlank : false,
		id : 'sortBh',
		fieldLabel : '分类编号<font color="red">*</font>',
		//size: 500,
		maxLength : 500,
		maxLengthText : "输入不能多于100个字符",
		validator : parent.textValidator,
		anchor : '95%'
	});
	sortNameField = new Ext.form.TextField( {
		allowBlank : false,
		id : 'sortName',
		fieldLabel : '分类名称<font color="red">*</font>',
		//size: 500,
		maxLength : 500,
		maxLengthText : "输入不能多于100个字符",
		validator : parent.textValidator,
		anchor : '95%'
	});

	parentNodeField = new Ext.form.TextField( {
		allowBlank : true,
		disabled : true,
		id : 'parentNodeName',
		fieldLabel : '上层分类名称',
		//size: 500,
		maxLength : 500,
		maxLengthText : "输入不能多于100个字符",
		validator : parent.textValidator,
		anchor : '95%'
	});

	sortPathField = new Ext.form.TextField( {
		allowBlank : true,
		disabled : true,
		id : 'sortPath',
		fieldLabel : '完整路径',
		//size: 500,
		maxLength : 500,
		maxLengthText : "输入不能多于100个字符",
		validator : parent.textValidator,
		anchor : '95%'
	});

	//pid
		var pidField = new Ext.form.Hidden( {
			id : 'pid',
			name : 'pid',
			value : CURRENTAPPID
		});

		//隐藏域，传递parentid
		//?method=updateNode&uids='+selectNode.id+"&sortBh="+encodeURIComponent(data.sortBh)+"&sortName="+encodeURIComponent(data.sortName));

		//parentId='+parent.selectNode.id
		parentIdField = new Ext.form.Hidden( {
			id : 'parent-id-field',
			name : 'parentId'
		});

		sortPropertyForm = new Ext.FormPanel( {
			id : 'sortProperty_Form',
			//title: '分类属性',
			labelWidth : 100,
			frame : true,
			region : 'center',
			bodyBorder : true,
			border : true,
			bodyStyle : 'padding:5px 5px 5px 5px',
			layout : 'form',
			buttons : [ {
				text : '保存',
				handler : insertSaveFun
			}, {
				text : '取消',
				handler : function() {
					parent.pWin.close();
				}
			} ]
		});
		sortPropertyForm.add(sortPathField, parentNodeField, sortBhField,
				sortNameField);
		sortPropertyForm.add(parentIdField, pidField);
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [ sortPropertyForm ]
		});
		ComFileSortDWR.getNewSortBh(parent.selectNode.id, function(dat) {
			sortBhField.setValue(dat)
		})
		parentNodeField.setValue(parent.selectNode.text);
		sortPathField.setValue(parent.selectNode.getPath("text"));
	})
function insertSaveFun() {
	var form = sortPropertyForm.getForm();
	parentIdField.setValue(parent.selectNode.id);
	if (form.isValid()) {
		var data = form.getValues()
		form.submit( {
			waitMsg : '保存中......',
			method : 'POST',
			url : CONTEXT_PATH + '/servlet/ComFileSortServlet?method=addNode',
			success : function(response) {
    Ext.example.msg('提示', '保存成功！')
    if (isSortIssue) {
    ComFileSortDWR.setSyncStatus(g_rootId, false, function(
    retVal) {					
    setTimeout(function(){
    parent.pWin.close();
    }, 250); 	
    parent.rootNode.reload();
    });
    } 
    else{					
    setTimeout(function(){
    parent.pWin.close();
    }, 250); 
    parent.rootNode.reload();   
	}
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", response.responseText)
			}
		});
	}
}
</script>
</html>
