/**
 * 发放中标通知书
 */
var issueWinGrid;
var issueWinDs;
var issueWinBeanName = "com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc";
var plantInt;
var bidContentId = null; //招标内容主键
var issueWinNoticeBusinessType = "PCBidIssueWinNotice";
var issueWinOhterBusinessType = "PCBidIssueWinOther";
var tbUnitStore, tbUnitCombo;
var curDeletedIssueWinDocId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'BidAssessPublish';
var progressInitialized = false;
var partbDet,formPanelPB;//合同详细信息
var gridTbUnitWin;
var	smTbUnit;
var gridTbUnit;
var tbUidsArray=new Array();
var treeCombo;
//项目单位array
var array_prjs=new Array();
//负责用户array
var array_user=new Array();
var proTreeCombo,sm;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var where="unit_type_id not in ('9')";
var unitStore,unitArr,unitBox;
var allUserArray = new Array();
Ext.onReady(function() {
		// 移交资料室
	var transBtn = new Ext.Toolbar.Button({
				id : 'transfer',
				text : '移交文件',
				handler : onItemClick,
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
				cls : "x-btn-text-icon",
				hidden: disableBtn
			});
	if(hasBtn==false){
		disableBtn=true;
	}
	var downloadColStr = disableBtn ? '查看' : '上传';
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}
	// 通用combobox renderer带提示信息的
	Ext.util.Format.comboRenderer1 = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
            if(!record) return ;
			var disvalue=record? record.get(combo.displayField): combo.valueNotFoundText;
			var qtip = "qtip=" + disvalue;
			return'<span ' + qtip + '>' + disvalue + '</span>'; 
		}
	}

	// 招标项目下拉框
	var zbApplyArr = new Array();

	DWREngine.setAsync(false);
	// 招标项目下拉框
	var zbApplyArr = new Array();
	var zbApplyArr2 = new Array();
	//招标代理机构名称
	zbAgencyArr=new Array();
	//得到部门所属用户
	db2Json.selectSimpleData("select userid, realname from rock_user order by unitid",	function(dat){
		allUserArray = eval(dat);
	});

  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  }) 
    db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
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
    
    if(rateStatus!=""&&rateStatus!=null){
     	PCBidDWR.getBidApplyForCurrentPrjByBean("PcBidIssueWinDoc",parent.outFilter,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			}); 	  
    }
    else{
   	PCBidDWR.getBidApplyForCurrentPrj(parent.outFilter,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			}); 	
    }
			
	DWREngine.setAsync(true);
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});

	zbContentStore = new Ext.data.SimpleStore({
				fields : ['k','v','d','p'],
				data : []

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
	zbApplyCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标项目',
				mode : 'local',
				lazyRender : false,
				lazyInit : false,
				store : zbApplyStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				listWidth:400,
				width:280,
				name : 'zbApplyId'
			});

	zbContentCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标内容',
				mode : 'local',
				store : zbContentStore,
				lazyRender : true,
				valueField : 'k',
				displayField : 'v',
				listWidth:400,
				width:280,
				editable : false
			});
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
				var applyId = record.data.k;
				if (parent.curZbStat) {
					parent.curZbStat.applyId = applyId;
				}
				loadZbContentCombo(applyId, function(length) {
//							if (length > 0) {
								var rec = zbContentStore.getAt(0);
								zbContentCombo.setValue(rec.data.v);
								selectContentCombo(rec);
//							}
						});
			});

	zbContentCombo.on('select', function(combo, record, index) {
				selectContentCombo(record);
				
				//修改新建中标通知书的初始化值
				plantInt.respondDept = record.data.d;
				plantInt.respondUser = record.data.p;
			});

	tbUnitStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []
			});
	// 选择已通过预审单位
	tbUnitCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				store : tbUnitStore,
				lazyRender : true,
				valueField : 'k',
				displayField : 'v',
				listWidth:400,
				listClass: 'x-combo-list-small',
				width:200,
				editable : false,
				allowBlank : false,
				name : 'tbUnit'
			});
	 sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false,
				header : ''
			});

	 sm.on('rowselect', function(sm, idx, r) {
			//选择行时选择负责人列表
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
	 });
	var spinner = new Ext.ux.form.Spinner({
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
	var cm = new Ext.grid.ColumnModel({
				columns : [new Ext.grid.RowNumberer(),sm, {
							id : 'uids',
							header : 'uids',
							dataIndex : 'uids',
							width : 100,
							hidden : true
						}, {
							id : 'pid',
							header : '项目编号',
							width : 100,
							dataIndex : 'pid',
							hidden : true
						}, {
							id : 'contentUids',
							header : '招标内容编号',
							width : 100,
							dataIndex : 'contentUids',
							hidden : true
						}, {
							id : 'tbUnit',
							header : '中标单位',
							dataIndex : 'tbUnit',
							width : 200,
							editor : tbUnitCombo,
							renderer : Ext.util.Format
									.comboRenderer1(tbUnitCombo)
						}, {
							id : 'issueWinNotice',
							header : '中标通知书',
							dataIndex : 'uids',
							align : 'center',
							width : 100,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								var downloadStr="";
								var count=0;
								DWREngine.setAsync(false);
						        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+issueWinNoticeBusinessType+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							   	 count=list[0].num;
							     		 }  
							      	 });
							    DWREngine.setAsync(true);
							    if(disableBtn==true){
							    	 downloadStr="查看["+count+"]";
							    }else{
							    	 downloadStr="上传["+count+"]";
							    }											
								return '<a href="javascript:showUploadWin(\''
										+ issueWinNoticeBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'中标通知书\',\''+issueWinBeanName+'\')">'
										+ downloadStr
										+ '</a>'
							}
						}, {
							id : 'tbPrice',
							header : '中标价格(万元)',
							dataIndex : 'tbPrice',
							width : 130,
							align : 'right',
							editor : new Ext.form.NumberField({
										name : 'tbPrice',
										allowBlank : true
									})
						},{
							id : 'otherData',
							header : '其它资料',
							dataIndex : 'uids',
							align : 'center',
							width : 100,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								var downloadStr="";
								var count=0;
								DWREngine.setAsync(false);
						        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+issueWinOhterBusinessType+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							   	 count=list[0].num;
							     		 }  
							      	 });
							    DWREngine.setAsync(true);
							    if(disableBtn==true){
							    	 downloadStr="查看["+count+"]";
							    }else{
							    	 downloadStr="上传["+count+"]";
							    }											
								return '<a href="javascript:showUploadWin(\''
										+ issueWinOhterBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'其它资料\',\''+issueWinBeanName+'\' )">'
										+ downloadStr + '</a>'
							}
						}, {
							id : 'startDate',
							header : '发放时间',
							dataIndex : 'startDate',
							width : 100,
							align : 'center',
							renderer :Ext.util.Format.dateRenderer('Y-m-d') , // Ext内置日期renderer
							type : 'date',
							editor : new Ext.form.DateField({
										name : 'startDate',
										readOnly:true,
										format : 'Y-m-d'
									})
						}, {
							id : 'endDate',
							header : '结束时间',
							dataIndex : 'endDate',
							hidden: true,
							width : 100,
							renderer :Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
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
							width : 160,
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
							width : 180,
							dataIndex : 'respondDept',
							editor :unitBox,
							align : 'center',
							renderer :Ext.util.Format.comboRenderer(proTreeCombo) 
						}, {
							id : 'respondUser',
							header : '负责人',
							width : 120,
							dataIndex : 'respondUser',
							editor :userCombo,
							align : 'center',
							renderer :respondUserRendererFun
						}, {
							id : 'memo',
							header : '备注',
							dataIndex : 'memo',
							width : 100,
							editor : new Ext.form.TextField({
										name : 'memo'
									}),
							renderer:function(value){
						        var qtip = "qtip=" +value;
								return '<span ' + qtip + '>' + value + '</span>';								
							}
						}]
			});

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'contentUids',
				type : 'string'
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
				name : 'tbUnit',
				type : 'string'
			},{
				name : 'tbPrice',
				type : 'string'
			}]

	issueWinDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : issueWinBeanName,
			business : "baseMgm",
			method : "findWhereOrderby"
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
	issueWinDs.on('beforeload', function(store, options) {
				if(rateStatus&&rateStatus!=""&&rateStatus!=null){
					store.baseParams.params = "contentUids='"+bidContentId+"' and rateStatus='"+rateStatus+"'";
				}else{
					store.baseParams.params = "contentUids='"+bidContentId+"'";					
				}
			});

	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		issueWinDs.load();
	
	plantInt = {
		uids : '',
		pid : currentPid,
		contentUids : bidContentId,
		startDate : null,
		endDate : null,
		rateStatus : 0,
		respondDept : '',
		respondUser : '',
		tbUnit : '',
		tbPrice:'',
		memo : ''
	};

	var gridLabel = new Ext.form.Label({
				html : '<b>发放中标通知书</b>',
				cls : 'gridTitle'
			});

	issueWinGrid = new Ext.grid.EditorGridTbarPanel({
				addBtn:hasBtn,
				saveBtn:hasBtn,
				delBtn:hasBtn,				
				region : 'center',
				ds : issueWinDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : [gridLabel, '-',transBtn,"-"], // 顶部工具栏，可选
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedIssueWinDocId = sm.getSelected().data.uids;
						this.defaultDeleteHandler();
					}
				},
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : issueWinDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : issueWinBeanName,
				business : "baseMgm",
				primaryKey : "uids",
				crudText:{form:'中标单位详细'},
				saveHandler: function(){
/*					var records = issueWinGrid.getStore().getModifiedRecords();
					if(records && records.length>0)
					{
						for(var i=0; i<records.length; i++)
						{
							var data=records[i].data;
							alert(data.startDate);
						}
						
					}	*/				
					this.defaultSaveHandler();
				},
				listeners : {
					aftersave : function(grid, idsOfInsert, idsOfUpdate,
							primaryKey, bean) {
						if (!doExchange) {
							return;
						}
						var insArr = new Array();
						var updArr = new Array();
						if (idsOfInsert.length > 0) {
							insArr = idsOfInsert.split(',');

						}
						if (idsOfUpdate.length > 0) {
							updArr = idsOfUpdate.split(',');
						}
						var allArr = insArr.concat(updArr);
						if (allArr.length > 0) {
							//投标人报名信息及预审结果
							//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
							PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,function(flag){
							
							})
						}
					},
					afterdelete : function(grid, ids, primaryKey, bean) {
						if (!doExchange) {
							return;
						}
						var delArr = ids.split(',');
						if (delArr.length > 0) {
							//参数说明：业务bean名称，数据主键数据，是否立即发送，发送单位，接收单位
							PCBidDWR.excDataZbProcessForDel(bean,delArr,false,currentPid,defaultOrgRootID,function(flag){
							})
						}
					},
					afteredit : function(e){
						if(e.field == 'tbUnit'){ 	
					    	var record = e.record;
					    	var realOld = e.originalValue;
					    	var realNew = e.value;
					    	var flag = false;
					    	var ds = issueWinDs;
					    	for(var i=0;i<ds.getCount();i++){   
							    for(var j=i+1;j<ds.getCount();j++){
							    	var tbUnit_i = ds.getAt(i).get('tbUnit');
							    	var tbUnit_j = ds.getAt(j).get('tbUnit');
									if(tbUnit_i!=null&&tbUnit_i!=""&&tbUnit_j!=null&&tbUnit_j!=""&&tbUnit_j==tbUnit_i) {   
										Ext.Msg.show({
											title : '保存出错',
											msg : '您选择的单位存在重复，请重新选择！',
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.INFO,
											fn : function(value) {
												if(value == 'ok')
												record.set('tbUnit',realOld);
												}
										});
										flag = true;
										break;
							    	}  
							    } 
							    if(flag) break;
							}   
						}
					}
				}
			});

	issueWinGrid.on('beforeinsert', function() {
				if (bidContentId == null || bidContentId == '') {
					Ext.Msg.show({
								title : '新增记录',
								msg : '请先选择一条招标内容！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO
							});
					return false;

				} else {
					selectTbUnit();//弹出窗口
					return false;
				}
			});

	issueWinGrid.on('afterdelete', function() {
				if (curDeletedIssueWinDocId) {
					deleteIssueWinDocAttachment();
				}
			});

	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [issueWinGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
			
	//加载数据
	loadTbUnitCombo();
	reloadBidDetail(bidContentId);
			
	
	if(issueWinGrid.getTopToolbar().items.get('del'))		
		issueWinGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(issueWinGrid.getTopToolbar().items.get('del'))		
			issueWinGrid.getTopToolbar().items.get('del').enable();		
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
			
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(issueWinGrid.getTopToolbar().items.get('del'))		
			issueWinGrid.getTopToolbar().items.get('del').disable();				
	});
	sm.on('selectionchange', function(sm){ // grid 行选择事件
   		var record = sm.getSelected();
		var tb = issueWinGrid.getTopToolbar();
		if(!tb) return;
   		if (record!=null) {
   			tb.items.get("form").enable();
    	}else{
   			tb.items.get("form").disable();
    	}
    });
    
	pageInit();
});

