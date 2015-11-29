var fileModelGridPanel
var fileModelPlantInt
var fileModelDs
var smFileModel
var beanFileModel = "com.sgepit.pmis.zlaq.hbm.ZlaqFilemodel";
var business = "zlaqMgmImpl";
var listMethod = "findByProperty";
var primaryKey = "lsh";
var orderColumn = "fileLsh";
var fileModelGridPanelTitle = "工程文件模板";
var defaultZlaqRootId = "T";
var paramStr = "type" + SPLITB +defaultZlaqRootId;
var paramStrCur = paramStr;
var SPLITB = "`";
var selectedZlaqId = defaultZlaqRootId;

Ext.onReady(function() {
var 用户信息
//fileModelGridPanel--------------------------------------------------------------------------------------------------	
var fm = Ext.form;			// 包名简写（缩写）
    var fcFileModel = {		// 创建编辑域配置
    	'lsh': {
			name: 'lsh',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'name': {
			name: 'name',
			fieldLabel: '文件名称',
			//readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}, 'type': {
			name: 'type',
			hiddenName: 'type',
			fieldLabel: '文件分类',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '男'],['1', '女']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'fileLsh': {
			name: 'fileLsh',
			fieldLabel: '文件流水号',
			anchor:'95%'
		}, 'fileName': {
			name: 'fileName',
			fieldLabel: '物理文件名称',
			anchor:'95%'
		}, 'isCompress': {
			name: 'isCompress',
			hiddenName: 'isCompress',
			fieldLabel: '是否压缩',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '否'],['1', '是']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			readOnly:true,
			hidden:true,
			hideLabel: true,
			anchor:'95%'
		}, 'author': {
			name: 'author',
			fieldLabel: '上传人',
			readOnly:true,
			anchor:'95%'
		}, 'version': {
			name: 'version',
			fieldLabel: '版本号',
			readOnly:true,
			anchor:'95%'
		}, 'transFlag': {
			name: 'transFlag',
			hiddenName: 'transFlag',
			fieldLabel: '传输标志',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '否'],['1', '是']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			readOnly:true,
			hidden:true,
			hideLabel: true,
			anchor:'95%'
		}, 'transId': {
			name: 'transId',
			fieldLabel: '传输编号',
			readOnly:true,
			hidden:true,
			hideLabel: true,
			anchor:'95%'
		}, 'billState': {
			name: 'billState',
			hiddenName: 'billState',
			fieldLabel: '流程状态',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '未开始'],['1', '已审批'],['-1', '流程中']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			readOnly:true,
			hidden:true,
			hideLabel: true,
			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
			height: 120,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'memod1': {
			name: 'memod1',
			fieldLabel: '上传时间',
			height: 120,
			width: 600,
			anchor:'95%'
		}
	};
	
    var ColumnsFileModel = [
    	{name: 'lsh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'name', type: 'string'},
    	{name: 'type', type: 'string'},
    	{name: 'fileLsh', type: 'string'},
		{name: 'fileName', type: 'string'},
    	{name: 'isCompress', type: 'string'},
		{name: 'author', type: 'string'},
		{name: 'version', type: 'string'},
		{name: 'transFlag', type: 'string'},
		{name: 'transId', type: 'string'},
		{name: 'billState', type: 'string'},
		{name: 'memod1', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'memo', type: 'string'}
		];
		
	var FieldsFileModel = ColumnsFileModel.concat([ // 表单增加的列
	      
		]);
	
    var fileModelPlant = Ext.data.Record.create(ColumnsFileModel);			//定义记录集
    fileModelPlantInt = {
		lsh: '',
		name: '',
		type: '',
		fileLsh: '',
		fileName: '',
		isCompress: '',
		author: '',
		version: '',
		transFlag: '',
		transId: '',
		billState: '',
		memod1:'',
		memo: ''
    };
    
    smFileModel =  new Ext.grid.CheckboxSelectionModel();
    var cmFileModel = new Ext.grid.ColumnModel([		// 创建列模型
    	smFileModel, {
           id:'lsh',
           header: fcFileModel['lsh'].fieldLabel,
           dataIndex: fcFileModel['lsh'].name,
           hidden:true,
           width: 200
        }, {
           id:'name',
           header: fcFileModel['name'].fieldLabel,
           dataIndex: fcFileModel['name'].name,
           width: 120
           ,editor: new fm.TextField(fcFileModel['name'])
        }, {
           id:'type',
           header: fcFileModel['type'].fieldLabel,
           dataIndex: fcFileModel['type'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['type'])
        }, {
           id:'author',
           header: fcFileModel['author'].fieldLabel,
           dataIndex: fcFileModel['author'].name,
//           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['author'])
           ,renderer: function(value){
           	  for(var i=0; i<dsUser.getCount(); i++){
           	  	if (value == dsUser.getAt(i).get('userid'))
           	  		return dsUser.getAt(i).get('realname')
           	  }
           }
        }, {
           id:'memod1',
           header: fcFileModel['memod1'].fieldLabel,
           dataIndex: fcFileModel['memod1'].name,
//           hidden:true,
           width: 20
//           ,editor: new fm.TextField(fcFileModel['memod1'])
           ,renderer:formatDateTime
        }, {
           id:'fileLsh',
           header: fcFileModel['fileLsh'].fieldLabel,
           dataIndex: fcFileModel['fileLsh'].name,
//           hidden:true,
           width: 20
//           ,editor: new fm.TextField(fcFileModel['fileLsh'])
           ,renderer : fileicon
        }, {
           id:'fileName',
           header: fcFileModel['fileName'].fieldLabel,
           dataIndex: fcFileModel['fileName'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['fileName'])
        }, {
           id:'isCompress',
           header: fcFileModel['isCompress'].fieldLabel,
           dataIndex: fcFileModel['isCompress'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['isCompress'])
        }, {
           id:'version',
           header: fcFileModel['version'].fieldLabel,
           dataIndex: fcFileModel['version'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['version'])
        }, {
           id:'transFlag',
           header: fcFileModel['transFlag'].fieldLabel,
           dataIndex: fcFileModel['transFlag'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['transFlag'])
        }, {
           id:'transId',
           header: fcFileModel['transId'].fieldLabel,
           dataIndex: fcFileModel['transId'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['transId'])
        }, {
           id:'billState',
           header: fcFileModel['billState'].fieldLabel,
           dataIndex: fcFileModel['billState'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['billState'])
        }, {
           id:'memo',
           header: fcFileModel['memo'].fieldLabel,
           dataIndex: fcFileModel['memo'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFileModel['memo'])
		}
	]);
    cmFileModel.defaultSortable = true;						//设置是否可排序

    fileModelDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanFileModel,				
	    	business: business,
	    	method: listMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsFileModel),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    fileModelDs.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
	fileModelGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'filemodel-grid-panel',
        ds: fileModelDs,
        cm: cmFileModel,
        sm: smFileModel,
        tbar: [],
        title: fileModelGridPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: fileModelDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: fileModelPlant,				
      	plantInt: fileModelPlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanFileModel,					
      	business: business,	
      	primaryKey: primaryKey,		
      	insertHandler: insertFileModelFun,
      	saveHandler : saveFileModelFun,
      	deleteHandler: deleteFileModelFun,
		//insertMethod: 'insertFileModel',
		saveMethod: 'updateFilemodel',
		deleteMethod: 'deleteFilemodel'
	});
	//fileModelGridPanel.on('dblclick',showFormWin)
	//smFileModel.on('selectionchange', orgGridRowSelected);
