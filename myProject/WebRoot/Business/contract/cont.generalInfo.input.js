var bean = "com.sgepit.pmis.contract.hbm.ConOveView";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "conid";
//是否国金
var isGj = CURRENTAPPID=='1030902'||CURRENTAPPID=='1030903' ? true : false;
//国金项目按招标项目申请时间排序
var orderColumn = isGj ? "bidApplyDate" : "conno";
var propertyName = "condivno";
var grid;
var ds;
var page;
var partBs = new Array();
var contractType = new Array();
var contarctType2 = new Array();
var contractTypeArr=new Array();
var contractTypeArr2=new Array();
var contractStateArr=new Array();
var otherCostType = new Array();
var currentPid = CURRENTAPPID;
var bidtype = new Array();
var bidApplyArr = new Array();
var BillState = new Array();
var BillStateNoFilter = new Array();
var defaultFirstSort = "";
var defaultFirstSortName = "";
var dsCombo2 = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['', '']]
		});
var flowWindow;
var conDiv; // 导出时合同一级分类
var conSort = '-1'; // 导出时合同二级分类
//动态数据过滤条件
var outFilter ="1=1";
var zbFilter = "";//是否招标过滤条件
var zbCombo;
var combo2 ;
var isZb = "";
var isZb = "";
var zbXm = "";
var zbCont = "";
var bidType = "";
if(CONIDS!=""){
	var len=CONIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
		str+="'"+len[i]+"'";
		if(i<len.length-1){
			str+=",";
		}
	}
	outFilter=" conid in ("+str+")";
}
var gridfiter = "pid='" + currentPid + "'";
var paramsStr = ""; //ds传递参数
var dsflag=false; //默认没有选择触发
var filter1 = '1=1'; // 下拉菜单一级分类过滤
var filter2 = '1=1'; // 下拉菜单二级分类过滤
var filter3 = '1=1'; // 下拉菜单合同状态过滤
var tip='-';
var spaceTwo='&nbsp;&nbsp;';
var spaceOne='&nbsp;';
var btnDisabled = dyView=='true'?true:(ModuleLVL != '1');
var sm;
var dsOtherCostType;
var formSaveWin;
/*合同下拉框说明:
 * 状态下拉框表示所有的默认键值对是:-2 所有状态;
 * 合同分类一分类二默认键值对都是:-1 所有合同
 * */
 
