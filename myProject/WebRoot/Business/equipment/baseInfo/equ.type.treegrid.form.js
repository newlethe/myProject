var formPanelTitle = "编辑记录（查看详细信息）";
var jzhType = new Array();
var newrootText="所有设备合同";
DWREngine.setAsync(false); 
appMgm.getCodeValue('机组号',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			jzhType.push(temp);			
		}
    }); 
DWREngine.setAsync(true);
	
	var newroot = new Ext.tree.AsyncTreeNode({
        text: newrootText,
        iconCls: 'form',
        id : "0"        
    })
	var newtreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	var newtreePanel = new Ext.tree.ColumnTree({//用于构造下拉设备合同分类树
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
//        width: 200,
//        minSize: 200,
//        maxSize: 400,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ newroot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ newroot.collapse(true); }
        }],
		columns:[{
            header: '设备合同分类树名称',
            width: 180,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: newtreeLoader,
        root: newroot
	});

	newtreePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid=node.attributes.conid;
		if (treeid == null){//如果不是树自身节点的加载，则加载以当前设备合同为根节点的树
			treeid = queryParent;
			conid=conId;
		}
		newtreePanel.loader.baseParams.parent = treeid+SPLITB+treeIdIf;
		newtreePanel.loader.baseParams.conid = conid;
	})
    newtreePanel.expand();
    if(newroot.firstChild){
    	newroot.expand(false,true,function(){newroot.firstChild.expand()});//自动展开第一次子节点	
    }
