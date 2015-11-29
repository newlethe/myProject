// 设备冲回入库主页
var beanIntoBcak = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinBack";
var businessBack = "baseMgm";
var listMethodBack = "findWhereOrderby";
var primaryKeyBack = "uids";
var orderColumnBack = "uids";

var beanSubIntoBcak = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinBackSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var selectWin;
var pid = CURRENTAPPID;
var dsIntoBack;
var dsSubIntoBack;
var saveBtnBack;
var equUids="";	
var intosContentPanel2;
var fcIntoBack;
var fcSubIntoBack;
var gridPanelIntoBack;
var gridPanelIntoBackSub

var equWareArr = new Array();
var equTypeArr = new Array();
var partBs = new Array();
var businessType = "zlMaterial";


var cmArrayIntoBack = [['selectAll','全部']];
var cmHideIntoBack = new Array();
var store1IntoBack;
var chooseRowIntoBack;

var cmArrayIntoBackSub = [['selectAll','全部']];
var cmHideIntoBackSub = new Array();
var store1IntoBackSub;
var chooseRowIntoBackSub;
var printBackBtn;

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
		          equWareArr.push(temp);
	           
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
    
	DWREngine.setAsync(true);

	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	// 处理设备仓库下拉框

	var fm = Ext.form; // 包名简写（缩写）
    fcIntoBack = {
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
		'warehouseNoNo' :{
		   	name : 'warehouseNoNo',
			fieldLabel : '冲回入库单据号'
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
		header : fcIntoBack['uids'].fieldLabel,
		dataIndex : fcIntoBack['uids'].name,
		hidden : true
	}, {
		id : 'pid',
		header : fcIntoBack['pid'].fieldLabel,
		dataIndex : fcIntoBack['pid'].name,
		hidden : true
	}, {
		id : 'conid',
		header : fcIntoBack['conid'].fieldLabel,
		dataIndex : fcIntoBack['conid'].name,
		hidden : true
	}, {
		id : 'treeUids',
		header : fcIntoBack['treeUids'].fieldLabel,
		dataIndex : fcIntoBack['treeUids'].name,
		hidden : true
	}, {
		id : 'openBoxId',
		header : fcIntoBack['openBoxId'].fieldLabel,
		dataIndex : fcIntoBack['openBoxId'].name,
		width : 0,
		hidden : true
	}, {
		id : 'finished',
		header : fcIntoBack['finished'].fieldLabel,
		dataIndex : fcIntoBack['finished'].name,
		renderer : function(v, m, r) {
			var o = r.get('finished');
			var abnormalOrNo = r.get('abnormalOrNo');
			var str = "<input type='checkbox' "
					+ (o == 0 ? "disabled title='已完结，不能取消完结' " : "") + " "
					+ (v == 0 ? "checked title='已完结' " : "title='未完结'")
					+ " onclick='finishOpenboxIntoBack(\"" + r.get("uids") + "\",\""
					+ abnormalOrNo + "\",this)'>"
			return str;
		},
		width : 40
	}, {
		id : 'warehouseInType',
		header : fcIntoBack['warehouseInType'].fieldLabel,
		dataIndex : fcIntoBack['warehouseInType'].name,
		hidden : true			
	}, {
		id : 'warehouseNo',
		header : fcIntoBack['warehouseNo'].fieldLabel,
		dataIndex : fcIntoBack['warehouseNo'].name,
		align : 'center',
		width : 200,
		hidden : true
	},{
		id : 'warehouseNoNo',
		header : fcIntoBack['warehouseNoNo'].fieldLabel,
		dataIndex : fcIntoBack['warehouseNoNo'].name,
		align : 'center',
		width : 250 		
	}, {
		id : 'warehouseDate',
		header : fcIntoBack['warehouseDate'].fieldLabel,
		dataIndex : fcIntoBack['warehouseDate'].name,
		align : 'center',
		renderer : formatDateTime,
		width : 100
	}, {
		id : 'noticeNo',
		header : fcIntoBack['noticeNo'].fieldLabel,
		dataIndex : fcIntoBack['noticeNo'].name,
		align : 'center',
		hidden : true,
		width : 250
	}, {
		id : 'supplyunit',
		header : fcIntoBack['supplyunit'].fieldLabel,
		dataIndex : fcIntoBack['supplyunit'].name,
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
		width : 250
	}, {
		id : 'invoiceno',
		header : fcIntoBack['invoiceno'].fieldLabel,
		dataIndex : fcIntoBack['invoiceno'].name,
		align : 'center',
		width : 120
	}, {
		id : 'equid',
		header : fcIntoBack['equid'].fieldLabel,
		dataIndex : fcIntoBack['equid'].name,
        renderer : function(v){
            var equid = "";
            for (var i = 0; i < equWareArr.length; i++) {
                if (v == equWareArr[i][1])
                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
            }
            return equid;
        },
		align : 'center',
		width : 200
    },{
        id : 'fileid',
        header : fcIntoBack['fileid'].fieldLabel,
        dataIndex : fcIntoBack['fileid'].name,
        renderer : filelistFn,
        align : 'center',
        hidden : true,
        width : 100
	}, {
		id : 'warehouseMan',
		header : fcIntoBack['warehouseMan'].fieldLabel,
		dataIndex : fcIntoBack['warehouseMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'makeMan',
		header : fcIntoBack['makeMan'].fieldLabel,
		dataIndex : fcIntoBack['makeMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'remark',
		header : fcIntoBack['remark'].fieldLabel,
		dataIndex : fcIntoBack['remark'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'abnormalOrNo',
		header : fcIntoBack['abnormalOrNo'].fieldLabel,
		dataIndex : fcIntoBack['abnormalOrNo'].name,
		align : 'right',
		width : 0,
		hidden : true
	}, {
		id : 'dataType',
		header : fcIntoBack['dataType'].fieldLabel,
		dataIndex : fcIntoBack['dataType'].name,
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
				name : 'treeUids',
				type : 'string'
			}, {
				name : 'finished',
				type : 'float'
			}, {
				name : 'warehouseNo',
				type : 'string'
			}, {
			    name : 'warehouseNoNo',
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

	dsIntoBack = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanIntoBcak,
					business : businessBack,
					method : listMethodBack,
					params: "dataType='"+DATA_TYPE+"' and conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"'"
					
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeyBack
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsIntoBack.setDefaultSort(orderColumnBack, 'asc');

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
            
    printBackBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
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
        var filePrintType = "EquStoreinBackView";
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
   store1IntoBack = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArrayIntoBack
	}); 
   chooseRowIntoBack = new Ext.form.MultiSelect({
         id:   'chooserow2',
         width:  150,
         store : store1IntoBack,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelIntoBack.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowIntoBack.setValue(cmHideIntoBack);
		            cmSelectById(colModel,cmHideIntoBack);
		        }else{
		            this.selectAll();
		            cmSelectById(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowIntoBack.setValue(this.getCheckedValue());
                cmSelectById(colModel,this.getCheckedValue());
		    }
		}
  });
 
  function cmSelectById(colModel,str){
    	var cmHideIntoBack = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+2; i<colModel.getColumnCount();i++){
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
	    
   gridPanelIntoBack = new Ext.grid.GridPanel({
				ds : dsIntoBack,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : ['<font color=#15428b><B>冲回入库单信息<B></font>', '-', addBtn,
						'-', delBtn, '-', printBackBtn,'->',chooseRowIntoBack],
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
					store : dsIntoBack,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	// TODO : ======入库通知单明细======
	fcSubIntoBack = {
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
			fieldLabel : '箱件号'
		},
		'warehouseType' : {
			name : 'warehouseType',
			fieldLabel : '设备类型'
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '设备名称'
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
            ,decimalPrecision:4
		},
		'weight' : {
			name : 'weight',
			fieldLabel : '重量'
		},
		'inWarehouseNo' : {
			name : 'inWarehouseNo',
			fieldLabel : '入库数量'
            ,decimalPrecision : 4
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

        'stockno' : {name : 'stockno', fieldLabel : '存货编码'},
        'taxes' : {name : 'taxes', fieldLabel : '税金'},
        'totalnum' : {name : 'totalnum', fieldLabel : '合计'},
        
		'memo' : {
			name : 'memo',
			fieldLabel : '备注'
		}
	};

	var equnoComboBox = new fm.ComboBox(fcSubIntoBack['equno']);

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
			// smSub,
			new Ext.grid.RowNumberer({
						header : '序号',
						width : 35
					}), {
				id : 'uids',
				header : fcSubIntoBack['uids'].fieldLabel,
				dataIndex : fcSubIntoBack['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcSubIntoBack['pid'].fieldLabel,
				dataIndex : fcSubIntoBack['pid'].name,
				hidden : true
			}, {
				id : 'sbrkUids',
				header : fcSubIntoBack['sbrkUids'].fieldLabel,
				dataIndex : fcSubIntoBack['sbrkUids'].name,
				hidden : true
			}, {
				id : 'boxSubId',
				header : fcSubIntoBack['boxSubId'].fieldLabel,
				dataIndex : fcSubIntoBack['boxSubId'].name,
				hidden : true

			}, {
				id : 'boxNo',
				header : fcSubIntoBack['boxNo'].fieldLabel,
				dataIndex : fcSubIntoBack['boxNo'].name,
				align : 'right',
                hidden : true
			}, {
				id : 'warehouseType',
				header : fcSubIntoBack['warehouseType'].fieldLabel,
				dataIndex : fcSubIntoBack['warehouseType'].name,
				align : 'center',
				renderer : function(v) {
					var equ = "";
					for (var i = 0; i < equTypeArr.length; i++) {
						if (v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				},
                hidden : true
            },{
                id : 'stockno',
                header : fcSubIntoBack['stockno'].fieldLabel,
                dataIndex : fcSubIntoBack['stockno'].name,
                align : 'center',
                width : 200
			}, {
				id : 'warehouseName',
				header : fcSubIntoBack['warehouseName'].fieldLabel,
				dataIndex : fcSubIntoBack['warehouseName'].name,
				align : 'center',
				width : 200
			}, {
				id : 'ggxh',
				header : fcSubIntoBack['ggxh'].fieldLabel,
				dataIndex : fcSubIntoBack['ggxh'].name,
				align : 'center',
				width : 100
			}, {
				id : 'graphNo',
				header : fcSubIntoBack['graphNo'].fieldLabel,
				dataIndex : fcSubIntoBack['graphNo'].name,
				align : 'center',
				width : 100,
                hidden : true
			}, {
				id : 'unit',
				header : fcSubIntoBack['unit'].fieldLabel,
				dataIndex : fcSubIntoBack['unit'].name,
				align : 'center'
			}, {
				id : 'warehouseNum',
				header : fcSubIntoBack['warehouseNum'].fieldLabel,
				dataIndex : fcSubIntoBack['warehouseNum'].name,
				align : 'right',
				width : 80,
                hidden : true
			}, {
				id : 'weight',
				header : fcSubIntoBack['weight'].fieldLabel,
				dataIndex : fcSubIntoBack['weight'].name,
				align : 'right',
				width : 80,
                hidden : true
            },{
                id : 'totalnum',
                header : fcSubIntoBack['totalnum'].fieldLabel,
                dataIndex : fcSubIntoBack['totalnum'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSubIntoBack['totalnum']),
                align : 'right',
                hidden : true,
                width : 80
            },{
                id : 'taxes',
                header : fcSubIntoBack['taxes'].fieldLabel,
                dataIndex : fcSubIntoBack['taxes'].name,
                renderer : function(v,m,r){
                    return v;
                },
                align : 'right',
                width : 80
			},{
                id : 'inWarehouseNo',
                header : fcSubIntoBack['inWarehouseNo'].fieldLabel,
                dataIndex : fcSubIntoBack['inWarehouseNo'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSubIntoBack['inWarehouseNo']),
                align : 'right',
                width : 80
            },{
                id : 'intoMoney',
                header : fcSubIntoBack['intoMoney'].fieldLabel,
                dataIndex : fcSubIntoBack['intoMoney'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
					if(isNaN(v) ==  true){
						return v.toFixed(2);
					}else{
					  return parseFloat(v,10).toFixed(2);
					}
                },
                //editor : new fm.NumberField(fcSubIntoBack['intoMoney']),
                align : 'right',
                width : 80
            },{
                id : 'totalMoney',
                header : fcSubIntoBack['totalMoney'].fieldLabel,
                dataIndex : fcSubIntoBack['totalMoney'].name,
                align : 'right',
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSubIntoBack['totalMoney']),
                width : 80
			}, {
				id : 'equno',
				header : fcSubIntoBack['equno'].fieldLabel,
				dataIndex : fcSubIntoBack['equno'].name,
				renderer : function(v, m, r) {
					var equno = "";
					//m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][0])
							equno = equWareArr[i][3]+"-"+equWareArr[i][2];
					}
					return equno;
				},
				align : 'center'
				//editor : equnoComboBox,
			}, {
				id : 'memo',
				header : fcSubIntoBack['memo'].fieldLabel,
				dataIndex : fcSubIntoBack['memo'].name,
				width : 200,
				align : 'center',
				renderer : function(v, m, r) {
					//m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				//editor : new fm.TextField(fcSubIntoBack['memo']),
                hidden : true
			}]);

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
        {name:'memo', type:'string'},
        {name:'stockno', type:'string'},
        {name:'taxes', type:'float'},
        {name:'totalnum', type:'float'}
	];

	dsSubIntoBack = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSubIntoBcak,
					business : businessSub,
					method : listMethodSub,
					params : ' 1=2 ' //"sbrk_uids in (select uids from  EquGoodsStoreinBack where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"' and dataType='EQUBODY' )"
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
	dsSubIntoBack.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列

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
        stockno : '',
        taxes : '',
        totalnum : '',
		memo : ''
	}

	saveBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
                hidden : true,
				handler : saveFun
			});
   store1IntoBackSub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArrayIntoBackSub
	}); 
   chooseRowIntoBackSub = new Ext.form.MultiSelect({
         id:   'chooserow3',
         width:  150,
         store : store1IntoBackSub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelIntoBackSub.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowIntoBackSub.setValue(cmHideIntoBack);
		            cmSelectByIdSub(colModel,cmHideIntoBack);
		        }else{
		            this.selectAll();
		            cmSelectByIdSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowIntoBackSub.setValue(this.getCheckedValue());
                cmSelectByIdSub(colModel,this.getCheckedValue());
		    }
		}
  });
 
  function cmSelectByIdSub(colModel,str){
    	var cmHideIntoBack = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<colModel.getColumnCount();i++){
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
   gridPanelIntoBackSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSubIntoBack,
		cm : cmSub,
		sm : smSub,
		tbar : ['<font color=#15428b><B>冲回入库单明细<B></font>', '-', saveBtn,'->',chooseRowIntoBackSub],
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
			store : dsSubIntoBack,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSubIntoBcak,
		business : businessSub,
		primaryKey : primaryKeySub
	});
    gridPanelIntoBackSub.on("aftersave",function(){
        dsSubIntoBack.load({params:{start:0,limit:PAGE_SIZE}});
    });
   cm.defaultSortable = true;
   cmSub.defaultSortable = true;
   intosContentPanel2 = new Ext.Panel({
   	            id : 'intosContentPanel2',
				layout : 'border',
				region : 'center',
				title:'冲回入库',
				items : [gridPanelIntoBack, gridPanelIntoBackSub]
			});

