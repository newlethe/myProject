var bean = "com.sgepit.pmis.wzgl.hbm.WzCjspb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bh'
var bgdid_Combo

// PID查询条件
var pidWhereString = "pid = '" + CURRENTAPPID + "'"

var maxStockBhPrefix
Ext.onReady(function() {
	if (isFlwView) {
		var url = BASE_PATH
				+ "Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&isView=true&bhflow="
				+ bh_flow;
		window.location.href = url;
	}

	DWREngine.setAsync(false);
	if ((isFlwTask || isFlwView) && bh_id && bh_id != "") {
		maxStockBh = bh_id
		baseMgm.findWhereOrder(business, bean, null, "bh='" + bh_id + "'",
				"bh", function(dat) {
					if (dat && dat.length > 0) {
						uids_edit = dat[0].uids
					}
				});
	} else {
		// 新增编号获取
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix, "bh", "wz_cjspb", null,
				function(dat) {
					if (dat != "") {
						maxStockBh = dat;
						incrementLsh = (maxStockBh.substr(
								maxStockBhPrefix.length, 4))
								* 1
					}
				})
	}
	DWREngine.setAsync(true);

	// -----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"
					+ USERDEPTID + "'order by unitid", function(list) {
				if (list == null || list == "") {
					var temp = new Array();
					temp.push(USERDEPTID);
					temp.push(UNITNAME);
					bmbzArr.push(temp);
				} else {
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						bmbzArr.push(temp);
					}
				}  

			});
	DWREngine.setAsync(true);
	var getBmbzSt = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bmbzArr
			})
	// -----------------申请人（sqr: rock_user=realname)
	var userArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where userid = '"
					+ USERID + "'", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	var getuserSt = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : userArr
			})

	var BUTTON_CONFIG = {
		'BACK' : {
			text : '返回',
			iconCls : 'returnTo',
			handler : function() {
				history.back();
			}
		},
		'SAVE' : {
			id : 'save',
			text : '保存',
			handler : formSave
		},
		'RESET' : {
			id : 'reset',
			text : '取消',
			handler : function() {
				history.back();
			}
		}
	};
	var fm = Ext.form;

	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '流水号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'bh' : {
			name : 'bh',
			fieldLabel : '申请计划编号',
			readOnly : true,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			value : CURRENTAPPID,
			hidden : true
		},
		'hth' : {
			name : 'hth',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'fybh' : {
			name : 'fybh',
			fieldLabel : '预算项目',
			anchor : '95%'
		},
		'cwbm' : {
			name : 'cwbm',
			fieldLabel : '费用科目',
			anchor : '95%'
		},
		'sqrq' : {
			name : 'sqrq',
			fieldLabel : '申请日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'jhlb' : {
			name : 'jhlb',
			fieldLabel : '计划类别(项目大类)',
			anchor : '95%'
		},
		'bmmc' : {
			name : 'bmmc',
			fieldLabel : '申请部门',
			anchor : '95%'
		},
		'sqr' : {
			name : 'sqr',
			fieldLabel : '申请人',
			anchor : '95%'
		},
		'spr' : {
			name : 'spr',
			fieldLabel : '审批人',
			anchor : '95%'
		},
		'billState' : {
			name : 'billState',
			fieldLabel : '审批状态',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pzrq' : {
			name : 'pzrq',
			fieldLabel : '批准日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'phbh' : {
			name : 'phbh',
			fieldLabel : '采购计划编号',
			anchor : '95%'
		},
		'xz' : {
			name : 'xz',
			fieldLabel : '是否汇总列入采购计划',
			anchor : '95%'
		},
		'userid' : {
			name : 'userid',
			fieldLabel : '用户ID',
			anchor : '95%'
		},
		'wonum' : {
			name : 'wonum',
			fieldLabel : '工单',
			anchor : '95%'
		},
		'wzlb' : {
			name : 'wzlb',
			fieldLabel : '物资类别',
			anchor : '95%'
		},
		'xmbm' : {
			name : 'xmbm',
			fieldLabel : '项目类别(概算编号)',
			anchor : '95%'
		},
		'cjyy' : {
			name : 'cjyy',
			fieldLabel : '年度',
			anchor : '95%'
		},
		'cjmm' : {
			name : 'cjmm',
			fieldLabel : '月度',
			anchor : '95%'
		},
		'stage' : {
			name : 'stage',
			fieldLabel : '期别',
			hidden : true,
			anchor : '95%'
		},
		'bgdid' : {
			name : 'bgdid',
			fieldLabel : '概算编号',
			anchor : '95%'
		}
	}
	var sqr_Combo = new fm.ComboBox({
				name : 'sqr',
				fieldLabel : '申请人',
				readOnly : true,
				store : getuserSt,
				valueField : 'k',
				displayField : 'v',
				triggerAction : 'all',
				mode : 'local',
				anchor : '95%'
			})
	var bmbz_Combo = new fm.ComboBox({
				name : 'bmmc',
				fieldLabel : '申请部门',
				readOnly : true,
				store : getBmbzSt,
				valueField : 'k',
				displayField : 'v',
				triggerAction : 'all',
				mode : 'local',
				anchor : '95%'
			})
	bgdid_Combo = new fm.ComboBox({
				name : 'bgdid',
				fieldLabel : '概算编号',
				readOnly : true,
				store : getBmbzSt,
				valueField : 'k',
				displayField : 'v',
				triggerAction : 'all',
				mode : 'local',
				anchor : '95%'
			})

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'bh',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'hth',
				type : 'string'
			}, {
				name : 'fybh',
				type : 'string'
			}, {
				name : 'cwbm',
				type : 'string'
			}, {
				name : 'sqrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'jhlb',
				type : 'string'
			}, {
				name : 'bmmc',
				type : 'string'
			}, {
				name : 'sqr',
				type : 'string'
			}, {
				name : 'spr',
				type : 'string'
			}, {
				name : 'billState',
				type : 'string'
			}, {
				name : 'pzrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'phbh',
				type : 'string'
			}, {
				name : 'xz',
				type : 'string'
			}, {
				name : 'userid',
				type : 'string'
			}, {
				name : 'wonum',
				type : 'string'
			}, {
				name : 'wzlb',
				type : 'string'
			}, {
				name : 'xmbm',
				type : 'string'
			}, {
				name : 'cjyy',
				type : 'string'
			}, {
				name : 'cjmm',
				type : 'string'
			}, {
				name : 'stage',
				type : 'string'
			}, {
				name : 'bgdid',
				type : 'string'
			}]

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if (uids_edit == null || uids_edit == "") {
		loadFormRecord = new formRecord({
					uids : '',
					bh : maxStockBh,
					pid : '',
					hth : '',
					fybh : '',
					cwbm : '',
					sqrq : new Date(),
					jhlb : '',
					bmmc : USERDEPTID,
					sqr : USERID,
					spr : '',
					billState : '0',
					pzrq : '',
					phbh : '',
					xz : '',
					userid : '',
					wonum : '',
					wzlb : '',
					xmbm : '',
					cjyy : new Date().getYear(),
					cjmm : new Date().getMonth() + 1,
					stage : '',
					bgdid : '',
					pid : CURRENTAPPID
				});
	} else {
		DWREngine.setAsync(false);
		baseMgm.findById(bean, uids_edit, function(obj) {
					loadFormRecord = new formRecord(obj);
				});
		DWREngine.setAsync(true);
	}

	bgdid_Combo.onTriggerClick = function() {
		partbWindow.show()
	}
	var formPanel = new Ext.FormPanel({
				id : 'form-panel',
				header : false,
				border : false,
				autoScroll : true,
				labelWidth : 130,
				region : 'center',
				bodyStyle : 'padding:10px 10px;',
				labelAlign : 'left',
				items : [new Ext.form.FieldSet({
							title : '基本信息',
							autoWidth : true,
							border : true,
							layout : 'column',
							items : [new fm.TextField(fc['uids']),
									new fm.TextField(fc['billState']),
									new fm.TextField(fc['pid']), {
										layout : 'form',
										columnWidth : .50,
										bodyStyle : 'border: 0px;',
										items : [new fm.TextField(fc['bh']),
												new fm.DateField(fc['sqrq']),
												bmbz_Combo, sqr_Combo
										// bgdid_Combo
										// new fm.TextField(fc['cwbm']),
										// new fm.TextField(fc['pid']),
										// new fm.TextField(fc['hth']),
										// new fm.TextField(fc['fybh']),
										// new fm.TextField(fc['jhlb']),
										// new fm.DateField(fc['pzrq'])
										]
									}/*
										 * ,{ layout: 'form', columnWidth: .35,
										 * bodyStyle: 'border: 0px;', items:[
										 * new fm.TextField(fc['xz']), new
										 * fm.TextField(fc['userid']), new
										 * fm.TextField(fc['wonum']), new
										 * fm.TextField(fc['wzlb']), new
										 * fm.TextField(fc['xmbm']), new
										 * fm.TextField(fc['cjyy']), new
										 * fm.TextField(fc['cjmm']),
										 * 
										 * new fm.TextField(fc['spr']), new
										 * fm.TextField(fc['phbh']) ] }
										 */
							]
						})

				],
				buttons : [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
			});

	var contentPanel = new Ext.Panel({
				region : 'center',
				border : false,
				layout : 'fit',
				tbar : ['<font color=#15428b><b>&nbsp;申请计划信息维护</b></font>',
						'->', BUTTON_CONFIG['BACK']],
				items : [formPanel]
			});

	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
				layout : 'border',
				autoWidth : true,
				items : [contentPanel]
			});

	// 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);

	/*
	 * formPanel.getForm().findField('sl').disable();// 数量不可能编辑
	 * if(formPanel.getForm().findField('sl').getValue()>0){
	 * formPanel.getForm().findField('jhdj').disable();//数量大于0，计划单价不可编辑 }else{
	 * formPanel.getForm().findField('jhdj').enable(); }
	 */

	// 保存
	function formSave() {
		var form = formPanel.getForm();
		var ids = form.findField(primaryKey).getValue();
		if (form.isValid()) {
			var bh = form.findField('bh');
			if (bh.getValue() != loadFormRecord.get('bh')) {
				DWREngine.setAsync(false);
				stockMgm.checkBHno(bh.getValue(), function(flag) {
							if (flag) {
								doFormSave();
							} else {
								Ext.Msg.show({
											title : '提示',
											msg : '计划编号不能重复!',
											buttons : Ext.Msg.OK,
											fn : function(value) {
												bh.focus();
												bh.getEl().dom.select();
											},
											icon : Ext.MessageBox.WARNING
										});
							}
						});
				DWREngine.setAsync(true);
			} else {
				doFormSave();
			}
		}
	}

	function doFormSave(dataArr) {
		var form = formPanel.getForm()
		var obj = form.getValues()
		for (var i = 0; i < Columns.length; i++) {
			var n = Columns[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		if (obj.uids == '' || obj.uids == null) {
			var rtnState='';
			systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
			    rtnState=rtn;
			})
			if(isFlwTask != true && isFlwView != true){
	    		if(rtnState=='BusinessProcess'){
	    		    obj.billState=0;
	    		}else if(rtnState=='ChangeStateAuto'){
	    		    obj.billState=1
	    		}else if(rtnState=='None'){
	    		    obj.billState=1
	    		}else{
	    			obj.billState=1
	    		}
    		}
			stockMgm.addOrUpdateWzCjspb(obj, function(state) {
				if ("1" == state) {
					if (isFlwTask != true) {
						Ext.example.msg('保存成功！', '您成功新增了一条信息！');
						history.back();
					} else {
						Ext.Msg.show({
							title : '保存成功！',
							msg : '您成功新增了一条申请计划主信息！　　　<br>下一步进行物资材料的选择！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO,
							fn : function(value) {
								if ('ok' == value) {
									var url = BASE_PATH
											+ "Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&bhflow="
											+ obj.bh;
									window.location.href = url;
								}
							}
						});
					}
				} else {
					Ext.Msg.show({
								title : '提示',
								msg : state,
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		} else {
			stockMgm.addOrUpdateWzCjspb(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					//history.back();
					if (isFlwTask) {
						var url = BASE_PATH
								+ "Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&bhflow="
								+ obj.bh;
						window.location.href = url;
					} else {
						history.back();
					}
				} else {
					Ext.Msg.show({
								title : '提示',
								msg : state,
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
		DWREngine.setAsync(true);
	}

});