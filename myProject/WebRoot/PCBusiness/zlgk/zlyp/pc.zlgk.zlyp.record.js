var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypRecord";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "uuid";

var formWindow;
var uploadWin;
var formPanelinsert;
var ds;
var gridPanel;

var getLevelArr = new Array();
var fileArr = new Array();
var billstateArr = new Array();
var unitArr = new Array();


var getFielId = "''";
var whereSql = ' 1=1 ';
var businessType = 'zlMaterail';
var paramsStr = "";
var loadFormRecord = null;
var count=0;

Ext.onReady(function(){

//************************获取相关的数据Start******************
    DWREngine.setAsync(false);
	appMgm.getCodeValue('验收等级',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			getLevelArr.push(temp);			
		}
    });
    //审批状态
    appMgm.getCodeValue('审批状态',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			billstateArr.push(temp);			
		}
    });
    var querySql = "select fileid,filename from APP_FILEINFO where fileid in (" +
    		"  select filelsh from pc_zlgk_zlyp_record) order by filedate desc"
    baseMgm.getData(querySql,function(list){
       		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			fileArr.push(temp);			
		}
    })
    //施工单位
    baseMgm.getData("select t.unitid,t.unitname from sgcc_ini_unit t",function(list){
       		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			unitArr.push(temp);			
		}
    })
	DWREngine.setAsync(true);
	
	var fileDs =  new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : fileArr
	})
	
	var getLevelDs = new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : getLevelArr
	})
	
	var unitDs = new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : unitArr
	})
//************************获取相关的数据END********************	

