var beanEquBody = "com.sgepit.pmis.equipment.hbm.EquGoodsBodys";
var businessEquBody = "baseMgm";
var listMethodEquBody = "findWhereOrderby";
var primaryKeyEquBody = 'uids';
var gridEquBody;
var dsEquBody;
var smEquBody;
var bdgArr=new Array();
Ext.onReady(function(){
	
	var fmEquBody = Ext.form;
	smEquBody = new Ext.grid.CheckboxSelectionModel();
	   //概算
	DWREngine.setAsync(false);
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	DWREngine.setAsync(true);
	// 创建可编辑配置区域
	var fcEquBody = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'equNo' : {name : 'equNo',fieldLabel : '主体设备编码',anchor : '90%', readOnly : true},
		'equName' : {name : 'equName',fieldLabel : '主体设备名称',anchor : '90%',allowBlank: false},
		'createDate' : {name : 'createDate', fieldLabel : '创建日期',anchor : '90%',readOnly : true,format:'Y-m-d'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号',anchor : '90%',width: 200},
		'estimateNo' : {
	        name : 'estimateNo',
	        fieldLabel : '对应概算',
            width: 200
		 },
		'treeUids' : {name : 'treeUids',fieldLabel : '合同分类树主键'},
		'remark' : {name : 'remark', fieldLabel : '备注',width: 200,anchor : '90%'}//xtype: 'htmleditor',
	}
	
	var columnsEquBody = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'equNo', type : 'string'},
		{name : 'equName', type : 'string'},
		{name : 'createDate',type : 'date',dateFormat: 'Y-m-d H:i:s'},
		{name : 'conid', type : 'string'},
		{name : 'treeUids', type : 'string'},
		{name : 'ggxh',type : 'string'},
		{name : 'estimateNo',type : 'string'},
		{name : 'remark' , type : 'string' }
	];
   dsEquBody = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : beanEquBody,
			business : businessEquBody,
			method : listMethodEquBody,
			params : ''
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, columnsEquBody),
		remoteSort : true,
		pruneModifiedRecords : true, // 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		sortInfo: {field: "uids", direction: "DESC"}
	});
	
    var cmEquBody = new Ext.grid.ColumnModel([
		smEquBody,{
			id : 'uids',
			header : fcEquBody['uids'].fieldLabel,
			dataIndex : fcEquBody['uids'].name,
			hidden : true
		}, {
            id : 'PID',
			header : fcEquBody['pid'].fieldLabel,
			dataIndex : fcEquBody['pid'].name,
			hidden : true
		}, {
			id : 'equNo',
			header : fcEquBody['equNo'].fieldLabel,
			dataIndex : fcEquBody['equNo'].name,
			width : 200
	      }, {
			id : 'equName',
			header : fcEquBody['equName'].fieldLabel,
			dataIndex : fcEquBody['equName'].name,
			width : 100
		}, {
			id : 'createDate',
			header : fcEquBody['createDate'].fieldLabel,
			dataIndex : fcEquBody['createDate'].name,
			width : 100,
			renderer : formatDate 
		}, {
			id : 'estimateNo',
			header : fcEquBody['estimateNo'].fieldLabel,
			dataIndex : fcEquBody['estimateNo'].name,
			renderer:function(value){
				for(var i=0;i<bdgArr.length;i++){
					if(bdgArr[i][0]==value){
						return bdgArr[i][1];
					}
				}
			},
			width : 150
		}, {
			id : 'ggxh',
			header : fcEquBody['ggxh'].fieldLabel,
			dataIndex : fcEquBody['ggxh'].name,
			renderer : rendererColumnColorFun,
			editor : new fmEquBody.TextField(fcEquBody['ggxh']),
			width : 100
		}, {
			id : 'conid',
			header : fcEquBody['conid'].fieldLabel,
			dataIndex : fcEquBody['conid'].name,
			hidden : true
		}, {
			id : 'treeUids',
			header : fcEquBody['treeUids'].fieldLabel,
			dataIndex : fcEquBody['treeUids'].name,
			hidden : true
		}, {
			id : 'remark',
			header : fcEquBody['remark'].fieldLabel,
			dataIndex : fcEquBody['remark'].name,
			width : 300
		}]);
	var plantBody = Ext.data.Record.create(columnsEquBody);
	var plantIntBody = {
			uids : '',
			pid : CURRENTAPPID,
			equNo : '',
			equName : '',
			equParts : '',
			createDate : '',
			conid : selectConid,
			treeUids : selectUuid,
			remark : '',
			totalMoney : '',
			delOrUpdate : '1'
		}
		
	var saveBtnBody = new Ext.Button({
  		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveBtnBodyFn
	})
	gridEquBody = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : dsEquBody,
		cm : cmEquBody, // 列模型
		sm : smEquBody,
		tbar :  ['<font color=#15428b><B>合同主体设备<B></font>','-',saveBtnBody,'-'],
		border : false,
		addBtn : false, // 是否显示新增按钮
        saveBtn : false, // 是否显示保存按钮
        delBtn : false, // 是否显示删除按钮
		enableHdMenu : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsEquBody,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : plantBody,
		plantInt : plantIntBody,
		servletUrl : MAIN_SERVLET,
		bean : beanEquBody,
		primaryKey : primaryKeyEquBody
	});
	cmEquBody.defaultSortable = true;
	
    storeSelects(dsEquBody,smEquBody);
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function saveBtnBodyFn(){
    	var record = smEquBody.getSelections();
    	if(record == null || record == ""){
    	    Ext.example.msg('提示信息', '请修改您要修改的记录在保存！');
			return;
    	}
    	gridEquBody.defaultSaveHandler();
    	smEquBody.clearSelections(true);
    }
})