/**
 * 质量验评分类维护页面
 * @type 
 * @date 2013-06-3
 */

var formWindow;
var treeGridStore;
var sortRightGrid;
var pathTree;
var  fileUploadUrl;
var formRecord;
var loadFormRecord = null;

var selectedPath = "";
var excludeDept = "0";
var addOrUpdateFlag = "";
var getAddUuid =  '';
//当form展开时，如果点击treeGrid是显示数据，可修改权限限制标记
var getParentNo = "01";
//如果是子节点，在权限选中子节点时并设置为可写度，那么父节点也可写度
var gerIsLeaf = "1";
var businessType = 'zlMaterail';

Ext.onReady(function(){
    
	var engineerTypes = new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : gcTypes
	})
	var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : false
					})
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = {
	      'uuid' : {
				name: 'uuid',
				fieldLabel: '主键',
				hidden:true,
				hideLabel:true,
				anchor:'95%'
         },
          'engineerName' : {
				name: 'engineerName',
				fieldLabel: '工程名称',
				allowBlank: false,
				width:document.body.clientWidth*0.18,
				anchor:'95%'
         },
          'engineerNo' : {
				name: 'engineerNo',
				fieldLabel: '工程编号',
				allowBlank: false,
				width:document.body.clientWidth*0.18,
				anchor:'95%'
         },
         'engineerType' : {
				name: 'engineerType',
				fieldLabel: '工程类别',
	            allowBlank: true,
				emptyText: '请选择...',
				valueField: 'k', 
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            readOnly  : true,
	            triggerAction: 'all',
	            store: engineerTypes,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
	            width:document.body.clientWidth*0.17,
				anchor:'95%'
         },
          'parentNo' : {
				name: 'parentNo',
				fieldLabel: '父节点',
				allowBlank: false,
				width:document.body.clientWidth*0.18,
				anchor:'95%'
         },
         'isleaf' : {
				name: 'isleaf',
				fieldLabel: '子节点',
				allowBlank: false,
				width:document.body.clientWidth*0.18,
				anchor:'95%'
         },
         'memo' : {
				name: 'memo',
				fieldLabel: '备注',
				width:document.body.clientWidth*0.18,
				height : document.body.clientHeight*0.08,
				anchor:'95%'
         },
         'pid' : {
				name: 'pid',
				fieldLabel: 'pid',
				width:document.body.clientWidth*0.18,
				anchor:'95%'
         },
          'parentNoId' : {
	            id :'parentNoId',
	            name :'parentNoId',
	            fieldLabel: '上级工程编码',
	            readOnly  : true,
	            disabled:true,
	            width:document.body.clientWidth*0.18,
	            anchor : '95%'
         },
          'parentNoName' : {
	            id :'parentNoName',
	            name :'parentNoName',
	            fieldLabel: '上级工程名称',
	            readOnly  : true,
	            disabled:true,
	            width:document.body.clientWidth*0.18,
	            anchor : '95%'
         },
         'treeId' : {
	            id :'treeId',
	            name :'treeId',
	            fieldLabel: '树节点Id',
	            readOnly  : true,
	            disabled:true,
	            width:document.body.clientWidth*0.18,
	            anchor : '95%'
         },
         'parentId' : {
	            id :'parentId',
	            name :'parentId',
	            fieldLabel: '父节点Id',
	            readOnly  : true,
	            disabled:true,
	            width:document.body.clientWidth*0.18,
	            anchor : '95%'
         }
	};
	
	var Columns = [
	        {name : 'uuid' , type : 'string'},
	        {name : 'engineerName' , type : 'string'},
	        {name : 'engineerNo' , type : 'string'},
	        {name : 'engineerType' , type : 'string'},
	        {name : 'parentNo' , type : 'string'},
	        {name : 'isleaf' , type : 'string'},
	        {name : 'memo' , type : 'string'},
	        {name : 'pid' , type : 'string'},
	        {naem : 'parentNoId' ,type : 'string'},
	        {name : 'parentNoName' , type : 'string'},
	        {name : 'treeId' ,type : 'string'},
	        {name : 'parentId' , type : 'string'}
	];
	
    var saveBtn = new Ext.Button({
		   name: 'save',
           text: '保存',
           iconCls: 'save',
           handler: formSave
	})
	var clearBtn = new Ext.Button({
		   name: 'remove',
           text: '关闭',
           iconCls: 'remove',
           handler: clearFn
	})
	//新增修改from
    var formPanel = new Ext.FormPanel({
	        id: 'form-panel',
            title : "质量验评分类编辑",
	        border: false,
	        hegiht: document.body.clientHeight*0.5,
            bodyStyle:'padding:10px;',
	    	labelAlign: 'left',
	    	items: [
                new fm.Hidden(fc['uuid']),
                new fm.TextField(fc['parentNoId']),
                new fm.TextField(fc['parentNoName']),
                new fm.TextField(fc['engineerNo']),
                new fm.TextField(fc['engineerName']),
                new fm.ComboBox(fc['engineerType']),
                new fm.TextArea(fc['memo']),
                new fm.Hidden(fc['isleaf']),
                new fm.Hidden(fc['parentNo']),
                new fm.Hidden(fc['pid']),
                new fm.Hidden(fc['treeId']),
                new fm.Hidden(fc['parentId'])
            ],
            buttons :[saveBtn,clearBtn]
    });
    //上传附件formPanel
	fileUploadUrl = CONTEXT_PATH
					+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
					+ false + "&businessId=";
	var  filePanel = new Ext.Panel({
            frame :false,
			border : false,
			height : document.body.clientHeight*0.48,
			split : true,
            anchor : '100%',
			title : "模板",
			html : "<iframe name='fileFrame' src='"
					+ fileUploadUrl
					+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
		});	
				
