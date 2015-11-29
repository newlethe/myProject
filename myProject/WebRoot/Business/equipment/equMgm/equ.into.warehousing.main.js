// 设备入库主页
var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStorein";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "warehouseDate";

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var selectParentid = "";
var selectWin;
var pid = CURRENTAPPID;
var ds;
var dsSub;
var saveBtn;
var jzArr = new Array();
var getEquidstore = new Array();
var equTypeArr = new Array();
var partBs = new Array();

var billStateArr = new Array();
var moduleFlowType = '';
//非主体设备标志
var DATA_TYPE = "EQUOTHER";

Ext.onReady(function() {
    var gridPanelName = CURRENTAPPID == "1031902"? "设备/材料入库单":"设备入库单";
    if(isFlwTask != true && isFlwView != true){
	    DWREngine.setAsync(false);
	    //通过配置信息判断该流程是否走审批流程
	    systemMgm.getFlowType(USERUNITID,MODID,function (rtn){
	        moduleFlowType=rtn;
	    });
	    DWREngine.setAsync(true);
    }
//isFlwTask = true;
//flowid = "GJ-SB-2010-001-RK-0001";
//moduleFlowType = "123"
    
	// 处理设备仓库下拉框
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
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
	});
	// 设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类", function(list) {
				for (i = 0; i < list.length; i++) {
					if (list[i].propertyCode == "4")
						continue;
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					equTypeArr.push(temp);
				}
			});
	
	 // 获取乙方单位
    conpartybMgm.getPartyB(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);
			temp.push(list[i].partyb);
			partBs.push(temp);
		}
	});
    
	//合同列表
	var conArr=new Array();
	var sql = "select c.conid,c.conname  from Equ_Cont_View c";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			conArr.push(temp);			
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
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	// 处理设备仓库下拉框

	var fm = Ext.form; // 包名简写（缩写）
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同名称'
		},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树'
		},
		'finished' : {
			name : 'finished',
			fieldLabel : '完结'
		},
		'warehouseNo' : {
			name : 'warehouseNo',
			fieldLabel : '入库单据号'
		},
		'warehouseDate' : {
			name : 'warehouseDate',
			fieldLabel : '入库日期'
		},
		'noticeNo' : {
			name : 'noticeNo',
			fieldLabel : '开箱检验单号'
		},
		'warehouseMan' : {
			name : 'warehouseMan',
			fieldLabel : '库管员'
		},
		'makeMan' : {
			name : 'makeMan',
			fieldLabel : '制单人'
		},
		'supplyunit' : {
            name : 'supplyunit',
            fieldLabel : '供货单位'
        },
		'remark' : {
			name : 'remark',
			fieldLabel : '入库备注'
		},
		'abnormalOrNo' : {
			name : 'abnormalOrNo',
			fieldLabel : '是否异常'
		},
		'openBoxId' : {
			name : 'openBoxId',
			fieldLabel : '设备开箱主键'
		}
        ,'billState' : {name : 'billState',fieldLabel : '审批状态'}
        ,'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'fileid' : {name : 'fileid',fieldLabel : '单据文档'},
        'equAdjust' : {name : 'equAdjust',fieldLabel : '附件',anchor : '95%'}
	}

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([
			// sm,
			{
		id : 'uids',
		header : fc['uids'].fieldLabel,
		dataIndex : fc['uids'].name,
		hidden : true
	}, {
		id : 'pid',
		header : fc['pid'].fieldLabel,
		dataIndex : fc['pid'].name,
		hidden : true
	}, {
		id : 'treeuids',
		header : fc['treeuids'].fieldLabel,
		dataIndex : fc['treeuids'].name,
		hidden : true
	}, {
		id : 'openBoxId',
		header : fc['openBoxId'].fieldLabel,
		dataIndex : fc['openBoxId'].name,
		width : 0,
		hidden : true
    },{
        id:'billState',
        header: fc['billState'].fieldLabel,
        dataIndex: fc['billState'].name,
        renderer : function(v){
            var bill = "";
            for(var i=0;i<billStateArr.length;i++){
                if(v == billStateArr[i][0])
                    bill = billStateArr[i][1];
            }
            return bill;
        },
        align : 'center',
        hidden : moduleFlowType=="None" ? true : false,
        width : 70
    },{
        //隐藏，目前与入库单据号相同，点击合同树节点后会使用此字段过滤
        id:'flowid',
        header: fc['flowid'].fieldLabel,
        dataIndex: fc['flowid'].name,
        hidden : true,
        width : 180
	}, {
		id : 'finished',
		header : fc['finished'].fieldLabel,
		dataIndex : fc['finished'].name,
		renderer : function(v, m, r) {
            var b = r.get('billState');
			var abnormalOrNo = r.get('abnormalOrNo');
            var str = "<input type='checkbox' "
                    + (b != 1 ? "disabled title='审批完成后才能完结操作'" : "")
                    + (v == 1 ? "disabled checked title='已完结'" : "title='未完结'")
                    + " onclick='finishOpenbox(\"" + r.get("uids") + "\",\""
                    + abnormalOrNo + "\",this)'>"
			return str;
		},
		width : 40
	}, {
		id : 'warehouseNo',
		header : fc['warehouseNo'].fieldLabel,
		dataIndex : fc['warehouseNo'].name,
		align : 'center',
		sortable:true,
		width : 200,
		type : 'string'
	}, {
		id : 'warehouseDate',
		header : fc['warehouseDate'].fieldLabel,
		dataIndex : fc['warehouseDate'].name,
		align : 'center',
		renderer : formatDateTime,
		width : 100,
		type : 'date'
	},{
		id : 'noticeNo',
		header : fc['noticeNo'].fieldLabel,
		dataIndex : fc['noticeNo'].name,
		align : 'center',
		width : 250,
		type : 'string'
	}, {
		id : 'supplyunit',
		header : fc['supplyunit'].fieldLabel,
		dataIndex : fc['supplyunit'].name,
		align : 'center',
        renderer : function(v){
			var str = '';
			for (var i = 0; i < partBs.length; i++) {
				if (partBs[i][0] == v) {
				    str = partBs[i][1]
				    break;
				}
			}
			return str;
        },
		width : 220
	},{
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		width : 180,
			renderer : function(v,m,r){
				var conid = r.get('conid');
			    var conname;
				for(var i=0;i<conArr.length;i++){
					if(conid == conArr[i][0]){
						conname = conArr[i][1];
						break;
					}
				}
				var qtip = "qtip=" + conname;
  				return'<span ' + qtip + '>' + conname + '</span>';
//				var output ="<a title='"+conname+"' style='color:blue;' " +
//						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+conname+"</a>"		
//				return output;           
           },
           type : 'string',
           tab_col : 'ConOve|conid|conname'
	}, {
		id : 'warehouseMan',
		header : fc['warehouseMan'].fieldLabel,
		dataIndex : fc['warehouseMan'].name,
		align : 'center',
		width : 150,
		type : 'string'
	},{
        id:'fileid',
        header:fc['fileid'].fieldLabel,
        dataIndex:fc['fileid'].name,
        renderer : function(v,m,r){
            if(v){
                return "<center><a href='" + BASE_PATH
                        + "servlet/MainServlet?ac=downloadfile&fileid="
                        + v +"'><img src='" + BASE_PATH
                        + "jsp/res/images/word.gif'></img></a></center>"
            }else{
                return "<img src='"+BASE_PATH+"jsp/res/images/word_bw.gif'></img>";
            }
        },
        align : 'center',
        width : 90
    }, {
			id : 'equAdjust',
			type : 'XXXX',
			header : fc['equAdjust'].fieldLabel,
			dataIndex : fc['equAdjust'].name,
			align : 'center',
			width : 60,
           	//hidden : (DEPLOY_UNITTYPE == "0")
			renderer :renderEquAdjust
		}, {
		id : 'makeMan',
		header : fc['makeMan'].fieldLabel,
		dataIndex : fc['makeMan'].name,
		align : 'center',
		width : 180,
		type : 'string'
	}, {
		id : 'remark',
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		align : 'center',
		width : 180
	}, {
		id : 'abnormalOrNo',
		header : fc['abnormalOrNo'].fieldLabel,
		dataIndex : fc['abnormalOrNo'].name,
		align : 'right',
		width : 0,
		hidden : true
	}]);

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'treeuids',
				type : 'string'
			}, {
				name : 'finished',
				type : 'float'
			}, {
				name : 'warehouseNo',
				type : 'string'
			}, {
				name : 'warehouseDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'noticeNo',
				type : 'string'
			}, {
				name : 'warehouseMan',
				type : 'string'
			}, {
				name : 'makeMan',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'abnormalOrNo',
				type : 'string'
			}, {
				name : 'openBoxId',
				type : 'string'
			},{
				name : 'supplyunit',
				type : 'string'
			}
            ,{name : 'billState', type : 'string'}
            ,{name : 'flowid', type : 'string'},
            {name : 'fileid', type : 'string'}

	];

	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					// params: "conid='"+edit_conid+"'"
					params : "pid='" + CURRENTAPPID + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'desc');
	//增加非主体设备过滤条件 pengy 2014-05-14
	ds.on("beforeload", function() {
		ds.baseParams.params += " and (dataType='" + DATA_TYPE + "' or dataType is null)";
	});

	var addBtn = new Ext.Button({
				id : 'addBtn',
				text : '新增',
				iconCls : 'add',
				handler : addOrUpdateFun
			});

	var editBtn = new Ext.Button({
				id : 'updataBtn',
				text : '修改',
				iconCls : 'btn',
				handler : addOrUpdateFun
			});

	var delBtn = new Ext.Button({
				text : '删除',
				iconCls : 'remove',
				handler : delFun
			});
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
		/****************************打印***************************************/
	var printBtn = new Ext.Button({
				text : '打印',
				iconCls : 'print',
				handler : doPrint
			});
		function doPrint() {
			var fileid = "";
			var uids = "";
			var finished = "";
			var modetype = "SB";
			var record = sm.getSelected();
			if (record != null && record != "") {
				uids = record.get("uids");
				finished = record.get("finished");
			} else {
				Ext.example.msg('提示信息', '请先选择要打印的记录！');
				return;
			}
			// 模板参数，固定值，在 系统管理 -> office模板 中配置
			var filePrintType = "EquGoodsStoreinVGj";
			var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"
					+ filePrintType + "'";
			DWREngine.setAsync(false);
			baseMgm.getData(sql, function(str) {
						fileid = str;
					});
			DWREngine.setAsync(true);
			if (fileid == null || fileid == "") {
				Ext.MessageBox.alert("文档打印错误", "文档打印模板不存在，请先在系统管理中添加！");
				return;
			} else {
				var docUrl = BASE_PATH
						+ "Business/equipment/equMgm/equ.file.print.jsp?fileid="
						+ fileid;
				docUrl += "&filetype=" + filePrintType
				docUrl += "&uids=" + uids
				docUrl += "&modetype=" + modetype
				docUrl += "&finished="+finished
				docUrl += "&beanname="+bean
				docUrl += "&fileName=设备入库单-设备.doc";
				docUrl = encodeURI(docUrl);
				// window.open(docUrl)
				var rtn = window.showModalDialog(
								docUrl,
								"",
								"dialogWidth:"
										+ screen.availWidth
										+ "px;dialogHeight:"
										+ screen.availHeight
										+ "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
				if (rtn !=null){
					ds.reload();
				}
			}
	}	
	/*******************************打印***************************************/
	var gridPanel = new Ext.grid.GridPanel({
				ds : ds,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : ['<font color=#15428b><B>'+gridPanelName+'<B></font>', '-', addBtn,
						'-', editBtn, '-', delBtn],
				header : false,
				border : false,
				// layout: 'fit',
				region : 'center',
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});
	//附件
	function renderEquAdjust(value, metadata, record) {
		var getUids = record.get('uids');
		var getDhno= record.get('dhNo');
		var finished = record.get("finished");
		var count=0;
		DWREngine.setAsync(false);
		db2Json.selectData("select count(transaction_id) transactionid  from sgcc_attach_list t where t.transaction_id='"+getUids+"'", function (jsonData) {
			var list = eval(jsonData);
			if(list!=null){
				count=list[0].transactionid;
			}
		});
		DWREngine.setAsync(true);
		if(count!=0){
			return "<a href='javascript:void(0)'  style='color:blue;' onclick='equAdjustWin(\"" + getUids + "\",\"" + getDhno + "\",\"" + finished + "\")'>附件["+count+"]</a>";
		}else{
			return "<a href='javascript:void(0)' style='color:gray;'onclick='equAdjustWin(\"" + getUids + "\",\"" + getDhno + "\",\"" + finished + "\")'>附件["+count+"]</a>";
		}
	}
	// TODO : ======入库通知单明细======
	var fcSub = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'sbrkUids' : {
			name : 'sbrkUids',
			fieldLabel : '设备入库主表主键'
		},
		'boxSubId' : {
			name : 'boxSubId',
			fieldLabel : '设备开箱明细表主键'
		},
		'boxNo' : {
			name : 'boxNo',
			fieldLabel : '箱件号/构件号'
		},
		'warehouseType' : {
			name : 'warehouseType',
			fieldLabel : '设备类型'
		},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号'
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '设备部件名称'
		},
		'ggxh' : {
			name : 'ggxh',
			fieldLabel : '规格型号'
		},
		'graphNo' : {
			name : 'graphNo',
			fieldLabel : '图号'
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位'
		},
		'warehouseNum' : {
			name : 'warehouseNum',
			fieldLabel : '检验数量'
		},
		'weight' : {
			name : 'weight',
			fieldLabel : '重量（kg）',
			decimalPrecision : 3
		},
		'inWarehouseNo' : {
			name : 'inWarehouseNo',
			fieldLabel : '入库数量',
			decimalPrecision : 4
		},
		'intoMoney' : {
			name : 'intoMoney',
			fieldLabel : '入库单价'
		},
		'totalMoney' : {
			name : 'totalMoney',
			fieldLabel : '入库总价'
		},
		'equno' : {
			id : 'equno',
			name : 'equno',
			fieldLabel : '入库存放库位',
			mode : 'local',
			editable : false,
			valueField : 'k',
			displayField : 'v',
			readOnly : true,
			listWidth : 220,
			lazyRender : true,
			triggerAction : 'all',
			store : getEquid,
			tpl : "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			listClass : 'x-combo-list-small'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注'
		}
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

	storTreePanel.on('click', function(node, e) {
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
			// smSub,
			new Ext.grid.RowNumberer({
						header : '序号',
						width : 35
					}), {
				id : 'uids',
				header : fcSub['uids'].fieldLabel,
				dataIndex : fcSub['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcSub['pid'].fieldLabel,
				dataIndex : fcSub['pid'].name,
				hidden : true
			}, {
				id : 'sbrkUids',
				header : fcSub['sbrkUids'].fieldLabel,
				dataIndex : fcSub['sbrkUids'].name,
				hidden : true
			}, {
				id : 'boxSubId',
				header : fcSub['boxSubId'].fieldLabel,
				dataIndex : fcSub['boxSubId'].name,
				hidden : true

			}, {
				id : 'boxNo',
				header : fcSub['boxNo'].fieldLabel,
				dataIndex : fcSub['boxNo'].name,
				align : 'right'
			}, {
				id : 'warehouseType',
				header : fcSub['warehouseType'].fieldLabel,
				dataIndex : fcSub['warehouseType'].name,
				align : 'center',
				renderer : function(v) {
					var equ = "";
					for (var i = 0; i < equTypeArr.length; i++) {
						if (v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				}
			}, {
				id : 'jzNo',
				header : fcSub['jzNo'].fieldLabel,
				dataIndex : fcSub['jzNo'].name,
				align : 'center',
				width : 100	,
				renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			}
			}, {
				id : 'warehouseName',
				header : fcSub['warehouseName'].fieldLabel,
				dataIndex : fcSub['warehouseName'].name,
				align : 'center',
				width : 200
			}, {
				id : 'ggxh',
				header : fcSub['ggxh'].fieldLabel,
				dataIndex : fcSub['ggxh'].name,
				align : 'center',
				width : 100
			}, {
				id : 'graphNo',
				header : fcSub['graphNo'].fieldLabel,
				dataIndex : fcSub['graphNo'].name,
				align : 'center',
				width : 100
			}, {
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
				align : 'center',
				width : 180
			}, {
				id : 'warehouseNum',
				header : fcSub['warehouseNum'].fieldLabel,
				dataIndex : fcSub['warehouseNum'].name,
				align : 'right',
				width : 80
			}, {
				id : 'weight',
				header : fcSub['weight'].fieldLabel,
				dataIndex : fcSub['weight'].name,
				align : 'right',
				width : 80
			}, {
				id : 'inWarehouseNo',
				header : fcSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcSub['inWarehouseNo'].name,
				align : 'right',
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['inWarehouseNo']),
				width : 80
			}, {
				id : 'intoMoney',
				header : fcSub['intoMoney'].fieldLabel,
				dataIndex : fcSub['intoMoney'].name,
				align : 'right',
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['intoMoney'])

			}, {
				id : 'totalMoney',
				header : fcSub['totalMoney'].fieldLabel,
				dataIndex : fcSub['totalMoney'].name,
				align : 'right',
                renderer : function(v,m,r){
                    return r.get("intoMoney")*r.get("inWarehouseNo");
                }
			}, {
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v, m, r) {
					var equno = "";
					m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < getEquidstore.length; i++) {
						if (v == getEquidstore[i][0])
							equno = getEquidstore[i][1];
					}
					return equno;
				},
				align : 'center',
				editor : equnoComboBox
			}, {
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
				width : 200,
				align : 'center',
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.TextField(fcSub['memo'])
			}]);

	var ColumnsSub = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'sbrkUids',
				type : 'string'
			}, {
				name : 'boxSubId',
				type : 'string'
			}, {
				name : 'boxNo',
				type : 'string'
			}, {
				name : 'warehouseType',
				type : 'string'
			}, {
				name : 'jzNo',
				type : 'string'
			}, {
				name : 'warehouseName',
				type : 'string'
			}, {
				name : 'ggxh',
				type : 'string'
			}, {
				name : 'graphNo',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'warehouseNum',
				type : 'float'
			}, {
				name : 'weight',
				type : 'float'
			}, {
				name : 'inWarehouseNo',
				type : 'float'
			}, {
				name : 'intoMoney',
				type : 'float'
			}, {
				name : 'totalMoney',
				type : 'float'
			}, {
				name : 'equno',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}

	];

	dsSub = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSub,
					business : businessSub,
					method : listMethodSub,
					params : "1=2"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeySub
						}, ColumnsSub),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsSub.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列

	var PlantSub = Ext.data.Record.create(ColumnsSub);
	var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		sbrkUids : '',
		boxSubId : '',
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
		memo : '',
		jzNo:''
	}

	saveBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
				handler : saveFun
			});
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		tbar : ['<font color=#15428b><B>'+gridPanelName+'明细<B></font>', '-', '->', saveBtn],
		header : false,
		height : document.body.clientHeight * 0.5,
		border : false,
		// layout: 'fit',
		region : 'south',
		addBtn : false, // 是否显示新增按钮
		saveBtn : false, // 是否显示保存按钮
		delBtn : false, // 是否显示删除按钮
		stripeRows : true,
		loadMask : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsSub,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : businessSub,
		primaryKey : primaryKeySub

	});

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				items : [gridPanel, gridPanelSub]
			});

	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, contentPanel]
			});
    var queryBtn = new Ext.Button({
        id: 'query',
        text: '查询',
        tooltip: '查询',
        iconCls: 'option',
        handler: showWindow_
    });
	gridPanel.getTopToolbar().add('-',queryBtn,'-',exportExcelBtn,'-',printBtn);

	function showWindow_() {
		if(selectParentid == "0"){
		     fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
		}else{
			if(selectUuid != '' && selectConid != ''){
				//查询当前选中节点的所有子节点主键。
				var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
				var treeuuidstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(sql,function(list){
					for(i = 0; i < list.length; i++) {
						treeuuidstr += ",'"+list[i]+"'";		
					}
				});	
				DWREngine.setAsync(true);
				treeuuidstr = treeuuidstr.substring(1);
	            fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
			}
		}		
		showWindow(gridPanel)
	};
    
    if(isFlwTask == true || isFlwView == true)
        ds.baseParams.params = " warehouseNo = '"+flowid+"' "
    ds.load({params:{start:0,limit:PAGE_SIZE}});
    ds.on("load",function(){
    	setPermission();
        if(isFlwTask == true && ds.getCount() > 0 && ds.getCount() == 1){
            addBtn.setDisabled(true);
        //}else if(isFlwTask != true){
        //    addBtn.setDisabled(false);
        }
        if(isFlwView == true){
            addBtn.setDisabled(true);
            editBtn.setDisabled(true);
            delBtn.setDisabled(true);
            queryBtn.setDisabled(true);
            exportExcelBtn.setDisabled(true);
            saveBtn.setDisabled(true);
        }
        if(isFlwTask == true){
            queryBtn.setDisabled(true);
            exportExcelBtn.setDisabled(true);
        }
    });
            
            
	sm.on("rowselect", function() {
        var record = sm.getSelected();
        var billStateBool = record.get('billState')=='0' ? false : true;
        if(record.get('finished') == 1 || (!isFlwTask && billStateBool && moduleFlowType!="None")){
            editBtn.setDisabled(true);
            delBtn.setDisabled(true);
            saveBtn.setDisabled(true);
        }else{
        	 if(ModuleLVL == '1' || ModuleLVL== '2'){
        	 	editBtn.setDisabled(false);
				delBtn.setDisabled(false);
            	saveBtn.setDisabled(false);
        	 }
            if(isFlwView == true){
                addBtn.setDisabled(true);
                editBtn.setDisabled(true);
                delBtn.setDisabled(true);
                saveBtn.setDisabled(true);
            }
        }
        dsSub.baseParams.params = "sbrkUids = '"+record.get('uids')+"' and pid='"+record.get("pid")+"'";
        dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	})
	//按钮权限设置
	function setPermission(){
		if(ModuleLVL != '1' && ModuleLVL != '2'){
			if(addBtn && editBtn && delBtn){
				addBtn.setDisabled(true);
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
			}
		}
	}
	treePanel.on('click', function() {
		dsSub.baseParams.params = "1=2";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});

	// -------------------function-------------------
	function saveFun() {
		gridPanelSub.defaultSaveHandler();
	}

	function exportDataFile() {
		// yanglh 2013-10-31 对点击合同分类树导出做过来
		var uidsS = '';
		var sqlS = ''
		var openUrl = "";
		// 选择到货单后导出该记录的明细
		var record = sm.getSelected();
		if (record != null) {
			uidsS = " and sbrk_uids in ('" + record.get("uids") + "')";
			openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=StoreInSubList&pid=" + CURRENTAPPID + "&uidS=" + uidsS;
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
			return;
		}
		// 点击合同分类树是导出该节点及节点下的到货单记录明细
		if ((selectParentid == null || selectParentid == '') && (selectTreeid == null || selectTreeid == '')) {
			openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=StoreInSubList&pid=" + CURRENTAPPID;
		} else {
			if (selectParentid == '0') {
				sqlS = "select uids from equ_goods_storein where conid in (select conid from " +
						"Equ_Con_Ove_Tree_View where parentid='" + selectTreeid + "')";
			} else {
				if (selectTreeid.indexOf("04") == 0) {
					return;
				} else {
					sqlS = "select uids from equ_goods_storein where treeuids in (select a.uids from (select t.*" +
						" from equ_con_ove_tree_view t where t.conid='" + selectConid + "' ) a start with a.treeid" +
						"=(SELECT t.treeid from equ_con_ove_tree_view t where t.uids='" + selectUuid + "' and a.conid='" +
						selectConid + "') connect by PRIOR  a.treeid =  a.parentid) and conid='" + selectConid + "'";
				}
			}
			DWREngine.setAsync(false);
			baseDao.getData(sqlS, function(list) {
				if (list.length > 0) {
					for (i = 0; i < list.length; i++) {
						uidsS += ",'" + list[i] + "'";
					}
				}
			});
			DWREngine.setAsync(true);
			uidsS = uidsS.substring(1);
			if (uidsS != '') {
				uidsS = " and sbrk_uids in (" + sqlS + ")";
				openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=StoreInSubList&pid="
						+ CURRENTAPPID + "&uidS=" + uidsS;
			} else {
				Ext.example.msg("信息提示", "该分类下没有数据,无法导出！");
				return;
			}
		}
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	function addOrUpdateFun(btn) {
		var record = sm.getSelected();
		var url = BASE_PATH
				+ "Business/equipment/equMgm/equ.into.warehousing.addorupdata.jsp";
		if (btn.id == 'addBtn') {
			if(selectUuid == "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;			    
			}
			if(selectUuid != "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边该专业下的合同分类！');
		    	return ;
			}
			if (selectTreeid.indexOf("04") == 0) {
				Ext.example.msg('提示信息', '技术资料分类下不能添加入库通知单！');
				return;
			}
			url += "?conid=" + selectConid + "&treeuids=" + selectUuid
					+ "&treeid=" + selectTreeid;
		} else if (btn.id == 'updataBtn') {
			if (record == null || record == "") {
				Ext.example.msg('提示信息', '请选择您要修改的入库单记录！');
				return;
			}
			var banFlag = record.data.abnormalOrNo;
			url += "?conid=" + record.data.conid + "&treeuids="
					+ record.data.treeuids + "&uids=" + record.data.uids
					+ "&banFlag=" + banFlag;
		}
        if(isFlwTask == true){
            url += "&isTask=true";
            if(flowid!="")
                url += "&flowid="+flowid;
        }
        
        url += "&moduleFlowType="+moduleFlowType;

		selectWin = new Ext.Window({
			width : 950,
			height : document.body.clientHeight - 20,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
            closable : false,
            maximizable : true,
			html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function() {
					ds.reload();
					dsSub.reload();
                    if(isFlwTask == true) flowToNext();
				},
				'show' : function() {
					equArrival.location.href = url;
				}
			}
		});
		selectWin.show();
	}

	function delFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if (record == null || record == "") {
			Ext.example.msg('提示信息', '请先选择要删除的记录！');
			return;
		}
        var finished = record.get("finished");
        var flag = record.get("abnormalOrNo"); 
        if (finished == '1') {
			delBtn.setDisabled(true);
			return;
		} else {
			Ext.Msg.confirm("信息提示", "删除后不能恢复，是否要删除", function(btn) {
						if (btn == 'yes') {
							var uids = record.get("uids");
							gridPanel.getEl().mask("loading...");
							DWREngine.setAsync(false);
							equMgm.delEquRkGoodsStorein(uids, flag, pid,
									function(text) {
										if (text == 'success') {
											Ext.example.msg('提示信息', '您删除了一条记录');
                                            if(isFlwTask == true) addBtn.setDisabled(false);
										} else {
											Ext.example.msg('提示信息', '删除失败');
										}
										ds.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
										dsSub.baseParams.params = "1=2";
										dsSub.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
									});
							DWREngine.setAsync(false);
							gridPanel.getEl().unmask();
						} else {
							Ext.example.msg('提示信息', '您放弃了删除');
							return;
						}
					})

		}
	}

	function formatDateTime(value) {
		return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
	};
})

