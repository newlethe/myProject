// 材料暂估入库主页
var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimate";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimateSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = edit_conid?edit_conid:'';
var selectTreeid = edit_treeUids?edit_treeUids:'';
var selectParentid = edit_partUids?edit_partUids:'';
var selectWin;
var pid = CURRENTAPPID;
var ds;
var dsSub;
var saveBtn;

var equWareArr = new Array();
var equTypeArr = new Array();
var partBs = new Array();
var equidS = new Array();
var businessType = "zlMaterial";
var whereSql='';

//判断当前用户是否是财务部
var isFinance = (USERDEPTID == '102010105') ? true : false;

Ext.onReady(function() {

	// 处理材料仓库下拉框
	DWREngine.setAsync(false);
    baseMgm.getData("select uids,equid,equno,wareno,waretype from equ_warehouse where pid='" + pid
                    + "' order by equid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            if(list[i][3]=="SBCK")
                temp.push("材料仓库");
            else if(list[i][3]=="CLCK")
                temp.push("材料仓库")
            else if(list[i][3]="JGCK")
                temp.push("建管仓库")
            equWareArr.push(temp);
        }
    });

	// 材料类型equTypeArr
	appMgm.getCodeValue("材料合同树分类", function(list) {
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

	 //获取仓库号的仓库分类，用于判断仓库号子节点的判断
	 baseMgm.getData("select equid from equ_warehouse where parent='01'",function(list){
	        for(var i=0;i<list.length;i++){ 
	            if(list[i] != null && list[i] != ""){
	                var temp = new Array();
	                temp.push(list[i]);
	                equidS.push(temp);
	            }
	        }
	    	
	    })    
    
	DWREngine.setAsync(true);

	// 材料仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	// 处理材料仓库下拉框

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
			fieldLabel : '材料开箱主键'
		},
		'warehouseInType' : {
		    name : 'warehouseInType',
		    fieldLabel : '入库类型'
		},
		'judgmentFlag' : {
		    name : 'judgmentFlag',
		    fieldLabel : '判断时是否是主体设备中的出入库'		
		}
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
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		hidden : true
	}, {
		id : 'treeUids',
		header : fc['treeUids'].fieldLabel,
		dataIndex : fc['treeUids'].name,
		hidden : true
	}, {
		id : 'openBoxId',
		header : fc['openBoxId'].fieldLabel,
		dataIndex : fc['openBoxId'].name,
		width : 0,
		hidden : true
	}, {
		id : 'finished',
		header : fc['finished'].fieldLabel,
		dataIndex : fc['finished'].name,
		renderer : function(v, m, r) {
			var o = r.get('finished');
			var abnormalOrNo = r.get('abnormalOrNo');
			var str = "<input type='checkbox' "
					+ (o == 0 ? "disabled title='已完结，不能取消完结' " : "") + " "
					+ (v == 0 ? "checked title='已完结' " : "title='未完结'")
					+ " onclick='finishOpenbox(\"" + r.get("uids") + "\",\""
					+ abnormalOrNo + "\",this)'>"
			return str;
		},
		width : 40
	}, {
				id : 'warehouseInType',
				header : fc['warehouseInType'].fieldLabel,
				dataIndex : fc['warehouseInType'].name,
				hidden : true			
	}, {
		id : 'warehouseNo',
		header : fc['warehouseNo'].fieldLabel,
		dataIndex : fc['warehouseNo'].name,
		align : 'center',
		width : 280
	}, {
		id : 'warehouseDate',
		header : fc['warehouseDate'].fieldLabel,
		dataIndex : fc['warehouseDate'].name,
		align : 'center',
		renderer : formatDateTime,
		width : 100
	}, {
		id : 'noticeNo',
		header : fc['noticeNo'].fieldLabel,
		dataIndex : fc['noticeNo'].name,
		align : 'center',
		hidden : edit_flagLayout ==''?false:true,
		width : 250
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
		width : 250
	}, {
		id : 'invoiceno',
		header : fc['invoiceno'].fieldLabel,
		dataIndex : fc['invoiceno'].name,
		align : 'center',
		width : 150
	}, {
		id : 'equid',
		header : fc['equid'].fieldLabel,
		dataIndex : fc['equid'].name,
        renderer : function(v){
            var equid = "";
            for (var i = 0; i < equWareArr.length; i++) {
                if (v == equWareArr[i][1]){
                    equid = equWareArr[i][2]+" - "+equWareArr[i][1];
                    break;
                }
            }
            return equid;
        },
		align : 'center',
		width : 220
    },{ 
        id : 'fileid',
        header : fc['fileid'].fieldLabel,
        dataIndex : fc['fileid'].name,
        renderer : filelistFn,
        align : 'center',
        hidden :  true,
        width : 100
	}, {
		id : 'warehouseMan',
		header : fc['warehouseMan'].fieldLabel,
		dataIndex : fc['warehouseMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'makeMan',
		header : fc['makeMan'].fieldLabel,
		dataIndex : fc['makeMan'].name,
		align : 'center',
		width : 0,
        hidden : true
	}, {
		id : 'remark',
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		align : 'center',
		width : 0,
        hidden : true
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
			    name:  'warehouseInType',
			    type:  'string'
		    }, {
		        name: 'judgmentFlag',
		        type: 'string'
		    }
	];

	if(edit_flagLayout ==''){
	   whereSql = " judgmentFlag ='noBody'";
	}else{
	   whereSql = " judgmentFlag ='body' and conid='"+selectConid+"'";
	}
	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					// params: "conid='"+edit_conid+"'"
					params : whereSql
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
	ds.setDefaultSort(orderColumn, 'asc');

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
            
    var printBtn = new Ext.Button({
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
        var modetype = "NewCL";
        var record = sm.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "WzStoreinEsView";
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

    var cmArray = [['selectAll','全部']];
    var cmHide = new Array();
    
   	var store1 = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArray
	}); 
    var  chooseRow = new Ext.form.MultiSelect({
         id:   'chooserow',
         width:  150,
         store : store1,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanel.getColumnModel();
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
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<cm.getColumnCount();i++){
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
    cm.defaultSortable = true;
	var gridPanel = new Ext.grid.GridPanel({
				ds : ds,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : ['<font color=#15428b><B>入库单信息<B></font>', '-', addBtn,
						'-', editBtn, '-', delBtn, '-', /*printBtn,*/'->',chooseRow],//,'-',inputBtn
				header : false,
				border : false,
				enableHdMenu : false,
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

	// TODO : ======入库通知单明细======
	var equTypeArrs = [['1','主体设备'],['2','备品备件'],['3','专用工具']]
	var equTypeDs = new Ext.data.SimpleStore({
	    	fields: ['k', 'v'],   
	        data: equTypeArrs
	    }); 
	var fcSub = {
			'uids' : {name : 'uids',fieldLabel : '主键'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'sbrkUids' : {name : 'sbrkUids' ,fieldLabel : '材料入库主表主键'},
			'boxSubId' : {name : 'boxSubId',fieldLabel : '材料开箱明细表主键'},
			'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
			'warehouseType' : {
				name : 'warehouseType',
				fieldLabel : '材料类型',
				readOnly: true,
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            allowBlank : false,
	           	triggerAction: 'all',
	           	store: equTypeDs
				},
			'warehouseName' : {name : 'warehouseName',fieldLabel : '材料名称', allowBlank : false},
			'ggxh' : {name : 'ggxh',fieldLabel : '规格型号', allowBlank : false},
			'unit' : {name : 'unit',fieldLabel : '单位'},
			'inWarehouseNo' : {name : 'inWarehouseNo',fieldLabel : '数量',decimalPrecision:4},
			'unitPrice' : {name : 'unitPrice',fieldLabel : '单价', allowBlank : true,decimalPrecision:6},
			'amountMoney' : {name : 'amountMoney',fieldLabel : '金额', allowBlank : true,decimalPrecision:2},
			'freightMoney' : {name : 'freightMoney',fieldLabel : '运费', allowBlank : true,decimalPrecision:2},
			'insuranceMoney' : {name : 'insuranceMoney',fieldLabel : '保险', allowBlank : true,decimalPrecision:2},
			'antherMoney' : {name : 'antherMoney',fieldLabel : '其他', allowBlank : true,decimalPrecision:2},
			'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价', allowBlank : true,decimalPrecision:6},
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
                         
	        'stockno' : {name : 'stockno', fieldLabel : '存货编码', allowBlank : false,readOnly:true},
	        'taxes' : {name : 'taxes', fieldLabel : '税金', allowBlank : true,decimalPrecision:2},
	        'totalnum' : {name : 'totalnum', fieldLabel : '合计', allowBlank : true,decimalPrecision:2},
			'memo' : {name : 'memo',fieldLabel : '备注',xtype: 'htmleditor',anchor:'95%',height: 80,width: 800}
		};

	var equnoComboBox = new fm.ComboBox(fcSub['equno']);

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
    equnoComboBox.on('click', function(node,e){
			var elNode = node.getUI().elNode;
			var treename = node.attributes.treename;
			var uids = elNode.all("uids").innerText;
	        if(node.id=='01'){
	        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
	        	   equnoComboBox.setRawValue("");
	        	   return;
	        	}
	        if(node.id){
		       for(var j=0;j<equidS.length;j++){
			             if(node.id ==equidS[j]){
			        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
			        	   equnoComboBox.setRawValue("");
			        	   return;	                
			             }
			         }
	        }
	        var equid = "";
	            for (var i = 0; i < equWareArr.length; i++) {
	                if (uids == equWareArr[i][0]){
	                   equid = equWareArr[i][2]+" - "+equWareArr[i][1];
	                   break;
	                }
	            }
	            //this.setValue(node.id);
	            //formPanel.getForm().findField("equid").setValue(node.id);
	            
	        equnoComboBox.setRawValue(equid);
			equnoComboBox.setValue(uids);
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
				id : 'warehouseType',
				header : fcSub['warehouseType'].fieldLabel,
				dataIndex : fcSub['warehouseType'].name,
			    align : 'center',
				renderer : function(v){
					var equ = "";
					for(var i=0;i<equTypeArrs.length;i++){
						if(v == equTypeArrs[i][0])
							equ = equTypeArrs[i][1];
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
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
			    align : 'center',
				width : 100
			},{
				id : 'inWarehouseNo',
				header : fcSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcSub['inWarehouseNo'].name,
				align : 'right',
				width : 80
			},{
				id : 'unitPrice',
				header : fcSub['unitPrice'].fieldLabel,
				dataIndex : fcSub['unitPrice'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'amountMoney',
				header : fcSub['amountMoney'].fieldLabel,
				dataIndex : fcSub['amountMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'freightMoney',
				header : fcSub['freightMoney'].fieldLabel,
				dataIndex : fcSub['freightMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'insuranceMoney',
				header : fcSub['insuranceMoney'].fieldLabel,
				dataIndex : fcSub['insuranceMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false, 
				width : 80
			},{
				id : 'antherMoney',
				header : fcSub['antherMoney'].fieldLabel,
				dataIndex : fcSub['antherMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'intoMoney',
				header : fcSub['intoMoney'].fieldLabel,
				dataIndex : fcSub['intoMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
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
				header : fcSub['totalMoney'].fieldLabel,
				dataIndex : fcSub['totalMoney'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'amountTax',
				header : fcSub['amountTax'].fieldLabel,
				dataIndex : fcSub['amountTax'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'freightTax',
				header : fcSub['freightTax'].fieldLabel,
				dataIndex : fcSub['freightTax'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'insuranceTax',
				header : fcSub['insuranceTax'].fieldLabel,
				dataIndex : fcSub['insuranceTax'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'antherTax',
				header : fcSub['antherTax'].fieldLabel,
				dataIndex : fcSub['antherTax'].name,
				align : 'right',
				hidden : edit_flagLayout ==''?true:false,
				width : 80
			},{
				id : 'graphNo',
				header : fcSub['graphNo'].fieldLabel,
				dataIndex : fcSub['graphNo'].name,
				align : 'center',
				width : 100,
                hidden : edit_flagLayout ==''?true:false
			},{
				id : 'warehouseNum',
				header : fcSub['warehouseNum'].fieldLabel,
				dataIndex : fcSub['warehouseNum'].name,
				align : 'right',
				width : 80,
                hidden : true
			},{
			    id : 'weight',
			    header : fcSub['weight'].fieldLabel,
				dataIndex : fcSub['weight'].name,
				align : 'right',
				width : 80,
                hidden : edit_flagLayout ==''?true:false
            },{
                id : 'totalnum',
                header : fcSub['totalnum'].fieldLabel,
                dataIndex : fcSub['totalnum'].name,
                align : 'right',
                hidden : true,
                width : 80
            },{
                id : 'taxes',
                header : fcSub['taxes'].fieldLabel,
                dataIndex : fcSub['taxes'].name,
                renderer : function(v,m,r){
                    return v;
                },
                align : 'right',
                hidden : edit_flagLayout ==''?true:false,
                width : 80
			}, {
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v,m,r){
					var equno = "";
					for(var i=0;i<equWareArr.length;i++){
						if(v == equWareArr[i][0]){
						    equno = equWareArr[i][2]+" - "+equWareArr[i][1];
						    break;
						}
					}
					return equno;
				},
				width : 180,
			    align : 'center'
			},{
                id : 'stockno',
                header : fcSub['stockno'].fieldLabel,
                dataIndex : fcSub['stockno'].name,
                align : 'center',
                width : 200
			},{
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
			    align : 'center',
				width : 200
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

	dsSub = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSub,
					business : businessSub,
					method : listMethodSub,
					params : " 1=2 "
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
				sbrkUids: '',
				boxSubId:'',
				warehouseType : '',
				warehouseName : '',
				ggxh : '',
				unit : '',
				inWarehouseNo : 0,
				unitPrice : 0,
				amountMoney : 0,
				antherMoney : 0,
				freightMoney : 0,
				intoMoney : 0,
				totalMoney : 0,
				amountTax : 0,
				freightTax : 0,
				insuranceMoney : 0,
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

	saveBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
                hidden : true,
				handler : saveFun
			});
			
    var cmArraySub = [['selectAll','全部']];
    var cmHideSub = new Array();
    var cmHideSubText = new Array();
    
   	var store1Sub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArraySub
	}); 
   var  chooseRowSub = new Ext.form.MultiSelect({
         id:   'chooserow1',
         width:  150,
         store : store1Sub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(rr,ii){
         	var colModel = gridPanelSub.getColumnModel();
	    	if(ii==0){
		        if(rr.get(this.checkField)){
		            chooseRowSub.setValue(cmHideSub);
		            cmSelectByIdSub(colModel,cmHideSub);
		        }else{
		            this.selectAll();
		            cmSelectByIdSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        rr.set(this.checkField, !rr.get(this.checkField));
                chooseRowSub.setValue(this.getCheckedValue());
                cmSelectByIdSub(colModel,this.getCheckedValue());
		    }
		}
  });
 
	function cmSelectByIdSub(cmSub,str){
    	var cmHideSub = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<cmSub.getColumnCount();i++){
        	if(i == 0)continue;
            for(var j=0;j<cmHideSub.length;j++){
                if(cmSub.getDataIndex(i) == cmHideSub[j]){
                    cmSub.setHidden(i,false);
                    break;
                }else{
                    cmSub.setHidden(i,true);
                }
            }
        }
	}	
	cmSub.defaultSortable = true;
	
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		tbar : ['<font color=#15428b><B>入库单明细<B></font>', '-', saveBtn,'->',chooseRowSub],
		header : false,
		height : document.body.clientHeight * 0.5,
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
    gridPanelSub.on("aftersave",function(){
        dsSub.load({params:{start:0,limit:PAGE_SIZE}});
    });

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				items : [gridPanel, gridPanelSub]
			});

	if(edit_flagLayout&&edit_flagLayout=="WZBODY"){
		var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});
	}else{
		var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, contentPanel]
			})
	}
	for(var o in fc){
        var name = fc[o];
        var temp = new Array();
        temp.push(fc[o].name);
        temp.push(fc[o].fieldLabel);
        var colModel = gridPanel.getColumnModel();
        //锁定列不在显示更多信息中出现
        if(colModel.getLockedCount()<=colModel.findColumnIndex(fc[o].name)){
	        cmArray.push(temp);
	        if(!colModel.isHidden(colModel.getIndexById(o))){
	            cmHide.push(o)
	        }
        }
    }
    store1.loadData(cmArray)
	chooseRow.setValue(cmHide);
    chooseRow.setRawValue("显示更多信息");
	for(var o in fcSub){
	    var name = fcSub[o];
	    var temp = new Array();
	    temp.push(fcSub[o].name);
	    temp.push(fcSub[o].fieldLabel);
	    var colModel = gridPanelSub.getColumnModel();
	    //锁定列不在显示更多信息中出现
	    if(colModel.getLockedCount()<=colModel.findColumnIndex(fcSub[o].name)){
	        cmArraySub.push(temp);
	        if(!colModel.isHidden(colModel.getIndexById(o))){
	            cmHideSub.push(o)
	            //cmHideSubText.push(name.fieldLabel)
	        }
	    }
	}
	store1Sub.loadData(cmArraySub)
	chooseRowSub.setValue(cmHideSub);
	chooseRowSub.setRawValue("显示更多信息");		
    Ext.get("chooserow1").on("mouseout", function(){
               if(chooseRowSub.getValue()==""||chooseRowSub.getValue()==null){
                          chooseRowSub.setValue(cmHideSub);
                          chooseRowSub.setRawValue("显示更多信息"); 
                    }     
       }, this);
    Ext.get("chooserow").on("mouseout", function(){
               if(chooseRow.getValue()==""||chooseRow.getValue()==null){
                          chooseRow.setValue(cmHide);
                          chooseRow.setRawValue("显示更多信息"); 
                    }     
       }, this);  
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	dsSub.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});	
			
	//权限控制
	if(ModuleLVL>=3){
	   addBtn.setDisabled(true);
       editBtn.setDisabled(true);
	   delBtn.setDisabled(true);	 
	}			
	sm.on("rowselect", function() {
				var record = gridPanel.getSelectionModel().getSelected();
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
								saveBtn.setDisabled(true);
								inputBtn.setDisabled(true);
		                        printBtn.setDisabled(false);
							} else {
								editBtn.setDisabled(false);
								delBtn.setDisabled(false);
								saveBtn.setDisabled(false);
								inputBtn.setDisabled(false);
		                        printBtn.setDisabled(false);
							}							
						}
					dsSub.baseParams.params = "sbrk_uids='"
							                + record.get("uids") + "' and pid='"
							                + record.get("pid") + "'";
					dsSub.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				}
			})

	treePanel.on('click', function(node) {
		      var elNode = node.getUI().elNode;
		      var isRoot = node == root;
			  var equUids="";	
		      DWREngine.setAsync(false);
		      var sql="select t.uids from WZ_GOODS_STOREIN_ESTIMATE t  where " +" treeuids in (" +
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
			  dsSub.baseParams.params = equUids; 
			  dsSub.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});

			});
            

	// -------------------function-------------------

	function saveFun() {
        var records = dsSub.getModifiedRecords();
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
		gridPanelSub.defaultSaveHandler();
	}

	function addOrUpdateFun(btn) {
		if(selectParentid == '0'){
				Ext.example.msg('提示信息','请选择该分类下的合同！');
		    	return ;		
		}
		var record = sm.getSelected();
		var url = BASE_PATH
				+ "Business/wzgl/baseinfo_wzgl/wz.into.warehousing.estimate.addorupdata.jsp";
		if (btn.id == 'addBtn') {
			if(edit_flagLayout=='' || edit_flagLayout == null){
				if (selectUuid == "" || selectConid == "") {
					Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
					return;
				}
				if (selectTreeid.indexOf("04") == 0) {
					Ext.example.msg('提示信息', '技术资料分类下不能添加入库通知单！');
					return;
				}
			}
			url += "?conid=" + selectConid + "&treeuids=" + selectConid
					+ "&treeid=" + selectConid+"&edit_flagLayout="+edit_flagLayout;
		} else if (btn.id == 'updataBtn') {
			if (record == null || record == "") {
				Ext.example.msg('提示信息', '请选择您要修改的入库单记录！');
				return;
			}
			var banFlag = record.data.abnormalOrNo;
			url += "?conid=" + record.data.conid + "&treeuids="
					+ record.data.treeUids + "&uids=" + record.data.uids
					+ "&banFlag=" + banFlag+"&edit_flagLayout="+edit_flagLayout;;
		}

		selectWin = new Ext.Window({
			width : document.body.clientWidth - 20,
			height : document.body.clientHeight - 20,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function() {
					ds.reload();
					dsSub.reload();
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
							gridPanel.getEl().mask("loading...");
							DWREngine.setAsync(false);
							wzbaseinfoMgm.delWzRkGoodsStoreinEstimate(uids, flag, pid,
									function(text) {
										if (text == 'success') {
											Ext.example.msg('提示信息', '您删除了一条记录');
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
	
	function doInputFn(){
		 var record = gridPanel.getSelectionModel().getSelected();
		 if(record == null || record == ''){
		     Ext.Msg.alert("系统提醒","请选择数据!")
		 }else{
		   var warehouseInType = record.get("warehouseInType");
			   if(warehouseInType == '暂估入库'){
					var url = BASE_PATH
							+ "Business/equipment/equMgm/equ.into.warehousing.estimate.jsp?uids='"+record.get('uids')+"'";
					selectWin = new Ext.Window({
						width : document.body.clientWidth - 20,
						height : document.body.clientHeight - 20,
						modal : true,
						plain : true,
						border : false,
						resizable : false,
						html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
						listeners : {
							'close' : function() {
								ds.reload();
								dsSub.reload();
							},
							'show' : function() {
								equArrival.location.href = url;
							}
						}
					});
					selectWin.show();
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

function finishOpenbox(uids, exceOr, finished) {
	var flag="";
	if(edit_flagLayout == ''){
	    flag = 'noBody';
	}else{
	    flag = 'body';
	}
	
//    if(!isFinance){
//        Ext.example.msg('提示信息','当前用户不是财务部用户，不能进行完结操作！');
//        finished.checked = false;
//        return;
//    }
    
	DWREngine.setAsync(false);
	wzbaseinfoMgm.judgmentWzFinishedEstimate(uids, exceOr, pid,flag,'暂估入库', function(index) {
		if (index == '2') {
			Ext.example.msg('提示信息','材料暂估入库单中<br>【<font style="color:red;">' +
					        '材料入库详细信息</font>】数据未填写完整<br>请填写完整！');
			finished.checked = false;
		} else if (index == '3') {
			Ext.example.msg('提示信息','材料暂估入库单中<br>【<font style="color:red;">' +
					        '材料入库详细信息</font>】为空<br>不能完结！');
			finished.checked = false;
		} else if (index == '0') {
			Ext.example.msg('提示信息', '材料暂估入库单完结操作成功！');
			finished.checked = true;
		} else if (index == '1') {
			Ext.example.msg('提示信息', '完结出错！');
			finished.checked = false;
		}
		if (selectUuid == null || selectUuid == "") {
			ds.baseParams.params = " judgmentFlag='"+flag+"'";
		} else {
		    ds.reload();
        }
		ds.load({
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
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}

