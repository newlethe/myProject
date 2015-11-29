var fileGridPanel
var filePlantInt
var fileDs
var smFile
var beanFile = "com.sgepit.pmis.zlaq.hbm.ZlaqFile";
var business = "zlaqMgmImpl";
var listMethod = "findByProperty";
var primaryKey = "lsh";
var orderColumn = "fileLsh";
var fileGridPanelTitle = "工程文件";
var defaultZlaqRootId = "T";
var paramStr = "type" + SPLITB +defaultZlaqRootId;
var paramStrCur = paramStr;
var SPLITB = "`";
var selectedZlaqId = defaultZlaqRootId;
Ext.onReady(function() {
var 用户信息
//fileGridPanel--------------------------------------------------------------------------------------------------	
	var fm = Ext.form;			// 包名简写（缩写）
    var fcFile = {		// 创建编辑域配置
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
        }, 'modelid': {
			name: 'modelid',
			fieldLabel: '模板流水号',
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
			anchor:'95%'
		}, 'transId': {
			name: 'transId',
			fieldLabel: '传输编号',
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
			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
			anchor:'95%'
		}, 'memod1': {
			name: 'memod1',
			fieldLabel: '上传时间',
			height: 120,
			width: 600,
			anchor:'95%'
		}
	};
	
    var ColumnsFile = [
    	{name: 'lsh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'name', type: 'string'},
    	{name: 'type', type: 'string'},
    	{name: 'modelid', type: 'string'},
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
		
	var FieldsFile = ColumnsFile.concat([ // 表单增加的列
	      
		]);
	
    var filePlant = Ext.data.Record.create(ColumnsFile);			//定义记录集
    filePlantInt = {
		lsh: '',
		name: '',
		type: '',
		modelid: '',
		fileLsh: '',
		fileName: '',
		isCompress: '',
		author: '',
		version: '',
		transFlag: '',
		transId: '',
		billState: '',
		memod1: '',
		memo: ''
    };
    
    smFile =  new Ext.grid.CheckboxSelectionModel();
    var cmFile = new Ext.grid.ColumnModel([		// 创建列模型
    	smFile, {
           id:'lsh',
           header: fcFile['lsh'].fieldLabel,
           dataIndex: fcFile['lsh'].name,
           hidden:true,
           width: 200
        }, {
           id:'name',
           header: fcFile['name'].fieldLabel,
           dataIndex: fcFile['name'].name,
           width: 120
           ,editor: new fm.TextField(fcFile['name'])
        }, {
           id:'type',
           header: fcFile['type'].fieldLabel,
           dataIndex: fcFile['type'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['type'])
        }, {
           id:'modelid',
           header: fcFile['modelid'].fieldLabel,
           dataIndex: fcFile['modelid'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['modelid'])
        }, {
           id:'author',
           header: fcFile['author'].fieldLabel,
           dataIndex: fcFile['author'].name,
//           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['author'])
           ,renderer: function(value){
           	  for(var i=0; i<dsUser.getCount(); i++){
           	  	if (value == dsUser.getAt(i).get('userid'))
           	  		return dsUser.getAt(i).get('realname')
           	  }
           }
        }, {
           id:'memod1',
           header: fcFile['memod1'].fieldLabel,
           dataIndex: fcFile['memod1'].name,
//           hidden:true,
           width: 20
//           ,editor: new fm.TextField(fcFile['memod1'])
           ,renderer:formatDateTime
        }, {
           id:'fileLsh',
           header: fcFile['fileLsh'].fieldLabel,
           dataIndex: fcFile['fileLsh'].name,
//           hidden:true,
           width: 20
//           ,editor: new fm.TextField(fcFile['fileLsh'])
           ,renderer : fileicon
        }, {
           id:'fileName',
           header: fcFile['fileName'].fieldLabel,
           dataIndex: fcFile['fileName'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['fileName'])
        }, {
           id:'isCompress',
           header: fcFile['isCompress'].fieldLabel,
           dataIndex: fcFile['isCompress'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['isCompress'])
        }, {
           id:'version',
           header: fcFile['version'].fieldLabel,
           dataIndex: fcFile['version'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['version'])
        }, {
           id:'transFlag',
           header: fcFile['transFlag'].fieldLabel,
           dataIndex: fcFile['transFlag'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['transFlag'])
        }, {
           id:'transId',
           header: fcFile['transId'].fieldLabel,
           dataIndex: fcFile['transId'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['transId'])
        }, {
           id:'billState',
           header: fcFile['billState'].fieldLabel,
           dataIndex: fcFile['billState'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['billState'])
        }, {
           id:'memo',
           header: fcFile['memo'].fieldLabel,
           dataIndex: fcFile['memo'].name,
           hidden:true,
           width: 120
//           ,editor: new fm.TextField(fcFile['memo'])
		}
	]);
    cmFile.defaultSortable = true;						//设置是否可排序

    fileDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanFile,				
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
        }, ColumnsFile),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    fileDs.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
	fileGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'file-grid-panel',
        ds: fileDs,
        cm: cmFile,
        sm: smFile,
        tbar: [],
        title: fileGridPanelTitle,
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
            store: fileDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        filePlant: filePlant,				
      	filePlantInt: filePlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanFile,					
      	business: business,	
      	primaryKey: primaryKey,		
      	insertHandler: insertFileFun,
      	saveHandler : saveFileFun,
      	deleteHandler: deleteFileFun,
		//insertMethod: 'insertFile',
		saveMethod: 'updateFile',
		deleteMethod: 'deleteFile'
	});
	//fileGridPanel.on('dblclick',showFormWin)
	//smFile.on('selectionchange', orgGridRowSelected);
//fileGridPanel--------------------------------------------------------------------------------------------------	

});

    function insertFileFun(){
    	//fileGridPanel.defaultInsertHandler();
		var param =new Object()
		param.businessId = "";//selectedZlaqId;
		param.businessType = "gcwj_"+selectedZlaqId;
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
			zlaqMgmImpl.insertFileIDS(fileLshIds,selectedZlaqId,USERID,"",function(rtn){
				if(rtn){
					Ext.Msg.alert("提示","上传成功！")
					loadGrid()
				}else{
					Ext.Msg.alert("提示","上传失败！")
				}
			});
		}
    }
    function deleteFileFun(){
    	if (smFile.getCount() > 0) {
    		Ext.Msg.confirm("确认删除吗？", "用户被删除后，将不可恢复！", function(){
    			fileGridPanel.defaultDeleteHandler(); 
    		})
    	}
    }    
    function saveFileFun(){
    	fileGridPanel.defaultSaveHandler();
    }        
	function closeUploadWindow(flag,fileLshUploads){
		alert(fileLshUploads)
	}
