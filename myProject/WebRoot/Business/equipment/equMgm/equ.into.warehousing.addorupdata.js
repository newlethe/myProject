//设备入库新增或修改
var formPanel;
var noticeArr =  new Array();
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStorein";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

//设备入库详细信息清单
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var getKxNotice = "";

var pid = CURRENTAPPID;
var dsSub ;
var whereSql = "";
var warehouseManDs = new Array();
var getEquidstore =  new Array();
var equTypeArr = new Array();
var billStateArr = new Array();

var gridPanelFj;
var formPanel;


Ext.onReady(function(){
	    var formPanelName = CURRENTAPPID == "1031902"? "设备/材料入库单":"设备入库单";
		//处理设备仓库下拉框
			DWREngine.setAsync(false);
			baseMgm.getData("select uids,detailed from equ_warehouse where pid='" + pid
							+ "' order by equid ", function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							getEquidstore.push(temp);
						}
					})
			
			
		 //设备类型equTypeArr
			appMgm.getCodeValue("设备合同树分类",function(list){
				for(i = 0; i < list.length; i++) {
					if(list[i].propertyCode == "4")
						continue;
					var temp = new Array();
					temp.push(list[i].propertyCode);	
					temp.push(list[i].propertyName);		
					equTypeArr.push(temp);			
				}
			});
		//流程审批状态
	    appMgm.getCodeValue('流程状态',function(list){
	        for(i = 0; i < list.length; i++) {
	            var temp = new Array(); 
	            temp.push(list[i].propertyCode);        
	            temp.push(list[i].propertyName);    
	            billStateArr.push(temp);   
	        }
	    });
		DWREngine.setAsync(true);	
			
	// 设备仓库系统编码下来框
		var getEquid = new Ext.data.SimpleStore({
					fields : ['k', 'v'],
					data : getEquidstore
				});
        
	//处理设备仓库仓库管理员 
    	DWREngine.setAsync(false);
	    baseMgm.getData("select t.realname from rock_user t " +
	    		        "where t.unitid ='"+pid+"' and t.dept_id='03' ",function(list){
	    		            for(var i=0;i<list.length;i++){ 
                                if(list[i] != null && list[i] != ""){
	                                var temp = new Array();
		    		                temp.push(list[i]);
		    		                temp.push(list[i]);
		    		                warehouseManDs.push(temp);
                                }
	    		            }
	    		        	
	    		        })
 	
	     var getArray = new Ext.data.SimpleStore({
		    	fields: ['k','v'],   
		        data: warehouseManDs
          });
          
         	//设备开箱通知单选择窗口 
		 var chooseBtn = new Ext.Button({
				id : 'addBtn',
				text : '选择',
				iconCls : 'btn',
				handler : chooseFun
		}); 
		
        //异常设备选择	
		var abnormalOrNoBtn = new Ext.Button({
		        id : "abnormalOrNoBtn",
		        text : '异常设备入库选择',
			    iconCls : 'add',
			    style :{
			         top : 100,
			         left : 10,
			         width : 200
			    },
			    handler :  abnormalOrNoFun
		})
		
		var noticeWin = new Ext.Window({
			width : 900,
			height : 450,
			tbar : ['<font color=#15428b><B>开箱检验单<B></font>','->',chooseBtn],
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			layout : 'fit',
			closeAction : 'hide',
			items : [gridPanelNotice]
		});
		
	 var  adnormalBtn = new Ext.Button({
	         	id : 'addBtn',
				text : '选择',
				iconCls : 'btn',
				handler : adnormalFun
	 })	
	
	 var adnormalWin = new Ext.Window({
			width : 900,
			height : 450,
			tbar : ['<font color=#15428b><B>设备异常信息<B></font>','->',adnormalBtn],
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			layout : 'fit',
			closeAction : 'hide',
			items : [gridPanelAdnoral]
		});
		
		var fm = Ext.form;
		var fc = {
			     'uids' : {
				      name : 'uids',
				      fieldLabel : '主键'
			 } , 'pid' : {
				     name : 'pid',
				     fieldLabel : 'PID'
		    } , 'conid' : {
				     name : 'conid',
				     fieldLabel : '合同主键'
			} , 'treeuids' : {
			         name : 'treeuids',
			         fieldLabel : '设备合同分类树'
		    } , 'openBoxId': {
				     name:'openBoxId',
				     fieldLabel : '设备开箱主键',
					 width :0
		    }, 'finished' : {
		 	         name : 'finished',
			         fieldLabel : '完结'
		    } , 'warehouseNo' : {
		             name : 'warehouseNo',
		             fieldLabel : '入库单据号',
		             readOnly : CURRENTAPPID == "1030902"?false:true,//国金项目要求可以手动修改 yanglh 2013-12-03
		             width : 160
		    } , 'warehouseDate' : {
		    	     id:'warehouseDate',
		             name : 'warehouseDate' ,
		             fieldLabel : '入库日期',
		             readOnly : true,
				     format:'Y-m-d',
				     width:150
		    } , 'noticeNo' : {
		    	     id :'noticeNo',
				     name : 'noticeNo',
				     fieldLabel : '开箱检验单',
				     triggerClass: 'x-form-date-trigger',
				     readOnly : true,
				     emptyText: '请选择...',
				     onTriggerClick: showNoticeWin,
					 width : 160
		    } , 'warehouseMan' : {
		    	     name : 'warehouseMan',
		    	     fieldLabel : '库管员',
//					 readOnly: true,
//					 valueField: 'k',
//					 displayField: 'v',
//					 mode: 'local',
//		             typeAhead: true,
//		           	 triggerAction: 'all', 
//		           	 emptyText: '请选择...',
//		           	 store: getArray,
					 width : 160
		    } , 'makeMan' : {
		    	      name : 'makeMan',
		    	      fieldLabel : '制单人',
				      readOnly : true,
		    	      width : 140
		    } , 'supplyunit' : {
	            name : 'supplyunit',
	            fieldLabel : '供货单位',
                width : 160
	        },
		     'remark' : {
		              name : 'remark',
		              fieldLabel : '入库备注',
		              width : 760
		    } , 'abnormalOrNo' :{
		              name : 'abnormalOrNo',
		              fieldLabel : '是否异常',
		              readOnly : true,
					  hidden : true,
					  hideLabel : true,
		              width : 140
		    }
            ,'billState' : {name : 'billState',fieldLabel : '审批状态'}
            ,'flowid' : {name : 'flowid',fieldLabel : '流程编号'}
		};
		
		var saveBtn = new Ext.Button({
			id : 'saveBtn',
			text : '保存',
			iconCls : 'save',
			handler : saveFun
		});
		var cancelBtn = new Ext.Button({
			id : 'cancelBtn',
			text : '关闭',
			iconCls : 'remove',
			handler : function(){
				parent.selectWin.close();
			}
		});
		
		var Columns = [
			{name : 'uids', type : 'string'},
			{name : 'pid', type : 'string'},
			{name : 'conid', type : 'string'},
			{name : 'treeuids', type : 'string'},
			{name : 'openBoxId', ntype : 'string'},
			{name : 'finished', type : 'float'},
			{name : 'warehouseNo', type : 'string'},
			{name : 'warehouseDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
			{name : 'noticeNo', type : 'string'},
			{name : 'warehouseMan', type : 'string'},
			{name : 'makeMan',type : 'string'},
			{name : 'remark', type : 'string'},
			{name : 'abnormalOrNo',type : 'string'}
            ,{name : 'billState', type : 'string'}
            ,{name : 'supplyunit',type : 'string'},
            {name : 'flowid', type : 'string'}
            
		];	
			
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		
		var conno;
		var conname;
		 var partybno;
		DWREngine.setAsync(false);
		baseMgm.findById(beanCon, edit_conid,function(obj){
			conno = obj.conno;
			conname = obj.conname;
			partybno = obj.partybno;
		});
		
		//处理入库检验单编号
		var newRkNo = conno+"-RK-";
		equMgm.getEquNewDhNo(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,function(str){
			newRkNo = str;
		});
		DWREngine.setAsync(true);
        var bill = "1";
        /*
         * 1.不设置走流程，状态直接是 已审批(1)
         * 2.设置走流程，但是不在流程中，状态还是为已审批(1)
         * 3.设置走流程，并且是在流程中，状态为新建(0)
         * 然后控制完结的操作，只能针对已审批的单据进行完结
         */
        if(isFlwTask == true) bill = "0"
        
		if(edit_uids == null || edit_uids == ""){
			loadFormRecord = new formRecord({
				uids : '',
				pid : CURRENTAPPID,
				conid : edit_conid,
				treeuids : edit_treeuids,
				openBoxId : '',
				finished : 0,
				warehouseNo:isFlwTask==true ? flowid:newRkNo,
				warehouseDate : new Date(),
				noticeNo : getKxNotice ,
		        warehouseMan:'',
		        makeMan:REALNAME,
				remark : '',
				abnormalOrNo : '',
				supplyunit : partybno
                ,billState : bill
                ,flowid : isFlwTask==true ? flowid:newRkNo
			});
			
			whereSql = "1=2 and pid='"+pid+"'";
		}else{
		    DWREngine.setAsync(false);
			baseMgm.findById(bean, edit_uids,function(obj){
				loadFormRecord = new formRecord(obj);
			});
			DWREngine.setAsync(true);
			whereSql = "sbrk_uids='"+edit_uids+"'  and pid='"+pid+"'";
		}
		
		formPanel = new Ext.FormPanel({
		         region : 'north',
		         height : 150,
		         border : false,
		         labelAlign : 'right',
		         bodyStyle : 'padding:5px 10px;',
		         labelWidth : 80,
		         tbar : ['<font color=#15428b><B>'+formPanelName+'<B></font>','->',saveBtn,'-',cancelBtn],
		         items : [
		                 {
		                   layout : 'column',
		                   border : false,
		                   items : [
		                   	       {
		                              layout : 'form',
		                              columnWidth : .33,
		                              border  : false,
		                              items : [
		                                      	new fm.Hidden(fc['uids']),
												new fm.Hidden(fc['pid']),
												new fm.Hidden(fc['conid']),
												new fm.Hidden(fc['treeuids']),
												new fm.Hidden(fc['openBoxId']),
												new fm.Hidden(fc['finished']),
                                                new fm.Hidden(fc['billState']),
                                                new fm.Hidden(fc['flowid']),
												new fm.TextField(fc['warehouseNo']),
												new fm.Hidden(fc['supplyunit']),
												new fm.TextField(fc['warehouseMan'])
		                              ]
		                            },{
		                               layout : 'form',
		                               columnWidth : .33,
		                               border : false,
		                               items : [
		                                       new fm.DateField(fc['warehouseDate']),
		                                       new fm.TextField(fc['makeMan'])
		                               ]
		                            },{
		                                layout : 'form',
		                                columnWidth : .33,
		                                border : false,
                                        buttonAlign : 'right',
		                                items : [
		                                                                   	   
		                                          new fm.ComboBox(fc['noticeNo']),
		                                          new fm.Hidden(fc['abnormalOrNo']),
		                                          abnormalOrNoBtn
		                                ]
		                            }
		                            ]
		                 },{
		                   layout : 'column',
		                   border : false,
		                   items : [{
		                               layout : 'form',
		                               columnWidth : .93,
		                               border : false,
		                               items : [
		                                   new fm.TextArea(fc['remark'])
		                               ]
		                            }]
		                 
		                 }
		         ]
		})
	//对异常设备和正常开箱设备修改时进行二选一控制
	if(banFlag=='1'){
		Ext.getCmp('noticeNo').setDisabled(true);
	    abnormalOrNoBtn.setDisabled(false);
	}else if(banFlag=='0'){
   	   Ext.getCmp('noticeNo').setDisabled(false);
       abnormalOrNoBtn.setDisabled(true);
	}	
	//----------------------入库详细清单--------------------------------
		var fcSub = {
			'uids' : {name : 'uids',fieldLabel : '主键'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'sbrkUids' : {name : 'sbrkUids' ,fieldLabel : '设备入库主表主键'},
			'boxSubId' : {name : 'boxSubId',fieldLabel : '设备开箱明细表主键'},
			'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
			'warehouseType' : {
				name : 'warehouseType',
				fieldLabel : '设备类型',
				readOnly: true,
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	           	triggerAction: 'all'
				},
			'warehouseName' : {name : 'warehouseName',fieldLabel : '设备部件名称'},
			'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
			'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
			'unit' : {name : 'unit',fieldLabel : '单位'},
			'warehouseNum' : {name : 'warehouseNum',fieldLabel : '检验数量'},
			'inWarehouseNo' : {name : 'inWarehouseNo',fieldLabel : '入库数量', decimalPrecision : 4},
			'weight' : {name : 'weight', fieldLabel : '重量（kg）',decimalPrecision : 3},
			'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价'},
			'totalMoney' : {name : 'totalMoney',fieldLabel : '入库总价'},
		    'equno' : {
		    	        id : 'equno',
		                name : 'equno',
		                fieldLabel : '入库存放库位',
		                mode : 'local',
						editable:false,
						valueField: 'k',
						displayField: 'v',
						readOnly:true,
			            listWidth: 220,
			            lazyRender:true,
			            triggerAction: 'all',
			            store : getEquid,
						tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			            listClass: 'x-combo-list-small'
					     },
			'memo' : {name : 'memo',fieldLabel : '备注'}
		};
		
		var equnoComboBox = new fm.ComboBox(fcSub['equno']);
		equnoComboBox.on('beforequery', function() {
			storTreePanel.on('beforeload', function(node) {
						var parent = node.attributes.equid;
						if (parent == null || parent == "")
							parent = '01';
						var baseParams = storTreePanel.loader.baseParams;
						baseParams.orgid = '0';
						baseParams.parent = parent;
					})
			storTreePanel.render('tree');
			storTreeRoot.reload();
		})
		storTreePanel.on('click',function(node,e){
				var elNode = node.getUI().elNode;
				var treename = node.attributes.treename;
				var uids = elNode.all("uids").innerText;
				equnoComboBox.setValue(uids)
				equnoComboBox.collapse();
		})
		var smSub = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true
		});
		
		var cmSub = new Ext.grid.ColumnModel([
			//smSub,
			new Ext.grid.RowNumberer({
				header : '序号',
				width : 35
			}),
			{
				id : 'uids',
				header : fcSub['uids'].fieldLabel,
				dataIndex : fcSub['uids'].name,
				hidden : true
			},{
				id : 'pid',
				header : fcSub['pid'].fieldLabel,
				dataIndex : fcSub['pid'].name,
				hidden : true
			},{
			    id : 'sbrkUids',
				header : fcSub['sbrkUids'].fieldLabel,
				dataIndex : fcSub['sbrkUids'].name,
				hidden : true//boxSubId
			},{
			    id : 'boxSubId',
				header : fcSub['boxSubId'].fieldLabel,
				dataIndex : fcSub['boxSubId'].name,
				hidden : true		
			},{
			    id : 'boxNo',
			    header : fcSub['boxNo'].fieldLabel,
			    dataIndex : fcSub['boxNo'].name,
			    align : 'right'
			},{
				id : 'warehouseType',
				header : fcSub['warehouseType'].fieldLabel,
				dataIndex : fcSub['warehouseType'].name,
			    align : 'center',
				renderer : function(v){
					var equ = "";
					for(var i=0;i<equTypeArr.length;i++){
						if(v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				}
			},{
				id : 'warehouseName',
				header : fcSub['warehouseName'].fieldLabel,
				dataIndex : fcSub['warehouseName'].name,
			    align : 'center',
			    width : 200
			},{
				id : 'ggxh',
				header : fcSub['ggxh'].fieldLabel,
				dataIndex : fcSub['ggxh'].name,
				align : 'center',
				width : 100
			},{
				id : 'graphNo',
				header : fcSub['graphNo'].fieldLabel,
				dataIndex : fcSub['graphNo'].name,
				align : 'center',
				width : 100
			},{
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
			    align : 'center',
				width : 180
			},{
				id : 'warehouseNum',
				header : fcSub['warehouseNum'].fieldLabel,
				dataIndex : fcSub['warehouseNum'].name,
				align : 'right',
				width : 80
			},{
			    id : 'weight',
			    header : fcSub['weight'].fieldLabel,
				dataIndex : fcSub['weight'].name,
				align : 'right',
				width : 80			   
			},{
				id : 'inWarehouseNo',
				header : fcSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcSub['inWarehouseNo'].name,
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				editor : new fm.NumberField(fcSub['inWarehouseNo']),
				align : 'right',
				width : 80
			},{
				id : 'intoMoney',
				header : fcSub['intoMoney'].fieldLabel,
				dataIndex : fcSub['intoMoney'].name,
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				editor : new fm.NumberField(fcSub['intoMoney']),
			    align : 'right'
				
			},{
			    id : 'totalMoney',
			    header : fcSub['totalMoney'].fieldLabel,
				dataIndex : fcSub['totalMoney'].name,
			    align : 'right',
				renderer : function(v,m,r){
					return r.get("intoMoney")*r.get("inWarehouseNo");
			    }
			},{
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v,m,r){
					var equno = "";
					m.attr = "style=background-color:#FBF8BF";
					for(var i=0;i<getEquidstore.length;i++){
						if(v == getEquidstore[i][0])
							equno = getEquidstore[i][1];
					}
					return equno;
				},
			    align : 'center',
				editor : equnoComboBox
			},{
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
			    align : 'center',
				editor : new fm.TextField(fcSub['memo']),
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				width : 200
			}
		]);
		
		var ColumnsSub = [
			{name:'uids', type:'string'},
			{name:'pid', type:'string'},
			{name:'sbrkUids', type:'string'},
			{name:'boxSubId',type:'string'},
			{name: 'boxNo', type: 'string'},
			{name:'warehouseType', type:'string'},
			{name:'warehouseName', type:'string'},
			{name:'ggxh', type:'string'},
			{name:'graphNo', type:'string'},
			{name:'unit', type:'string'},
			{name:'warehouseNum', type:'float'},
			{name:'weight', type:'float'},
			{name:'inWarehouseNo', type:'float'},
			{name:'intoMoney', type:'float'},
			{name:'totalMoney', type:'float'},
			{name:'equno', type:'string'},
			{name:'memo', type:'string'}
			
		];
		
		var dsSub = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: beanSub,
		    	business: businessSub,
		    	method: listMethodSub,
		    	params: whereSql
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: primaryKeySub
	        }, ColumnsSub),
	        remoteSort: true,
	        pruneModifiedRecords: true	
	    });
	    dsSub.setDefaultSort(orderColumnSub, 'desc');	//设置默认排序列
	    
	    var PlantSub = Ext.data.Record.create(ColumnsSub);
	    var PlantIntSub = {
				uids : '',
				pid : CURRENTAPPID,
				sbrkUids: '',
				boxSubId:'',
				warehouseType : '',
				warehouseName : '',
				ggxh : '',
				unit : '',
				boxNo : '',
				boxName : '',
				warehouseNum : '',
				weight : '',
				inWarehouseNo : '',
				intoMoney : '',
				totalMoney : '',
				equno : '',
				memo : ''
		}
	  var saveGridBtn = new Ext.Button({
			id : 'saveBtn',
			text : '保存',
			iconCls : 'save',
			//hidden:true,
			handler : saveGridFun
		});
		
		var delBtn = new Ext.Button({
			text : '删除',
			iconCls : 'remove',
			//hidden:true,
			handler : delGridFun
		});
		
		//if(banFlag == '1'){
		//   delBtn.setDisabled(false);
		//}else if(banFlag == '0'){
		 //  delBtn.setDisabled(true);
		//}
		
		var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
			ds : dsSub,
			cm : cmSub,
			sm : smSub,
            title : formPanelName+'明细',
			tbar : ['<font color=#15428b><B>'+formPanelName+'明细<B></font>','-',saveGridBtn,'-',delBtn],
			header: false,
			height : document.body.clientHeight*0.5,
		    border: false,
			autoWidth : true,
		    region: 'center',
		    addBtn : false, // 是否显示新增按钮
		    saveBtn : false, // 是否显示保存按钮
		    delBtn : false, // 是否显示删除按钮
	        stripeRows:true,
	        loadMask : true,
		    viewConfig: {
		        forceFit: false,
		        ignoreAdd: true
		    },
		    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: dsSub,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        }),
	        plant : PlantSub,
			plantInt : PlantIntSub,
			servletUrl : MAIN_SERVLET,
			bean : beanSub,
			business : businessSub,
			primaryKey : primaryKeySub
	        
		});
        
        var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
                "?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=KX";
	    var filePanel = new Ext.Panel({
	        id : 'filePanel',
	        title : '附件',
	        layout: 'fit',
	        html:"<iframe id='fileWinFrame' src='"+url+"' width='100%' height='100%' frameborder='0'></iframe>"
	    });
	    
	    var tabPanel = new Ext.TabPanel({
	        activeTab : 0,
	        border: false,
	        region: 'center',
	        items: [gridPanelSub]
	    })
			
		var viewPort = new Ext.Viewport({
			layout:'border',
		    items: [formPanel,tabPanel]
		});	
				
		  formPanel.getForm().loadRecord(loadFormRecord);
		  dsSub.load();
		  //---------------function-------------
		
		   
	  //form表单保存
	   function saveFun(){
			    var flag = true; 
		     	var form = formPanel.getForm();
		     	var getConid = form.findField("conid").getValue();
		     	var getWarehouseNo = form.findField("warehouseNo").getValue();
		     	form.findField("abnormalOrNo").setValue(banFlag);
		     	if(CURRENTAPPID == "1030902"){
					//允许修改到货单号，修改后判断是否修该的单号是否存在 yanglh 2013-12-03
			     	var getUids = '';
					DWREngine.setAsync(false);
					baseDao.getData("select uids from EQU_GOODS_STOREIN where warehouse_no='"+form.findField("warehouseNo").getValue()+"'",function(list){
						if(list.length>0){
							getUids = list;
						}
					});
					DWREngine.setAsync(false);
					if((getUids != '')&& (getUids != form.findField("uids").getValue())){
						Ext.example.msg('系统提示','该入库单据号已存在！请修改！');
						return;
					}		     	
		     	}
		     	var obj = new Object();
				for (var i = 0; i < Columns.length; i++) {
					var name = Columns[i].name;
					var field = form.findField(name);
					if (field != null) {
						obj[name] = field.getValue();
					}
				}
		      	DWREngine.setAsync(false);
				equMgm.saveOrUpdataEquRkGoodsStorein(obj,pid,edit_uids,'EQUOTHER',function(text){
				            if(text == 'success'){
				               Ext.example.msg('提示信息','保存成功！');
				            }else if(text == 'failure'){
				               Ext.example.msg('提示信息','保存失败！');
				            }else if(text == 'repeat'){
				               Ext.example.msg('提示信息','您保存的记录已存在！');
				            }
				})
				DWREngine.setAsync(true);
				DWREngine.setAsync(false);
				baseMgm.getData("select uids from equ_goods_storein " +
						        "where conid='"+getConid+"' and  warehouse_no='"+getWarehouseNo+"' and pid='"+pid+"'",function(text){
						 formPanel.getForm().findField("uids").setValue(text);        
				 })
				DWREngine.setAsync(true);
				
		}
		
		//设备详细信息保存
		function saveGridFun(){
			var records = dsSub.getModifiedRecords();
            for (var i = 0; i < records.length; i++) {
                var r = records[i]
				r.set("totalMoney",r.get("intoMoney")*r.get("inWarehouseNo"));
            }
			gridPanelSub.defaultSaveHandler();
		}
		
		//异常设备详细信息删除
		function delGridFun(){
			 var record = gridPanelSub.getSelectionModel().getSelected();
			 var getPid = record.get("pid");
			 var getUids = record.get("uids");
			 Ext.Msg.confirm('系统提示','是否要删除记录',function(btn){
			           if(btn=='yes'){
			           		 DWREngine.setAsync(false);
							 equMgm.checkExceBox(getUids,getPid,function(text){
							     if(text=='success'){
							         Ext.example.msg('提示信息','删除成功！');
							         dsSub.baseParams.params=whereSql;
							         dsSub.load();
							     }else{
							     	Ext.example.msg('提示信息','删除失败！');
							     }
							 })
							 DWREngine.setAsync(true);
			           
			           }
			 })

		}
		
		//打开设备开箱选择窗口
		function showNoticeWin(){
			if(banFlag == "1") return;
			var uids = formPanel.getForm().findField("uids").getValue();
			if(uids == null || uids == ""){
				Ext.example.msg('提示信息','请先保存设备入库单信息！');
				return;
			}
			dsNotice.baseParams.params = "open_no not in (select noticeNo from EquGoodsStorein t " +
		    			                 "where pid='"+pid+"' and NOTICE_NO <>' ') " +
		    			                 "and finished='1' and isStorein <>1 and pid='"+pid+"'"
			dsNotice.load();
			noticeWin.show();
			var noticeId = formPanel.getForm().findField("noticeNo").getValue();
			if(noticeId == ""){
				dsSub.baseParams.params = " 1=2 and pid='"+pid+"'";
			}else{
				dsSub.baseParams.params = "sbrk_uids='"+uids+"' and pid='"+pid+"'";
				}
				    dsSub.load({params:{start:0,limit:PAGE_SIZE}});
			}	

	   //设备正常开箱处理
	   function chooseFun(){
	   			var list = gridPanelNotice.getSelectionModel().getSelections();
		        var  rec = gridPanelNotice.getSelectionModel().getSelected();
		        var getUids = formPanel.getForm().findField('uids').getValue();
		        var openUids = '';
		        if(list == null || list == ""){
		               Ext.example.msg('提示信息','请选择设备开箱检验记录！');
		               return ;
		        }else{
		        	for(var i=0;i<list.length;i++){
		        		var re = list[i];
		        		if(list.length == 1){
		        			getKxNotice =re.data.openNo;
		        			openUids = ""+re.data.uids+"";
		        		}else{
		        			if(i>=0&&i<list.length-1){
		        				getKxNotice +=""+re.data.openNo+",";
		        				openUids += ""+re.data.uids+",";
		        			}else{
		        				getKxNotice +=""+re.data.openNo+"";
		        				openUids += ""+re.data.uids+"";
		        			}
		        		}
		        	}
		            Ext.example.msg('提示信息','您请选择了一条设备开箱检验记录！');
		            formPanel.getForm().findField('noticeNo').setValue(getKxNotice);
		            DWREngine.setAsync(false);
		            equMgm.SetListEquRkGoodsStorein(openUids,rec.data.pid,getUids,getKxNotice,function(text){
		            	if(text == "success"){
		            	   dsSub.baseParams.params="sbrk_uids='"+getUids+"' and pid='"+pid+"'";
		            	   dsSub.load({params:{start:0,limit:PAGE_SIZE}});
		            	}
		            })
		            DWREngine.setAsync(true);
		            noticeWin.hide();
		            delBtn.setDisabled(true);
		            abnormalOrNoBtn.setDisabled(true);
		            formPanel.getForm().findField("openBoxId").setValue(rec.get('uids'));
		            banFlag = "0";
		        }
		}	
				
	   //异常设备处理
		function abnormalOrNoFun(){
		      	var uids = formPanel.getForm().findField("uids").getValue();
		        if(uids == null || uids == ""){
			    	Ext.example.msg('提示信息','请先保存设备入库单信息！');
				        return;
		        }
		       dsAdnoral.baseParams.params= "uids not in(select boxSubId from EquGoodsStoreinSub  where pid='"+pid+"' and boxSubId <> ' ')" +
	    			                        " and exception ='1' and isStorein <> 1 and finished = '1' and pid='"+pid+"'"
		       dsAdnoral.load();
			   adnormalWin.show();
		}
			
		//异常设备选择保存
		function adnormalFun(){
			var flag=0;
			var recored =  gridPanelAdnoral.getSelectionModel().getSelections();
			var getUids = formPanel.getForm().findField('uids').getValue();
			if(recored == null || recored == ""){
			      Ext.example.msg('提示信息','请选择异常设备入库信息！');
			      return false;
			} else {
				 var temp = new Array();
				 for(var i=0;i<recored.length;i++){
				      temp.push(recored[i].data)
				 }
			    gridPanelAdnoral.getEl().mask("loading...");
			    DWREngine.setAsync(false);
		        equMgm.addAbnormalList(temp,getUids,pid,function(text){
			    	     if(text == "success")
			    	       flag =1;
			    	})
			    DWREngine.setAsync(true);
			    gridPanelAdnoral.getEl().unmask();
			    if(flag  == '1'){
			    	  var uids = formPanel.getForm().findField("uids").getValue();
				      Ext.example.msg('提示信息','您选择了'+recored.length+'异常设备入库信息！');
				      adnormalWin.hide()
				      dsSub.baseParams.params = "sbrk_uids='"+uids+"' and pid='"+pid+"'";
				      dsSub.load({params:{start:0,limit:PAGE_SIZE}});
			    }
			    adnormalWin.hide();
			    Ext.getCmp("noticeNo").setDisabled(true);
//			    delBtn.setDisabled(false);
			    banFlag = "1";
			    return true;
			}
			return false;
		}
})
		
