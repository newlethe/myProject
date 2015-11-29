var comBoxBaseParams = {
		triggerAction : 'all',
		mode : 'local',
		lazyRender : true,
		valueField : 'k',
		displayField : 'v',
		listWidth:400,
		editable : false, 
		width: 280
		};
		
// 通用combobox renderer
Ext.util.Format.comboRenderer = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
		return record? record.get(combo.displayField): combo.valueNotFoundText;
	}
}
var allUserArray = new Array();
var rockTree, zbNoticeGrid;
var currentPrjObj;
var zbTypeLabel;
var bidApplySelectBar;
var noticeBeanName = 'com.sgepit.pcmis.bid.hbm.PcBidPublishNotice';
var noticeDs;
var sm;
var tmpGrid;
var currentZbUids,currentZbContent;
var plantInt;
var noticeContentBean="com.sgepit.pcmis.bid.hbm.PcBidNoticeContent";
//招标申请过滤Combox相关对象
var zbApplyArr   = new Array();
var zbApplyStore = new Ext.data.SimpleStore({fields : ['k', 'v', 't']});
var zbApplyCombo = new Ext.form.ComboBox(Ext.apply({emptyText:'请选择招标项目',store : zbApplyStore},comBoxBaseParams));

// 招标内容过滤Combox相关对象
var zbContentArr   = new Array();
var zbContentStore = new Ext.data.SimpleStore({fields:['k','v']});
var zbContentCombo = new Ext.form.ComboBox(Ext.apply({emptyText : '请选择招标内容',store : zbContentStore},comBoxBaseParams));

// 招标内容Grid编辑Combox相关对象
var zbContentArrEdit   = new Array();
var zbContentStoreEdit = new Ext.data.SimpleStore({fields:['k','v']});
var zbContentComboEdit = new Ext.form.ComboBox(Ext.apply({emptyText : '请选择招标内容',store : zbContentStoreEdit,allowBlank:false},comBoxBaseParams));
// 招标类型Combox相关对象
var bidTypeArr   = new Array();
var bidTypeStroe = new Ext.data.SimpleStore({fields:['k','v']});;

