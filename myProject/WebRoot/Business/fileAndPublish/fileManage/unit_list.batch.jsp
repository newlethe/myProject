<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String rootId = request.getParameter("rootId") == null ? "" : request.getParameter("rootId");
	String pubid = request.getParameter("pubId");
//发布文件时是否要进行数据交换
String exchangeOnPublish = request.getParameter("exchangeOnPublish") == null ? "0" :
	 request.getParameter("exchangeOnPublish");
%>
<html>
	<head>
		<title>发布处理</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript"
			src="<%=path%>/extExtend/columnNodeUI.js"></script>
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/columnTree.css" />
		<script src='dwr/engine.js'></script>
		<script type="text/javascript"
			src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript"
			src="<%=path%>/dwr/interface/ComFileManageDWR.js"></script>
		<script>
var tree,container,viewport;
var pubId = '<%=pubid%>';
var username = '<%=username%>';
var rootId = '<%=rootId%>';

var RootUpunitunitid= USERBELONGUNITID;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var RootName=USERBELONGUNITNAME;
var type="bdw"
var exchangeOnPublish = <%=exchangeOnPublish %>;
Array.prototype.indexOf = function(str){for(var i=0;i<this.length;i++){if(str==this[i]){return i;}}return -1;}
var where="unit_type_id not in ('9')";
var ComFileManageServlet=CONTEXT_PATH + "/servlet/ComFileManageServlet?ac=buildingUnitNewTree";
var sm;
//模拟MAP
var pubedUnit = new Object();
var selectedDeptId = "";
//批量发送文件id数组
var fileIds = window.parent.ids;

Ext.onReady(function(){
	var pubInfo = new Ext.Button({
		text: '发布',
		iconCls: 'save',
		handler: function(){
			selectedDeptId = "";
			var nodes = tree.getChecked();//getSelected();
			if(nodes.length>0){
				var infoWarn = ""
				for(var i = 0;i<nodes.length;i++){
					var node = nodes[i];
					if(node.id == defaultOrgRootID) continue;
					var unitType = node.attributes.unitTypeId;

					//只加根节点的PID
					if(!pubedUnit[node.id] && node.attributes.leaf == 1){
						selectedDeptId += (selectedDeptId == ""?"":",") + node.id
					}
				}			
			}
			if (selectedDeptId!=""){
				pubInfo.disable();
				var doExchange = (exchangeOnPublish == "1");
				var waitMsg = '正在发布，请稍候...';
				if ( doExchange ){
					waitMsg = '正在进行数据交互，请稍候...';
				}
				var mask = new Ext.LoadMask(Ext.getBody(), {
													msg :waitMsg
												});
											mask.show();
				ComFileManageDWR.filesPublishToDept(USERID,USERDEPTID,fileIds,selectedDeptId,doExchange,function(rtn){
					mask.hide();
					if(rtn == 'success'){
						window.parent.returnValue = true;
									Ext.Msg.alert('提示','发布成功！');
									reloadPubInfo();
									root.reload();
					
					}else if ( rtn == 'failed' ){
						Ext.Msg.show({
										title : '提示',
										msg : '发布失败',
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});
					}
					else{
						Ext.Msg.show({
										title : '提示',
										msg : rtn,
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});
						reloadPubInfo();
									root.reload();
					}
					pubInfo.enable();
				})
				if (rootId=="xxbdw" && CURRENTAPPID == '1031902'){
					ComFileManageDWR.sendSmsToDept(REALNAME,USERPOSNAME,selectedDeptId,pubId,function(rtn){
						if(rtn == 'true'){
							window.parent.returnValue = true;
							Ext.Msg.alert('提示','短信发送成功！');
						}else {
							Ext.Msg.show({
											title : '提示',
											msg : '短信发送失败',
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.ERROR
										});
						}
					})
				}
			}else{
				Ext.Msg.alert('提示', '选择需要发布的单位！');
			}
		}
	});
	
			reloadPubInfo();
	 		

	    load = new Ext.tree.TreeLoader({
	    	url : ComFileManageServlet,
				baseParams : {
					method : "buildingUnitNewTree",
					ifcheck : true,
					baseWhere :where,
					columnTree : tree,
					unitid:unitid,
			        upunit:upunit,
					async : false,
					hascheck:"yes",
					deployUnitType : DEPLOY_UNITTYPE
				},
	            requestMethod: "GET",
	            uiProviders:{
	                'col': Ext.tree.ColumnNodeUI
	            }
	    });
		
		var cm1 = [
		  {header:'单位名称',width:450,dataIndex:'unitname'}
		  ,{header:'单位类型ID', width:0,dataIndex:'unitTypeId',hidden:true}
	    ];
		if ( fileIds.length == 1 ){
			cm1.push(  {header:'发布状态', width:70,dataIndex:'unitid',renderer:transState});
			cm1.push(  {header:'发布时间', width:110,dataIndex:'unitid',renderer:transPubDate});
		}
		var root = new Ext.tree.AsyncTreeNode({
			text : '所有单位',
			id : 0,
            expanded: true
		});
		
	    tree = new Ext.tree.ColumnTree({
	    	id:'checkTree',
	        region: 'center',  
	        width:800,
	        height:document.body.clientHeight,
	        tbar:['请选择要发布的部门','->',pubInfo],
	        autoScroll:true,
	
	        checkModel: 'cascade',
	        columns:cm1,       
	        loader: load,
	        root: root,
	        rootVisible : false
	    });
	    tree.on('beforeload', function(node){ 
			tree.loader.baseParams.parentId = node.id;				
		});
	    
		tree.on('load', function(node){
			node.expand();
			node.eachChild(function(child) {
			child.expand();  
			}); 
		});
		
		viewport = new Ext.Viewport({
			layout:'fit',
			items:tree
		});
});

function transState(value,record) {
	if(record.id!=RootUpunitunitid){
		var node = tree.getNodeById(value);
		if ( node ){
			if ( node.attributes.leaf != 1 ){
				return '';
			}
		}
		
		if(pubedUnit[value]){
			
			if(node){
				 node.disable();	 
			}
			return "<div style='color:red;'>已发布</div>"
		}else{
			return "未发布"
		}
	}
}

function transPubDate(value,record){
	if(record.id!=RootUpunitunitid){
		var node = tree.getNodeById(value);
		if ( node ){
			if ( node.attributes.leaf != 1 ){
				return '';
			}
		}
		
		if(pubedUnit[value]){
			
			return pubedUnit[value];
		}else{
			return ""
		}
	}
}

/*
 *刷新发布树
 */
function reloadPubInfo(){
	var sql = "select t.receiver, to_char(t.publish_time, 'YYYY-MM-DD HH24:MI') from com_file_publish_history t where t.publish_type = 'group' and t.file_id = '"+pubId+"'"
		DWREngine.setAsync(false);
	
		db2Json.selectSimpleData(sql,function(data){
	
			var tempArr = eval(data);
			//得到的数据是形如 [['107', 日期]]的二维数组,将其以类似MAP的形式保存到Object中
			for ( var i = 0;  i < tempArr.length;i++ ){
				var pubArr = tempArr[i];		
				pubedUnit[pubArr[0]] = pubArr[1];
			}
			
		})
		DWREngine.setAsync(true);
}


</script>
	</head>

	<body>
		<div id="unit"></div>
	</body>
</html>

