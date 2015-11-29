var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.document.hbm.DaZlJy";
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "uids"
var orderColumn = "jysj"
var depttitle = USERORG.split(",");
var gridPanelTitle = "部门档案资料借阅"
var formPanelTitle = "部门档案资料借阅信息"
var pageSize = PAGE_SIZE;
var treePanel
var formWin;
var win;
var viewport;
var formWindow,formWindow_xj;
var formPanel
var selectedTreeData = "";
var rootText = "资料分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var selectorgid;
var unitSt,jyrSt;
var orgdata='';
var openWin; user_Array = new Array(); unit_Array = new Array();user_Array_q = new Array();
var ghArray = [[1,'已归还'],[2,'已借出'],[3,'已续借']];
var currentPid = CURRENTAPPID;
Ext.onReady(function() {


		//获取单位
	DWREngine.setAsync(false);
 	baseMgm.getData('select unitid,unitname from sgcc_ini_unit',function(list){ 
 		var unitblank =new Array()
 		unitblank.push("all")
 		unitblank.push("全部")
 		unit_Array.push(unitblank)
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			unit_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 
	//获取用户
	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user ",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			user_Array.push(temp);
		}
    });

	var ghStr = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : ghArray
	});
	 unitSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : unit_Array
	});
    jyrSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data: [['','']]
	});
    
 	DWREngine.setAsync(true);
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "daTree",
			businessName : "zldaMgm",
			pid:currentPid,
			//orgid : orgdata,
			orgid : '',
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'da-tree-panel',
		region : 'west',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [
			{header : '资料名称',
			width : 260,
			dataIndex : 'mc'
		}, {
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
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		//baseParams.orgid = orgdata;
		baseParams.orgid = '';
		baseParams.parent = parent;

		})


	// /////////////////////////////////////////////////////////////////////////

	

	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '主键',hidden : true,hideLabel : true,anchor : '95%'},
		'dh' : {name : 'dh',fieldLabel : '档号',anchor : '95%'},
		'mc' : {name : 'mc',fieldLabel : '案卷题名',anchor : '95%'},
		'jyr' : {name : 'jyr',fieldLabel : '借阅人',anchor : '95%'},
		'ghstate' : {name : 'ghstate',fieldLabel : '归还状态',anchor : '95%'},
		'deptid' : {name : 'deptid',fieldLabel : '借阅人部门',anchor : '95%'},
		'fs' : {name : 'fs',fieldLabel : '借阅份数',anchor : '95%'},
		'jysj' : {name : 'jysj',fieldLabel : '借阅时间',width : 55,format : 'Y-m-d',anchor : '95%'},
		'jyghsj' : {name : 'jyghsj',fieldLabel : '应归还时间',width : 45,format : 'Y-m-d',anchor : '95%'},
		'ghsj' : {name : 'ghsj',fieldLabel : '实际归还时间',width : 45,format : 'Y-m-d',anchor : '95%'},
		'xjsj' : {name : 'xjsj',fieldLabel : '最后续借时间',anchor : '95%'},
		'xjcs' : {name : 'xjcs',fieldLabel : '续借次数',anchor : '95%'},
		'memo' : {name : 'memo',fieldLabel : '备注',allowBlank : false,anchor : '95%'},
		'memo1' : {name : 'memo1',fieldLabel : '备用1',allowBlank : false,anchor : '95%'},
		'memo2' : {name : 'memo2',fieldLabel : '备用2',allowBlank : false,anchor : '95%'}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		sm, 
		{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
		{id:'dh',header:fc['dh'].fieldLabel,dataIndex:fc['dh'].name },
		{id:'mc',header:fc['mc'].fieldLabel,dataIndex:fc['mc'].name },
		{id:'jyr',header:fc['jyr'].fieldLabel,dataIndex:fc['jyr'].name,width:90,renderer:function(value){
			for(var i = 0;i<user_Array.length;i++){
					if(value == user_Array[i][0]){
						return user_Array[i][1]
					}
				}
		}},
		{id:'fs',header:fc['fs'].fieldLabel,dataIndex:fc['fs'].name,width:90},
		{id:'deptid',header:fc['deptid'].fieldLabel,dataIndex:fc['deptid'].name,width:90,renderer:function(value){
			for(var i = 0;i<unit_Array.length;i++){
					if(value == unit_Array[i][0]){
						return unit_Array[i][1]
					}
				}
		}},
		{id:'ghstate', header:fc['ghstate'].fieldLabel,dataIndex:fc['ghstate'].name,width:90,renderer:function(value,s,record,store){
				if(record.data.jysj!="" && record.data.ghsj=="" && record.data.xjsj==""){
					return ghArray[1][1]
				}
				if(record.data.jysj!="" && record.data.ghsj!=""){
					return ghArray[0][1]
				}
				if(record.data.jysj!="" && record.data.ghsj=="" && record.data.xjsj!=""){
					return ghArray[2][1]
				}
				if(record.data.jysj==""){
				alert()
				}
			}
			
		},
		{id:'jysj',header:fc['jysj'].fieldLabel,dataIndex:fc['jysj'].name,width:90,renderer: formatDate},
		{id:'jyghsj',header:fc['jyghsj'].fieldLabel,dataIndex:fc['jyghsj'].name,width:90,renderer: function(value,cellmeta,record,rowIndex,columnIndex,store){
			var xjsjD="";
			if(record.data.xjsj!=""){
				var s=record.data.xjsj.split(",");
				xjsjD=s[s.length-1]
			}
			if(xjsjD!=""){//如果有续借时间，则在最后一次续借时间上加15天
				if(DateCompare(formatDate(new Date()),xjsjD)>15){
					return "<font color='red'>"+ addDate(4,15,formatDate_(new Date(xjsjD.replace(/\-/g, '/'))))+"</font>" ;
				}else{
//					return addDate(4,15,formatDate_(new Date(xjsjD.replace(/\-/g, '/')))); 
					if(record.data.xjcs == 1){
					  return addDate(4,30,formatDate_(record.data.jysj)); 
					}else if(record.data.xjcs == 2){
					  return addDate(4,45,formatDate_(record.data.jysj)); 
					}
				}
			}else{//没有续借则在借阅时间上加15天
				return addDate(4,15,formatDate_(record.data.jysj));
			}
		}},
		{id:'ghsj',header:fc['ghsj'].fieldLabel,dataIndex:fc['ghsj'].name,width:90,renderer: formatDate},
		{id:'xjsj',header:fc['xjsj'].fieldLabel,dataIndex:fc['xjsj'].name,width:90,renderer:function(value){
			if(value!=""){
				var s=value.split(",");
				return s[s.length-1]
			}
		}},
		{id:'xjcs',header:fc['xjcs'].fieldLabel,dataIndex:fc['xjcs'].name,width:90},
		{id:'memo',header:fc['memo'].fieldLabel,dataIndex:fc['memo'].name,width:90},
		{id:'memo1',header:fc['memo1'].fieldLabel,dataIndex:fc['memo1'].name,width:90,hidden:true},
		{id:'memo2',header:fc['memo2'].fieldLabel,dataIndex:fc['memo2'].name,width:90,hidden:true}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	
	// 3. 定义记录集
	var Columns = [
			 {name : 'uids',type : 'string'}, 
			 {name : 'dh',type: 'string'},
			 {name : 'mc',type: 'string'},
			 {name : 'jyr',type : 'string'}, 
			 {name : 'fs',type : 'float'}, 
			 {name : 'deptid',type : 'string'}, 
			 {name : 'jysj',type : 'date',dateFormat : 'Y-m-d H:i:s'},
			 {name : 'ghsj',type : 'date',dateFormat : 'Y-m-d H:i:s'},
			 {name : 'xjsj',type : 'string'}, 
			 {name : 'xjcs',type : 'float'}, 
			 {name : 'memo',type : 'string'}, 
			 {name : 'memo1',type : 'string'}, 
			 {name : 'memo2',type : 'string'},
			  {name : 'ghstate',type : 'string'}
			 ];

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	PlantInt = {
		uids:'',jyr:'',deptid:'',jysj:new Date(),ghsj:'',xjsj:'',xjcs:0,memo:'',memo1:'',memo2:'',ghstate:''
	}; // 初始值

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod//,
			/*params : " orgid='" + USERORGID + "' and indexid like '"
					+ selectedTreeData + "%'"*/
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : ServletUrl
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
	// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    var addBtn = new Ext.Button({
    	text:'新增借阅',
    	iconCls : 'add',
    	handler:insertFun
    })
    var delBtn = new Ext.Button({
    	text:'删除',
    	iconCls : 'remove',
    	handler:deleteFun
    })
	// 5. 创建可编辑的grid: grid-panel
   var update = new Ext.Button({
		id : 'update',
		text : '归还',
		tooltip : '归还',
		iconCls : 'btn',
		handler : upategh
	});
   var xjBtn = new Ext.Button({
		id : 'xj',
		text : '续借',
		tooltip : '续借',
		iconCls : 'btn',
		handler : xjFun
	});
   var queryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		tooltip : '查询',
		iconCls : 'btn',
		handler : QueryWinwdow
	});
	
	 var ghCombo = new Ext.form.ComboBox({
	 	 id : 'gh_combo',
	 	 fieldLabel: '借阅状态',
	 	 disable: true,
	 	 width: 50,
	 	 readOnly: true,
	 	 valueField: 'k',
	 	 displayField: 'v',
	 	 mode : 'local',
	 	 typeAhead: true,
	 	 triggerAction : 'all',
		 store : ghStr,
		 lazyRender : true,
		 listClass : 'x-combo-list-small',
 		 listeners : {'collapse':function(com){
	         if(com.value == 1){
		         ds.baseParams.params =" ghsj is not null and jysj is not null";	
		         ds.load({
		             	params :{
				        start: 0,
				        limit: PAGE_SIZE
			                    }
		                })
	           }
			if(com.value == 2){
				 ds.baseParams.params =" jysj is not null and ghsj is null and xjsj is null";
				 ds.load({
					    params :{
						start: 0,
						limit: PAGE_SIZE
					}
				})
			}
			if(com.value == 3){
				ds.baseParams.params =" jysj is not null and ghsj is null and xjsj is not null ";
					ds.load({
						params :{
							start : 0,
							limit: PAGE_SIZE
						        }
					        })
				 }
			  }
		 	 
			} 
		  }) 
	
     var userCombo = new Ext.form.ComboBox({
		id : 'jyr_combo',
		fieldLabel : '借阅人',
		disabled: true, 
		width:100,
		readOnly : true,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		typeAhead : true,
		triggerAction : 'all',
		store : jyrSt,
		lazyRender : true,
		listClass : 'x-combo-list-small',
		anchor : '95%'

	  
	})	
	 var deptCombo = new Ext.form.ComboBox({
			id : 'deptid_combo',
			fieldLabel : '借阅人部门',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : unitSt,
			width:110,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%',
			listeners:{'collapse':function(com){
        	userCombo.clearValue();
        	userCombo.focus(true);
        	userCombo.setDisabled(false);
		    //获取用户
			DWREngine.setAsync(false);
			if(com.value=="all"){
		 		baseMgm.getData("select userid,realname from rock_user",function(list){
		 			for(i = 0;i < list.length; i++){
		 				var temp = new Array();
		 				temp.push(list[i][0]);
		 				temp.push(list[i][1]);
		 				user_Array_q.push(temp);
		 			}
		 		});	
			}
			else{
			 	baseMgm.getData("select userid,realname from rock_user where dept_id='"+com.value+"'",function(list){  
					user_Array_q.splice(0,user_Array_q.length)
					for(i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						user_Array_q.push(temp);
					}
			    });
		    }
		 	DWREngine.setAsync(true);
 			jyrSt.loadData(user_Array_q);
        }}
	})	
	 
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		tbar : [addBtn,'-',update,'-',xjBtn,'-',delBtn,'-',
			'借阅状态：',ghCombo,queryBtn
		],
		title : gridPanelTitle, // 面板标题
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),

		// expend properties
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "zlMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		saveBtn:false,
		addBtn:false,
		delBtn:false
	});
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE/*,
			params : " orgid='" + USERORGID + "' and indexid like '"
					+ selectedTreeData + "%'"*/
		}
	});

	
	sm.on('rowselect', function(sm) { // grid 行选择事件
			var record = grid.getSelectionModel().getSelected();				
			var getghsj=record.get('ghsj');
			if(getghsj==""){
				update.enable();
				xjBtn.enable();
			}else{
				update.disable();
				xjBtn.disable();
			}
	})
   ////////////////////////////////////////////////////////////	// //////////////////////////////////////////
	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid]
	});

	viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});


	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};

	function formatDate_(value) {
		var o = value ? value.dateFormat('Y/m/d') : '';
		return o;
	};
	

   ///////////////////////----------新增-------------/////////////////////////////////////
	function insertFun() {
		var outputPanel = new Ext.Panel({
	    	id:'outputPanel'
		});
		openWin = new Ext.Window({
				title:'选择借阅资料',
				buttonAlign:'center',
				closable:false,
				maximizable: true,
				layout:'fit',
				modal:'true',closable: true, closeAction: 'hide',
				width:document.body.clientWidth,
				height:document.body.clientHeight,
				autoScroll:true,
				items:outputPanel
			});	
		var urls = BASE_PATH+"Business/document/da.zj.jy.jiajie.jsp";
		Ext.getCmp('outputPanel').html='<iframe name=content src="'+urls+'" frameborder=0 style=width:100%;height:100%;></iframe>';
		openWin.show()
	};
	
	///////////-----------------归还-------------------///////
	var formPanelgh =  new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
		items:[
			new Ext.form.TextField({name : 'uids',fieldLabel : '主键',readOnly : true,hidden : true,hideLabel : true,anchor : '95%',allowBlank:false}),
			new Ext.form.DateField({
				name : 'ghsj',fieldLabel : '归还时间(当前日期)',width : 45,format : 'Y-m-d',anchor : '95%',readOnly : true,hideTrigger:true,allowBlank:false
			}),
			new Ext.form.DateField({name : 'jysj',fieldLabel : '借阅时间',format : 'Y-m-d',readOnly : true,hidden : true,hideLabel : true,anchor : '95%',allowBlank:false})
		],buttons: [{
			id: 'save',
            text: '确认归还',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow.hide();
            }
        }]
	})
	
	var fs = 0;
	function upategh() {
	var currentInfoid="";currentjysj=""
	   var selectRows = grid.getSelectionModel().getSelections();
	   fs = selectRows[0].get("fs");
	   if(selectRows.length==1){
	   		currentInfoid = selectRows[0].get('uids');
	   		currentjysj = selectRows[0].get('jysj');
	   }else{
	   		Ext.MessageBox.alert('提示','请选择且只能选择其中一条资料进行归还!');return
	   }
	 if(!formWindow){
            formWindow = new Ext.Window({	               
                title:"填写归还时间",
                layout:'fit',
                width:200,
                height:150,
                closeAction:'hide',
                plain: true,	                
                items: formPanelgh,
                animEl:'action-new'
            });
       	}
       	formPanelgh.getForm().reset();
       	formWindow.show();
       	
       	var form = formPanelgh.getForm();
       	form.findField("uids").setValue(currentInfoid)
       	form.findField("ghsj").setValue(new Date())
       	form.findField("jysj").setValue(currentjysj)
		
	};
	
	function formSave(){
		var form = formPanelgh.getForm();
		if(form.isValid()){
			var obj = form.getValues()
			for(var i=0; i<Columns.length; i++) {
	    		var n = Columns[i].name;
	    		var field = form.findField(n);
	    		if (field) {
	    			obj[n] = field.getValue();
	    		}
	    	}
	    	
    	DWREngine.setAsync(false);
    	zlMgm.insertdazl_gh(obj,fs,function(dat){
    		if("0"==dat){
    			Ext.MessageBox.alert("提示","归还失败！")
    		}else if("1"==dat){
    			Ext.MessageBox.alert("提示","归还成功！")
    			ds.reload();
    			formWindow.hide();
    		}else if("2"==dat){
    			Ext.MessageBox.alert("提示","归还时间不能早于借阅时间！")
    		}
    	});
    	DWREngine.setAsync(true);	    	
	    	
		}
	}
	
	
	///////////-----------------续借-------------------///////
	var date = new Date();
    var xjcurrentsj = date.getYear()
            + "-"+(date.getMonth()+101+"").substring(1)
            +"-"+ (date.getDate()+100+"").substring(1)
	var formPanelxj =  new Ext.FormPanel({
		id: 'form-panelxj',
        header: false,
		border: false,
		autoScroll:true,
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
		items:[
			new Ext.form.TextField({name : 'uids',fieldLabel : '主键',readOnly : true,hidden : true,hideLabel : true,anchor : '95%',allowBlank:false}),
			new Ext.form.TextField({
				name : 'xjsj',fieldLabel : '续借时间(当前日期)',anchor : '95%',readOnly : true,allowBlank:false,value:xjcurrentsj
			}),
			new Ext.form.TextArea({name : 'memo',readOnly : true,fieldLabel : '历史续借时间',anchor : '95%',width :240,height:100}),
			new Ext.form.TextArea({name : 'memo1',readOnly : true,fieldLabel : '历史续借时间',hidden : true,hideLabel : true}),
			new Ext.form.TextArea({name : 'xjcs',readOnly : true,fieldLabel : '续借次数',hidden : true,hideLabel : true}),
			new Ext.form.DateField({name : 'jysj',fieldLabel : '借阅时间',format : 'Y-m-d',readOnly : true,hidden : true,hideLabel : true,anchor : '95%',allowBlank:false})
		],buttons: [{
			id: 'save',
            text: '确认续借',
            handler: formSavexj
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow_xj.hide();
            }
        }]
	})	
	function xjFun(){
	   var currentuid="";currentjysj="";his_xj="";currentxjcs=0;currentxjsj=""
	   var selectRows = grid.getSelectionModel().getSelections();
	   if(selectRows.length==1){
	   		currentuid = selectRows[0].get('uids');
	   		currentjysj = selectRows[0].get('jysj');
	   		currentxjcs= selectRows[0].get('xjcs');
	   		currentxjsj= selectRows[0].get('xjsj');
	   }else{
	   		Ext.MessageBox.alert('提示','请选择且只能选择其中一条资料进行续借!');return
	   }
	   if(currentxjcs>1){Ext.MessageBox.alert('提示','最多只能续借2次,请及时归还!');return}
		//获取续借历史记录
    	DWREngine.setAsync(false);
    	zlMgm.getdaxj_history(currentuid,function(dat){
			his_xj=dat;
    	});
    	DWREngine.setAsync(true);
    	
		
	   
	 if(!formWindow_xj){
            formWindow_xj = new Ext.Window({	               
                title:"填写续借时间",
                layout:'fit',
                width:300,
                height:300,
                closeAction:'hide',
                plain: true,	                
                items: formPanelxj,
                animEl:'action-new'
            });
       	}
       	formPanelxj.getForm().reset();
       	formWindow_xj.show();
       	
       	var form = formPanelxj.getForm();
       	form.findField("xjcs").setValue(currentxjcs)
       	form.findField("memo").setValue(his_xj)
       	form.findField("memo1").setValue(currentxjsj)
       	form.findField("uids").setValue(currentuid)
       	form.findField("jysj").setValue(currentjysj)		
	}
	
	function formSavexj(){
		var form = formPanelxj.getForm();
		if(form.isValid()){
			var obj = form.getValues()
			for(var i=0; i<Columns.length; i++) {
	    		var n = Columns[i].name;
	    		var field = form.findField(n);
	    		if (field) {
	    			obj[n] = field.getValue();
	    		}
	    	}
	    	
    	DWREngine.setAsync(false);
    	zlMgm.update_daxj(obj,function(dat){
    		if("0"==dat){
    			Ext.MessageBox.alert("提示","续借失败！")
    		}else if("1"==dat){
    			Ext.MessageBox.alert("提示","续借成功！")
    			ds.reload();
    			formWindow_xj.hide();
    		}else if("2"==dat){
    			Ext.MessageBox.alert("提示","续借时间不能早于借阅时间！")
    		}
    	});
    	DWREngine.setAsync(true);	    	
	    	
		}		
	}
	///////////-----------------删除-------------------///////
	function deleteFun() {
		var records = sm.getSelections();
		var del_flag=true;
		for(var i=0;i<records.length;i++){
			if (records[i].get('ghsj')=="") {
				del_flag = "false";
				Ext.MessageBox.alert("提示!","档案资料必须在归还后才能删除!")
				return;
			}else{del_flag=true}
		}
		if(del_flag){
			grid.defaultDeleteHandler();
		}
}

	////////////------------------树点击查询-------------------////////////
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("treeid").innerText;
		selectorgid=elNode.all("orgid").innerText;
		PlantInt.indexid = elNode.all("indexid").innerText;
		var titles = [node.text];
		var obj = node.parentNode;
		var isRoot = (rootText == node.text);
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;

		tmp_parent = menu_isLeaf;

		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		if (selectedTreeData == null) {
			selectedTreeData = "1";
		}
		
		ds.baseParams.params = " infoid in (select daid from DaZl where indexid in "+getStr(selectedTreeData)+")";
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

	/////////-----------------查询------------////////
	function QueryWinwdow(){
    	if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
				width : 460,
				height : 400,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryzlPanel]
			});
		}
		QueryzlPanel.getForm().reset();
		formWin.show();
    }
    
    var QueryzlPanel = new Ext.FormPanel({
		id : 'form-panelef',
		header: false,
        border: false,
        width : 400,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 300,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
		labelAlign : 'top',
		// listeners: {beforeshow: handleActivate},
		bbar: ['->',{
				id: 'query',
		text: '查询',
				tooltip: '查询',
				iconCls: 'btn',
				handler: execQuery
			}],
		items : [
		 			new Ext.form.FieldSet({
    			    title: '资料查询',
            	    layout: 'form',
            	    border: true,
            	items: [
		           deptCombo,
		           userCombo,
		           new Ext.form.DateField({
		          	 				id:'searchTime',
		          	 				fieldLabel : '借阅时间',
		          	 				emptyText:'选择开始时间',
		          	 				readOnly:true,width:85,format:'Y-m-d'})
		          	 				]
		          	 	})
		          ]									
	});
	
	/*
	 * 查询主方法--
	 */	
	function execQuery(){
		var  dept_q = Ext.getCmp("deptid_combo").getValue();
		var  jyr_q = Ext.getCmp("jyr_combo").getValue();
		var jysj_q = "";var psql="";
		if(dept_q=="all"){
			if(jyr_q=="" && Ext.getCmp("searchTime").getValue()!=""){
				jysj_q = DateUtil.Format('yyyy-MM-dd',Ext.getCmp("searchTime").getValue());//借阅人为空 时间不为空
			  psql="jysj=to_date('"+jysj_q+"','yyyy-MM-dd')"
			}
			if(jyr_q!="" && Ext.getCmp("searchTime").getValue()==""){//借阅人不为空，借阅时间为空
			    psql=" jyr='"+jyr_q+"'"
			}
			if(jyr_q!="" && Ext.getCmp("searchTime").getValue()!="") {//借阅人不为空，借阅时间不为空
				jysj_q = DateUtil.Format('yyyy-MM-dd',Ext.getCmp("searchTime").getValue());
			  psql=" jyr='"+jyr_q+"' and jysj=to_date('"+jysj_q+"','yyyy-MM-dd')"
			}
			if(jyr_q=="" && Ext.getCmp("searchTime").getValue()==""){//借阅人为空,借阅时间为空
			  psql=""
			}
		}
		if(dept_q==""){//借阅部门为空
			if(Ext.getCmp("searchTime").getValue()!=""){//借阅时间不为空
				jysj_q = DateUtil.Format('yyyy-MM-dd',Ext.getCmp("searchTime").getValue());
			  psql="  jysj=to_date('"+jysj_q+"','yyyy-MM-dd')"
			}
		}
		else{
			if(jyr_q!="" && Ext.getCmp("searchTime").getValue()==""){ //借阅人不为空，借阅时间为空
			  psql=" deptid='"+dept_q+"'and jyr='"+jyr_q+"'"
			}
			if(jyr_q=="" && Ext.getCmp("searchTime").getValue()!=""){//借阅人为空，借阅时间不为空
				jysj_q = DateUtil.Format('yyyy-MM-dd',Ext.getCmp("searchTime").getValue());
			  psql=" deptid='"+dept_q+"'and jysj=to_date('"+jysj_q+"','yyyy-MM-dd')"
			}
			if(jyr_q!="" && Ext.getCmp("searchTime").getValue()!=""){//借阅人不为空,借阅时间不为空
				jysj_q = DateUtil.Format('yyyy-MM-dd',Ext.getCmp("searchTime").getValue());
			  psql=" jyr='"+jyr_q+"' and deptid='"+dept_q+"' and jysj=to_date('"+jysj_q+"','yyyy-MM-dd')"
			}
			if(jyr_q=="" && Ext.getCmp("searchTime").getValue()==""){//借阅人为空，借阅时间为空
			  psql=" deptid='"+dept_q+"' "
			}
			
		}
	    ds.baseParams.params = psql
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			},
			callback: function(){ formWin.hide();}
		});
	}
	

	
	function formatDate(value)
		{ return value ? value.dateFormat('Y-m-d') : ''; };

   function  getStr(selectedTreeData){
       if(selectedTreeData == null || selectedTreeData == ''){
        selectedTreeData = '1'
	    }
	   if( selectedTreeData != ""){
	        	strs="(";
	        	DWREngine.setAsync(false);
	        	baseMgm.getData("select indexid from da_tree start with treeid='"+selectedTreeData+"' connect by prior   treeid=parent",
						function(list) {
						  if(list.length == 0) return strs +='';
						  for(var i = 0; i < list.length;i++){
						     if(list.length == 1){
						       strs +="'"+list[i]+"'";
					            break;
						     }
						     if(i < list.length -1 ){
						        strs +="'"+list[i]+"',";
						     }else{
						        strs +="'"+list[i]+"'";
						     }
						  }
						})
				DWREngine.setAsync(true);
				strs  +=")"
	        }
	        return strs;
   } 
});