// 上传附件的businessType
var bidNoticeBusinessType = "PCBidNotice";
var bidNoticeOtherBusinessType = "PCBidNoticeOther";
var curDeletedNoticeId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
var treeCombo;
//项目单位array
var array_prjs=new Array();
//负责用户array
var array_user=new Array();
var proTreeCombo;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var where="unit_type_id not in ('9')";
var unitStore,unitArr,unitBox;
var RW=ModuleLVL<3?true:false; 
var contentGrid,contentWin;
var beanContent = "com.sgepit.pcmis.bid.hbm.PcBidZbContent";
var contentUidsArray=new Array();
var selected = new Array();
Ext.onReady(function() {
		// 移交资料室
	var transBtn = new Ext.Toolbar.Button({
				id : 'transfer',
				text : '移交文件',
				handler : onItemClick,
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
				cls : "x-btn-text-icon"
			});

	var downloadColStr = disableBtn ? '查看' : '上传';
	DWREngine.setAsync(false);
	// 招标项目下拉框
	var zbApplyArr = new Array();
	var zbApplyArr2 = new Array();
	//招标代理机构名称
	zbAgencyArr=new Array();
	DWREngine.setAsync(false);
	//得到部门所属用户
	db2Json.selectSimpleData("select userid, realname from rock_user order by unitid",	function(dat){
		allUserArray = eval(dat);
	});		
	//项目单位
	var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean2,"",function(list){   
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_prjs.push(temp);			
		}
    }); 	
	//部门用户store
	var dsCombo_user=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_user
	});	
	//项目单位store
	var dsCombo_prjs=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_prjs
	});	
  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  }) 
  db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
	});		
	
	baseDao.findByWhere2('com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo', "pid = '"
					+ currentPid + "'", function(retVal) {
				if (retVal.length > 0) {
					currentPrjObj = retVal[0];
				}
			});
	PCBidDWR.getBidApplyForCurrentPrj(null,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			});

	appMgm.getCodeValue('招标类型', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	//SimpleStore加载数据
	zbApplyStore.loadData(zbApplyArr);
	bidTypeStroe.loadData(bidTypeArr);
	
	// 部门用户下拉框
	var userCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : dsCombo_user,
				valueField : 'k',
				displayField : 'v',
				allowBlank : false,
				name : 'respondUser'

			});
	//项目单位下拉框
	proTreeCombo=new Ext.form.ComboBox({
		hidden :true,
		name : 'respondDept',
		anchor : '95%',
		width:200,
		listWidth:300,
		store:dsCombo_prjs,
    	displayField:'v',
   		valueField:'k',
    	typeAhead: true,
    	editable:false,
   		mode: 'local',
    	lazyRender:true,
    	triggerAction: 'all',
    	emptyText:"",
   		selectOnFocus:true
	});
      //单位选择
  unitBox = new Ext.form.ComboBox({
        emptyText : '请选择单位',
        id : 'respondDept',
        store : unitStore,
        allowBlank : false,
        displayField : 'txt',
        valueField : 'val', 
        width : 300,
        editable : false,
        typeAhead : id,
        triggerAction : 'all',
        mode : 'local',
        tpl: "<tpl for='.'><div style='height:220px'><div id='unittree'></div></div></tpl>",   
	    selectOnFocus:true
    });	
   var unitTreeNodeUrl =  CONTEXT_PATH + "/servlet/PcBidServlet";
  var unitTree =  new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
                 dataUrl :unitTreeNodeUrl,
                 requestMethod: "POST",
                 baseParams:{
			        ac:"syncBuilding3GroupUnitTree",
					ifcheck : false,
					baseWhere :where,
					unitid:unitid,
			        upunit:upunit,
					async : false,
					hascheck:"no"
			}
            }),
        border : false,
        root : new Ext.tree.AsyncTreeNode({
             text :USERBELONGUNITNAME,
             id: USERBELONGUNITID,
             expanded : true
           }),
        rootVisible : false   
  })
   unitTree.on('beforeload',function(node){
	 unitTree.loader.baseParams.parentId = node.id; 
  })
  
  unitBox.on('expand',function(){   
        unitTree.render('unittree');  
    });   
    
  unitTree.on('click',function(node){  
    unitBox.collapse(); 
	var leaf=node.leaf;
	if(leaf==1){
    	var rec = sm.getSelected() ;
    	rec.set("respondUser", "");			
		unitBox.setValue(node.id); 
		DWREngine.setAsync(false);
		//得到部门所属用户
		PCBidDWR.getUserInDept(node.id,function(list){
			array_user=new Array();
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].userid);
				temp.push(list[i].realname);
				array_user.push(temp);			
				}
	 		}
		);			
		DWREngine.setAsync(true);
		dsCombo_user.loadData(array_user);
		}
		else{
			Ext.example.msg("提示","请选择具体负责部门");
    			return;
		}       	
    }); 		
	
	zbApplyCombo.on('select', function(combo, record, index) {
		zbApplyComboSelect(record);
	});
	zbContentCombo.on('select', function(combo, record, index) {
		currentZbContent = record.data.k;
		reloadZbNotice();
	});			

	// //////功能菜单//////////////////////
	zbNoticeGrid = createZbNoticeGrid();
	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [zbNoticeGrid]
			});
	zbNoticeGrid.getTopToolbar().add(transBtn);
	if(zbNoticeGrid.getTopToolbar().items.get('del')!=undefined)
	zbNoticeGrid.getTopToolbar().items.get('del').disable();
	
	if ( zbApplyArr.length > 0 ){
		zbApplyCombo.setValue(zbApplyArr[0][0]);
		var record = zbApplyStore.getAt(0);
		zbApplyComboSelect(record);
	}

	// 招标信息发布
	function createZbNoticeGrid() {
		var spinner = new Ext.ux.form.Spinner({
			width:100,
			name:'rateStatus',
		    strategy: new Ext.ux.form.Spinner.NumberStrategy({minValue:'0', maxValue:'100'}),
		    listeners:{
		    	change : function(field,no,oo){
		    		if(isNaN(parseInt(no))||parseInt(no)>100){
		    			if(isNaN(parseInt(oo))||parseInt(oo)>100){
		    				field.setValue(0)	
		    			}else{
		    				field.setValue(parseInt(oo))
		    			}
		    		}else{
		    			field.setValue(parseInt(no));
		    		}
		    	}
		    }
		});
		 sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : false,
			header : ''
		});
		var columns = [
				new Ext.grid.RowNumberer(),sm,
				{
					id : 'pubTitle',
					header : '公告标题',
					dataIndex : 'pubTitle',
					width:120,
					editor : new Ext.form.TextField({name : 'putTitle'})
				}, {
					id : 'pubNo',
					header : '招标编号',
					dataIndex : 'pubNo',
					width:110,
					hidden:projectType=='CHANGZHI'?true:false,//长治欣隆项目隐藏招标编号
					editor : new Ext.form.TextField({name : 'pubNo',allowBlank : projectType=='CHANGZHI'?true:false})
				}, {
					id : 'selectContentUids',
					header : '招标内容',
					dataIndex : 'uids',
					align : 'center',
					width:60,
					/*editor : zbContentComboEdit,
					renderer:Ext.util.Format.comboRenderer(zbContentComboEdit)*/
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var downloadStr="查看[0]";
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(uids) as num from PC_BID_NOTICE_CONTENT where noticeuids='"+record.data.uids+"' and pid='"+currentPid+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);		
						if(RW==true){
							downloadStr="选择["+count+"]";
						}else{
							downloadStr="查看["+count+"]";
						}
						return '<a href="javascript:showContentWin(  \''
								+ record.data.uids + '\')">' + downloadStr +'</a>'								
							}
				}, {
					id : 'pubDate',
					header : '发布时间',
					dataIndex : 'pubDate',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					align : 'center',
					width:90,
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'startDate',
								readOnly:true,
								format : 'Y-m-d'
							})
				}, {
					id : 'pubDocument',
					header : '公告文件',
					dataIndex : 'uids',
					width:70,
					align : 'center',
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidNoticeBusinessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
					    var downloadStr="附件["+count+"]";
						return '<a href="javascript:showUploadWin(\''
								+ bidNoticeBusinessType + '\', ' + !disableBtn + ', \''
								+ record.data.uids + '\', \'公告文件\' )">' + downloadStr +'</a>'
					}

				}, {
					id : 'pubOtherDocument',
					header : '其它资料',
					dataIndex : 'uids',
					width:70,
					align : 'center',
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"'  and transaction_type='"+bidNoticeOtherBusinessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
					    var downloadStr="附件["+count+"]";								
						return '<a href="javascript:showUploadWin(\''
								+ bidNoticeOtherBusinessType + '\', ' + !disableBtn + ', \''
								+ record.data.uids + '\', \'其它资料\' )">' + downloadStr +'</a>'
					}
				}, {
					hidden:true,
					id : 'startDate',
					header : '开始时间',
					dataIndex : 'startDate',
					width : 60,
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'startDate',
								format : 'Y-m-d'
							})
				}, {
					hidden:true,
					id : 'endDate',
					header : '结束时间',
					dataIndex : 'endDate',
					width : 60,
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'endDate',
								readOnly:true,
								format : 'Y-m-d'
							})
				}, {
					id : 'rateStatus',
					header : '工作进度',
					dataIndex : 'rateStatus',
					align : 'center',
					width : 140,
					editor : spinner, 
					renderer: function(value){
				        var columnWidth = (120-10);
				        var width = columnWidth * value / 100;
				        return '<div style="background:#C6D6EE;position:absolute;width:'+width+'px;height:22px"></div>'
				            + '<div style="border:solid 1px #FF0000;position:relative;height:20px;line-height:20px;width:'+columnWidth+'px;">'+value+'%</div>';
				    }
				}, {
					id : 'respondDept',
					header : '负责部门',
					align : 'center',
					width : 140,
					dataIndex : 'respondDept',
					editor :unitBox,
					align : 'center',
					renderer :Ext.util.Format.comboRenderer(proTreeCombo) 
				}, {
					id : 'respondUser',
					header : '负责人',
					width :120,
					align:'center',
					dataIndex : 'respondUser',
					editor :userCombo,
					align : 'center',
					renderer :respondUserRendererFun
				}, {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 120,
					editor : new Ext.form.TextField({
								name : 'memo'
							})
				}];



		var Columns = [
				{
					name : 'uids',
					type : 'string'
				}, // Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'pid',
					type : 'string'
				}, {
					name : 'zbUids', // 主表id
					type : 'string'
				}, {
					name : 'pubTitle',
					type : 'string'
				}, {
					name : 'pubDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'startDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'endDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'rateStatus',
					type : 'float'
				}, {
					name : 'respondDept',
					type : 'string'
				}, {
					name : 'respondUser',
					type : 'string'
				}, {
					name : 'memo',
					type : 'string'
				}, {
					name : 'contentUids',
					type : 'string'
				}, {
					name : 'pubNo',
					type : 'string'
				}, {
					name : 'memoC1',
					type : 'string'
				}, {
					name : 'memoC1',
					type : 'string'
				}, {
					name : 'memoC2',
					type : 'string'
				}]
		noticeDs = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : noticeBeanName,
				business : "baseMgm",
				method : "findWhereOrderby",
				params : "pid ='" + currentPid +"'"
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : "uids"
					}, Columns),
			remoteSort : true,
			pruneModifiedRecords : true
				// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
			});
		    noticeDs.on('beforeload', function(store, options) {
					store.baseParams.params = "zbUids='"+currentZbUids +"'";
					if(currentZbContent&&currentZbContent!='all')
						store.baseParams.params += " and contentUids='"+currentZbContent+"'";
			});

		// 招标类型标签
		zbTypeLabel = new Ext.form.Label({text : ''});
		// 第二行工具栏
		bidApplySelectBar = new Ext.Toolbar({
					items : [
								'&nbsp;招标项目名称: ', zbApplyCombo, '-',  
							  	'&nbsp;&nbsp;&nbsp;&nbsp;招标类型: ',zbTypeLabel/*, '-', 
							  	'&nbsp;&nbsp;&nbsp;&nbsp;招标内容',zbContentCombo*/
							]
				});

		plantInt = {
			uids : '',
			pid : currentPid,
			zbUids : '',
			pubNo:'',
			contentUids:'',
			pubDate : new Date(),
			pubTitle : '',
			startDate : null,
			endDate : null,
			rateStatus : 0,
			respondDept :USERDEPTID,
			respondUser :USERID,
			memo : ''
		};

	  tmpGrid = new Ext.grid.EditorGridTbarPanel({
					addBtn:RW,
					saveBtn:RW,
					delBtn:RW,
					region : 'center',
					sm : sm,
					ds : noticeDs, // 数据源
					columns : columns, // 列模型
					margins : '5 0 5 5',
					cmargins : '0 0 0 0',
					tbar : new Ext.Toolbar({
								items : [/*transBtn,"-"*/]
							}),
					listeners : {
						'render' : function() {
							bidApplySelectBar.render(this.tbar);
						},
						aftersave : function(grid, idsOfInsert, idsOfUpdate,
								primaryKey, bean) {
							if ( ! doExchange ){
								return;
							}
							var insArr = new Array();
							var updArr = new Array();
							if ( idsOfInsert.length > 0 ){
								insArr = idsOfInsert.split(',');
								
							}
							if ( idsOfUpdate.length > 0 ){
								updArr = idsOfUpdate.split(',');
							}
							var allArr = insArr.concat(updArr);
							if ( allArr.length > 0 ){
								//招标公告【修改或保持】数据交互
								//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,
									function(flag){
								
								})
							}
							
						},
						afterdelete : function(grid, ids, primaryKey, bean) {
							if ( ! doExchange ){
								return;
							}
							var delArr = ids.split(',');
							if ( delArr.length > 0 ){
								//招标公告【删除】数据交互
								//参数说明：业务bean名称，数据主键数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbProcessForDel(bean,delArr,false,currentPid,defaultOrgRootID,function(flag){
								
								})
								
								var updArr = new Array();
								var arrayDel=new Array();
								for(var i=0;i<delArr.length;i++){
									arrayDel=new Array();
									DWREngine.setAsync(false);
					      			 db2Json.selectData("select uids  from PC_BID_NOTICE_CONTENT where noticeuids='"+delArr[i]+"' and pid='"+currentPid+"'", function (jsonData) {
						   			var list = eval(jsonData);
						    		if(list!=null){
						    			for(var j=0;j<list.length;j++){
						    				arrayDel.push(list[j].uids);
						    			}
						     		}  
						      		 });
									//招标公告关联的招标内容【修改或保持】数据交互
									//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
									PCBidDWR.excDataZbProcessForDel(noticeContentBean,arrayDel,false,currentPid,defaultOrgRootID,function(flag){
									
									})									
					   		 DWREngine.setAsync(true);
								}
								}
							
						}
					}, // 顶部工具栏，可选
					border : false, // 
					region : 'center',
					clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
					autoScroll : true, // 自动出现滚动条
					deleteHandler : function() {
						var selSm = this.getSelectionModel();
						if (selSm.getCount() > 0) {
							curDeletedAgencyId = sm.getSelected().data.uids;
							this.defaultDeleteHandler();
						}
					},
					animCollapse : false, // 折叠时显示动画
					loadMask : true, // 加载时是否显示进度
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : noticeDs,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
					plant : Ext.data.Record.create(Columns),
					plantInt : plantInt,
					servletUrl : MAIN_SERVLET,
					bean : noticeBeanName,
					business : "baseMgm",
					primaryKey : "uids"
				});

		tmpGrid.on('beforeinsert', function() {
					if (currentZbUids == null || currentZbUids == '') {
						Ext.Msg.show({
									title : '新增记录',
									msg : '请先选择招标项目！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.INFO
								});
						return false;

					} else {
						return true;
					}

					tmpGrid.on('afterdelete', function() {
								if (curDeletedNoticeId) {
									deleteNoticeAttachment();
								}
							});

				});
		sm.on('rowselect',function(sm,idx,r){
			if(zbNoticeGrid.getTopToolbar().items.get('del')!=undefined)
				zbNoticeGrid.getTopToolbar().items.get('del').enable();
			var respondDept=r.get("respondDept");
			if(respondDept&&respondDept!=""){
				DWREngine.setAsync(false);
				//得到部门所属用户
			PCBidDWR.getUserInDept(respondDept,function(list){
				array_user=new Array();
				for(i = 0; i < list.length; i++) {
					var temp = new Array();	
					temp.push(list[i].userid);
					temp.push(list[i].realname);
					array_user.push(temp);			
					}
	 			}
			);			
			DWREngine.setAsync(true);
			dsCombo_user.loadData(array_user);						
			}				
				
		})
		sm.on('rowdeselect',function(sm,idx,r){
			if(zbNoticeGrid.getTopToolbar().items.get('del')!=undefined)
				zbNoticeGrid.getTopToolbar().items.get('del').disable();
		})
		return tmpGrid;
	}

});