//***************************权限设置Start***************
	treeGridStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name: 'leaf',
		parent_id_field_name: 'parentUnitId',
		url: CONTEXT_PATH + "/servlet/PCZlgkServlet",
   		isWorkMaterialType : true,    	
   		rowId_field_name :'unitId',
		reader: new Ext.data.JsonReader({
			id: 'unitId',
			root: 'topics',
			totalProperty: 'totalCount',
			fields:["unitId", "unitName", "parentUnitId", "unitTypeId", "sortId", "read", "write", "leaf"]
		})
	});	
	
	treeGridStore.on('beforeload',function(ds1){
   		Ext.apply(ds1.baseParams ,{
   			ac:"pcZlgkBuileRightTree",
			method: "pcZlgkBuileRightTree",
			sortId: PID,
			fileStorId: selectNode,
			pid  : PID,
			excludeDept : '01'
		})
   	});
 	treeGridStore.on("load", function(store, record, options){
 		store.each(function(r){
 			if ( !store.isLeafNode(r) ){
 				store.expandNode(r);
 			}
 		});
 	})
	var cm = new Ext.grid.ColumnModel([
		{id: 'unitName', header:"单位或部门名称",dataIndex:"unitName",width:120},
		{header:"是否叶子节点",dataIndex:"leaf",align:"center",width:11,hidden:true},
		{header:"允许查看",dataIndex:"read",width:11, align:"center",hidden:true, renderer: editorColForReadRenderFun},
    	//{header:"允许编辑",dataIndex:"write",align:"center",width:24, hidden:true,renderer: editorColForWriteRenderFun},
    	{header:"权限设置",dataIndex:"write",align:"center",width:50, renderer: editorColForReadWriteRenderFun}
	]);
	
	sortRightGrid = new Ext.ux.maximgb.treegrid.GridPanel({
			id : 'rightTree',
			title : '分类权限设置',
			cm:cm,
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			},
            layout : 'fit',
            columnWidth : .45,
            height : document.body.clientHeight,
			split : true,
			frame: false,
			border: false,
			collapsible : false,
			collapsed: false,
			animCollapse : false,
			store: treeGridStore,
			master_column_id : 'unitName',
			stripeRows: true,
			autoExpandColumn: 'unitName'
		});	
	
	