//	dsIntoBack.load({
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});
//	dsSubIntoBack.load({
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});	
	if(ModuleLVL>=3){
			   addBtn.setDisabled(true);
			   delBtn.setDisabled(true);	 
			}		
	sm.on("rowselect", function() {
				var record = gridPanelIntoBack.getSelectionModel().getSelected();
				if (record == null || record == '') {
				} else {
					if(ModuleLVL>=3){
					   addBtn.setDisabled(true);
					   delBtn.setDisabled(true);
					}else{
						addBtn.setDisabled(false);
						if (record.get("finished") == '0') {
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
							saveBtn.setDisabled(true);
	                        printBackBtn.setDisabled(false);
						} else {
							editBtn.setDisabled(false);
							delBtn.setDisabled(false);
							saveBtn.setDisabled(false);
	                        printBackBtn.setDisabled(false);
						}
					}
					dsSubIntoBack.baseParams.params = "sbrk_uids='"
							                + record.get("uids") + "' and pid='"
							                + record.get("pid") + "'";
					dsSubIntoBack.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				}
			})

	treePanel.on('click', function() {
		      DWREngine.setAsync(false);
		      var sql="select t.uids from Equ_Goods_Storein_Back t  where " +" treeuids in (" +
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
			  dsSubIntoBack.baseParams.params = equUids; 
			  dsSubIntoBack.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});

			});
            

	// -------------------function-------------------

	function saveFun() {
        var records = dsSubIntoBack.getModifiedRecords();
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
	                intoMoney = (totalMoney/inWarehouseNo).toFixed(2);
            }
            r.set("totalMoney",totalMoney);
            r.set("taxes",taxes);
            r.set("intoMoney",intoMoney)
        }
		gridPanelIntoBackSub.defaultSaveHandler();
	}

	function addOrUpdateFun(btn) {
		var record = sm.getSelected();
		var url = BASE_PATH
//				+ "Business/equipment/equMgm/equ.back.into.warehousing.estimate.jsp";
		        + "Business/equipment/baseInfo/equ.bodys.back.into.warehousing.estimate.jsp";
		if (btn.id == 'addBtn') {
			url += "?conid=" + edit_conid + "&treeuids=" + edit_treeUids+"&edit_flag=chrk&dataType="+DATA_TYPE;
		} else {
		    return;
		}

		selectWin = new Ext.Window({
			width : 950,
			height : 500,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function() {
					dsIntoBack.reload();
					dsSubIntoBack.reload();
					
				},
				'hide' : function() {
					dsIntoBack.reload();
					dsSubIntoBack.reload();
				},
				'show' : function() {
					equArrival.location.href = url;
				} 
			}
		});
		selectWin.show();
	}

	function delFun() {
		var record = gridPanelIntoBack.getSelectionModel().getSelected();
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
							gridPanelIntoBack.getEl().mask("loading...");
							DWREngine.setAsync(false);
							equMgm.delEquRkGoodsStoreinBack(uids, flag, pid,
									function(text) {
										if (text == 'success') {
											Ext.example.msg('提示信息', '您删除了一条记录');
										} else {
											Ext.example.msg('提示信息', '删除失败');
										}
										dsIntoBack.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
										dsSubIntoBack.baseParams.params = "1=2";
										dsSubIntoBack.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
									});
							DWREngine.setAsync(false);
							gridPanelIntoBack.getEl().unmask();
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
	
		        //附件 
    function filelistFn(value, metadata, record){
		    	        var uidsStr = record.get('uids')
						var downloadStr="";
						var billstate = record.get('finished');
						var count=0;
						var editable = true;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+uidsStr+
				                           "' and transaction_type='"+businessType+"'", function (jsonData) {
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
									+ businessType + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
})

function finishOpenboxIntoBack(uids, exceOr, finished) {
   if(!isFinance){
        Ext.example.msg('提示信息','当前用户不是财务部用户，不能进行完结操作！');
        finished.checked = false;
        return;
    }
	DWREngine.setAsync(false);
	equMgm.judgmentBackFinished(uids, exceOr, pid,'body','暂估入库', function(index) {
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
		} else if (index == '1') {
			Ext.example.msg('提示信息', '完结出错！');
			finished.checked = false;
		}
		if (selectUuid == null || selectUuid == "") {
			dsIntoBack.baseParams.params = "";
		} else {
			dsIntoBack.reload();
		}
		dsIntoBack.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	})

	DWREngine.setAsync(true);
}
//显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
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
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
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
    dsIntoBack.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}