//**************************页面信息Start********************
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = {
		   'uuid' :{
				name: 'uuid',
				fieldLabel: '主键',
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	         },
	        'treeUuid' : {
				name: 'treeUuid',
				fieldLabel: '质量验评分类树主键',
				anchor:'95%'
	         },
	       'fileNo' : {
				name: 'fileNo',
				fieldLabel: '文件编号',
				allowBlank : false,
				anchor:'95%'
	         },
	       'fileName' : {
				name: 'fileName',
				fieldLabel: '文件名称',
				allowBlank : false,
				anchor:'95%'
	         },
	       'filelsh' : {
				name: 'filelsh',
				fieldLabel: '上传文件',
				readOnly : true,
				anchor:'95%',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            disabled : true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: fileDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'checkLevel' : {
				name: 'checkLevel',
				fieldLabel: '验收等级',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: getLevelDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'checkResult' : {
				name: 'checkResult',
				fieldLabel: '验收结果',
				anchor:'95%'
	         },
	       'checkDate' : {
				name: 'checkDate',
				fieldLabel: '验收日期',
				format : 'Y-m-d',
				minValue : '2010-01-01',
				anchor:'95%'
	         },
	       'billstategl' : {//状态/审批(管理)
				name: 'billstategl',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	        'billstatesp' : {//状态/审批(审批)
				name: 'billstatesp',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	        'billstatecx' : {//状态/审批(查询)
				name: 'billstatecx',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	       'unit' : {
				name: 'unit',
				fieldLabel: '施工单位',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: unitDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'createMan' : {
				name: 'createMan',
				fieldLabel: '上报人',
				anchor:'95%'
	         },
	       'createManId' : {
				name: 'createManId',
				fieldLabel: '上报人ID',
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	         },
	       'approvalMan' : {
				name: 'approvalMan',
				fieldLabel: '审批人',
				hidden:true,
				hideLabel:true,
				anchor:'95%'	       
	       }, 
	       'backMan' : {
				name: 'backMan',
				fieldLabel: '撤销审批人',
				hidden:true,
				hideLabel:true,
				anchor:'95%'	       
	       },
	       'pid' : {
				name: 'pid',
				fieldLabel: 'PID',
				anchor:'95%'
	         },
	       'memo' : {
				name: 'memo',
				fieldLabel: '备注',
				height: 50,
				width: 700,
				xtype: 'textarea',
				anchor:'95%'
	         }
	};
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm =new Ext.grid.ColumnModel([
	       sm,
	       {
				id : 'uuid',
				header : fc['uuid'].fieldLabel,
				dataIndex : fc['uuid'].name,
				hidden : true,
				width : 100
			},  {
				id : 'treeUuid',
				header : fc['treeUuid'].fieldLabel,
				dataIndex : fc['treeUuid'].name,
				hidden : true,
				width : 100
			},  {
				id : 'fileNo',
				header : fc['fileNo'].fieldLabel,
				dataIndex : fc['fileNo'].name,
				align : 'center',
				type : 'string',
				width : 100
			}, {
				id : 'fileName',
				header : fc['fileName'].fieldLabel,
				dataIndex : fc['fileName'].name,
				align : 'center',
				type : 'string',
				renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
						if(record.data.filelsh == null || record.data.filelsh == ''){
						   var qtip = "qtip=文件没有上传，不能下载！";
						   return '<span ' + qtip + ' style='+'"color:blue;"'+'>' +value+ '</span>';
						}			
						var url = "servlet/MainServlet?ac=downloadfile&fileid="
						        + record.data.filelsh;
						return "<center><a href='" + url + "'><span style='color:blue; '>" +value+"</span></a></center>"
				},
				width : 200
			}, {
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				align : 'center',
				width : 100,
				renderer : function(value, metaData, record, rowIndex,
								colIndex, store){
						var downloadStr="";
						var infoid = record.get('uuid');
						var billstate = record.get('billstategl');
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+infoid+
				                           "' and transaction_type='"+businessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						if(billstate == 0){
						   downloadStr="附件["+count+"]";
						   editable1 = true;
						}else{
						   downloadStr="附件["+count+"]";
						   editable1 = false;
						}	
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable1 + ', \''
									+ infoid
									+ '\', \''+"文件附件"+'\')">' + downloadStr +'</a></div>'
					
					
					    }
			}, {
				id : 'checkLevel',
				header : fc['checkLevel'].fieldLabel,
				dataIndex : fc['checkLevel'].name,
				align : 'center',
				width : 100,
				renderer : function(value){
				    for(var i = 0; i < getLevelArr.length; i ++){
				       if(value == getLevelArr[i][0]){
				          return getLevelArr[i][1];
				       }
				    }
				}
			}, {
				id : 'checkResult',
				header : fc['checkResult'].fieldLabel,
				dataIndex : fc['checkResult'].name,
				align : 'center',
				width : 100
			}, {
				id : 'checkDate',
				header : fc['checkDate'].fieldLabel,
				dataIndex : fc['checkDate'].name,
				renderer : formatDate,
				type : 'date',
				align : 'center',
				width : 100
			}, {
				id : 'billstategl',
				header : fc['billstategl'].fieldLabel,
				dataIndex : fc['billstategl'].name,
				align : 'center',
				hidden : edit_flag == "addOrupdate" ? false:true,
				renderer : function(value,meta,record){
		            var renderStr="";
						if(value=="0") return "<font color=gray>未上报</font>";
						if(value=="1") renderStr="<font color=black>已上报</font>";
						if(value=="2") renderStr="<font color=red>审批完成</font>";
						if(value=="3") renderStr="<font color=blue>退回重报</font>";
						if(value=="4") renderStr="<font color=blue>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"addOrupdate"+"\")'>"+renderStr+"</a>";
				},
				width : 100
			}, {
				id : 'billstatesp',
				header : fc['billstatesp'].fieldLabel,
				dataIndex : fc['billstatesp'].name,
				align : 'center',
				hidden : edit_flag == "approval" ? false:true,
				renderer : function(value,meta,record){
		            var renderStr="";
						if(value=="0") renderStr="<font color=gray>未审批</font>";
						if(value=="1") renderStr="<font color=black>审批完成</font>";
						if(value=="2") renderStr="<font color=blue>退回重报</font>";
						if(value=="3") renderStr="<font color=blue>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"approval"+"\")'>"+renderStr+"</a>";
				},
				width : 100
			}, {
				id : 'billstatecx',
				header : fc['billstatecx'].fieldLabel,
				dataIndex : fc['billstatecx'].name,
				align : 'center',
				hidden : edit_flag == "query" ? false:true,
				renderer : function(value,meta,record){
		            var renderStr="";
                        if(value=="0") renderStr = "<font color=gray>审批完成</font>";
						if(value=="1") renderStr="<font color=black>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"query"+"\")'>"+renderStr+"</a>";
				},
				width : 100
			}, {
				id : 'unit',
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				align : 'center',
				hidden : (edit_flag == "approval" || edit_flag == "query")?true:false,
				renderer : function(v){
					for(var i = 0; i < unitArr.length;i ++){
					   if(v==unitArr[i][0]){
						   	 var qtip = "qtip=" + unitArr[i][1];
			                 return '<span ' + qtip + '>' + unitArr[i][1] + '</span>';
					   }
					}
				},
				width : 180
			}, {
				id : 'createMan',
				header : fc['createMan'].fieldLabel,
				dataIndex : fc['createMan'].name,
				align : 'center',
				width : 100
			}, {
				id : 'createManId',
				header : fc['createManId'].fieldLabel,
				dataIndex : fc['createManId'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'approvalMan',
				header : fc['approvalMan'].fieldLabel,
				dataIndex : fc['approvalMan'].name,
				align : 'center',
				hidden : edit_flag == 'approval'?false:true,
				width : 100
			}, {
				id : 'backMan',
				header : fc['backMan'].fieldLabel,
				dataIndex : fc['backMan'].name,
				align : 'center',
				hidden : edit_flag == 'query'?false:true,
				width : 100
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'memo',
				header : fc['memo'].fieldLabel,
				dataIndex : fc['memo'].name,
				align : 'center',
				width : 100
			}
	])
	
	
	var Columns = [
			{name: 'uuid' , type: 'string'},
			{name: 'treeUuid' , type: 'string'},
			{name: 'fileNo' , type: 'string'},
			{name: 'fileName' , type: 'string'},
			{name: 'filelsh' , type: 'string'},
			{name: 'checkLevel' , type: 'string'},
			{name: 'checkResult' , type: 'string'},
			{name: 'checkDate' , type : 'date',dateFormat : 'Y-m-d H:i:s'},
			{name: 'billstategl' , type: 'string'},
			{name: 'billstatesp' , type: 'string'},
			{name: 'billstatecx' , type: 'string'},
			{name: 'unit' , type: 'string'},
			{name: 'createMan' , type: 'string'},
			{name: 'createManId' , type: 'string'},
			{name: 'approvalMan' ,type : 'string'},
			{name: 'backMan', type : 'string'},
			{name: 'pid' , type: 'string'},
			{name: 'memo' , type: 'string'}
	]
	if(edit_flag == 'addOrupdate'){
	   whereSql = " 1=1 ";
	}else if(edit_flag == 'approval'){
	   whereSql	 = " billstatesp in ('0','1','2','3')";
	}else if(edit_flag == 'query'){
	   whereSql	 = " billstatecx in ('0','1')";
	}
	//高级查询时代条件查询
	fixedFilterPart = whereSql;
	ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: bean,				
		    	business: business,
		    	method: listMethod,
		    	params: whereSql
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: primaryKey
	        }, Columns),
	        remoteSort: true,
	        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');
    cm.defaultSortable = true;
	
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
	       uuid : '',
	       treeUuid : selectUuid,
	       fileNo : '',
	       fileName : '',
	       filelsh : '',
	       checkLevel : '',
	       checkResult : '',
	       checkDate : new Date(),
	       billstategl : '0',
	       billstatesp : '0',
	       billstatecx : '0',
	       unit : '',
	       createMan : REALNAME,
	       createManId : USERID,
	       pid : PID,
	       memo : ''
    }
//***********************管理功能按钮start****************    
   var addBtn =  new Ext.Button({
		id : 'add',
		text : '新增',
		iconCls : 'add',
		handler : addOrUpdate
	});
	var updBtn = new Ext.Button( {
		id : 'update',
		text : '修改',
		iconCls : 'btn',
		handler : addOrUpdate
	});
	var delBtn =  new Ext.Button({
		id : 'delete',
		text : '删除',
		iconCls : 'remove',
		handler : addOrUpdate
	});
	var reportBtn =  new Ext.Button({
		id : 'report',
		text : '上报',
		icon : CONTEXT_PATH + "/jsp/res/images/file-upload.gif",
		cls : "x-btn-text-icon",
		handler : addOrUpdate
	});
	var downBtn = new Ext.Button({
	     id : 'down',
	     text : "下载分类模板<span style='color:blue;'>["+count+"]</span>",
	     icon : CONTEXT_PATH + '/jsp/res/images/white_word.png',
	     cls : "x-btn-text-icon",
	     handler : addOrUpdate
	})	
	var  removeBtn = new Ext.Button({
	      id : 'remove',
		  text : '移交文件',
		  icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
		  cls : "x-btn-text-icon",
		  handler : addOrUpdate
	})
	
//**********************管理功能按钮END*******************

//*********************审批功能按钮start******************	
	
	var approvalBtn = new Ext.Button({
	     id : 'approval',
	     text : '审批',
	     icon : CONTEXT_PATH + '/jsp/res/images/pass2.png',
	     cls : "x-btn-text-icon",
	     handler : addOrUpdate
	})

	var backBtn = new Ext.Button({
	     id : 'back',
	     text : '退回',
	     icon : CONTEXT_PATH + '/jsp/res/images/sendBack2.png',
	     cls : "x-btn-text-icon",
	     handler : addOrUpdate
	})
//**********************审批功能按钮end******************

//**********************查询功能按钮Start****************
	var backSpBtn = new Ext.Button({
	     id : 'backSp',
	     text : '撤销审批',
	     icon : CONTEXT_PATH + '/jsp/res/images/icons/arrow_undo.png',
	     cls : "x-btn-text-icon",
	     handler : addOrUpdate
	})
//**********************查询功能按钮End****************
	
	var btnS = "";
	if(edit_flag == 'addOrupdate'){//质量验评记录管理
	    btnS = ['<font color=#15428b><B>质量验评记录管理<B></font>','-',addBtn,'-',updBtn,'-',delBtn,'-',reportBtn,'-',downBtn,'-',removeBtn,'->'];
	}else if(edit_flag == 'approval'){//质量验评记录审批
	    btnS = ['<font color=#15428b><B>质量验评记录审批<B></font>','-',approvalBtn,'-',backBtn,'->']
	}else if(edit_flag == 'query'){
	    btnS = ['<font color=#15428b><B>质量验评记录查询<B></font>','-',backSpBtn,'->'];
	}
	
    gridPanel = new Ext.grid.QueryExcelGridPanel({
			ds : ds,
			cm : cm,
			sm : sm,
			title : '质量验评管理',
			tbar : btnS,
			saveBtn : false,
			addBtn : false,
			delBtn : false,
			header: false,
		    border: false,
		    layout: 'fit',
		    region: 'center',
	        stripeRows:true,
	        loadMask : true,
	        width:600,
            height:300,
		    viewConfig: {
		        forceFit: false,
		        ignoreAdd: true
		    },
		    enableHdMenu : false,
		    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: ds,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        }),
			plant : Plant,
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : bean,
			business : business,
			primaryKey : primaryKey
	})

	var viewPort = new Ext.Viewport({
		   layout : 'border',
		   items : [treePanel,gridPanel]
	})
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	treePanel.expandPath('/01/');
	
	sm.on('rowselect',function(){
		 var record = sm.getSelected();
     	if(edit_flag == 'addOrupdate'){
     		 var billstate = record.get('billstategl');
		     if(billstate == '0' ||  billstate == '3'){
		         updBtn.setDisabled(false);
		         delBtn.setDisabled(false);
		         reportBtn.setDisabled(false);
		     }else{
		         updBtn.setDisabled(true);
		         delBtn.setDisabled(true); 
		         reportBtn.setDisabled(true);
		     }
		}else if(edit_flag == 'approval'){
			var billstate = record.get('billstatesp');
			if(billstate == '1' || billstate == "2"){
			   approvalBtn.setDisabled(true);
			   backBtn.setDisabled(true);
			}else{
			   approvalBtn.setDisabled(false);
			   backBtn.setDisabled(false);
			}
			
		}else if(edit_flag == 'query'){
			var billstate = record.get('billstatecx');
			if(billstate == '1' ){
			   backSpBtn.setDisabled(true);
			}else{
			   backSpBtn.setDisabled(false);
			}
		}
	})
	
	treePanel.on('click',function(node,e){
		   	//*****************获取模板数量Start***********************
            var downloadStr="";
			DWREngine.setAsync(false);
	        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+node.id+
	                           "' and transaction_type='"+businessType+"'", function (jsonData) {
				    var list = eval(jsonData);
				    if(list!=null){
				   	    count=list[0].num;
				     		 }  
				      	 });
		    DWREngine.setAsync(true);
		    getTemplateNum = "<span style='color:blue;'>["+count+"]</span>";
		    downBtn.setText("下载分类模板"+getTemplateNum);
		  //*****************获取模板数量Start***********************
	})