function loadZbContentCombo(zbUids, callback) {
	zbContentArr = new Array();
	DWREngine.setAsync(false);
		if(rateStatus&&rateStatus!=""){
		var whereStr="zbUids='"+zbUids+"'";
		PCBidDWR.getContentForCurrentApplyByWhere("PcBidIssueWinDoc",parent.outFilter,whereStr, function(list) {
					for (var i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].uids);
						temp.push(list[i].contentes);
						temp.push(list[i].respondDept);
						temp.push(list[i].respondUser);
						zbContentArr.push(temp);
					}
					if(list.length==0){
						var temp = new Array();
						temp.push("");
						temp.push("");
						zbContentArr.push(temp);
					}
					zbContentStore.loadData(zbContentArr);
					if (callback) {
						callback(list.length);
					}
	
				});			
	}else{
	PCBidDWR.getContentForCurrentApply(parent.outFilter,zbUids, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].contentes);
					temp.push(list[i].respondDept);
					temp.push(list[i].respondUser);
					zbContentArr.push(temp);
				}
				if(list.length==0){
					var temp = new Array();
					temp.push("");
					temp.push("");
					zbContentArr.push(temp);
				}
				zbContentStore.loadData(zbContentArr);
				if (callback) {
					callback(list.length);
				}

			});		
		}
	DWREngine.setAsync(true);
}