var zbXmArr = new Array();
var zbContArr = new Array();
Ext.onReady(function() {
    DWREngine.setAsync(false);
	baseMgm.getData("select t.uids,t.zb_name from PC_BID_ZB_APPLY t",function(list){
		if(list){
			for(var i=0;i<list.length;i++){
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				zbXmArr.push(temp);
			}
		}
	});
	DWREngine.setAsync(true);
	var btnAdd = new Ext.Button({
		id : 'add',
		text : '新增',
		iconCls : 'add',
		hidden : query,
		handler : function() {
			var url = BASE_PATH
					+ "Business/contract/cont.generalInfo.addorupdate.jsp?modid="+MODID;
			window.location.href = url;
		},
		disabled : btnDisabled
	});
	var btnUpdate= new Ext.Button({
			id : 'update',
			text : '修改',
			iconCls : 'btn',
			hidden : query,
			handler : function() {
				var s=grid.getSelectionModel().getSelected();
				if(s!=null&&s!=undefined){
					var conid=s.get("conid");
					if(conid!=""&&conid!=null){
						var url = BASE_PATH+ "Business/contract/cont.generalInfo.addorupdate.jsp?";	
	              		window.location.href = url + "conid=" + conid+"&modid="+MODID;// &state='edit'";		
					}
				}else{
					Ext.Msg.alert("提示","请选中一条记录");
				}
			},
			disabled : btnDisabled
		});
	var btnDelete= new Ext.Button({
		id : 'delete',
		text : '删除',
		iconCls : 'multiplication',
		hidden : query,
		handler : function() {	
			var s=grid.getSelectionModel().getSelected();
			if(s!=null&&s!=undefined){
				var conid=s.get("conid");
				if(conid!=""&&conid!=null){
					Ext.Msg.show({
						title : '提示',
						msg : '是否要删除?　　　　',
						buttons : Ext.Msg.YESNO,
						icon : Ext.MessageBox.QUESTION,
						fn : function(value) {
							if ("yes" == value) {
								conoveMgm.deleteConove(conid,MODID, function(flag) {
											if ("0" == flag) {
												Ext.example.msg('删除成功！',
														'您成功删除了一条合同信息！');
												reload();
												equlistMgm.deleteConAll(conid);
											} else if ("1" == flag) {
												Ext.Msg.show({
															title : '提示',
															msg : '数据删除失败！',
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.ERROR
														});
											} else {
												Ext.Msg.show({
															title : '提示',
															msg : flag,
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.ERROR
														})
											};
										});
							}
						}
					});
				}
			} else{
				Ext.Msg.alert("提示","请选中一条记录");
			}
		},
		disabled : btnDisabled
	});
	var otherCostTypeAdd = new Ext.Button({
                id : 'otherCostTypeAdd',
                text : '其他费用类型维护',
                iconCls : 'add',
                handler : createOtherCostTypeWin,
                hidden : false
            });
	var conFieldName= new Ext.form.TextField({
				id : 'name',
				emptyText : '合同名称',
				width:90,
				enableKeyEvents: true,
				hidden : query && DEPLOY_UNITTYPE == "0",
				listeners : {
				specialKey : function(field, e) {
					if(e.getKey()==e.ENTER){
					      searchByFieldName();
						}
					}
				}
			});
	var conFieldBtn = new Ext.Button({
				id : 'queryByName',
				tooltip : '合同名称查询',
				text:"",
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/cx.png',
				hidden : query && DEPLOY_UNITTYPE == "0",
				handler : searchByFieldName
			});
	function searchByFieldName() {
		var conField = conFieldName.getValue();
		var newparams = filter1 + " and " + filter2 + " and " + filter3;
		if (conField != "") {
			parent.conTitle = conField;
			newparams = newparams + ' and conname like \'%' + conField + '%\'';
		} else if (conField == '') {
			newparams = newparams;
		}
		paramsStr = newparams;
		reload();
	}
	
	var exportExcelBtn = new Ext.Button({
				id : 'export',
				text : '导出数据',
				tooltip : '导出数据到Excel',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler : function() {
					exportDataFile();
				}
			});

	function exportDataFile() {
		// 获取合同分类一的键值
//		if (-1 == combo.getValue() || combo.getValue() == "") {
//			var str = "";
//			for (var i = 0; i < contractTypeArr.length; i++) {
//				str += "'" + contractTypeArr[i] + "'" + ",";
//			}
//			if (str != "") {
//				str = str.substring(0, str.length - 1);
//			}
//			conDiv = str;
//		} else {
//			conDiv = "'" + combo.getValue() + "'";
//		}
		// 获取分类二的键值
//		if ((-1 == combo2.getValue()) || combo2.getValue() == "") {
//			DWREngine.setAsync(false);
//			db2Json.selectData("select distinct(property_code),uids from  property_code where type_name in" +
//					" (select uids from property_type where type_name in (select property_name from property_code where type_name in" +
//					" (select uids from property_type where type_name='合同划分类型') ))",
//							function(jsonData) {
//								var list = eval(jsonData);
//								if (list != null) {
//									for (var i = 0; i < list.length; i++) {
//										contractTypeArr2
//												.push(list[i].property_code);
//									}
//								}
//							});
//			DWREngine.setAsync(true);
//			var str = "";
//			for (var i = 0; i < contractTypeArr2.length; i++) {
//				str += "'" + contractTypeArr2[i] + "'" + ",";
//			}
//			if (str != "") {
//				str = str.substring(0, str.length - 1);
//			}
//			conSort = str;
//		} else {
//			conSort = "'" + combo2.getValue() + "'";
//		}
//		var openUrl = CONTEXT_PATH + "/servlet/ConServlet?ac=exportData&conDiv=" + conDiv
//				+ "&businessType=ConList&unitId=" + USERDEPTID + "&pid=" + currentPid + "&conSort=" + conSort;
		var filter = ds.baseParams.params;
		var openUrl = CONTEXT_PATH + "/servlet/ConServlet?ac=exportConPayAccount&businessType=ConList&filter=" + encodeURI(encodeURI(filter));
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	// zhangh 2010-10-28 当前分类合同累计总金额
	var allTotalMoney = new Ext.Button({
				id:"allTotalMoney"
			});
	var allHasPayMoney = new Ext.Button({
				id:"allHasPayMoney"
			});
	var allHasPayRateMoney = new Ext.Button({
				id:"allHasPayRateMoney"
			});
	//概算金额汇总
	var totalBdgMoney = new Ext.Button({
				id:"totalBdgMoney"
			});
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
					defaultFirstSort = '-1';	//list[i].propertyCode
					defaultFirstSortName = '所有合同';	//list[i].propertyName
			    }
				contarctType2 = new Array();
				contarctType2.push(['-1', '所有合同']);
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
   baseMgm.findAll('com.sgepit.pcmis.bid.hbm.PcBidZbApply',function(list){   
     	//获取招标项目内容
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].uids);
			temp.push(list[i].zbName);
			bidApplyArr.push(temp);
		}
    });
    appMgm.getCodeValue('其他费用类型',function(list){         //获取其他费用类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			otherCostType.push(temp);			
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
	var dsZb = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['0','全部'],['1','通过招标'],['2','未通过招标']]
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
	dsOtherCostType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: otherCostType
    });
	// 1. 创建选择模式
	sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	// 2. 创建列模型
	var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',
			fieldLabel : '主键',   //1
			anchor : '95%',
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',    //2
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
		},'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '执行概算',
			anchor: '95%'
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
			hideLabel : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : DEPLOY_UNITTYPE == "0"?'合同金额':'合同总金额',     //6
			anchor : '95%'
		},'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签订金额',    //7
			anchor : '95%'
		},'conpay':{
			name : 'conpay',
			fieldLabel : '付款金额',       //8
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
		},'conAdjust' : {
			name : 'conAdjust',
			fieldLabel : '附件',              //12
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
			hideLabel : true,
			anchor : '95%'
		}, 'concha' : {
			name : 'concha',
			fieldLabel : DEPLOY_UNITTYPE == "0"?'变更金额':'合同变更金额'
		}
		//2014-05-26 qiupy 国金项目加入招标项目 名称
		, 'bidApplyId' : {
			name : 'bidApplyId',
			fieldLabel : '招标项目名称'
		}, 'bidApplyDate' : {
			name : 'bidApplyDate',
			fieldLabel : '招标项目名称'
		}