//**************************页面信息END********************	

	
//***********************新增功能按钮Start*******************	
	var fileCom = new fm.ComboBox(fc['filelsh']);
	if(!formPanelinsert){
		    formPanelinsert = new Ext.form.FormPanel({
		        id: 'form-panel',
		        header: false,
		        border: false,
		        split: true,
		        anchor : '100%',
		        title : '验评记录新增',
		        width:document.body.clientWidth,
	            height:document.body.clientHeight,
		        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
		    	iconCls: 'icon-detail-form',	//面板样式
		    	labelAlign: 'left',
		    	items: [
						new Ext.form.FieldSet({
			    			title: '基本信息',
			                border: true,
			                layout: 'column',
			                items:[{
				   					layout: 'form', columnWidth: .5,
				   					bodyStyle: 'border: 0px;',
				   					items:[
				   					     new fm.Hidden(fc['pid']),
				   					     new fm.Hidden(fc['unit']),
				   					     new fm.Hidden(fc['treeUuid']),
				   					     new fm.Hidden(fc['billstategl']),
				   					     new fm.Hidden(fc['billstatesp']),
				   					     new fm.Hidden(fc['billstatecx']),
				   					     new fm.Hidden(fc['createMan']),
				   					     new fm.TextField(fc['fileNo']),
				   					     new fm.Hidden(fc['filelsh']),//fileCom,
				   					     {
					                        layout : 'column',
											border : false,
											items : [{
													layout : 'form',
													columnWidth : .85,
													border : false,
													items : [ new fm.TextField(fc['fileName'])]
												}, {
													layout : 'form',
													columnWidth : .15,
													bodyStyle: 'border: 10px; padding: 2px 5px;',
													border : false,
													items : [new Ext.Button({
																iconCls : 'upload-icon',
																tooltip : '上传文件',
																minWidth : 20,
																handler : upload
															})]
												}]
									     },
									     new fm.TextField(fc['checkResult'])
									]
			    				},{
			    					layout: 'form', columnWidth: .5,
			    					bodyStyle: 'border: 0px;',
			    					items:[
			    					      new fm.Hidden(fc['uuid']),
			    					      new fm.ComboBox(fc['checkLevel']),
			    					      new fm.DateField(fc['checkDate'])
			    					]
			    				}  				
			    			]
			    		}),new Ext.form.FieldSet({
				    			layout: 'form',
				                border:true,
				                cls:'x-plain',
				                xytpe : 'textarea',
				                items: [
				                    new fm.TextField(fc['createManId']),
				   					fc['memo']
								]
				    		})
				    	],
				    	listeners : { 
							'render' : function() { 
							 this.findByType('textfield')[0].focus(true, true); //第一个textfield获得焦点 
						  } 
						}
		    })	
	}		

	
