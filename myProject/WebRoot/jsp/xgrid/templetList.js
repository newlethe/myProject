var gridPanel;
var ds,sm;
var bean = "com.sgepit.frame.xgridTemplet.hbm.SgprjTempletConfig";
var business = "sgprjTempletConfigService";
var listMethod = "findorderby";
var primaryKey = "templetSn";
var orderColumn = "templetSn";
var selectRowIndex;
var templetTypeSt ,templetTypeArr,unitStore,unitArr;
Ext.onReady(function(){
  templetTypeSt = new Ext.data.SimpleStore({
	   fields : ['val','txt']
   })
   
  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  })
  DWREngine.setAsync(false);	
  db2Json.selectSimpleData("select code_id,code_note from sgprj_property_code where code_type='PROJECT_TYPE'",function(data){
	     templetTypeArr = eval(data);
         templetTypeSt.loadData(templetTypeArr)
  });
  
  db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
	});
  DWREngine.setAsync(true);
  
      //单位
  unitBox = new Ext.form.ComboBox({
        emptyText : '请选择单位',
        id : 'unitOperations',
        store : unitStore,
        allowBlank : false,
        displayField : 'txt',
        valueField : 'val', 
        width : 220,
        editable : false,
        typeAhead : id,
        triggerAction : 'all',
        mode : 'local',
        tpl: "<tpl for='.'><div style='height:220px'><div id='unittree'></div></div></tpl>",   
	    selectOnFocus:true
    });
  
  var unitTreeNodeUrl = BASE_PATH + "servlet/SysServlet?ac=unitTree&year=all" ;
  var unitTree =  new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
                 dataUrl : unitTreeNodeUrl+"&parentId=0",
                 requestMethod: "POST"
            }),
        border : false,
        checkModel : "single",
        root : new Ext.tree.AsyncTreeNode({
             text : '单位',
             id: '0',
             expanded : true
           }),
        rootVisible : false   
  })
   unitTree.on('beforeload',function(node){
	    unitTree.loader.dataUrl = unitTreeNodeUrl+"&parentId="+node.id;
  })
  
  unitTree.on('load',function(node){
         if(unitTree.root.id==node.id){
            if(node.firstChild)
            node.firstChild.expand();
         }
  });
  unitBox.on('expand',function(){   
        unitTree.render('unittree');  
    });   
    
  unitTree.on('click',function(node){   
       	unitBox.setValue(node.id); 
       	selectUnit = node.id;
       	unitBox.collapse(); 
    }); 
  var fc = {		// 创建编辑域配置
    	'templetSn': {
			name: 'templetSn',
			fieldLabel: '主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        },'templetType': {
			name: 'templetType',
			fieldLabel: '模板类型',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'txt',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: templetTypeSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
        }, 'sjType': {
			name: 'sjType',
			fieldLabel: '年度',
			allowBlank: false,
			anchor:'95%'
		}, 'unitId': {
			name: 'unitId',
			fieldLabel: '单位',
			anchor:'95%'
		}, 'category': {
			name: 'category',
			fieldLabel: '表头',
            allowNegative: false,
            allowDecimals: false,
			anchor:'95%'
        }, 'templetFile': {
			name: 'templetFile',
			fieldLabel: '模板文件',
			anchor:'95%'
		}, 'note': {
			name: 'note',
			fieldLabel: '说明',
			anchor:'95%'
		}
	};
	
	var Columns = [
    	{name: 'templetSn', type: 'string'},			//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'templetType', type: 'string'},		
		{name: 'sjType', type: 'string'},
		{name: 'unitId', type: 'string'},    	
		{name: 'category', type: 'string'},
		{name: 'templetFile', type: 'string'},
		{name: 'note', type:'string'}];
    var Fields = Columns;
		
    var Plant = Ext.data.Record.create(Columns);
    
    var PlantInt = {
        templet : '',
        templetType : '',
        sjType : '',
        unitId : '',
        category : '',
        note : ''
    };
    
    sm = new Ext.grid.CheckboxSelectionModel();
    
    var cm = new Ext.grid.ColumnModel([
         sm,{
            id : 'templetSn',
            name : 'templetSn',            
            header : fc.templetSn.fieldLabel,
            dataIndex : fc.templetSn.name,
            hidden:true,
            width: 100
         },{
            id : 'templetType',
            name : 'templetType',
            header : fc.templetType.fieldLabel,
            dataIndex : fc.templetType.name,
            width : 200,
            renderer: function(value){
           	 for(var i=0; i<templetTypeArr.length; i++){
           	 	if (value == templetTypeArr[i][0])
           	 		return templetTypeArr[i][1]
           	 }
           },
            editor: new Ext.form.ComboBox(fc['templetType'])
         },{
         	id : 'sjType',
         	id:'sjType',
         	header : fc.sjType.fieldLabel,
         	dataIndex : fc.sjType.name,
         	width : 50,
         	editor: new Ext.form.NumberField(fc['sjType'])
         }, {
           id:'unitId',
           id:'unitId',
           header: fc['unitId'].fieldLabel,
           dataIndex: fc['unitId'].name,
           width: 100,
           renderer: function(value){
           	 for(var i=0; i<unitArr.length; i++){
           	 	if (value == unitArr[i][0])
           	 		return unitArr[i][1]
           	 }
           },
           editor: unitBox          
        },{
           id: 'category',
           name: 'category',           
           header : fc.category.fieldLabel,
           dataIndex : fc.category.name,
           width : 70,
           renderer : function(value,m,rec){
                return "<U onclick=openView('"+rec.data.templetSn+"') style = 'cursor:hand;'>" + "预览表头" + "</U>";
           }            
        },{
           id : 'templetFile',
           name : 'templetFile', 
           header : fc.templetFile.fieldLabel,
           dataIndex : fc.templetFile.name,
           renderer : function(value,m,rec){
                return "<U onclick=openExcel('"+value+"','"+rec.data.templetSn+"','"+rec.data.templetType+"') style = 'cursor:hand;'>" + "配置" + "</U>";
           },
           width : 70
        },{
           id : 'note',
           name : 'note',
           header: fc.note.fieldLabel,
           dataIndex : fc.note.name,
           width : 150,
           editor: new Ext.form.TextField(fc['note'])            
        }
     ]);
     
    cm.defaultSortable = true;						//设置是否可排序
    
    
     ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params:""
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
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
   sm.on('rowselect', function(sm, rowIdx, r){
         selectRowIndex = rowIdx;
   });
    
   gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'org-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: "xgrid模板配置",		//面板标题
        iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        //ctCls: 'borderLeft',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "sgprjTempletConfigService",
      	saveMethod : 'updateSgprjTempletConfig',
      	insertMethod : 'insertSgprjTempletConfig',
      	deleteMethod : 'deleteSgprjTempletConfig',
      	primaryKey: primaryKey
	});
	
	ds.on('load',function(){
		if(checkFlag=='true'){
	        sm.selectRow(rowIndex,true);
	        checkFlag ='false';
	        start = 0;
		}
	});
	
    var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[gridPanel]
    });		
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[contentPanel]
    });
    ds.load({		
       params : {
			start : start, // 起始序号
			limit : PAGE_SIZE
		// 结束序号，若不分页可不用设置这两个参数
		}
    });
});