/**
 * 加载通过预审单位Combo
 */
function loadTbUnitCombo() {
	var tbUnitArr = new Array();

	DWREngine.setAsync(false);
	// tbUnitStore.removeAll();
	PCBidDWR.getVeryfiedUnits(bidContentId, function(list) {

				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].tbUnit);
					tbUnitArr.push(temp);
				}

			});
	if (tbUnitArr.length == 0) {
		tbUnitArr.push(['-1', '(无)']);
	}

	DWREngine.setAsync(true);
	tbUnitStore.loadData(tbUnitArr);

}

function reloadBidDetail(contentId) {
	bidContentId = contentId;
	plantInt.contentUids = contentId;
	loadTbUnitCombo();
//	if (contentId != null && contentId != '')
		issueWinDs.reload();
}

function deleteIssueWinDocAttachment() {
	var bizTypes = new Array();
	bizTypes.push(issueWinNoticeBusinessType, issueWinOhterBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedIssueWinDocId, function(
					retVal) {
				curDeletedIssueWinDocId = null;
			});
}

function popPartbDet(conname){
	if(formPanelPB) formPanelPB.destroy();
	if(partbDet) partbDet.destroy();
	
	formPanelPB = new Ext.FormPanel({
        id:'partB-panel',
        header:false,
        border: false,
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'right',
	    autoScroll:true,
    	items: [{
    			layout:'column',
	            bodyStyle: 'padding:8px',
	            border:false,
	            items:[{
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items: [{
	                	xtype:'textfield',
	                	name: 'partybno',
						fieldLabel: '乙方单位编号',
						allowBlank: false,
						anchor:'95%'
	                }]
	            },{
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items: [{
	                	xtype:'textfield',
	                	name: 'partyb',
						fieldLabel: '乙方单位名称',
						allowBlank: false,
						readOnly:true,
						anchor:'95%'
	                }]
	            },{
	                columnWidth:.0,
	                layout: 'form',
	                border:false,
	                items: [{
		                	xtype:'hidden',
		                	name: 'cpid'
		                },{
		                	xtype:'hidden',
		                	name: 'pid'
	                	}
	                ]
	            }]
	        },{   
	        	xtype:'tabpanel',   
	        	deferredRender:false,         		                     
	            activeTab: 0,
	            defaults:{autoHeight:true, bodyStyle:'padding:10px'},        
                border:false,                              
                items: [{
                    title:'乙方单位传真',
	                layout: 'column',
	                border:false,
	                columnWidth:.5,
	                items:[{
	                	layout: 'form',
		                border:false,
		                columnWidth:.5,
		                items:[{
		                		xtype:'textfield',
		                		name: 'partyblawer',
								fieldLabel: '法人代表人',
								anchor:'95%'
		                	},{
		                		xtype:'textfield',
		                		name: 'linkman',
								fieldLabel: '联系人',
								anchor:'95%'
		                	},{
		                		xtype:'textfield',
		                		name: 'partybshort',
								fieldLabel: '手机',
								anchor:'95%'
		                	},{
		                		xtype:'textfield',
		                		name: 'partybbank',
								fieldLabel: '开户行',
								anchor:'95%'
		                	},{
		                		xtype:'textfield',
		                		name: 'partybbankno',
								fieldLabel: '开户行帐号',
								anchor:'95%'
		                	}  	         			            	
			            ]
			        },{
			        layout: 'form',
	                border:false,
	                columnWidth:.5,
	                items:[{
	                		xtype:'textfield',
							name: 'postalcode',
							fieldLabel: '邮编',
							anchor:'95%'
				         },{
	                		xtype:'textfield',
							name: 'phoneno',
							fieldLabel: '电话',
							anchor:'95%'
				         },{
	                		xtype:'textfield',
							name: 'fax',
							fieldLabel: '传真',
							anchor:'95%'
				         },{
	                		xtype:'textfield',
							name: 'address',
							fieldLabel: '地址',
							anchor:'95%'
				         },{
	                		xtype:'textfield',
							name: 'email',
							fieldLabel: '电子邮件',
							anchor:'95%'
				         }	
					  ]	   
				   }]
			},{
			    layout: 'fit',
                border: false, 
                bodyStyle: 'padding 0px 0px;',
                title: '单位简介',
                cls: 'x-plain',              
                items: [{
						name: 'brief',
						fieldLabel: '简介',
						hideLabel: true,
						width: 400,
						height: 120,
						xtype: 'htmleditor',
						anchor:'95%'
		         }]
	        }]
	    }],	
		buttons: [{
			id: 'save',
            text: '保存',
            hidden: disableBtn,
            handler: formSavePB
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	partbDet.hide();
			}
        }]
    });
	
    partbDet = new Ext.Window({	                  
         title:'乙方单位详情',
         layout:'fit',
         width:700,
         height:325,
         //closable:false,
         closeAction:'hide',
         modal : true,
         plain: true,	                
         items: formPanelPB
     });
	partbDet.show();
    loadFormPB();
}
function loadFormPB(){
	var form = formPanelPB.getForm();
	if (issueWinGrid.getSelectionModel().getSelected()!=null)
	{
		var gridRecod = issueWinGrid.getSelectionModel().getSelected();
    	var index = tbUnitStore.find("k",gridRecod.get('tbUnit'));
    	var pbname = "";
    	if(index>-1){
    		pbname = tbUnitStore.getAt(index).get("v");
	    	baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConPartyb","partyb='"+pbname+"'", function(lt){
    			 var ColumnsPB = [
			    	{name: 'cpid', type: 'string'},	
					{name: 'pid', type: 'string'},
					{name: 'partybno', type: 'string'},    	
					{name: 'partyb', type: 'string'},
					{name: 'partyblawer', type: 'string'},
					{name: 'partybbank', type: 'string'},
					{name: 'partybbankno', type: 'string'}]
    			var FieldsPB = ColumnsPB.concat([							//表单增加的列
					{name: 'address', type: 'string'},
					{name: 'partybshort', type: 'string'},
					{name: 'postalcode', type: 'string'},
					{name: 'phoneno', type: 'string'},
					{name: 'email', type: 'string'},
					{name: 'homepage', type: 'string'},
					{name: 'fax', type: 'string'},
					{name: 'linkman', type: 'string'},
					{name: 'brief', type: 'string'}
				])
			    var PlantFieldsPB = Ext.data.Record.create(FieldsPB);
	    		if (lt != null&&lt.length!=0) {
				    form.loadRecord(new PlantFieldsPB(lt[0]))
	    		}else{
	    			form.loadRecord(new PlantFieldsPB({partyb:pbname}))
	    		}
	    	})
    	}
    		
	}
}

