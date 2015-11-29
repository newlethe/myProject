/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量


var bean = "com.sgepit.pmis.contract.hbm.ConCha";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "chaid";
var orderColumn = "chadate";
var gridPanelTitle = "合同：" + selectedConName + " 编号：" + selectedConNo + "，所有变更记录";
var formPanelTitle = "编辑记录（查看详细信息）";
var SPLITB = "`";
var pid = CURRENTAPPID;
var propertyName = "conid";
var propertyValue = selectedConId;
var changeTypes = new Array();
var billTypes = new Array();
var flowWindow;
var whereStr =propertyName+"='"+propertyValue+"'";
var outFilter ="1=1";
if(UIDS!=""){
	var len=UIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" chaid in ("+str+")";
}

//是否禁用新增/修改/删除按钮
var btnDisabled =dyView=='true'?true:(ModuleLVL != '1');

Ext.onReady(function (){

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			//history.back();
			var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
			window.location.href = url + "isBack=1&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView+dyView+"&page="+page;
		}
	});
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('合同变更类型',function(list){		//付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
	appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });
    DWREngine.setAsync(true);

    var changeTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : changeTypes
    });
    
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
    
    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更编号',
			anchor:'95%'
         },'actionman': {
			name: 'actionman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额*',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期*',
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型*',
			displayField: 'v',
			valueField: 'k',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: changeTypeStore,
			lazyRender: true,
			listClass: 'x-combo-list-small',
			allowBlank: false,
			anchor:'95%'
         },'chareason': {
			name: 'chareason',
			fieldLabel: '变更原因*',
			height: 130,
			width: 490,
			allowBlank: false,
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 175,
			width: 490,
			anchor:'95%'
         }, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件编号',
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '变更内容',
			//readOnly:true,
			hideLabel:true,
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         }
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    //	sm,						//第0列，checkbox,行选择器
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           width: 120
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'chaid',
           header: fc['chaid'].fieldLabel,
           dataIndex: fc['chaid'].name,
           hidden: true,
           width: 120
        },{
           id:'chano',
           header: fc['chano'].fieldLabel,
           dataIndex: fc['chano'].name,
           width: 120,
           align : 'center',
       		renderer: renderchano
        },{
           id:'chamoney',
           header: fc['chamoney'].fieldLabel,
           dataIndex: fc['chamoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoneyToPrec
        },{
           id:'chadate',
           header: fc['chadate'].fieldLabel,
           dataIndex: fc['chadate'].name,
           width: 90,
           align : 'center',
           renderer: formatDate
        },{
           id:'chatype',
           header: fc['chatype'].fieldLabel,
           dataIndex: fc['chatype'].name,
           width: 120,
           align : 'center',
           renderer: changeTypesRender
        },{
           id:'actionman',
           header: fc['actionman'].fieldLabel,
           dataIndex: fc['actionman'].name,
           align : 'center',
           width: 120,
           renderer: function(data){
						DWREngine.setAsync(false);
		                var data1;
						baseMgm.getData("select useraccount,realname from rock_user where userid='"+data+"'",function(list){
						    for(var i = 0;i<list.length;i++){
		                        data1 = list[i][1];
		                        return data1;
						    }
						})
		                return data1;
						DWREngine.setAsync(true);
		            }
	  },{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,
           align : 'center',
           renderer: billTypeRender
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           hidden: true,
           width: 120
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'chaid', type: 'string'},
		{name: 'chano', type: 'string'},
		{name: 'chamoney', type: 'float'},
		{name: 'chatype', type: 'string'},
		{name: 'chadate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'actionman', type: 'string'},
		{name: 'billstate', type: 'float'},
		{name: 'remark', type: 'string'}
	];
	var Fields = Columns.concat([
		{name: 'chareason', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'filelsh', type: 'string'}
	]);
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantFields = Ext.data.Record.create(Fields);

    var PlantInt = {pid: pid, 
    				conid: selectedConId, 
    				chano: '', 
    				chamoney: 0,
    				chatype: '', 
    				chadate: '',
    				actionman: '' }	//设置初始值

    Ext.applyIf(PlantFieldsInt, PlantInt);
	var PlantFieldsInt = Ext.apply(PlantFields, {chareason: '', remark: '', filelsh: ''});
	
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: whereStr,
	    	outFilter : outFilter
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
		iconCls: 'title'
	})
    // 5. 创建可编辑的grid: grid-panel
	var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: [titleBar],
	    //title: null,gridPanelTitle,
	    //iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: [
	        {id: 'cha-apply', text: '<font color=purple>申请中变更</font>', pressed: true, handler: doChangeFilter},'-',
	    	{id: 'cha-process', text: '<font color=green>处理中变更</font>', pressed: true, handler: doChangeFilter},'-',
	    	{id: 'cha-finish', text: '<font color=red>已处理变更</font>', pressed: true, handler: doChangeFilter},'-',
	    	{id: 'cha-all', text: '<font color=blue>本合同所有变更</font>', pressed: true, handler: doChangeFilter},'->',
	    	'<font color=green>处理中变更累计：</font>',{xtype: 'textfield', id: 'processTotal', readOnly: true, cls: 'shawsar'},'-',
	    	'<font color=red>已处理变更累计：</font>',{xtype: 'textfield', id: 'finishTotal', readOnly: true, cls: 'shawsar'}
	    ]
	});
	
	function toHandler(){
		var state = this.id;
		var menu_chaid = this.value;
		var _chano = this.chano;
		var url = BASE_PATH+"Business/contract/cont.change.addorupd.jsp?";
		if ("" != state){
			Ext.get('loading').show();
			Ext.get('loading-mask').show();
		    if ("menu_view" == state){
		    	window.location.href = BASE_PATH+"Business/contract/cont.change.view.jsp?conid="+selectedConId+"&chaid="+menu_chaid+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
			} else if ("menu_add" == state){
				window.location.href = url + "conid="+selectedConId+"&modid="+MODID;
			} else if ("menu_edit" == state){
				window.location.href = url + "conid="+selectedConId+"&chaid="+menu_chaid+"&modid="+MODID;
			} else if ("menu_del" == state){
				Ext.get('loading').hide();
				Ext.get('loading-mask').hide();
				flwInstanceMgm.isFlwData('chano', _chano, function(flag){
					if (!flag){
						Ext.Msg.show({
							title: '提示',
							msg: '是否确认删除?　　　　',
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(value){
								if ("yes" == value){
									Ext.get('loading-mask').show();
									Ext.get('loading').show();
									conchaMgm.delConcha(menu_chaid,MODID, function(flag){
										Ext.get('loading-mask').hide();
										Ext.get('loading').hide();
										if ("0" == flag){
											Ext.example.msg('删除成功！', '您成功删除了一条合同变更信息！');
											reload();
										}else if ("1" == flag){
											Ext.Msg.show({
												title: '提示',
												msg: '数据删除失败！',
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
											});
										}else{
											Ext.Msg.show({
												title: '提示',
												msg:flag,
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
											})
										};
						    		});
								}
							}
						});
					} else {
						Ext.example.msg('提示', '流程中的数据不能删除！');
					}
				});
			} else if ("menu_flow" == state){
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				baseDao.findByWhere5("com.sgepit.frame.flow.hbm.FlwFaceParamsIns", "paramvalues like '%chano:"+_chano+"%'",null,null,null, function(list){
					if (list.length > 0){
						showFlow(list[0].insid);
					} else {
						Ext.example.msg('提示', '该条变更记录没有走流程！');
					}
				});
			} else { return; }
		}
	}

	// 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
        	grid, {
        		id: 'form-remark',
				xtype: 'form', region: 'south', title: '变更内容',
				border: false, height: 165,
				bodyStyle: 'padding: 5px 5px;', layout: 'fit',
				items: [
					{xtype: 'textarea', id: 'cha-remark', hideLabel: true, readOnly: true, height: 130}
				]
        	}
        ],
        listeners: {
        	afterlayout: loadChangeTotal
        }
    });
    
    var btnAdd = new Ext.Button({
		id: 'menu_add',
		text: '新增',
		iconCls: 'add',
		handler : toHandler,
		disabled : btnDisabled
	});
	
	var btnEdit = new Ext.Button({
		id: 'edit',
		text: '修改',
		tooltip: '修改',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			if (sm.getSelected()){
				var url = BASE_PATH+"Business/contract/cont.change.addorupd.jsp?";
				window.location.href = url + "conid="+selectedConId+"&chaid="+sm.getSelected().get('chaid')+"&modid="+MODID;
			} else {
				Ext.example.msg('提示', '请先选择数据！');
			}
		}
	});
	
	grid.getTopToolbar().add('->')
	grid.getTopToolbar().add(btnAdd);
	grid.getTopToolbar().add('-')
	grid.getTopToolbar().add(btnEdit);
	grid.getTopToolbar().add('-')
	grid.getTopToolbar().add(btnReturn);
	
	// 11. 事件绑定
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("chaid");
		var chano = record.get("chano");

	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
                    	id: 'menu_edit',
		                text: '　修改',
		                value: data,
		                iconCls: 'btn',
		                disabled :btnDisabled,
		                handler : toHandler
                    },
                    {
	        			id: 'menu_del',
		                text: '　删除',
		                value: data,
		                chano: chano,
		                disabled :btnDisabled,
		                iconCls: 'multiplication',
		                handler : toHandler
                    },
                     '-', {
                   		 id: 'menu_view',
		                text: '　查看',
		                value: data,
		                iconCls: 'form',
		                handler : toHandler
                	}, {
                   		id: 'menu_flow',
		                text: '　流程信息',
		                value: data,
		                chano: chano,
		                iconCls: 'flow',
		                handler : toHandler
                	}]
	    });
	
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}
	
	sm.on('selectionchange', function(sm){
    	var record = sm.getSelected()
   		if (record!=null) {
   			Ext.getCmp('form-remark').setTitle('变更内容 - '+record.get('chano'));
   			Ext.getCmp('cha-remark').setValue(record.get('remark'));
   			if ( ! btnDisabled ){
   			btnEdit.setDisabled(false);
   			}
   			
   		}
    });

    // 12. 加载数据
	reload();
    function reload(){
		ds.load();
	}
  
     function renderchano(value, metadata, record){
		var getChaid = record.get('chaid');
		var conId = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.change.view.jsp?conid='+conId+'&chaid='+getChaid+'&uids='+UIDS+'&optype='+OPTYPE+'&conids='+CONIDS+'&dyView='+dyView+'\'">'+ value+'</span>'
		return output;
	}
  
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
	function renderConno(value){
		var output = '<div id="toLink" style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';">'+ value+'</div>'
		return output;
	}
    function insertFun(){
        grid.defaultInsertHandler();
    };
    
    function loadForm(){
		if(!formDialogWin) return;
    	var form = formPanel.getForm()
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    				form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanel.buttons[0].enable()
    			formPanel.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		formPanel.buttons[0].enable()
			    		formPanel.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		//form.reset()
    		formPanel.buttons[0].disable()
    	}    
    }
    
    function formSave(){
    	var form = formPanel.getForm()
    	var ids = form.findField(primaryKey).getValue()
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)
	    	} else {
	    		doFormSave(false)
	    	}
	    }
    }
    
    function doFormSave(isNew, dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Fields.length; i++) {
    		var n = Fields[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	var dataArr = '[' + Ext.encode(obj) + ']';
   		var r = sm.getSelected()
   		form.updateRecord(r);
		if (isNew)
		{
   			//r.commit();
			grid.doSave(dataArr, 1, 1, function(flag, n){
				r.isNew = !flag
				formPanel.isNew = !flag
			});
   		}
   		else
   		{
			grid.doSave(dataArr, 1, 0);
		}
    }
    
    // 下拉列表中 k v 的mapping 
   	function changeTypesRender(value){	//变更类型
   		var str = '';
   		for(var i=0; i<changeTypes.length; i++) {
   			if (changeTypes[i][0] == value) {
   				str = changeTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	function billTypeRender(value){	//单据状态类型
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function doChangeFilter(){
   		var _type = this.id;
   		if ('cha-apply' == _type){
			ds.baseParams.params = propertyName+"='"+propertyValue+"' and billstate =0";
		}else if ('cha-process' == _type){
			ds.baseParams.params = propertyName+"='"+propertyValue+"' and billstate=-1";
		} else if ('cha-finish' == _type){
			ds.baseParams.params = propertyName+"='"+propertyValue+"' and billstate=1";
		} else if ('cha-all' == _type){
			ds.baseParams.params = propertyName+"='"+propertyValue+"'";
		}
		ds.load();
   	}
   	
   	function loadChangeTotal(){
		var _value_process = 0, _value_finish = 0, _value_all = 0;
		baseDao.findByWhere5(bean, "conid='"+selectedConId+"'", null,null,null,function(list){
			if (list){
				for (var i=0; i<list.length; i++){
					if (1 == list[i].billstate){
						_value_finish += list[i].chamoney;
					} else if (-1== list[i].billstate){
						_value_process += list[i].chamoney;
					}
				}
			}
			Ext.getCmp('finishTotal').setValue(cnMoneyToPrec(_value_finish));
			Ext.getCmp('processTotal').setValue(cnMoneyToPrec(_value_process));
		});
	}
	
	function showFlow(_insid){
		if(!flowWindow){
			flowWindow = new Ext.Window({	               
				title: ' 流程信息',
				iconCls: 'form',
				width: 900,
				height: 500,
				modal: true,
				closeAction: 'hide',
				maximizable: false,
				resizable: false,
				plain: true,
				autoLoad: {
					url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
					params: 'type=flwInfo&insid='+_insid,
					text: 'Loading...'
				}
			});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid='+_insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}
	
});




