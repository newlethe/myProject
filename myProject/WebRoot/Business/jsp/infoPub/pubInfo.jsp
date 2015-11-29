<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<% 
	String userName = (String)session.getAttribute(Constant.USERNAME);
	String unitName = (String)session.getAttribute(Constant.USERUNITNAME);
%>
<html>
	<head>
		<title>信息发布</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
		</script>
		<script src='dwr/interface/baseMgm.js'></script>
		<script src='dwr/interface/infoPubService.js'></script>
		<script src='dwr/interface/fileServiceImpl.js'></script>
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/Business/jsp/common/file/fileupload.js"></script>
		<style>
			#cat-grid-panel {border-right:1px solid #99bbe8;}
			#code-grid-panel {border-left:1px solid #99bbe8;}
		</style>
  </head>
  
  <body>
  </body>
</html>
<script>
var container,viewport
var win
var ifLoadGrid = true
var treePanel, gridPanel, formPanelinsert , formPanel, formWindow , queryForm ,queryWin;
var upLoadBtn
var nodes = new Array();
var catTypeSt;
var bean = "com.sgepit.lab.ocean.infopub.hbm.SgccInfoPub";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = "pubinfoId";
var orderColumn = "pubDate";
var root;
var combo;

var sm,cm,ds

var username = '<%=username%>'
var unitId
if(username == "system" || username == "Administrator")
	unitId = '<%=userunitid%>'
else 
	unitId = '<%=userposid%>'
	
var listWhere = "pubUnit="+unitId+" and delFlag <>1";

