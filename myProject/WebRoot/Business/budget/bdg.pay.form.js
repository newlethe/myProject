var beanName = "com.sgepit.pmis.budget.hbm.BdgPayApp";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var beanNameMoney = "com.sgepit.pmis.budget.hbm.VBdgConApp";
// var primaryKey = "payappid";
// var formTitle = "合同：" + g_conname + ", 付款分摊修改";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
var store=null;
var fm = Ext.form; // 包名简写（缩写）
var fc = { // 创建编辑域配置
	'pid' : {
		name : 'pid',
		fieldLabel : 'PID',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		allowBlank : false,
		anchor : '95%'
	},'bdgid' : {
		name : 'bdgid',
		fieldLabel : '概算主键',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		allowBlank : false,
		anchor : '95%'
	},'bdgno' : {
		name : 'bdgno',
		fieldLabel : '财务编码',
		readOnly : true,
		anchor : '95%'
	},'bdgname' : {
		name : 'bdgname',
		fieldLabel : '概算名称',
		readOnly : true,
		allowBlank : false,
		anchor : '95%'
	},'payappid' : {
		name : 'payappid',
		fieldLabel : '付款分摊主键',
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},'payappno' : {
		name : 'payappno',
		fieldLabel : '付款分摊编号',
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},'conid' : {
		name : 'conid',
		fieldLabel : '内部流水号',
		hidden : true,
		hideLabel : true,
		allowBlank : false,
		anchor : '95%'
	},'proname' : {
		name : 'proname',
		fieldLabel : '工程名称<font color=\'red\'>*</font>',
		allowBlank : false,
		anchor : '95%'
	},'bdgmoney' : {
		name : 'bdgmoney',
		fieldLabel : '本合同分摊',
		readOnly : true,
		anchor : '95%'
	},'applypay' : {
		name : 'applypay',
		fieldLabel : '申请支付',
		anchor : '95%'
	},'factpay' : {
		name : 'factpay',
		fieldLabel : '实际金额',
		allowNegative : false,
		anchor : '95%'
	},'remark' : {
		name : 'remark',
		fieldLabel : '备注',
		height : 130,
		width : 200,
		anchor : '95%'
	},'isleaf' : {
		name : 'isleaf',
		fieldLabel : '是否子节点',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},'parent' : {
		name : 'parent',
		fieldLabel : '父节点',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	}
}