//fileModelGridPanel--------------------------------------------------------------------------------------------------	

});

	function insertFileModelFun() {
		var param =new Object()
		param.businessId = selectedZlaqId;
		param.businessType = "gcwjModel_"+selectedZlaqId;
		//如果保存数据库，则可以不用设置该参数，或者将fileSource设置为blob。 
		//	param.fileSource ="ftp" //保存到ftp
		//如果要对上传的文件进行压缩，则则可以不用设置该参数，或者将compressFlag设置为1。
		//param.compressFlag = 0	//不压缩
		var editable = true
		param.editable = editable
		param.whereCondition = "1=2"
//		showMultiFileWin(param)
		var sFeatures = "dialogWidth:600px;dialogHeight:400px;center:yes;resizable:yes;Minimize=yes;Maximize=yes"
		//rtn为返回的fileId值，多个文件ID以英文,进行分割
		var fileLshIds = window.showModalDialog(basePath + 
			"Business/jsp/common/fileUploadMulti/fileUploadSwf.jsp",param,sFeatures);
		if(fileLshIds){
			zlaqMgmImpl.insertFilemodelIDS(fileLshIds,selectedZlaqId,USERID,function(rtn){
				if(rtn){
					Ext.Msg.alert("提示","上传成功！")
					loadGrid()
				}else{
					Ext.Msg.alert("提示","上传失败！")
				}
			});
		}
	};
    function deleteFileModelFun(){
    	if (smFileModel.getCount() > 0) {
    		Ext.Msg.confirm("确认删除吗？", "用户被删除后，将不可恢复！", function(){
    			fileModelGridPanel.defaultDeleteHandler(); 
    		})
    	}
    }    
    function saveFileModelFun(){
    	fileModelGridPanel.defaultSaveHandler();
    }        
	function closeUploadWindow(flag,fileLshUploads){
		alert(fileLshUploads)
	}
