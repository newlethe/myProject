var bean = "com.sgepit.pmis.contract.hbm.ConOveView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var propertyName = "condivno"
var grid;
var partBs = new Array();
var contractType = new Array();
var contarctType2 = new Array();
var contractTypeArr=new Array();
var contractTypeArr2=new Array();
var contractStateArr=new Array();
var currentPid=CURRENTAPPID;
if(pid!=""){
	currentPid =pid;
}
var bidtype = new Array();
var BillState = new Array();
var BillStateNoFilter = new Array();
var defaultFirstSort = "";
var defaultFirstSortName = "";
var dsCombo2 = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['', '']]
		});
var flowWindow;
var CON_SERVLET=CONTEXT_PATH +"/servlet/ConServlet";
var conDiv; // 导出时合同一级分类
var conSort = '-1'; // 导出时合同二级分类
var gridfiter = "";
//动态数据过滤条件
var outFilter ="1=1";
if(CONIDS!=""){
	var len=CONIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" conid in ("+str+")";
}
gridfiter = "pid = '" + currentPid + "'";
var paramsStr = ""; //ds传递参数
var dsflag=false; //默认没有选择触发
var filter1 = '1=1'; // 下拉菜单一级分类过滤
var filter2 = '1=1'; // 下拉菜单二级分类过滤
var filter3 = '1=1'; // 下拉菜单合同状态过滤
var tip='-';
var spaceTwo='&nbsp;&nbsp;';
var spaceOne='&nbsp;';
var btnDisabled = dyView=='true'?true:(ModuleLVL != '1');
var selectedConid,selectedConno,getConid;
var conname,selectedconvalue;
/*合同下拉框说明:
 * 状态下拉框表示所有的默认键值对是:-2 所有状态;
 * 合同分类一分类二默认键值对都是:-1 所有合同
 * */
Ext.onReady(function() {

	// zhangh 2010-10-28 当前分类合同累计总金额
	var allTotalMoney = new Ext.Button({
				id:"allTotalMoney"
			})
	var allHasPayMoney = new Ext.Button({
				id:"allHasPayMoney"
			})
	var allHasPayRateMoney = new Ext.Button({
				id:"allHasPayRateMoney"
			})
	/*
	var textTotalMoney = new Ext.form.TextField({
				readOnly : true,
				style : "color:blue"
			})
	*/
	DWREngine.setAsync(false);
	DWREngine.beginBatch();
	conpartybMgm.getPartyB(function(list) { // 获取乙方单位
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);
			temp.push(list[i].partyb);
			partBs.push(temp);
		}
	});
	appMgm.getCodeValue('合同划分类型',function(list){ 
        var com1 = new Array();
        com1.push('-1');
        com1.push('所有合同');
        contractType.push(com1);
		for (i = 0; i < list.length; i++) {
			if (i == 0) {
			    if(parent.combox1!=""&&parent.combox1&&backFlag!=null&&backFlag==1){
			        defaultFirstSort=parent.combox1;
			        defaultFirstSortName=parent.combox1value;
			    }else{
					defaultFirstSort = '-1'//list[i].propertyCode
					defaultFirstSortName = '所有合同'//list[i].propertyName
			    }
				contarctType2 = new Array()
				contarctType2.push(['-1', '所有合同'])
				appMgm.getCodeValue(defaultFirstSortName, function(list2) {
							for (j = 0; j < list2.length; j++) {
								var temp = new Array();
								temp.push(list2[j].propertyCode);
								temp.push(list2[j].propertyName);
								contarctType2.push(temp);
								contractTypeArr2.push(list2[j].propertyCode);
							}
						});
				if(parent.combox1 && parent.combox1!='-1'){
					dsCombo2.loadData(contarctType2);
				}else {
					dsCombo2.removeAll();
					var ds2 = new Array();
					ds2.push(['-1', '所有合同']);
					dsCombo2.loadData(ds2);
				}		
			}
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			contractType.push(temp);
			contractTypeArr.push(list[i].propertyCode);
		}
	})
			
	appMgm.getCodeValue('合同状态', function(list) { // 获取合同状态
		if(list!=null&&list.length>0){
			var temp = new Array();
			temp.push('-2');
	    	temp.push('所有状态');
	        BillState.push(temp);
		} 
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			 contractStateArr.push(list[i].propertyCode);
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName);
	        BillStateNoFilter.push(temp);
            if(list[i].propertyCode=='-1'||list[i].propertyCode=='1'||list[i].propertyCode=='2'){
	            var temp = new Array();
	            temp.push(list[i].propertyCode);
	            temp.push(list[i].propertyName);
	            BillState.push(temp);
              }
          }
	});
	// zhangh 2010-10-27 获取招标批号
   baseMgm.findAll('com.sgepit.pcmis.bid.hbm.PcBidZbContent',function(list){   
     	//获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].uids);		
			temp.push(list[i].contentes);	
			bidtype.push(temp);			
		}
    }); 
	DWREngine.endBatch();
	DWREngine.setAsync(true);
	var dsPartB = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : partBs
			});
	var dsContractType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : contractType
			});
	var dsBillState = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : BillState
			});
	var dsBillStateNoFilter = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : BillStateNoFilter
			});
	// zhangh 2010-10-27 招标批次数据
	var dsbidtype = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidtype
			});

	// 1. 创建选择模式
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	// 2. 创建列模型
	var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',    
			fieldLabel : '主键',   //1
			anchor : '95%',
