
var treePanel
var data;
var idS = new Array();
var win;
var viewport;
var rootText = '该合同的材料';
 
Ext.onReady(function (){
	
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
		baseParams: {
			ac:"columntree", 
			treeName:"contractMatTree", 
			businessName:"matMgm", 
			conid:conid, 
			type: type,
			parent:0
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
        tbar:['<font color=#15428b><b>&nbsp;该合同的材料</b></font>'
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
            header: '品名(分类名)',
            width: 200,
            dataIndex: 'catName'
        },{
            header: '分类编码',
            width: 100,
            dataIndex: 'catNo'
        },{
            header: '规格型号',
            width: 120,
            dataIndex: 'spec'
        },{
            header: '英文名',
            width: 120,
            dataIndex: 'enName'
        },{
            header: '分类主键',	
            width: 0,				//隐藏字段
            dataIndex: 'matId',
            renderer: function(value){
            	return "<div id='matId'>"+value+"</div>";
            }
        },{
            header: '单位',
            width: 60,
            dataIndex: 'unit'
        },{
            header: '单价',
            width: 60,
            dataIndex: 'price'
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header:'选择',
            width:40,
            dataIndex:'ischeck',
            renderer: checkColRender
            
        }], 
        loader: treeLoader,
        root: root,
        rootVisible : false 
	});
	treePanel.on('beforeload', function(node) {
		var matId = node.attributes.matId;
		if (matId == null)
			matId = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.conid = conid;
		baseParams.type = type;
		baseParams.parent = matId;
	})
	
	var viewport = new Ext.Viewport({
       layout: 'border',
       items: [treePanel]
    });
    
	treePanel.render();
	treePanel.expand();
	root.expand();
	 
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
	
	function confirmChoose(){
		treePanel.getEl().mask('laoding....');
	    var data = deepConcat(root);
	   				
	    	DWREngine.setAsync(false);  
	    	if ('apply'== type){
	    		appBuyMgm.saveMatFrameTree(appid,data, function(){
					treePanel.getEl().unmask();
				}); 
	    	}
	    	
	    	if ('storeIn'== type){
	    		matStoreMgm.saveMatFrameTree(inId,data, function(){
					treePanel.getEl().unmask();
				});  
	    	}
	    	
	    	if (type == 'goods'){
		    	matGoodsMgm.selectStoreMat(invoId, data, null, function(){
	 				treePanel.getEl().unmask();
	 			}); 
		    }
		    
		    if (type == 'invoice'){
		    	matGoodsMgm.saveMatFrameTree(checkId,data, function(){
					treePanel.getEl().unmask();
				}); 
		    }
			DWREngine.setAsync(true);
			history.back();
		}
	
	function deepConcat(node){
	
		var arr = new Array();
	   	var len = node.childNodes.length;
	   	for(var i=0; i<len; i++){
	   		var child = node.childNodes[i]
	   		var elNode = child.getUI().elNode;
			var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
			if (checked) {
				var id = elNode.all("matId").innerText;
				uuid
				if (leaf == 1){
					arr.push(id);
				}
				arr = arr.concat(deepConcat(child));
			}
	   	}
	   	return arr;
	}

 });
	