//***************************权限设置End***************   
    //编辑修改Panel
     
	var formPanelFrom = new Ext.Panel({
        layout : 'anchor',
        region:'north',
        //height : document.body.clientHeight,
        columnWidth : .55,
        items : [formPanel,filePanel]	
	})
	
    var	formPanel1	= new Ext.Panel({
             split : true,
             border : false,
             collapsible : true,
			 animCollapse : true,
			 collapseMode : 'mini',
			 region:'east',
             width : "60%",
             autoHeight:true,
             collapsed : true,
             layout : 'column',
             items : [formPanelFrom,sortRightGrid]
		})	
    
	var btnexpendAll = new Ext.Button({
	    	text : '展开',
	        iconCls : 'icon-expand-all',
	        tooltip : '全部展开',
	        handler : function() {
	           store.expandAllNode();
	        }
        }) ;
    var btnexpendClose = new Ext.Button({
	        text : '折叠',
	        iconCls : 'icon-collapse-all',
	        tooltip : '全部收起',
	        handler : function() {
	            store.collapseAllNode();
	        }
	    }) ;
    
	var tbarArr =  ['<font color=#15428b><b>&nbsp;' + "质量验评分类维护" + '</b></font>', '-',
	                 btnexpendAll,'-',btnexpendClose];
	var contentPanel = new Ext.Panel({
             region : 'center',
             layout : 'border',
             //tbar : tbarArr,
             border : false,
             height : document.body.clientHeight,
             items : [treeGrid,formPanel1]
		})
		
    var viewport = new Ext.Viewport({
					layout : 'border',
					iconCls : 'icon-show-all',
					items : [contentPanel]
				});
//*************************菜单Start***********************		
	treeGrid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		// e.preventDefault();//阻止系统默认的右键菜单
	   e.stopEvent();
	   thisGrid.getSelectionModel().selectRow(rowIndex);
	   var record = thisGrid.getStore().getAt(rowIndex);
	   selectNode = (record == null || record == "")?'':record.data.uuid;
	   var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
			handler : addOrUpdate
		};
		var menuUpdate = {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			handler : addOrUpdate
		};
		var menuDelete = {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			handler : addOrUpdate
		};
		var menuDetail = {
			id : 'overview',
			text : '　查看',
			iconCls : 'form',
			handler : addOrUpdate
		};
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : [menuAdd,menuUpdate,menuDelete, '-', menuDetail]
		});
		var record = treeGrid.getSelectionModel().getSelected();
		if(record == null || record == '')return;
		var parent = record.data.parentId;
		var enginnerNo = record.data.treeId;
		var isleaf=record.data.isleaf;
		if(enginnerNo=='01'&&parent == '0'){
//			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
			var coords = e.getXY();
			treeMenu.showAt([coords[0], coords[1]]);
		}else{
			if(isleaf=='0'){//根节点不能删除
				treeMenu.items.get("menu_del").disable();
				var coords = e.getXY();
				treeMenu.showAt([coords[0], coords[1]]);
			}else{
			    var coords = e.getXY();
				treeMenu.showAt([coords[0], coords[1]]);
			}
		}
	}