Ext.onReady(function(){
    //提示
    Ext.QuickTips.init() 
	
	unitLocalBtn = new Ext.Toolbar.Button({
			id: 'pubInfo',
			text: '发布信息',
			iconCls : 'option',
			handler: onItemClick
	});
	
	unitLocalPubBtn = new Ext.Toolbar.Button({
			id: 'viewPub',
			text: '查看已发布对象',
			iconCls : 'form',
			handler: onItemClick
	});
	
	var fm = Ext.form;			// 包名简写（缩写）
	
    var fc = {		// 创建编辑域配置
    	'pubinfoId': {
			name: 'pubinfoId',
			fieldLabel: '发布编号',
			anchor:'95%',
			hidden: true,
			hideLabel: true,
			readOnly:true
        }, 'pubUnit': {
			name: 'pubUnit',
			fieldLabel: '发布单位',
			allowBlank: false,
			anchor:'95%',
			readOnly:true
		}, 'pubUser': {
			name: 'pubUser',
			fieldLabel: '发布用户',
			allowBlank: false,
			anchor:'95%',
			readOnly:true
		}, 'pubFlag': {
			name: 'pubFlag',
			fieldLabel: '是否发布',
			allowBlank: false,
			anchor:'95%',
			readOnly:true
		}, 'pubDate': {
			name: 'pubDate',
			fieldLabel: '日期',
			format : 'Y-m-d H:i:s',
			allowBlank: false,
			anchor:'95%'
		}, 'pubTitle': {
			name: 'pubTitle',
			fieldLabel: '标题',
			allowBlank: false,
			anchor:'95%'
		}, 'pubContent': {
			name: 'pubContent',
			fieldLabel: '内容',
			allowBlank: false,
			anchor:'95%'
		}, 'fileLsh': {
			name: 'fileLsh',
			fieldLabel: '附件',
			allowBlank: false,
			anchor:'95%'
		}, 'delFlag': {
			name: 'delFlag',
			fieldLabel: '是否删除标记',
			allowBlank: true,
			hidden: true,
			hideLabel: true,
			anchor:'95%'
		}, 'fileType': {
			name: 'fileType',
			fieldLabel: '文件类型',
			allowBlank: false,
			anchor:'95%'
		}, 'pubType': {
			name: 'pubType',
			fieldLabel: '发布对象',
			allowBlank: false,
			anchor:'95%'
		}, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
			hideLabel : true ,
			height: 120,
			width: 400,
			hidden: true,
			xtype: 'htmleditor',
			allowBlank: false,
			anchor:'95%'
		}
	}
	
    var Columns = [
    	{name: 'pubinfoId', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pubUnit', type: 'string'},
		{name: 'pubUser', type: 'string'},
		{name: 'pubDate', type: 'date',dateFormat : 'Y-m-d H:i:s'},
		{name: 'pubFlag', type: 'string'},
		{name: 'pubTitle', type: 'string'},
		{name: 'pubContent', type: 'string'},
		{name: 'fileLsh', type: 'string'},
		{name: 'delFlag', type: 'string'},
		{name: 'fileType', type: 'string'},
		{name: 'pubType', type: 'string'},
		{name: 'memo', type: 'string'}]
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	pubinfoId: '', 
    	pubUnit: '',
    	pubUser: '',
    	pubDate: '',
    	pubFlag: '',
    	pubTitle: '',
    	pubContent: '',
    	fileLsh: '',
    	delFlag: '',
    	fileType: '',
    	pubType: '',
    	memo: ''
    }

    var Fields = Columns;
    var PlantFields = Ext.data.Record.create(Fields);
    var PlantFieldsInt = new Object();
    Ext.applyIf(PlantFieldsInt, PlantInt);
    sm =  new Ext.grid.CheckboxSelectionModel()
    cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'pubinfoId',
           header: fc['pubinfoId'].fieldLabel,
           dataIndex: fc['pubinfoId'].name,
           hidden:true,
           width: 10
        }, {
           id:'pubUnit',
           header: fc['pubUnit'].fieldLabel,
           dataIndex: fc['pubUnit'].name,
           width: 200,
           hidden:true,
           align: 'center',
           renderer: function(value){
           		DWREngine.setAsync(false);
		    	var unitname = ""
		    	infoPubService.getUnitName(value,function(data) {
		    		unitname = data
		    	})
		    	DWREngine.setAsync(true);
		    	return unitname
		   }
        }, {
           id:'pubUser',
           header: fc['pubUser'].fieldLabel,
           dataIndex: fc['pubUser'].name,
           align: 'center',
           width: 150,
           renderer: function(value){
           		DWREngine.setAsync(false);
		    	var username = ""
		    	infoPubService.getUserName(value,function(data) {
		    		username = data
		    	})
		    	DWREngine.setAsync(true);
		    	return username
           }
        }, {
           id:'pubDate',
           header: fc['pubDate'].fieldLabel,
           dataIndex: fc['pubDate'].name,
           align: 'center',
           width: 150,
           renderer: function(value) {
           		return value ? value.dateFormat('Y-m-d H:i:s') : '';
           }
        }, {
           id:'pubFlag',
           header: fc['pubFlag'].fieldLabel,
           dataIndex: fc['pubFlag'].name,
           align: 'center',
           width: 100,
           renderer: function(flag) {
           		if(flag == "0") 
           			return '<div style="color:gray;">未发布</div>'
           		else 
           			return '<div>已发布</div>'
           }
        }, {
           id:'pubTitle',
           header: fc['pubTitle'].fieldLabel,
           dataIndex: fc['pubTitle'].name,
           align: 'center',
           width: 450
        }, {
           id:'pubContent',
           header: fc['pubContent'].fieldLabel,
           dataIndex: fc['pubContent'].name,
           hidden:true,
           width: 450
        }, {
           id:'fileLsh',
           header: fc['fileLsh'].fieldLabel,
           dataIndex: fc['fileLsh'].name,
           width: 100,
           align: 'center',
           renderer: function(v,r,d) {
           		DWREngine.setAsync(false);
		    	var flag = false
		    	var infoId = d.get('pubinfoId')
		    	infoPubService.checkFileExist(infoId,function(data) {
		    		flag = data
		    	})
		    	DWREngine.setAsync(true);
           		if(flag)
           			return "<u style='color:blue; cursor:hand;' onclick=showFileWin('pubinfo','"+infoId+"',true)>查看</u>"
           		else
           			return "<div style='color:red; font:bold; cursor:hand;' onclick=showFileWin('pubinfo','"+infoId+"',true)>上传</div>"
           }
        }, {
           id:'fileType',
           header: fc['fileType'].fieldLabel,
           dataIndex: fc['fileType'].name,
           align: 'center',
           width: 100,
           renderer: function(ftype) {
           		if(ftype == "1") 
           			return '<div style="color:red;">通知</div>'
           		else if(ftype == "2")
           			return '<div style="color:green;">通告</div>'
           		else if(ftype == "3")
           			return '<div style="color:blue;">公告</div>'
           		else
           			return '<div style="color:purple;">其它</div>'
           }
        },{
           id:'memo',
           header: fc['memo'].fieldLabel,
           dataIndex: fc['memo'].name,
           align: 'center',
           hidden:true,
           width: 100
        }
	])
	
    cm.defaultSortable = true;						//设置是否可排序
    
    ds = new Ext.data.Store({ // 分组
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: listWhere
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

	upLoadBtn = new Ext.Toolbar.Button({
			id: 'upload',
			text: '上传附件',
			iconCls : 'upload',
			handler: onItemClick
	});
	
	detailBtn = new Ext.Toolbar.Button({
			id: 'detail',
			text: '详细信息',
			iconCls : 'form',
			handler: onItemClick
	});
	
	queryBtn = new Ext.Toolbar.Button({
			id: 'query',
			text: '查询',
			iconCls : 'option',
			handler: onItemClick
	});
	
	if(ModuleLVL=='3'){
		unitLocalBtn.setVisible(false);
		upLoadBtn.setVisible(false);
	}
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        //autoExpandColumn : 2,
        tbar: [],					//顶部工具栏，可选
        //title: "",		//面板标题
        //iconCls: 'icon-by-category',	//面板样式
        saveBtn: false ,
        refreshBtn: false,
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        //header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,	
        viewConfig : {
			ignoreAdd : true
		},			//加载时是否显示进度
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            beforePageText:"第",
	        afterPageText :"页,共{0}页",
            store: ds,
            displayInfo: true,
	        firstText: '第一页',  
	   		prevText: '前一页',  
	        nextText: '后一页',  
	        lastText: '最后一页',  
	        refreshText: '刷新',  
	        displayMsg: '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
            emptyMsg: "无记录。"
        }),
        
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "baseMgm",	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	deleteHandler : deleteFun

	});
	
    var contentPanel = new Ext.Panel({
        id:'main-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:gridPanel
    });	
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel ]
    });	
    
	var gridTopBar = gridPanel.getTopToolbar()
	gridTopBar.add(upLoadBtn,"-",detailBtn,"-",queryBtn,"-",unitLocalBtn,"-",unitLocalPubBtn)
	
    ds.load({
    	params:{
	    	start: 0,			//起始序号
	    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
    	}
    });
    
    ds.on("load",function(){
		sm.selectFirstRow()
	})
    
    function insertFun(){
    	Ext.getCmp('newupload').hide()
    	
    	formPanelinsert.getForm().reset();
    	formWinShow("新增发布信息")
    	initForm()
    }
    
    function initForm() {
    	var form = formPanelinsert.getForm();
		form.findField("delFlag").setValue("0");
		
		form.findField("pubFlag").setValue(dsFlag.getAt(0).get("val"));
		form.findField("pubFlag").disable()
		form.findField("pubDate").setValue(new Date());
		form.findField("pubUnit").setRawValue('<%=unitName%>');
		form.findField("pubUser").setRawValue('<%=userName%>');
    }
   
    //创建新增表单form-panel
    var dsFType = new Ext.data.SimpleStore({
		fields: ['val', 'txt']
	})
	var dsFlag = new Ext.data.SimpleStore({
		fields: ['val', 'txt'] , 
		data: [['0','未发布'],['1','已发布']]  
	})						              
	var sql = "select p.property_code code , p.property_name name from property_code p "
			+ "where p.type_name=(select t.uids from property_type t where t.type_name = '发布信息') order by p.property_code"
	db2Json.selectSimpleData(sql , function(data) {
		dsFType.loadData(eval(data))
	})		
    
	formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		frame: true,
		//bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
	 	items: [
                  new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'form',
                //cls:'x-plain',
                anchor: '97%',
                items: [        {
		   		layout: 'form', columnWidth: 1,
		   			bodyStyle: 'border: 0px;',
                                        items: [new fm.TextField(fc['pubTitle'])]
	    				},{
		   		layout: 'form', columnWidth: 1,
		   			bodyStyle: 'border: 0px;',
                                        items: [new fm.TextArea(fc['pubContent'])]
	    				},{
	                	layout: 'column',
	    				bodyStyle: 'border: 0px;',
	    				items:[{
	    					layout: 'form', columnWidth: .50,
	    					bodyStyle: 'border: 0px;',
	    					items:[
	    							new fm.ComboBox({
					            		name: 'fileType',	fieldLabel: '发布类型',	allowBlank : false,	emptyText : '请选择...',
										valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
							            store: dsFType, lazyRender: true, listClass: 'x-combo-list-small'
							      	}),
	    							new fm.TextField(fc['pubUnit'])
	    						  ]
	    				},{
		   					layout: 'form', columnWidth: .50,
		   					bodyStyle: 'border: 0px;',
		   					items:[
		   						new fm.DateField(fc['pubDate']),
							      	new fm.TextField(fc['pubUser'])
							      ]
	    				}
	    		]},
	    		{
	    				layout: 'column',
	    				bodyStyle: 'border: 0px;',
	    				items:[{
	    					layout: 'form', columnWidth: .50,
	    					bodyStyle: 'border: 0px;',
	    					items:[new fm.ComboBox({
					            		name: 'pubFlag',fieldLabel: '是否发布',	allowBlank : false,	emptyText : '请选择...',
										valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
							            store: dsFlag, lazyRender: true, listClass: 'x-combo-list-small'
							      })]
	    				},{
	    					layout: 'form', columnWidth: .15,
	    					bodyStyle: 'border: 0px;',
	    					items:[{
					            	border: false,
	    							layout: 'form',
					            	items: [ new Ext.Button({
											id : 'newupload',
										    	iconCls: 'upload',
										    	text:'附件查看',
										    	hidden:false,
										    	tooltip: '上传附件',
										    	handler: onItemClick

                                                              })]
				            	  }]
	    				},{
	    					layout: 'form',width:0,
	    					bodyStyle: 'border: 0px;',
	    					items:[new fm.TextField(fc['pubinfoId'])]
	    				},{
	    					layout: 'form',width:0,
	    					bodyStyle: 'border: 0px;',
	    					items:[new fm.TextField(fc['delFlag'])]
	    				}]
	    		}]
    		})/*
    		new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'信息内容',
                cls:'x-plain',  
                anchor: '97%',
                items: [new fm.HtmlEditor(fc['pubContent'])]
    		})*/
   		/*new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain', 
                anchor: '97%', 
                items: [new fm.HtmlEditor(fc['memo'])]
    		})*/
    	],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	ifLoadGrid = true
            	formWindow.hide();
            }
        }]
	});
	
	var fileType = new fm.ComboBox({
        name: 'fileType',	fieldLabel: '发布类型',	allowBlank : true,	emptyText : '请选择...',
		valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
        store: dsFType
    })
    
	var pubFlag = new fm.ComboBox({
        name: 'pubFlag',fieldLabel: '是否发布',	allowBlank : true,	emptyText : '请选择...',
		valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
        store: dsFlag
    })
    
	var pubTitle = 	new fm.TextField({
		name: 'pubTitle',
		fieldLabel: '标题',
		width: 500,
		allowBlank: true,
		anchor:'95%'
	})
	var startDate = new fm.DateField({
		name: 'start',
		fieldLabel: '起始时间',
		format : 'Y-m-d',
		width: 162,
		allowBlank: true
	})
	var endDate = new fm.DateField({
		name: 'end',
		fieldLabel: '结束时间',
		format : 'Y-m-d',
		width: 162,
		allowBlank: true
	})
	queryForm = new Ext.FormPanel({
	    header: false, border: false, autoScroll: true,
	    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
	    items: [{
	    	xtype: 'fieldset',
			title: '字段查询',
	      	border: true,
	      	layout: 'table',
	      	layoutConfig: {columns: 1},
	      	defaults: {bodyStyle:'padding:1px 1px'},
	      	items: [{
				layout: 'form',
				border: false,
				width: 400,
				items: [pubTitle,fileType,pubFlag,startDate,endDate]
			}]
		}],
		bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery
		}]
	});
	

	function formSave() {
		
		var form = formPanelinsert.getForm()
		if (form.isValid()) {
			doFormSave(true)	
		}
	}
	
	function doFormSave(dataArr){
	   	var form = formPanelinsert.getForm()
	   	var obj = form.getValues()
	   	for(var i=0; i<Columns.length; i++) {
	   		var n = Columns[i].name;
	   		var field = form.findField(n);
	   		if (field) {
	   			if(n == "pubUnit")
	   				obj[n] = unitId
	   			else if(n == "pubUser")
	   				obj[n] = '<%=userid%>'
	   			else
	   				obj[n] = field.getValue();
	   		}
	   	}
	   	DWREngine.setAsync(false);
	   	if (obj.pubinfoId == '' || obj.pubinfoId == null){
	   		infoPubService.insertPubInfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
	  		}
	  		else{
	  			infoPubService.updatePubInfo(obj, function(){
	   				Ext.example.msg('更新成功！', '您成功修改了一条信息！');
	   				ifLoadGrid = true
	   				formWindow.hide();
	   				ds.baseParams.params = listWhere
					ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
	   		});
	  		}
	  		DWREngine.setAsync(true);
	}
	
	function deleteFun() {
		var records = sm.getSelections();
		var ids = "";
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids += records[i].get('pubinfoId')+";";
			}
			
			if (ids.length > 0){
		   		Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							infoPubService.deletePubInfo(ids, function(){
								Ext.example.msg('删除成功！', '您成功删除了('+records.length+')条发布信息！');
								ds.baseParams.params = listWhere
								ds.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
								if (ds.getCount() > 0)
						    		sm.selectRow(0);
							});
						}
					}
		   		});
		   	}
		}
	}
	
	function processResult(value){
		ds.baseParams.params = listWhere
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	   	if ("yes" == value){
	   		formPanelinsert.getForm().reset();
			initForm()
	   	}
	   	else{
	   		formWindow.hide();
	   		ifLoadGrid = true
	   	}
	}
	
	function queryWindow(){
		if(!queryWin){
			queryWin = new Ext.Window({	               
				title: '查询数据',
				width: 460, minWidth: 460, height: 280,
				layout: 'fit', iconCls: 'form', closeAction: 'hide',
				border: false, constrain: true, maximizable: false, modal: true,
				items: [queryForm]
			});   
	 	}
	 	queryForm.getForm().reset();
	 	queryWin.show();
	}
	
	function execQuery(){
		var form = queryForm.getForm(), queStr = '';
		if (form.isValid()){
			if (pubTitle.getValue().length != 0)
				queStr += ' and pubTitle like \'%' + pubTitle.getValue() + '%\'';
			
			if (fileType.getValue().length != 0)
				queStr += ' and fileType=' + fileType.getValue();
			
			if (pubFlag.getValue().length != 0)
				queStr += ' and pubFlag=' + pubFlag.getValue();
				
			if(startDate.getValue().length != 0)			
				queStr +=' and pubDate >= to_date(\''+startDate.getValue().dateFormat('Y-m-d')+'\',\'YYYY-MM-DD\')';
			if(endDate.getValue().length != 0)			
				queStr +=' and pubDate <= to_date(\''+endDate.getValue().dateFormat('Y-m-d')+'\',\'YYYY-MM-DD\')';
				
			ds.baseParams.params = listWhere+queStr;
			ds.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
			queryWin.hide()
		}
	}
	
	function formWinShow(title) {
		if(!formWindow){
	        formWindow = new Ext.Window({	               
	            layout:'fit',
	            width:650,
	            height:300,
	            closeAction:'hide',
	            plain: true,	                
	            items: formPanelinsert,
	            animEl:'action-new'
	            });
	   	}
		var form = formPanelinsert.getForm();
	   	formWindow.setTitle(title);
	   	formWindow.show();
	}
	
	function detailShow(pubinfoId) {
		DWREngine.setAsync(false)
		var flag = false
		infoPubService.checkFileExist(pubinfoId,function(data) {
			flag = data
	   	})
		DWREngine.setAsync(true)
		if(flag)
			Ext.getCmp('newupload').show()
		else
			Ext.getCmp('newupload').hide()
		formWinShow("详细信息")
		loadForm()
	}
	
	function loadForm(){
		var form = formPanelinsert.getForm();
		form.findField("pubFlag").disable()
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
	   			formPanelinsert.buttons[0].enable()
	   			formPanelinsert.isNew = true
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
			    			if(n == "pubUnit") {
			    				DWREngine.setAsync(false);
			    				var unitname = ""
			    				infoPubService.getUnitName(rtn[n],function(data){
			    					unitname = data
			    				}) 
			    				DWREngine.setAsync(true);
			    				obj[n] = unitname
			    			}
			    			else if(n == "pubUser") {
			    				DWREngine.setAsync(false);
			    				var username = ""
			   
			    				infoPubService.getUserName(rtn[n],function(data){
			    					username = data
			    				})
			    				DWREngine.setAsync(true);
			    				obj[n] = username
			    			}
			    			else
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
			    		formPanelinsert.buttons[0].enable()
			    		formPanelinsert.isNew = false
		    		}
	    		)
	   		}
	   	}
	   	else
	   	{
	   		form.loadRecord(new PlantFields(PlantFieldsInt))
	   		formPanel.buttons[0].disable()
	   	}  
	}
   
	function onItemClick(item) {
		var records = sm.getSelections();
		ifLoadGrid = true
		switch(item.id) {
			case 'upload':
				if(records.length > 0) {
					var pubinfoId = records[0].get("pubinfoId")
					showFileWin("pubinfo",pubinfoId,true)
				}
				break;
			case 'query':
				queryWindow()
				break;
			case 'detail':
				if(records.length > 0) {
					var pubinfoId = records[0].get("pubinfoId")
					detailShow(pubinfoId)
				}
				break;
			case 'newupload':
				ifLoadGrid = false
				var pubinfoId = records[0].get("pubinfoId")
				showFileWin("pubinfo",pubinfoId,true)
				break;
			case 'pubInfo':
				var records = sm.getSelections()
				if(records.length > 0) 
					showDialog("发布信息","Business/jsp/infoPub/pubinfo_process.jsp?type=bdw&pub=pub&pubId="+records[0].get("pubinfoId"),700,450)
				break;
			case 'viewPub':
				var records = sm.getSelections()
				if(records.length > 0) 
					showDialog("已发布对象","Business/jsp/infoPub/pubinfo_process.jsp?type=bdw&pub=pubed&pubId="+records[0].get("pubinfoId"),700,450)
				break;
		}
	}
});
 function closeShowFileWinFun(){
 	if(ifLoadGrid){
    	ds.baseParams.params = listWhere
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
	}
	
 }
