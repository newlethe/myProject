var bean = "com.sgepit.pmis.budget.hbm.BdgChangeProject"
var listMethod = "findWhereOrderby";
var primaryKey = "prochangeappid";
var orderColumn = "conid";
var business = "baseMgm";
var gridPanelTitle = "合同:" +　conname  +　"   工程量分摊记录"
var rootText = "工程量分摊";
var unit = new Array();
var treeMoney;
var totalMoney;
var winChooseNode,chooseParentNode
//选择的树节点的path路径
var selTreePath;
var currentPid = CURRENTAPPID;
var addBdgProWin;//新增工程量窗口
var formPanel;
var bdgid;//设置选择关联工程连
var priceChangeWin;//单价变更
var changeType;
var prompt;
var totalField;
Ext.onReady(function (){
	//--------------------------------------------------------------------------
	var fm = Ext.form;
	var fc = {		// 创建编辑域配置
    	'prochangeappid': {
			name: 'prochangeappid',
			fieldLabel: '工程量主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'pid':{
        	name : 'pid',
        	fieldLabel : 'pid',
        	hidden : true
        
        },
        'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			allowBlank: false,
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'changeprono': {
			name: 'changeprono',
			fieldLabel: '工程量变更编号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
        }, 'changeproname': {
			name: 'changeproname',
			fieldLabel: '工程量变更名称',
			allowBlank: false,
			anchor:'95%'
        }, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
		}, 'changeprice': {
			name: 'changeprice',
			fieldLabel: '单价',
			decimalPrecision:6,
			allowBlank: false,
			anchor:'95%'
		}, 'changeamount': {
			name: 'changeamount',
			fieldLabel: '总工程量',
			decimalPrecision:8, 
			allowBlank: false,
			anchor:'95%'
		}, 'changemoney': {
			name: 'changemoney',
			fieldLabel: '金额',
			anchor:'95%'
		}, 'state': {
			name: 'state',
			fieldLabel: '状态',
			anchor:'95%'
		},'changeid':{
		    name : 'changeid',
		    fieldLabel:'合同变更编号',
			hidden:true,
			hideLabel:true,
			anchor : '95%'
		}
	}
	
    var Columns = [
    	{name: 'prochangeappid', type: 'string'},
    	{name: 'conid', type : 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'changeproname', type: 'string'},    	
		{name: 'unit', type: 'string'},
    	{name: 'changeprice', type: 'float'},
		{name: 'changeamount', type: 'float'},
		{name: 'changemoney', type: 'float'},
		{name: 'state', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'changeid', type: 'string'},
		{name :'changeprono',type :'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);
    	var PlantInt = {
    		pid : currentPid,
	    	conid:  null, 
	    	bdgid: null,
	    	changeprono: null,
	    	changeproname: null,
	    	unit: null,
	    	changeprice: null,
	    	changeamount: null,
	    	changemoney:null,
	    	changeid:changeid
    	}
    
    var sm =  new Ext.grid.CheckboxSelectionModel()
    var cm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
           id:'prochangeappid',
           header: fc['prochangeappid'].fieldLabel,
           dataIndex: fc['prochangeappid'].name,
		   hidden:true,
		   hideLabel:true
        }, {
        	id : 'pid',
        	header : fc['pid'].fieldLabel,
        	dataIndex : fc['pid'].name,
        	hidden : true
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true,
           hideLabel:true
        },{
           id:'changeprono',
           header : fc['changeprono'].fieldLabel,
           dataIndex : fc['changeprono'].name,
           width :80,
           align : 'center'
        },{
           id:'changeproname',
           header: fc['changeproname'].fieldLabel,
           dataIndex: fc['changeproname'].name,
           width: 120,
           align : 'center'
        }, {
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           width: 50,
           align : 'center',
           editor : new Ext.form.TextField(fc['unit'])
        }, {
           id:'changeprice',
           header: fc['changeprice'].fieldLabel,
           dataIndex: fc['changeprice'].name,
           width: 50,
           align: 'right',
           renderer : cnMoney,
           allowBlank: true,
           editor : new Ext.form.NumberField(fc['changeprice'])
        }, {
           id:'changeamount',
           header: fc['changeamount'].fieldLabel,
           dataIndex: fc['changeamount'].name,
           width: 70,
           align: 'right',
           allowBlank: true,
           editor : new Ext.form.NumberField(fc['changeamount'])
        }, {
           id:'changemoney',
           header: fc['changemoney'].fieldLabel,
           dataIndex: fc['changemoney'].name,
           align: 'right',
           renderer: cnMoneyToPrec,
           width: 70
        }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 40,
           align : 'center',
           renderer : function (v){
               if(v=='1'){
                   return "新增变更"
               }else if(v=='2'){
                   return "价格变更";
               }else if(v=='3'){
                   return "数量变更";
               }
           }
        }
	])
    cm.defaultSortable = true;
	
     totalField = new Ext.Button({
            id:"total"
    		});
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params : "changeid='"+changeid+"' and conid='"+conid+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'module-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        header: false,
        tbar: [{  
        	      id:"priceChangeId",
                  text : '单价变更',
                  iconCls : 'btn',
                  handler : priceChangeProject
              },'-',{
              	  id:"amountChangeId",
                  text :'数量变更',
                  iconCls :'btn',
                  handler : numberChangeProject
              }
        ],
        iconCls: 'icon-by-category',
        region: 'east',
        width : 850,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 100,
        maxSize: 800,
        border: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,	
      	saveBtn : true,
      	addBtn : true,
      	business: "baseMgm",	
      	primaryKey: primaryKey,	
      	insertHandler: insertFun,
      	saveHandler: saveFun,
      	deleteHandler: deleFun,
      	listeners : {
		    aftersave : function (grid,idsOfInsert,idsOfUpdate,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybSave(idsOfInsert,idsOfUpdate,bean,function(rtn){
		               });
                       calTotalFun();	               
		    },
		    beforeedit:function(o){
		    	var rec = o.record;
		    	if(rec.get("state")=="2"&&o.field=="changeamount"){
		    		return false;
		    	}else 
		    	if(rec.get("state")=="3"&&o.field=='changeprice'){
		    	    return false;
		    	}else {
		    	    return true;
		    	}
		    }
      	},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 15,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});	
	

	
	function insertFun(){
		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return
		}
	    if(!formPanel){
			formPanel = new Ext.form.FormPanel({
	   		id:'bdgProForm',
	    	frame : false,
	    	buttionAlign : 'center',
	    	bodyStyle : 'padding:5px',
	    	labelAlign : 'right',
	    	items :[
	        {
	            xtype : 'fieldset',
	            baseCls :'x-fieldset',
	            autoShow : true,
	            autoHeight : true,
	            autoWidth : true,
	            border : false,
	            width :300,
	            layout : 'column',
	            items :[
	                {
	                    columnWidth : .5,
	                    layout : 'form',
	                    items :[{
	                            xtype : 'textfield',
	                            id : 'changeprono',
	                            name : 'changeprono',
	                            allowBlank : false,
	                            fieldLabel : '变更工程量编号',
	                            anchor :'95%'
	                        },{
	                            xtype : 'textfield',
	                            id : 'unit',
	                            name : 'nuit',
	                            allowBlank : false,
	                            fieldLabel : '单位',
	                            anchor : '95%'
	                        },{
	                            xtype : 'numberfield',
	                            id : 'changeamount',
	                            allowBlank : false,
	                            name : 'changeamount',
	                            fieldLabel :'总工程量',
	                            anchor :'95%'
	                        }
	                    ]
	                },{
	                       columnWidth :.5,
	                       layout : 'form',
	                       items:[
	                           {
	                               xtype :'textfield',
	                               id : 'changeproname',
	                               name :'changeproname',
	                               allowBlank : false,
	                               fieldLabel :'变更工程量名称',
	                               anchor :'95%'
	                           },{
	                               xtype :'numberfield',
	                               id : 'changeprice',
	                               name : 'changeprice',
	                               allowBlank : false,
	                               fieldLabel :'单价(元)',
	                               anchor :'95%'
	                           },{
	                               xtype :'numberfield',
	                               id :'changemoney',
	                               name :'changemoney',
	                               disabled:true,
	                               fieldLabel :'总金额(元)',
	                               anchor :'95%'
	                           }
	                       ]
	                },{
	                       xtype : 'textfield',
	                       id : 'prochangeappid',
	                       name : 'prochangeappid',
	                       fieldLabel : 'ID',
	                       hidden : true,
	                       hideLabel : true
	                }
	            ]
	        }
	    ],
	    buttons :[
	        {
	            text : '保存',
	            handler : function (){
	            	var baseForm = formPanel.getForm();
	                if(baseForm.isValid()){
                	  	DWREngine.setAsync(false);
	                	var prono = baseForm.findField('changeprono').getValue();
	                	var proname = baseForm.findField('changeproname').getValue();
	                	var unit = baseForm.findField('unit').getValue();
	                	var amount = baseForm.findField('changeamount').getValue();
	                	var price = baseForm.findField('changeprice').getValue();
	                	var proappid = baseForm.findField('prochangeappid').getValue();
	                	var obj = new Object();
	                	    obj.pid=currentPid;
	                	    obj.changeamount=amount;
	                	    obj.conid=conid;
	                	    obj.changemoney = price*amount;
	                	    obj.bdgid = bdgid;
	                	    obj.changeprice =price;
	                	    obj.changeproname =proname;
	                	    obj.changeprono = prono;
	                	    obj.changeid=changeid;
	                	    obj.state='1',
	                	    obj.unit = unit;
	                	    obj.prochangeappid =proappid;
	                	    //验证工程量编号唯一性
	                	     var proState;
	                	     bdgProjectMgm.checkBdgProjectSameToChangeProject(obj.changeprono,obj.changeproname,obj.conid,obj.pid,function (rtn){
	                	         proState =rtn;
	                	     });
	                	     var rtnCon;
							DWREngine.setAsync(false)
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
		   				    	rtnCon=rtn;
							})
							DWREngine.setAsync(true)
							if(rtnCon.billstate=='3'||rtnCon.billstate=='3'){
		    					Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊新增');
		    					return;
							}
	                	     if(proState=='1'){
	                	         Ext.Msg.alert('提示信息','该工程量名称或编号已存在!,可直接从工程量列表中选择')
	                	         return ;
	                	     }
	                	     if(proappid==""){
	                	     	var moneyRtn;
	                	     	 bdgProjectMgm.checkChangeProjectMoneyValid(obj.conid,obj.changeid,obj.pid,"",obj.money,function(r){
	                	     	     moneyRtn= r;
	                	     	 })
	                	     	 
	                	     	 if(moneyRtn=='1'){
                	     	         Ext.Msg.confirm('提示信息','变更工程量分摊总金额已超过该次变更金额?确定添加吗?',function (r){
                	     	             if(r=='yes'){
					                	         bdgProjectMgm.insertBdgChangeProject(obj,function (){
					                	             ds.baseParams.params = "bdgid='" + obj.bdgid  + "' and conid='" + obj.conid + "' and changeid='"+obj.changeid+"'"
					                	             ds.load({
					                	                 callback : function (){
					                	                     totalMoney = caculateTotalMoney(bdgid,conid,changeid);	
						                                     if (totalMoney != treeMoney){
							                                      var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
									                                  'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
							                                      prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
							                                      prompt.el.style.cursor = "pointer"
						 	                                      prompt.setVisible(true);
						                                     }else{
							                                      prompt.el.innerHTML = "";
							                                      prompt.setVisible(false);
						                                     }
				    	                                     totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");	                	                 
					                	                 }
					                	                 ,
														params : {
														start : 0, // 起始序号
														limit : 15
														// 结束序号，若不分页可不用设置这两个参数
														}
					                	             });
					                	             Ext.example.msg('保存成功！', '您成功保存了一条信息！');
					                	         });                	     	                 
                	     	             }
                	     	         })
	                	     	  }else {
	                	         bdgProjectMgm.insertBdgChangeProject(obj,function (){
	                	             ds.baseParams.params = "bdgid='" + obj.bdgid  + "' and conid='" + obj.conid + "' and changeid='"+obj.changeid+"'"
	                	             ds.load({
	                	                 callback : function (){
	                	                     totalMoney = caculateTotalMoney(bdgid,conid,changeid);	
		                                     if (totalMoney != treeMoney){
			                                      var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					                                  'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			                                      prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			                                      prompt.el.style.cursor = "pointer"
		 	                                      prompt.setVisible(true);
		                                     }else{
			                                      prompt.el.innerHTML = "";
			                                      prompt.setVisible(false);
		                                     }
    	                                     totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");	                	                 
	                	                 }
	                	                 ,
										params : {
										start : 0, // 起始序号
										limit : 15
										// 结束序号，若不分页可不用设置这两个参数
										}
	                	             });
	                	             
	                	             Ext.example.msg('保存成功！', '您成功保存了一条信息！');
	                	         });
	                	     	  }
	                	     }	                	      
	                	     baseForm.reset();
	                	     addBdgProWin.hide();
	                	     totalMoney = caculateTotalMoney(bdgid,conid,changeid);		
		                     if (totalMoney != treeMoney){
			                     var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					                            'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			                     prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			                     prompt.el.style.cursor = "pointer"
		 	                     prompt.setVisible(true);
		                     }else{
			                     prompt.el.innerHTML = "";
			                     prompt.setVisible(false);
		                      }
    	                      totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
    	                      DWREngine.setAsync(true);   	    
	                }
	            }
	        },{
	            text :'取消',
	            handler : function (){
	                 formPanel.getForm().reset();
	                 addBdgProWin.hide();
	            }
	        }
	    ]
	    
	})	
}
		if(!addBdgProWin){
		    addBdgProWin = new Ext.Window({
		        id : 'bdgProWin',
		        title :'新增',
		        iconCls :'form',
		        width: 700,
		        height :200,
		        modal:true,
		        closeAction : 'close',
		        maximizable : true,
		        minimizable : true,
		        resizable : true,
		        autoScroll:true,
		        plain: true,
		        items :[formPanel],
		        listeners : {
		            'hide' : function (win){
		                win.close();
		            }
		        }
		    })
		}
		addBdgProWin.show();
    }
    
    function deleFun(){
 		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return			
		}
	    var rtnCon;
		DWREngine.setAsync(false)
		baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
		    rtnCon=rtn;
		})
		DWREngine.setAsync(true)
		if(rtnCon.billstate=='3'||rtnCon.billstate=='3'){
		    Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊删除');
		    return ;
		}
		var appid = winChooseNode.attributes.appid
		var selectRecords = gridPanel.getSelectionModel().getSelections()
		if(typeof('selectRecords')=='undefined'){
		    Ext.Msg.alert('提示信息','请选择要删除的记录');
		    return;
		}
		DWREngine.setAsync(false)
		if(selectRecords.length > 0){
			for(var i=0;i<selectRecords.length;i++){
				var proid = selectRecords[i].get('prochangeappid')
				if(proid ==''||proid == null)
					continue
				else {
					bdgProjectMgm.deleteRelateChangeProject(proid,function(flag){})
				}
			}
		}
		DWREngine.setAsync(true)	
		Ext.example.msg('提示','您成功删除了'+ selectRecords.length +'条信息')		
		ds.load({
			callback:function(){
					totalMoney = caculateTotalMoney(bdgid,conid,changeid)
					totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
			} 
			,
			params : {
				start : 0, // 起始序号
				limit : 15
				// 结束序号，若不分页可不用设置这两个参数
			}
		});
		refresh()
    }
    
    function saveFun(){
		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return			
		}
		var rtnState;
		DWREngine.setAsync(false)
		baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
		    rtnState=rtn;
		})
		DWREngine.setAsync(true)
		if(rtnState.billstate=='3'||rtnState.billstate=='3'){
		    Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊修改');
		    return ;
		}
    	var records = ds.getModifiedRecords();
  		var totalM;
  		var appids;
		for (var i=0; i<records.length; i++){
			var r_price = records[i].get('changeprice');
			var r_amount = records[i].get('changeamount');
			
	    	if (!r_price||!r_amount){
	    		var msg = ((!r_price)?"请先填写单价!":"请先填写工程总量!");
    			Ext.Msg.alert('提示',msg);
    			window.setTimeout("Ext.Msg.hide();",2000);//2秒自动关闭提示
    			//Ext.example.msg('填写不完全！');
    			return;
    		}else{
    			records[i].set('changemoney', r_price*r_amount);
    		}
		}
		gridPanel.defaultSaveHandler();
		//window.setTimeout("calTotalFun()", 500);
    }
    
    
	//--------------------------------------------------------------------------
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp" ;
		}
	});
	var btnConcaMoney = new Ext.Button({
		text: '本合同变更分摊金额:',
		id:"concaMoneyId"
	});
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form'
        
    })
   
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"bdgProjectChangeTree", 
			businessName:"bdgMgm", 
			conid:conid, 
			conmoney: 0,
			parent:0,
			chaid:changeid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 400,
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        lines: true,
        autoScroll: true,
        animate: false,
		tbar:[/*{text: '<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
			   iconCls: 'title'
        		},'-',*/{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            },'-',btnConcaMoney,'->','-',btnReturn],        
		columns:[{
            header: '概算名称_概算编码(变更分摊金额)',
            width: 700,	
            dataIndex: 'bdgname'
        },{
            header: '概算编码',
            width: 0,
            dataIndex: 'bdgno',
            hidden:true
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
            header: '概算金额主键',	
            width: 0,				
            dataIndex: 'appid',
            renderer: function(value){
            	return "<div id='appid' >"+value+"</div>";
            }
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '内部流水号',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },{
            header: '本合同分摊总金额',
            width: 0,
            hidden:true,
            dataIndex: 'conappmoney',
            renderer: function(value){
            	return "<div id='conappmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        },
		  {
            header: '变更分摊金额',
            hidden:true,
            width: 0,
            dataIndex: 'camoney',//old camoney
             renderer: function(value){
            	return "<div id='camoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
            
		},{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header:'备注',
            width:0,
            dataIndex:'remark'
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	
	
	treePanelNew.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.conmoney = 0 ;
		baseParams.parent = bdgid;	
		baseParams.chaid=changeid;
	});
	
    treePanelNew.expand();
	rootNew.expand();
	
    treePanelNew.on('click', function (node, e ){  
    	Ext.getCmp("add").setDisabled(false);
		Ext.getCmp("save").setDisabled(false);
		Ext.getCmp("del").setDisabled(false);
		Ext.getCmp("priceChangeId").setDisabled(false);
		Ext.getCmp("amountChangeId").setDisabled(false);
    	winChooseNode = node
    	chooseParentNode = node.parentNode
		var elNode = node.getUI().elNode;
		PlantInt.conid =  conid;
		bdgid =  elNode.all("bdgid").innerText;
		treeMoney = node.attributes.conappmoney;
		var isIeaf = elNode.all("isleaf").innerText;
		btnConcaMoney.setText("本合同变更分摊金额:"+"<font color=red size=2>"+elNode.all("camoney").innerText+"</font>");
		if(isIeaf!=1){
			var bdgids="";
			Ext.getCmp("add").setDisabled(true);
			Ext.getCmp("save").setDisabled(true);
			Ext.getCmp("del").setDisabled(true);
		    Ext.getCmp("priceChangeId").setDisabled(true);
		    Ext.getCmp("amountChangeId").setDisabled(true);
			var nodeid=node.id;
			DWREngine.setAsync(false);
       		db2Json.selectData("select bdgid,bdgno from bdg_info where pid='"+currentPid+"' start with parent='"+nodeid+"' connect by prior bdgid=parent",
        		function (jsonData) {
	    			var list = eval(jsonData);
          		    var money=0;
	    			if(list!=null){
	            	for(var i=0;i<list.length;i++){
	            		var bdgid=list[i].bdgid;
	            		bdgids+="'"+bdgid+"'"+",";
	            	}
	            	 bdgids=bdgids.substring(0,bdgids.length-1);
	            	 money+=caculateTotalMoneyByMulti(bdgids,conid,changeid)*1;  
	    		}
	    		totalMoney=money;
	  	 	});
	    	DWREngine.setAsync(true);	
	    	ds.baseParams.params = "bdgid in ("+bdgids+") and conid='" + conid + "' and changeid='"+changeid+"'";
		}else{
			  ds.baseParams.params = "bdgid='" + bdgid  + "' and conid='" + conid + "' and changeid='"+changeid+"'";
		      totalMoney=caculateTotalMoney(bdgid,conid,changeid);  
		}
		ds.load({
			callback:function(){
				//if (isIeaf == 1){
					if (totalMoney != treeMoney){
						var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
								'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
						prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
						prompt.el.style.cursor = "pointer"
						prompt.setVisible(true);
					}else{
						prompt.el.innerHTML = "";
						prompt.setVisible(false);
					}
					totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
				//}
			} 
			,
			params : {
				start : 0, // 起始序号
				limit : 15
				// 结束序号，若不分页可不用设置这两个参数
			}
		});
	});
	
	
		
		
	var contentPanel = new Ext.Panel({
			layout: 'border',
			region: 'center',
			border: false,
			header: false,
			tbar:[{text: '<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
				   iconCls: 'title'
	        		},'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ rootNew.expand(true); }
	            },'-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ rootNew.collapse(true); }
	            },'->','-',btnReturn],
			items: [treePanelNew]
			
		}) 
			
	// 7. 创建viewport加入面板content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
        	title : gridPanelTitle,
            layout:'border',
            items: [treePanelNew,gridPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [treePanelNew,gridPanel]
        });
    }
	treePanelNew.render();
	treePanelNew.expand();
	rootNew.expand();
	gridPanel.getTopToolbar().add('->');
	prompt= new Ext.Toolbar.TextItem('')
	gridPanel.getTopToolbar().add(prompt);
	gridPanel.getTopToolbar().add(new Ext.Toolbar.TextItem('总金额:'));
	gridPanel.getTopToolbar().add(totalField);
	prompt.setVisible(false);
	function refreshconappmoney(){
    	var baseParams = treePanelNew.loader.baseParams
		baseParams.parent = chooseParentNode.attributes.bdgid;		
		treeLoaderNew.load(chooseParentNode)
		chooseParentNode.expand()		
		winChooseNode.fireEvent('click',winChooseNode)
	}

	
	
	
	gridPanel.on('aftersave',function(){
		refresh()
	})	
	
	function refresh(){
		if(winChooseNode == ''||winChooseNode == null){
			return
		}else{
		}	
	}	
	
	//刷新树
	function refreshBgdTree(){
		rootNew.reload()
		treePanelNew.on("expand",function(){
			treePanelNew.expandPath(path,null,function(){
				var curNode = treePanelNew.getNodeById(selectedModuleNode.id);
				curNode.select()
			})
		})
		treePanelNew.expandAll()
	}
	
	function resetBgdTree(){
			
		var node = winChooseNode 
		winChooseNode.fireEvent('click',node)
		var elNode = node.getUI().elNode;
		var curOldMoneyStr = elNode.all("conappmoney").innerText;
		var curOldMoney = curOldMoneyStr.replace("￥","")*1
		var differ = 0
		//更新左侧概算分摊树的显示金额，获取工程量表的金额合计
		bdgProjectMgm.getProjectTotalByBgdId(conid, elNode.all("bdgid").innerText,function(newCurMoney) {
			//得到最新的工程量分摊和原值的差值
			differ = newCurMoney *1 - curOldMoney *1
			while(node.parentNode){					 			
					var elNode = node.getUI().elNode;
					var treeOldMoneyStr = elNode.all("conappmoney").innerText;	
					var treeOldMoney = treeOldMoneyStr.replace("￥","")*1 		
					var treeNewMondy  = treeOldMoney + differ*1	
					node.attributes.conappmoney =		treeNewMondy
					elNode.all("conappmoney").innerText = "￥"+ treeNewMondy
				node = node.parentNode
			}
		})			
	}
	/**
	 * 选择列表
	 */
	var changeSm = new Ext.grid.CheckboxSelectionModel({});
	var changeCm = new Ext.grid.ColumnModel([
	    changeSm,
	    {
           header :'工程量编号',
           dataIndex : 'prono',
           align : 'center',
           width :80
	    },{
	       header: '工程量名称',
	       dataIndex :'proname',
	       align : 'center',
	       width :80
	    },{
	       header :'单位',
	       dataIndex :'unit',
	       align :'center',
	       width :50
	    },{
	       header : '单价',
	       dataIndex : 'price',
	       align :'right',
	       width :80
	    },{
	       header :'总工程量',
	       dataIndex :'amount',
	       align :'right',
	       width :80
	    },{
	       header : '总价格',
	       dataIndex :'money',
	       align :'right',
	       width :80
	    }
	])
	var changeDs = new Ext.data.Store({
	    baseParams :{
	        ac :'list',
	        bean : 'com.sgepit.pmis.budget.hbm.BdgProject',
	        business:'baseMgm',
	        method : 'findWhereOrderby',
	        params :" pid='"+currentPid+"' and bdgid='"+bdgid+"' and conid='"+conid+"'"
	    },
	    proxy : new Ext.data.HttpProxy({
	        url : MAIN_SERVLET,
	        method :'GET'
	    }),
	    reader : new Ext.data.JsonReader({
	        root : 'topics',
	        totalProperty : 'totalCount'
	     },[
	        {name :'proappid' ,type :'string'},
	        {name : 'conid',type :'string'},
	        {name :'bdgid',type :'string'},
	        {name :'prono',type :'string'},
	        {name :'proname',type :'string'},
	        {name :'unit',type :'string'},
	        {name :'price',type :'float'},
	        {name :'amount',type :'float'},
	        {name :'money',type :'float'},
	        {name :'pid',type :'string'}
	     ])
	})
	var changeGrid = new Ext.grid.GridPanel({
	    id :'changeGrid',
	    title :'工程量列表',
	    ds : changeDs,
	    sm : changeSm,
	    cm : changeCm,
	    tbar : ['->',
	        {
	            text : '保存',
	            iconCls :'save',
	            handler : savePriceChange
	        }
	    ],
	    viewConfig :{
	        forceFit : true
	    },
	    width:600,
	    height :300,
	    frame : true,
	    iconCls :'icon-grid',
	    bbar :new Ext.PagingToolbar({
            pageSize: 20,
            store: changeDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"	        
	    })
	})
    function priceChangeProject(){
    	if(typeof(bdgid)=='undefined'||bdgid==''){
    	    Ext.Msg.alert('提示信息','请选择左侧分摊树');
    	    return ;
    	}
        if(!priceChangeWin){
            priceChangeWin = new Ext.Window({
                id : 'priceWin',
                width :620,
                height :330,
                modal : true,
                closeAction : 'hide',
                maximizable : true,
                minimizable : true,
                resizable : true,
                autoScroll : true,
                plain : true,
                items : [changeGrid],
                listeners : {
                
                }
            })
            
        }
        changeType='priceChange';
        changeDs.baseParams.params=" pid='"+currentPid+"' and bdgid='"+bdgid+"' and conid='"+conid+"'";
        changeDs.load({params :{start :0,limit :PAGE_SIZE}})
        priceChangeWin.show();
    } 
    function savePriceChange(){
         var recs =changeGrid.getSelectionModel().getSelections();
         if(recs.length==0){
            Ext.Msg.alert('提示信息','请选择要变更的工程量');
            return ;
         }
         for(var i=0;i<recs.length;i++){
             var Rec = recs[i];
             PlantInt.pid=Rec.get('pid');
             PlantInt.conid=Rec.get('conid');
             PlantInt.bdgid=Rec.get('bdgid');
             PlantInt.changeprono=Rec.get('prono');
             PlantInt.changeproname=Rec.get('proname');
             PlantInt.changeid=changeid;
             if(changeType=='priceChange'){
	             PlantInt.changeamount=Rec.get('amount');
	              PlantInt.changeprice=null;
	             PlantInt.state='2';
	    	     var rtnState="";
	             DWREngine.setAsync(false);
	    	     bdgProjectMgm.checkBdgChangeProjectOnly(PlantInt.changeprono,PlantInt.state,PlantInt.changeid,PlantInt.conid,PlantInt.pid,function (rtn){
	    	         rtnState = rtn;
	    	     })
	             DWREngine.setAsync(true);
	    	     if(rtnState!='1'){
	    	     	gridPanel.defaultInsertHandler();
	    	     	priceChangeWin.hide();
	    	     }else{
	    	     	Ext.Msg.alert("提示信息","已存在本条数据的价格变更");
	    	     }
             }else if(changeType=='amountChange') {
	             PlantInt.changeprice=Rec.get('price');	
	             PlantInt.changeamount=null;
	             PlantInt.state='3';
	             var rtnState="";
	             DWREngine.setAsync(false);
	    	     bdgProjectMgm.checkBdgChangeProjectOnly(PlantInt.changeprono,PlantInt.state,PlantInt.changeid,PlantInt.conid,PlantInt.pid,function (rtn){
	    	         rtnState = rtn;
	    	     })             
	             DWREngine.setAsync(true);
	    	     if(rtnState!='1'){
	    	     	gridPanel.defaultInsertHandler();
	    	     	priceChangeWin.hide();
	    	     }else{
	    	     	Ext.Msg.alert("提示信息","已存在本条数据的数量变更");
	    	     }
             }
         }
    }    
    function numberChangeProject(){
    	if(typeof(bdgid)=='undefined'||bdgid==''){
    	    Ext.Msg.alert('提示信息','请选择左侧分摊树');
    	    return ;
    	}
        if(!priceChangeWin){
            priceChangeWin = new Ext.Window({
                id : 'priceWin',
                width :620,
                height :330,
                modal : true,
                closeAction : 'hide',
                maximizable : true,
                minimizable : true,
                resizable : true,
                autoScroll : true,
                plain : true,
                items : [changeGrid],
                listeners : {
                
                }
            })
            
        }
        changeType='amountChange';
        changeDs.baseParams.params=" pid='"+currentPid+"' and bdgid='"+bdgid+"' and conid='"+conid+"'";
        changeDs.load({params :{start :0,limit :PAGE_SIZE}})
        priceChangeWin.show();    	
    }
});