//保存选择的单位值
function saveTbUnit(){
	var rateStatus=0;
	tbUidsArray=new Array();
	var records=smTbUnit.getSelections();
	if(records&&records.length>0){
		for(var i=0;i<records.length;i++){
			var record=records[i];
			tbUidsArray.push(record.get("uids"));
		}	
		var uidsAfterInsert=new Array();
		DWREngine.setAsync(false);
		PCBidDWR.savePcBidIssueWinDocByTbUnits(currentPid,bidContentId,rateStatus,USERDEPTID,USERID,tbUidsArray,function(uidsArr){
		    if(uidsArr&&uidsArr.length>0){
		    	uidsAfterInsert=uidsArr;
		    	Ext.example.msg("提示", "保存成功!");
		    }
		});
		if (!doExchange) {
		}else{
			var updArr = new Array();
			//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
			PCBidDWR.excDataZbForSave(issueWinBeanName,updArr,uidsAfterInsert,false, currentPid, defaultOrgRootID,function(flag){	
			})				
		}		
		DWREngine.setAsync(true);	
		//清空全选框表头
		if( gridTbUnit.getEl()){
			var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
			var hd = hd_checker.first();        
		if(hd.hasClass('x-grid3-hd-checker-on')){   
      		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
      		gridTbUnit.getSelectionModel().clearSelections();   
	 	 } 			
		}			
		gridTbUnitWin.hide();
		issueWinGrid.getStore().load();
		
	}

}