//***********************新增功能按钮End*******************	
	
//*************************function*********************
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

	var  fileUploadUrl = CONTEXT_PATH
						+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
						+ true + "&businessId=" + null;
	var  filePanel = new Ext.Panel({
            frame:true,
			border : true,
			region : "south",
			height : document.body.clientHeight*0.4,
			split : true,
			title : "附件",
			html : "<iframe id='fileFrame' name='fileFrame' src='"
					+ fileUploadUrl
					+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
    var formPanel = new Ext.Panel({
             region : "center", 
             items : [formPanelinsert]//,filePanel

		})    
    
    function addOrUpdate(btn){
    	var msgS = '';
	    var msgstr = '';
	    var whereSql = ''; 
	    var makeActionS = '';
	    var flag = '';
        var addOrquery = '';
        var querySql =  '';
        var strFlag = 'query';
        var btnId = this.id;
		var form =  formPanelinsert.getForm();
		var formRecord = Ext.data.Record.create(Columns);
		var record = gridPanel.getSelectionModel().getSelected();
	    if(!formWindow){
	           formWindow  = new Ext.Window({	               
	                width:document.body.clientWidth,
	                height:document.body.clientHeight,
	                title : '质量验评记录信息',
	                closeAction:'hide',
	                maximizable : true,
	                plain: true,
	                modal:true,
	                closable : false,
	                autoScroll:true,
	                buttonAlign : 'center',
	                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
	                items: [formPanel],
	                animEl:'action-new',
	                listeners: {
						    'hide' : function(){
						        formWindow.hide();
						        formWindow = null;
						    }
						},
					buttons : [
					     {
						   name: 'save',
				           text: '保存',
				           iconCls: 'save',
				           handler: formSave
						 },{
						   name: 'remove',
				           text: '关闭',
				           iconCls: 'remove',
				           handler: removeFn					 
						 }
					]	
	            });
         	}
//新增功能按钮   
       if(btnId == 'add'){
            if(selectUuid == '' || selectUuid == '01'){
               Ext.example.msg('提示信息',"请选择验评标准树下的节点!");
               return;
            }else{
               loadFormRecord = new formRecord({
				       uuid : '',
				       treeUuid : selectUuid,
				       fileNo : '',
				       fileName : '',
				       filelsh : '',
				       checkLevel : '',
				       checkResult : '',
				       checkDate : new Date(),
				       billstategl : '0',
				       unit : USERDEPTID,
				       createMan : REALNAME,
				       createManId : USERID,
				       pid : PID,
				       memo : ''
				})
			   formWindow.show();
               formPanelinsert.getForm().reset();
               formPanelinsert.getForm().loadRecord(loadFormRecord);
               formPanelinsert.getForm().findField('fileNo').focus(true, true);
            }
//修改功能按钮            
        }else if(btnId == 'update'){
        	  if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要修改的记录!");
                   return;
        	   }
          	   DWREngine.setAsync(false);
			   baseMgm.findById(bean, record.data.uuid,function(obj){
					loadFormRecord = new formRecord(obj);
			   });
			   DWREngine.setAsync(true);
        	   formWindow.show();
//        	   var  fileUploadUrl = CONTEXT_PATH
//						+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
//						+ true + "&businessId=" + record.data.uuid;
//			   fileFrame.location.href = fileUploadUrl;
               formPanelinsert.getForm().reset();
               formPanelinsert.getForm().loadRecord(loadFormRecord);
        }else if(btnId == 'delete'){//删除功能按钮
         	  if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要修改的记录!");
                   return;
        	   }
        	  var delBeforeFileId = record.data.uuid;
	   	      var getFielIds = "'"+record.data.filelsh+"'";
//        	  gridPanel.defaultDeleteHandler();
	   	      Ext.Msg.confirm('信息提示','删除操作不可恢复，是否删除选中记录信息？',function(btn){
	   	                if(btn=='yes'){
	   	                	  DWREngine.setAsync(false);
						      zlgkMgm.delAppFileinfoAndAppBlob(delBeforeFileId,getFielIds,function(){
						            Ext.example.msg('提示信息',"删除成功!");
                                    return;
						      });
						      DWREngine.setAsync(true);
						      ds.reload();
	   	                }
	   	      })
//上报功能按钮
		 }else if(btnId == 'report'){
         	  if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要上报的记录!");
                   return;
        	   }
        	   var billstategl = record.data.billstategl;
        	   if(billstategl == "0" || billstategl == "3"){
	        	   makeActionS = '1';
        	       if(billstategl == "0") {
        	          msgS = "是否要对该数据进行上报？";
        	          msgstr = "您上报了一条数据!";
        	       }
        	       if(billstategl == "3") {
        	          msgS = "是否要对该数据进行重新上报？";
        	          msgstr = "您重新上报了该数据!";
        	       }
        	       whereSql = " t.billstategl='"+makeActionS+"',t.billstatesp='0' ,create_man='"+REALNAME+"' ";
        	       commonS(record,makeActionS,msgstr,msgS,whereSql);
        	   }else{
        	   	  querySql = "select t.message from PC_ZLGK_ZLYP_REPORT t where " +
        	   	  		     " t.record_uuid='"+record.data.uuid+"' and t.make_action='1' and make_man='"+REALNAME+"'" +
        	   	  		     " and t.make_date=  (select max(r.make_date) from PC_ZLGK_ZLYP_REPORT r where r.record_uuid='"+record.data.uuid+"')";
        	      DWREngine.setAsync(false);
        	      baseDao.getData(querySql,function(str){
        	         for(var i = 0; i < str.length; i++){
        	      	   if(str[i] == null || str[i] == ''){
        	      	          strFlag  = '';
        	      	          break;
        	      	      }
	        	      }
        	      })
        	      DWREngine.setAsync(true);
        	      if(strFlag == ""){
        	             flag = 'add';
        	             addOrquery = '该数据已上报，未填写意见，是否填写或查询？';
        	        }else {
        	             flag = 'query';
        	             addOrquery = '该数据已上报，是否查询上报情况？';
        	      }
        	      Ext.MessageBox.confirm('信息提示',addOrquery,function(btn){
        	               if(btn == 'yes'){
        	                  showReportLog(record.data.pid,record.data.uuid,flag);
        	               }
        	      })
        	            
        	   }
//审批功能按钮       	   
        }else if(btnId == "approval"){
        	if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要审批的记录!");
                   return;
        	}
        	var billstatesp = record.data.billstatesp;
        	if(billstatesp == "0" || billstatesp == "3" ){
	              makeActionS = '2';
	              if(billstatesp == "0"){
	              	msgS = "是否要对该数据进行审批？";
	              	msgstr = "您审批了一条数据!";
	              }
	    	      if(billstatesp == "3") {
	    	         msgS = "是否要对该数据进行重新审批？";
	    	         msgstr = "您重新审批了该数据!";
	    	      }
	    	      whereSql = whereSql = " t.billstategl='2',t.billstatesp='1',t.billstatecx='0',approval_man='"+REALNAME+"'";
	    	      commonS(record,makeActionS,msgstr,msgS,whereSql);
        	}else{
        	   	  querySql = "select t.message from PC_ZLGK_ZLYP_REPORT t where t.record_uuid='"+record.data.uuid+"' " +
        	   	  		     " and t.make_action='2' and make_man='"+REALNAME+"' and t.make_date=  " +
        	   	  		     " (select max(r.make_date) from PC_ZLGK_ZLYP_REPORT r where r.record_uuid='"+record.data.uuid+"')";
        	      DWREngine.setAsync(false);
        	      baseDao.getData(querySql,function(str){
        	         for(var i = 0; i < str.length; i++){
        	      	   if(str[i] == null || str[i] == ''){
        	      	          strFlag  = '';
        	      	          break;
        	      	      }
	        	      }
        	      })
        	      DWREngine.setAsync(true);
        	      if(strFlag == ""){
        	             flag = 'add';
        	             addOrquery = '该数据已审批，未填写意见，是否填写或查询？';
        	        }else {
        	             flag = 'query';
        	             addOrquery = '该数据已审批，是否查询上报情况？';
        	       }
        	      Ext.MessageBox.confirm('信息提示',addOrquery,function(btn){
        	               if(btn == 'yes'){
        	                  showReportLog(record.data.pid,record.data.uuid,flag);
        	               }
        	      })  
        	   }