//        ,'isChange' : {
//			name : 'isChange',
//			fieldLabel : '是否变更',
//			hidden : true,
//			hideLabel : true,
//			anchor : '95%'
//		}
		// zhangh 2010-10-27
	}

	var cm =[{
			id : 'conid',
			type : 'string',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
			hidden : true,
			width : 60,
			locked:true
		},{
			id : 'pid',
			type : 'string',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true,
			width : 60,
			locked:true
		},{
			id : 'conno',
			type : 'string',
			header : fc['conno'].fieldLabel,
			dataIndex : fc['conno'].name,
			//align : 'center',
			width : 150,
            hidden : (DEPLOY_UNITTYPE == "0"),
			locked:true,
			// 鼠标悬停时显示完整信息
			renderer : function(data, metadata, record, rowIndex,columnIndex, store) {
				var qtip = "qtip=" + data;
				return '<span ' + qtip + '>' + data + '</span>';
		    	return data;
			}
		},{
			id : 'bidApplyDate',
//			type : 'string',
			header : fc['bidApplyDate'].fieldLabel,
			dataIndex : fc['bidApplyDate'].name,
			//align : 'center',
			width : 150,
            hidden : (DEPLOY_UNITTYPE == "0")||(CURRENTAPPID!='1030902'&&CURRENTAPPID!='1030903'),
            hideable: (CURRENTAPPID=='1030902'||CURRENTAPPID=='1030903'),
			locked:true,
			// 鼠标悬停时显示完整信息bidApplyArr
			renderer : function(data, metadata, record, rowIndex,columnIndex, store) {
				var value=record.get('bidApplyId');
				var str='未招标';
				for (var i = 0; i < bidApplyArr.length; i++) {
					if (value==bidApplyArr[i][0]) {
						str=bidApplyArr[i][1];
					}
				}
				var qtip = "qtip=" + str;
				return '<span ' + qtip + '>' + str + '</span>';
			}
		},{
			id : 'conname',
			type : 'string',
			header : fc['conname'].fieldLabel,
			dataIndex : fc['conname'].name,
			width : (DEPLOY_UNITTYPE == "0") ? 400 : 300,
			renderer :function(value, metadata, record){
                	var getConid = record.get('conid');
					conname = record.get('connname');
                	return "<a style='color:blue;' href='javascript:renderConno(\"" + value
							+ "\",\"" + record + "\",\"" + getConid + "\")'>"
							+ value + "</a>";
                },
			locked:true
		},{
			id : 'bdgmoney',
			header : fc['bdgmoney'].fieldLabel,
			dataIndex : fc['bdgmoney'].name,
			//hidden : DEPLOY_UNITTYPE == "A",
			hidden : true,
			align : 'right',
			renderer : isChange
		},{
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
			width : (DEPLOY_UNITTYPE == "0") ? 150 : 100,
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
			width : (DEPLOY_UNITTYPE == "0") ? 150 : 100,
			align : 'right',
			renderer : function(v){
				return isGj ? cnMoneyToPrec(v, 2) : cnMoneyToPrec(v);
			}
		},{
			id : 'coninvoicemoney',
			type : 'float',
			header : fc['coninvoicemoney'].fieldLabel,
			dataIndex : fc['coninvoicemoney'].name,
			width : 100,
			hidden : true,
			align : 'right',
			renderer : function(v){
				return isGj ? cnMoneyToPrec(v, 2) : cnMoneyToPrec(v);
			}
		},{
			id : 'differencemoney',
			type : 'float',
			header : fc['differencemoney'].fieldLabel,
			width : 100,
			align : 'right',
            hidden : (DEPLOY_UNITTYPE == "0"),
			renderer : function (v,p,r){
				return  isGj ? cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'), 2) : cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'));
			}
		},{
			id : 'realdifferencemoney',
			type : 'float',
			header : fc['realdifferencemoney'].fieldLabel,
			dataIndex : fc['realdifferencemoney'].name,
			align:'right',
			hidden : true,
			sortable : false,
			renderer : function (v,p,r){
				return isGj ? cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'), 2) : cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'));
			}
		},{
			id : 'conAdjust',
			type : 'XXXX',
			header : fc['conAdjust'].fieldLabel,
			dataIndex : fc['conAdjust'].name,
			align : 'center',
			width : 60,
            hidden : (DEPLOY_UNITTYPE == "0"),
			renderer :renderConAdjust
		},{
			id : 'partybno',
			type : 'combo',
			header : fc['partybno'].fieldLabel,
			dataIndex : fc['partybno'].name,
			width : 240,
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
            hidden : (DEPLOY_UNITTYPE == "0"),
			renderer : BillStateRender,
			store : dsBillState
		}, {
			id : 'concha',
			header : fc['concha'].fieldLabel,
			dataIndex : fc['concha'].name,
			align : 'right',
			hidden : (DEPLOY_UNITTYPE != "0"),
			renderer : function(v, p, r) {
				return cnMoneyToPrec(v);
			}
		}
	];
	//当为集团项目时调整字段显示顺序
	if(DEPLOY_UNITTYPE == "0"){
		cm = [new Ext.grid.RowNumberer(),{
				id : 'conid',
				type : 'string',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true,
				width : 60,
				locked:true
			},{
				id : 'pid',
				type : 'string',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true,
				width : 60,
				locked:true
			},{
				id : 'conno',
				type : 'string',
				header : fc['conno'].fieldLabel,
				dataIndex : fc['conno'].name,
				//align : 'center',
				width : 150,
	            hidden : (DEPLOY_UNITTYPE == "0"),
				locked:true,
				// 鼠标悬停时显示完整信息
				renderer : function(data, metadata, record, rowIndex,columnIndex, store) {
					var qtip = "qtip=" + data;
					return '<span ' + qtip + '>' + data + '</span>';
			    	return data;
				}
			},{
				id : 'bidApplyDate',
	//			type : 'string',
				header : fc['bidApplyDate'].fieldLabel,
				dataIndex : fc['bidApplyDate'].name,
				//align : 'center',
				width : 150,
	            hidden : (DEPLOY_UNITTYPE == "0")||(CURRENTAPPID!='1030902'&&CURRENTAPPID!='1030903'),
	            hideable: (CURRENTAPPID=='1030902'||CURRENTAPPID=='1030903'),
				locked:true,
				// 鼠标悬停时显示完整信息bidApplyArr
				renderer : function(data, metadata, record, rowIndex,columnIndex, store) {
					var value=record.get('bidApplyId');
					var str='未招标';
					for (var i = 0; i < bidApplyArr.length; i++) {
						if (value==bidApplyArr[i][0]) {
							str=bidApplyArr[i][1];
						}
					}
					var qtip = "qtip=" + str;
					return '<span ' + qtip + '>' + str + '</span>';
				}
			},{
				id : 'conname',
				type : 'string',
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				width : (DEPLOY_UNITTYPE == "0") ? 400 : 300,
				renderer :function(value, metadata, record){
	                	var getConid = record.get('conid');
						conname = record.get('connname');
	                	return "<a style='color:blue;' href='javascript:renderConno(\"" + value
								+ "\",\"" + record + "\",\"" + getConid + "\")'>"
								+ value + "</a>";
	                }
				//locked:true
			},{
				id : 'bdgmoney',
				header : fc['bdgmoney'].fieldLabel,
				dataIndex : fc['bdgmoney'].name,
				hidden : DEPLOY_UNITTYPE == "A",
				hidden : true,
				align : 'right',
				renderer : isChange
			},{
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
				width : (DEPLOY_UNITTYPE == "0") ? 150 : 100,
				align : 'right',
				renderer : isChange
			}, {
				id : 'concha',
				header : fc['concha'].fieldLabel,
				dataIndex : fc['concha'].name,
				align : 'right',
				hidden : (DEPLOY_UNITTYPE != "0"),
				renderer : function(v, p, r) {
					return cnMoneyToPrec(v);
				}
			},{
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
				width : (DEPLOY_UNITTYPE == "0") ? 150 : 100,
				align : 'right',
				renderer : function(v){
					return isGj ? cnMoneyToPrec(v/10000, 2) : cnMoneyToPrec(v/10000,2);
				}
			},{
				id : 'coninvoicemoney',
				type : 'float',
				header : fc['coninvoicemoney'].fieldLabel,
				dataIndex : fc['coninvoicemoney'].name,
				width : 100,
				hidden : true,
				align : 'right',
				renderer : function(v){
					return isGj ? cnMoneyToPrec(v/10000, 2) : cnMoneyToPrec(v/10000);
				}
			},{
				id : 'differencemoney',
				type : 'float',
				header : fc['differencemoney'].fieldLabel,
				width : 100,
				align : 'right',
	            hidden : (DEPLOY_UNITTYPE == "0"),
				renderer : function (v,p,r){
					return  isGj ? cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'), 2) : cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'));
				}
			},{
				id : 'realdifferencemoney',
				type : 'float',
				header : fc['realdifferencemoney'].fieldLabel,
				dataIndex : fc['realdifferencemoney'].name,
				align:'right',
				hidden : true,
				sortable : false,
				renderer : function (v,p,r){
					return isGj ? cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'), 2) : cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'));
				}
			},{
				id : 'conAdjust',
				type : 'XXXX',
				header : fc['conAdjust'].fieldLabel,
				dataIndex : fc['conAdjust'].name,
				align : 'center',
				width : 60,
	            hidden : (DEPLOY_UNITTYPE == "0"),
				renderer :renderConAdjust
			},{
				id : 'partybno',
				type : 'combo',
				header : fc['partybno'].fieldLabel,
				dataIndex : fc['partybno'].name,
				width : 240,
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
	            hidden : (DEPLOY_UNITTYPE == "0"),
				renderer : BillStateRender,
				store : dsBillState
			}
		];
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
				name : 'bdgmoney',
				type : 'float'
			},{
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
			}, {
				name : 'concha',
				type : 'float'
			}, {
				name : 'bidApplyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'bidApplyId',
				type : 'string'
			}
			];

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
	ds = new Ext.data.Store({
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
			if(parent.comboBillstate!=""){//返回时给状态赋值
				combo3.setValue(parent.comboBillstate);
			}
			if(parent.conTitle!=""){//返回时给标题赋值
				conFieldName.setValue(parent.conTitle);
			}
			ds.baseParams.params=parent.conMainSerachStr;//点返回按钮时父窗口的值
			parent.dsparams=parent.conMainSerachStr;
		}
		parent.conMainSerachStr=ds.baseParams.params;
	});

	ds.on('load', function() {
		//由于此处重新又为ds.baseParams.params赋值，导致导出时获取不到完整的查询条件，不能准确导出 pengy 2014-06-13
		if (parent.dsparams != "" && parent.dsparams != undefined) {
			if (dsflag == true) {
//				ds.baseParams.params = paramsStr;
				parent.dsparams = ds.baseParams.params;
			} else {
//				ds.baseParams.params = parent.dsparams;
			}
		} else {
			parent.dsparams = ds.baseParams.params;
//			ds.baseParams.params = paramsStr;
		}
		dsTotal.baseParams.params = ds.baseParams.params;
		parent.conMainSerachStr = ds.baseParams.params;
		if (conttype != null && conttype != "" && contyear != null && contyear != "") {
			dsTotal.baseParams.params += " and signdate between to_date('" + contyear
					+ "-01-01','YYYY-MM-DD')  and to_date('" + contyear + "-12-31','YYYY-MM-DD') ";
		}
		dsTotal.load();
//		textTotalMoney.setValue(cnMoneyToPrec(ds.sum('convaluemoney')))
		backFlag = 0;//返回之后将返回标记清零
	});

	dsTotal.on('load', function() {
		allTotalMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('convaluemoney'))+"</font>");
		totalBdgMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('bdgmoney'))+"</font>");
		if(DEPLOY_UNITTYPE == "0"){
			allTotalMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('convaluemoney')/10000,2)+"</font>");
			totalBdgMoney.setText("<font color=red size=2>"+cnMoneyToPrec(dsTotal.sum('bdgmoney')/10000,2)+"</font>");
		}
		var allHasPayMoneyTotal = isGj ? cnMoneyToPrec(dsTotal.sum('conpay'), 2) : cnMoneyToPrec(dsTotal.sum('conpay'));
		allHasPayMoney.setText("<font color=red size=2>" + allHasPayMoneyTotal + "</font>");
		if(dsTotal.sum('convaluemoney')!=0&&dsTotal.sum('conpay')!=0){
			var rate=(dsTotal.sum('conpay')/dsTotal.sum('convaluemoney'))*100;
			rate=rate.toFixed(4);
			allHasPayRateMoney.setText("<font color=red size=2>"+rate+""+"%"+"</font>");	
		}else{
			allHasPayRateMoney.setText("<font color=red size=2>"+"0.0000"+""+"%"+"</font>");
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
		if(conttype!=null && conttype!=""){
			defaultFirstSort = conttype;
		}
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
	zbCombo = new Ext.form.ComboBox({
		store : dsZb,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		//emptyText : '选择合同分类一....',
		selectOnFocus : true,
		width : 90
	});
	zbCombo.setValue('0');
	zbCombo.on('select',zbComboselect);
	combo2 = new Ext.form.ComboBox({
		store : dsCombo2,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择合同分类二....',
		selectOnFocus : true,
		disabled : true,
		width : 110,
		hidden : query && DEPLOY_UNITTYPE == "0"
	});	
	// zhangh 2010-10-18 新建合同状态CommoBox
	var combo3 = new Ext.form.ComboBox({
				store : dsBillState,
				width : 110,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '合同状态',
				selectOnFocus : true,
				hidden : query && DEPLOY_UNITTYPE == "0"
			});
	// 合同状态下拉事件
	combo3.on('select', function() {
		dsflag=true;
		var conDiv3 = combo3.getValue();
		parent.combox3 = conDiv3;
		var conDivDesc3 = combo3.getRawValue();
		filter3="1=1";   
		
		if(DEPLOY_UNITTYPE == 'A'){//为项目单位
			if(query==true){//合同查询页面
				if(isZb == '1'){
					filter1 +=" and bidtype is not null"
				}else if(isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(bidType !=''){
					filter1 +=" and bidtype in("+bidType+")";
				}
				if(zbCont !=""){
					filter1 +=" and bidtype = '"+zbCont+"'";
				}
			}else{
				if(parent.isZb == '1'){
					filter1 +=" and bidtype is not null"
				}else if(parent.isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(parent.bidType !=''){
					filter1 +=" and bidtype in("+parent.bidType+")";
				}
				if(parent.zbCont !=""){
					filter1 +=" and bidtype = '"+parent.zbCont+"'";
				}
			}
		} 
		
		parent.comboBillstate=combo3.getValue();
		if(conDiv3!=""&&conDiv3!="-2"){
			filter3 = "billstate='" + conDiv3 + "'";
		}
		if (filter2 != "") { 
			paramsStr = filter1 + " and " + filter2	+ " and " + filter3;
		} else {
			paramsStr = filter1 + " and " + filter3;
		}
		
		if (gridfiter != ''){
			paramsStr += " and " + gridfiter;
		}
		var conField=conFieldName.getValue();
		if(conField!=""){
			paramsStr+=' and conname like \'%' + conField+ '%\'';
		}
		
		reload();
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
	    if(combo2.getValue()!=null && combo2.getValue()!=""){
	    	combo2.clearValue();
	    }
		combo2.setDisabled(true);
		conDiv = combo.getValue();
		parent.combox1=conDiv;
		var conDivDesc = combo.getRawValue();
		parent.combox1value=conDivDesc;
		if (conDiv == "-1") {
			paramsStr = gridfiter;
			parent.combox1='-1';
		} else {
			paramsStr = (gridfiter == '') ? propertyName + "='" + conDiv + "' "
					: propertyName + "='" + conDiv + "' and " + gridfiter;
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
				combo2.setDisabled(false);
			}
			DWREngine.setAsync(true);
		}
		// zhangh 2010-10-18 新增过滤条件，分类一被选择后的条件
		if(conDiv!='-1'){
			filter1 = propertyName + "='" + conDiv + "'";
		}else {
			filter1 = '1=1';
		}
		if(DEPLOY_UNITTYPE == '0'){//为集团项目
			if(isZb == '1'){
				filter1 +=" and bidtype is not null"
			}else if(isZb == '2'){
				filter1 +=" and bidtype is null";
			}
		}else{//为项目单位
			if(query==true){
				if(isZb == '1'){//合同查询页面
					filter1 +=" and bidtype is not null"
				}else if(isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(bidType !=''){
					filter1 +=" and bidtype in("+bidType+")";
				}
				
				if(zbCont !=""){
					filter1 +=" and bidtype = '"+zbCont+"'";
				}
			}else{
				if(parent.isZb == '1'){
					filter1 +=" and bidtype is not null"
				}else if(parent.isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(parent.bidType !=''){
					filter1 +=" and bidtype in("+parent.bidType+")";
				}
				
				if(parent.zbCont !=""){
					filter1 +=" and bidtype = '"+parent.zbCont+"'";
				}
			}
		}
		paramsStr = filter1;
		if (gridfiter != '')
			paramsStr += " and " + gridfiter;
		var conDiv3 = combo3.getValue();
		if(conDiv3!="-2"&&conDiv3!=""){  
			paramsStr += " and "+"billstate='" + conDiv3 + "'";
		}
		reload();
	}
	//是否招标下拉框事件
	function zbComboselect(){
		isZb = zbCombo.getValue();
		if(isZb =='0'){
			zbFilter = filter1;
		}else if(isZb =='1'){
			zbFilter = filter1+" and bidtype is not null";
		}else if(isZb =='2'){
			zbFilter = filter1+" and bidtype is null";
		}
		paramsStr = zbFilter;
		if(gridfiter != ''){
			paramsStr += " and "+gridfiter;
		}
		reload();
	}
	// **********分类二选择后执行函数**********
	function comboselect2() {
	    dsflag=true;
		conSort = combo2.getValue();
		var value = combo2.getValue();
		parent.combox2=value;
		parent.comboCat2=value;
		
		if(DEPLOY_UNITTYPE == 'A'){//为项目单位
			if(query==true){//合同查询页面
				if(isZb == '1'){
					filter1 +=" and bidtype is not null"
				}else if(isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(bidType !=''){
					filter1 +=" and bidtype in("+bidType+")";
				}
				if(zbCont !=""){
					filter1 +=" and bidtype = '"+zbCont+"'";
				}
			}else{
				if(parent.isZb == '1'){
					filter1 +=" and bidtype is not null"
				}else if(parent.isZb == '2'){
					filter1 +=" and bidtype is null";
				}
				if(parent.bidType !=''){
					filter1 +=" and bidtype in("+parent.bidType+")";
				}
				if(parent.zbCont !=""){
					filter1 +=" and bidtype = '"+parent.zbCont+"'";
				}
			}
		}
		
		if (value != '-1') {
			filter2 = "sort = '" + value + "'";
			paramsStr = filter1 + " and " + filter2;
		} else {
			paramsStr = filter1;
		}
		if (gridfiter != '')
			paramsStr += " and " + gridfiter;
		var conDiv3 = combo3.getValue();
		if(conDiv3!="-2"&&conDiv3!=""){ 
			paramsStr += " and "+"billstate='" + conDiv3 + "'";
		}
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

	var btnConApprovalInfo = new Ext.Button({
			id : 'contractApproval',
			text : '审批信息',
			tooltip : '审批信息',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/sc.png',
            hidden : (DEPLOY_UNITTYPE == "0"),
			handler : function() {
				var record = sm.getSelected();
				if(record){	
					var _conno=record.get("conno");
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
				}else{
					Ext.Msg.alert("提示","请选中一条记录");
				}
		}
	});  
	//是否招标
   var zbFilter = "";
   var zbXmFilter = "";
   var zbContFilter = "";
   var dsZb = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : [['0','全部'],['1','通过招标'],['2','未通过招标']]
	});
	//招标项目
	var dsZbXm = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : zbXmArr
	});
	var zbXmCombo = new Ext.form.ComboBox({
		store : dsZbXm,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		disabled : true,
		width : 100,
		listWidth:220,
		maxHeight:220,
		hidden : DEPLOY_UNITTYPE == "0"
	});
	zbXmCombo.on('select',zbXmComboselect);	
	//招标内容
	var dsZbCont = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : []
	});
	var zbContCombo = new Ext.form.ComboBox({
		store : dsZbCont,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		disabled : true,
		width : 100,
		listWidth:220,
		maxHeight:220,
		hidden : DEPLOY_UNITTYPE == "0"
	});
	zbContCombo.on('select',zbContComboselect);	
	//招标项目
	function zbXmComboselect(){
		bidType = "";
		zbXm = zbXmCombo.getValue();
		zbContArr = [];
		DWREngine.setAsync(false);
		baseMgm.getData("select t.uids,t.contentes from Pc_Bid_Zb_Content t where t.zb_uids='"+zbXm+"'",function(list){
			if(list){
				for(var i=0;i<list.length;i++){
					var temp = new Array();
					temp.push(list[i][0]);
					baseMgm.getData("select t.BIDTYPE from v_con t where t.BIDTYPE='"+list[i][0]+"'",function(str){
						if(str == null || str == ''){
							temp.push("<font color=red>"+list[i][1]+"</font>");
						}else{
							temp.push(list[i][1]);
						}
					});
					zbContArr.push(temp);
				}
			}
		});
		DWREngine.setAsync(true);
		dsZbCont.loadData(zbContArr);
		zbContCombo.setDisabled(false);
		if(zbXm !=''){
			DWREngine.setAsync(false);
			baseMgm.getData("select t.uids from Pc_Bid_Zb_Content t where t.zb_uids='"+zbXm+"'",function(list){
				if(list){
					for(var i=0;i<list.length;i++){
						bidType +="'"+list[i]+"',"
					}
				}
			});
			DWREngine.setAsync(true);
			bidType = bidType.substring(0,bidType.length-1)
			zbXmFilter = " and bidtype in("+bidType+")"
			if(bidType !=''){
				paramsStr = zbFilter + zbXmFilter;
			}
		}
		reload();
	}
	//招标内容下拉框事件
	function zbContComboselect(){
		zbCont = '';
		zbCont = zbContCombo.getValue();
		if(zbCont !=""){
			baseMgm.getData("select t.contentes from Pc_Bid_Zb_Content t where t.uids='"+zbCont+"'",function(str){
				if(str){
					zbContCombo.setRawValue(str);//选择后去掉下拉选项上的样式
				}
			});
			zbContFilter = " and bidtype='"+zbCont+"'";
			paramsStr = zbFilter + zbXmFilter + zbContFilter;
		}
		reload();
	}
	var cmArray = [['selectAll','全部']];
	var cmHide = new Array();
	
	var store1 = new Ext.data.SimpleStore({
	      fields : ['k', 'v'],
	      data : cmArray
	}); 
	var chooseRow = new Ext.form.MultiSelect({
		id:   'chooserow',
		width:  120,
		store : store1,
		readOnly : true,
		displayField:'v',
		valueField:'k',
		emptyText: '显示更多信息',
		mode: 'local',
		triggerAction : 'all',
		hidden : query && DEPLOY_UNITTYPE == "0",
		onSelect : function(r,i){
			var colModel = grid.getColumnModel();
			if(i==0){
			    if(r.get(this.checkField)){
					chooseRow.setValue(cmHide);
					cmSelectById(colModel,cmHide);
			    }else{
					this.selectAll();
					cmSelectById(colModel,this.getCheckedValue());
			    }
			}else{
				r.set(this.checkField, !r.get(this.checkField));
				chooseRow.setValue(this.getCheckedValue());
				cmSelectById(colModel,this.getCheckedValue());
			}
		}
	});

	function cmSelectById(cm,str){
		var cmHide = str.toString().split(',');
		var lockedCol = colModel.getLockedCount();
		for(var i=lockedCol; i<cm.getColumnCount();i++){
			for(var j=0;j<cmHide.length;j++){
			    if(cm.getDataIndex(i) == cmHide[j]){
			        cm.setHidden(i,false);
			        break;
			    }else{
			        cm.setHidden(i,true);
			    }
			}
		}
	}

	var tb='';
	if(query==true){
		tb= new Ext.Toolbar({
				items :[combo3,spaceTwo,conFieldName,conFieldBtn,'-',"是否招标&nbsp;&nbsp;",zbCombo,'-','招标项目&nbsp;&nbsp;',zbXmCombo,'-','招标内容',zbContCombo,'-',btnConApprovalInfo,'->',chooseRow,btnAdd, '-',  exportExcelBtn, '-']
		})
        
        if(DEPLOY_UNITTYPE == "0"){
            tb= new Ext.Toolbar({
                items :[
                        combo3,spaceTwo,conFieldName,conFieldBtn,btnConApprovalInfo,chooseRow,btnAdd,
                        '合同分类&nbsp;&nbsp;',combo,'-','是否招标&nbsp;&nbsp;',zbCombo,'-',
                        '当前分类合同总金额:', allTotalMoney,
                        //'&nbsp;&nbsp;&nbsp;',  '已付金额:', allHasPayMoney,
                        //'&nbsp;&nbsp;&nbsp;', '已付比例:', allHasPayRateMoney,
                        //'-','执行概算:',totalBdgMoney,
                        '->','计量单位:万元', '-',exportExcelBtn, '-']
            });
        }
	}else{
		tb=new Ext.Toolbar({
				items :[btnAdd,spaceOne,btnUpdate,spaceOne,btnDelete,spaceOne,otherCostTypeAdd,tip,spaceOne,combo3,spaceTwo,conFieldName,conFieldBtn,'->',chooseRow,btnAdd, '-',  exportExcelBtn, '-']
		})
	}
	grid = new Ext.grid.LockingGridPanel({
				store : ds,
				columns : cm,
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
						if(DEPLOY_UNITTYPE != "0")addToolbar.render(this.tbar);
			    	}
				}
			});
			if(DEPLOY_UNITTYPE=='0'){
				grid = new Ext.grid.QueryExcelGridPanel({
					store : ds,
					columns : cm,
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
							if(DEPLOY_UNITTYPE != "0")addToolbar.render(this.tbar);
				    	}
					}
				})
			}
	//默认grid列可排序
	grid.getColumnModel().defaultSortable = true;
	
	var gridMenu = new Ext.menu.Menu({
				id : 'gridMenu'
			});
	//grid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		var conno = record.get("conno");
		gridMenu.removeAll();
		if (!btnDisabled) {
			if(query!=null&&query==false){
				gridMenu.addMenuItem({
						id : 'menu_add',
						text : '　新增',
						value : data,
						iconCls : 'add',
						handler : toHandler
					})
				gridMenu.addMenuItem({
						id : 'menu_edit',
						text : '　修改',
						value : data,
						iconCls : 'btn',
						handler : toHandler
					})
				gridMenu.addMenuItem({
						id : 'menu_del',
						text : '　删除',
						value : data,
						iconCls : 'multiplication',
						handler : toHandler
					})
				gridMenu.add('-');
			}
		}
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
		var url = BASE_PATH+ "Business/contract/cont.generalInfo.addorupdate.jsp?";
		if ("" != state) {
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
			if ("menu_view" == state) {
				window.location.href = BASE_PATH
						+ "Business/contract/cont.generalInfo.view.jsp?acc=con&conid="
						+ menu_conid+"&query="+query;
			}
			if ("menu_add" == state) {
				window.location.href = url;
			}
			if ("menu_edit" == state) {
				window.location.href = url + "conid=" + menu_conid+"&modid="+MODID;// &state='edit'";
			}
			if ("menu_del" == state) {
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				Ext.Msg.show({
					title : '提示',
					msg : '是否要删除?　　　　',
					buttons : Ext.Msg.YESNO,
					icon : Ext.MessageBox.QUESTION,
					fn : function(value) {
						if ("yes" == value) {
							Ext.get('loading-mask').show();
							Ext.get('loading').show();
							conoveMgm.deleteConove(menu_conid,MODID, function(flag) {
										Ext.get('loading-mask').hide();
										Ext.get('loading').hide();
										if ("0" == flag) {
											Ext.example.msg('删除成功！',
													'您成功删除了一条合同信息！');
											reload();
											equlistMgm.deleteConAll(menu_conid);
										} else if ("1" == flag) {
											Ext.Msg.show({
														title : '提示',
														msg : '数据删除失败！',
														buttons : Ext.Msg.OK,
														icon : Ext.MessageBox.ERROR
													});
										} else {
											Ext.Msg.show({
														title : '提示',
														msg : flag,
														buttons : Ext.Msg.OK,
														icon : Ext.MessageBox.ERROR
													})
										};
									});
						}
					}
				});
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
	
	//国金需求默认显示列
	var reg = /^10309/;
	var result =  reg.exec(currentPid);
	if(result!=null && DEPLOY_UNITTYPE != '0'){
		 grid.getColumnModel().setHidden(grid.getColumnModel().findColumnIndex("coninvoicemoney"),false);
		 grid.getColumnModel().setHidden(grid.getColumnModel().findColumnIndex("realdifferencemoney"),false);
		 grid.getColumnModel().setHidden(grid.getColumnModel().findColumnIndex("conAdjust"),true);
		 grid.getColumnModel().setHidden(grid.getColumnModel().findColumnIndex("performancedate"),false);
		 grid.getColumnModel().setHidden(grid.getColumnModel().findColumnIndex("billstate"),true);
	}
	
	for(var o in fc){
		var name = fc[o];
		var temp = new Array();
		temp.push(fc[o].name);
		temp.push(fc[o].fieldLabel);
		var colModel = grid.getColumnModel();
		//锁定列不在显示更多信息中出现
		if(colModel.getLockedCount()<=colModel.findColumnIndex(fc[o].name)){
		    cmArray.push(temp);
		    if(!colModel.isHidden(colModel.getIndexById(o))){
	        	cmHide.push(o);
		    }
		}
	}
	store1.loadData(cmArray)
			
	chooseRow.setValue(cmHide);
    chooseRow.setRawValue("显示更多信息");

	grid.on('mouseout', function(e,t,a) {
			if(chooseRow.getValue()==""||chooseRow.getValue()==null){
				chooseRow.setValue(cmHide);
				chooseRow.setRawValue("显示更多信息");
			}
	});
	Ext.get("chooserow").on("mouseout", function(){
			if(chooseRow.getValue()==""||chooseRow.getValue()==null){
				chooseRow.setValue(cmHide);
				chooseRow.setRawValue("显示更多信息");
			}
	}, this);

	// 11. 事件绑定
	sm.on('rowselect', function(sm) { // grid 行选择事件
			page = grid.getBottomToolbar().getPageData().activePage;
			var record = sm.getSelected();
			parent.conid = record.get('conid');
			parent.conno = record.get('conno');
			parent.conname = record.get('conname');
			parent.convalue = record.get('convaluemoney');
			parent.conmoney = record.get('conmoney');
			parent.page = page;
            if(parent.mainPanel!=null&&parent.mainPanel!=undefined){
            	var tb = parent.mainPanel.getTopToolbar();
				if (record != null) {
					if(OPTYPE!=""){
						if(OPTYPE=='conpay')
					    tb.items.get("pay").enable();
						if(OPTYPE=='conbre')
						tb.items.get("breach").enable();
						if(OPTYPE=='concla')
						tb.items.get("compensate").enable();
						if(OPTYPE=='conbal')
						tb.items.get("balance").enable();
						if(OPTYPE=='concha')
						tb.items.get("change").enable();
					}else {
						tb.items.get("pay").enable();
						tb.items.get("change").enable();
						tb.items.get("compensate").enable();
						tb.items.get("balance").enable();
						tb.items.get("breach").enable();
						//tb.items.get("remove").enable();
						tb.items.get("upload").enable();
						tb.items.get("money").enable();
					}
				}
			}
	});
	sm.on('rowdeselect', function() {
			if(parent.mainPanel!=null&&parent.mainPanel!=undefined){
				var tb = parent.mainPanel.getTopToolbar();
				tb.items.get("pay").disable();
				tb.items.get("change").disable();
				tb.items.get("compensate").disable();
				//tb.items.get("balance").disable();
				tb.items.get("breach").disable();
				//tb.items.get("remove").disable();
				tb.items.get("upload").disable();
				tb.items.get("money").disable();
			}
	});
	
	paramsStr = filter1;
	if (gridfiter != '')
		paramsStr += " and " + gridfiter;
	reload();
	

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)? value.dateFormat('Y-m-d H:i'): value;
	};

	function renderConno(value, metadata, record) {
		var getConid = record.get('conid');
		conname = record.get('connname');
		var output ="";
		output ="<a title='"+value+"'   style='color:blue;' href=Business/contract/cont.generalInfo.view.jsp?query="+query+"&conid="+ getConid
		+"&conids="+encodeURIComponent(CONIDS)+"&optype="+OPTYPE+"&dyView="+dyView+"&uids="+UIDS+"&acc=con\>" + value + "</a>"		
		return output;
	}

	function renderConAdjust(value, metadata, record) {
		var getConid = record.get('conid');
		var getConno= record.get('conno');
		var count=0;
		DWREngine.setAsync(false);
		db2Json.selectData("select count(infoid) as infoid,count(fileno) as fileno from zl_info where modtabid='"+getConid+"'", function (jsonData) {
			var list = eval(jsonData);
			if(list!=null){
				count=list[0].infoid;
			}
		});
		DWREngine.setAsync(true);
		if(count!=0){
			return "<a href='javascript:void(0)'  style='color:blue;' onclick='conAdjustWin(\"" + getConid + "\",\"" + getConno + "\")'>查看["+count+"]</a>";
		}else{
			return "<a href='javascript:void(0)' style='color:gray;'>查看["+count+"]</a>";
		}
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
		
		if(DEPLOY_UNITTYPE == "0"){
			value = cnMoneyToPrec(value/10000,2);
		}else{
			value = cnMoneyToPrec(value,2);
		}

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
	fixedFilterPart=" pid='"+CURRENTAPPID+"'";
})
	//查看合同附件函数
	function conAdjustWin(conid,conno){
		fileUrl = CONTEXT_PATH+ "/Business/contract/cont.files.view.jsp?select="+ conid+"&conno="+conno;
		var fileWin = new Ext.Window({
					title : "合同附件",
					width : 700,
					height : 400,
					minWidth : 350,
					minHeight : 200,
					layout : 'fit',
					closeAction : 'close',
					modal : true,
					html : "<iframe name='fileFrame' src='" + fileUrl
							+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
				});
		fileWin.show();
	}
