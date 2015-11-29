var root,treeLoader,treePanel,selectedTreeData
var rootText='物资分类'
var temNode,selectWin;
var f_bmArr = new Array;
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
	//--------------物资编码Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "wzBmTypeTreeCheck",
			businessName : "wzglMgmImpl",
			parent : 0,
			userid:'',
			userrole:'',
			pid:CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'center',
		split : true,
		width : 400,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : false,
		lines : false,
		tbar:[{
	            iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
	            },'-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ root.collapse(true); }
	            }],
		autoScroll : true,
		animCollapse : false,
		animate : false,
		columns : [{
			header : '名称',
			width : 320,
			dataIndex : 'pm',
			renderer: function(value){
            	return "<div id='pm'>"+value+"</div>";
            }
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '编码',
            width:   120,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";
            }
        },{
            header: '选择',
            width:   40,
            dataIndex: 'ischeck',
            renderer: function(value){
            	if(value=='true'){
					return '<div id="colChecker">&#160;</div>'
				}else{
					return '<div id="colChecker" class="x-grid3-check-col" >&#160;</div>' 
				}
            }
        },{
            header: '层数',
            width:  0,
            dataIndex: 'lvl'
        },{
            header: '叶子',
            width:  0,
            dataIndex: 'isleaf'
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent'
        }
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
		baseParams.userid = PlantInt_fw.userid
		baseParams.userrole = PlantInt_fw.userrole
		baseParams.pid = PlantInt_fw.pid
	})	
	//treePanel.getRootNode().expand(); 
	//----------------------------选择-------------------------
	treePanel.on("click", function(node, e){
		var elNode = node.getUI().elNode;
		var chx = e.getTarget()
		
		if (chx.id && chx.id.indexOf("Checker") > 0) {
			chx.className = chx.className=="x-grid3-check-col-on"? "x-grid3-check-col":"x-grid3-check-col-on";
			var checked = chx.className=="x-grid3-check-col-on";
			deepCheck(node, chx.id, checked)
			if (checked){
				var p = node.parentNode
				while(p){
					if (p.getUI().elNode && p.getUI().elNode.all(chx.id))
					checkerClick(p.getUI().elNode.all(chx.id), true)			
					p = p.parentNode
				}
			}
		}
	});
	
	function deepCheck(node, id, checked){
		for(var i=0; i<node.childNodes.length; i++) {		
			var child = node.childNodes[i];
			var elNode = child.getUI().elNode;
			var chx = elNode.all(id)
			checkerClick(chx, checked)
			deepCheck(child, id, checked)
		}
	}

	function checkerClick(chx, flag){
	    if(chx.className !="" ){
		var checked = chx.className == "x-grid3-check-col-on"
	
		if (typeof(flag)=="undefined")
			chx.className = checked ? "x-grid3-check-col" : "x-grid3-check-col-on"
		else
			chx.className = flag ? "x-grid3-check-col-on" : "x-grid3-check-col"
		}
	}	

	
	function deepConcat(node){
		var arr = new Array();
	   	var len = node.childNodes.length;
	   	for(var i=0; i<len; i++){
	   		var child = node.childNodes[i]
	   		var elNode = child.getUI().elNode;
			var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
			if (checked) {
				var id = elNode.all("bm").innerText;
				arr.push(id);
				arr = arr.concat(deepConcat(child));
			}
	   	}
	   	return arr;
	}
	
	function confirmChoose(){
		treePanel.getEl().mask('loading....');
	    var data = deepConcat(root);
	    	DWREngine.setAsync(false);   // 保存
			wzbaseinfoMgm.saveGetResPersonTree(PlantInt_fw.userid,PlantInt_fw.userrole,PlantInt_fw.pid,data, function(){
				treePanel.getEl().unmask();
			}); 
			DWREngine.setAsync(true);
			selectWin.hide();
			Ext.example.msg('提示！', '保存成功！');
			
			//物资范围重新读取
			ds_fw.baseParams.params = " userid='"+PlantInt_fw.userid+"' and userrole='"+PlantInt_fw.userrole+"' and "+pidWhereString+"";
			ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		}	
	
	
   selectWin = new Ext.Window({
			title:'选择编码',
			buttonAlign:'center',
			closable:false,
			maximizable: true,
			layout:'fit',
			modal:'true',
			width:500,
			height:460,
			autoScroll:true,
			items:treePanel,
			buttons:[{id:'btnSavfe',text:'确定选择' ,handler:confirmChoose},{text:'取消',handler:function(){selectWin.hide()}}]
		});
})