var deptTransWindow,postTransWindow;//部门调动，岗位调动
var searchform,remindPanel;
Ext.onReady(function(){
	remindPanel = new Ext.Panel({
		layout:'border',
		items:[{
			region:'center',
			layout:'border',
			items:[{
				xtype:'staffgrid',
				id:'staffgrid',
				region:'center',
				title:'员工列表'
			},{
				xtype:'transfergrid',
				id:'transfergrid',
				region:'south',
				height:270,
				title:'人员调动记录'
			}]
		},{
			xtype:'orgtree',
			region:'west',
			width:150,
			id:'orgtree',
			collapseMode:'mini',
			listeners:{
				click:function(node, e){
					var staffgrid  =  Ext.getCmp("staffgrid");
					var transfergrid  =  Ext.getCmp("transfergrid");
					if(staffgrid){
						if(node.id==defaultOrgRootId){
							staffgrid.getStore().baseParams.params = "1=1";
							staffgrid.getStore().reload();
						}else{
							staffgrid.getStore().baseParams.params = "posid='"+node.id+"'";
							staffgrid.getStore().reload();
						}
					}
					if(transfergrid){
						if(node.id==defaultOrgRootId){
							transfergrid.getStore().baseParams.params = "1=1";
							transfergrid.getStore().reload();
						}else{
							transfergrid.getStore().baseParams.params = "newdeptid='"+node.id+"'";
							transfergrid.getStore().reload();
						}
					}
				}
			}
		}]
	});
	var viewport = new Ext.Viewport({
        layout:'fit',
        items:[ remindPanel]
    });	
});
//组织结构树
var OrgTree = Ext.extend(Ext.tree.TreePanel ,{
    region:'west',
    split:true,
    width: 196,
    minSize: 175,
    maxSize: 500,
    frame: false,
    margins:'5 5 5 5',
    cmargins:'0 0 0 0',
    rootVisible: true,
    lines:true,
    autoScroll:true,
    collapsible: true,
    animCollapse:true,
    animate: false,
	initComponent: function(){
		var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree&unitType=2`9";
		this.root = new Ext.tree.AsyncTreeNode({
	       text: defaultOrgRootName,
	       id: defaultOrgRootId,
	       expanded:true
	    });
	    this.loader = new Ext.tree.TreeLoader({
			dataUrl: treeNodeUrl + "&parentId=" + defaultOrgRootId + "&treeName=HrManOrgTree",
			requestMethod: "GET"
		});
		this.tbar=[{
	        iconCls: 'icon-expand-all',
			tooltip: '全部展开',
			scope:this,
	        handler: function(){ this.root.expand(true); }
	    }, '-', {
	        iconCls: 'icon-collapse-all',
	        tooltip: '全部折叠',scope:this,
	        handler: function(){ this.root.collapse(true); }
	    }],
		OrgTree.superclass.initComponent.call(this);
	}
});
Ext.reg('orgtree',OrgTree);
//员工列表信息
StaffGrid=Ext.extend(Ext.grid.GridPanel, {
	border: false,
	autoScroll: true,
	loadMask: true,
	showtbar: true,
	showbbar: true,
	sm:null,
	ds:null,
	bbar:null,
	cm:null,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
    initComponent: function(){
    	var chkSel = new Ext.grid.CheckboxSelectionModel({
    		singleSelect:true,
    		listeners:{
    			rowselect : function(selectionModel, rowIndex, record ){
    				var userid = record.get("userid");
    				var transGrid = Ext.getCmp('transfergrid');
    				if(transGrid){
    					transGrid.getStore().baseParams.params = "userid='"+userid+"'";
    					transGrid.getStore().reload();
    				}
    			}
    		}
    	});
    	this.sm=chkSel;
		this.cm = new Ext.grid.ColumnModel([
			chkSel, 
			{
	           header: "ID",       
	           dataIndex: "userid",      
	           hidden:true
	        }, {
	           header: '员工姓名',
	           dataIndex:'realname',
	           width: 80
	        },{
	           header:'员工编号',
	           dataIndex:'usernum',
	           width:120
	        }, {
	           header: '性别',
	           dataIndex: 'sex',
	           width: 40,
	           renderer: function(value){ if (value!="") return value=='0' ? '男':'女';else return value;}
	        },
	        {
	           header: '部门',
	           dataIndex: 'posname',
	           width: 130
	        }, {
	           header: '职务',
	           dataIndex: 'postname',
	           width: 80
	        },
	        {
	           id:'orgname',
	           header: '岗位',
	           dataIndex: 'orgname',
	           width: 120
	        } ,{
	           id:'onthejob',
	           header: '在职',
	           dataIndex: 'onthejob',
	           width: 40,
	           renderer: function(value){if (value!="")return value=='0' ? '离职':'在职';else return value;}
	        }
		]);
		this.cm.defaultSortable = true;
		this.ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',				//表示取列表
		    	bean: "com.sgepit.pmis.rlzj.hbm.VHrManInfo",				
		    	business: "baseMgm",
		    	method: "findWhereOrderBy",
		    	params:"1=1"
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: "userid"
	        }, [
		    	{name: 'userid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
				{name: 'realname', type: 'string'},
				{name:'usernum',type:'string'},
		    	{name: 'sex', type: 'string'},
				{name: 'onthejob', type: 'string'},
				{name:'orgid',type:'string'},//岗位ID
				{name:'orgname',type:'string'},//岗位名称
				{name:'postcode',type:'string'},//职务
				{name:'postname',type:'string'},//职务
				{name: 'posid', type: 'string'},//部门
				{name:'posname',type:'string'}//部门名称
			]),
	        remoteSort: false
	    });
		this.ds.setDefaultSort('userid', 'desc');
		
		var _self = this;
		this.tbar=[{
			text:'部门调动',iconCls:'option',scope:this,
			handler:function(){
				var selectionModel = this.getSelectionModel()
				var red = selectionModel.getSelected();
				
				if(red){
					var posid = red.get('posid');//部门
					var postcode = red.get('postcode');//职务
					var userid = red.get('userid');//职务
					if(!deptTransWindow){ 
						deptTransWindow = new DeptTransferWindow({
									closeAction:'hide',
									modal:true,
									closable :false
							   });
					}
					deptTransWindow.show(posid,postcode,userid);
				}else{
					Ext.example.msg('提示','请先选择需要调动的员工！');				
				}
			}
		},{
			text:'职岗变更',iconCls:'option',scope:this,
			handler:function(){
				var selectionModel = this.getSelectionModel()
				var red = selectionModel.getSelected();
				
				if(red){
					var gwid = red.get('orgid');//岗位ID
					var postcode = red.get('postcode');//职务
					var posid = red.get('posid');//部门ID
					var userid = red.get('userid');//岗位
					if(!postTransWindow){ 
						postTransWindow = new PostTransferWindow({
									closeAction:'hide',
									modal:true,
									closable :false
							   });
					}
					postTransWindow.show(posid,postcode,gwid,userid);
				}else{
					Ext.example.msg('提示','请先选择需要调动的员工！');				
				}
			}
		},{text: '查询', iconCls: 'btn', handler: showSearchWindow},'->',{
			text:'最大化',iconCls:'add',
			handler:function(){
				if(this.text=='最大化'){
					if(top&&top.collapsedWestAndNorth){
						top.collapsedWestAndNorth();
						this.setText('还原');
						this.setIconClass("remove")
					}
				}else{
					if(top&&top.expandWestAndNorth){
						top.expandWestAndNorth();
						this.setText('最大化');
						this.setIconClass("add")
					}
				}
			}
		}];
		this.bbar=new Ext.PagingToolbar({
	        pageSize: 20,
	        store: _self.ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    });
	    this.ds.load({params:{start:0,limit:PAGE_SIZE}});
		StaffGrid.superclass.initComponent.call(this);
    }
});
Ext.reg("staffgrid",StaffGrid);
//人员调动信息
TransferGrid=Ext.extend(Ext.grid.GridPanel, {
	border: false,
	autoScroll: true,
	width:1000,
	sm:null,
	ds:null,
	bbar:null,
	cm:null,
	viewConfig: {
		//forceFit: true,
		ignoreAdd: true
	},
    initComponent: function(){
    	var chkSel = new Ext.grid.CheckboxSelectionModel({});
    	this.sm=chkSel;
		this.cm = new Ext.grid.ColumnModel([
			chkSel, 
			{
	           header: "ID",       
	           dataIndex: "transferid",      
	           hidden:true
	        }, {
	           header: '员工姓名',
	           dataIndex:'realname',
	           width: 80
	        },{
	           header:'员工编号',
	           dataIndex:'usernum',
	           width:100
	        }, {
	           header: '调动日期',
	           dataIndex: 'transferdate',
	           readOnly:true,
	           width: 80,renderer : Ext.util.Format.dateRenderer('Y-m-d')
	        },{
	           header: '调前部门',
	           dataIndex: 'olddeptname',
	           width: 130
	        }, {
	           header: '调后部门',
	           dataIndex: 'newdeptname',
	           width: 110
	        },{
	           header: '调前职务',
	           dataIndex: 'oldproname',
	           width: 70
	        } ,{
	           header: '调后职务',
	           dataIndex: 'newproname',
	           width: 70
	        } ,{
	           header: '调动前岗位',
	           dataIndex: 'oldpostname',
	           width: 70
	        },{
	           header: '调动后岗位',
	           dataIndex: 'newpostname',
	           width: 70
	        },{
	           header: '调动原因',
	           dataIndex: 'reason',
	           width: 180
	        },{
	           header: '经办人',
	           dataIndex: 'handlerusername',
	           width: 80
	        },{
	           header: '备注说明',
	           dataIndex: 'demo',
	           width: 180
	        }
		]);
		this.cm.defaultSortable = true;
		this.ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',				//表示取列表
		    	bean: "com.sgepit.pmis.rlzj.hbm.VHrManTransfer",				
		    	business: "baseMgm",
		    	method: "findWhereOrderBy",
		    	params:"1=1"
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: "transferid"
	        }, [
		    	{name:'transferid', type: 'string'},
				{name:'realname', type: 'string'},
				{name:'usernum',type:'string'},
		    	{name:'transferdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
				{name:'olddeptname', type: 'string'},//旧部门
				{name:'newdeptname',type:'string'},//新部门
				{name:'oldproname',type:'string'},//旧职务
				{name:'newproname',type:'string'},//新职务
				{name:'oldpostname',type:'string'},//旧岗位
				{name:'newpostname', type: 'string'},//新岗位
				{name:'reason',type:'string'},//原因
				{name:'handlerusername',type:'string'},//经办人
				{name:'transfertype',type:'string'},//调动形式
				{name:'pid',type:'string'},//项目标识
				{name:'posttrasnstype',type:'string'},//岗位调动类型
				{name:'demo',type:'string'}
			]),
	        remoteSort: false
	    });
		this.ds.setDefaultSort('transferid', 'desc');
		
		var _self = this;
		var transtypeCombo = new Ext.form.ComboBox({
			width:80,
			valueField: 'k', 
			displayField: 'v',
			readOnly:true,
			triggerAction: 'all',
			mode: 'local', 
			value: '%',
			store:new Ext.data.SimpleStore({
				fields:['k', 'v'],
				data:[['%','全部'],['1','部门调动'],['2','岗位调动']]
			})
		});
		var beginDate = new Ext.form.DateField({
			format:'Y年m月d日',readOnly:true,	value:new Date((new Date()).getYear(),(new Date()).getMonth(),1),width:120
		});
		var endDate = new Ext.form.DateField({
			format:'Y年m月d日',readOnly:true,	value:new Date(),width:120
		});
		var userCk = new Ext.form.Checkbox({
			boxLabel : "关联员工"
		})
		var deptCk = new Ext.form.Checkbox({
			boxLabel : "关联部门"
		})
		
		this.tbar=[deptCk,userCk,"&nbsp;&nbsp;&nbsp;&nbsp;调动类别&nbsp;&nbsp;",transtypeCombo,'&nbsp;&nbsp;从&nbsp;&nbsp;',
					beginDate,'&nbsp;&nbsp;到&nbsp;&nbsp;',endDate
		,{
			text:'查询',
			iconCls:'btn',
			scope:this,
			handler:function(){
				var transtype = transtypeCombo.getValue();
				var beginTime = beginDate.getValue().format('Ymd')
				var endTime   = endDate.getValue().format('Ymd')
				var userid = "%"
				var deptid  = "%"
				try{
					var record  =  Ext.getCmp("staffgrid").getSelectionModel().getSelected();
					if(record&&userCk.getValue()) userid=record.get('userid');
				}catch(e){}
				try{
					var selNode  =  Ext.getCmp("orgtree").getSelectionModel().getSelectedNode();
					if(selNode&&deptCk.getValue()) deptid=selNode.id;
				}catch(e){}
				
				
				this.store.baseParams.params = "transfertype like '"+transtype+"' and to_char(transferdate,'yyyymmdd')>='"+beginTime+"' " +
						"and to_char(transferdate,'yyyymmdd')<='"+endTime+"' and newdeptid like '"+deptid+"' and userid like '"+userid+"'";
				this.store.reload();		
			}
		},'->',{
			text:'显示全部',iconCls:'option',scope:this,
			handler:function(){
				var _store =  this.getStore();
				_store.baseParams.params="1=1";
				_store.reload();
			}
		},{
			text:'删除',iconCls:'option',scope:this,
			handler:function(){
				var selections =  this.getSelectionModel().getSelections();
				var _store =  this.getStore();
				
				if(selections.length>0){
					var ids="";
					for(var i=0;i<selections.length;i++){
						var transferid = selections[i].get('transferid');
						if(i==0) 
							ids+="'"+transferid+"'";
						else	
							ids+=",'"+transferid+"'";
					}
					Ext.Msg.confirm('提示','删除后不可恢复，是否继续?',function(sel){
						if(sel=='yes'){
							var sql = "delete from hr_man_transfer where transferid in ("+ids+")";
							baseDao.updateBySQL(sql,function(rlt){
								_store.reload();
							})
						}
					})
				}
			}
		}];
		this.bbar=new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: _self.ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    });
	    this.ds.load({params:{start:0,limit:PAGE_SIZE}});
		StaffGrid.superclass.initComponent.call(this);
    }
});
Ext.reg("transfergrid",TransferGrid);
//部门调动
DeptTransferWindow=Ext.extend(Ext.Window ,{
	title:"部门调动",
	width:522,
	height:320,
	layout:"fit",
	buttonAlign:'center',
	initComponent: function(){
		this.items=[{
			xtype:"form",
			labelWidth:80,
			labelAlign:"right",
			autoHeight : true,
			bodyStyle:"padding:5px 5px 0",
			items:[{
					xtype:"hidden",
					name:'pid'
				},{
					xtype:"combo",
					fieldLabel:"原部门",
					onTriggerClick:Ext.emptyFn,
					anchor:"90%",
					name:'olddeptid',
					valueField: 'unitid', 
					displayField: 'unitname',
					editable: false,
					allowBlank: false,
					triggerAction: 'all',
					mode: 'local', 
					readOnly:true,
					store:new Ext.data.SimpleStore({
						fields:['unitid', 'unitname']
					}),
					listeners:{
						beforerender :function(combo){
							var _store = combo.store;
							DWREngine.setAsync(false);
							baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit",
												"unit_type_id = '0' order by view_order_num asc",
								function(list){
									var Record = Ext.data.Record.create([
										{name:'unitid'},
										{name:'unitname'}
									]);				
									for(var i=0;i<list.length;i++){
										_store.add(new Record({unitid:list[i].unitid,unitname:list[i].unitname}));
									}
								}
							);
							DWREngine.setAsync(true);
						}
					}
				},{
					xtype:"combo",
					fieldLabel:"新部门",
					anchor:"90%",
					name:'newdeptid',
					valueField: 'unitid', 
					displayField: 'unitname',
					editable: false,
					allowBlank: false,
					mode: 'local', 
					store:new Ext.data.SimpleStore({fields:['unitid', 'unitname']}),
					listeners:{
						beforerender :function(combo){
							var _store = combo.store;
							DWREngine.setAsync(false);
							baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit",
												"unit_type_id = '0' order by view_order_num asc",
								function(list){
									var Record = Ext.data.Record.create([
										{name:'unitid'},
										{name:'unitname'}
									]);				
									for(var i=0;i<list.length;i++){
										_store.add(new Record({unitid:list[i].unitid,unitname:list[i].unitname}));
									}
								}
							);
							DWREngine.setAsync(true);
						}
					}
				},{
					layout:"column",
					bodyStyle: 'border: 0px;',
					items:[{
						layout:"form",
						bodyStyle: 'border: 0px;',
						columnWidth:0.35,
						items:[{
							xtype:"combo",
							triggerAction:"all",
							fieldLabel:"原职务",
							anchor:"99%",
							name:'oldpro',
							valueField: 'code', 
							displayField: 'dec',
							editable: false,
							triggerAction: 'all',
							mode: 'local', 
							onTriggerClick:Ext.emptyFn,
							store:new Ext.data.SimpleStore({fields:['code', 'dec']}),
							listeners:{
								beforerender :function(combo){
									var _store = combo.store;
									DWREngine.setAsync(false);
									baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.VProperty","tname='员工职务'",
										function(list){
											var Record = Ext.data.Record.create([
												{name:'code'},
												{name:'dec'}
											]);				
											for(var i=0;i<list.length;i++){
												_store.add(new Record({code:list[i].propertyCode,dec:list[i].propertyName}));
											}
										}
									);
									DWREngine.setAsync(true);
								}
							}
						}]
					},{
						layout:"form",
						labelWidth:50,
						columnWidth:0.33,
						bodyStyle: 'border: 0px;',
						items:[{
							xtype:"combo",
							fieldLabel:"新职务",
							anchor:"99%",
							name:'newpro',
							valueField: 'code', 
							displayField: 'dec',
							editable: false,
							triggerAction: 'all',
							mode: 'local', 
							store:new Ext.data.SimpleStore({fields:['code', 'dec']}),
							listeners:{
								beforerender :function(combo){
									var _store = combo.store;
									DWREngine.setAsync(false);
									baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.VProperty","tname='员工职务'",
										function(list){
											var Record = Ext.data.Record.create([
												{name:'code'},
												{name:'dec'}
											]);				
											for(var i=0;i<list.length;i++){
												_store.add(new Record({code:list[i].propertyCode,dec:list[i].propertyName}));
											}
										}
									);
									DWREngine.setAsync(true);
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.3,
						bodyStyle: 'border: 0px;',
						items:[{
								xtype:"checkbox",
								fieldLabel:"&nbsp;&nbsp;",
								name:'cpost',
								boxLabel:"同时变更职务",
								anchor:"98%",
								hideLabel:true
						}]
					}]
				},{
					xtype:"textarea",
					fieldLabel:"调动原因",
					anchor:"90%",
					name:"reason"
				},{
					xtype:"textarea",
					fieldLabel:"备注说明",
					anchor:"90%",
					name:"demo"
				},{
					layout:"column",
					bodyStyle: 'border: 0px;',
					items:[{
						layout:"form",
						bodyStyle: 'border: 0px;',
						columnWidth:0.4,
						items:[{
								xtype:"textfield",
								fieldLabel:"经办人",
								name:"handleruserid",
								anchor:"100%",
								readOnly:true
						}]
					},{
						layout:"form",
						columnWidth:0.5,
						bodyStyle: 'border: 0px;',
						items:[{
							xtype:"datefield",
							format:'Y年m月d日',
							fieldLabel:"调动日期",
							readOnly:true,
							anchor:"98%",
							name:"transferdate"
						}]
					}]
				}]
			}
		];
		this.buttons=[{
			text:'保存',
			scope:this,
			handler:function(){
				var basicForm = this.items.get(0).getForm();
				var cpost = basicForm.findField("cpost").getValue();
				
				var transferObj = new Object();
				transferObj.userid = this.userid;
				transferObj.transferdate = basicForm.findField("transferdate").getValue();
				transferObj.olddeptid = basicForm.findField("olddeptid").getValue();
				transferObj.newdeptid = basicForm.findField("newdeptid").getValue();
				transferObj.oldpro = cpost?(basicForm.findField("oldpro").getValue()):"";
				transferObj.newpro = cpost?(basicForm.findField("newpro").getValue()):"";
				transferObj.reason = basicForm.findField("reason").getValue();
				transferObj.handleruserid = USERID;
				transferObj.demo = basicForm.findField("demo").getValue();
				transferObj.transfertype = "1";
				transferObj.pid = PID;
				 
				if(basicForm.findField("newdeptid").getValue()==''){
				 	Ext.Msg.alert('验证信息','部门变更必须选择新部门');		 
					return;
				}
				
			  	var str=basicForm.findField("newpro").getValue();
				
				if(str!=''){
					if(!cpost)
					{
					 	Ext.Msg.alert('验证信息','必须勾选同时变更新职务');		 
						return;
					}
				}
				
				var win = this;
				rlzyMgm.saveTransfer(transferObj,function(flag){
					if(flag){
						win.hide();
						Ext.getCmp('staffgrid').getStore().reload();
						Ext.getCmp('transfergrid').getStore().reload();
					}else{
						Ext.example.msg('提示','操作失败！');
					}
				})
			}
		},{text:'取消',scope:this,handler:function(){this.hide()}}];
		this.on('show',function(cmp){
			var basicForm = cmp.items.get(0).getForm();
			basicForm.reset();
			basicForm.findField('handleruserid').setValue(REALNAME);
			basicForm.findField('transferdate').setValue(new Date());
			if(cmp.deptid&&cmp.deptid!="null")   basicForm.findField('olddeptid').setValue(cmp.deptid);
			if(cmp.postcode&&cmp.postcode!="null") basicForm.findField('oldpro').setValue(cmp.postcode);
			
			var newdeptStore = basicForm.findField('newdeptid').store;
			var newproStore  = basicForm.findField('newpro').store;
			
			newdeptStore.clearFilter();
			newproStore.clearFilter();
			
			basicForm.findField('newdeptid').on('expand',function(){   
	            newdeptStore.filterBy(function(record){
	               return record.get('unitid') != cmp.deptid;
	           });  
			})
			
			basicForm.findField('newpro').on('expand',function(){   
	            newproStore.filterBy(function(record){
	               return record.get('code') != cmp.postcode;
	           });  
			})
		});
		DeptTransferWindow.superclass.initComponent.call(this);
	},
	show : function(deptid,postcode,userid){
		this.deptid   = deptid;
		this.postcode = postcode;
		this.userid = userid;
		DeptTransferWindow.superclass.show.call(this);
	}
});
//岗位调动
PostTransferWindow=Ext.extend(Ext.Window ,{
	title:"岗位调动",
	width:522,
	height:300,
	layout:"fit",
	buttonAlign:"center",
	initComponent: function(){
		this.items=[{
			xtype:"form",
			autoHeight:true,
			labelWidth:80,
			bodyStyle:"border: 0px;padding:5px 5px 5px 15px",
			items:[{
				xtype:"combo",
				triggerAction:"all",
				fieldLabel:"调动类型",
				anchor:"98%",
				name:'posttrasnstype',
				valueField: 'code', 
				displayField: 'dec',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				value:'1',
				store:new Ext.data.SimpleStore({
					fields:['code', 'dec'],
					data:[['1','平级'],['2','升迁'],['3','降级'],['4','调入'],['5','调出']]
				})
			},{
				layout:"column",
				bodyStyle: 'border: 0px',
				items:[{
					layout:"form",
					bodyStyle: 'border: 0px;',
					columnWidth:0.5,
					items:[{
						xtype:"combo",
						triggerAction:"all",
						fieldLabel:"原职务",
						anchor:"95%",
						name:'oldpro',
						valueField: 'code', 
						displayField: 'dec',
						editable: false,
						triggerAction: 'all',
						mode: 'local', 
						onTriggerClick:Ext.emptyFn,
						store:new Ext.data.SimpleStore({fields:['code', 'dec']}),
						listeners:{
							beforerender :function(combo){
								var _store = combo.store;
								DWREngine.setAsync(false);
								baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.VProperty","tname='员工职务'",
									function(list){
										var Record = Ext.data.Record.create([
											{name:'code'},
											{name:'dec'}
										]);				
										for(var i=0;i<list.length;i++){
											_store.add(new Record({code:list[i].propertyCode,dec:list[i].propertyName}));
										}
									}
								);
								DWREngine.setAsync(true);
							}
						}
					},{ 
					     id:'oldpost',
						xtype:"combo",
						triggerAction:"all",
						fieldLabel:"原岗位",
						anchor:"95%",
						name:'oldpost',
						valueField: 'code', 
						displayField: 'dec',
						editable: false,
						triggerAction: 'all',
						mode: 'local', 
						onTriggerClick:Ext.emptyFn,
						store:new Ext.data.SimpleStore({fields:['code', 'dec']})
						
					},{
						xtype:"datefield",
						triggerAction:"all",
						fieldLabel:"调动日期",
						readOnly:true,
						name:"transferdate",
						anchor:"95%"
					}]
				},{
					layout:"form",
					columnWidth:0.5,
					bodyStyle: 'border: 0px;',
					items:[{
						xtype:"combo",
						triggerAction:"all",
						fieldLabel:"新职务",
						anchor:"95%",
						name:'newpro',
						valueField: 'code', 
						displayField: 'dec',
						editable: false,
						allowBlank: false,
						triggerAction: 'all',
						mode: 'local', 
						store:new Ext.data.SimpleStore({fields:['code', 'dec']}),
						listeners:{
							beforerender :function(combo){
								var _store = combo.store;
								DWREngine.setAsync(false);
								baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.VProperty","tname='员工职务'",
									function(list){
										var Record = Ext.data.Record.create([
											{name:'code'},
											{name:'dec'}
										]);				
										for(var i=0;i<list.length;i++){
											_store.add(new Record({code:list[i].propertyCode,dec:list[i].propertyName}));
										}
									}
								);
								DWREngine.setAsync(true);
							}
						}
					},{ 
					    id:'newgw',
						xtype:"combo",
						triggerAction:"all",
						fieldLabel:"新岗位",
						anchor:"95%",
						name:'newpost',
						valueField: 'code', 
						displayField: 'dec',
						editable: false,
						triggerAction: 'all',
						mode: 'local', 
						store:new Ext.data.SimpleStore({fields:['code', 'dec']})
					},{
						xtype:"textfield",
						triggerAction:"all",
						fieldLabel:"经办人",
						name:"handleruserid",
						anchor:"95%"
					}]
				}]
			},{
				xtype:"textarea",
				fieldLabel:"调动原因",
				name:'reason',
				anchor:"98%"
			},{
				xtype:"textarea",
				fieldLabel:"备注说明",
				name:'demo',
				anchor:"98%"
			}]
		}];
		this.buttons=[{
				text:'保存',
				scope:this,
				handler:function(){
					var basicForm = this.items.get(0).getForm();
					var transferObj = new Object();
					transferObj.userid = this.userid;
					transferObj.transferdate = basicForm.findField("transferdate").getValue();
					transferObj.newdeptid = this.deptid;
					transferObj.olddeptid = this.deptid;
					transferObj.oldpro = basicForm.findField("oldpro").getValue();
					transferObj.newpro = basicForm.findField("newpro").getValue();
					transferObj.oldpost = basicForm.findField("oldpost").getValue();
					transferObj.newpost = basicForm.findField("newpost").getValue();
					transferObj.reason = basicForm.findField("reason").getValue();
					transferObj.handleruserid = USERID;
					transferObj.demo = basicForm.findField("demo").getValue();
					transferObj.transfertype = "2";
					transferObj.pid = PID;
					transferObj.posttrasnstype =  basicForm.findField("posttrasnstype").getValue();
					
					//验证
					var str=basicForm.findField("newpro").getValue();
					if(str==''){
						Ext.Msg.alert('提示信息','职岗变更中 职务必须选择');
					 	return ;
					}
					
					
					var win = this;
					rlzyMgm.saveTransfer(transferObj,function(flag){
						if(flag){
							win.hide();
							Ext.getCmp('staffgrid').getStore().reload();
							Ext.getCmp('transfergrid').getStore().reload();
						}else{
							Ext.example.msg('提示','操作失败！');
						}
					})
				}
			},{
				text:'取消',
				scope:this,
				handler:function(){this.hide()}
		}];
		this.on('show',function(cmp){
				var basicForm = cmp.items.get(0).getForm();
			basicForm.reset();
			basicForm.findField('handleruserid').setValue(REALNAME);
			basicForm.findField('transferdate').setValue(new Date());
		
			var oldpostStore = basicForm.findField('newpost').store; 
			var newpostStore = basicForm.findField('newpost').store; 
			Ext.getCmp('oldpost').store=oldpostStore;
			oldpostStore.removeAll();
			newpostStore.removeAll();
			DWREngine.setAsync(false);
			baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit",
								"unit_type_id = '9' and upunit = '"+cmp.deptid+"' order by view_order_num asc",
				function(list){
					var Record = Ext.data.Record.create([
						{name:'code'},
						{name:'dec'}
					]);	
					for(var i=0;i<list.length;i++){
						Ext.getCmp('newgw').store.add(new Record({code:list[i].unitid,dec:list[i].unitname}));
					
					}
					if((cmp.gwid)!="")     basicForm.findField('oldpost').setValue(cmp.gwid);
					if((cmp.postcode)!="") basicForm.findField('oldpro').setValue(cmp.postcode);
				
					var newproStore  = basicForm.findField('newpro').store;
					newproStore.clearFilter();
					newpostStore.clearFilter();
					
					    basicForm.findField('newpost').on('expand',function(){   
			            newpostStore.filterBy(function(record){
			               return record.get('code') != cmp.gwid;
			           });  
					})
					
					basicForm.findField('newpro').on('expand',function(){   
			            newproStore.filterBy(function(record){
			               return record.get('code') != cmp.postcode;
			           });  
					})
				}
			);
			DWREngine.setAsync(true);
		})
		PostTransferWindow.superclass.initComponent.call(this);
	},
	show:function(deptid,postcode,gwid,userid){
		this.deptid = deptid;
		this.postcode = postcode;
		this.gwid = gwid;
		this.userid = userid;
		PostTransferWindow.superclass.show.call(this);
	}
	
});




//查询
function showSearchWindow(){
   if(!searchform){
	   searchform = new Ext.Window({	               
			title: '查询数据',
			width: 500, minWidth: 500, height: 215,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [formPanel]
		}); 
	   formPanel.getForm().reset();
   }
   searchform.show();

}

var formPanel = new Ext.FormPanel({
    header: false, border: false, autoScroll: true,
    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
    items: [{
    	xtype: 'fieldset',
		title: '字段查询',
      	border: true,
      	layout: 'table',
      	layoutConfig: {columns: 1},
      	defaults: {bodyStyle:'padding:1px 1px'},
      	items: [{
			
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'realname',
				fieldLabel: '姓名',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'usernum',
				fieldLabel: '编号',
				width: 183
			}]
		},
		{
			layout: 'form',
			border: false,
			width: 400,
			items: new Ext.form.ComboBox({
			name: 'onthejob',
			hiddenName: 'onthejob',
			fieldLabel: '工作区域',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '离职'],['1', '在职'],['2', '所有']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
			
			
			})
		}]
	}],
	bbar: ['->',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'btn',
		handler: execQuery
	}]
});

function execQuery(){
	var form = formPanel.getForm(), queStr = '';
	if (form.isValid()){
		var realname = form.findField('realname');
		if ('' != realname.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'realname like \'%' + realname.getValue() + '%\'';
		}
		var usernum = form.findField('usernum');
		if ('' != usernum.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'usernum like \'%' + usernum.getValue() + '%\'';
		}
		var onthejob=form.findField('onthejob');
		if(''!=onthejob.getValue()){
		if ('' != queStr&&(onthejob.getValue()==0||onthejob.getValue()==1)) queStr += ' and ';
		   if(onthejob.getValue()==0||onthejob.getValue()==1){
			queStr += 'onthejob  =' + onthejob.getValue();
		   }
		}
		var ds =Ext.getCmp('staffgrid').getStore();
		ds.baseParams.params = queStr;
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		searchform.hide()
	}
}