function showDialog(dialogTitle , frameaddress , w , h) {
	win = new Ext.Window({
        title: dialogTitle,
        width: w,
        height: h,
        layout: 'fit',
        resizable: false,
		plain: true,
		modal: true,
        buttonAlign: 'center',
        html:"<iframe scrolling='no' name='content' src='"+frameaddress+"' width='100%' height='100%'></iframe>",
        buttons: [
        {
            text: '发布',
            handler: pubInfo
        },
        {
            text: '关闭',
            handler: function(){
                win.hide();
            }
        }]
    });
    win.show()
}

function pubInfo() {
	var data = ""
	var records = sm.getSelections()
	data = window.frames["content"].getUnitId()
	if(data.length > 0) {
		var arr = data.split(";")
		var ids = arr[0]
		var type = "save"
		if(arr.length == 2)
			type = arr[1]
		infoPubService.publishInfo(records[0].get("pubinfoId"),ids,type,function(dat){
			if(dat) {
				showExtMsg("发布成功!")
				ds.baseParams.params = listWhere
				ds.load({
					params:{
						start: 0,
						limit: PAGE_SIZE
					}
				});
			}
			else
				showExtMsg("发布失败!")
			win.hide()
		})
	}
}

function showExtMsg( txt ) {
	Ext.MessageBox.show({
		title:'提示: ',
		msg: txt,
		maxWidth: 400,
		minWidth:150,
		buttons:Ext.MessageBox.OK
	});
}

</script>
