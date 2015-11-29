var bean="com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostStatistics";
var currentPid=CURRENTAPPID;
var ds,costTreeGrid;
var selectedPath="";
var contentPanle
Ext.onReady(function() {
	var fm = Ext.form; // 包名简写（缩写）
	/*********************************其他费用统计信息   start*************************************/
	var initBtn = new Ext.Button({
		id : 'initCostTree',
		text : '初始化',
		iconCls : 'add',
		handler : onItemClick
	});
	var btnexpendAll = new Ext.Button({
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                               ds.expandAllNode();
                            }
                        }) ;
     var btnexpendClose = new Ext.Button({
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                                ds.collapseAllNode();
                            }
                        }) ;
	ds = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentid',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'getFacompOtherCostStatisticsTree',// 后台java代码的业务逻辑方法定义
					business : 'faCostManageService',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'pid' + SPLITB +  currentPid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["uids", "treeid", "prono", "pid","proname","bdgmoney",
									"investmentFinishMoney","tjmoeny","sbmoney", "ldmoney","cqdtmoney","wxmoney","totalmoney","remark", "parentid","isleaf"]
						}),
				listeners : {
					'beforeload' : function(ds2, options) {
						var parent = null;
						if (options.params[ds2.paramNames.active_node] == null) {
							options.params[ds2.paramNames.active_node] = currentPid+'-01';	
							parent = currentPid+'-01'; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds2.paramNames.active_node];
						}
						ds2.baseParams.params = 'pid' + SPLITB + currentPid
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});
	var fixedColumns=[{
			id:"prono",
            header: '序号',
            width: 150,
            dataIndex: 'prono'
        },{
        	id:"uids",
            header: '主键',	
            width:0,				//隐藏字段
            hidden:true,
            dataIndex: 'uids'
        },{
        	id:"pid",
            header: '项目工程编号',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'pid'
        },{
        	id:"treeid",
            header: '概算主键',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'treeid'
        },{
        	id:"proname",
            header: '项目名称',
            width: 200,
            dataIndex: 'proname'
        },{
        	id:"bdgmoney",
            header: '概算金额',
            width: 120,
            align:"right",
            dataIndex: 'bdgmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"investmentFinishMoney",
            header: '实际金额',
            width: 120,
            align:"right",
            dataIndex: 'investmentFinishMoney',
            renderer: cnMoneyToPrec
        },{
        	id:"tjmoeny",
            header: '固定资产-土建',
            width: 120,
            align:"right",
            dataIndex: 'tjmoeny',
            renderer: cnMoneyToPrec
        },{
        	id:"sbmoney",
            header: '固定资产-设备',
            width: 120,
            align:"right",
            dataIndex: 'sbmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"ldmoney",
            header: '流动资产',
            width: 120,
            align:"right",
            dataIndex: 'ldmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"wxmoney",
            header: '无形资产',
            width: 120,
            align:"right",
            dataIndex: 'wxmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"cqdtmoney",
            header: '长期待摊',
            width: 120,
            align:"right",
            dataIndex: 'cqdtmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"totalmoney",
            header: '合计',
            width: 120,
            align:"right",
            dataIndex: 'totalmoney',
            renderer: cnMoneyToPrec
        },{
        	id:"remark",
            header: '备注',
            width: 150,
            dataIndex: 'remark',
            renderer : function(value, cell, record) {
					var qtip = "qtip=" + value;
					return '<span ' + qtip + '>' + value + '</span>';
				}
        },{
        	id:"isleaf",
            header: '是否子节点',
            width: 0,
            hidden:true,
            dataIndex: 'isleaf'
            
        },{
        	id:"parentid",
            header: '父节点',
            width: 0,
            hidden:true,
            dataIndex: 'parentid',
            cls : 'parentid'
            
        }]
    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	costTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'cost-tree-panel',
				iconCls : 'icon-by-category',
				store : ds,
				sm:sm,
				master_column_id : 'proname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
