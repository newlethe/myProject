
var beanName = "com.sgepit.pmis.budget.hbm.VBdgConApp";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
var store=null;
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	'appid': {
			name: 'appid',
			fieldLabel: '合同金额概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'conid': {
			name: 'conid',
			fieldLabel: '内部流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgno': {
			name: 'bdgno',
			fieldLabel: '概算编码',
			readOnly: true,
			anchor:'95%'
         }, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			readOnly: true,
			anchor:'95%'
         }, 'conbidbdgmoney': {
			name: 'conbidbdgmoney',
			fieldLabel: '本合同招标对应概算金额',
			readOnly: true,
			anchor:'95%'
         }, 'realmoney': {//realmoney
			name: 'realmoney',
			fieldLabel: '本合同签订分摊金额',
			anchor:'95%'
         }, 'conappmoney': {
			name: 'conappmoney',
			fieldLabel: '本合同分摊总金额',
			readOnly: true,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			width : 180,
			height : 100,
			anchor:'95%'
         }, 'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'parent': {
			name: 'parent',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'appid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'conid', type: 'float'},
		{name: 'realmoney', type: 'float'},
		{name: 'remark', type: 'string'},
		{name: 'conappmoney', type: 'float'},
		{name: 'bdgno', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'isleaf', type: 'float'},
		{name: 'parent', type: 'string'}
	];
	
    // 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
           text: '保存',
           iconCls: 'save',
           handler: formSave
	})

    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 300,
        labelWidth: 70, 
        height: 200,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        minSize: 200,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '合同金额概算修改页',
            	layout: 'form',
            	border: true,
            	autoHeight:true,
            	items: [
            		new fm.TextField(fc['bdgname']),
            		new fm.TextField(fc['bdgno']),
            		new fm.NumberField(fc['conbidbdgmoney']),//本合同招标对应概算金额
            		new fm.NumberField(fc['conappmoney']),
		            new fm.NumberField(fc['realmoney']),
					new fm.TextArea(fc['remark']),
					
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['pid']),
			new fm.TextField(fc['appid']),
    		new fm.TextField(fc['conid']),
			new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parent']),
			new fm.TextField(fc['bdgid'])
    	]
    });
    
	// 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true); 
    	var form = formPanel.getForm();
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true,tmpLeaf)
	    	} else {
	    		doFormSave(false,tmpLeaf)
	    	}
	    }
    }
    
    
    function doFormSave(isNew,leaf){
    	var form = formPanel.getForm();
    	var getBdgid = form.findField('bdgid').getValue();
        var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	if (!obj['realmoney']){
    		obj['realmoney'] = 0;
    	}
    	var rtnState;
    	var validState;
    	DWREngine.setAsync(false);
    	bdgMoneyMgm.checkBdgMonAppNotModify(obj.conid,obj.bdgid,obj.pid,function(rtn){
    	    validState=rtn;
    	})
    	if(validState=='3'){
    	    Ext.Msg.alert('提示信息','已结算或已终止的合同不能进行合同概算分摊修改!');
    	    return ;
    	}
    	if(validState=='4'){
    	    Ext.Msg.alert('提示信息','已付款分摊的项目不允许进行分摊项目的修改!');
    	    return ;
    	}
    	if(validState=='5'){
    	    Ext.Msg.alert('提示信息','已变更分摊的项目不允许进行分摊项目修改!');
    	    return ;
    	}
    	bdgMoneyMgm.checkBdgMonAppValueByConId(obj.conid,obj.realmoney,obj.pid,obj.bdgid,function(rtn){
    	    rtnState=rtn;
    	})
    	if(rtnState=='1'){
    	    Ext.Msg.confirm('确定信息',"合同分摊到概算上的各分摊金额超出合同签订金额,确定进行分摊？",function (r){
    	        if(r=='yes'){
    	 					DWREngine.setAsync(false);
        					bdgMoneyMgm.getBdgMoneyAppNew(obj,function(appid){
        					obj['appid']=appid;
        					});
         					DWREngine.setAsync(false);    	        	
    	               		bdgMoneyMgm.addOrUpdateBdgMoneyApp(obj, function(flag){
   			           		if ("0" == flag){
								reloadTreeMoney(form);
				           		saveBtn.setDisabled(false); 
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
				           		DWREngine.setAsync(false);
						    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
						    	})
						    	DWREngine.setAsync(true);
   			           		}else{
   				           		treePanelNew.getEl().unmask();
   				           		Ext.Msg.show({
					           		title: '提示',
					           		msg: '数据保存失败！',
					           		buttons: Ext.Msg.OK,
					           		icon: Ext.MessageBox.ERROR
				           		});
				           		saveBtn.setDisabled(false); 
   			           		}
   		           		});
    	        }
    	    })
    	}else 
    	if(rtnState=='2'){
    	    Ext.Msg.confirm('确定信息',"该项目累积分摊超出批准概算金额,确定进行分摊？",function (r){
    	        if(r=='yes'){
     	 					DWREngine.setAsync(false);
       						 bdgMoneyMgm.getBdgMoneyAppNew(obj,function(appid){
        					obj['appid']=appid;
        					});
       					   DWREngine.setAsync(false);   	        	
    	               		bdgMoneyMgm.addOrUpdateBdgMoneyApp(obj, function(flag){
   			           		if ("0" == flag){
								reloadTreeMoney(form);
				           		saveBtn.setDisabled(false); 
				           		if (isFlwTask   == true) {
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
				                DWREngine.setAsync(false);
						    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
						    	})
						    	DWREngine.setAsync(true);
   			           		}else{
   				           		treePanelNew.getEl().unmask();
   				           		Ext.Msg.show({
					           		title: '提示',
					           		msg: '数据保存失败！',
					           		buttons: Ext.Msg.OK,
					           		icon: Ext.MessageBox.ERROR
				           		});
				           		saveBtn.setDisabled(false); 
   			           		}
   		           		});    	        
    	        }
    	    })
    	}else {
    	 DWREngine.setAsync(false);
        bdgMoneyMgm.getBdgMoneyAppNew(obj,function(appid){
        	obj['appid']=appid;
        });
         DWREngine.setAsync(false);
   		bdgMoneyMgm.addOrUpdateBdgMoneyApp(obj, function(flag){
   			if ("0" == flag){
				reloadTreeMoney(form);
				saveBtn.setDisabled(false); 
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
				DWREngine.setAsync(false);
		    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
		    	})
		    	DWREngine.setAsync(true);
   			}else{
   				treePanelNew.getEl().unmask();
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
				saveBtn.setDisabled(false); 
   			}
   		});
    	} 
    	DWREngine.setAsync(true);
    }
   
	function reloadTreeMoney(form){
   		var nodeRecord=tmpNodeRecord;
   		//本合同签订
   		var oldFactMoneyStr = nodeRecord.data.initappmoney+"";
   		oldFactMoneyStr = oldFactMoneyStr.replace(new RegExp(",",'gm'), "")
   		var oldFactMoney = oldFactMoneyStr.replace("￥","")*1
   		var newFactMoney = form.findField("realmoney").getValue() *1
   		var differ = newFactMoney*1 - oldFactMoney*1	
   		var bdgidsArr=new Array();
   		 bdgidsArr.push(nodeRecord.data.bdgid);
   		var parent = store.getNodeParent(nodeRecord);
   		while(parent){						           			
       		var bdgid=parent.data.bdgid;
       		bdgidsArr.push(bdgid);
	  		parent = store.getNodeParent(parent);
   		}
   		    DWREngine.setAsync(false);
   		 	//更新预计未签订金额
       		bdgInfoMgm.updaterRemainingMoney(bdgidsArr,differ*1);
       		DWREngine.setAsync(true);
//       	store.load();
       	//不重新加载树，只改变本条数据的record，为了保留展开效果
       	// 合同分摊总金额
		var oldConbdgappmoney = nodeRecord.get('conbdgappmoney') * 1;
       	// 本合同分摊总金额
		var oldConappmoney = nodeRecord.get('conappmoney') * 1;
       	nodeRecord.set('conbdgappmoney', oldConbdgappmoney + differ);
       	nodeRecord.set('conappmoney', oldConappmoney + differ);
       	nodeRecord.set('initappmoney', newFactMoney);
       	nodeRecord.commit();
	}