function finishOpenbox(uids, exceOr, finished) {
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
	Ext.MessageBox.confirm('提示', '请确保数据无误和打印后再进行完结，确认要完结？', function(btn, text) {
		if(btn =='yes'){
			DWREngine.setAsync(false);
			equMgm.judgmentFinished(uids, exceOr, pid,'equ','正式入库', function(index) {
				if (index == '2') {
					Ext.example.msg('提示信息','设备入库单中<br>【<font style="color:red;">' +
							        '设备入库详细信息</font>】数据未填写完整<br>请填写完整！');
					finished.checked = false;
				} else if (index == '3') {
					Ext.example.msg('提示信息','设备入库单中<br>【<font style="color:red;">' +
							        '设备入库详细信息</font>】为空<br>不能完结！');
					finished.checked = false;
				} else if (index == '0') {
					Ext.example.msg('提示信息', '设备入库单完结操作成功！');
					finished.checked = true;
		            if(finished.checked)
		            finishTaskEdit();
				} else if (index == '1') {
					Ext.example.msg('提示信息', '完结出错！');
					finished.checked = false;
				}
				if (selectUuid == null || selectUuid == "") {
					ds.baseParams.params = " pid='"+ pid + "' ";
		            if(isFlwTask == true){
		                ds.baseParams.params = "pid='"+ pid + "' and warehouseNo = '"+flowid+"'";
		            }
				} else {
					ds.baseParams.params = "treeuids='" + selectUuid + "' and pid='"+ pid + "'";
		            if(isFlwTask == true){
		                ds.baseParams.params = "treeuids='" + selectUuid + "' and pid='"+ pid + "' and warehouseNo = '"+flowid+"'";
		            }
				}
				ds.load({params:{start:0,limit:PAGE_SIZE}});
			})

			DWREngine.setAsync(true);
		}else{
			finished.checked = false;
			return;
		}
	});
	
}

