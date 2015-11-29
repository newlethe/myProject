var bean = "com.sgepit.pmis.rlzj.hbm.HrSalaryMaster";
var nowDate = new Date();
var accDs, accWin;
var accSm, accCm;
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth() + 1;
var combox_sj, salaryTypeCombo, templateCombo, infoForm;
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var param_com, kmSel_com, symbol_com, kmTypeBox
var kmArr = new Array();
var KmPanel, Tempgrid;
var paramArr = new Array(), kArr = new Array();
var symbol_com = new Array();
var symbol_arr = [['=', '='], ['-', '-'], ['+', '+'], ['*', '*'], ['/', '/'],
		['(', '('], [')', ')']]
Ext.onReady(function() {
	DWREngine.setAsync(false);
	baseMgm
			.getData(
					"select zb_seqno,realname from sgcc_guideline_info where parentid='005' order by zb_seqno ",
					function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push("ITEM:" + list[i][0]);
							temp.push(list[i][1]);
							kmArr.push(temp);
						}
					})
	DWREngine.setAsync(true);

	DWREngine.setAsync(false);
	baseMgm
			.getData(
					"select zb_seqno,realname from sgcc_guideline_info where parentid='005' order by zb_seqno ",
					function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push("ITEM:" + list[i][0]);
							temp.push(list[i][1]);
							kmArr.push(temp);
						}
					})
	DWREngine.setAsync(true);

	DWREngine.setAsync(false);
	baseMgm
			.getData(
					"select zb_seqno,realname from sgcc_guideline_info where parentid='005' order by zb_seqno ",
					function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							kArr.push(temp);
						}
					})
	DWREngine.setAsync(true);
	DWREngine.setAsync(false);
	baseMgm.getData("select uids,name from hr_salary_basic_info",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push("PARAM:" + list[i][0]);
					temp.push(list[i][1]);
					paramArr.push(temp);
				}
			})
	DWREngine.setAsync(true);
	var kmSelStore = new Ext.data.SimpleStore({
				id : 'km',
				fields : ['k', 'v'],
				data : kmArr
			});

	var paramStore = new Ext.data.SimpleStore({
				id : 'param',
				fields : ['k', 'v'],
				data : paramArr
			});

	var symbStore = new Ext.data.SimpleStore({
				id : 'symb',
				fields : ['k', 'v'],
				data : symbol_arr
			})

	// 工资月份处理开始 zhangh 2011-06-30
	var months = new Array();
	DWREngine.setAsync(false);
	rlzyXcglMgm.getSjTypeListFromSalaryMaster(USERDEPTID, 'BONUS', CURRENTAPPID, function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].toString());
					temp.push(list[i].toString().substring(0, 4) + '年'
							+ list[i].toString().substring(4, 6) + '月'
							+ list[i].toString().substring(6, 8) + '次');
					months.push(temp);
				}
			});
	DWREngine.setAsync(true);

	var store_month = new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : months
			})

	function getNewSj(store, sj) {
		var rtn = sj
		try {
			for (i = 0; i < store.getCount(); i++) {
				if (store.getAt(i).get("value") == sj) {
					var count = sj.substring(6, 8) * 1 + 1
					sj = sj.substring(0, 6) + ((count < 10) ? '0' : '') + count
					rtn = getNewSj(store, sj)
				}
			}
		} catch (e) {
		}
		return rtn
	}

	var data_sj = new Array()
	for (y = nowYear; y >= nowYear - 1; y--) {
		for (m = 12; m >= 1; m--) {
			var temp = new Array();
			sj = y + '' + (((m < 10) ? '0' : '') + m) + '01'
			try {
				sj = getNewSj(store_month, sj);
				temp.push(sj);
				temp.push(sj.substring(0, 4) + '年' + sj.substring(4, 6) + '月'
						+ sj.substring(6, 8) + '次');
				data_sj.push(temp);
			} catch (e) {
				alert('有错误')
			}
		}
	}

	var store_sj = new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : data_sj
			})

	combox_sj = new Ext.form.ComboBox({
				name : 'sjType',
				hiddenName : 'sjType',
				fieldLabel : '发放月份',
				valueField : 'value',
				displayField : 'text',
				mode : 'local',
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				forceSelection : true,
				selectOnFocus : true,
				emptyText : '选择奖金月份...',
				store : store_sj,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '45%'
			});
	/*
	 * //奖金表类型 var salaryTypeSt = new Ext.data.SimpleStore({ fields:
	 * ['value','text'] })
	 * 
	 * //var sql = "select uids as value, name as text from hr_salary_type where
	 * state = '1'";
	 * 
	 * var sql = "select uids as value, name as text from hr_salary_type where
	 * uids='BONUS'"; var type_arr = new Array(); baseMgm.getData(sql,
	 * function(list){ salaryTypeCombo.setValue(list[0][0])
	 * salaryTypeCombo.setRawValue(list[0][1]) });
	 * 
	 * 
	 * salaryTypeCombo = new Ext.form.ComboBox({ name: 'salaryType', hiddenName:
	 * 'salaryType', fieldLabel: '奖金类型', valueField: 'value', displayField:
	 * 'text', mode: 'local', disabled:true, typeAhead: true, allowBlank: false,
	 * triggerAction: 'all', forceSelection:true, selectOnFocus:true, //
	 * emptyText:'选择奖金类型...', store: salaryTypeSt, lazyRender:true, listClass:
	 * 'x-combo-list-small', anchor:'45%' });
	 */
	// 奖金表类型
	var salaryTemplateSt = new Ext.data.SimpleStore({
				fields : ['value', 'text']
			})

	templateCombo = new Ext.form.ComboBox({
				name : 'templateId',
				hiddenName : 'templateId',
				fieldLabel : '   ',
				hidden : true,
				valueField : 'value',
				displayField : 'text',
				mode : 'local',
				// disabled:true,
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				forceSelection : true,
				selectOnFocus : true,
				// emptyText:'选择奖金类型...',
				store : salaryTemplateSt,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				listeners : {
					"beforehide" : function(cmb) {
                         //隐藏掉fieldLabel标签
						cmb.getEl().up('.x-form-item').setDisplayed(false);
					}
				}

			});
	var sql = "select uids as value, template_name as text from hr_salary_template " +
			"where state = '1' and salary_type ='BONUS' " +
			"and sj_type =(select max(sj_type) from hr_salary_template where salary_type ='BONUS'" +
			"and pid = '"+CURRENTAPPID+"' ) and template_Dept like '%,"+USERDEPTID+",%' " +//and template_Dept like '%,"+USERDEPTID+",%' 
			"and pid = '"+CURRENTAPPID+"' and template_Dept like '%,"+USERDEPTID+",%'";// and template_Dept like '%,"+USERDEPTID+",%' 
	if(USERDEPTID == '103090106'){
		sql = "select uids as value, template_name as text from hr_salary_template " +
			"where state = '1' and salary_type ='BONUS' " +
			"and sj_type =(select max(sj_type) from hr_salary_template where salary_type ='BONUS'" +
			"and pid = '"+CURRENTAPPID+"')  " +
			"and pid = '"+CURRENTAPPID+"'";
	}
	baseMgm.getData(sql, function(list) {
				if (list != null && list != "") {
					templateCombo.setValue(list[0][0])
					templateCombo.setRawValue(list[0][1])
					// salaryTemplateSt.loadData(eval(list))
				}

			});
	templateCombo.onTriggerClick = function() {
		templateCombo.resumeEvents();
		accWin.show();
	}

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
			handler : TemformSave
		},
		'RESET' : {
			id : 'reset',
			text : '取消',
			handler : function() {
				accWin.hide();
			}
		},
		'SELECT' : {
			id : 'select',
			text : '选择模板',
			handler : selTempFun
		}
	};

	var remarkField = new Ext.form.TextArea({
				id : 'remark',
				fieldLabel : '备注',
				anchor : '75%'
			});

	infoForm = new Ext.FormPanel({
				title : '新增奖金表',
				id : 'salary_master',
				labelWidth : 100,
				frame : true,
				region : 'center',
				bodyBorder : true,
				border : true,
				bodyStyle : 'padding:5px 5px 5px 5px',
				width : 680,
				height : 500,
				method : 'POST',
				url : '',
				items : [new Ext.form.FieldSet({
							title : '奖金表基本信息',
							border : true,
							items : [combox_sj,
									templateCombo,
									remarkField,
									new Ext.form.Hidden({
										id:'pid',
										value:CURRENTAPPID
									})]
						})],
				buttons : [{
							id : 'save',
							text : '保存',
							handler : formSave
						}, {
							id : 'cancel',
							text : '关闭',
							handler : function() {
								window.location.href = BASE_PATH
										+ "Business/rlzy/bonus/rlzy.bonus.input.jsp";
							}
						}]

			});

	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
				layout : 'border',
				border : false,
				frame : false,
				items : [infoForm]
			});

	// ///////////////////////////////////////工资模板////////////////////////////////////////////////
	var accBean = "com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateView";
	var accPrimaryKey = "uids"
	var accOrderColumn = "uids"
	var fm = Ext.form;

	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '系统编号',
			hidden : true,
			hideLabel : true
		},
		'itemId' : {
			name : 'itemId',
			fieldLabel : '科目名称',
			hidden : true,
			hideLabel : true
		},
		'templateName' : {
			name : 'templateName',
			fieldLabel : '模板名称'
		},
		'xgridTitle' : {
			name : 'xgridTitle',
			fieldLabel : '表头'
		},
		'formula' : {
			name : 'formula',
			fieldLabel : '计算公式'
		}

	}
	var accColumns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'itemId',
				type : 'string'
			}, {
				name : 'templateName',
				type : 'string'
			}, {
				name : 'formula',
				type : 'string'
			}, {
				name : 'xgridTitle',
				type : 'string'
			}]
	accSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	accCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), accSm, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'xgridTitle',
				header : fc['xgridTitle'].fieldLabel,
				dataIndex : fc['xgridTitle'].name,
				hidden : true
			}, {
				id : 'templateName',
				header : fc['templateName'].fieldLabel,
				dataIndex : fc['templateName'].name,
				width : 100
			}, {
				id : 'itemId',
				header : fc['itemId'].fieldLabel,
				dataIndex : fc['itemId'].name,
				width : 80,
				hidden : true,
				renderer : function(value) {
					var text_km = value.split(",");
					for (var i = 0; i < text_km.length; i++) {
						for (var y = 0; y < kArr.length; y++) {
							if (kArr[y][0] == text_km[i]) {
								text_km[i] = kArr[y][1]

							}
						}
					}
					var v = ""
					for (var o = 0; o < text_km.length; o++) {
						v += text_km[o] + ";";
					}
					return v;
				}
			}, {
				id : 'formula',
				header : fc['formula'].fieldLabel,
				dataIndex : fc['formula'].name,
				width : 180,
				renderer : function(value) {
					DWREngine.setAsync(false);
					var formula = "";
					FormulaUtil.getFormulaText(value, function(s) {
								formula = s
							})
					DWREngine.setAsync(true);
					return formula;
				}
			}])
	accDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : accBean,
					business : business,
					method : listMethod,
					params : "state = '1' and salary_type ='BONUS' and pid = '"+CURRENTAPPID+"' and templateDept like '%,"+USERDEPTID+",%' "
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : accPrimaryKey
						}, accColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	accDs.setDefaultSort(accOrderColumn, 'desc');
	var accFormulaTextArea = new Ext.form.TextArea({
				id : 'accFormulaTextArea',
				readOnly : true,
				width : 360,
				height : 90
			});

	var selTemplateBtn = new Ext.Button({
				id : 'selTemplateBtn',
				iconCls : 'btn',
				text : '选择模板',
				handler : selTempFun
			})

	Tempgrid = new Ext.grid.GridPanel({
				ds : accDs,
				sm : accSm,
				cm : accCm,
				// tbar: ['-','模板列表','-'],
				region : 'center',
				width : 400,
				layout : 'fit',
				split : true,
				border : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : true, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : accDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			})
	accDs.load();
	symbol_com = new fm.ComboBox({
		id : 'symbol',
		fieldLabel : '符号',
		width : 120,
		store : symbStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction : 'all',
		mode : 'local',
		listeners : {
			'select' : function(combo, record, index) {
				var form = KmPanel.getForm();
				var text = form.findField('formula').getValue();
				form.findField('formula').setValue(text + record.data.v)
			}
		}
			// anchor:'95%'
		})
	param_com = new fm.ComboBox({
		id : 'param',
		fieldLabel : '参数',
		width : 120,
		store : paramStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction : 'all',
		mode : 'local',
		listeners : {
			'select' : function(combo, record, index) {
				var form = KmPanel.getForm();
				var text = form.findField('formula').getValue();
				form.findField('formula').setValue(text + record.data.v)
			}
		}
			// anchor:'95%'
		})

	var kmSel_com = new fm.ComboBox({
		id : 'kmsel',
		fieldLabel : '科目',
		width : 120,
		store : kmSelStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction : 'all',
		mode : 'local',
		listeners : {
			'beforequery' : function(combo, record, index) {
				var va_arr = new Array();
				var array = kmTypeBox.getValue().split(",")
				for (var o = 0; o < array.length; o++) {
					for (var i = 0; i < kArr.length; i++) {
						if (array[o] == kArr[i][0]) {
							var temp = new Array()
							temp.push(kArr[i][0]);
							temp.push(kArr[i][1]);
							va_arr.push(temp);
						}
					}
				}
				kmSelStore.loadData(va_arr)
			},
			'select' : function(combo, record, index) {
				var form = KmPanel.getForm();
				var text = form.findField('formula').getValue();
				form.findField('formula').setValue(text + record.data.v)
			}
		}
			// anchor:'95%'
		})

	var kmTypeStore = new Ext.data.SimpleStore({
				id : 0,
				fields : ['val', 'txt']
			});
	kmTypeBox = new Ext.form.MultiSelect({
				id : 'ke_com',
				fieldLabel : '工资科目',
				width : 240,
				maxHeight : 100,
				store : kmTypeStore,
				displayField : 'txt',
				valueField : 'val',
				typeAhead : id,
				triggerAction : 'all',
				mode : 'local',
				editable : false,
				selectOnFocus : true
			});
	db2Json
			.selectSimpleData(
					"select zb_seqno,realname from sgcc_guideline_info where parentid='005' order by zb_seqno",
					function(dat) {
						kmTypeStore.loadData(eval(dat))
					});

	KmPanel = new Ext.FormPanel({
				id : 'form-panel',
				border : false,
				title : '编辑计算公式',
				height : 230,
				region : 'south',
				autoScroll : true,
				bodyStyle : 'padding:10px 10px;',
				items : [{
							layout : 'column',
							border : false,
							labelWidth : 36,
							items : [{
										layout : 'form',
										border : false,
										columnWidth : .3,
										labelWidth : 37,
										items : [kmSel_com]
									}, {
										layout : 'form',
										border : false,
										columnWidth : .3,
										labelWidth : 37,
										items : [param_com]
									}, {
										layout : 'form',
										border : false,
										columnWidth : .3,
										labelWidth : 37,
										items : [symbol_com]
									}]
						}, {
							layout : 'form',
							border : false,
							labelWidth : 36,
							items : [{
										xtype : 'textarea',
										id : 'formula',
										fieldLabel : '公式',
										height : 110,
										width : 460
									}]
						}],
				buttons : [BUTTON_CONFIG['SELECT'], BUTTON_CONFIG['SAVE'],
						BUTTON_CONFIG['RESET']]
			});

	var accWin = new Ext.Window({
				title : '选择工资模板',
				tbar : [selTemplateBtn],
				width : 600,
				height : document.body.clientHeight * 0.95,
				modal : true,
				plain : true,
				border : false,
				resizable : false,
				closeAction : 'hide',
				layout : 'border',
				items : [Tempgrid, KmPanel]
			})

	accSm.on("rowselect", function(sm, rowIndex, record) {
				var value = record.get('formula');
				DWREngine.setAsync(false);
				var formula = "";
				FormulaUtil.getFormulaText(value, function(s) {
							formula = s
						})
				DWREngine.setAsync(true);
				var items = record.get('itemId');
				var GS_form = KmPanel.getForm();
				GS_form.findField('formula').setValue(formula);
			})

	function selTempFun() {
		var smTemp = Tempgrid.getSelectionModel().getSelected();
		var oldFormula = smTemp.get('formula');
		var form = KmPanel.getForm();
		var newFormula = form.findField('formula').getValue()
		DWREngine.setAsync(false);
		FormulaUtil.getFormulaByText(newFormula, function(str) {
					newFormula = str;
				})
		DWREngine.setAsync(true);

		if (smTemp == "" || smTemp == null) {
			Ext.MessageBox.alert("提示", "请选择数据!");
		} else if (newFormula != oldFormula) {
			Ext.MessageBox.alert("提示", "修改过的公式请先保存!");
		} else {
			DWREngine.setAsync(false);
			var sql = "select uids as value, template_name as text from hr_salary_template where state = '1' and salary_type ='BONUS'";
			db2Json.selectSimpleData(sql, function(dat) {
						if (dat) {
							salaryTemplateSt.loadData(eval(dat))
						}
					});
			templateCombo.setValue(smTemp.get('uids'));
			DWREngine.setAsync(true);
			Ext.example.msg('提示', '模板选择成！');
			accWin.hide();
		}

	}

});