//退回功能按钮
        }else if(btnId == "back"){
            if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要退回的记录!");
                   return;
        	}
        	var billstatesp = record.data.billstatesp;
        	if(billstatesp == "0" ||  billstatesp == "3"){
    	       makeActionS = '3';
    	       msgS = "是否要对该数据进行退回？";
    	       msgstr = "您退回了一条数据!";
    	       whereSql = whereSql = " t.billstategl='3',t.billstatesp='2'";
        	   commonS(record,makeActionS,msgstr,msgS,whereSql);
        	}else if(billstatesp == "2"){
        	   	  querySql = "select t.message from PC_ZLGK_ZLYP_REPORT t where t.record_uuid='"+record.data.uuid+"' " +
        	   	  		" and t.make_action='3' and make_man='"+REALNAME+"' and t.make_date=  " +
        	   	  		     " (select max(r.make_date) from PC_ZLGK_ZLYP_REPORT r where r.record_uuid='"+record.data.uuid+"')";
        	      DWREngine.setAsync(false);
        	      baseDao.getData(querySql,function(str){
        	      	for(var i = 0; i < str.length; i++){
        	      	    if(str[i] == null || str[i] == ''){
        	      	          strFlag  = '';
        	      	          break;
        	      	      }
	        	      }
        	      })
        	      DWREngine.setAsync(true);
        	      if(strFlag == ""){
        	             flag = 'add';
        	             addOrquery = '该数据已退回，未填写意见，是否填写或查询？';
        	        }else {
        	             flag = 'query';
        	             addOrquery = '该数据已退回，是否查询上报情况？';
        	        }
        	      Ext.MessageBox.confirm('信息提示',addOrquery,function(btn){
        	               if(btn == 'yes'){
        	                  showReportLog(record.data.pid,record.data.uuid,flag);
        	               }
        	      })  
        	   }else{
         	       Ext.example.msg('提示信息',"审批完成，不可退回!");
                   return;       	   
        	   }