function formatDate(value){
		return value ? value.dateFormat('Y-m-d') : '';
};

function caculateTotalMoney(bdgid,conid,changeid){
	    var money=0;
  		DWREngine.setAsync(false);
        db2Json.selectData(" select sum(nvl(bdgchangep.changemoney,0)) as money from BDG_CHANGE_PROJECT " +
        		"bdgchangep where bdgchangep.BDGID='"+bdgid+"' " +
        		"and bdgchangep.CONID='"+conid+"' " +
        		"and bdgchangep.CHANGEID='"+changeid+"' order by bdgchangep.CONID ASC ",
        		function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null){
	    	  money=list[0].money;
	    	}
	    else{
	    	 money=0;
	 	   }
	   });
	    DWREngine.setAsync(true);
	    return money;
}
function caculateTotalMoneyByMulti(bdgids,conid,changeid){
	    var money=0;
  		DWREngine.setAsync(false);
        db2Json.selectData(" select sum(nvl(bdgchangep.changemoney,0)) as money from BDG_CHANGE_PROJECT " +
        		"bdgchangep where bdgchangep.BDGID in ("+bdgids+") " +
        		"and bdgchangep.CONID='"+conid+"' " +
        		"and bdgchangep.CHANGEID='"+changeid+"' order by bdgchangep.CONID ASC ",
        		function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null){
	    	  money=list[0].money;
	    	}
	    else{
	    	 money=0;
	 	   }
	   });
	    DWREngine.setAsync(true);
	    return money;
}

function calTotalFun(){
    	totalMoney = caculateTotalMoney(bdgid,conid,changeid);	
    	totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
		if (totalMoney != treeMoney){
			var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			prompt.el.style.cursor = "pointer"
			prompt.setVisible(true);
		}else{
			prompt.el.innerHTML = "";
			prompt.setVisible(false);
		}
    }



