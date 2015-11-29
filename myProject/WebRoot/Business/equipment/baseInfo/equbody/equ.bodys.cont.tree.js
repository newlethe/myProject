/**
 * 通用设备合同分类树
 * @author zhangh 2012-07-06
 */
 
var root;
var treeLoader;
var treePanel;
var newrootPart;
var newtreePanelPart;

var fileWin;

var	isLeaf = '';
var selectTreeid = '';
var	selectUuid = '';
var selectConid = '';
var selectParentid = '';
//袁旭云新增
//选中节点的名称
var nodeText ="";

var treeNode = new Array();

Ext.onReady(function(){

	DWREngine.setAsync(false);
	var sql = "select c.property_code as treeid," +
			" '0' as parentid,c.property_name as name" +
			" from PROPERTY_CODE c where c.TYPE_NAME = " +
			"(select t.UIDS from PROPERTY_TYPE t where t.TYPE_NAME = '设备合同')" +
			" and c.property_code in  (select distinct sort from con_ove o where CONDIVNO = 'SB') "
	baseMgm.getData(sql,function(str){
        if(str.length>0){
        	   for(var i=0;i<str.length;i++){
        	   	  var temp = new Array();
        	   	  temp.push(str[i][0]);
        	   	  temp.push(str[i][1]);
        	   	  temp.push(str[i][2]);
        	      treeNode.push(temp)
        	   }
               
        	}
	})	
	DWREngine.setAsync(true);	
	
	root = new Ext.tree.AsyncTreeNode({
        id : "0",
        text: "合同分类树",
        iconCls: 'form'
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"newEquTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 350,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '合同分类树',
            width: 540,
            dataIndex: 'treename'
        },{
            header: '合同分类树主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: treeLoader,
        root: root
	});

	treePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid=node.attributes.conid;
		if (treeid == null){
			treeid = "0";
			conid="";
		}
		if(node.attributes.parentid=="0"){
			queryParent=node.attributes.treeid;
		}
		treePanel.loader.baseParams.parent = treeid;
		treePanel.loader.baseParams.conid = conid;
	});
	
	treePanel.on('click', onClick);
	function onClick(node, e){
		
		nodeText = "主体设备";
		if(node.text == "主设备" || node.text == "参考") {
			nodeText = "主体设备";
		} else {
			nodeText = node.text;
		}
		
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
		selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
		selectConid = isRoot ? "0" : elNode.all("conid").innerText;
		selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
		if(selectParentid == "0" && (selectConid == null || selectConid == '')){
			if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
		           var conid='';
				   for(var i=0;i<treeNode.length;i++){
						 if(node.id==treeNode[i][0]&& node.text==treeNode[i][2]){
	            	        DWREngine.setAsync(false);
	            	        baseMgm.getData("select  distinct conid  from (select * from equ_con_ove_tree_view start with  treeid='"+node.id+"' connect by prior treeid=parentid)where conid is not null",function(str){
	            	        	for(var l = 0; l < str.length; l++){
					   	          	  if(l==0){
					   	          	      conid += "'"+str[l]+"'";
					   	          	  }else{
					   	                  conid += ",'"+str[l]+"'";
					   	          	  }
					   	           }
	            	        })
	            	        DWREngine.setAsync(true);
	            	     }				   
				   }
				   if(conid == ''){
				       ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and flowid='"+flowid+"'";
				   }else{
				       ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in "+conid+") and flowid='"+flowid+"'"; 
				   }
	            }else{
		           var conid='';
				   for(var i=0;i<treeNode.length;i++){
						 if(node.id==treeNode[i][0]&& node.text==treeNode[i][2]){
	            	        DWREngine.setAsync(false);
	            	        baseMgm.getData("select  distinct conid  from (select * from equ_con_ove_tree_view start with  treeid='"+node.id+"' connect by prior treeid=parentid)where conid is not null",function(str){
                                if(str.length>1){
                                    for(var k=0;k<str.length;k++){
                                      if(k==0){
                                         conid +="'"+str[k]+"'";
                                      }else{
                                         conid +=",'"+str[k]+"'";
                                      }
                                    }
                                }
	            	        })
	            	        DWREngine.setAsync(true);
	            	     }				   
				   }
	            	if(conid == ''){
		               ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'";
	            	}else{
	            	   ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in ("+conid+")";
	            	}
	            }
		   ds.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			if(selectParentid == "0"){
				if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
		            ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and flowid='"+flowid+"'";
	            }else{
		            ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'";
	            }
				ds.load({params:{start:0,limit:PAGE_SIZE}});
			}else{
				//以04开头的为技术资料
				if(selectTreeid.indexOf("04")== 0){
	                if(typeof isFlwView != "undefined" && isFlwView == true) return;
					var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
							"?uuid="+selectUuid+"&conid="+selectConid+"&edit=false";
					fileWin = new Ext.Window({
						width: 950,
						height: 500,
						modal: true, 
						plain: true, 
						border: false, 
						resizable: false,
						layout : 'fit',
						html:"<iframe id='fileWinFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
						listeners : {
							'show' : function(){
								fileWinFrame.location.href  = url;
							}
						}
				    });
					fileWin.show();
				}else{
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
							" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
							" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
							" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
					var treeuuidstr = "";
					DWREngine.setAsync(false);
					baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
							treeuuidstr += ",'"+list[i]+"'";		
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
		                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+") and flowid='"+flowid+"'";
		            }else{
		                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
		            }
		            ds.load({params:{start:0,limit:PAGE_SIZE}});
				}
			}
		}
	}

	//======部件中使用
	newrootPart = new Ext.tree.AsyncTreeNode({
        text: "设备合同分类树",
        iconCls: 'form',
        id : "0"        
    })
	newtreeLoaderPart = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	newtreePanelPart = new Ext.tree.ColumnTree({//用于构造下拉设备合同分类树
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备合同分类树',
            width: 160,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: newtreeLoaderPart,
        root: newrootPart
	});	

});
	