function cancelTbUnit(){
	smTbUnit.clearSelections();
		//清空全选框表头
		if( gridTbUnit.getEl()){
			var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
			var hd = hd_checker.first();        
		if(hd.hasClass('x-grid3-hd-checker-on')){   
      		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
      		gridTbUnit.getSelectionModel().clearSelections();   
	 	 } 			
		}		
}
		var saveTbUnit = new Ext.Toolbar.Button({
					id : 'saveTbUnit',
					iconCls : 'save',
					text : "确定",      
					handler : saveTbUnit
				});	
		var cancelTbUnit = new Ext.Toolbar.Button({
			id : 'cancelTbUnit',
			iconCls : 'remove',
			text : "取消",      
			handler : cancelTbUnit
		});	
			var toolbarItems = ['->',saveTbUnit, '-', cancelTbUnit];		
		
		var dataGridRsTbUnit = Ext.data.Record.create([{
				name : 'uids',
				type : 'string'
			}, {
				name : 'tbUnit',
				type : 'string'
			}]);
					
		var dataGridDsReaderTbUnit = new Ext.data.JsonReader({
				id : "uids",
				root : 'topics',
				totalProperty : 'totalCount'
			}, dataGridRsTbUnit)				
		var dsResultTbUnit = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : CONTEXT_PATH
										+ '/servlet/PcBidServlet'
							}),
					reader : dataGridDsReaderTbUnit
				});	
		dsResultTbUnit.on("beforeload", function(ds1) {
					Ext.apply(ds1.baseParams, {
								ac : 'getUnselectTbUnit',
								orderby : "tbUnit",
								bidContentId:bidContentId,
								tbUnitType:'PcBidIssueWinDoc'
							})
				});	
		smTbUnit = new Ext.grid.CheckboxSelectionModel({
			
					});				
		smTbUnit.on('rowselect', function(sm) { // grid 行选择事件
			var records= sm.getSelections();
			
			
		});					
		var columnModelTbUnit = new Ext.grid.ColumnModel([smTbUnit, 
				 {
					header : '单位编号',
					dataIndex : 'uids',
					align : 'center',
					hidden:true,
					width : 15
				},  
				{
					header : '单位名称',
					dataIndex : 'tbUnit',
					align : 'center',
					width : 350

				}]);		
		var pageToolbarTbUnit = new Ext.PagingToolbar({
					pageSize : PAGE_SIZE,
					beforePageText : "第",
					afterPageText : "页, 共{0}页",
					store : dsResultTbUnit,
					displayInfo : true,
					firstText : '第一页',
					prevText : '前一页',
					nextText : '后一页',
					lastText : '最后一页',
					refreshText : '刷新',
					displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
					emptyMsg : "无记录。"
				});		