//			hidden : true,
			hideLabel : true
		},
		'pid' : {            
			name : 'pid', 
			fieldLabel : '工程项目编号',    //2
//			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'conno' : {
			name : 'conno',  
			fieldLabel : '合同编号',     //3
			anchor : '95%'
		},
		'conname' : {
			name : 'conname',
			fieldLabel : '合同名称',   //4
			anchor : '95%'
		},'bidtype' : {
            name : 'bidtype', 
            fieldLabel : '招标内容',    //5
            readOnly : true,
            valueField : 'k',
            displayField : 'v',
            mode : 'local',
            typeAhead : true,
            triggerAction : 'all',
            store : dsbidtype,
            lazyRender : true,
            listClass : 'x-combo-list-small',
//          hidden : true,
            hideLabel : true,
            anchor : '95%'
        },'convaluemoney' : {    
            name : 'convaluemoney', 
            fieldLabel : '合同总金额',     //6
            anchor : '95%'
        },'conmoney' : {  
            name : 'conmoney',   
            fieldLabel : '合同签定金额',    //7
            anchor : '95%'
        },'conpay':{       
           name : 'conpay',
           fieldLabel : '已付款金额',       //8
           anchor : '95'
        },'coninvoicemoney': {  
           name : 'coninvoicemoney',
           fieldLabel : '发票金额',         //9
           anchor : '95%'
        },'differencemoney':{  
           name : 'differencemoney',
           fieldLabel : '合同未付金额',      //10
           anchor : '95%'
        } ,'realdifferencemoney':{ 
            name : 'realdifferencemoney',    
            fieldLabel : '预付金额',           //11
            anchor : '95%' 
        },'partybno' : {   
            name : 'partybno',
            fieldLabel : '乙方单位',         //13
            valueField : 'k',
            displayField : 'v',
            mode : 'local',
            typeAhead : true,
            triggerAction : 'all',
            store : dsPartB,
            lazyRender : true,
            listClass : 'x-combo-list-small',
            anchor : '95%'
        },'signdate' : {   
            name : 'signdate', 
            fieldLabel : '签订日期',         //14
            format : 'Y-m-d',
            minValue : '2000-01-01',
            anchor : '95%'
        },'performancedate': {  
            name : 'performancedate',
            fieldLabel : '履约保函到期日',     //15
            format : 'Y-m-d',
            anchor : '95%'          
        },'contractors':{
            name : 'contractors', 
            fieldLabel : '承办人',           //16
            anchor : '95%'
        },'contractordept':{
           name : 'contractordept',  
           fieldLabel : '承办部门',          //17
           anchor :'95%'
        },'billstate' : {   
            name : 'billstate',   
            fieldLabel : '合同状态',         //18
            readOnly : true,
            valueField : 'k',
            displayField : 'v',
            emptyText : '合同审定',
            mode : 'local',
            typeAhead : true,
            triggerAction : 'all',
            store : dsBillState,
            lazyRender : true,
            listClass : 'x-combo-list-small',
//          hidden : true,
            hideLabel : true,
            anchor : '95%'
        }
       
