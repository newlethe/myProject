<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<% 
	String userName = (String)session.getAttribute(Constant.USERNAME);
%>
<html>
	<head>
		<title>信息发布</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<script>
			var path = '<%=path %>';
			var basePath = '<%=basePath %>';
		</script>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/interface/systemMgm.js'></script>
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
var treePanel, gridPanel, formPanelinsert , formPanel, formWindow , queryForm ,queryWin , win , contentWin;
var nodes = new Array();
var catTypeSt;
var bean = "com.sgepit.lab.ocean.infopub.hbm.SgccInfoPub";
var business = "infoPubService";
var listMethod = "getPublishByProperty";
var primaryKey = "pubinfoId";
var orderColumn = "pubDate";
var root;

var sm,cm,ds
var username = '<%=userName%>'
var userid = '<%=userid%>'
var unitId
var Fields
var PlantFields
var PlantFieldsInt

if(username == "system" || username == "Administrator")
	unitId = '<%=userunitid%>'
else 
	unitId = '<%=userposid%>'

var listWhere = "userid"+SPLITB+'<%=userid%>'+SPLITA+"unitid"+SPLITB+unitId

Ext.onReady(function (){

	var fm = Ext.form;			// 包名简写（缩写）
	
    var fc = {		// 创建编辑域配置
    	'pubinfoId': {
			name: 'pubinfoId',
			fieldLabel: '查看附件',
			anchor:'95%',
			hidden: true,
			hideLabel: true,
			readOnly:true
        }, 'pubUnit': {
			name: 'pubUnit',
			fieldLabel: '发布单位',
			allowBlank: false,
			anchor:'95%'
		}, 'pubUser': {
			name: 'pubUser',
			fieldLabel: '发布人',
			allowBlank: false,
			anchor:'95%'
		}, 'pubFlag': {
			name: 'pubFlag',
			fieldLabel: '是否发布',
			allowBlank: false,
			anchor:'95%'
		}, 'pubDate': {
			name: 'pubDate',
			fieldLabel: '发布日期',
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
		}, 'fileType': {
			name: 'fileType',
			fieldLabel: '文件类型',
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
		}, 'state': {
			name: 'state',
			fieldLabel: '是否已读',
			allowBlank: false,
			anchor:'95%'
		}
	}
	
    var Columns = [
    	{name: 'pubinfoId', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pubUnit', type: 'string'},
		{name: 'pubUser', type: 'string'},
		{name: 'pubTitle', type: 'string'},
		{name: 'pubContent', type: 'string'},
		{name: 'pubDate', type: 'date',dateFormat : 'Y-m-d H:i:s'},
		{name: 'fileType', type: 'string'},
		{name: 'memo', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'pubFlag', type: 'string'}]
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	pubinfoId: '',
    	pubUnit: '',
    	pubUser: '',
    	pubTitle: '',
    	pubContent: '',
    	pubDate: '',
    	fileType: '',
    	memo: '',
    	state: '',
        pubFlaG:''
    }
    Fields = Columns;
    PlantFields = Ext.data.Record.create(Fields);
    PlantFieldsInt = new Object();
    Ext.applyIf(PlantFieldsInt, PlantInt);
    sm =  new Ext.grid.CheckboxSelectionModel()
    cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           align: 'center',
           hidden: true,
           width: 100
        }, {
           id:'pubTitle',
           header: fc['pubTitle'].fieldLabel,
           dataIndex: fc['pubTitle'].name,
           align: 'center',
           width: 300,
           renderer: function(value,r,d) {
           		var str = ""
       			var pubId = d.get('pubinfoId')
        		var content = d.get('pubContent')
           		if(d.get('state') == "new") 
		    		str = "<img src='jsp/res/images/new.gif' style='float:left;margin:-3px;'></img>"+"<u style='color:green;font:bold;cursor:hand;' onclick=newMessage('"+pubId+"','"+userid+"','"+content+"','new',false)>"+value+""+"</u>"
		    	else
		    		str = "<u style='color:green;font:bold;cursor:hand;' onclick=newMessage('"+pubId+"','"+userid+"','"+content+"','old',false)>"+value+"</u>"
		    	return str
           }
        }, {
           id:'pubContent',
           header: fc['pubContent'].fieldLabel,
           dataIndex: fc['pubContent'].name,
           hidden: true,
           width: 300
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
           id:'pubUnit',
           header: fc['pubUnit'].fieldLabel,
           dataIndex: fc['pubUnit'].name,
           width: 200,
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
           hidden: true,
           width: 100
        }, {
           id:'pubinfoId',
           header: fc['pubinfoId'].fieldLabel,
           dataIndex: fc['pubinfoId'].name,
           width: 100,
           align: 'center',
           renderer: function(infoId,r,d) {
           		var isNew = d.get('state')
        		var content = d.get('pubContent')
           		DWREngine.setAsync(false);
		    	var flag = false
		    	infoPubService.checkFileExist(infoId,function(data) {
		    		flag = data
		    	})
		    	DWREngine.setAsync(true);
           		if(flag)
           			return "<u style='color:blue;font:bold; cursor:hand;' onclick=newMessage('"+infoId+"','"+userid+"','"+content+"','"+isNew+"',true)>查看</u>"
           		else
           			return "<div style='color:red;'>未上传</div>"
           }
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
	
	queryBtn = new Ext.Toolbar.Button({
			id: 'query',
			text: '查询',
			iconCls : 'option',
			handler: onItemClick
	});
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,							//数据源
        cm: cm,							//列模型
        sm: sm,							//行选择模式
        tbar: [],						//顶部工具栏，可选
        //title: "",					//面板标题
        //iconCls: 'icon-by-category',	//面板样式
        addBtn: false ,
        saveBtn: false ,
        delBtn: false ,
        //refreshBtn: false,
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
      	business: "infoPubService",	
      	primaryKey: primaryKey,
      	crudText: {
      		add: '转发'
      	}
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
										    	tooltip: '附件查看',
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
            text: '关闭',
            handler: function(){
            	ifLoadGrid = true
            	formWindow.hide();
            }
        }]
	});
	var gridTopBar = gridPanel.getTopToolbar()
	gridTopBar.add("-",queryBtn,"-")
	
    ds.load({
    	params:{
	    	start: 0,			//起始序号
	    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
    	}
    });
    
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
				items: [pubTitle,startDate,endDate]
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
		var records = sm.getSelections()
		var data = window.frames["content"].getUnitId()
		if(data.length > 0) {
			var arr = data.split("`")
			var ids = arr[0]
			var type = "save"
			if(arr.length == 2)
				type = arr[1]
			infoPubService.publishInfo(records[0].get("pubinfoId"),ids,type,function(dat){
				if(dat) 
					showExtMsg("转发成功!")
				else
					showExtMsg("转发失败!")
				win.hide()
			})
		}
	}
	
	function execQuery(){
		var form = queryForm.getForm(), queStr = '';
		if (form.isValid()){
			if (pubTitle.getValue().length != 0)
				queStr += ";title`" + pubTitle.getValue();
			if(startDate.getValue().length != 0)			
				queStr += ";startDate`" + startDate.getValue().dateFormat('Y-m-d');
			if(endDate.getValue().length != 0)			
				queStr += ";endDate`" + endDate.getValue().dateFormat('Y-m-d');
				
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
				showFileWin("pubinfo",pubinfoId,false)
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

function newMessage(pubId,userId,content,isNew,isFile) {
	if(isNew == 'new') {
		infoPubService.saveHistoryUser(pubId,userId,function() {
			ds.baseParams.params = listWhere
			ds.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
		})
	}
	if(isFile)
		showFileWin('',pubId,false)
	else 
            detailShow(pubId)
              /*showContentWin(content)*/
}

function showContentWin(content){
	contentWin = new Ext.Window({title:"内容查看", 			
		width:400, 			
		height:300, 
		html:content,			
		maximizable:true}); 	 
	contentWin.show()
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
                formWindow.setTitle("详细信息");
	   	formWindow.show();
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
</script>