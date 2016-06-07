var treePanel
var viewport;
var rootText = '选择单位';
var OrgProperties = new Array();
var orgTypeSt;
Ext.onReady(function (){	
	DWREngine.setAsync(false);	
	systemMgm.getCodeValue("组织机构类型", function(list){

		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			OrgProperties.push(temp);
		}
	});		
    DWREngine.setAsync(true);
    
    orgTypeSt = new Ext.data.SimpleStore({
		fields: ['k','v'],   
		data: OrgProperties
	});
    
	btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	})
            
   var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
            
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'   
    })
  
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		requestMethod: "GET",
		baseParams: {
			ac:"columntree", 
			treeName:"getOrgTree", 
			businessName:"systemMgm", 
			parent:'0'
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
        id: 'mat-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        tbar:['<font color=#15428b><b>&nbsp;单位列表</b></font>'
        		,'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ root.collapse(true); }
		            },
        		'->',btnConfirm,'-',btnReturn],
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '单位名称',
            width: 250,
            dataIndex: 'unitname'
        },{
            header: '单位编码',
            width: 0,            
            dataIndex: 'unitid'
        },{
            header: '类型',
            width: 0,
            dataIndex: 'unitTypeId',
            renderer: function(value){
            	 for(var i=0; i<OrgProperties.length; i++){
           	 		if (value == OrgProperties[i][0]){
           	 			return OrgProperties[i][1]
           	 		}
           		 }
            }
        },{
            header: '分类主键',	
            width: 0,				//隐藏字段
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            	}
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'leaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            	}
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'upunit',
            renderer: function(value){
            	return "<div id='upunit'>"+value+"</div>";
            	}
        },{
            header:'选择',
            width:40,
            dataIndex:'ischeck',
            renderer: checkColRender
            
        }], 
        loader: treeLoader,
        root: root,
        rootVisible : true 
	});
	treePanel.on('beforeload', function(node) {
		
		var unitid = node.attributes.unitid;
		if (unitid == null)
			unitid = '0';

		var baseParams = treePanel.loader.baseParams
		baseParams.parent = unitid;
	})
	
	var viewport = new Ext.Viewport({
       layout: 'border',
       items: [treePanel]
    });
    
	treePanel.render();
	treePanel.expand();
	root.expand(true);
	 
    function checkColRender(value){
		if(value=='true'){
			return '<div id="colChecker">&#160;</div>'
		}else{
			return '<div id="colChecker" class="x-grid3-check-col" onclick="checkerClick(this)">&#160;</div>' 
		}
	}
    
	treePanel.on("click", function(node, e){
		var elNode = node.getUI().elNode;
		var chx = e.getTarget()
		if (chx.id && chx.id.indexOf("Checker") > 0) {
			//alert(chx.className)
			//chx.className = chx.className=="x-grid3-check-col-on"? "x-grid3-check-col":"x-grid3-check-col-on";
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


	 checkerClick = function(chx, flag){

	    if(chx.className !="" ){
			var checked = chx.className == "x-grid3-check-col-on"
		
			if (typeof(flag)=="undefined"){

				chx.className = checked ? "x-grid3-check-col" : "x-grid3-check-col-on"
			}
			else {
				chx.className = flag ? "x-grid3-check-col-on" : "x-grid3-check-col"
			}
		}
	}
	
	function confirmChoose(){
		treePanel.getEl().mask('laoding....');
	    var data = deepConcat(root);
	   				
	    	DWREngine.setAsync(false);   // 合同概算金额
			matFrameMgm.saveMatContractTree(conid,data, function(){
				treePanel.getEl().unmask();
			}); 
			     
			DWREngine.setAsync(true);
			viewport.hide();
			window.location.href = BASE_PATH + "jsp/material/mat.tree.jsp?conid=" 
				+ conid+ "&conname=" +connanme;	
	  
		}
	
	function deepConcat(node){
	
		var arr = new Array();
	   	var len = node.childNodes.length;
	   	for(var i=0; i<len; i++){
	   		var child = node.childNodes[i]
	   		var elNode = child.getUI().elNode;
			var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
			if (checked) {
				var id = elNode.all("unitid").innerText;
				arr.push(id);
				arr = arr.concat(deepConcat(child));
			}
	   	}
	   	return arr;
	}

 });
	