//        ,'isChange' : {
//			name : 'isChange',  
//			fieldLabel : '是否变更',
////		hidden : true,
//			hideLabel : true,
//			anchor : '95%'
//		}
		// zhangh 2010-10-27
		
	}

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
    	sm,
            {
                id : 'conid', 
                type : 'string',
                header : fc['conid'].fieldLabel,
                dataIndex : fc['conid'].name,
                hidden : true,
                width : 60

            }, {
                id : 'pid',   
                type : 'string',
                header : fc['pid'].fieldLabel,
                dataIndex : fc['pid'].name,
                hidden : true,
                width : 60

            }, {
                id : 'conno',    
                type : 'string',
                header : fc['conno'].fieldLabel,
                dataIndex : fc['conno'].name,
//              align : 'center',
                width : 150,
                // 鼠标悬停时显示完整信息
                renderer :  function(data, metadata, record, rowIndex,
                        columnIndex, store) {
                var qtip = "qtip=" + data;
                return '<span ' + qtip + '>' + data + '</span>';
                    return data;
                }
            }, {
                id : 'conname', 
                type : 'string',
                header : fc['conname'].fieldLabel,
                dataIndex : fc['conname'].name,
                width : 250,
                renderer :renderConno
            }, {
                id : 'bidtype', 
                type : 'combo', // 加入此行，查询中会出现“招标批次”
                header : fc['bidtype'].fieldLabel,
                dataIndex : fc['bidtype'].name,
                // disabled : true,
                align : 'left',
                width : 160,
                hidden : true,
                renderer : bidtypeRender,
                store : dsbidtype
                // 查询中的数据
            },{
                id : 'convaluemoney',
                type : 'float',
                header : fc['convaluemoney'].fieldLabel,
                dataIndex : fc['convaluemoney'].name,
                width : 100,
                align : 'right',
                renderer : isChange
            }, {
                id : 'conmoney',
                type : 'float',
                header : fc['conmoney'].fieldLabel,
                dataIndex : fc['conmoney'].name,
                width : 100,
                hidden : true,
                align : 'right',
                renderer : cnMoneyToPrec
            },{
                id : 'conpay',
                type : 'float',
                header : fc['conpay'].fieldLabel,
                dataIndex : fc['conpay'].name,
                width : 100,
                align : 'right',
                renderer : cnMoneyToPrec
            
            },{
                id : 'coninvoicemoney',
                type : 'float',
                header : fc['coninvoicemoney'].fieldLabel,
                dataIndex : fc['coninvoicemoney'].name,
                width : 100,
                hidden : true,
                align : 'right',
                renderer :cnMoneyToPrec
            },{
                id : 'differencemoney',
                type : 'float',
                header : fc['differencemoney'].fieldLabel,
                dataIndex : fc['differencemoney'].name,
                width : 100,
//              hidden : true,
                align : 'right',
                renderer : function (v,p,r){
                  return  cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'),p);
                }
            },{
               id : 'realdifferencemoney',
               type : 'float',
               header : fc['realdifferencemoney'].fieldLabel,
               dataIndex : fc['realdifferencemoney'].name,
               align:'right',
               hidden : true,
               renderer : function (v,p,r){
                   return cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'),p);
               }
            },      
            {
                id : 'partybno',
                type : 'combo',
                header : fc['partybno'].fieldLabel,
                dataIndex : fc['partybno'].name,
                width : 150,
//              align : 'center',
                renderer : partbRender,
                store : dsPartB
            },{
                id : 'signdate',
                type : 'date',
                header : fc['signdate'].fieldLabel,
                dataIndex : fc['signdate'].name,
                align : 'center',
                width : 80,
                renderer : formatDate
            },{
                id : 'performancedate',
                type : 'date',
                header : fc['performancedate'].fieldLabel,
                dataIndex : fc['performancedate'].name,
                align : 'center',
                width : 120,
                hidden : true,
                renderer : formatDate
            },{
                id :'contractors',
                type : 'string',
                header : fc['contractors'].fieldLabel,
                dataIndex :fc['contractors'].name,
                width : 100,
                hidden : true,
                align : 'center'
            },{
                id : 'contractordept',
                type : 'string',
                header : fc['contractordept'].fieldLabel,
                dataIndex : fc['contractordept'].name,
                width :100,
                hidden : true,
                align : 'center'
            },{
                id : 'billstate',
                type : 'combo',
                header : fc['billstate'].fieldLabel,
                dataIndex : fc['billstate'].name,
                disabled : true,
                align : 'center',
                width : 80,
                renderer : BillStateRender,
                store : dsBillState
            }