//选择单位窗口
function selectTbUnit(){
		
			// 创建Grid
			gridTbUnit = new Ext.grid.GridPanel({
						id : 'file-grid',
						ds : dsResultTbUnit,
						cm : columnModelTbUnit,
						sm : smTbUnit,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							//forceFit : true
						},
						bbar : pageToolbarTbUnit,
						tbar : new Ext.Toolbar({
									items : toolbarItems
								})
					});		
			dsResultTbUnit.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});					
	if(!gridTbUnitWin){
	gridTbUnitWin = new Ext.Window({
				title : '选择中标单位',
				width : 400,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				items:[gridTbUnit]
			});			
	}
		//清空全选框表头
		if( gridTbUnit.getEl()){
			var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
			var hd = hd_checker.first();        
		if(hd.hasClass('x-grid3-hd-checker-on')){   
      		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
      		gridTbUnit.getSelectionModel().clearSelections();   
	 	 } 			
		}		
		gridTbUnitWin.show();	
	
}
function formSavePB(){
	var form = formPanelPB.getForm()
	var ids = form.findField('cpid').getValue();
	var f_partybno = form.findField('partybno').getValue();
	var f_partyb = form.findField('partyb').getValue();
	var f_cpid = form.findField('cpid').getValue();
	var flag = true;
	DWREngine.setAsync(false);
	conpartybMgm.checkPartyb(f_partybno, f_partyb, f_cpid, function(state){
		if (state == false){
			Ext.MessageBox.show({
				title: '警告',
				msg: '乙方单位编号 或 乙方单位名称 有重复！<br>请重新输入...',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.WARNING
			});
			flag = false;
		}
	});
	DWREngine.setAsync(true);
	if (flag == false) return;
	if (form.isValid()){
    		doFormSavePB()
    }
}
    
