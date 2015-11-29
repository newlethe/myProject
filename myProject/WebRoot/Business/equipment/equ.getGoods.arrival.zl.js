var gridZlPanel,uploadWin,treePanelZl
var beanZl = "com.sgepit.pmis.equipment.hbm.EquSbdhZl";
var businessZl = "baseMgm";
var listMethodZl = "findWhereOrderBy";
var primaryKeyZl = "uuid";
var orderColumnZl = "dateup";
var SEL_INDEX_ID="",SEL_ORG_ID=""
var ZlInfo = function(){
	this.infoid,			//主键
	this.pid,				//项目别
	this.indexid,			//分类条件
	this.fileno,			//文件编号
	this.materialname,		//材料名称（流程主题）
	this.responpeople,		//录入人（发起人）
	this.stockdate,			//文件形成日期
	this.quantity,			//每份数量
	this.book,				//单位
	this.portion,			//份
	this.filelsh,			//附件流水号
	this.billstate,			//单据状态
	this.orgid,				//部门id
	this.weavecompany,		//责任者
	this.infgrade,			//资料电子文档密级
	this.filename,			//附件文件名称（文件名称）
	this.remark,			//备注
	this.yjr,				//移交人（发起人）
	this.jsr,				//经手人
	this.zltype,			//资料类型（8定为流程文件、9定为流程附件）
	this.rkrq,				//入库日期
	this.modtabid,
	this.flwinsid,
	this.zldaid
	
}
	/////////////----------资料上传及移交begin-------------------------
var fcZl={
	'uids': {name: 'uids',fieldLabel: '主键',anchor:'95%'}, 
	'pid': {name: 'pid',fieldLabel: '工程项目id',anchor:'95%'}, 
	'dhId': {name: 'dhId',fieldLabel: '到货id',anchor:'95%'}, 
	'fileid': {name: 'fileid',fieldLabel: '文件编号',anchor:'95%'}, 
	'filename': {name: 'filename',fieldLabel: '文件名称',anchor:'95%'}, 
	'dateup': {name: 'dateup',fieldLabel: '上传日期',format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'}, 
	'dateremove': {name: 'dateremove',fieldLabel: '移交日期',format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'}, 
	'isremove': {name: 'isremove',fieldLabel: '是否移交',anchor:'95%'}
}
var Columns = [
	{name: 'uids', type: 'string'},
	{name: 'pid', type: 'string'},
	{name: 'dhId', type: 'string'},
	{name: 'fileid', type: 'string'},{name: 'filename', type: 'string'},
	{name: 'dateup', type: 'date', dateFormat: 'Y-m-d H:i:s'},{name: 'dateremove',type: 'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'isremove', type: 'string'}
]

var smZl = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
var cmZl = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	smZl,
	{id: 'uids',header: fcZl['uids'].fieldLabel,dataIndex: fcZl['uids'].name,hidden:true},
	{id: 'pid',header: fcZl['pid'].fieldLabel,dataIndex: fcZl['pid'].name,hidden:true},
	{id: 'dhId',header: fcZl['dhId'].fieldLabel,dataIndex: fcZl['dhId'].name,hidden:true},
	{id: 'fileid',header: fcZl['fileid'].fieldLabel,dataIndex: fcZl['fileid'].name,hidden:true},
	{id: 'filename',header: fcZl['filename'].fieldLabel,dataIndex: fcZl['filename'].name},
	{id: 'dateup',header: fcZl['dateup'].fieldLabel,dataIndex: fcZl['dateup'].name,renderer: formatDate},
	{id: 'dateremove',header: fcZl['dateremove'].fieldLabel,dataIndex: fcZl['dateremove'].name,renderer: formatDate},
	{id: 'isremove',header: fcZl['isremove'].fieldLabel,dataIndex: fcZl['isremove'].name}
])

dsZl = new Ext.data.Store({
	baseParams: {
    	ac: 'list',
    	bean: beanZl,				
    	business: businessZl,
    	method: listMethodZl,
    	params:''
	},
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: primaryKeyZl
    }, Columns),
    remoteSort: true,
    pruneModifiedRecords: true
});
dsZl.setDefaultSort(orderColumnZl, 'asc');	

