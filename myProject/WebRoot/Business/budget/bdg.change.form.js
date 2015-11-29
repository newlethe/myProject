var beanName = "com.sgepit.pmis.budget.hbm.BdgChangApp";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var beanNameMoney = "com.sgepit.pmis.budget.hbm.VBdgConApp";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
var store=null;
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {					// 创建编辑域配置
    	'caid': {
			name: 'caid',
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
         }, 'cano': {
			name: 'cano',
			fieldLabel: '变更单号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'camoney': {
			name: 'camoney',
			fieldLabel: '变更分摊金额',
			anchor:'95%'
         }, 'bdgno': {
			name: 'bdgno',
			fieldLabel: '概算编码',
			readOnly:true,
			anchor:'95%'
         }, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			readOnly:true,
			anchor:'95%'
         }, 'conappmoney': {
			name: 'conappmoney',
			fieldLabel: '本合同分摊总金额',
			readOnly:true,
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
    	{name: 'caid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'conid', type: 'float'},
		{name: 'camoney', type: 'float'},
		{name: 'cano', type: 'string'},
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
        labelWidth:80,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 200,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '变更概算修改页',
            	layout: 'form',
            	border: true,
            	items: [
            		new fm.TextField(fc['bdgname']),
            		new fm.TextField(fc['bdgno']),
            		new fm.NumberField(fc['conappmoney']),
		            new fm.NumberField(fc['camoney']),
		            
		            new fm.TextField(fc['cano']),
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['isleaf']),
		    new fm.TextField(fc['parent']),
            new fm.TextField(fc['conid']),
			new fm.TextField(fc['pid']),
			new fm.TextField(fc['caid']),
			new fm.TextField(fc['bdgid'])
    	]
    });
    
    // 表单保存方法
    function formSave(){
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
    	//验证分摊
    	var rtnState;
    	DWREngine.setAsync(false)
    	bdgChangeMgm.CheckChaAppIsValid(obj.caid,obj.bdgid,obj.pid,obj.camoney,function(rtn){
    	    rtnState=rtn;
    	})
    	DWREngine.setAsync(true)
    	if(rtnState=="1"){
    	   Ext.Msg.confirm('提示信息',"分摊到所有项目的变更金额超出本次变更总金额,是否确定分摊?",function(r){
    	       if(r=='yes'){
   		           bdgChangeMgm.addOrUpdateBdgChangeApp(obj, function(flag){
   			            if ("0" == flag){
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
				            DWREngine.setAsync(false);
					    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
					    	})
					    	DWREngine.setAsync(true);
   			          }else{
   				          Ext.Msg.show({
					          title: '提示',
					          msg: '数据保存失败！',
					          buttons: Ext.Msg.OK,
					          icon: Ext.MessageBox.ERROR
				          });
   			          }
   		            });    	        
    	       }
    	   })
    	}else if(rtnState=="2"){
    	   Ext.Msg.confirm('提示信息',"概算项目累计分摊金额超过批准概算金额,是否确定分摊?",function(r){
    	       if(r=='yes'){
   		           bdgChangeMgm.addOrUpdateBdgChangeApp(obj, function(flag){
   			            if ("0" == flag){
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
				            DWREngine.setAsync(false);
					    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
					    	})
					    	DWREngine.setAsync(true);
   			          }else{
   				          Ext.Msg.show({
					          title: '提示',
					          msg: '数据保存失败！',
					          buttons: Ext.Msg.OK,
					          icon: Ext.MessageBox.ERROR
				          });
   			          }
   		            });    	        
    	       }
    	   })    	    
    	}else{
           bdgChangeMgm.addOrUpdateBdgChangeApp(obj, function(flag){
	            if ("0" == flag){
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
		             DWREngine.setAsync(false);
			    	bdgInfoMgm.updateBdginfoFlag(getBdgid, "1", function(rtn){
			    	})
			    	DWREngine.setAsync(true);
	          }else{
		          Ext.Msg.show({
			          title: '提示',
			          msg: '数据保存失败！',
			          buttons: Ext.Msg.OK,
			          icon: Ext.MessageBox.ERROR
		          });
	          }
            });     	
    	}
    }
	function reloadTreeMoney(form){
		 var nodeRecord=tmpNodeRecord;
         var oldFactMoneyStr =nodeRecord.data.camoney+"";
         var oldFactMoney = oldFactMoneyStr.replace(/,/g,'')*1
         var newFactMoney = form.findField("camoney").getValue() *1
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
       		store.load();
	}