var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});//

    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    }); 
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'uuid': {
         	id : 'uuid',
			name: 'uuid',
			fieldLabel: '设备合同树主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'treeid': {
            id : 'treeid',
			name: 'treeid',
			fieldLabel: '系统编码',
			allowBlank: false,
			anchor:'95%'
         },'ptreename' :{
            id:'ptreename',
            name: 'ptreename',
            fieldLabel: '上级设备分类名称',
			mode : 'local',
			editable:false,
			allowBlank: false,
			readOnly:true,
            listWidth: 200,
            lazyRender:true,
            maxHeight: 200,
            triggerAction: 'all',
            store: dsindexid,
			tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'
         },'ptreeid' :{
            id :'ptreeid',
            name :'ptreeid',
            fieldLabel: '上级设备分类编码',
            readOnly:true,
			editable:false,
            anchor : '95%'
         },'treename': {
            id : 'treename',
			name: 'treename',
			fieldLabel: '设备分类名称',
			allowBlank: false,
			anchor:'95%'
         }, 'conid': {
            id : 'conid',
			name: 'conid',
			fieldLabel: '合同主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'memo': {
			name: 'memo',
			fieldLabel: '备注',
			hidden:true,
			hideLabel:true,
            allowBlank: true,
			anchor:'95%'
         }, 'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'parentid': {
			name: 'parentid',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'jzid':{
            id : 'jzid',
            name : 'jzid',
            fieldLabel: '机组号',
            allowBlank: true,
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsJzh,
            lazyRender:true,
            readOnly : true,
            listClass: 'x-combo-list-small',
			anchor:'95%'           
         }
    }
    
    // 3. 定义记录集
    var Columns = [
		{name: 'pid', type: 'string'},
		{name: 'uuid', type: 'string'},
		{name: 'treeid', type: 'string'},
		{name: 'treename', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'memo', type: 'string'},
		{name: 'jzid', type: 'string'},
		{name: 'isleaf', type: 'float'},
		{name: 'parentid', type: 'string'},
		{name: 'ptreeid', type: 'string'},
		{name: 'ptreename', type: 'string'}
	];

	// 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
           text: '保存',
           iconCls: 'save',
           handler: formSave
	})
	var comboxWithTree = new fm.ComboBox(fc['ptreename']);
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 300,
        height: 200,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        minSize: 300,
        maxSize: 300,
        border: false,
        region: 'east',
        //bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '设备合同分类树编辑页',
            	layout: 'form',
                width : 350,
            	border: true,
            	items: [
                    comboxWithTree,
                    new fm.TextField(fc['ptreeid']),         	
		            new fm.TextField(fc['treeid']),
		            new fm.TextField(fc['treename']),
		            new fm.ComboBox(fc['jzid']),
		            saveBtn
    			]
    		}),
    		new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parentid']),
			new fm.TextField(fc['conid']),
	        new fm.TextField(fc['memo']),
			new fm.TextField(fc['pid']),
			new fm.TextField(fc['uuid'])
    	]
    });
    
	
	comboxWithTree.on('beforequery', function(){
		if("menu_update" == state){//只有修改节点时才渲染下拉树
		  newtreePanel.render('tree');
		  newtreePanel.getRootNode().reload();//刷新下拉设备合同分类树
		}else{
			return false;
		}
	});

	
	newtreePanel.on('click', function(node){
		if ("" != node.attributes.treename){
			var nodename=node.attributes.treename;sbTreeRender
			comboxWithTree.setValue(sbTreeRender(nodename));
			formPanel.getForm().findField('ptreeid').setValue(node.attributes.treeid);
			formPanel.getForm().findField('parentid').setValue(node.attributes.treeid);
			comboxWithTree.collapse();
		}
	});
    // 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true);   
    	var form = formPanel.getForm();
    	var getTreeName = form.findField('treename').getValue();
    	var getTreeId = form.findField('treeid').getValue();
    	if(getTreeId.toString() == null  || getTreeId.toString() == ""){
             Ext.Msg.alert("提示信息","系统编码不能为空，请输入系统编码！");
             saveBtn.setDisabled(false);
        }else{
        	if(getTreeName.toString() == null  || getTreeName.toString() == ""){
	             Ext.Msg.alert("提示信息","设备分类名称不能为空，请输入设备分类名称！");
	             saveBtn.setDisabled(false);  
        	}
        }
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true,tmpLeaf)  //修改
	    	} else {
	    		doFormSave(false,tmpLeaf)//新增
	    	}
	    }
    }
    //将设备合同分类树的主属性名称转化为属性代码值
    function sbTreeToName(value){
   		var str = value;
   		for(var i=0; i<sbTreeType.length; i++) {
   			if (sbTreeType[i][1] == value) {
   				str = sbTreeType[i][0]
   				break; 
   			}
   		}
   		return str;
   }
   //重新加载设备合同分类树treepanel
   function reloadTree(){
    	var selNode = treePanel.getSelectionModel().getSelectedNode();
		if(selNode!=null){
			var path = selNode.getPath();
			treePanel.getNodeById(rootId).reload();	
			treePanel.expandPath(path,null,function(){
				var parentid=selNode.attributes.parentid;
				if (parentid == '01' || parentid == '02' || parentid == '03'
							|| parentid == '04') {
						addBtn.enable();
						editBtn.disable();
						delBtn.disable();
					} else if (parentid == '0') {
						addBtn.disable();
						editBtn.disable();
						delBtn.disable();
					} else {
						addBtn.enable();
						editBtn.enable();
						delBtn.enable();
					}
				if(treePanel.getNodeById(selNode.id)!=null){
				 treePanel.getNodeById(selNode.id).select();
				}else{
					treePanel.getNodeById(selNode.attributes.conid+'-'+parentid).select();
				}
			})
		}
    }
    function doFormSave(isNew,leaf){
    	var form = formPanel.getForm();
    	var obj = new Object();
        var isleaf    =  form.findField('isleaf').getValue(); 
        var _treename=form.findField("treename").getValue()
        form.findField("treename").setValue(sbTreeToName(_treename))
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		
    		if (field) obj[name] = field.getValue();
    	}
   		equBaseInfo.addOrUpdate(obj,oldParentId, function(flag){
   			if ("0" == flag){
   				formPanel.collapse();
                //store.load();
				selectCrrentTreeNode();//定位到上次选择的节点处
                Ext.example.msg('保存成功！', '您成功保存了一条信息！');
                reloadTree();
   			}else if("2"==flag){
   			        Ext.Msg.show({
					title: '提示',
					msg: '该设备合同分类编码已存在！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
					});
                    saveBtn.setDisabled(false);  
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
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }

    //定位到上次选择的树节点		    
	function selectCrrentTreeNode(){
		prerec = treeGrid.getSelectionModel().getSelected();
		if(prerec)
		   selectedPath = store.getPath(prerec, "treeid");
		store.load();
     }
     
     
       