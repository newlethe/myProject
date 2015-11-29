
var treePanel
var data;
var win;
var viewport;
var g_corpbasicid=null;
var g_subcorpinvesteid;
Ext.onReady(function (){
    btnConfirm = new Ext.Button({
    	text: '确定选择',
    	iconCls : 'save',
    	handler: confirmChoose
    })
          
            
	root = new Ext.tree.AsyncTreeNode({
        text: '概算信息',
        iconCls: 'form',
        id:'0'
        
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"BudgetInfoTree", 
			businessName:"bdgMgm", 
			parent:0,
			pid : CURRENTAPPID
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        //iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,

        header: true,
        //
        
        tbar:[
        		{
        			text: '<font color=#15428b><b>&nbsp;合同概算</b></font>',
					iconCls: 'title'
				}/*,'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ root.collapse(true); }
	            }*/, '->', '-', btnConfirm],
        
        
        
        //

        border: false,
        //cmargins: '0 0 0 0',
        rootVisible: false,
        lines: true,
        autoScroll: true,
        //animCollapse: false,
        animate: false,
		columns:[{
            header: '概算名称',
            width:350,
            dataIndex: 'bdgname'
        },{
            header: '概算主键',	
            width: 0,				//隐藏字段
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid'
        },{
            header: '概算编号',
            width: 100,
            dataIndex: 'bdgno'
        },{
            header: '是否工程量',
            width: 0,
            dataIndex: 'bdgflag',
            renderer: function(value){
            	return value > 0 ? '概算' : '工程量';
            }
        },{
            header: '概算金额',
            width: 90,
            dataIndex: 'bdgmoney',
            renderer: function(value){
            	return value != 'null' ? '<div align=\'right\'>￥'+value+'</div>' : '';
            }
        },{
            header: '材料金额',
            width: 0,
            dataIndex: 'matrmoney'
        },{
            header: '建筑金额',
            width: 0,
            dataIndex: 'buildmoney'
        },{
            header: '设备安装金额',
            width: 0,
            dataIndex: 'equmoney'
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
        root: root
	});
	
	
	treePanel.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = bdgid;
		baseParams.corpinvesteid=g_corpbasicid;
		//treePanel.loader.dataUrl = BASE_PATH + "servlet/BdgServlet?ac=budgetTree2&parent="+bdgid+"&corpinvesteid="+g_corpbasicid;
	})
    function checkColRender(value){
    	
    	//alert(value)
		if(value=='true'){
			return '<div id="colChecker">&#160;</div>'
		}else{
			return value ? '<div id="colChecker" class="x-grid3-check-col-on" onclick="checkerClick(this)">&#160;</div>'
			 : '<div id="colChecker" class="x-grid3-check-col" onclick="checkerClick(this)">&#160;</div>'    		
		}
	}
    
	treePanel.on("click", function(node, e){
		var elNode = node.getUI().elNode;
		var chx = e.getTarget()
		var checked = chx.className=="x-grid3-check-col-on"
		
		if (chx.id && chx.id.indexOf("Checker")>0){
			if (checked == true){
				chx.className="x-grid3-check-col-on"
			}else{
				chx.className="x-grid3-check-col"
			}
		}
		
//		if (chx.id && chx.id.indexOf("Checker")>0) {
//			deepCheck(node, chx.id, checked)
//		}
//		if (checked){
//			var p = node.parentNode
//			while(p){
//				if (p.getUI().elNode && p.getUI().elNode.all(chx.id))
//				checkerClick(p.getUI().elNode.all(chx.id), true)			
//				p = p.parentNode
//			}
//		} else {
//			//TODO
//		}
	});

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
	 if(chx.className !=""){
	var checked = chx.className == "x-grid3-check-col-on"
   	if (typeof(flag)=="undefined")
		chx.className = checked ? "x-grid3-check-col" : "x-grid3-check-col-on"
	else
		chx.className = flag ? "x-grid3-check-col-on" : "x-grid3-check-col"
	}
}

function confirmChoose(){
	  	var data = deepConcat(root);
   		var record = sm.getSelected();
   		var month=record.get('month').dateFormat('Y-m-d');
    	DWREngine.setAsync(false);       // 建设法人管理
		subcorpMgm.saveGetBudgetTree(g_corpbasicid, data,month) ; 
		DWREngine.setAsync(true);
		formWindow.hide();
		dsPart.load();
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
		}
		arr = arr.concat(deepConcat(child));
   	}
   	return arr;
}