
var ServletUrl = MAIN_SERVLET;
var bean = "com.sgepit.pmis.tenders.hbm.TenAbi";
var business = "baseMgm";
var listMethod = "findorderby";
var primaryKey = "peoid";
var orderColumn = "peoid";
var gridPanelTitle = "";
var formPanelTitle = "编辑记录（查看详细信息）";
var pageSize = PAGE_SIZE;
var SPLITB = "`";
var pid = PID;
var propertyName = "peoid";
var propertyValue = "";
var changeTypes = new Array();

Ext.onReady(function (){

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
		
	// 1. 创建选择模式
    var sm = new Ext.grid.RowSelectionModel();
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('性别',function(list){		//性别
    	for (i = 0; i < list.length; i ++ ){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
    
    DWREngine.setAsync(true);

    var changeTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : changeTypes
    });
    
    var fc = {		// 创建编辑域配置
    	 'peoid': {
			name: 'peoid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '招投标编码',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'peono': {
			name: 'peono',
			fieldLabel: '序号',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'peoname': {
			name: 'peoname',
			fieldLabel: '姓名',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'peodept': {
			name: 'peodept',
			fieldLabel: '单位',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peoduty': {
			name: 'peoduty',
			fieldLabel: '学历',
            readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peospeci': {
			name: 'peospeci',
			fieldLabel: '专业',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'reomark': {
			name: 'reomark',
			fieldLabel: '职务',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peotecspec': {
			name: 'peotecspec',
			fieldLabel: '部门',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'peotecfield': {
			name: 'peotecfield',
			fieldLabel: '从事领域',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peosex': {
			name: 'peosex',
			fieldLabel: '性别',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peotel': {
			name: 'peotel',
			fieldLabel: '电话',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peoemail': {
			name: 'peoemail',
			fieldLabel: '电子邮箱',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'peotecpost': {
			name: 'peotecpost',
			fieldLabel: '职称',
			readOnly:true,
			//hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }
         
    };
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm,						//第0列，checkbox,行选择器
    	{
           id:'peoid',
           header: fc['peoid'].fieldLabel,
           dataIndex: fc['peoid'].name,
           hidden: true,
           width: 60
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
          
           width: 120
        },{
           id:'peono',
           header: fc['peono'].fieldLabel,
           dataIndex: fc['peono'].name,
          renderer: renderTenNo,                        /*jhfghfgbfdgdfgfg*/
           width: 120
        },{
           id:'peoname',
           header: fc['peoname'].fieldLabel,
           dataIndex: fc['peoname'].name,
           //hidden: true,
           width: 120
        },{
           id:'peosex',
           header: fc['peosex'].fieldLabel,
           dataIndex: fc['peosex'].name,
           //renderer: 'usMoney',
        //   hidden: true,
           width: 120
        },{
           id:'peotel',
           header: fc['peotel'].fieldLabel,
           dataIndex: fc['peotel'].name,
        //   renderer: formatDate,
           width: 120
        },{
           id:'peodept',
           header: fc['peodept'].fieldLabel,
           dataIndex: fc['peodept'].name,
           //renderer: formatDate,
           width: 120

        },{
           id:'peotecspec',
           header: fc['peotecspec'].fieldLabel,
           dataIndex: fc['peotecspec'].name,
          // renderer: formatDate,
           width: 120
        },{
           id:'peoduty',
           header: fc['peoduty'].fieldLabel,
           dataIndex: fc['peoduty'].name,
           width: 70,
           align: 'right'
           //renderer: 'usMoney',
          // editor: new fm.NumberField(fc['tenprinc'])
        },{
           id:'peospeci',
           header: fc['peospeci'].fieldLabel,
           dataIndex: fc['peospeci'].name,
           width: 90
          //renderer: 'usMoney'
          // editor: new fm.DateField(fc['teninputdate'])
        },
        
        
        {
           id:'reomark',
           header: fc['reomark'].fieldLabel,
           dataIndex: fc['reomark'].name,
           //renderer: 'usMoney',
          // hidden: true,
           width: 120
        },{
           id:'peotecfield',
           header: fc['peotecfield'].fieldLabel,
           dataIndex: fc['peotecfield'].name,
         //  hidden: true,
           width: 120

        },
        
        
        {
           id:'peoemail',
           header: fc['peoemail'].fieldLabel,
           dataIndex: fc['peoemail'].name,
          // hidden: true,
           width: 120
        },{
           id:'peotecpost',
           header: fc['peotecpost'].fieldLabel,
           dataIndex: fc['peotecpost'].name,
         //  hidden: true,
           width: 120

        }
    
    ]);
    cm.defaultSortable = true;						//设置是否可排序
	
    // 3. 定义记录集
    var Columns = [
    	{name: 'peoid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'peono', type: 'string'},
		{name: 'peoname', type: 'string'},
		{name: 'peodept', type: 'string'},
		{name: 'peoduty', type: 'string'},
		{name: 'peospeci', type: 'string'},
		
		{name: 'reomark', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'peotecspec', type: 'string'},
		{name: 'peotecfield', type: 'string'},
		{name: 'peosex', type: 'string'},
		{name: 'peotel', type: 'string'},
		{name: 'peoemail', type: 'string'},
		{name: 'peotecpost', type: 'string'}
	];
	var Fields = Columns.concat([
	{name: 'peoid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'peono', type: 'string'},
		{name: 'peoname', type: 'string'},
		{name: 'peodept', type: 'string'},
		{name: 'peoduty', type: 'string'},
		{name: 'peospeci', type: 'string'},
		
		{name: 'reomark', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'peotecspec', type: 'string'},
		{name: 'peotecfield', type: 'string'},
		{name: 'peosex', type: 'string'},
		{name: 'peotel', type: 'string'},
		{name: 'peoemail', type: 'string'},
		{name: 'peotecpost', type: 'string'}
	]);
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantFields = Ext.data.Record.create(Fields);
    var PlantFieldsInt = new Object();
    
    var PlantInt = {
    				peono: "", 
    				 peoid: '0', 
    				pid:pid,
    				peoname: '', 
    				peodept: '',
    				peoduty: '', 
    				peospeci: '' ,
    				
    				reomark:'',
		    		peotecspec :'',
		    		peotecfield:'',
		    		peosex:'',
		    		peotel :'',
		    		peoemail:'',
		    		peotecpost:''
    				}	//设置初始值

    Ext.applyIf(PlantFieldsInt, PlantInt);
    PlantFieldsInt = Ext.apply(PlantFieldsInt, {tenname: '', tendept: '', tenprinc: ''});
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: null
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: ServletUrl
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.EditorGridTbarPanel({
        // basic properties
    	id: 'grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        //renderTo: 'editorgrid',	//所依附的DOM对象，可选
       tbar:[ /*'-', addBtn, '-', editBtn, '-', delBtn*/],//顶部工具栏，可选



        
        //width : 800,				//宽
        height: 300,				//高
        title: gridPanelTitle,		//面板标题
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        //frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        
        
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: pageSize,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
         
        // expend properties
        plant: Plant,				//初始化记录集，必须
      	plantInt: PlantInt,			//初始化记录集配置，必须
      	servletUrl: ServletUrl,		//服务器地址，必须
      	bean: bean,					//bean名称，必须
      	business: business,	//business名称，可选
      	primaryKey: primaryKey,		//主键列名称，必须
      	insertHandler: insertFun,	//自定义新增按钮的单击方法，可选  
   // updateHandler: updateFun,	//自定义修改方法，可选
    saveHandler: updateFun,		//自定义保存方法，可选
	//deleteHandler: null,	//自定义删除方法，可选
	//formHandler: null, 		//自定义表单方法，可选 
	crudText: {
	   save:'修改'
	
	},			//自定义按钮文字，可选，可部分设置add/save/del中的一个
	notifyChanges: true,	//数据加载之前是否提示未保存
		form: false
		
   });
	
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("tenid");
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
		                text: '新建',
		                iconCls: 'add',
		                handler : insertFun//onAddNode
                    },{
		                text: '修改',   
		                iconCls: 'btn',   
		                id: data,   
		                handler: updateFun//toHandler
                    }, '-', {
		                text: '删除',   
		                iconCls: 'remove',
		                handler : deleteFun
                	}]
	    });
	
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}
       
    // 7. 创建内容面板content-panel，加入grid-panel和form-panel
    var contentPanel = new Ext.Panel({
        id: 'content-panel',
        border: false,
        region: 'center',
        split: true,
        layout: 'border',
        layoutConfig: {
        	height: '100%'
        },
        items: [grid]
    });
    
	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout: 'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [contentPanel]
        });
    }
    
	grid.getTopToolbar().add('->')
	grid.getTopToolbar().add(btnReturn);/*'-', addBtn, '-', editBtn, '-', delBtn*/

	
	
	
	// 11. 事件绑定
    sm.on('rowselect',function(sm,rowIndex, record){
    
    	var record = sm.getSelected();
		    tenid = record.get("peoid").value;
		
		if (formDialogWin!=null && !formDialogWin.hidden){
    		loadForm()
    	}
	});
    grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
    	var record = grid.getStore().getAt(rowIndex);
        var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
        var data = record.get(fieldName);
        
    	//alert("fieldName:"+fieldName+"\ndata:"+data);
    	if (fieldName == 'peono')
    	   showEditPage();
    		//window.location.href = baseUrl+"Business/tenders/tender.baseInfo.edit.jsp";
    });
    
    // 12. 加载数据
    ds.load({params:{
	    	start: 0,
	    	limit: pageSize
    	}
    });
    
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

    function insertFun(){
        window.location.href = baseUrl+"Business/tenders/tender.tenabiInfo.edit.jsp";//"?tenid='" + param + "'&tid='" + selectedConId + "'";
    
    };
    function updateFun(){
     var selectRow = sm.getSelected();
        var param = null;
        if (selectRow)
        param = selectRow.get('peoid');
        window.location.href = baseUrl+"Business/tenders/tender.tenabiInfo.edit.jsp?peoid='" + param + "'&tid='" + selectedConId + "'";
        
    };
    
     function deleteFun(){
     var selectRow = sm.getSelected();
        var param = null;
        if (selectRow)
        param = selectRow.get('peoid');
       // window.location.href = baseUrl+"Business/tenders/tender.baseInfo.edit.jsp?tenid='" + param + "'&tid='" + selectedConId + "'";
     DWREngine.setAsync(false);
   		tendersMgm.delTenAbi(param, function(flag){
   			if ("0" == flag){
   				Ext.example.msg('删除成功！', '您成功删除了一条招投标信息！');
   			}else{
   				Ext.Msg.show({
					title: '提示',
					msg: '数据删除失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
   			}
   		});
   		DWREngine.setAsync(true);
    
    window.location.href = baseUrl+"Business/tenders/tender.tenabiInfo.input.jsp";
    };
 
    //选择id
    function renderTenNo(value){
		var output = "<span onmouseover=\"this.style.color='red';this.style.cursor='hand'\""
		output += "onmouseout=\"this.style.color='black';this.style.cursor='default'\">"+value+"<span>"
		return output;
	}
	
	function showEditPage(){
		var selectRow = sm.getSelected();
        var param = null;
        if (selectRow)
        param = selectRow.get('peoid');
        window.location.href = baseUrl+"Business/tenders/tender.tenabiInfo.edit.jsp?peoid='" + param + "'&tid='" + selectedConId + "'";
	}
	
    function loadForm(){
		if(!formDialogWin) return;
    	var form = formPanel.getForm()
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    				form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanel.buttons[0].enable()
    			formPanel.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		formPanel.buttons[0].enable()
			    		formPanel.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		//form.reset()
    		formPanel.buttons[0].disable()
    	}    
    }
    
    function formSave(){
    	var form = formPanel.getForm()
    	var ids = form.findField(primaryKey).getValue()
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)
	    	} else {
	    		doFormSave(false)
	    	}
	    }
    }
    
    function doFormSave(isNew, dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Fields.length; i++) {
    		var n = Fields[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	var dataArr = '[' + Ext.encode(obj) + ']';
   		var r = sm.getSelected()
   		form.updateRecord(r);
		if (isNew)
		{
   			//r.commit();
			grid.doSave(dataArr, 1, 1, function(flag, n){
				r.isNew = !flag
				formPanel.isNew = !flag
			});
   		}
   		else
   		{
   			//r.commit();
			grid.doSave(dataArr, 1, 0);
		}
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }
    
    var formDialogWin;
   
    function showEditDialog(){
		if(!formDialogWin){
	       formDialogWin = new Ext.Window({
                title:formPanelTitle,
                layout:'fit',
                width:500,
                height:330, 
                closeAction:'hide',
                plain: true,
                //modal: true,
                items: formPanel,
                animEl: 'action-new'
            });
        }
        formDialogWin.show();
        loadForm();
    }
   
  
  
  
   
    // 下拉列表中 k v 的mapping 
   	function changeTypesRender(value){	//变更类型
   		var str = '';
   		for(var i=0; i<changeTypes.length; i++) {
   			if (changeTypes[i][0] == value) {
   				str = changeTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});