// 保存奖金表
function formSave() {
	var form = infoForm.getForm();
	if (form.isValid()) {
		var data = form.getValues();
		data.state = "0";
		data.count = parseInt(data.sjType.substring(6, 8), 10);
		data.unitId = USERDEPTID;
		data.sendState = "0";
		data.salaryType = 'BONUS'
		var temid;
		DWREngine.setAsync(false);
		rlzyXcglMgm.saveSalaryMaster(data, function(d) {
					temid = d;
				});
		DWREngine.setAsync(true);
		DWREngine.setAsync(false);
		rlzyXcglMgm.initDetailData(temid, USERDEPTID, function(val) {
					window.location.href = BASE_PATH
							+ "Business/rlzy/bonus/rlzy.bonus.input.jsp";

				});
		DWREngine.setAsync(true);
		// 保存完成

	}
}

// 保存编辑的公式
function TemformSave() {
	var Tempform = KmPanel.getForm();
	var foml = Tempform.findField('formula').getValue();
	if (foml == "" || foml == null) {
		Ext.MessageBox.alert("提示", "请填写完整数据!");
	} else {
		// 公式的有效性校验；
		FormulaUtil.getFormulaByText(foml, function(rtn) {
					if (rtn.indexOf("ITEM") == 0) {
						doFormSave(rtn);
					} else {
						Ext.Msg.alert("公式定义错误：", rtn);
					}
				});
	}
}
function doFormSave(rtn) {
	var record = Tempgrid.getSelectionModel().getSelected();
	var uids = record.get('uids');
	var textArea = KmPanel.getForm().findField('formula').getValue();
	// 验证新编辑后的公式
	DWREngine.setAsync(false);
	textArea = textArea.replace(/\s/g, "");
	// 将公式的文字格式转为代码格式
	FormulaUtil.getFormulaByText(textArea, function(str) {
				if (str.indexOf("ITEM") == 0) {
					rlzyXcglMgm.saveTempFormula(uids, str, function(str) {
								var arr = str.split(",");
								if (arr[0] == "0") {
									// 根据模板的公式生成表头
									FormulaUtil.updateXgridTitle(arr[1]);
									accDs.reload();
									accDs.on('load', function() {
												var row = accDs
														.indexOfId(arr[1])
												accSm.selectRow(row, true);
											})
									Ext.Msg.alert('操作成功', '模板公式保存成功！');
								} else if (arr[0] == "1") {
									//根据模板的公式生成表头
									FormulaUtil.updateXgridTitle(arr[1]);
									accDs.reload();
									accDs.on('load', function() {
												var row = accDs
														.indexOfId(arr[1])
												accSm.selectRow(row, true);
											})
									Ext.Msg.alert("操作成功",
											"当前编辑的模板已经被使用过，编辑后的公式将保存为新的模板！");
								} else if (arr[0] == "2") {
									Ext.Msg.alert('操作失败', '请检查后重新操作！');
								}
							})
				} else {
					Ext.Msg.alert("公式定义错误", str);
				}
			})
	DWREngine.setAsync(true);
	/*
	var obj =new Object();
	var sm_temp=Tempgrid.getSelectionModel().getSelected();
	obj.uids=sm_temp.get("uids"); 
	obj.xgridTitle = sm_temp.get("xgridTitle");
	obj.formula=rtn
	if(kmTypeBox.getValue()==""||kmTypeBox.getValue()==null){
		obj.itemId=sm_temp.get("itemId")
	}
	else{obj.itemId = kmTypeBox.getValue()}
	//	var value = KmPanel.getForm().findField('formula').getValue(); 
	
	if(obj!=""&&obj!=null){
			rlzyXcglMgm.saveTemp(obj,function(dat){
				if(dat==true){
					Ext.MessageBox.alert("提示","数据保存成功!");
					accDs.reload();
				}
				else{
					Ext.MessageBox.alert("错误","数据保存失败!");
				}
			})
		}
	 */
}