function createOtherCostTypeWin(){
        var conid="",otherCostType='';
        var record = grid.getSelectionModel().getSelected();    
        if(record!=null&&record!=""){
            if(record.data.parent == "0"){
                Ext.example.msg("提示","请选择一条合同信息！");
                return;
            }
            conid = record.data.conid;
            
            if(conid!=null&&conid!=""){
                DWREngine.setAsync(false);
                baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+conid+"'", function(list){
                if (list.length > 0){
                    otherCostType = list[0].otherCostType;
                }
                }); 
                DWREngine.setAsync(true);                           
            }
            formSaveWin = new Ext.Window({
                title : '【其他费用类型维护】',
                width : 300,
                height : 120,
                layout : 'fit',
                iconCls : 'form',
                closeAction : 'close',
                border : false,
                constrain : true,
                modal : true,
                items : [new Ext.FormPanel({
                    header: false,
			        border: false,
			        region: 'center',
                    bodyStyle: 'padding:10px 10px;',
                    layout: 'form', columnWidth: .33,
                    items:[
                        new Ext.form.Hidden({
                            id : 'conid',
                            value : conid
                        }),
                        new Ext.form.ComboBox({
                            id: 'otherCostType',
                            name: 'otherCostType',
							fieldLabel: '其他费用类型',
							valueField: 'k',
							displayField: 'v',
							mode: 'local',
				            typeAhead: true,
				            triggerAction: 'all',
				            store: dsOtherCostType,
				            lazyRender: true,
				            value:otherCostType,
				            forceSelection: true,
				            allowBlank:false,
				            listClass: 'x-combo-list-small',
							anchor: '95%'
                        })
                    ]
                })],
                listeners : {
                    'hide' : function(){
                    
                    }
                },
                buttonAlign : 'center',
                buttons : [
                    new Ext.Button({
                        text : ' 确定 ',
                        handler : function(){
                            var otherCostType1 = Ext.getCmp("otherCostType").getValue();
                            DWREngine.setAsync(false);
                            var sql = "update con_ove set OTHER_COST_TYPE='"+otherCostType1+"' where conid='"+conid+"'";
                            baseDao.updateBySQL(sql,function(str){
                                if(str == "1"){
                                    Ext.example.msg("提示","保存成功！");
                                    formSaveWin.close();
                                }
                            })
                            DWREngine.setAsync(true);
                        }
                    }),
                    new Ext.Button({
                        text : ' 关闭 ',
                        handler : function(){
                            formSaveWin.close();
                        }
                    })
                ]
             })         
        formSaveWin.show();
    }else{
        Ext.example.msg("提示","请选择一条合同信息！");
    }
}
function renderConno(value, record,getConid,conname) {
	var output ="";
	output = BASE_PATH+"Business/contract/cont.generalInfo.view.jsp?query="+query+"&conid="+ getConid
	+"&conids="+encodeURIComponent(CONIDS)+"&optype="+OPTYPE+"&dyView="+dyView+"&uids="+UIDS+"&page="+page+"&acc=con";
	window.location.href = 	output;
}

function reload() {
	parent.dsparams = paramsStr;
	ds.baseParams.params = paramsStr;
	fixedFilterPart = paramsStr;
	if (conttype != null && conttype != "" && contyear != null && contyear != "") {
		ds.baseParams.params += " and signdate between to_date('" + contyear
				+ "-01-01','YYYY-MM-DD')  and to_date('" + contyear + "-12-31','YYYY-MM-DD') ";
	}
	if (backFlag != null && backFlag == 1) {
		page = pages ? pages : page;
		ds.load({
					params : {
						start : (page - 1) * PAGE_SIZE,
						limit : PAGE_SIZE
					}
				});
	} else {
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}
}