//选择招标内容的弹出框
function showContentWin(noticeUids){	
	if (noticeUids == null || noticeUids == '') {
		Ext.Msg.show({
					title : '选择招标内容',
					msg : '请先保存记录再选择招标内容！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}		
	var zbuids=zbApplyCombo.getValue();
	/**
	 * 招标内容选择页面:
	/PCBusiness/bid/pc.bid.show.contentReport.jsp
	**/
	var sm= new Ext.grid.CheckboxSelectionModel({
			singleSelect : false,
			header : ''
	});

	var cm= new Ext.grid.ColumnModel([ // 创建列模型
			sm,
			{
				id : 'contentes',
				type : 'string',
				header :"招标内容",
				width:250,
				dataIndex :'contentes'
			}
	]);
	var Columns = [{
			name : 'uids',type : 'string'
		},
		{
			name : 'zbUids',type : 'string'
		}, {
			name : 'contentes',type : 'string'
		}];
	var baseSql="";
	if(RW==false){
				var contentuids="";
				var sql = "select contentuids from PC_BID_NOTICE_CONTENT where noticeuids='"+noticeUids+"' and pid='"+currentPid+"'";
				DWREngine.setAsync(false);				
				baseDao.getData(sql,function(lt){
					selected = new Array();
					for(var i=0;i<lt.length;i++){
						contentuids+="'"+lt[i]+"'"+",";
					}	
					if(contentuids!=""){
						contentuids=contentuids.substring(0,contentuids.length-1);
						baseSql="zbUids='"+zbuids+"' and pid ='" + currentPid +"' and uids in("+contentuids+")";						
					}else{
						baseSql="1=2";
					}
				})	
				DWREngine.setAsync(true);
	}else{
		baseSql="zbUids='"+zbuids+"' and pid ='" + currentPid +"'";
	}
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanContent,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : baseSql
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true,
		listeners:{
			load : function(store){
				var sql = "select contentuids from PC_BID_NOTICE_CONTENT where noticeuids='"+noticeUids+"' and pid='"+currentPid+"'";
				baseDao.getData(sql,function(lt){
					selected = new Array();
					for(var i=0;i<lt.length;i++){
						store.each(function(rec){
							if(rec.get('uids')==lt[i]){
								selected.push(rec);
								
							}
						})
					}
					sm.selectRecords(selected);
				})	
			}
		}
	});
	var tbarTitle="";
	var countNum=0;
	DWREngine.setAsync(false);
    db2Json.selectData("select count(uids) as num from PC_BID_NOTICE_CONTENT where noticeuids='"+noticeUids+"' and pid='"+currentPid+"'", function (jsonData) {
    var list = eval(jsonData);
    if(list!=null){
   	 countNum=list[0].num;
     		 }  
      	 });
    DWREngine.setAsync(true);	
    tbarTitle="已选择"+countNum+"条招标内容";
    var tb='';
	var saveBtn=new Ext.Button({
			id:"saveBtnId",
			text:'确定',
			iconCls:'save',
			handler:function(){saveContentByNotice(noticeUids);}		
	});
	var cancelBtn=new Ext.Button({
			id:"removeBtnId",
			text:'取消',
			iconCls:'remove',
			handler:function(){cancelByNotice(sm);}
	});    
    if(RW==true){
    	tb=new Ext.Toolbar({
				    items :[tbarTitle,'->',saveBtn, '-', cancelBtn]
				});    	
    }
	else{
		tb=new Ext.Toolbar({
				    items :[tbarTitle]
				}); 
	}

	contentGrid = new Ext.grid.GridPanel({
		tbar:tb,
		store : ds,
		cm : cm,
		sm : sm,
		border : false,
		layout : 'fit',
		region : 'center',
		autoExpandColumn :1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true
		}
	});
	contentWin = new Ext.Window({
				title : "选择招标内容",
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'hide',
				modal : true,
				items :[contentGrid]
			});
	contentWin.show();
	ds.load({callback:function(){}});	
	
	
}
//根据招标公告确定选择当前项目的招标内容
function saveContentByNotice(noticeUids){
	contentUidsArray=new Array();
	var records=contentGrid.getSelectionModel().getSelections();
		for(var i=0;i<records.length;i++){
			var record=records[i];
			contentUidsArray.push(record.get("uids"));
		}
	DWREngine.setAsync(false);
		if ( ! doExchange ){
		}
		else{
			//取消了
			var updArr = new Array();
			var arrayDel=new Array();
			arrayDel=new Array();
  			 db2Json.selectData("select uids  from PC_BID_NOTICE_CONTENT where noticeuids='"+noticeUids+"' and pid='"+currentPid+"'", function (jsonData) {
   			var list = eval(jsonData);
    		if(list!=null){
    			for(var j=0;j<list.length;j++){		
    				arrayDel.push(list[j].uids);   				
    			}
     		}  
      		 });
			//招标公告关联的招标内容【修改或保持】数据交互
			//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
      		 if(""==contentUidsArray){
 	 			PCBidDWR.excDataZbProcessForDel(noticeContentBean,arrayDel,false,currentPid,defaultOrgRootID,function(flag){
				})	       		 	
      		 }else{
      		    PCBidDWR.excDataZbProcessForDel(noticeContentBean,arrayDel,true,currentPid,defaultOrgRootID,function(flag){
				})	  
      		 }									
	}	
	PCBidDWR.saveContentByNotice(currentPid,noticeUids,contentUidsArray,
			function(arrayInsert){
			if(arrayInsert&&arrayInsert!=null){//成功新增
				if ( ! doExchange ){
				}else{
					var updArr = new Array();
					//招标公告关联的招标内容【修改或保持】数据交互
					//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
					PCBidDWR.excDataZbForSave(noticeContentBean,updArr,arrayInsert,false, currentPid, defaultOrgRootID,
						function(flag){	
							//alert(flag);
					})					
				}
				contentWin.hide();
				noticeDs.load();
			}else{
				contentWin.hide();
				noticeDs.load();
			}
		});    
	DWREngine.setAsync(true);	  
}
//取消窗口
function cancelByNotice(sm){
	contentGrid.getSelectionModel().clearSelections();
	sm.selectRecords(selected);
}
function showUploadWin(businessType, editable, businessId, winTitle) {
	
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
			+ businessType + "&editable=" + editable + "&businessId="
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
		noticeDs.load();
	});
}
function reloadZbNotice() {
	noticeDs.load();
}
function zbApplyComboSelect(record){
	currentZbUids = record.data.k;
	plantInt.zbUids = currentZbUids;
	var bidTypeStr = record.data.t;

	var index = bidTypeStroe.find('k', record.data.t);
	if (index > -1) {
		bidTypeStr = bidTypeStroe.getAt(index).get('v');
	}

	Ext.get(zbTypeLabel.getEl()).update(bidTypeStr);
	loadZbContentCombo(record.data.k);
}
//招标内容Combox加载
function loadZbContentCombo(zbUids){
	currentZbContent=null;
	zbContentCombo.setValue("");
	zbContentArr = new Array();
	zbContentArr.push(['all','全部'])
	
	zbContentArrEdit = new Array();
	PCBidDWR.getContentForCurrentApply(null,zbUids, function(list){
		for ( var i = 0; i < list.length; i++ ){
			var temp = new Array();
			temp.push(list[i].uids);
			temp.push(list[i].contentes);
			zbContentArr.push(temp);
			zbContentArrEdit.push(temp);
		}
		zbContentStore.loadData(zbContentArr);
		zbContentStoreEdit.loadData(zbContentArrEdit);
		if ( zbApplyArr.length > 0 ){
			zbContentCombo.setValue(zbContentArr[0][0]);
		}
		reloadZbNotice();
	});
}
function deleteNoticeAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidNoticeBusinessType, bidNoticeOtherBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedNoticeId, function(retVal) {
				curDeletedNoticeId = null;
			});
}
function uploadSuccess(fileLsh, businessId, businessType, blobTable) {
	if (doExchange) {
		var fileIdArr = new Array();
		fileIdArr.push(fileLsh);
		//参数说明：业务bean名称，数据主键数据，流水号数组，发送单位，接收单位，业务说明，是否立即发送
		PCBidDWR.excDataAttachments(noticeBeanName,businessId,fileIdArr,currentPid,defaultOrgRootID,"招标公告【附件上传】",false,
			function(flag){
		
		})

	}
}
function deleteSuccess(fidArr,businessId, businessType, blobTable) {
	if (doExchange) {
		PCBidDWR.excDataAttachments(noticeBeanName,businessId,fidArr,currentPid,defaultOrgRootID,"招标公告【附件删除】",false,
			function(flag){
		
		})
	}
}
function respondUserRendererFun(v, m, r){
	var respondDept=r.get("respondDept");
	if(respondDept&&respondDept!=""){
		for(i = 0; i < allUserArray.length; i++) {
			if(allUserArray[i][0]==v) {
				return allUserArray[i][1];
			}
		}
	}
	return "";
}
function onItemClick(item) {
	switch (item.id) {	
		case 'transfer' :
			var selRecords = tmpGrid.getSelectionModel().getSelections();
			if (selRecords.length < 1) {
				return;
			}
			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			var fileIdArr = [];
			for (var i = 0; i < selRecords.length; i++) {
				fileIdArr.push(selRecords[i].data.uids);		
			}
			//Ext.log(fileIdArr);
			yjzls(fileIdArr.join(','));

			break;
	}
}
function yjzls(filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidPublishNotice&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}