//*************************菜单End***********************				
//****************在form展开时点击左边的树结构*******************
	treeGrid.on('click',function(thisGrid, rowIndex, e){
				formRecord = Ext.data.Record.create(Columns);
		        var form =  formPanel.getForm();
		        var record = treeGrid.getSelectionModel().getSelected();
		        if(record == null || record == "") return;
		        selectedPath = store.getPath(record, "treeId");
                gerIsLeaf = record.data.isleaf;
                var flagS = true;
			    var parent = record.data.parentId;
			    var parentNoId = "";
			    var parentNoName = "";
			    if(parent != 0){
			    	 var sql = "select engineer_no,engineer_name from (select * from pc_zlgk_zlyp_tree " +
			    	 		  " start with tree_id='"+parent+"' connect by prior parent_id=tree_id)" +
			    	 		  " where pid='"+PID+"'";
			    	 DWREngine.setAsync(false);
				     baseMgm.getData(sql,function(list){
				     	parentNoId = list[0][0];
				     	parentNoName = list[0][1];
				    });
				    DWREngine.setAsync(true);
				    saveBtn.setDisabled(false);
				    getParentNo = "01";
			    }else{
			    	parentNoId = '0';
			    	parentNoName = '质量验评标准树';
			    	flagS = false;
			    	getParentNo = "";
			    	saveBtn.setDisabled(true);
			    }
			    if(addOrUpdateFlag == 'overview'){
			      flagS = false;
			    }
			  	loadFormRecord = new formRecord({
			    		parentNoId : parentNoId,
				        parentNoName : parentNoName,
	                    uuid : record.data.uuid,
				        engineerName : record.data.engineerName,
				        engineerNo : record.data.engineerNo,
				        engineerType : record.data.engineerType,
				        parentNo : record.data.parentNo,
				        isleaf : record.data.isleaf,
				        memo : record.data.memo,
				        pid : record.data.pid,
				        treeId  : record.data.treeId,
				        parentId : record.data.parentId
					});
/*			   if(record.data.isleaf == 0){
			     form.findField('engineerNo').el.dom.readOnly = true;
			   }*/
			  formPanel.isNew = false;
			  form.loadRecord(loadFormRecord);
			  selectNode = record.data.uuid;
              treeGridStore.reload();
		      sortRightGrid.getView().restoreScroll(record);
			  fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
								+ flagS + "&businessId=" + record.data.uuid;
			  fileFrame.location.href = fileUploadUrl;
		      if(addOrUpdateFlag == "update"){
		            saveBtn.setDisabled(false);
		            getParentNo = '01';
		        }else if(addOrUpdateFlag == "add"){
		        	saveBtn.setDisabled(false);
		        	getParentNo = '01';
		        }else{
		            saveBtn.setDisabled(true);
		            getParentNo = '';
		      }
		   })	