function finishTaskEdit(){
    if(isFlwTask == true){
        Ext.MessageBox.confirm(
            '操作完成！','点击“是”可以发送到流程下一步操作！<br><br>点击“否”继续在本页编辑内容！',
            function(value){
                if ('yes' == value){
                    parent.IS_FINISHED_TASK = true;
                    parent.mainTabPanel.setActiveTab('common');
                }
            }
        );
    }
}

function flowToNext(){
    Ext.MessageBox.confirm(
        '操作完成！','点击“是”可以发送到流程下一步操作！<br><br>点击“否”继续在本页编辑内容！',
        function(value){
            if ('yes' == value){
                parent.IS_FINISHED_TASK = true;
                parent.mainTabPanel.setActiveTab('common');
            }
        }
    );
}
//查看设备附件函数
	function equAdjustWin(uids,dhno,finished){	
		var editable = true;
		//var ModuleLVL = "1";	//模块的权限级别(1完全控制 > 2写、运行 > 3读 > 4禁止访问)
		if(finished == '0' && ModuleLVL < '3'){
			editable = false;
		}
		if(finished == '0' || ModuleLVL >= '3'){
			editable = false;
		}
		var fileUploadUrl = CONTEXT_PATH
				+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="+editable+"&businessId="
				+ uids;
		var ext
		try {
			ext = parent.Ext
		} catch (e) {
			ext = Ext
		}
		templateWin = new ext.Window({
					title : "设备入库单附件",
					width : 600,
					height : 400,
					minWidth : 300,
					minHeight : 200,
					layout : 'fit',
					plain : true,
					closeAction : 'hide',
					modal : true,
					html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
							+ "' frameborder=0 width=100% height=100%></iframe>"
				});
		templateWin.show();
	}