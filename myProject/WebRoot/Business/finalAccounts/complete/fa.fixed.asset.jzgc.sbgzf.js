/**
 * 竣工决算 - 固定资产 固定资产信息中，设备购置费 取值窗口
 * 
 * @author pengy 2013-09-02
 */

var sbListWin;

var beanOut = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "uids";

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

Ext.onReady(function() {

	DWREngine.setAsync(false);
	var typeArr = new Array();
	baseMgm.getData("select wareno,waretype from equ_warehouse where pid='"
					+ CURRENTAPPID + "' and parent='01' order by equid ",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					typeArr.push(temp);
				}
			});
	var unitArr = new Array();// 领用单位
	appMgm.getCodeValue("领用单位", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					unitArr.push(temp);
				}
			});
	var bdgArr = new Array();
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='"
					+ CURRENTAPPID + "' order by bdgid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1] + " - " + list[i][0]);
					bdgArr.push(temp);
				}
			})
	var equWareArr = new Array();
	baseMgm.getData("select uids,equid,equno,wareno from equ_warehouse where pid='"
					+ CURRENTAPPID + "' order by equid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					for (var j = 0; j < typeArr.length; j++) {
						if (list[i][3] == typeArr[j][1]) {
							temp.push(typeArr[j][0]);
						}
					}
					equWareArr.push(temp);

				}
			});
	var subjectArr = new Array();//财务科目
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='"
					+ CURRENTAPPID + "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
	var assetArr = new Array();//固定资产清单
	baseDao.getData("select t.treeid,t.fixedname from FACOMP_FIXED_ASSET_LIST t where PID='"
					+ CURRENTAPPID + "'", function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            assetArr.push(temp);
        }
    });
	var equTypeArr = new Array();//设备类型
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
	var conArr = new Array();//合同数组
	baseMgm.getData("select conid,conno,conname from con_ove where pid='"
					+ CURRENTAPPID + "' order by conid", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					conArr.push(temp);
				}
			})
	DWREngine.setAsync(true);
	/** ======================================主体设备出库单begin================================= */
	var fcOut = {
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
			fieldLabel : '合同主键'
		},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树主键'
		},
		'finished' : {
			name : 'finished',
			fieldLabel : '完结'
		},
		'isInstallation' : {
			name : 'isInstallation',
			fieldLabel : '已安装'
		},
		'outNo' : {
			name : 'outNo',
			fieldLabel : '出库单号'
		},
		'outDate' : {
			name : 'outDate',
			fieldLabel : '出库日期'
		},
		'recipientsUnit' : {
			name : 'recipientsUnit',
			fieldLabel : '领用单位'
		},
		'grantDesc' : {
			name : 'grantDesc',
			fieldLabel : '发放描述'
		},
		'recipientsUser' : {
			name : 'recipientsUser',
			fieldLabel : '领用人'
		},
		'recipientsUnitManager' : {
			name : 'recipientsUnitManager',
			fieldLabel : '领用单位负责人'
		},
		'handPerson' : {
			name : 'handPerson',
			fieldLabel : '经手人'
		},
		'shipperNo' : {
			name : 'shipperNo',
			fieldLabel : '出门证编号'
		},
		'proUse' : {
			name : 'proUse',
			fieldLabel : '工程部位（工程项目或用途）'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注'
		},
		'equid' : {
			name : 'equid',
			fieldLabel : '仓库号'
		},
		'fileid' : {
			name : 'fileid',
			fieldLabel : '出库单'
		},
		'using' : {
			name : 'using',
			fieldLabel : '领料用途'
		},
		'equname' : {
			name : 'equname',
			fieldLabel : '设备名称'
		},
		'outBackNo' : {
			name : 'outBackNo',
			fieldLabel : '冲回出库单据号'
		},
		'outEstimateNo' : {
			name : 'outEstimateNo',
			fieldLabel : '暂估出库单据号'
		},
		'type' : {
			name : 'type',
			fieldLabel : '出库类型'
		},
		'dataType' : {
			name : 'dataType',
			fieldLabel : '数据类型'
		},
		'kksNo' : {
			name : 'kksNo',
			fieldLabel : 'KKS编码'
		},
		'usingPart' : {
			name : 'usingPart',
			fieldLabel : '安装部位'
		},
		'financialSubjects' : {
			name : 'financialSubjects',
			fieldLabel : '对应财务科目'
		},
		'fixedAssetList' : {
			name : 'fixedAssetList',
			fieldLabel : '所属固定资产'
		}
	}

	smOut = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	smOut.on('rowselect', function() {
				var record = smOut.getSelected();
				if (record == null || record == "")
					return;
				dsOutSubFormal.baseParams.params = "outId = '"
						+ record.get('uids') + "'";
				dsOutSubFormal.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});

	var cmOut = new Ext.grid.ColumnModel([smOut, {
				id : 'uids',
				header : fcOut['uids'].fieldLabel,
				dataIndex : fcOut['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcOut['pid'].fieldLabel,
				dataIndex : fcOut['pid'].name,
				hidden : true
			}, {
				id : 'conid',
				header : fcOut['conid'].fieldLabel,
				dataIndex : fcOut['conid'].name,
				hidden : true
			}, {
				id : 'treeuids',
				header : fcOut['treeuids'].fieldLabel,
				dataIndex : fcOut['treeuids'].name,
				hidden : true
			}, {
				id : 'finished',
				header : fcOut['finished'].fieldLabel,
				dataIndex : fcOut['finished'].name,
				hidden : true
			}, {
				id : 'conname',
				header : '合同名称',
				dataIndex : 'conname',
				align : 'center',
				renderer : function(v, m, r) {
					for (var i = 0; i < conArr.length; i++) {
						if (r.get('conid') == conArr[i][0])
							return conArr[i][2];
					}
				},
				width : 150
			}, {
				id : 'conno',
				header : '合同编号',
				dataIndex : 'conno',
				align : 'center',
				renderer : function(v, m, r) {
					for (var i = 0; i < conArr.length; i++) {
						if (r.get('conid') == conArr[i][0])
							return conArr[i][1];
					}
				},
				width : 150
			}, {
				id : 'isInstallation',
				header : fcOut['isInstallation'].fieldLabel,
				dataIndex : fcOut['isInstallation'].name,
				hidden : true
			}, {
				id : 'outNo',
				header : fcOut['outNo'].fieldLabel,
				dataIndex : fcOut['outNo'].name,
				width : 180
			}, {
				id : 'outBackNo',
				header : fcOut['outBackNo'].fieldLabel,
				dataIndex : fcOut['outBackNo'].name,
				hidden : true,
				width : 180
			}, {
				id : 'outEstimateNo',
				header : fcOut['outEstimateNo'].fieldLabel,
				dataIndex : fcOut['outEstimateNo'].name,
				hidden : true,
				width : 180
			}, {
				id : 'outDate',
				header : fcOut['outDate'].fieldLabel,
				dataIndex : fcOut['outDate'].name,
				renderer : formatDate,
				align : 'center',
				width : 80
			}, {
				id : 'recipientsUnit',
				header : fcOut['recipientsUnit'].fieldLabel,
				dataIndex : fcOut['recipientsUnit'].name,
				align : 'center',
				renderer : function(v) {
					var unit = "";
					for (var i = 0; i < unitArr.length; i++) {
						if (v == unitArr[i][0])
							unit = unitArr[i][1];
					}
					return unit;
				},
				width : 180
			}, {
				id : 'equname',
				header : fcOut['equname'].fieldLabel,
				dataIndex : fcOut['equname'].name,
				hidden : true,
				width : 180
			}, {
				id : 'using',
				header : fcOut['using'].fieldLabel,
				dataIndex : fcOut['using'].name,
				renderer : function(v) {
					var using = "";
					for (var i = 0; i < bdgArr.length; i++) {
						if (v == bdgArr[i][0])
							using = bdgArr[i][1];
					}
					return using;
				},
				align : 'center',
				width : 220
			}, {
				id : 'equid',
				header : fcOut['equid'].fieldLabel,
				dataIndex : fcOut['equid'].name,
				renderer : function(v) {
					var equid = "";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][1])
							equid = equWareArr[i][2] + " - " + equWareArr[i][1];
					}
					return equid;
				},
				align : 'center',
				width : 180
			}, {
				id : 'financialSubjects',
				header : fcOut['financialSubjects'].fieldLabel,
				dataIndex : fcOut['financialSubjects'].name,
				align : 'center',
				width : 180,
				renderer : function(v) {
					for (var i = 0; i < subjectArr.length; i++) {
						if (subjectArr[i][0] == v) {
							return subjectArr[i][1];
						}
					}
					return v;
				}
			}, {
				id : 'fixedAssetList',
				header : fcOut['fixedAssetList'].fieldLabel,
				dataIndex : fcOut['fixedAssetList'].name,
				align : 'center',
				width : 100,
				renderer : function(v) {
					for (var i = 0; i < assetArr.length; i++) {
						if (assetArr[i][0] == v) {
							return assetArr[i][1];
						}
					}
					return v;
				}
			}, {
				id : 'fileid',
				header : fcOut['fileid'].fieldLabel,
				dataIndex : fcOut['fileid'].name,
				renderer : function(v, m, r) {
					if (v != '') {
						return "<center><a href='" + BASE_PATH
								+ "servlet/MainServlet?ac=downloadfile&fileid=" + v + "'><img src='"
								+ BASE_PATH + "jsp/res/images/word.gif'></img></a></center>"
					} else {
						return "<img src='" + BASE_PATH + "jsp/res/images/word_bw.gif'></img>";
					}
				},
				align : 'center',
				width : 90
			}, {
				id : 'fileid',
				header : '附件',
				dataIndex : fcOut['fileid'].name,
				renderer : function(v, m, r) {
					if (v == null || v == "")
						return "查看[0]";
					else
						return "<a href='javascript:viewTemplate(\"" + v + "\")' title='查看'>查看</a>";
				},
				align : 'center',
				width : 100
			}, {
				id : 'grantDesc',
				header : fcOut['grantDesc'].fieldLabel,
				dataIndex : fcOut['grantDesc'].name,
				hidden : true,
				width : 180
			}, {
				id : 'recipientsUser',
				header : fcOut['recipientsUser'].fieldLabel,
				dataIndex : fcOut['recipientsUser'].name,
				hidden : true,
				width : 160
			}, {
				id : 'recipientsUnitManager',
				header : fcOut['recipientsUnitManager'].fieldLabel,
				dataIndex : fcOut['recipientsUnitManager'].name,
				hidden : true,
				width : 160
			}, {
				id : 'type',
				header : fcOut['type'].fieldLabel,
				dataIndex : fcOut['type'].name,
				hidden : true,
				width : 80
			}, {
				id : 'handPerson',
				header : fcOut['handPerson'].fieldLabel,
				dataIndex : fcOut['handPerson'].name,
				hidden : true,
				width : 160
			}, {
				id : 'shipperNo',
				header : fcOut['shipperNo'].fieldLabel,
				dataIndex : fcOut['shipperNo'].name,
				hidden : true,
				width : 160
			}, {
				id : 'proUse',
				header : fcOut['proUse'].fieldLabel,
				dataIndex : fcOut['proUse'].name,
				hidden : true,
				width : 160
			}, {
				id : 'remark',
				header : fcOut['remark'].fieldLabel,
				dataIndex : fcOut['remark'].name,
				hidden : true,
				width : 180
			}, {
				id : 'dataType',
				header : fcOut['dataType'].fieldLabel,
				dataIndex : fcOut['dataType'].name,
				hidden : true,
				width : 180
			}]);
	cmOut.defaultSortable = true;

	var ColumnsOut = [{
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
				name : 'isInstallation',
				type : 'float'
			}, {
				name : 'outNo',
				type : 'string'
			}, {
				name : 'outEstimateNo',
				type : 'string'
			}, {
				name : 'outBackNo',
				type : 'string'
			}, {
				name : 'outDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'recipientsUnit',
				type : 'string'
			}, {
				name : 'grantDesc',
				type : 'string'
			}, {
				name : 'recipientsUser',
				type : 'string'
			}, {
				name : 'recipientsUnitManager',
				type : 'string'
			}, {
				name : 'handPerson',
				type : 'string'
			}, {
				name : 'type',
				type : 'string'
			}, {
				name : 'shipperNo',
				type : 'string'
			}, {
				name : 'proUse',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'fileid',
				type : 'string'
			}, {
				name : 'using',
				type : 'string'
			}, {
				name : 'dataType',
				type : 'string'
			}, {
				name : 'equname',
				type : 'string'
			}, {
				name : 'kksNo',
				type : 'string'
			}, {
				name : 'usingPart',
				type : 'string'
			}, {
				name : 'financialSubjects',
				type : 'string'
			}, {
				name : 'fixedAssetList',
				type : 'string'
			}];

	dsOutFormal = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanOut,
					business : businessOut,
					method : listMethodOut,
					params : "1=2"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeyOut
						}, ColumnsOut),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsOutFormal.setDefaultSort(orderColumnOut, 'asc');
	dsOutFormal.on('load', function() {
				if (dsOutFormal.getCount() > 0) {
					smOut.selectFirstRow();
				}
			})

	var gridPanelOut = new Ext.grid.GridPanel({
				ds : dsOutFormal,
				cm : cmOut,
				sm : smOut,
				title : '出库单信息',
				tbar : ['<font color=#15428b><B>出库单信息<B></font>'],
				header : false,
				border : false,
				height : document.body.clientHeight * 0.6,
				enableHdMenu : false,
				region : 'center',
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : dsOutFormal,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	/** ==============================出库单基础信息end=============================================== */
	/** ==============================出库单明细信息begin============================================= */
	var fcOutSub = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'stockId' : {
			name : 'stockId',
			fieldLabel : '设备库存主键'
		},
		'outId' : {
			name : 'outId',
			fieldLabel : '出库单主键'
		},
		'outNo' : {
			name : 'outNo',
			fieldLabel : '出库单号'
		},
		'boxNo' : {
			name : 'boxNo',
			fieldLabel : '物资编码'
		},
		'equType' : {
			name : 'equType',
			fieldLabel : '物资类型'
		},
		'equPartName' : {
			name : 'equPartName',
			fieldLabel : '物资名称'
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
		'outNum' : {
			name : 'outNum',
			fieldLabel : '出库数量',
			decimalPrecision : 4
		},
		'storage' : {
			name : 'storage',
			fieldLabel : '存放库位'
		},
		'price' : {
			name : 'price',
			fieldLabel : '入库单价',
			allowBlank : false
		},
		'amount' : {
			name : 'amount',
			fieldLabel : '出库金额',
			allowBlank : false
		},
		'kcMoney' : {
			name : 'kcMoney',
			fieldLabel : '库存金额',
			decimalPrecision : 4
		},
		'useParts' : {
			name : 'useParts',
			fieldLabel : '安装部位'
		},
		'kksNo' : {
			name : 'kksNo',
			fieldLabel : 'KKS编码'
		}
	};

	var smOutSub = new Ext.grid.CheckboxSelectionModel();

	var cmOutSub = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({
						header : '序号',
						width : 35
					}), {
				id : 'uids',
				header : fcOutSub['uids'].fieldLabel,
				dataIndex : fcOutSub['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcOutSub['pid'].fieldLabel,
				dataIndex : fcOutSub['pid'].name,
				hidden : true
			}, {
				id : 'stockId',
				header : fcOutSub['stockId'].fieldLabel,
				dataIndex : fcOutSub['stockId'].name,
				hidden : true
			}, {
				id : 'outId',
				header : fcOutSub['outId'].fieldLabel,
				dataIndex : fcOutSub['outId'].name,
				hidden : true
			}, {
				id : 'outNo',
				header : fcOutSub['outNo'].fieldLabel,
				dataIndex : fcOutSub['outNo'].name,
				hidden : true
			}, {
				id : 'boxNo',
				header : fcOutSub['boxNo'].fieldLabel,
				dataIndex : fcOutSub['boxNo'].name,
				align : 'center',
				width : 120
			}, {
				id : 'equType',
				header : fcOutSub['equType'].fieldLabel,
				dataIndex : fcOutSub['equType'].name,
				renderer : function(v, m, r) {
					var equ = "";
					for (var i = 0; i < equTypeArr.length; i++) {
						if (v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				},
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'equPartName',
				header : fcOutSub['equPartName'].fieldLabel,
				dataIndex : fcOutSub['equPartName'].name,
				align : 'center',
				width : 180
			}, {
				id : 'ggxh',
				header : fcOutSub['ggxh'].fieldLabel,
				dataIndex : fcOutSub['ggxh'].name,
				align : 'center',
				width : 100
			}, {
				id : 'graphNo',
				header : fcOutSub['graphNo'].fieldLabel,
				dataIndex : fcOutSub['graphNo'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'unit',
				header : fcOutSub['unit'].fieldLabel,
				dataIndex : fcOutSub['unit'].name,
				align : 'center',
				width : 80
			}, {
				id : 'outNum',
				header : fcOutSub['outNum'].fieldLabel,
				dataIndex : fcOutSub['outNum'].name,
				align : 'right',
				width : 80
			}, {
				id : 'price',
				header : fcOutSub['price'].fieldLabel,
				dataIndex : fcOutSub['price'].name,
				align : 'right',
				width : 80
			}, {
				id : 'amount',
				header : fcOutSub['amount'].fieldLabel,
				dataIndex : fcOutSub['amount'].name,
				align : 'right',
				width : 80
			}, {
				id : 'kcMoney',
				header : fcOutSub['kcMoney'].fieldLabel,
				dataIndex : fcOutSub['kcMoney'].name,
				align : 'right',
				width : 80,
				hidden : true
			}, {
				id : 'storage',
				header : fcOutSub['storage'].fieldLabel,
				dataIndex : fcOutSub['storage'].name,
				renderer : function(v, m, r) {
					var storage = "";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][0])
							storage = equWareArr[i][3] + "-" + equWareArr[i][2];
					}
					return storage;
				},
				align : 'center',
				hidden : true,
				width : 80
			}, {
				id : 'useParts',
				header : fcOutSub['useParts'].fieldLabel,
				dataIndex : fcOutSub['useParts'].name,
				align : 'center',
				width : 80
			}, {
				id : 'kksNo',
				header : fcOutSub['kksNo'].fieldLabel,
				dataIndex : fcOutSub['kksNo'].name,
				align : 'center',
				width : 80
			}]);
	cmOutSub.defaultSortable = true;

	var ColumnsOutSub = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'stockId',
				type : 'string'
			}, {
				name : 'outId',
				type : 'string'
			}, {
				name : 'outNo',
				type : 'string'
			}, {
				name : 'boxNo',
				type : 'string'
			}, {
				name : 'equType',
				type : 'string'
			}, {
				name : 'equPartName',
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
				name : 'outNum',
				type : 'float'
			}, {
				name : 'price',
				type : 'float'
			}, {
				name : 'amount',
				type : 'float'
			}, {
				name : 'storage',
				type : 'string'
			}, {
				name : 'kcMoney',
				type : 'float'
			}, {
				name : 'useParts',
				type : 'string'
			}, {
				name : 'kksNo',
				type : 'string'
			}];

	dsOutSubFormal = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanOutSub,
					business : businessOutSub,
					method : listMethodOutSub,
					params : '1=2'
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeyOutSub
						}, ColumnsOutSub),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsOutSubFormal.setDefaultSort(orderColumnOutSub, 'desc'); // 设置默认排序列

	var gridPanelOutSub = new Ext.grid.GridPanel({
				ds : dsOutSubFormal,
				cm : cmOutSub,
				sm : smOutSub,
				title : "出库单详细信息",
				border : false,
				region : 'south',
				header : false,
				height : document.body.clientHeight * 0.4,
				enableHdMenu : false,
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({
							pageSize : PAGE_SIZE,
							store : dsOutSubFormal,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						})
			});

	/** ===============================出库单明细信息end===================================== */

	// 主体设备出库单窗口
	sbListWin = new Ext.Window({
				width : document.body.clientWidth * .96,
				height : document.body.clientHeight * .96,
				border : false,
				modal : true,
				layout : 'border',
				closeAction : 'hide',
				title : '设备购置费',
				items : [gridPanelOut, gridPanelOutSub],
				listeners : {
					'show' : function() {
						var treeid = sm.getSelected().get('treeid');
						dsOutFormal.baseParams.params = "dataType='EQUBODY' and pid='"
								+ CURRENTAPPID + "' and auditState= '1' and fixedAssetList = '" + treeid + "'";
						dsOutFormal.load({
									start : 0,
									limit : PAGE_SIZE
								})
						dsOutSubFormal.removeAll();
					}
				}
			});

	function formatDate(value){
		return value ? value.dateFormat('Y-m-d') : '';
	};

})

//文档上传
function viewTemplate(fileid){
    window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid)
}