function openExcel(templetFile,templetSn,templetType) {
	if(templetSn && templetSn != 'undefined' &&templetSn!=null&&templetSn!=''&&templetSn!='null'){
	   var start = ds.lastOptions.params.start;
	   var row = new Object();
	   row.fileId = templetFile;
	   row.id = templetSn;
	   row.templet_type = templetType;
	   row.window = window;
	   row.start = start;
	   row.rowIndex = selectRowIndex;
	   url = basePath+"jsp/xgrid/eTable.jsp";
	   window.showModelessDialog(url, row, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}else{
	   Ext.MessageBox.alert("提示","请保存信息后再配置页面！");
	}
}


function openView( templetSn ) {
	if(templetSn != 'undefined' &&templetSn!=null&&templetSn!=''&&templetSn!='null'){
	   DWREngine.setAsync(false);
	   var param = new Object() ;
	   var data ;
	   sgprjTempletConfigService.getXgridHeader(templetSn,function(dat){
	        data = dat;
	   })
	   if(data&&data!=null&&data!=''){
	      param.head = data;
	      window.showModelessDialog(basePath + "dhtmlxGridCommon/template/xgridview.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
	   }else{
	      Ext.MessageBox.alert("提示","请配置好页面之后再预览表头！");
	   }
       DWREngine.setAsync(true);
	}else{
	   Ext.MessageBox.alert("提示","请保存信息并配置好页面后再预览表头！");
	}
}