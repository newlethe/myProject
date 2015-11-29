var beanPB = "com.sgepit.pmis.sczb.hbm.SczbJjb";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "uids"
var orderColumnPB = "uids"
var partbDet;
var partbWindow;
var queryWin;
var currentPid = CURRENTAPPID;
var qj = "30";//提前30分钟可以交接班
var isInit = false;
var yzSucessFull=false;
var fileWin;
var formPanelPB;
var formJjbField;
var zbjlMainId;
var zbjlInfoWin;

Ext.onReady(function() {
	//是否禁用添加/修改/删除按钮
		var btnDisabled = ModuleLVL != '1';

		DWREngine.setAsync(false);
		systemMgm.getUnitById(CURRENTAPPID, function(u) {
			if (u && u != null && u != 'null') {
				currentPid = u.upunit;
			}
		});

		sczbJjbMgm.initJjbTable(currentPid, currentPid, qj, function(data) {
			isInit = data
		});

		DWREngine.setAsync(true);

		var gridfilter = "PID = '" + currentPid + "' and recordState='0'";
		var fm = Ext.form;
		var fcPB = {
			'uids' : {
				name : 'uids',
				fieldLabel : 'uids',
				anchor : '95%'
			},
			'pid' : {
				name : 'pid',
				fieldLabel : 'pid',
				//hidden:true,
				//hideLabel:true,
				anchor : '95%'
			},
			'rq' : {
				name : 'rq',
				fieldLabel : '日期',
				//hideLabel:true,
				//hidden:true,
				anchor : '95%'
			},
			'zcName' : {
				name : 'zcName',
				fieldLabel : '值次',
				allowBlank : false,
				anchor : '95%'
			},
			'bcName' : {
				name : 'bcName',
				fieldLabel : '班次',
				allowBlank : false,
				anchor : '95%'
			},
			'zbTime' : {
				name : 'zbTime',
				fieldLabel : '值班时间',
				anchor : '95%'
			},
			'nameJie' : {
				name : 'nameJie',
				fieldLabel : '接班人',
				anchor : '95%'
			},
			'nameJiao' : {
				name : 'nameJiao',
				fieldLabel : '交班人',
				anchor : '95%'
			},
			'jbDate' : {
				name : 'jbDate',
				fieldLabel : '交班时间',
				anchor : '95%'
			},
			'getbDate' : {
				name : 'getbDate',
				fieldLabel : '接班时间',
				anchor : '95%'
			},
			'recordState' : {
				name : 'recordState',
				fieldLabel : '记录类型',
				anchor : '95%'
			},
			'userUnitid' : {
				name : 'userUnitid',
				fieldLabel : '用户部门id',
				anchor : '95%'
			}
		}
		
		var ColumnsPB = [ {
			name : 'uids',
			type : 'string'
		}, //Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'pid',
					type : 'string'
				}, {
					name : 'rq',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'zcName',
					type : 'string'
				}, {
					name : 'bcName',
					type : 'string'
				}, {
					name : 'zbTime',
					type : 'string'
				}, {
					name : 'nameJie',
					type : 'string'
				}, {
					name : 'nameJiao',
					type : 'string'
				}, {
					name : 'jbDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'getbDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'recordState',
					type : 'string'
				}, {
					name : 'userUnitid',
					type : 'string'
				} ]
		var PlantPB = Ext.data.Record.create(ColumnsPB); //定义记录集

		// 6. 创建表单form-panel
		 formPanelPB = new Ext.FormPanel( {
			id : 'partB-panel',
			title:'交接班',
			header : true,
			border : true,
			//iconCls : 'icon-detail-form', //面板样式
			labelAlign : 'right',
			autoScroll : true,
			region : 'west',
			width:300,
			items : [ {
				bodyStyle : 'padding:8px',
				border : false,
				items : [ {
					layout : 'form',
					border : false,
					items : [ new fm.Hidden(fcPB['uids']),new fm.Hidden(fcPB['pid']), 
						new fm.Hidden(fcPB['recordState']),
						new fm.Hidden(fcPB['userUnitid']),
						new fm.DateField( {
						fieldLabel : fcPB['rq'].fieldLabel,
						name : fcPB['rq'].name,
						disabled : true,
						format:'Y-m-d' 
					}), new fm.TextField( {
						fieldLabel : fcPB['zcName'].fieldLabel,
						name : fcPB['zcName'].name,
						readOnly : true
					}), new fm.TextField( {
						fieldLabel : fcPB['bcName'].fieldLabel,
						name : fcPB['bcName'].name,
						readOnly : true
					}), new fm.TextField( {
						fieldLabel : fcPB['zbTime'].fieldLabel,
						name : fcPB['zbTime'].name,
						readOnly : true
					}), new fm.TextField({
						fieldLabel : fcPB['nameJie'].fieldLabel,
						name : fcPB['nameJie'].name,
						emptyText :'点击接班人签名',
						listeners :{
						  focus :function (field){
							if(field.getValue()==null||field.getValue()==''){
								fileWin = new Ext.Window({
								title : '请输入用户名、密码',
								width : 284,
								height : 133,
								layout : 'fit',
								closeAction : 'close',
								modal : true,
								html : "<iframe name='fileFrame' src='Business/sczb/signin.jsp' frameborder=0 style='width:100%;height:100%;'></iframe>"
								});
								formJjbField="nameJie";
								fileWin.show();
								
							}
						  }
						}
						}), new fm.DateField( {
						fieldLabel : fcPB['getbDate'].fieldLabel,
						name : fcPB['getbDate'].name,
						width : 155,
						disabled : true,
						format:'Y-m-d H:i:s' 
					}), new fm.TextField({
						fieldLabel :fcPB['nameJiao'].fieldLabel,
						name : fcPB['nameJiao'].name,
						emptyText :'点击交班人签名',
						listeners :{
						  focus :function (field){
							if(field.getValue()==null||field.getValue()==''){
								if(jbRen()){
									fileWin = new Ext.Window({
										title : '请输入用户名、密码',
										width : 284,
										height : 133,
										layout : 'fit',
										closeAction : 'close',
										modal : true,
										html : "<iframe name='fileFrame' src='Business/sczb/signin.jsp' frameborder=0 style='width:100%;height:100%;'></iframe>"
										});
										formJjbField="nameJiao";
										fileWin.show();
								}else{
									Ext.MessageBox.show({
							           title: '警告！',
							           msg: '接班人尚未签名，不能交班',
							           width:300,
							           buttons: Ext.MessageBox.OK,
							           icon: Ext.MessageBox.ERROR
									});
								}
							}
						  }
						}
						}), new fm.DateField( {
						fieldLabel : fcPB['jbDate'].fieldLabel,
						name : fcPB['jbDate'].name,
						width : 155,
						disabled : true,
						format:'Y-m-d H:i:s' 
					}) ]
				} ]
			} ],
			buttons : [ {
				id : 'save',
				text : '保存',
				disabled : btnDisabled,
				handler : formSavePB
			}]
		});
		
		function loadFormPB() {
			var form = formPanelPB.getForm();
			DWREngine.setAsync(false);
			sczbJjbMgm.getJJB(currentPid,function(rtn){
				if (rtn == null) {
					Ext.MessageBox.show( {
					title : '记录不存在！',
					msg : '未找到交接班记录，请刷新后再试！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
					});
					return;
				}else{
					var record = new PlantPB(rtn);
					form.loadRecord(record);
//					form.findField("jbDate").setValue(new Date());
//					form.findField('uids').setValue(rtn.uids);
//					form.findField('pid').setValue(rtn.pid);
//					form.findField('rq').setValue(rtn.rq);
//					form.findField('zcName').setValue(rtn.zcName);
//					form.findField('bcName').setValue(rtn.bcName);
//					form.findField('zbTime').setValue(rtn.zbTime);
//					form.findField('nameJie').setValue(rtn.nameJie);
//					form.findField('nameJiao').setValue(rtn.Jiao);
//					form.findField('jbDate').setValue(rtn.jbDate);
//					form.findField('getbDate').setValue(rtn.getDate);
//					form.findField('recordState').setValue(rtn.recordState);
//					form.findField('userUnitid').setValue(rtn.userUnitid);
					
					
					
					zbjlMainId=rtn.uids;
					zbjlPB.baseParams.params = " jjbUids='"+zbjlMainId+"'";
					zbjlPB.load( {
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
				}
			});
			DWREngine.setAsync(true);
		}
	
		//formPanelPB.on("render",loadFormPB);
		
		
		function formSavePB() {
			var basicForm = formPanelPB.getForm();
			var nameJiao = basicForm.findField('nameJiao').getValue();
			var nameJie = basicForm.findField('nameJie').getValue();
			var bcName = basicForm.findField('bcName').getValue();
			var rq = basicForm.findField('rq').getValue();
			
			if(nameJiao==null||nameJiao==''){
				doFormSavePB();
			}else{
			DWREngine.setAsync(false);
			sczbJjbMgm.isCanJb(nameJiao,nameJie,currentPid,qj,bcName,rq.getFullYear()+"-"+(rq.getMonth()+1)+"-"+rq.getDate(), function(rtn) {
				if(rtn!='交接班成功'){
					Ext.MessageBox.show({
			           title: '消息',
			           msg: rtn,
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
				}else{
					//dsPB.reload();
					//partbDet.hide();
				}
			})
			DWREngine.setAsync(true);
				
			}
			
		}

		function doFormSavePB() {
			var basicForm = formPanelPB.getForm();
			var uids = basicForm.findField('uids').getValue();
			var pid = basicForm.findField('pid').getValue();
			var rq = basicForm.findField('rq').getValue();
			var zcName = basicForm.findField('zcName').getValue();
			var bcName = basicForm.findField('bcName').getValue();
			var zbTime = basicForm.findField('zbTime').getValue();
			var nameJie = basicForm.findField('nameJie').getValue();
			var nameJiao = basicForm.findField('nameJiao').getValue();
			//var jbDate = basicForm.findField('jbDate').getValue();
			var getbDate = basicForm.findField('getbDate').getValue();
			var recordState = basicForm.findField('recordState').getValue();
			var userUnitid = basicForm.findField('userUnitid').getValue();
			var obj = new Object();
			obj.uids = uids;
			obj.pid = pid;
			obj.rq= rq;
			obj.zcName = zcName;
			obj.bcName = bcName;
			obj.zbTime = zbTime;
			obj.nameJie = nameJie;
			obj.nameJiao = nameJiao;
			obj.jbDate = null;
			obj.getbDate = getbDate;
			obj.recordState = recordState;
			obj.userUnitid = userUnitid;
			
			DWREngine.setAsync(false);
			sczbJjbMgm.updateJjb(obj, function(rtn) {
			})
			DWREngine.setAsync(true);
			loadFormPB();
//			dsPB.load( {
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});
			//partbDet.hide();
		}

		function formCancelPB() {
//			partbDet.hide();
//			partbDet = null
		}

		function popPartbDet() {
			if (!partbDet) {
				partbDet = new Ext.Window( {
					title : '交接班管理',
					layout : 'fit',
					width : 600,
					height : 325,
					modal : true,
					closeAction : 'hide',
					plain : true,
					items : formPanelPB
				});
			}
			partbDet.show();
			loadFormPB();
			
			if (smPB.getSelected() != null) {
				var gridRecod = smPB.getSelected()
				var ids = smPB.getSelected().get('uids');
			}
		}


		/***
		 * begin  添加值班记录的grid
		 */
		var zbjlFcPB = {
			'uids' : {
				name : 'uids',
				fieldLabel : 'uids',
				anchor : '95%'
			},
			'jjbUids' : {
				name : 'jjbUids',
				fieldLabel : 'jjbUids',
				//hidden:true,
				//hideLabel:true,
				anchor : '95%'
			},
			'jlDate' : {
				name : 'jlDate',
				fieldLabel : '时间',
				//hideLabel:true,
				//hidden:true,
				anchor : '95%'
			},
			'content' : {
				name : 'content',
				fieldLabel : '值班内容',
				allowBlank : false,
				anchor : '95%'
			}
		}
		// 3. 定义记录集
		var zbjlColumnsPB = [ {
			name : 'uids',
			type : 'string'
		}, //Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'jjbUids',
					type : 'string'
				}, {
					name : 'jlDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'content',
					type : 'string'
				} ]
		var zbjlPlantPB = Ext.data.Record.create(zbjlColumnsPB); //定义记录集
		var zbjlSmPB = new Ext.grid.CheckboxSelectionModel( {
			singleSelect : false
		})

		var zbjlPB = new Ext.data.Store( {
			baseParams : {
				ac : 'list',
				bean : "com.sgepit.pmis.sczb.hbm.SczbZbjl",
				business : businessPB,
				method : listMethodPB,
				params : " jjbUids='"+zbjlMainId+"'"
			},
			proxy : new Ext.data.HttpProxy( {
				method : 'GET',
				url : MAIN_SERVLET
			}),

			reader : new Ext.data.JsonReader( {
				root : 'topics',
				totalProperty : 'totalCount',
				id : 'uids'
			}, zbjlColumnsPB),

			remoteSort : true,
			pruneModifiedRecords : true
		});
		zbjlPB.setDefaultSort("jlDate", 'asc');

		
		var zbjlCmPB = new Ext.grid.ColumnModel( [ // 创建列模型
				zbjlSmPB, {
					id : 'uids',
					header : zbjlFcPB['uids'].fieldLabel,
					dataIndex : zbjlFcPB['uids'].name,
					width : 100,
					hidden : true,
					editor : new fm.TextField(zbjlFcPB['uids']),
					renderer : function(data) {
						var qtip = "qtip=" + data;
						return '<span ' + qtip + '>' + data + '</span>';
						return data;
					}

				}, {
					id : 'jjbUids',
					header : zbjlFcPB['jjbUids'].fieldLabel,
					dataIndex : zbjlFcPB['jjbUids'].name,
					hidden : true
				}, {
					id : 'jlDate',
					header : zbjlFcPB['jlDate'].fieldLabel,
					dataIndex : zbjlFcPB['jlDate'].name,
					editor : new fm.DateField(zbjlFcPB['jlDate']),
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					hidden : false,
					width : 20
				}, {
					id : 'content',
					header : zbjlFcPB['content'].fieldLabel,
					dataIndex : zbjlFcPB['content'].name
					} ]);
		//		zbjlCmPB.defaultSortable = true; //设置是否可排序

		var zbjlPlantIntPB = {
			uids : '',
			jjbUids : '',
			jlDate : new Date,
			content : ''
		} //设置初始值
		var zbjlPlantFieldsIntPB = new Object();
		Ext.applyIf(zbjlPlantFieldsIntPB, zbjlPlantIntPB);

		var gridPB1 = new Ext.grid.EditorGridTbarPanel( {
			// basic properties
			id : 'grid-panre2', //id,可选
			title : '值班记录',
			ds : zbjlPB, //数据源
			cm : zbjlCmPB, //列模型
			sm : zbjlSmPB, //行选择模式
			tbar : [], //顶部工具栏，可选
			height : 400, //高
			//iconCls: 'icon-show-all',	//面板样式
			border : false,
			region : 'center',
			clicksToEdit : 2, //单元格单击进入编辑状态,1单击，2双击
			header : true,
			autoScroll : true, //自动出现滚动条
			collapsible : false, //是否可折叠
			animCollapse : false, //折叠时显示动画
		
			loadMask : true, //加载时是否显示进度
			stripeRows : true,
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			},
			bbar : new Ext.PagingToolbar( {//在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : zbjlPB,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
			plant : zbjlPlantPB, //初始化记录集，必须
			plantInt : zbjlPlantIntPB, //初始化记录集配置，必须
			servletUrl : MAIN_SERVLET, //服务器地址，必须
			bean : "com.sgepit.pmis.sczb.hbm.SczbZbjl", //bean名称，必须
			business : businessPB, //business名称，可选
			primaryKey : "uids", //主键列名称，必须
			formBtn : true,
			saveBtn : false,
			formHandler: zbjlInfo,//详细
			//saveHandler: partybSaveHandler,
			insertHandler : insertZbjl//插入
		});

		zbjlPB.load( {
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
		zbjlFormPanelPB = new Ext.FormPanel( {
			id : 'partB-pane2',
			header : false,
			border : false,
			iconCls : 'icon-detail-form', //面板样式
			labelAlign : 'right',
			autoScroll : true,
			items : [ new fm.Hidden(zbjlFcPB['uids']),new fm.Hidden(zbjlFcPB['jjbUids']), 
						 new Ext.form.DateField({//调用日期时间选择组件
								name:  zbjlFcPB['jlDate'].name,
								fieldLabel : zbjlFcPB['jlDate'].fieldLabel,
								format:'Y-m-d H:i:s',
								menu:new DatetimeMenu()
					}), new fm.TextArea ( {
						fieldLabel : zbjlFcPB['content'].fieldLabel,
						name : zbjlFcPB['content'].name,
						width:400,
						height:150
					})],
			buttons : [ {
				id : 'save2',
				text : '保存',
				handler : zbjlFormSavePB
			}, {
				id : 'cancel2',
				text : '取消',
				handler : zbjlFormCancelPB
			} ]
		});
		function zbjlFormSavePB(){
			var basicForm =zbjlFormPanelPB.getForm();
			var uids = basicForm.findField('uids').getValue();
			var jjbUids = basicForm.findField('jjbUids').getValue();
			var jlDate = basicForm.findField('jlDate').getValue();
			var content = basicForm.findField('content').getValue();
			if(content==null||content==''){
				Ext.MessageBox.show({
			           title: '警告',
			           msg: '值班记录不能为空',
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
			}else{
				var obj = new Object();
				obj.uids = uids;
				obj.jjbUids = jjbUids;
				obj.jlDate = jlDate;
				obj.content = content;
				DWREngine.setAsync(false)
				sczbZbjlMgm.saveOrUpdate(obj,function (data){
					
				});
				DWREngine.setAsync(true)
				zbjlPB.load(); 
				Ext.example.msg('保存成功！', '您成功保存了一条信息！')
				zbjlFormCancelPB();
			}
			
			
			
			
			
		}
		function zbjlFormCancelPB(){
			zbjlInfoWin.hide();
			zbjlInfoWin = null
		}
		
		function zbjlInfo(){//明细
			if (!zbjlInfoWin) {
				zbjlInfoWin = new Ext.Window( {
					title : '值班记录详情',
					layout : 'fit',
					width : 550,
					height : 300,
					modal : true,
					closeAction : 'hide',
					plain : true,
					items : zbjlFormPanelPB
				});
			}
			zbjlInfoWin.show();
			loadZbjlFormPB();
			
		}
		
		function loadZbjlFormPB() {
			var form = zbjlFormPanelPB.getForm()
			if (zbjlSmPB.getSelected() != null) {
				var gridRecod = zbjlSmPB.getSelected()
				var ids = zbjlSmPB.getSelected().get('uids');
				baseMgm
						.findById(
								"com.sgepit.pmis.sczb.hbm.SczbZbjl",
								ids,
								function(rtn) {
									if (rtn == null) {
										Ext.MessageBox.show( {
											title : '记录不存在！',
											msg : '未找到需要修改的记录，请刷新后再试！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
										zbjlInfoWin.hide();
										return;
									}
									var obj = new Object();
									for ( var i = 0; i < zbjlColumnsPB.length; i++) {
										if (!obj[zbjlColumnsPB[i].name]) {
											obj[zbjlColumnsPB[i].name] = gridRecod
													.get(zbjlColumnsPB[i].name)
										}
									}
									var record = new zbjlPlantPB(obj)
									form.loadRecord(record)
								})
			}
		}
		
		
		zbjlSmPB.on('selectionchange', function(zbjlSmPB){ // grid 行选择事件
	   		var record = zbjlSmPB.getSelected();
			var tb = gridPB1.getTopToolbar();
	   		if (record!=null) {
	   			tb.items.get("form").enable();
	    	}else{
	   			tb.items.get("form").disable();
	    	}
    	});
		
		function insertZbjl(){//插入值班记录
			if (!zbjlInfoWin) {
				zbjlInfoWin = new Ext.Window( {
					title : '值班记录详情',
					layout : 'fit',
					width : 550,
					height : 300,
					modal : true,
					closeAction : 'hide',
					plain : true,
					items : zbjlFormPanelPB
				});
			}
			zbjlFormPanelPB.getForm().reset();
			zbjlInfoWin.show();
			zbjlFormPanelPB.getForm().findField("jlDate").setValue(new Date());
			zbjlFormPanelPB.getForm().findField("jjbUids").setValue(zbjlMainId);
			
		}
		

		/***
		 * end  添加值班记录的grid
		 */
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [ formPanelPB, gridPB1 ]
		});
		loadFormPB();
	})
		function closeUsePassWin(){
			fileWin.close();
			if(yzSucessFull){
				formPanelPB.getForm().findField(formJjbField).setValue(REALNAME);
				if(formJjbField=='nameJie'){
					formPanelPB.getForm().findField("getbDate").setValue(new Date());
				}
				if(formJjbField=='nameJiao'){
					formPanelPB.getForm().findField("jbDate").setValue(new Date());
				}
				
				
			}
			
		}
		
		function jbRen(){
			var jbRen=formPanelPB.getForm().findField("nameJie").getValue();
			if(jbRen==null||jbRen==''){
				return false;
			}else{
				return true;
			}
		}