function doFormSavePB(){
    var basicForm = formPanelPB.getForm();
    var partybno = basicForm.findField('partybno').getValue();
    var partyb = basicForm.findField('partyb').getValue();
    var cpid = basicForm.findField('cpid').getValue();
    var pid = basicForm.findField('pid').getValue();
    var partyblawer = basicForm.findField('partyblawer').getValue();
    var linkman = basicForm.findField('linkman').getValue();
    var partybshort = basicForm.findField('partybshort').getValue();
    var partybbank = basicForm.findField('partybbank').getValue();
    var partybbankno =basicForm.findField('partybbankno').getValue();
    var postalcode = basicForm.findField('postalcode').getValue();
    var phoneno = basicForm.findField('phoneno').getValue();
    var fax = basicForm.findField('fax').getValue();
    var address = basicForm.findField('address').getValue();
    var email = basicForm.findField('email').getValue();
    var brief = basicForm.findField('brief').getValue();
    var obj = new Object();
    obj.partybno = partybno;
    obj.partyb = partyb;
    obj.partyblawer = partyblawer;
    obj.linkman = linkman;
    obj.partybshort = partybshort;
    obj.partybbank = partybbank;
    obj.partybbankno = partybbankno;
    obj.postalcode = postalcode;
    obj.phoneno = phoneno;
    obj.fax = fax;
    obj.address = address;
    obj.email = email;
    obj.brief = brief;
    if(cpid==''){
    	var tmpPid = CURRENTAPPID
    	DWREngine.setAsync(false);
		systemMgm.getUnitById(CURRENTAPPID, function(u) {
			if(u && u!=null && u!='null') {
				tmpPid = u.upunit;
			}
		});
		DWREngine.setAsync(true);
        obj.pid = tmpPid;
    }else {
       obj.cpid = cpid;
       obj.pid = pid;
    }
    DWREngine.setAsync(false);
    conpartybMgm.insertConPartyb(obj,function(rtn){
	    Ext.example.msg("提示","操作成功!");
    })
    DWREngine.setAsync(true);
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

//页面初始化加载数据的
function pageInit()
{
	if (parent.curZbStat&&parent.curZbStat.applyId) {
		var applyId = parent.curZbStat.applyId;
		var idx = zbApplyStore.find('k', applyId);
		if (idx != -1) {
			var rec = zbApplyStore.getAt(idx);
			zbApplyCombo.setValue(rec.data.v);
			loadZbContentCombo(applyId, function() {
						if (parent.curZbStat.contentId) {
							var contentId = parent.curZbStat.contentId;
							var idx = zbContentStore.find('k', contentId);
							if (idx != -1) {
								var rec = zbContentStore.getAt(idx);
								zbContentCombo.setValue(rec.data.v);
								selectContentCombo(rec);
							}
						}
					});
		}
	}
	else
	{
		if(zbApplyStore.data.length > 0){
			var applyRecord = zbApplyStore.getAt(0);
			var applyId = applyRecord.data.k;
			zbApplyCombo.setValue(applyRecord.data.v);
			loadZbContentCombo(applyId, function() {
				if(zbContentStore.data.length > 0){
					var contentRecord = zbContentStore.getAt(0);
					//parent.curZbStat.contentId = contentRecord.data.k;
					zbContentCombo.setValue(contentRecord.data.v);
					selectContentCombo(contentRecord)
				}
			});
		}
	}
}

function selectContentCombo(record) {
	var contentUids = record.data.k;
	if (parent.curZbStat) {
		parent.curZbStat.contentId = contentUids;
	}
	reloadBidDetail(contentUids);
}
function showUploadWin(businessType, editable, businessId, winTitle,beanName) {

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
			+ businessId+"&beanName="+beanName;
	fileWin = new Ext.Window({
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
		issueWinDs.load();
	});
}
function onItemClick(item) {
	switch (item.id) {	
		case 'transfer' :
			var selRecords = issueWinGrid.getSelectionModel().getSelections();
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
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidIssueWinDoc&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}