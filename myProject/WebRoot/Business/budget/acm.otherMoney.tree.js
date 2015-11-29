
var treePanel
var data;
var idS = new Array();
var win;
var viewport;
 
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
        text: '概算信息',
        iconCls: 'form'
        
    })
  
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"getOtherTree", 
			businessName:"bdgMgm", 
			otherId:otherId,
			parent:'0104'
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
        id: 'budget11-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        tbar:['<font color=#15428b><b>&nbsp;合同概算</b></font>'
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
            header: '概算名称',
            width: 400,
            dataIndex: 'bdgname'
        },{
            header: '概算主键',	
            width:0,				//隐藏字段
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid'
        },{
            header: '财务编码',
            width: 200,
            dataIndex: 'bdgno'
        },{
            header: '是否工程量',
            width: 0,
            dataIndex: 'bdgflag',
            renderer: function(value){
            	return value > 0 ? '概算金额' : '工程量';
            }
        },{
            header: '概算金额',
            width: 80,
            dataIndex: 'bdgmoney',
            renderer: cnMoney
        },{
            header: '材料金额',
            width: 0,
            dataIndex: 'matrmoney',
            renderer: cnMoney
        },{
            header: '建筑金额',
            width: 0,
            dataIndex: 'buildmoney',
            renderer: cnMoney
        },{
            header: '设备安装金额',
            width: 0,
            dataIndex: 'equmoney',
            renderer: cnMoney
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf'
            
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
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0104';
		var baseParams = treePanel.loader.baseParams
		baseParams.otherId = otherId;
		baseParams.parent = bdgid;
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
	    	DWREngine.setAsync(false);   // 合同概算金额
			othCompletionMgm.saveOtherCompTree(otherId,data, function(){
				treePanel.getEl().unmask();
			}); 
			DWREngine.setAsync(true);
			viewport.hide();
			window.location.href = BASE_PATH + "Business/budget/acm.otherMoney.complet.jsp";	
	  
		}
	
	function deepConcat(node){
	
		var arr = new Array();
	   	var len = node.childNodes.length;
	   	for(var i=0; i<len; i++){
	   		var child = node.childNodes[i]
	   		var elNode = child.getUI().elNode;
			var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
			if (checked) {
				var id = elNode.all("bdgid").innerText;
				arr.push(id);
				arr = arr.concat(deepConcat(child));
			}
	   	}
	   	return arr;
	}

 });
	