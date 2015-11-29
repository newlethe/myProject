// 设备暂估入库主页
var beanIntoEs = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimate";
var businessEs = "baseMgm";
var listMethodEs = "findWhereOrderby";
var primaryKeyEs = "uids";
var orderColumnEs = "uids";

var beanSubIntoEs = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimateSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var selectParentid = '';
var selectWinEs;
var pid = CURRENTAPPID;
var dsIntoEs;
var dsSubInto;
var saveBtnEs;
var intosContentPanel1;

var equWareArrEs = new Array();
var equTypeArrEs = new Array();
var partBsEs = new Array();
var businessTypeEs = "zlMaterial";

var fcIntoEs;
var fcIntoEsSub
var gridPanelIntoEs;
var gridPanelIntoEsSub;
var cmArrayIntoEs = [['selectAll','全部']];
var cmHideIntoEs = new Array();
var store1IntoEs;
var chooseRowIntoEs;

var cmArrayIntoEsSub = [['selectAll','全部']];
var cmHideIntoEsSub = new Array();
var store1IntoEsSub;
var chooseRowIntoEsSub;
var printEsBtn;

var treeIds = ""
//判断当前用户是否是财务部
//var isFinance = (USERDEPTID == '102010105') ? true : false;

Ext.onReady(function() {

		//处理设备仓库下拉框
	    DWREngine.setAsync(false);
	    var typeArr = new Array();
	    baseMgm.getData("select wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
	                    + "' and parent='01' order by equid ", function(list){
	              for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            typeArr.push(temp);
	        }
	    }); 
	    baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
	                    + "' order by equid ", function(list) {
	        for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            temp.push(list[i][2]);
	            for(var j=0;j<typeArr.length;j++){
	                if(list[i][3] == typeArr[j][1]){
	                    temp.push(typeArr[j][0]);
	                }
	            }
	//            if(list[i][3]=="SBCK")
	//                temp.push("设备仓库");
	//            else if(list[i][3]=="CLCK")
	//                temp.push("材料仓库")
	//            else if(list[i][3]=="JGCK")
	//                temp.push("建管仓库")
		          equWareArrEs.push(temp);
	           
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
					equTypeArrEs.push(temp);
				}
			});

    // 获取乙方单位
    conpartybMgm.getPartyB(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);
			temp.push(list[i].partyb);
			partBsEs.push(temp);
		}
	});
    
    //合同分类二（财务）
    var conno2cw = new Array();
    appMgm.getCodeValue("合同财务划分类型", function(list) {
        for (i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode);
            temp.push(list[i].propertyName);
            conno2cw.push(temp);
        }
    });
     var  equBodysArr = new Array();
     baseMgm.getData("select uids,equ_name from  equ_goods_bodys where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"'", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            equBodysArr.push(temp);
          }
    });  
    //点击树节点时查询树子节点
    var  treeSql = "select a.uids from (select t.* from equ_con_ove_tree_view t" +
    		" where t.conid = '"+edit_conid+"') a start with a.treeid =" +
    		" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+edit_treeUids+"'  " +
    		" and a.conid = '"+edit_conid+"') connect by PRIOR a.treeid = a.parentid"
    baseMgm.getData(treeSql,function(str){
        if(str.length ==1){
          treeIds = " and treeuids='"+str+"'"
        }else if(str.length>1){
              treeIds = " and treeuids in ("
             for(var i=0;i<str.length;i++){
                if(i==0){
                   treeIds +="'"+str[i]+"'";
                }else{
                   treeIds +=",'"+str[i]+"'";
                }
             }
             treeIds += ")"
        }
    });
	DWREngine.setAsync(true);

	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArrEs
			});
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	// 处理设备仓库下拉框

	var fm = Ext.form; // 包名简写（缩写）
	fcIntoEs = {
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
		'treeUids' : {
			name : 'treeUids',
			fieldLabel : '合同分类树'
		},
		'finished' : {
			name : 'finished',
			fieldLabel : '完结'
		},
		'warehouseNo' : {
			name : 'warehouseNo',
			fieldLabel : '暂估入库单据号'
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
        'invoiceno' : {
            name : 'invoiceno',
            fieldLabel : '发票号'
        },
        'equid' : {
            name : 'equid',
            fieldLabel : '仓库号'
        },
        'fileid' : {
            name : 'fileid',
            fieldLabel : '附件'
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
		},
		'warehouseInType' : {
		    name : 'warehouseInType',
		    fieldLabel : '入库类型'
		},
		'dataType' : {
		    name : 'dataType',
		    fieldLabel : '数据类型'
		}
	}

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([
			// sm,
			{
		id : 'uids',
		header : fcIntoEs['uids'].fieldLabel,
		dataIndex : fcIntoEs['uids'].name,
		hidden : true
	}, {
		id : 'pid',
		header : fcIntoEs['pid'].fieldLabel,
		dataIndex : fcIntoEs['pid'].name,
		hidden : true
	}, {
		id : 'conid',
		header : fcIntoEs['conid'].fieldLabel,
		dataIndex : fcIntoEs['conid'].name,
		hidden : true
	}, {
		id : 'treeUids',
		header : fcIntoEs['treeUids'].fieldLabel,
		dataIndex : fcIntoEs['treeUids'].name,
		hidden : true
	}, {
		id : 'openBoxId',
		header : fcIntoEs['openBoxId'].fieldLabel,
		dataIndex : fcIntoEs['openBoxId'].name,
		width : 0,
		hidden : true
	}, {
		id : 'finished',
		header : fcIntoEs['finished'].fieldLabel,
		dataIndex : fcIntoEs['finished'].name,
		renderer : function(v, m, r) {
			var o = r.get('finished');
			var abnormalOrNo = r.get('abnormalOrNo');
			var str = "<input type='checkbox' "
					+ (o == 0 ? "disabled title='已完结，不能取消完结' " : "") + " "
					+ (v == 0 ? "checked title='已完结' " : "title='未完结'")
					+ " onclick='finishOpenboxIntoEs(\"" + r.get("uids") + "\",\""
					+ abnormalOrNo + "\",this)'>"
			return str;
		},
		width : 40
	}, {
		id : 'warehouseInType',
		header : fcIntoEs['warehouseInType'].fieldLabel,
		dataIndex : fcIntoEs['warehouseInType'].name,
		hidden : true			
	}, {
		id : 'warehouseNo',
		header : fcIntoEs['warehouseNo'].fieldLabel,
		dataIndex : fcIntoEs['warehouseNo'].name,
		align : 'center',
		width : 250
	}, {
		id : 'warehouseDate',
		header : fcIntoEs['warehouseDate'].fieldLabel,
		dataIndex : fcIntoEs['warehouseDate'].name,
		align : 'center',
		renderer : formatDateTime,
		width : 100
	}, {
		id : 'noticeNo',
		header : fcIntoEs['noticeNo'].fieldLabel,
		dataIndex : fcIntoEs['noticeNo'].name,
		align : 'center',
		hidden : true,
		width : 250
	}, {
		id : 'supplyunit',
		header : fcIntoEs['supplyunit'].fieldLabel,
		dataIndex : fcIntoEs['supplyunit'].name,
		align : 'center',
        renderer : function(v){
			var str = '';
			for (var i = 0; i < partBsEs.length; i++) {
				if (partBsEs[i][0] == v) {
				    str = partBsEs[i][1]
				    break;
				}
			}
			return str;
        },
		width : 250
	}, {
		id : 'invoiceno',
		header : fcIntoEs['invoiceno'].fieldLabel,
		dataIndex : fcIntoEs['invoiceno'].name,
		align : 'center',
		width : 120
	}, {
		id : 'equid',
		header : fcIntoEs['equid'].fieldLabel,
		dataIndex : fcIntoEs['equid'].name,
        renderer : function(v){
            var equid = "";
            for (var i = 0; i < equWareArrEs.length; i++) {
                if (v == equWareArrEs[i][1])
                    equid = equWareArrEs[i][3]+" - "+equWareArrEs[i][2];
            }
            return equid;
        },
		align : 'center',
		width : 200
    },{
        id : 'fileid',
        header : fcIntoEs['fileid'].fieldLabel,
        dataIndex : fcIntoEs['fileid'].name,
        renderer : filelistFn,
        align : 'center',
        hidden :  true,
        width : 100
	}, {
		id : 'warehouseMan',
		header : fcIntoEs['warehouseMan'].fieldLabel,
		dataIndex : fcIntoEs['warehouseMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'makeMan',
		header : fcIntoEs['makeMan'].fieldLabel,
		dataIndex : fcIntoEs['makeMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'remark',
		header : fcIntoEs['remark'].fieldLabel,
		dataIndex : fcIntoEs['remark'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'abnormalOrNo',
		header : fcIntoEs['abnormalOrNo'].fieldLabel,
		dataIndex : fcIntoEs['abnormalOrNo'].name,
		align : 'right',
		width : 0,
		hidden : true
	}, {
		id : 'dataType',
		header : fcIntoEs['dataType'].fieldLabel,
		dataIndex : fcIntoEs['dataType'].name,
		align : 'center',
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
				name : 'treeUids',
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
			}, {
				name : 'supplyunit',
				type : 'string'
			}, {
				name : 'invoiceno',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'fileid',
				type : 'string'
			}, {
			    name:'warehouseInType',
			    type:'string'
		    }, {
			    name:'dataType',
			    type:'string'
		    }
	];
	dsIntoEs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanIntoEs,
					business : businessEs,
					method : listMethodEs,
					params: "dataType='"+DATA_TYPE+"' and conid='"+edit_conid+"'"+treeIds
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeyEs
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsIntoEs.setDefaultSort(orderColumnEs, 'asc');
	cm.defaultSortable = true;

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
            
    printEsBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    var inputBtn = new Ext.Button({
        text : '冲回入库',
        iconCls : 'btn',
        handler : doInputFn
    });
    function doPrint(){
        var fileid = "";
        var uids = ""
        var modetype = "SB";
        var record = sm.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "EquStoreinEsView";
        var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
        DWREngine.setAsync(false);
        baseMgm.getData(sql,function(str){
            fileid = str;
        });
        DWREngine.setAsync(true);
        if(fileid == null || fileid == ""){
            Ext.MessageBox.alert("文档打印错误","文档打印模板不存在，请先在系统管理中添加！");
            return;
        }else{
            var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid="+fileid;
            docUrl += "&filetype="+filePrintType
            docUrl += "&uids="+uids
            docUrl += "&modetype="+modetype
//            window.open(docUrl)
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }
    }
   
   store1IntoEs = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArrayIntoEs
	}); 
   chooseRowIntoEs = new Ext.form.MultiSelect({
         id:   'chooserow',
         width:  150,
         store : store1IntoEs,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelIntoEs.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowIntoEs.setValue(cmHideIntoEs);
		            cmSelectByIdEs(colModel,cmHideIntoEs);
		        }else{
		            this.selectAll();
		            cmSelectByIdEs(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowIntoEs.setValue(this.getCheckedValue());
                cmSelectByIdEs(colModel,this.getCheckedValue());
		    }
		}
  });
 
  function cmSelectByIdEs(colModel,str){
    	var cmHideIntoBack = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol; i<colModel.getColumnCount();i++){
            for(var j=0;j<cmHideIntoBack.length;j++){
                if(colModel.getDataIndex(i) == cmHideIntoBack[j]){
                    colModel.setHidden(i,false);
                    break;
                }else{
                    colModel.setHidden(i,true);
                }
            }
        }
	}   
	    
   gridPanelIntoEs = new Ext.grid.GridPanel({
				ds : dsIntoEs,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : ['<font color=#15428b><B>暂估入库单信息<B></font>', '-', addBtn,
						'-', editBtn, '-', delBtn, '-', printEsBtn,'->',chooseRowIntoEs],//,'-',inputBtn
				enableHdMenu : false,
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
					store : dsIntoEs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	// TODO : ======入库通知单明细======
	fcIntoEsSub = {
			'uids' : {name : 'uids',fieldLabel : '主键'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'sbrkUids' : {name : 'sbrkUids' ,fieldLabel : '设备入库主表主键'},
			'boxSubId' : {name : 'boxSubId',fieldLabel : '设备开箱明细表主键'},
			'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
			'warehouseType' : {
				name : 'warehouseType',
				fieldLabel : '设备类型'
				},
			'warehouseName' : {name : 'warehouseName',fieldLabel : '设备名称',allowBlank : false},
			'ggxh' : {name : 'ggxh',fieldLabel : '规格型号',allowBlank : false},
			'unit' : {name : 'unit',fieldLabel : '单位'},
			'inWarehouseNo' : {name : 'inWarehouseNo',fieldLabel : '数量',decimalPrecision : 4},
			'unitPrice' : {name : 'unitPrice',fieldLabel : '单价', allowBlank : true,decimalPrecision:6},
			'amountMoney' : {name : 'amountMoney',fieldLabel : '金额', allowBlank : true,decimalPrecision:2},
			'freightMoney' : {name : 'freightMoney',fieldLabel : '运费', allowBlank : true,decimalPrecision:2},
			'insuranceMoney' : {name : 'insuranceMoney',fieldLabel : '保险', allowBlank : true,decimalPrecision:2},
			'antherMoney' : {name : 'antherMoney',fieldLabel : '其他', allowBlank : true,decimalPrecision:2},
			'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价', allowBlank : true,decimalPrecision:2},
			'totalMoney' : {name : 'totalMoney',fieldLabel : '入库金额', allowBlank : true,decimalPrecision:2},
			'amountTax' : {name : 'amountTax',fieldLabel : '金额税金', allowBlank : true,decimalPrecision:2},
			'freightTax' : {name : 'freightTax',fieldLabel : '运费税金', allowBlank : true,decimalPrecision:2},
			'insuranceTax' : {name : 'insuranceTax',fieldLabel : '保险税金', allowBlank : true,decimalPrecision:2},
			'antherTax' : {name : 'antherTax',fieldLabel : '其他税金', allowBlank : true,decimalPrecision:2},
			'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
			'warehouseNum' : {name : 'warehouseNum',fieldLabel : '检验数量',decimalPrecision:4},
			'weight' : {name : 'weight', fieldLabel : '重量'},
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
                         
	        'stockno' : {name : 'stockno', fieldLabel : '存货编码', allowBlank : true},
	        'taxes' : {name : 'taxes', fieldLabel : '税金', allowBlank : true,decimalPrecision:2},
	        'totalnum' : {name : 'totalnum', fieldLabel : '合计', allowBlank : true,decimalPrecision:2},
			'memo' : {name : 'memo',fieldLabel : '备注',xtype: 'htmleditor',anchor:'95%',height: 80,width: 800}
		};

	var equnoComboBox = new fm.ComboBox(fcIntoEsSub['equno']);

	equnoComboBox.on('beforequery', function() {
				newtreePanel.on('beforeload', function(node) {
							var parent = node.attributes.equid;
							if (parent == null || parent == "")
								parent = '01';
							var baseParams = newtreePanel.loader.baseParams
							baseParams.orgid = '0';
							baseParams.parent = parent;
						})
				newtreePanel.render('tree');
				newroot.reload();

			})

	newtreePanel.on('click', function(node, e) {
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
				header : fcIntoEsSub['uids'].fieldLabel,
				dataIndex : fcIntoEsSub['uids'].name,
				hidden : true
			},{
				id : 'pid',
				header : fcIntoEsSub['pid'].fieldLabel,
				dataIndex : fcIntoEsSub['pid'].name,
				hidden : true
			},{
			    id : 'sbrkUids',
				header : fcIntoEsSub['sbrkUids'].fieldLabel,
				dataIndex : fcIntoEsSub['sbrkUids'].name,
				hidden : true//boxSubId
			},{
			    id : 'boxSubId',
				header : fcIntoEsSub['boxSubId'].fieldLabel,
				dataIndex : fcIntoEsSub['boxSubId'].name,
				hidden : true		
			},{
			    id : 'boxNo',
			    header : fcIntoEsSub['boxNo'].fieldLabel,
			    dataIndex : fcIntoEsSub['boxNo'].name,
			    align : 'right',
                hidden : true
			},{
				id : 'warehouseType',
				header : fcIntoEsSub['warehouseType'].fieldLabel,
				dataIndex : fcIntoEsSub['warehouseType'].name,
			    align : 'center',
				renderer : function(v){
					var equ = "";
					for(var i=0;i<equTypeArr.length;i++){
						if(v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				}
//                hidden : true
            },{
				id : 'warehouseName',
				header : fcIntoEsSub['warehouseName'].fieldLabel,
				dataIndex : fcIntoEsSub['warehouseName'].name,
			    align : 'center',
			    width : 200
			},{
				id : 'ggxh',
				header : fcIntoEsSub['ggxh'].fieldLabel,
				dataIndex : fcIntoEsSub['ggxh'].name,
				align : 'center',
				width : 100
			},{
				id : 'unit',
				header : fcIntoEsSub['unit'].fieldLabel,
				dataIndex : fcIntoEsSub['unit'].name,
			    align : 'center',
				width : 100
			},{
				id : 'inWarehouseNo',
				header : fcIntoEsSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcIntoEsSub['inWarehouseNo'].name,
				align : 'right',
				width : 80
			},{
				id : 'unitPrice',
				header : fcIntoEsSub['unitPrice'].fieldLabel,
				dataIndex : fcIntoEsSub['unitPrice'].name,
				align : 'right',
				hidden : false,
				renderer : function(v){
					if(isNaN(v) ==  true){
						return v.toFixed(6);
					}else{
					  return parseFloat(v,10).toFixed(6);
					}
				},
				width : 80
			},{
				id : 'amountMoney',
				header : fcIntoEsSub['amountMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['amountMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'freightMoney',
				header : fcIntoEsSub['freightMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['freightMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'insuranceMoney',
				header : fcIntoEsSub['insuranceMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['insuranceMoney'].name,
				align : 'right', 
				hidden : false,
				width : 80
			},{
				id : 'antherMoney',
				header : fcIntoEsSub['antherMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['antherMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'intoMoney',
				header : fcIntoEsSub['intoMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['intoMoney'].name,
				align : 'right',
				hidden : false,
				renderer : function(v){
					if(isNaN(v) ==  true){
						return v.toFixed(2);
					}else{
					  return parseFloat(v,10).toFixed(2);
					}
				},
				width : 80
			},{
				id : 'totalMoney',
				header : fcIntoEsSub['totalMoney'].fieldLabel,
				dataIndex : fcIntoEsSub['totalMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'amountTax',
				header : fcIntoEsSub['amountTax'].fieldLabel,
				dataIndex : fcIntoEsSub['amountTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'freightTax',
				header : fcIntoEsSub['freightTax'].fieldLabel,
				dataIndex : fcIntoEsSub['freightTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'insuranceTax',
				header : fcIntoEsSub['insuranceTax'].fieldLabel,
				dataIndex : fcIntoEsSub['insuranceTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'antherTax',
				header : fcIntoEsSub['antherTax'].fieldLabel,
				dataIndex : fcIntoEsSub['antherTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'graphNo',
				header : fcIntoEsSub['graphNo'].fieldLabel,
				dataIndex : fcIntoEsSub['graphNo'].name,
				align : 'center',
				width : 100,
                hidden : true
			},{
				id : 'warehouseNum',
				header : fcIntoEsSub['warehouseNum'].fieldLabel,
				dataIndex : fcIntoEsSub['warehouseNum'].name,
				align : 'right',
				width : 80,
                hidden : true
			},{
			    id : 'weight',
			    header : fcIntoEsSub['weight'].fieldLabel,
				dataIndex : fcIntoEsSub['weight'].name,
				align : 'right',
				width : 80,
                hidden : true
            },{
                id : 'totalnum',
                header : fcIntoEsSub['totalnum'].fieldLabel,
                dataIndex : fcIntoEsSub['totalnum'].name,
                align : 'right',
                hidden : true,
                width : 80
            },{
                id : 'taxes',
                header : fcIntoEsSub['taxes'].fieldLabel,
                dataIndex : fcIntoEsSub['taxes'].name,
                renderer : function(v,m,r){
                    return v;
                },
                align : 'right',
                hidden :  false,
                width : 80
			}, {
				id : 'equno',
				header : fcIntoEsSub['equno'].fieldLabel,
				dataIndex : fcIntoEsSub['equno'].name,
				renderer : function(v,m,r){
			            var equid = "";
			            for (var i = 0; i < equWareArrEs.length; i++) {
			                if (v == equWareArrEs[i][0])
			                    equid = equWareArrEs[i][3]+" - "+equWareArrEs[i][2];
			            }
			            return equid;
			        },
			    width : 160,    
			    align : 'center'
			},{
                id : 'stockno',
                header : fcIntoEsSub['stockno'].fieldLabel,
                dataIndex : fcIntoEsSub['stockno'].name,
                align : 'center',
                width : 200
			},{
				id : 'memo',
				header : fcIntoEsSub['memo'].fieldLabel,
				dataIndex : fcIntoEsSub['memo'].name,
			    align : 'center',
				width : 200,
                hidden : true
			}
		]);

	var ColumnsSub = [
			{name:'uids', type:'string'},
			{name:'pid', type:'string'},
			{name:'sbrkUids', type:'string'},
			{name:'boxSubId',type:'string'},
			{name:'boxNo', type: 'string'},
			{name:'warehouseType', type:'string'},
			{name:'warehouseName', type:'string'},
			{name:'ggxh', type:'string'},
			{name:'unit', type:'string'},
			{name:'inWarehouseNo', type:'float'},
			{name:'unitPrice', type:'string'},
			{name:'amountMoney', type:'float'},
			{name:'freightMoney', type:'float'},
			{name: 'insuranceMoney',type:'float'},
			{name:'antherMoney',type: 'float'},
			{name:'intoMoney', type:'float'},
			{name:'totalMoney', type:'float'},
			{name:'amountTax', type:'float'},
			{name:'freightTax', type:'float'},
			{name:'insuranceTax', type:'float'},
			{name:'antherTax', type:'float'},
			{name:'graphNo', type:'string'},
			{name:'warehouseNum', type:'float'},
			{name:'weight', type:'float'},
			{name:'intoMoney', type:'float'},
			{name:'totalMoney', type:'float'},
			{name:'equno', type:'string'},
			{name:'memo', type:'string'},
			{name:'stockno', type:'string'},
			{name:'taxes', type:'float'},
			{name:'totalnum', type:'float'}
		];
	
	dsSubInto = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSubIntoEs,
					business : businessSub,
					method : listMethodSub,
					params : ' 1=2 '
//					"sbrk_uids in (select uids from  EquGoodsStoreinEstimate where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"' and dataType='EQUBODY' )"
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
	dsSubInto.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列

	var PlantSub = Ext.data.Record.create(ColumnsSub);
	var PlantIntSub = {
				uids : '',
				pid : CURRENTAPPID,
				sbrkUids:  '',
				boxSubId:'',
				warehouseType : '',
				warehouseName : '',
				ggxh : '',
				unit : '',
				inWarehouseNo : 0,
				unitPrice : 0,
				amountMoney : 0,
				freightMoney : 0,
				insuranceMoney : 0,
				antherMoney  : 0,
				intoMoney : 0,
				totalMoney : 0,
				amountTax : 0,
				freightTax : 0,
				insuranceTax : 0,
				antherTax : 0,
				boxNo : '',
				boxName : '',
				warehouseNum : 0,
				weight : '',
				intoMoney : 0,
				totalMoney : 0,
				equno : '',
                stockno : '',
                taxes : 0,
                totalnum : 0,
				memo : ''
		}

	saveBtnEs = new Ext.Button({
				id : 'saveBtnEs',
				text : '保存',
				iconCls : 'save',
                hidden : true,
				handler : saveFun
			});
	cmSub.defaultSortable = true;
   
   store1IntoEsSub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArrayIntoEsSub
	}); 
   chooseRowIntoEsSub = new Ext.form.MultiSelect({
         id:   'chooserow1',
         width:  150,
         store : store1IntoEsSub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelIntoEsSub.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowIntoEsSub.setValue(cmHideIntoEsSub);
		            cmSelectByIdEsSub(colModel,cmHideIntoEsSub);
		        }else{
		            this.selectAll();
		            cmSelectByIdEsSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowIntoEsSub.setValue(this.getCheckedValue());
                cmSelectByIdEsSub(colModel,this.getCheckedValue());
		    }
		}
  });
 
  function cmSelectByIdEsSub(colModel,str){
    	var cmHideIntoEsSub = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<colModel.getColumnCount();i++){
            for(var j=0;j<cmHideIntoEsSub.length;j++){
                if(colModel.getDataIndex(i) == cmHideIntoEsSub[j]){
                    colModel.setHidden(i,false);
                    break;
                }else{
                    colModel.setHidden(i,true);
                }
            }
        }
	}   			
	
	gridPanelIntoEsSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSubInto,
		sm : smSub,
		cm : cmSub,
		tbar : ['<font color=#15428b><B>暂估入库单明细<B></font>', '-', saveBtnEs,'->',chooseRowIntoEsSub],
		header : false,
		height : document.body.clientHeight * 0.4,
		enableHdMenu : false,
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
			store : dsSubInto,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSubIntoEs,
		business : businessSub,
		primaryKey : primaryKeySub
	});
    gridPanelIntoEsSub.on("aftersave",function(){
        dsSubInto.load({params:{start:0,limit:PAGE_SIZE}});
    });

	intosContentPanel1 = new Ext.Panel({
		        id : 'intosContentPanel1',
				layout : 'border',
				region : 'center',
				title:'暂估入库',
				items : [gridPanelIntoEs, gridPanelIntoEsSub]
			});

//	dsIntoEs.load({
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});
//	dsSubInto.load({
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});	
			
			//权限控制
	if(ModuleLVL>=3){
		 addBtn.setDisabled(true);
		 editBtn.setDisabled(true);
		 delBtn.setDisabled(true);
	}	
	sm.on("rowselect", function() {
				var record = gridPanelIntoEs.getSelectionModel().getSelected();
				if (record == null || record == '') {
				} else {
						if(ModuleLVL>=3){
						 addBtn.setDisabled(true);
						 editBtn.setDisabled(true);
						 delBtn.setDisabled(true);
						
					 }else{
						 if (record.get("finished") == '0') {
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
							saveBtnEs.setDisabled(true);
							inputBtn.setDisabled(true);
	                        printEsBtn.setDisabled(false);
						} else {
							editBtn.setDisabled(false);
							delBtn.setDisabled(false);
							saveBtnEs.setDisabled(false);
							inputBtn.setDisabled(false);
	                        printEsBtn.setDisabled(false);
						}
					}
					
					dsSubInto.baseParams.params = "sbrk_uids='"
							                + record.get("uids") + "' and pid='"
							                + record.get("pid") + "'";
					dsSubInto.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				}
			})

	treePanel.on('click', function(node) {
			  var equUids="";	
		      DWREngine.setAsync(false);
		      var sql="select t.uids from EQU_GOODS_STOREIN_ESTIMATE t  where " +" treeuids in (" +
		      		  " select uuid from equ_type_tree start with treeid=(select treeid from equ_type_tree where " +
		      		  " uuid='"+selectUuid+"')" +" connect  by prior treeid=parentid) and conid='"+selectConid+"'";
		      baseMgm.getData(sql,function(list){
				        if(list.length>0){
				        	equUids +='(';
					        for (var i = 0; i < list.length; i++) {
					             if(list.length == 1){
					                equUids +="'"+list[i]+"'";
					                break;
					             }else{
						             if(i>=0 && i<list.length-1){
						                 equUids +="'"+list[i]+"',";
						             }else{
						                 equUids +="'"+list[i]+"'";
						             }
					             }
					        }
					        equUids +=")";
				        }
				    })
		      DWREngine.setAsync(true);
		      if(equUids==''){
		        equUids = "1=2"
		      }else{
		        equUids = "sbrk_uids in "+equUids;
		      }
			  dsSubInto.baseParams.params = equUids; 
			  dsSubInto.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});

			});
            

	// -------------------function-------------------

	function saveFun() {
        var records = dsSubInto.getModifiedRecords();
        for (var i = 0; i < records.length; i++) {
            var r = records[i]
            //合计
            var totalnum = r.data.totalnum;
            //入库总价 
            var totalMoney = r.data.totalMoney
            if(totalMoney == (totalnum/1.17).toFixed(2) || totalMoney == 0)
                totalMoney = (totalnum/1.17).toFixed(2);
            //税金
            var taxes = totalnum - totalMoney;
            //入库数量
            var inWarehouseNo = r.data.inWarehouseNo;
            //入库单价
            var intoMoney = r.data.intoMoney
            if(inWarehouseNo != 0){
	            if(intoMoney == (totalMoney/inWarehouseNo).toFixed(2) || intoMoney == 0)
	                intoMoney = (totalMoney/inWarehouseNo).toFixed(6);
            }
            r.set("totalMoney",totalMoney);
            r.set("taxes",taxes);
            r.set("intoMoney",intoMoney)
        }
		gridPanelIntoEsSub.defaultSaveHandler();
	}

	function addOrUpdateFun(btn) {
		var record = sm.getSelected();
		var url = BASE_PATH
//				+ "Business/equipment/equMgm/equ.into.warehousing.estimate.addorupdata.jsp";
		        + "Business/equipment/baseInfo/equ.bodys.into.warehousing.estimate.addorupdata.jsp";
		if (btn.id == 'addBtn') {
			url += "?conid=" + edit_conid + "&treeuids=" + edit_treeUids
					+ "&treeid=" + selectTreeid+"&partUids="+edit_partUids+"&dataType="+DATA_TYPE;
		} else if (btn.id == 'updataBtn') {
			if (record == null || record == "") {
				Ext.example.msg('提示信息', '请选择您要修改的入库单记录！');
				return;
			}
			var banFlag = record.data.abnormalOrNo;
			url += "?conid=" + record.data.conid + "&treeuids="
					+ record.data.treeUids + "&uids=" + record.data.uids
					+ "&banFlag=" + banFlag;
		}
        url +="&mark=markTrue"
		selectWinEs = new Ext.Window({
			width : 950,
			height : document.body.clientHeight,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function() {
					dsIntoEs.reload();
					dsSubInto.reload();
				},
				'show' : function() {
					equArrival.location.href = url;
				}
			}
		});
		selectWinEs.show();
	}

	function delFun() {
		var record = gridPanelIntoEs.getSelectionModel().getSelected();
        if (record == null || record == "") {
            Ext.example.msg('提示信息', '请先选择要删除的记录！');
            return;
        }
		var finished = record.get("finished");
		var flag = record.get("abnormalOrNo");
		if (finished == null || finished == "") {
			Ext.example.msg('提示信息', '请先选择要删除的记录！');
			return;
		} else if (finished == '0') {
			delBtn.setDisabled(true);
			return;
		} else {
			Ext.Msg.confirm("信息提示", "删除后不能恢复，是否要删除", function(btn) {
						if (btn == 'yes') {
							var uids = record.get("uids");
							gridPanelIntoEs.getEl().mask("loading...");
							DWREngine.setAsync(false);
							equMgm.delEquRkGoodsStoreinEstimate(uids, flag, pid,
									function(text) {
										if (text == 'success') {
											Ext.example.msg('提示信息', '您删除了一条记录');
										} else {
											Ext.example.msg('提示信息', '删除失败');
										}
										dsIntoEs.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
										dsSubInto.baseParams.params = "1=2";
										dsSubInto.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
									});
							DWREngine.setAsync(false);
							gridPanelIntoEs.getEl().unmask();
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
	
	function doInputFn(){
		 var record = gridPanelIntoEs.getSelectionModel().getSelected();
		 if(record == null || record == ''){
		     Ext.Msg.alert("系统提醒","请选择数据!")
		 }else{
		   var warehouseInType = record.get("warehouseInType");
			   if(warehouseInType == '暂估入库'){
					var url = BASE_PATH
							+ "Business/equipment/equMgm/equ.into.warehousing.estimate.jsp?uids='"+record.get('uids')+"'";
					selectWinEs = new Ext.Window({
						width : 950,
						height : 500,
						modal : true,
						plain : true,
						border : false,
						resizable : false,
						html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
						listeners : {
							'close' : function() {
								dsIntoEs.reload();
								dsSubInto.reload();
							},
							'show' : function() {
								equArrival.location.href = url;
							}
						}
					});
					selectWinEs.show();
			  }
		   }
	    }
	    
	        //附件 
    function filelistFn(value, metadata, record){
		    	        var uidsStr = record.get('uids')
						var downloadStr="";
						var billstate = record.get('finished');
						var count=0;
						var editable = true;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+uidsStr+
				                           "' and transaction_type='"+businessTypeEs+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						if(billstate == 1){
						   downloadStr="附件["+count+"]";
						   editable = true;
						}else{
						   downloadStr="附件["+count+"]";
						   editable = false;
						}	
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessTypeEs + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
})

function finishOpenboxIntoEs(uids, exceOr, finished) {
	if(!isFinance){
        Ext.example.msg('提示信息','当前用户不是财务部用户，不能进行完结操作！');
        finished.checked = false;
        return;
    }
	DWREngine.setAsync(false);
	equMgm.judgmentFinishedEstimate(uids, exceOr, pid,'body','暂估入库', function(index) {
		if (index == '2') {
			Ext.example.msg('提示信息','设备暂估入库单中<br>【<font style="color:red;">' +
					        '设备入库详细信息</font>】数据未填写完整<br>请填写完整！');
			finished.checked = false;
		} else if (index == '3') {
			Ext.example.msg('提示信息','设备暂估入库单中<br>【<font style="color:red;">' +
					        '设备入库详细信息</font>】为空<br>不能完结！');
			finished.checked = false;
		} else if (index == '0') {
			Ext.example.msg('提示信息', '设备暂估入库单完结操作成功！');
			finished.checked = true;
		} else if (index == '1') {
			Ext.example.msg('提示信息', '完结出错！');
			finished.checked = false;
		}
		if (selectUuid == null || selectUuid == "") {
			dsIntoEs.baseParams.params = "dataType='"+DATA_TYPE+"' and conid='"+edit_conid+"'"+treeIds;
		} else {
		    dsIntoEs.reload();
        }
		dsIntoEs.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	})

	DWREngine.setAsync(true);
}


//显示多附件的文件列表
function showUploadWin(businessTypeEs, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessTypeEs="
			+ businessTypeEs + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
    dsIntoEs.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}