//撤销功能按钮        	   
        }else if(btnId == "backSp"){
         	  if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要撤回审批该记录!");
                   return;
        	   }
        	   var billstatecx = record.data.billstatecx;
        	   if(billstatecx == "0"){
	        	   makeActionS = '4';
        	       msgS = "是否要对该数据进行撤回审批？";
        	       msgstr = "您撤回审批了一条数据!";
        	       whereSql = " t.billstategl='"+makeActionS+"',t.billstatesp='3',t.billstatecx='1' ,back_man='"+REALNAME+"' ";
        	       commonS(record,makeActionS,msgstr,msgS,whereSql);
        	   }else{
        	   	  querySql = "select t.message from PC_ZLGK_ZLYP_REPORT t where " +
        	   	  		" t.record_uuid='"+record.data.uuid+"' and t.make_action='1' and make_man='"+REALNAME+"' and t.make_date=  " +
        	   	  		     " (select max(r.make_date) from PC_ZLGK_ZLYP_REPORT r where r.record_uuid='"+record.data.uuid+"')";
        	      DWREngine.setAsync(false);
        	      baseDao.getData(querySql,function(str){
        	      	for(var i = 0; i < str.length; i++){
        	      	    if(str[i] == null || str[i] == ''){
        	      	          strFlag  = '';
        	      	          break;
        	      	      }
	        	      	}
	        	    })
        	      DWREngine.setAsync(true);
        	      if(strFlag == ""){
        	             flag = 'add';
        	             addOrquery = '该数据已撤回审批，未填写意见，是否填写或查询？';
        	        }else {
        	             flag = 'query';
        	             addOrquery = '该数据已撤回审批，是否查询上报情况？';
        	      }
        	      Ext.MessageBox.confirm('信息提示',addOrquery,function(btn){
        	               if(btn == 'yes'){
        	                  showReportLog(record.data.pid,record.data.uuid,flag);
        	               }
        	      })
        	            
        	   }