var removeBtn = new Ext.Button({
	 	id : 'removezl',
    	iconCls: 'print',
    	text: '移交资料',
    	handler: removeFile
    })
var comboxWithTree = new Ext.form.ComboBox({
	id:'combotr',
	mode: 'local',
	editable: false,
    listWidth: 280,
    maxHeight: 200,
    triggerAction: 'all',
    store: new Ext.data.SimpleStore({fields: [], data: [[]]}),
    tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
    listClass: 'x-combo-list-small',
    onTriggerClick:showFilesToRemove
});    
gridZlPanel = new Ext.grid.EditorGridTbarPanel({
	id: 'cat-grid-panel',
	title:'资料上传及移交',
    ds: dsZl,
    cm: cmZl,
    sm: smZl,
    tbar: [new Ext.Button({text: "<font color=#15428b><b>&nbsp;设备到货资料</b></font>", iconCls: 'form'}),
    	   '移交资料->>选取资料移交分类：',comboxWithTree,'-','_',removeBtn
    ],
    iconCls: 'icon-by-category',
    border: false,
    enableDragDrop: true,          //一旦选中某行，就不能取消选中，除非选中其他行
    header: false,				//
    frame: false,				//是否显示圆角边框
    autoScroll: true,			//自动出现滚动条
    collapsible: false,			//是否可折叠
    animCollapse: false,		//折叠时显示动画
    loadMask: true,				//加载时是否显示进度
    stripeRows: true,
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	},
	saveBtn:false,
	insertHandler:uploadFile,
	deleteHandler:deleteFile
});


    
    
function formatDate(value){
    return value ? value.dateFormat('Y-m-d') : '';
};

var dhbh="";
////////////////////------upload-------
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传附件',
			iconCls: 'upload',
			handler: function(){
				var filename = fileForm.form.findField("filename1").getValue()
				fileForm.getForm().submit({
					method: 'POST',
	          		params:{ac:'upload'},
					waitTitle: '请等待...',
					waitMsg: '上传中...',
					success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show(action);
						Ext.MessageBox.hide();
						var infos = action.result.msg;
						DWREngine.setAsync(false);
						equGetGoodsArrMgm.insertSbZl(infos[0].fileid,infos[0].filename,dhbh,CURRENTAPPID, function(dat){
							if(dat){dsZl.reload()}
						});
						DWREngine.setAsync(true);
			            uploadWin.hide();
					},
					failure: function(form, action){
						Ext.Msg.alert('Error', 'File upload failure.'); 
					}
				})
			}
		}]
	});
function uploadFile(){
  var records = sm.getSelections();
  if (records.length > 0){
  	  dhbh = records[0].get('ggid');
	  if (fileForm.items) 
			fileForm.items.removeAt(0);
			fileForm.insert({   
			    xtype: 'textfield',   
			    fieldLabel: '流水号',   
			    name: 'fileid1',
			    readOnly: true,
			    hidden: true,
			    hideLabel: true,
			    anchor: '90%'  // anchor width by percentage   
			  },{   
			    xtype: 'textfield',   
			    fieldLabel: '请选择文件',   
			    name: 'filename1',   
			    inputType: 'file',   
			    allowBlank: false,   
			    blankText: 'File can\'t not empty.',   
			    anchor: '90%'  // anchor width by percentage   
		  });
		uploadWin = new Ext.Window({
				title: '附件上传',
				layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
				maximizable: false, closable: true,
				resizable: false, modal: true, border: false,
				width: 380, height: 130,
				items: [fileForm]
		});
		uploadWin.show();		
  }
}


///////---------------------资料移交--------
/**
 * 移交资料室
 */