// 3. 定义记录集
	var Columns = [{
		name : 'payappid',
		type : 'string'
	},{
		name : 'bdgno',
		type : 'string'
	},{
		name : 'bdgname',
		type : 'string'
	},{
		name : 'payappno',
		type : 'string'
	},{
		name : 'bdgid',
		type : 'string'
	},{
		name : 'pid',
		type : 'string'
	},{
		name : 'conid',
		type : 'string'
	},{
		name : 'proname',
		type : 'string'
	},{
		name : 'bdgmoney',
		type : 'float'
	},{
		name : 'applypay',
		type : 'float'
	},{
		name : 'factpay',
		type : 'float'
	},{
		name : 'remark',
		type : 'string'
	},{
		name : 'isleaf',
		type : 'float'
	},{
		name : 'parent',
		type : 'string'
	}];
	
	// 6. 创建表单form-panel
	var saveBtn = new Ext.Button({
		name : 'save',
		text : '保存',
		iconCls : 'save',
		handler : formSave
	})
	
	var formPanel = new Ext.FormPanel({
		id : 'form-panel',
		header : false,
		border : false,
		width : 306,
		height : 200,
		labelWidth : 70,
		split : true,
		collapsible : true,
		collapseMode : 'mini',
		minSize : 200,
		maxSize : 400,
		border : false,
		region : 'east',
		bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
		iconCls : 'icon-detail-form', // 面板样式
		labelAlign : 'left',
		items : [
				new Ext.form.FieldSet({
					title : '付款概算修改页',
					layout : 'form',
					border : true,
					items : [new fm.TextField(fc['bdgname']),
							new fm.TextField(fc['bdgno']),
							new fm.NumberField(fc['bdgmoney']),
							new fm.NumberField(fc['applypay']),
							new fm.NumberField(fc['factpay']),
							new fm.TextArea(fc['remark']), saveBtn]
				}), new fm.TextField(fc['conid']), new fm.TextField(fc['pid']),
				new fm.TextField(fc['isleaf']), new fm.TextField(fc['parent']),
				new fm.TextField(fc['payappid']), new fm.TextField(fc['payappno']),
				new fm.TextField(fc['bdgid'])]
	});
	
	// 表单保存方法
	function formSave() {
		var form = formPanel.getForm();
		var ids = form.findField('payappid').getValue();
		if (form.isValid()) {
			if (formPanel.isNew) {
				doFormSave(true, tmpLeaf)
			} else {
				doFormSave(false, tmpLeaf)
			}
		}
	}
	
	function doFormSave(isNew) {
		var form = formPanel.getForm();
		var obj = new Object();
		for (var i = 0; i < Columns.length; i++) {
			var name = Columns[i].name;
			var field = form.findField(name);
			if (field) {
				obj[name] = field.getValue();
			}
		}
	    var rtnState;
		DWREngine.setAsync(false); 
		bdgPayMgm.checkAppPay(obj.payappno,obj.pid,obj.bdgid,obj.applypay,obj.factpay,function(rtn){
		    rtnState=rtn;
		})
		DWREngine.setAsync(true); 
		if(rtnState=='1'){
		    Ext.Msg.confirm('提示信息','申请付款金额分摊已超过申请金额,确认分摊?',function(r){
		        if(r=='yes'){
		    		bdgPayMgm.addOrUpdateBdgPayApp(obj, function(flag) {
					if ("0" == flag) {
						reloadTreeMoney(form);
						if (isFlwTask == true) {
							Ext.Msg.show({
							   title: '保存成功！',
							   msg: '您成功保存了一条概算信息！　　　<br>可以发送流程到下一步操作！',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO,
							   fn: function(value){
							   		if ('ok' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
							   }
							});
							parent.IS_FINISHED_TASK = true;
						} else {
							Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
						}
					} else {
						Ext.Msg.show({
							title : '提示',
							msg : '数据保存失败！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
				});
		        }
		    })
		}else if(rtnState=='2'){
		    Ext.Msg.confirm('提示信息','批准付款分摊金额已超过批准付款分摊金额,确认分摊?',function(r){
		        if(r=='yes'){
            		bdgPayMgm.addOrUpdateBdgPayApp(obj, function(flag) {
					if ("0" == flag) {
						reloadTreeMoney(form);
						if (isFlwTask == true) {
							Ext.Msg.show({
							   title: '保存成功！',
							   msg: '您成功保存了一条概算信息！　　　<br>可以发送流程到下一步操作！',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO,
							   fn: function(value){
							   		if ('ok' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
							   }
							});
							parent.IS_FINISHED_TASK = true;
						} else {
							Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
						}
					} else {
						Ext.Msg.show({
							title : '提示',
							msg : '数据保存失败！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
				});
		        }
		    })
		}else if(rtnState=='3'){
		    Ext.Msg.confirm('提示信息','累计付款分摊金额大于合同分摊总金额,确认分摊?',function(r){
		        if(r=='yes'){
            		bdgPayMgm.addOrUpdateBdgPayApp(obj, function(flag) {
					if ("0" == flag) {
						reloadTreeMoney(form);
						if (isFlwTask == true) {
							Ext.Msg.show({
							   title: '保存成功！',
							   msg: '您成功保存了一条概算信息！　　　<br>可以发送流程到下一步操作！',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO,
							   fn: function(value){
							   		if ('ok' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
							   }
							});
							parent.IS_FINISHED_TASK = true;
						} else {
							Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
						}
					} else {
						Ext.Msg.show({
							title : '提示',
							msg : '数据保存失败！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
				});
		        }
		    })		    
		}else if(rtnState=='4'){
		    Ext.Msg.confirm('提示信息','概算项目的累计付款分摊金额已超过概算金额,确认分摊?',function(r){
		        if(r=='yes'){
            		bdgPayMgm.addOrUpdateBdgPayApp(obj, function(flag) {
					if ("0" == flag) {
						reloadTreeMoney(form);
						if (isFlwTask == true) {
							Ext.Msg.show({
							   title: '保存成功！',
							   msg: '您成功保存了一条概算信息！　　　<br>可以发送流程到下一步操作！',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO,
							   fn: function(value){
							   		if ('ok' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
							   }
							});
							parent.IS_FINISHED_TASK = true;
						} else {
							Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
						}
					} else {
						Ext.Msg.show({
							title : '提示',
							msg : '数据保存失败！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
				});
		        }
		    })		
		}else {
			bdgPayMgm.addOrUpdateBdgPayApp(obj, function(flag) {
				if ("0" == flag) {
					reloadTreeMoney(form);
					if (isFlwTask == true) {
						Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功保存了一条概算信息！　　　<br>可以发送流程到下一步操作！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
						   		}
						   }
						});
						parent.IS_FINISHED_TASK = true;
					} else {
						Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
					}
				} else {
					Ext.Msg.show({
						title : '提示',
						msg : '数据保存失败！',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		
		}
	
	}
	function reloadTreeMoney(form){
		var nodeRecord=tmpNodeRecord;
		//实际付款
		var oldFactMoneyStr =nodeRecord.data.factpay+"";
		var oldFactMoney = oldFactMoneyStr.replace(/,/g,'')*1
		var newFactMoney = form.findField("factpay").getValue() *1
		var differFactMoney= newFactMoney*1 - oldFactMoney*1
		
		//申请付款
		var oldApplyPayStr=nodeRecord.data.applypay+"";
		var oldApplyPayMoney=oldApplyPayStr.replace(/,/g,'')*1
		var newApplyPayMoney = form.findField("applypay").getValue() *1
		var differApplyPayMoney=newApplyPayMoney*1 - oldApplyPayMoney*1
		var bdgidsArr=new Array();
		 bdgidsArr.push(nodeRecord.data.bdgid);
   		var parent = store.getNodeParent(nodeRecord);
   		while(parent){						           			
       		var bdgid=parent.data.bdgid;
       		bdgidsArr.push(bdgid);
	  		parent = store.getNodeParent(parent);
   		}	
   		/*		合同付款分摊不变更预计未签订金额
		    DWREngine.setAsync(false);
	 		   	//更新预计未签订金额
       		bdgInfoMgm.updaterRemainingMoney(bdgidsArr,differApplyPayMoney*1);
       		DWREngine.setAsync(true);
       	*/
       		store.load();
	}
	
