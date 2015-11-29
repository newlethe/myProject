var centerPanel
var newtreePanel, newtreeLoader;
var newroot;
var newrootText = "资料分类";
var beanName = "com.sgepit.pmis.document.hbm.ZlTree";
var zlSortSelected = "";
var zlSortNameSelected = "";
var currentPid = CURRENTAPPID;
var fileGrid;
var dsResult;
Ext.onReady(function (){
	var yjBtn = new Ext.Toolbar.Button({
			id: 'send',
			icon: CONTEXT_PATH + "/jsp/res/images/icons/back.png",
			cls: "x-btn-text-icon",
			text : '移交文件',
			tooltip : '移交',
			handler: yjzlFun
	});
	newroot = new Ext.tree.AsyncTreeNode({
        text: newrootText,
        iconCls: 'form'
    })
    newtreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"zlTree", 
			businessName:"zldaMgm", 
			orgid:'', 
			parent:0,
			pid : currentPid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	newtreePanel = new Ext.tree.ColumnTree({
        id: 'zl-tree-panel',
        iconCls: 'icon-by-category',
        region: 'east',
        width: 200,
	    split: true,
	    frame: false,
	    header: false,
	    border: false,
	    lines: true,
	    autoScroll: true,
	    animate: false,
	    tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ newroot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ newroot.collapse(true); }
        },'->',yjBtn],
		columns:[{
            header: '资料分类',
            width: 280,
            dataIndex: 'mc'
        },{
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }], 
        loader: newtreeLoader,
        root: newroot,
        rootVisible: false
	});
	
	newtreePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
			var baseParams = newtreePanel.loader.baseParams
			baseParams.orgid = '';
			baseParams.parent = parent;
	})
	newtreePanel.on('click', function(node){
		zlSortSelected = node.attributes.indexid;
		zlSortNameSelected = node.attributes.mc;
    });
	var dataGridDsReader = new Ext.data.JsonReader({fields:[
		{name: 'fileId',type: 'string'},
		{name: 'mainFileName', type:'string'},
		{name: 'zlTitle', type:'string'},
		{name: 'fileType',type: 'string'},
		{name: 'fileTypeName',type: 'string'},
		{name: 'fileLsh',type: 'string'},
		{name: 'fileName', type: 'string'},
		{name: 'isTrans', type: 'string'},
		{name: 'transState', type: 'string'},		
		{name: 'yjStr', type: 'string'}
	]})
	
	
	dsResult = new Ext.data.GroupingStore({
            reader: dataGridDsReader,
            proxy: new Ext.data.HttpProxy({
  				url: CONTEXT_PATH + '/servlet/EquServlet'
  			}),
            sortInfo:{field: 'fileType', direction: "DESC"},
            groupField:'zlTitle'
        }),
    dsResult.on("beforeload",function(ds1){
    	Ext.apply(ds1.baseParams ,{ 
			ac : 'getJsonEquTrans',
			yjrName : USERNAME,
			fileId : fileId,
			type:type,
			conid : conid
		})
    })
    sm =  new Ext.grid.CheckboxSelectionModel()
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {id:'fileLsh',header: "文件流水号", width: 0, hidden: true, dataIndex: 'fileLsh'},
            { header : "文件ID", width : 0, hidden: true,dataIndex: 'fileId'},
            {header : "主文档名称", width : 180, hidden:true, dataIndex : 'mainFileName'},
            {header : "资料名称", width : 180, hidden:true, dataIndex : 'zlTitle'},
            { header : "文件名称", width : 200, dataIndex: 'fileName'},
            { header : "类别代码", width : 0, hidden: true,dataIndex: 'fileType'},
            //{ header : "类别", width : 80,  dataIndex: 'fileTypeName'},
            { header : "文件移交情况", width : 200, dataIndex: 'yjStr',renderer:function(value,met,rec){
            	if(rec.data.transState=='0'){
            		return value + " <u style='cursor : hand;' onclick=\"cxyj('"+rec.data.fileLsh+"','"+rec.data.fileId+"','"+rec.data.zlTitle+"')\"><font color='blue'>撤销移交</font></u>"
            	}else{
            		return value;
            	}
            }},
            { header : "是否已经移交", width : 0, hidden: true,dataIndex: 'isTrans'},
            {  header : "资料状态", width : 0, hidden: true,dataIndex: 'transState'}              
          
	])
	sm.on("beforerowselect",function(obj,rInx,ke,rec){
		if(rec.data.isTrans == "1"){
			//Ext.Msg.alert("提示","该文件已经移交，不能重复移交")
			return false;
		}else{
			return true;
		}
	})
    cm.defaultSortable = true;
	fileGrid = new Ext.grid.GridPanel({
        region:'center',
        store: dsResult,
		cm: cm,						//列模型
        sm: sm,						//行选择模式
        view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '(【{[values.rs[0].data["zlTitle"]]}】 {[values.rs.length]}个文件)'
        }),

        frame:true,
        width: 500,
        height: 450,
        collapsible: true,
        animCollapse: false,
        title: '选择您要移交的文件'
    });
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [fileGrid,newtreePanel]
	});
	dsResult.load();
})
function yjzlFun(){
	var records = sm.getSelections();
	if(records == null || records == "")return;
    var tableName = "EQU_GOODS_OPENBOX_SUB"+"`"+conid;
	var fileLshs = "";
	var fileNames = "";
	var fileIds = "";
	for(i=0;i<records.length;i++){
		var rec = records[i];
		fileLshs += "," + rec.get("fileLsh")
		fileNames = rec.get("zlTitle")
//		fileNames = fileNames.substr(0,fileNames.length-7)+"合同文件"
	    fileIds = rec.get("fileId")
	}
	DWREngine.setAsync(true);
	var sql="select indexid from zl_info where materialname='"+fileNames+"' and yj_tableandid like '%"+ fileIds+"'";
	baseDao.getData("select indexid,mc from zl_tree where indexid =("+sql+")",function(list){
		 var flag=true;
	     if(list.length == 0){
				if(records.length>0 && zlSortSelected!=""){
					if(confirm("将选择的资料移交到【"+zlSortNameSelected+"】分类下,请确认!")){
							equMgm.equTransToZLSByType(CURRENTAPPID,USERDEPTID,REALNAME,type,fileLshs.substr(1,fileLshs.length-1),
										               fileNames,fileIds,zlSortSelected,flag, function(dat){
								if(dat){
									dsResult.reload();
									window.returnValue = true;
								}
							})
						}		
				}else{
	                 alert("请先选择您要移交的资料和移交的资料分类!")
				}
	     }else if(zlSortNameSelected != list[0][1]){
				 Ext.Msg.alert('提示信息','该合同附件的一部分已移交到资料库分类树下的' +
		      		        '<span style="color:red;">【'+list[0][1]+'】</span></br>请选择移交到分类为：<span style="color:blue;">【'+list[0][1]+'】</span><span style="color:red;">');
		         return;
		 }else{
	     	     flag = false;
				  equMgm.equTransToZLSByType(CURRENTAPPID,USERDEPTID,REALNAME,type,fileLshs.substr(1,fileLshs.length-1),
							                 fileNames,fileIds,zlSortSelected,flag, function(dat){
								if(dat){
									dsResult.reload();
									window.returnValue = true;
								}
					})	          
			}	     	
	});
	DWREngine.setAsync(false);
	
}
function cxyj(lsh,fileId,zlTitle){
	if(confirm("将收回移交的资料,请确认!")){
		equMgm.cancelEquTrans(lsh,fileId,zlTitle,function(dat){
			if(dat){				
				dsResult.reload();
				Ext.Msg.alert("提示","撤销移交成功");
				window.returnValue = true;
			}else{
				Ext.Msg.alert("提示","撤销移交失败")
			}
		})
	}
}