//           , {
//                id : 'isChange',  
//                header : fc['isChange'].fieldLabel,
//                dataIndex : fc['isChange'].name,
//                width : 60,
//                hidden : true,
//                align : 'center'
//
//            }
    ]);
	cm.defaultSortable = true;// 设置是否可排序

//国金需求默认显示列
	var reg = /^10309/;
	var result =  reg.exec(currentPid);
	if(result!=null){
		 cm.setHidden(cm.findColumnIndex("coninvoicemoney"),false);
		 cm.setHidden(cm.findColumnIndex("realdifferencemoney"),false);
		 cm.setHidden(cm.findColumnIndex("performancedate"),false);
		 cm.setHidden(cm.findColumnIndex("billstate"),true);
	}

	// 3. 定义记录集
	var Columns = [{
				name : 'conid', 
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',  
				type : 'string'
			}, {
				name : 'conno', 
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'partybno',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			},{
                name : 'contractors', 
                type : 'string'
            },{
                name : 'contractordept', 
                type : 'string'
            },{
                name : 'conpay', 
                type : 'float'
            },{
                name : 'coninvoicemoney', 
                type : 'float'
            },{
                name:  'differencemoney',
                type:  'float'
            }, {
				name : 'convaluemoney', 
				type : 'float'
			},{
                name : 'signdate', 
                type : 'date',
                dateFormat : 'Y-m-d H:i:s'
            },{
                name : 'performancedate',
                type : 'date',
                dateFormat : 'Y-m-d H:i:s'
            }, {
				name : 'billstate', 
				type : 'string'
			}, {
				name : 'isChange', 
				type : 'string'
			}, 
			// zhangh 2010-10-27 bidtype
			{
				name : 'bidtype',  
				type : 'string'
			}];
	// zhangh 2010-10-28 新增总金额的数据源
	var dsTotal = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : gridfiter,
			outFilter :outFilter
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'cpid'
				}, Columns),
		// sortInfo:{field:'conid',direction:'DESC'},
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'listPcBusinessCon',
			params : gridfiter,
			outFilter :outFilter,
			sj:sj,
			type:type,
			pid:currentPid
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CON_SERVLET
				}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'cpid'
				}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	
    ds.on('beforeload', function(){
    	if(backFlag!=null&&backFlag==1){//由返回页面带过来的参数值
	        if(parent.comboCat2!=""){//返回时给分类二赋值
	        	combo2.setValue(parent.comboCat2);
	        }  
	    	ds.baseParams.params=parent.conMainSerachStr;//点返回按钮时父窗口的值
	    }
	    parent.conMainSerachStr=ds.baseParams.params; 
    });
    
	ds.on('load', function() {
		if(parent.dsparams!=""&&parent.dsparams!=undefined){
		    if(dsflag==true){
		        ds.baseParams.params=paramsStr;
		        parent.dsparams=paramsStr;
		    }else {
		        ds.baseParams.params=parent.dsparams;
		    }
		}else {
		    parent.dsparams=paramsStr;
		    ds.baseParams.params = paramsStr;
		}
		dsTotal.baseParams.params =ds.baseParams.params;
		dsTotal.load();
		//textTotalMoney.setValue(cnMoneyToPrec(ds.sum('convaluemoney')))
		backFlag=0;//返回之后将返回标记清零
	})
	
	dsTotal.on('load', function() {
		allTotalMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('convaluemoney'))+"</font>")
		allHasPayMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('conpay'))+"</font>")
		if(dsTotal.sum('convaluemoney')!=0&&dsTotal.sum('conpay')!=0){
			var rate=(dsTotal.sum('conpay')/dsTotal.sum('convaluemoney'))*100
           	rate=rate.toFixed(4)
			allHasPayRateMoney.setText("<font color=red size=2>"+rate+""+"%"+"</font>")		
		}else{
			allHasPayRateMoney.setText("<font color=red size=2>"+"0.0000"+""+"%"+"</font>")
		}
	})

	// 5. 创建可编辑的grid: grid-panel
	// 在grid的tbar上增加 ComboBox
	var combo = new Ext.form.ComboBox({
		store : dsContractType,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择合同分类一....',
		selectOnFocus : true,
		width : 110
	});
	if(defaultFirstSort!=""){
		combo.setValue(defaultFirstSort);
		conDiv = defaultFirstSort;
	}		
	combo.on('select', comboselect);
	// zhangh 2010-10-18 新增过滤条件，分类一条件
	if(defaultFirstSort!='-1'){
		filter1 = propertyName + "='" + defaultFirstSort + "'";
	}
	paramsStr = filter1;
	if (gridfiter != ''){
		paramsStr += " and " + gridfiter;
	}
	fixedFilterPart = paramsStr;
	var combo2 = new Ext.form.ComboBox({
		store : dsCombo2,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择合同分类二....',
		selectOnFocus : true,
		disabled : true,
		width : 110
	});	


	if (parent.combox1!= "") {
		combo2.setDisabled(false)
	}
	if(-1==combo.getValue()){
		combo2.setDisabled(true)	
	}
	combo2.on('select', comboselect2);

	//合同分类一下拉框事件
	function comboselect() {
	    dsflag=true;
		combo2.clearValue();
		combo2.setDisabled(true);
		conDiv = combo.getValue();
		parent.combox1=conDiv;
		var conDivDesc = combo.getRawValue();
		parent.combox1value=conDivDesc;
		if (conDiv == "-1") {
			paramsStr = gridfiter
			parent.combox1='-1';
			fixedFilterPart = paramsStr
		} else {
			paramsStr = (gridfiter == '') ? propertyName + "='"
					+ conDiv + "' " : propertyName + "='" + conDiv + "' and "
					+ gridfiter;
			fixedFilterPart = paramsStr
			DWREngine.setAsync(false);
			contarctType2 = new Array();
			contarctType2.push(['-1', '所有合同']);
			appMgm.getCodeValue(conDivDesc, function(list) { // 获取工程合同划分类型
						for (i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i].propertyCode);
							temp.push(list[i].propertyName);
							contractTypeArr2.push(list[i].propertyCode);
							contarctType2.push(temp);
						}
					});
			if (conDiv != "-1" && contarctType2.length > 0) {
				dsCombo2.loadData(contarctType2);
				combo2.setDisabled(false)
			}
			DWREngine.setAsync(true);
		}
		// zhangh 2010-10-18 新增过滤条件，分类一被选择后的条件
		if(conDiv!='-1'){
			filter1 = propertyName + "='" + conDiv + "'";
		}else {
			filter1 = '1=1';
		}
		paramsStr = filter1;
		if (gridfiter != '')
			paramsStr += " and " + gridfiter;
			fixedFilterPart = paramsStr;
		reload();
	}

	// **********分类二选择后执行函数**********
	function comboselect2() {
	    dsflag=true;
		conSort = combo2.getValue();
		var value = combo2.getValue();
		parent.combox2=value;
		parent.comboCat2=value;
		
		if (value != '-1') {
			filter2 = "sort = '" + value + "'";
			paramsStr = filter1 + " and " + filter2;
			fixedFilterPart = paramsStr
		} else {
			paramsStr = filter1;
			fixedFilterPart = paramsStr
		}
		if (gridfiter != '')
			paramsStr += " and " + gridfiter;
			fixedFilterPart = paramsStr;	
		    reload();
	}
	
	var  addToolbar = new Ext.Toolbar({
   	    items : ['合同分类&nbsp;&nbsp;',combo,spaceOne,
   	             combo2, spaceTwo,'-',
   	             '当前分类合同总金额:', allTotalMoney,
   	             '&nbsp;&nbsp;&nbsp;',  '已付金额:', allHasPayMoney,
   	             '&nbsp;&nbsp;&nbsp;', '已付比例:', allHasPayRateMoney,
   	             '->','计量单位:元'
   	             ]
   	             //'<font color=red>其中本页累计：</font>', textTotalMoney]
   })
	var btnConDetailInfo = new Ext.Button({
		id : 'contractDetail',
		text : '详细信息',
		tooltip : '详细信息',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/xxxx.png',
		handler : function() {   
           	if (selectedConid != ""&&selectedConid!=null){
           		getConid=selectedConid;
           		if(type&&type=="con"){
           			openConModelessDialog();	
           		}
           		else if(type&&type=="conPay"){
           			openConPayModelessDialog();	
           		}
           		
           	}else{
           		Ext.Msg.alert("提示","请选中一条记录");
           	}
		}
	});
	var btnConApprovalInfo = new Ext.Button({
		id : 'contractApproval',
		text : '审批信息',
		tooltip : '审批信息',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/sc.png',
		handler : function() {   
		var _conno = selectedConno;
		if(_conno!=""&&_conno!=null){
			baseDao.findByWhere2(
			"com.sgepit.frame.flow.hbm.InsDataInfoView",
			"paramvalues like '%conno:" + _conno
			+ "%' and modname ='合同登记'", function(list) {
			if (list.length > 0) {
				showFlow(list[0].insid);
				} else {
						Ext.example.msg('提示', '该合同没有走审批流程！');
					}
				});
		}else{
           		Ext.Msg.alert("提示","请选中一条记录");
           	}
	}
	});
	//----------项目单位选择下拉框
	var array_prjs=new Array();
	var dsCombo_prjs=new Ext.data.SimpleStore({
   		fields: ['k', 'v'],   
    	data: [['','']]
	});
	DWREngine.setAsync(false);
	systemMgm.getPidsByUnitid(USERBELONGUNITID,function(list){   
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_prjs.push(temp);			
		}
	}); 
	DWREngine.setAsync(true);
	dsCombo_prjs.loadData(array_prjs);
	var proTreeCombo=new Ext.form.ComboBox({
		hidden :false,
		anchor : '95%',
		width:200,
		listWidth:300,
		fieldLabel:'请选择项目单位',
		store:dsCombo_prjs,
		displayField:'v',
		valueField:'k',
		typeAhead: true,
		editable:false,
		mode: 'local',
		lazyRender:true,
		triggerAction: 'all',
		emptyText:"",
		selectOnFocus:true
	});
	proTreeCombo.setValue(CURRENTAPPID);
	if(pid!="")
	proTreeCombo.setValue(pid);
	proTreeCombo.on("select",function(obj,rec,inx){
			var url=CONTEXT_PATH+'/PCBusiness/pcCon/contract/cont.generalInfo.input.jsp?sj='+sj+'&pid='+rec.get('k')+"&type="+type;
			window.location.href = url;
	});
      var tb= new Ext.Toolbar({
				    items :["请选择项目单位:",proTreeCombo,'->',btnConDetailInfo,'-',btnConApprovalInfo,'-']
				});
  
    grid = new Ext.grid.QueryExcelGridPanel({
				store : ds,
				cm : cm,
				sm : sm,
				// zhangh 2010-10-18 在此处将合同状态修改为ComboBox
				tbar :tb,
				border : false,
				layout : 'fit',
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true,
					getRowClass :function (rec,rowIndex,rowparams,ds){
						var date = new Date();
						var  perdate =  rec.data.performancedate;
						var abs =-1;
						if(perdate!=''){
							abs=parseInt((perdate-date)/1000/60/60/24)
						}
					    if(abs>=0&&abs<=10){
					        return 'x-grid-record-red';
					    }
					    return '';
					}
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				listeners : {
				    "render" : function (){
				        addToolbar.render(this.tbar);
				    }
				}
			});

	var gridMenu = new Ext.menu.Menu({
				id : 'gridMenu'
			});
	grid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		var conno = record.get("conno");
		gridMenu.removeAll();
		gridMenu.addMenuItem({
					id : 'menu_view',
					text : '　查看',
					value : data,
					iconCls : 'form',
					handler : toHandler
				});
		gridMenu.addMenuItem({
					id : 'menu_flow',
					text : '　流程信息',
					value : data,
					conno : conno,
					iconCls : 'flow',
					handler : toHandler
				});
		gridMenu.showAt(e.getXY());
	}

	function toHandler() {
		var state = this.id;
		var menu_conid = this.value;
		if ("" != state) {
			if ("menu_view" == state) {
				getConid=menu_conid;
				if(type&&type=="con"){
					openConModelessDialog();
				}
           		else if(type&&type=="conPay"){
           			openConPayModelessDialog();	
           		}
			}
 			 if ("menu_flow" == state) {
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				var _conno = this.conno;
				baseDao.findByWhere2(
						"com.sgepit.frame.flow.hbm.InsDataInfoView",
						"paramvalues like '%conno:" + _conno
								+ "%' and modname ='合同登记'", function(list) {
							if (list.length > 0) {
								showFlow(list[0].insid);
							} else {
								Ext.example.msg('提示', '该合同没有走审批流程！');
							}
						});
			} else {
				return
			}
		}
	}

	// 10. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	// 11. 事件绑定
	sm.on('rowselect', function(sm) { // grid 行选择事件
			var record = sm.getSelected();
			selectedConid = record.get('conid');
			getConid=selectedConid;
			selectedConno= record.get('conno');
			conname = record.get('conname');
			selectedconvalue = record.get('convaluemoney');
			parent.conmoney = record.get('conmoney');
	});

	
	paramsStr = filter1;
	if (gridfiter != '')
		paramsStr += " and " + gridfiter;
	reload();
	
	function reload() {
	    parent.dsparams=paramsStr;
	    ds.baseParams.params = paramsStr;
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	function renderConno(value, metadata, record) {
		 getConid = record.get('conid');
		 conname = record.get('connname');
		 selectedConno=record.get('conno');
		 selectedconvalue=record.get('convaluemoney');
		var output ="";
		if(type&&type=="con"){
			output ="<a title='"+value+"' style='color:blue;cursor:hand' onclick='openConModelessDialog()' >" + value + "</a>"	
		}
		else if(type&&type=="conPay"){
			output ="<a title='"+value+"' style='color:blue;cursor:hand' onclick='openConPayModelessDialog()' >" + value + "</a>"		
		}
		return output;
	}
	
	// 下拉列表中 k v 的mapping
	// 乙方单位
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < partBs.length; i++) {
			if (partBs[i][0] == value) {
				str = partBs[i][1]
				break;
			}
			
		}