//**********************function***********************
	function addOrUpdate(node){
		   var btn = this.id;
		   formRecord = Ext.data.Record.create(Columns);
		   var form =  formPanel.getForm();
		   var record = treeGrid.getSelectionModel().getSelected();
		   if(record == null || record == ''){
		       Ext.example.msg('提示信息','请选择一条记录！');
		       return;
		   }
		   if(btn == 'menu_add' ){
		        formPanel1.expand(true);
		   	    addOrUpdateFlag = "add";
		   	    getParentNo = '01';
			    var checkFlag = false;
			    var state = this.id;
			    var treeId = "";
			    selectNode = "";
		    	var sql = "select nvl(max(tree_id),0) from pc_zlgk_zlyp_tree t where t.parent_id='"+record.data.treeId+"' and pid='"+record.data.pid+"' ";
		    	DWREngine.setAsync(false);
			    baseMgm.getData(sql,function(list){
			    	if(list == '0'){
			    	  treeId = record.data.treeId + '01';
			    	}else{
			    	   if(list.toString().length>16){
				    	   var str1 = list.toString().substring(0,list.toString().length-6);
				    	   var str2 = list.toString().substring(list.toString().length-6,list.toString().length);
				    	   str2 = "0"+(parseInt(str2,10)+1).toString();
				    	   treeId = str1+str2;
			    	   }else{
			    	       treeId = "0"+(parseInt(list,10)+1).toString();
			    	   }
			    	  
			    	}
			    });
			    DWREngine.setAsync(true);
			    saveBtn.setDisabled(false);
			    getParentNo = "01";
			    loadFormRecord = new formRecord({
			    		parentNoId : record.data.engineerNo,
				        parentNoName : record.data.engineerName,
	                    uuid : '',
				        engineerName : '',
				        engineerNo : '',
				        engineerType : '',
				        parentNo : record.data.engineerNo,
				        isleaf : '1',
				        memo : '',
				        pid : PID,
				        treeId : treeId,
				        parentId : record.data.treeId
							});
				formPanel.isNew = false;
				form.loadRecord(loadFormRecord);
				form.findField('engineerNo').el.dom.readOnly = false;
				fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
								+ false + "&businessId=null";
			    fileFrame.location.href = fileUploadUrl;
			    saveBtn.setDisabled(false);
				treeGridStore.reload();
		   }else if(btn == 'menu_update'){
		   	    formPanel1.expand(true);
                addOrUpdateFlag = "update";
                getParentNo = '01';
			    var parent = record.data.parentId;
			    var parentNoId = "";
			    var parentNoName = "";
			    if(parent != 0){
			    	 var sql = "select parent_no,engineer_name from (select * from pc_zlgk_zlyp_tree " +
			    	 		  " start with tree_id='"+parent+"' connect by prior parent_id=tree_id)" +
			    	 		  " where pid='"+PID+"'";
			    	 DWREngine.setAsync(false);
				     baseMgm.getData(sql,function(list){
				     	parentNoId = list[0][0];
				     	parentNoName = list[0][1];
				    });
				    DWREngine.setAsync(true);
			    } 
			  	loadFormRecord = new formRecord({
			    		parentNoId : parentNoId,
				        parentNoName : parentNoName,
	                    uuid : record.data.uuid,
				        engineerName : record.data.engineerName,
				        engineerNo : record.data.engineerNo,
				        engineerType : record.data.engineerType,
				        parentNo : record.data.parentNo,
				        isleaf : record.data.isleaf,
				        memo : record.data.memo,
				        pid : record.data.pid,
				        treeId : record.data.treeId,
				        parentId : record.data.parentId
					});
		/*	   if(record.data.isleaf == 0){
			     form.findField('engineerNo').el.dom.readOnly = true;
			   }*/
			  formPanel.isNew = false;
			  form.loadRecord(loadFormRecord);
			  fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
								+ true + "&businessId=" + record.data.uuid;
			  fileFrame.location.href = fileUploadUrl;
			  saveBtn.setDisabled(false);
		      treeGridStore.reload();
		   
		   }else if(btn == 'menu_del'){
		   	   var isleaf = record.data.isleaf;
		   	   var uuid = record.data.uuid;
		   	   var msgStr = "";
		   	   formPanel1.collapse(true);
		   	   var checksql="select * from PC_ZLGK_ZLYP_RECORD where TREE_UUID='"+uuid+"' ";
		   	   var hasData=false;
      			DWREngine.setAsync(false);
      			baseDao.getData(checksql, function(list) {
      				if(list!=null&&list.length>0){
      					hasData=true;
      				}
      			})
      			DWREngine.setAsync(true);
      			if(hasData){
      				Ext.example.msg('提示','该分类下已有数据，不能删除!');
      				return;
      			}
		   	   var delMsgStr = "该操作不可恢复，是否要删除:<span style='color:red;'></br>【工程名称】:"+record.data.engineerName
		   	                 + "、【工程编号】："+record.data.engineerNo+"</span> ";
//		   	   if(isleaf == '1'){
		   	      msgStr  = "节点信息";
//		   	   }else{
//		   	      msgStr += "节点及子节点信息";
//		   	   }
		   	   delMsgStr += msgStr+"?";
		       Ext.Msg.show({
					title : '信息提示',
					msg : delMsgStr,
					buttons : Ext.Msg.YESNO,
					icon : Ext.MessageBox.QUESTION,
					fn : function(btn) {
					    if(btn == 'yes'){
					    	DWREngine.setAsync(false);
					        zlgkMgm.zlypDeleteDate(record.data.uuid,PID,record.data.parentId,record.data.treeId,function(str){
					        	 if(str == null || str == ""){
					        	    Ext.example.msg('提示信息','删除失败！');
					        	 }else{
					        	    Ext.example.msg('提示信息','您成功删除了【'+record.data.engineerName+'】'+msgStr+'，共<span style="color:red;">'+str+'</span>条记录!');
					        	 } 
								 selectCrrentTreeNode();
								 store.load();
					        });
					        DWREngine.setAsync(false);
					    }
					}
		       });
		   }else if(btn == "overview"){
		   	    formPanel1.expand(true);
			    var parent = record.data.parentId;
			    var parentNoId = "";
			    var parentNoName = "";
			    addOrUpdateFlag = 'overview';
			    getParentNo = '';
			    if(parent != 0){
			    	 var sql = "select parent_no,engineer_name from (select * from pc_zlgk_zlyp_tree " +
			    	 		  " start with tree_id='"+parent+"' connect by prior parent_id=tree_id)" +
			    	 		  " where pid='"+PID+"'";
			    	 DWREngine.setAsync(false);
				     baseMgm.getData(sql,function(list){
				     	parentNoId = list[0][0];
				     	parentNoName = list[0][1];
				    });
				    DWREngine.setAsync(true);
			    } 
			  	loadFormRecord = new formRecord({
			    		parentNoId : parentNoId,
				        parentNoName : parentNoName,
	                    uuid : record.data.uuid,
				        engineerName : record.data.engineerName,
				        engineerNo : record.data.engineerNo,
				        engineerType : record.data.engineerType,
				        parentNo : record.data.parentNo,
				        isleaf : record.data.isleaf,
				        memo : record.data.memo,
				        pid : record.data.pid,
				        treeId : record.data.treeId,
				        parentId : record.data.parentId
					});
			   if(record.data.isleaf == 0){
			     form.findField('engineerNo').el.dom.readOnly = true;
			   }
			  formPanel.isNew = false;
			  form.loadRecord(loadFormRecord);
			  fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
								+ false + "&businessId=" + record.data.uuid;
			  fileFrame.location.href = fileUploadUrl;
		      treeGridStore.reload();
		      saveBtn.setDisabled(true);
		   }
	}
	