//文件移交功能按钮         	   
        }else if(btnId ==  'remove'){
         	  if(record == null ||  record == ''){
        	       Ext.example.msg('提示信息',"请选择您要移交的文件!");
                   return;
        	   }
               window.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.file.yj.jsp?type="+businessType+"&fileId="
							+ record.data.uuid+"&uuid="+record.data.uuid,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
//模板下载
        }else if(btnId == "down"){
            if(selectUuid == '' || selectUuid == '01'){
               Ext.example.msg('提示信息',"请选择验评标准树下的节点!");
               return;
            }else{
            	if(count == 0){
            	   Ext.example.msg('提示信息',"没有模板，不可下载!");
            	   return;
            	}else{
					 var fileUploadUrls = CONTEXT_PATH
										+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
										+ false + "&businessId="+selectUuid;
				  	 var fileWin = new Ext.Window({
						title : "模板下载",
						width : 600,
						height : 400,
						minWidth : 300,
						minHeight : 200,
						layout : 'fit',
						closeAction : 'close',
						modal : true,
						html : "<iframe name='fileFrame' src='"
								+ fileUploadUrls
								+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
					 });
		             fileWin.show();           		
            	}
            } 
        }
    }
  
//********************上报，审批，退回，撤销审批等功能按钮实现统一处理方式Start***************
    function commonS(record,makeActionS,msgstr,msgS,whereSql){
    	var obj  = new Object();
        obj = {
	   		uuid : '',
	   		recordUuid : record.data.uuid,
		    unit : USERDEPTID,
		    makeMan : REALNAME,
		    makeAction : makeActionS,
		    message : '',
		    makeDate : new Date(),
		    pid : PID
	   }
	   Ext.Msg.show({
			   title: '提示信息',
			   msg: msgS,
			   buttons: Ext.Msg.YESNO,
			   icon: Ext.MessageBox.QUESTION,
			   fn: function(btn){
			       if(btn == 'yes'){
			        	DWREngine.setAsync(false);
						zlgkMgm.addPcZlgkZlypReport(obj,function(str){
							 if(str == "success"){
							    Ext.example.msg('提示信息',msgstr);
							    var sql = "update pc_zlgk_zlyp_record t  set "+whereSql+" where uuid='"+record.data.uuid+"'";
                                baseDao.updateBySQL(sql);
                                refresh(record.data.treeUuid);
							    showReportLog(record.data.pid,record.data.uuid,'add');
							 }else{
							     Ext.example.msg('提示信息',"该操作失败!");
							     return;
							 }
						})
						DWREngine.setAsync(false);
			       }
			   }
			   
		}); 
    }
//********************上报，审批，退回，撤销审批等功能按钮实现统一处理方式end*****************
    
//************************************附件上传Start**************************

	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
		//url: "/wbf/servlet/FlwServlet?ac=extUpload",
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传文件',
			iconCls: 'upload',
			//disabled: true,
			handler: function(){
				var delBeforeFileId = formPanelinsert.getForm().findField('filelsh').getValue();
				var filename = fileForm.form.findField("filename1").getValue()
				fileForm.getForm().submit({
					method: 'POST',
	          		params:{ac:'upload'},
					waitTitle: '请等待...',
					waitMsg: '上传中...',
					success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show();
						Ext.MessageBox.hide();
			            uploadWin.hide();
						var infos = action.result.msg;
						var fileid = infos[0].fileid; 
						var filename = infos[0].filename;
						var fileNames = "";
						if (filename && filename.length > 0) {
					            fileNames = filename.substring(filename
									.lastIndexOf("\\")
									+ 1, filename.lastIndexOf("."));
			             }
						formPanelinsert.getForm().findField('fileName').setValue(fileNames);
						formPanelinsert.getForm().findField('filelsh').setValue(fileid);
//						fileCom.setRawValue(filename);
						if(delBeforeFileId != null){
							DWREngine.setAsync(false);
						    zlgkMgm.delAppFileinfoAndAppBlob(delBeforeFileId,'');
						    DWREngine.setAsync(false);
						}
					},
					failure: function(form, action){
						Ext.Msg.alert('Error', 'File upload failure.'); 
					}
				})
			}
		}]
	});
	
    function upload(){
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
		    anchor: '90%'   
		  });
		uploadWin = new Ext.Window({
			title: '文件上传',
			layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
			maximizable: false, closable: true,
			resizable: false, modal: true, border: false,
			width: 380, height: 130,
			items: [fileForm]
		});
		uploadWin.show();
	}
