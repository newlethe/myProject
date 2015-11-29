var centerPanel
var newtreePanel, newtreeLoader;
var newroot;
var newrootText = "资料分类";
var beanName = "com.sgepit.pmis.document.hbm.ZlTree";
var zlSortSelected = "";
var zlSortNameSelected = "";
var currentPid = CURRENTAPPID;
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
//	    minSize: 275,
//	    maxSize: 400,
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
  				url: CONTEXT_PATH + '/servlet/ComFileManageServlet'
  			}),
            sortInfo:{field: 'fileType', direction: "DESC"},
            groupField:'mainFileName'
        }),
    dsResult.on("beforeload",function(ds1){
    	Ext.apply(ds1.baseParams ,{ 
			method : 'getJsonStrForTransToZLS',
			yjrName : USERNAME,
			fileId : fileId
		})
    })
    sm =  new Ext.grid.CheckboxSelectionModel()
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {id:'fileLsh',header: "文件流水号", width: 0, hidden: true, dataIndex: 'fileLsh'},
            { header : "文件ID", width : 0, hidden: true,dataIndex: 'fileId'},
            {header : "主文档名称", width : 180, hidden:true, dataIndex : 'mainFileName'},
            { header : "文件名称", width : 200, dataIndex: 'fileName'},
            { header : "类别代码", width : 0, hidden: true,dataIndex: 'fileType'},
            { header : "类别", width : 80,  dataIndex: 'fileTypeName'},
            { header : "文件移交情况", width : 200, dataIndex: 'yjStr',renderer:function(value,met,rec){
            	if(rec.data.transState=='0'){
            		return value + " <u style='cursor : hand;' onclick=\"cxyj('"+rec.data.fileLsh+"')\"><font color='blue'>撤销移交</font></u>"
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
	var grid = new Ext.grid.GridPanel({
        region:'center',
        store: dsResult,
		cm: cm,						//列模型
        sm: sm,						//行选择模式
        view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]}个文件)'
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
		items : [grid,newtreePanel]
	});
	dsResult.load();
})
function yjzlFun(){
	var records = sm.getSelections();
	if(records.length>0 && zlSortSelected!=""){
		if(confirm("将选择的资料移交到【"+zlSortNameSelected+"】分类下,请确认!")){
			var fileLshs = "";
			var fileNames = "";
			var fileId = records[0].get("fileId");
			for(i=0;i<records.length;i++){
				var rec = records[i];
				fileLshs += "," + rec.get("fileLsh")
				fileNames += "," + rec.get("fileName")
			}
			ComFileManageDWR.transToZLS(fileLshs.substr(1,fileLshs.length-1),fileNames.substr(1,fileLshs.length-1),fileId,zlSortSelected,USERNAME,function(dat){
			if(dat){
					dsResult.reload();
					window.returnValue = true;
				}
			})
		}		
	}else{
		alert("请先选择您要移交的资料和移交的资料分类!")
	}
	
}
function cxyj(lsh){
	if(confirm("将收回移交的资料,请确认!")){
		ComFileManageDWR.cancelTrans(lsh,function(dat){
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