//		return str;
// 鼠标悬停时显示完整信息
		var qtip = "qtip=" + str;
		return '<span ' + qtip + '>' + str + '</span>';
	}
	// 合同状态
	function BillStateRender(value) {
		for (var i = 0; i < dsBillStateNoFilter.getCount(); i++) {
			if (dsBillStateNoFilter.getAt(i).get('k')==value) {
				return dsBillStateNoFilter.getAt(i).get('v')
			}
		}
	}

	// 招标批次
	function bidtypeRender(value) {
		var str = '';
		for (var i = 0; i < bidtype.length; i++) {
			if (bidtype[i][0] == value) {
				str = bidtype[i][1]
				break;
			}
		}
		return str;
	}

	// 如果变更了 就颜色区分
	function isChange(value, cellMeta, record) {
		value = cnMoneyToPrec(value);

		if (record.get('isChange') == "是") {
			value = '<font color=#0000ff>' + value + '</font>';
		}
		return value;
	}

	function showFlow(_insid) {
		if (!flowWindow) {
			flowWindow = new Ext.Window({
						title : ' 流程信息',
						iconCls : 'form',
						width : 900,
						height : 500,
						modal : true,
						closeAction : 'hide',
						maximizable : false,
						resizable : false,
						plain : true,
						autoLoad : {
							url : BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
							params : 'type=flwInfo&insid=' + _insid,
							text : 'Loading...'
						}
					});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid=' + _insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}
	
	fixedFilterPart=" pid='"+currentPid+"'";
})
function openConModelessDialog(){
		var url=CONTEXT_PATH+"/PCBusiness/pcCon/contract/cont.generalInfo.view.jsp?query="+query+"&conid="+ getConid
		+"&conids="+encodeURIComponent(CONIDS)+"&optype="+OPTYPE+"&dyView="+dyView+"&uids="+UIDS+"&acc=pccon";
		window.showModalDialog(url, null,"dialogHeight=500px;dialogWidth=900px;scroll=0;status=0;help=1;resizable=1;Minimize=no;Maximize=yes;");
}
function openConPayModelessDialog(){
			var url=CONTEXT_PATH+"/PCBusiness/pcCon/contract/cont.payInfo.input.jsp?payBillState=1&dyView=true&conid="+ getConid
		+"&conname="+encodeURIComponent(conname)+"&conno="+selectedConno+"&convalue="+selectedconvalue+"&sj="+sj+"&pid="+pid;
		window.showModalDialog(url, null,"dialogHeight:800;dialogWidth:450;scroll:0;status:0;help:1;resizable:1;Minimize=no;Maximize=yes;");
}