//************************************附件上传END**************************	    
    
//****************************保存*****************
    function formSave(){
	        var  msgStr = "";
			var  form = formPanelinsert.getForm();
			var checkBlank = ['fileNo', 'fileName'];
			for(var i = 0 ; i <  checkBlank.length; i ++){
				if(form.findField(checkBlank[i]).getValue() == null || form.findField(checkBlank[i]).getValue() == ""){
		            Ext.example.msg('提示信息','【'+fc[checkBlank[i]].fieldLabel+'】不能为空！');
		            return true;
		        }
			}
			
			var obj = form.getValues();
	    	for(var i=0; i<Columns.length; i++) {
	    		var n = Columns[i].name;
	    		var field = form.findField(n);
	    		if (field) {
	    			obj[n] = field.getValue();
	    		}
	    	}
	    	DWREngine.setAsync(false);
	    	zlgkMgm.zlgkZlypRecordAddOrUpdate(obj,getFielId,function(str){
	    	      if(str.split("'")[0] == 'add'){
	    	      	  var getTreeUuid = str.split("'")[1]
	    	          msgStr = "您成功新增了一条质量验评记录!是否继续新增？";
	    	          Ext.Msg.show({
						   title: '提示信息',
						   msg: msgStr,
						   buttons: Ext.Msg.YESNO,
						   icon: Ext.MessageBox.QUESTION,
						   fn: function(btn){
						       if(btn == 'yes'){
						       	   formPanelinsert.getForm().loadRecord(loadFormRecord);
						       	   formPanelinsert.getForm().findField('fileNo').focus(true, true);
//						           var  fileUploadUrl = CONTEXT_PATH
//						              + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
//						              + true + "&businessId=";
//			                       fileFrame.location.href = fileUploadUrl;
						           refresh(getTreeUuid)
						           addOrUpdate('add');
						       }else{
						           refresh(getTreeUuid);
						           formWindow.hide();
						       }
						   }
						   
					    });
	    	      }else if(str.split("'")[0] == 'update'){
	    	          Ext.example.msg('信息提示',"您成功修改了一条质量验评记录!");
          			  refresh(str.split("'")[1]);
//			          window.location.reload();
			          formWindow.hide();
	    	      }
	    	});
	    	DWREngine.setAsync(true);
	    	getFielId = "''";
			
    }
//**************************刷新数据Start***********************
    
   function refresh(str){
	   	  if(selectUuid == "" || selectUuid == '01'){
	   	       ds.reload();
	   	  }else{
			    var sql = "select a.uuid from Pc_Zlgk_Zlyp_Tree a start with a.tree_id = " +
							  " (select tree_id from Pc_Zlgk_Zlyp_Tree where uuid='"+selectUuid+"')  and " +
							  " pid='"+PID+"' connect by PRIOR  a.tree_id =  a.parent_id and pid='"+PID+"'";
				var treeuuidstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
						treeuuidstr += ",'"+list[i]+"'";		
					   }
				});	
				DWREngine.setAsync(true); 
				treeuuidstr = treeuuidstr.substring(1);
		        ds.baseParams.params = "pid='"+CURRENTAPPID+"' and treeUuid in ("+treeuuidstr+") and "+ whereSql  ;
		        ds.load({params:{start:0,limit:PAGE_SIZE}});   	  
	   	  }
     }
//**************************刷新数据End*********************** 
  
//********************关闭时如何没有做保存操作而上传了文件，关闭后删除上传文件***************
     function removeFn(){
	   	   var getUuid = formPanelinsert.getForm().findField('uuid').getValue();
	   	   if(getUuid == null || getUuid == ""){
	   	      var delBeforeFileId = formPanelinsert.getForm().findField('filelsh').getValue();
	   	      DWREngine.setAsync(false);
		      zlgkMgm.delAppFileinfoAndAppBlob(delBeforeFileId,getFielId);
		      DWREngine.setAsync(false);
	   	   }
	   	   refresh(formPanelinsert.getForm().findField('treeUuid').getValue())
	       formWindow.hide();
	       getFielId = "''";
     };	
	
})


//获取附件中的相关信息，重写uploadSuccess方法
    function uploadSuccess(fileLsh, businessId, businessType, blobTable,beanName){
           getFielId +=",'"+ fileLsh +"'"
    }
//显示多附件的文件列表
function showUploadWin(businessType, editable1, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable1 + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			} 
		});
	});
}
  
//上报功能
	function showReportLog(pid,uids,flagS){
		var m_record= "?edit_uids="+uids+"&edit_pid="+pid+"&edit_flag="+flagS+"&edit_msg="+edit_flag;
	    window.showModalDialog(
			CONTEXT_PATH+ "/PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.recport.jsp"+m_record,
			null,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
		}