//质量验评分类编辑保存方法
	function formSave(){
		var  msgStr = "";
		var  form = formPanel.getForm();
		var checkBlank = ['engineerNo','engineerName','engineerType'];
		var record = treeGrid.getSelectionModel().getSelected();
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
    	var getUuid = "";
		if(addOrUpdateFlag == "add" || addOrUpdateFlag == "update"){
			   DWREngine.setAsync(false);
               zlgkMgm.zlypAddOrUpdate(obj,function(str){
                   if(str.split("'")[0] == 'add'){
                      msgStr = '您成功新增了一条数据！';
                      getUuid = str.split("'")[1];
                      selectNode = str.split("'")[1];
                      gerIsLeaf = '1';
                      var isleaf = record.data.isleaf;
                      var parentNoId = "";
						var parentNoName = "";
						baseMgm.findById(bean, getUuid,function(obj){
							loadFormRecord = new formRecord(obj);
						});
						var sql = "select engineer_no,engineer_name from (select * from pc_zlgk_zlyp_tree " +
							    	 		" start with tree_id= (select tree_id from pc_zlgk_zlyp_tree where uuid='"+getUuid+"') " +
							    	 	    " connect by prior parent_id=tree_id) where pid='"+PID+"' and tree_id=(select parent_id  from pc_zlgk_zlyp_tree  where uuid ='"+getUuid+"')";
					     DWREngine.setAsync(false);
					     baseMgm.getData(sql,function(list){
					     	 parentNoId = list[0][0];
					     	 parentNoName = list[0][1];
					     	
					    });
					    DWREngine.setAsync(true);
					    form.findField('uuid').setValue(getUuid);
						form.findField('parentNoId').setValue(parentNoId);
						form.findField('parentNoName').setValue(parentNoName);
						form.loadRecord(loadFormRecord);
                      if(isleaf == 1){
                      	 var sql = "update pc_zlgk_zlyp_tree t  set t.isleaf='0'  where uuid='"+record.data.uuid+"'";
                         baseDao.updateBySQL(sql);
                      }
                      	var mask = new Ext.LoadMask('rightTree', {
								msg : "正在初始化权限,请稍等..."
							});
						  mask.show();
	                      zlgkMgm.addPcZlgkRightSortDept(str.split("'")[1],USERDEPTID,PID,function(strs){
	                          if(strs == "success"){
	                          		treeGridStore.reload({
										callback : function(){
									    	 DWREngine.setAsync(false);
										     baseMgm.getData("select * from pc_zlgk_zlyp_tree where uuid='"+getUuid
										                     +"' and pid='"+PID+"'",function(list){
												    DWREngine.setAsync(true);
													sortRightGrid.getView().restoreScroll(list);
													mask.hide(); 
										    });
										}
									});
							}else{
							    mask.hide();
								Ext.MessageBox.alert("提示信息","权限设置操作失败,请联系管理员!")
							}
						  Ext.example.msg('提示信息',msgStr);
					      getAddUuid  = str.split("'")[1];
						  selectedPath = store.getPath(record, "treeId")+"/"+str.split("'")[2];
						  store.load();
						  addOrUpdateFlag = 'update';
                      })
                   }else if(str.split("'")[0] == 'update'){
                      msgStr = '您成功修改了一条数据！';
                      Ext.example.msg('提示信息',msgStr);
				      getAddUuid  = str.split("'")[1];
				      gerIsLeaf = record.data.isleaf;
					  selectCrrentTreeNode();
                   }else{
                      msgStr = '操作失败！';
                      Ext.example.msg('提示信息',msgStr);
                   }
	                fileUploadUrl = CONTEXT_PATH
									+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="
									+ true + "&businessId=" + str.split("'")[1];
			   	    fileFrame.location.href = fileUploadUrl;
               })
               DWREngine.setAsync(true);
		}
	}