function showFilesToRemove(){
		DWREngine.setAsync(false);
		//baseDao.findByWhere2("com.sgepit.pmis.document.hbm.ZlTree", "orgid='"+USERORGID+"'", function(list){
			//if (list.length > 0){
				rootZl = new Ext.tree.AsyncTreeNode({
					text : "资料分类",
					iconCls : 'form',
					id:'root'
				});
				treeLoaderZl = new Ext.tree.TreeLoader({
					url : MAIN_SERVLET,
					baseParams : {
						ac: "columntree",
						treeName: "zlTree",
						businessName: "zldaMgm",
						//orgid: list[0].orgid,
						//parent: list[0].parent
						orgid: "",
						parent: "root",
						pid : pid
					},
					clearOnLoad : true,
					uiProviders : {
						'col' : Ext.tree.ColumnNodeUI
					}
				});
				treePanelZl = new Ext.tree.ColumnTree({
					border: false,
					rootVisible : false,
					lines : true,
					autoScroll: true,
					animCollapse: true,
					animate: true,
					columns: [{
						header: '资料名称', width: 260, dataIndex: 'mc'
					}, {
				        header: '主键', width: 0, dataIndex: 'treeid'
				    },{
				        header: '编码', width: 0, dataIndex: 'bm'
				    },{
				        header: '是否子节点', width: 0, dataIndex: 'isleaf'
				    },{
				        header: '系统自动存储编码', width: 0, dataIndex: 'indexid'
				    },{
				        header: '部门id', width: 0, dataIndex: 'orgid'
				    },{
				        header: '父节点', width: 0, dataIndex: 'parent'
				    }],
					loader : treeLoaderZl,
					root : rootZl
				});
				treePanelZl.on('beforeload', function(node) {
					var treeId = node.attributes.treeid;
					if (treeId == null){
						treeId = "root";
					}
					var baseParams = treeLoaderZl.baseParams
					baseParams.parent = treeId;
				})
			//} else {
				//Ext.example.msg('提示', '部门['+USERORG+']，不在资料树中！');
			//}
		//});
		DWREngine.setAsync(true);
		  
	if(treePanelZl){
		Ext.getCmp('combotr').focus();
		setTimeout('Ext.getCmp("combotr").expand();',1);
		comboxWithTree.on('expand', function(){
			treePanelZl.render('tree');
		});
		treePanelZl.on('click', function(node){
			if ("" != node.attributes.mc){
				comboxWithTree.setValue(node.attributes.mc);
				SEL_INDEX_ID = node.attributes.indexid;
				SEL_ORG_ID = node.attributes.orgid;
				comboxWithTree.collapse();
				treePanelZl.destroy()
			}
		});
	}
}
function removeFile(){
	if(SEL_INDEX_ID==""){Ext.MessageBox.alert("提示","请选择要移交的资料分类名称!");return}
	var record = gridZlPanel.getSelectionModel().getSelected();
	if(!record){Ext.MessageBox.alert("提示","请选择要移交的一条资料!");return}
	var zlInfo = new ZlInfo();
	zlInfo.infoid = '';						//主键
	zlInfo.pid = CURRENTAPPID;						//项目别
	zlInfo.indexid = SEL_INDEX_ID;				//分类条件
	zlInfo.fileno = "";						//文件编号
	zlInfo.materialname = record.get('filename');	//材料名称（流程主题）
	zlInfo.responpeople = REALNAME;			//录入人（发起人）
	zlInfo.stockdate = new Date();			//文件形成日期
	zlInfo.quantity = '';					//每份数量
	zlInfo.book = '';						//单位
	zlInfo.portion = '';					//份
	zlInfo.filelsh = record.get('fileid');				//附件流水号
	zlInfo.billstate = 0;					//单据状态
	zlInfo.orgid = SEL_ORG_ID;					//部门id
	zlInfo.weavecompany = '';				//责任者
	zlInfo.infgrade = '';					//资料电子文档密级
	zlInfo.filename = record.get('filename');			//附件文件名称（文件名称）
	zlInfo.remark = '';						//备注
	zlInfo.yjr = REALNAME;					//移交人（发起人）
	zlInfo.jsr = '';						//经手人
	zlInfo.zltype = 0;				//资料类型 
	zlInfo.rkrq = new Date();				//入库日期
	zlInfo.modtabid='';
	zlInfo.flwinsid='';
	zlInfo.zldaid='';
	
	equGetGoodsArrMgm.removeSbZl(zlInfo,function(dat){
		if(dat){dsZl.reload();Ext.example.msg('保存成功！', '您成功移交了一条资料！');}
	})
}


function deleteFile(){
	var record = gridZlPanel.getSelectionModel().getSelected();
	if(!record)return;
	if(record.get('isremove')=="是"){Ext.example.msg('提示！', '资料已经移交，不能删除！');return}
	gridZlPanel.defaultDeleteHandler()
}
///////-----------------------------资料over