//				height : document.body.clientHeight * 0.5,
				viewConfig : {
//					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				stripeRows : true,
				title : '', // 设置标题	      
        tbar:['<font color=#15428b><b>&nbsp;其他费用统计信息</b></font>'
        		,'-',btnexpendAll,'-',btnexpendClose,'-',initBtn],
		columns:fixedColumns
	});
	ds.on("load", function(ds1, recs) {
		ds.setRootNodes(currentPid+'-01');
        if(selectedPath && selectedPath!="") {//定位到选中的节点
            ds.expandPath(selectedPath, "treeid");
        } else {
            if (ds1.getCount() > 0) {
                var rec1 = ds1.getAt(0);
                if (!ds1.isExpandedNode(rec1)) {
                    ds1.expandNode(rec1);
                }
            }
        }
    });
        
    
   ds.on('expandnode', function(ds, rc) {
                if (selectedPath && selectedPath != "") {
                    var equidArr = selectedPath.split("/");
                    if (rc.get("treeid") == equidArr.pop()) {
                        costTreeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
                    }
                }
            });
	/*********************************其他费用统计信息   end*************************************/
	/*********************************其他费用统计信息表单   start*************************************/
    var fcSub = {
        'prono':{
        	id:"prono",
            name: 'prono',
            fieldLabel: '序号',
            readOnly:true,
            anchor:'95%'
        },'proname':{
        	id:"proname",
            name: 'proname',
            fieldLabel: '项目名称',
            readOnly:true,
            anchor:'95%'
        },'bdgmoney':{
        	id:"bdgmoney",
            name: 'bdgmoney',
            fieldLabel: '概算金额',
            readOnly:true,
            anchor:'95%'
        },'investmentFinishMoney':{
        	id:"investmentFinishMoney",
            name: 'investmentFinishMoney',
            fieldLabel: '实际金额',
            readOnly:true,
            anchor:'95%'
        },'tjmoeny':{
        	id:"tjmoeny",
            name: 'tjmoeny',
            fieldLabel: '固定资产-土建',
            readOnly:true,
            anchor:'95%'
        },'sbmoney':{
        	id:"sbmoney",
            name: 'sbmoney',
            fieldLabel: '固定资产-设备',
            readOnly:true,
            anchor:'95%'
        },'ldmoney':{
        	id:"ldmoney",
            name: 'ldmoney',
            fieldLabel: '流动资产',
            readOnly:true,
            anchor:'95%'
        },'wxmoney':{
        	id:"wxmoney",
            name: 'wxmoney',
            fieldLabel: '无形资产',
            readOnly:true,
            anchor:'95%'
        },'cqdtmoney':{
        	id:"cqdtmoney",
            name: 'cqdtmoney',
            fieldLabel: '长期待摊',
            readOnly:true,
            anchor:'95%'
        },'totalmoney':{
        	id:"totalmoney",
            name: 'totalmoney',
            fieldLabel: '合计',
            readOnly:true,
            anchor:'95%'
        }, 'remark': {
        	id:"remark",
            name: 'remark',
            fieldLabel: '备注',
            anchor:'95%'
        }
        ,'pid':{id:"masterid",name:'masterid',fieldLabel:'主表主键'}
        ,'treeid':{id:"treeid",name:'treeid',fieldLabel:'合同主键'}
        ,'parentid':{id:"parentid",name:'parentid',fieldLabel:'父节点'}
        ,'isleaf':{id:"isleaf",name:'isleaf',fieldLabel:'叶子节点'}
        ,'uids':{id:"uids",name:'uids',fieldLabel:'主键'}
        
    }
	//创建表单form-panel
    var saveFormBtn = new Ext.Button({
        name: 'save',
       text: '保存',
       iconCls: 'save',
       disabled:true,
       handler: formSave
    })
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
        minSize: 400,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
        iconCls: 'icon-detail-form',    //面板样式
        labelAlign: 'left',
        items: [
            new Ext.form.FieldSet({
                title: '其他费用统计信息',
                layout: 'form',
                width : 300,
                border: true,
                labelWidth : 100,
                items: [
	                new fm.Hidden(fcSub['uids']),
	                new fm.Hidden(fcSub['isleaf']),
	                new fm.Hidden(fcSub['parentid']),
	                new fm.Hidden(fcSub['pid']),
	                new fm.Hidden(fcSub['treeid']),
                    new fm.TextField(fcSub['prono']),
                    new fm.TextField(fcSub['proname']),
                    new fm.NumberField(fcSub['bdgmoney']),
                    new fm.NumberField(fcSub['investmentFinishMoney']),
                    new fm.NumberField(fcSub['tjmoeny']),
                    new fm.NumberField(fcSub['sbmoney']),
                    new fm.NumberField(fcSub['ldmoney']),
                    new fm.NumberField(fcSub['wxmoney']),
                    new fm.NumberField(fcSub['cqdtmoney']),
                    new fm.NumberField(fcSub['totalmoney']),
                    new fm.TextArea(fcSub['remark']),
                    saveFormBtn
                ]
            })
        ]
    });
    sm.on('rowselect', rowClickFunction);
    function rowClickFunction(thisGrid, rowIndex, record) {
        formPanel.getForm().loadRecord(record);
        saveFormBtn.setDisabled(false);
    }
    //右键菜单修改
     costTreeGrid.on('rowcontextmenu', contextmenu, this);
    var treeMenu;
    function contextmenu(thisGrid, rowIndex, e) {
        e.preventDefault();//阻止系统默认的右键菜单
        e.stopEvent();
        thisGrid.getSelectionModel().selectRow(rowIndex);
        var record = thisGrid.getStore().getAt(rowIndex);
        var menuUpdate = {
            id : 'menu_update',
            text : '　修改',
            iconCls : 'btn',
            handler : toHandler
        };
        var items=[menuUpdate];
        treeMenu = new Ext.menu.Menu({
            id : 'treeMenu',
            width : 100,
            items : items
        });
        var coords = e.getXY();
        treeMenu.showAt([coords[0], coords[1]]); 
    }
    function toHandler(node) {
        var rec = costTreeGrid.getSelectionModel().getSelected(); 
        var state = this.id;
        if ("menu_update" == state) {
            formPanel.expand();
            formPanel.getForm().loadRecord(rec);
            saveFormBtn.setDisabled(false);
        }
    }
    // 表单保存方法
    function formSave(){
        saveFormBtn.setDisabled(true);   
        var form = formPanel.getForm();
        if (form.isValid()){
            doFormSave(true)  //修改
        }
    }
    
    function doFormSave(isNew){
        var form = formPanel.getForm();
        var obj = new Object();
        for (var i=0; i<fixedColumns.length; i++){
            var name = fixedColumns[i].id;
            var field = form.findField(name);
            if (field){
            	obj[name] = field.getValue();
            }
        }
        DWREngine.setAsync(false);
	    faCostManageService.updateOtherCostStatistics(obj,function(str){
	        if(str == "1"){
	            Ext.example.msg('保存成功！', '您成功保存了 1条记录。');
	            formPanel.collapse();
	            selectCrrentTreeNode();
	        }
	    });
        DWREngine.setAsync(true);
    }
    
    //定位到上次选择的树节点           
    function selectCrrentTreeNode(){
        var rec = costTreeGrid.getSelectionModel().getSelected();
        selectedPath = ds.getPath(rec, "treeid");
        ds.load();
     }
	/*********************************其他费用统计信息表单   end*************************************/
    contentPanle = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		items : [costTreeGrid,formPanel]
	});
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanle]
			});
});
function onItemClick(item){
	switch(item.id) {
		case 'initCostTree':
			initCostTreeFun();
			break
	}
}
function initFun(){
	DWREngine.setAsync(false);
    faCostManageService.initOtherCostStatisticsTree(currentPid,function(str){
        if(str == "1"){
            Ext.example.msg('初始化成功！', '您成功初始化。');
    		contentPanle.getEl().unmask();
            ds.load();
        }
    });
    DWREngine.setAsync(true);
}
function initCostTreeFun(){
	Ext.MessageBox.confirm('确认', '初始化后会删除当前数据，确认要初始化吗？', function(btn,
					text) {
		if (btn == "yes") {
			var processbar = Ext.MessageBox.show({
					title: '请稍候...',
					msg: '数据初始化中 ...',
					width:240,
					progress:true,
					closable:false
			});
			var t = 0;
			var f = function(){
				t = (t == 100) ? 0 : t+1;
				Ext.MessageBox.updateProgress(t/100, '');
			};
		    var timer = setInterval(f, 30);
			 faCostManageService.initOtherCostStatisticsTree(currentPid,function(str){
		        if(str == "1"){
		            Ext.example.msg('提示', '初始化操作成功！');
		        }
		        window.clearInterval(timer);
				processbar.updateProgress(0, '');
				processbar.hide();
	            ds.load();
		        	
		    });
		}
	}, this);
}