//关闭按钮功能	
   function clearFn(){
       if(formPanel1){
			 selectCrrentTreeNode();
       	     formPanel1.collapse(true);
       }
   }	
//权限设置
	function editorColForReadRenderFun(value, metaData, record, rowIndex,
								colIndex, store){
		var unitId = record.data["unitId"];
		var sortId = record.data["sortId"];
		var hasEditorRole = record.data["read"];
		return hasEditorRole=="false" ? '<div id="readChecker" class=x-grid3-check-col onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'ReadOnly\')">&#160;</div>'
			 : '<div id="readChecker" class=x-grid3-check-col-on onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'ReadOnly\')">&#160;</div>'
	}	
	//权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
	function editorColForReadWriteRenderFun(value, metaData, record, rowIndex,
								colIndex, store){
		var unitId = record.data["unitId"];
		var sortId = record.data["sortId"];
		var hasEditorRole = record.data["write"];
		return  hasEditorRole=="false" ? '<div id="editorChecker" class=x-grid3-check-col onclick="editorChxAllClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
			 : '<div id="editorChecker" class=x-grid3-check-col-on onclick="editorChxAllClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
	}

	// 定位到上次选择的树节点
	function selectCrrentTreeNode() {
		var record = treeGrid.getSelectionModel().getSelected();
        selectedPath = store.getPath(record, "treeId");
        store.load();
        
	}
	
})

//权限控制
function editorChxClick(obj, unitId, sortId,type ){
	if ( ModuleLVL != '1' )
		return;
	if(getParentNo == '') return;	
	if( addOrUpdateFlag == "add" && selectNode == ''){
		   Ext.example.msg('提示信息','请选择保存新增的记录再修改权限！');
		   return false;
	}
	var checked = obj.className.indexOf("-on")>-1?"false":"true";
	var mask = new Ext.LoadMask('rightTree', {
				msg : "正在设置权限，请稍等..."
			});
	mask.show();
	var state = sortRightGrid.getView().getScrollState();
	DWREngine.setAsync(true);
	zlgkMgm.setComFileSortNodeRightAlone(sortId,unitId,type,checked,selectNode,PID,function(dat){
		if(!dat){
			mask.hide();
			Ext.MessageBox.alert("提示信息","权限设置操作失败,请联系管理员!")
		}else{
			treeGridStore.reload({
				callback : function(){
					sortRightGrid.getView().restoreScroll(state);
					mask.hide();
				}
			});
		}
	})
	DWREngine.setAsync(false);
}

//权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
function editorChxAllClick(obj, unitId, sortId,type ){
	if ( ModuleLVL != '1' )
		return;
    if(getParentNo == '') return;
	if( addOrUpdateFlag == "add" && selectNode == '' ){
		   Ext.example.msg('提示信息','请选择保存新增的记录在修改权限！');
		   return false;
	}
	var checked = obj.className.indexOf("-on")>-1?"false":"true";
	var mask = new Ext.LoadMask('rightTree', {
				msg : "正在设置权限，请稍等..."
			});
	mask.show();
	var state = sortRightGrid.getView().getScrollState()
	DWREngine.setAsync(true);
	zlgkMgm.setComFileSortNodeRightAll(sortId,unitId,type,checked,selectNode,PID,gerIsLeaf,function(dat){
		if(!dat){
			mask.hide();
			Ext.MessageBox.alert("提示信息","权限设置操作失败,请联系管理员!")
		}else{
			treeGridStore.reload({
				callback : function(){
					sortRightGrid.getView().restoreScroll(state);
					mask.hide();
				}
			});
		}
	})
	DWREngine.setAsync(false);
}