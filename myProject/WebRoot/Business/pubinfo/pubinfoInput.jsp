<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>GridComboPanel</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
	    
	    
   		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="<%=path%>/gantt/frame/project/resource/css/multiselect.css"/>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/DDView.js"></script>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/MultiSelect.js"></script>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/ItemSelector.js"></script>   
	    <script type="text/javascript" src="Business/pubinfo/fbyh/prjmember.js"></script>  	    
	    <script type="text/javascript" src="Business/pubinfo/fbyh/fileupload.js"></script>  	    
		    
  		<script type='text/javascript' src='<%=path%>/dwr/util.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/infoDwr.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/gantDwr.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		
		<script>var myuserid='<%=userid%>'</script>
		<script>var myusername='<%=username%>'</script>
  </head>
  
  <body>
  </body>
</html>
<script>
var pubinfoId="";
var stateArray = [['all','全部'],['tz','通知'],['gg','公告'],['tb','通报'],['qt','其他']];
Ext.onReady(function(){
	var stateStr = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : stateArray
	});
	 var stateCombo = new Ext.form.ComboBox({
	 	 id : 'state_combo',
	 	 fieldLabel: '信息类型',
	 	 disable: true,
	 	 width: 150,
	 	 readOnly: true,
	 	 valueField: 'k',
	 	 displayField: 'v',
	 	 mode : 'local',
	 	 typeAhead: true,
	 	 triggerAction : 'all',
		 store : stateStr,
		 lazyRender : true,
		 listClass : 'x-combo-list-small',
		 listeners : {'collapse':function(com){
		 	if(com.value!="all"){
	        	window.frames["content1"].dbnetgrid1.fixedFilterPart="file_type='"+com.value+"'"
		 	}else{window.frames["content1"].dbnetgrid1.fixedFilterPart=""}
        	window.frames["content1"].dbnetgrid1.loadData()
	      }
	     } 
	})
	var tbar = new Ext.Toolbar({height:25})
	addBtn = new Ext.Toolbar.Button({
			id : 'add',
			text : '添加一条信息',
			iconCls : 'add',
			handler : onItemClick
		});
	editBtn = new Ext.Toolbar.Button({
			id : 'edit',
			text : '编辑信息',
			iconCls : 'btn',
			handler : onItemClick
		});
	delBtn = new Ext.Toolbar.Button({
			id : 'del',
			text : '删除信息',
			iconCls : 'remove',
			handler : onItemClick
		});
	deptBtn = new Ext.Toolbar.Button({
			id : 'fbbm',
			text : '发布到单位',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/chart_organisation.png',
			handler : showMenuTree
		});
	userBtn = new Ext.Toolbar.Button({
			id : 'fbyh',
			text : '发布到人员',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/group.png',
			handler : showMenuTree
		});
	var container = new Ext.Panel({
		region: 'center',
		renderTo: document.body,
		title: '发布信息管理',
		border: false,
		tbar: tbar,
		html: '<iframe name=content1 src=Business/pubinfo/pubinfoInputGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	
	tbar.add(addBtn,editBtn,delBtn,'-',deptBtn,userBtn,'-','类型查询：',stateCombo,"->","<font color=red>(可双击查看详细资料)</font>")
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});

//////////////////////////

var unitTree = new Ext.tree.ColumnTree({
		id:'powerTree',
        width:280,
        height:400,
        rootVisible:false,
        autoScroll:true,
        border: false,
        columns:[{
            header:'选择',
            width:280,
            dataIndex:'inx'
		}],
		loader: new Ext.tree.TreeLoader({
            dataUrl:'',
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
      root: new Ext.tree.AsyncTreeNode({
            text: '<%=unitname%>',
            id: USERUNITID,
            val:USERUNITID,
            expanded: false
        })
    });

    var treeWin = new Ext.Window({
    	id:'treeWin',
		width:300,
		height:460,
		autoScroll: true,
		resizable: false,
		plain: true,
		modal: true,
		closeAction:'hide',
		items: unitTree,
		buttons: [{text:'确定',handler:confirm},{text:'取消',handler:closeWin}],
		buttonAlign:'center'
    });
    function confirm() {
    	var grid = window.frames["content1"].dbnetgrid1
    	var param = new Object()
    	param["p_role"] = grid.currentRow.id
    	
    	var delarr = unitTree.getChecked('id')
    	var s2 = ""
		for(var i=0;i<delarr.length;i++) {
			s2 += (i==0 ? delarr[i]: ","+delarr[i])
		}
		param["p_role"] = grid.currentRow.id //信息id
    	param["s1"] = ""  //存储过程中有此参数但是没被使用所以任何值都可以
    	param["s2"] = s2 //被选中的
    	grid.selectData( "SYS_MANAGER.sentInfo", param )
    	alert("发布成功！");
    	grid.loadData()
    	treeWin.hide()
    }
   
    function closeWin() {
    	treeWin.hide()
    }
	/////////////////////////////////////////////
	
	function onItemClick(item) {
		var content1 = window.frames["content1"]
		var masterGrid = content1.document.all.dbnetgrid1;
		switch(item.id) {
			case 'add':
				masterGrid.toolbar.all.insertBtn.click()
				break;
			case 'edit':
				masterGrid.toolbar.all.updateBtn.click()
				break;
			case 'del':
				masterGrid.toolbar.all.deleteBtn.click()
		        break;
		}
	}
	
function showMenuTree(item) {
	switch(item.id){
		case 'fbbm':
					if(window.frames["content1"].dbnetgrid1.currentRow) {
						var powerTree = Ext.getCmp('powerTree')
						powerTree.on('beforeload', function(node){
							powerTree.loader.dataUrl='Business/pubinfo/unitData.jsp?node=' + node.attributes.val +'&pid=' + window.frames["content1"].dbnetgrid1.currentRow.id;
					    });
					    powerTree.getRootNode().reload()
					    var treeWin = Ext.getCmp('treeWin')
					 
					    treeWin.show()
					}
					break;
		case 'fbyh':
					if(window.frames["content1"].dbnetgrid1.currentRow){
						pubinfoId = window.frames["content1"].dbnetgrid1.currentRow.id
						window_itemselector.show();
					}
					break;
	}
} 

})


</script>