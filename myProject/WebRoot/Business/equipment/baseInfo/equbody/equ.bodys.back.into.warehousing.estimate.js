var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimate";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimateSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";

var pid = CURRENTAPPID;

var partBs = new Array();
var equTypeArr = new Array();
var equWareArr =  new Array();
var equUids = "";
var showDs="";
var showSubDs ="";


Ext.onReady(function() {
	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : equWareArr
	});
	
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
    
        // 获取乙方单位
    conpartybMgm.getPartyB(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);
			temp.push(list[i].partyb);
			partBs.push(temp);
		}
	});
	
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
	if(edit_flag == 'zgrk' ||  edit_flag == 'chrk'){
			var whereSql = " conid='"+edit_conid+"' and treeuids='"+edit_treeuids+"' and pid='" + pid
		                    + "'";
		    var sql =" ";
		    if(edit_flag == 'zgrk'){
		       sql = "(select  warehouse_zgrk_no from EQU_GOODS_STOREIN  where " +whereSql+")";   
		    }else if(edit_flag == 'chrk'){
		       sql = "(select  warehouse_no from EQU_GOODS_STOREIN_BACK  where conid='"+edit_conid+"')";
		    }
		    var endSql = "select t.uids from EQU_GOODS_STOREIN_ESTIMATE t  where t.warehouse_no not in "+sql+" and finished='0' and " +
		    		     " treeuids in (select uuid from equ_type_tree start with treeid=(select treeid from equ_type_tree where uuid='"+edit_treeuids+"')" +
		    		     " connect  by prior treeid=parentid) and conid='"+edit_conid+"' and warehouse_in_type='暂估入库'";
		    baseMgm.getData( endSql,function(list) {
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
		    });
	  }
    DWREngine.setAsync(true);
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
				singleSelect : false
			});

	var cm = new Ext.grid.ColumnModel([
	    sm,
		new Ext.grid.RowNumberer({
				header : '序号',
				width : 35
			}),
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
		hidden : true,
		width : 40
	}, {
				id : 'warehouseInType',
				header : fc['warehouseInType'].fieldLabel,
				dataIndex : fc['warehouseInType'].name
	}, {
		id : 'warehouseNo',
		header : fc['warehouseNo'].fieldLabel,
		dataIndex : fc['warehouseNo'].name,
		align : 'center',
		width : 250
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
		width : 220
	}, {
		id : 'invoiceno',
		header : fc['invoiceno'].fieldLabel,
		dataIndex : fc['invoiceno'].name,
		align : 'center',
		width : 120
	}, {
		id : 'equid',
		header : fc['equid'].fieldLabel,
		dataIndex : fc['equid'].name,
        renderer : function(v){
            var equid = "";
            for (var i = 0; i < equWareArr.length; i++) {
                if (v == equWareArr[i][0])
                    equid = equWareArr[i][3]+" - "+equWareArr[i][1];
            }
            return equid;
        },
		align : 'center',
		width : 180
    }, {
		id : 'warehouseMan',
		header : fc['warehouseMan'].fieldLabel,
		dataIndex : fc['warehouseMan'].name,
		align : 'center',
		width : 0
	}, {
		id : 'makeMan',
		header : fc['makeMan'].fieldLabel,
		dataIndex : fc['makeMan'].name,
		align : 'center',
		width : 0
	}, {
		id : 'remark',
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		align : 'center',
		width : 0
	}, {
		id : 'abnormalOrNo',
		header : fc['abnormalOrNo'].fieldLabel,
		dataIndex : fc['abnormalOrNo'].name,
		align : 'right',
		width : 0,
		hidden : true
	}, {
		id : 'dataType',
		header : fc['dataType'].fieldLabel,
		dataIndex : fc['dataType'].name,
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
			    name:'warehouseInType',
			    type:'string'
		    }, {
			    name:'dataType',
			    type:'string'
		    }
	];
	if((edit_flag == 'zgrk' ) &&(equUids != "")){
	    showDs = " and uids  in "+equUids;
	}else if(edit_flag == 'chrk' &&(equUids !="") ){
	   showDs = " and uids  in "+equUids;
	}else{
        showDs = "  and 1=1";
    }
    var treeuidsStr="";
    if(edit_treeuids !="" ){
        DWREngine.setAsync(false);  
         var sql = "select  uuid from (select * from equ_type_tree start with treeid= (" +
         		   " select treeid from equ_type_tree t where t.uuid  = '"+edit_treeuids+"')" +
         		   " connect by prior treeid=parentid) where conid='"+edit_conid+"' and treeid<>'04' and parentid<>'04'"
         baseMgm.getData(sql, function(list){
         	if(list.length>0){
         	    treeuidsStr ="(";
         	    for(var i=0;i<list.length;i++){
         	      if(list.length == 1){
         	          treeuidsStr +="'"+list[i]+"'" ;
         	          break;
         	      }else{
         	         	if(i>=0 && i<list.length-1){
			                 treeuidsStr +="'"+list[i]+"',";
			             }else{
			                 treeuidsStr +="'"+list[i]+"'";
			             }
         	      }  
         	    }
         	    treeuidsStr +=")";
         	}
        })
         DWREngine.setAsync(true);            
    }
	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					// params: "conid='"+edit_conid+"'"
					params : "dataType='"+dataType+"' and  conid='"+edit_conid+"' and treeuids in "+treeuidsStr+" and finished='0' and"
					         +"  warehouse_in_type='暂估入库'"+showDs
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
	cm.defaultSortable = true;
	
	var resetBtn = new Ext.Button({
			id : 'addBtn',
			text : '确认冲回入库',
			iconCls : 'btn',
			handler : resetFun
	})
	var chooseBtn = new Ext.Button({
	   		id : 'add',
			text : '确认选择',
			iconCls : 'add',
			handler : chooseFun
	})
	
	if(edit_flag == 'zgrk'){
	    chooseBtn.setVisible(true);
	    resetBtn.setVisible(false);
	}else{
	    chooseBtn.setVisible(false);
	    resetBtn.setVisible(true);	
	}
	var gridPanel = new Ext.grid.GridPanel({
			ds : ds,
			sm : sm,
			cm : cm,
			title : '入库清单',
//				tbar : ['<font color=#15428b><B>入库单信息<B></font>', '-', addBtn,
//						'-', editBtn, '-', delBtn, '-', printBtn,'-',inputBtn],
			tbar :['<font color=#15428b><B>暂估入库单信息<B></font>','->','-',resetBtn,chooseBtn,'-'],
			header : false,
			border : false,
			// layout: 'fit',
			region : 'center',
			stripeRows : true,
			loadMask : true,
			enableHdMenu : false,
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
				align : 'right',
                hidden : true
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
				},
                hidden : true
            },{
                id : 'stockno',
                header : fcSub['stockno'].fieldLabel,
                dataIndex : fcSub['stockno'].name,
                align : 'center',
                width : 200
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
				width : 100,
                hidden : true
			}, {
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
				align : 'center',
				width : 100
			}, {
				id : 'warehouseNum',
				header : fcSub['warehouseNum'].fieldLabel,
				dataIndex : fcSub['warehouseNum'].name,
				align : 'right',
				width : 80,
                hidden : true
			}, {
				id : 'weight',
				header : fcSub['weight'].fieldLabel,
				dataIndex : fcSub['weight'].name,
				align : 'right',
				width : 80,
                hidden : true
            },{
                id : 'totalnum',
                header : fcSub['totalnum'].fieldLabel,
                dataIndex : fcSub['totalnum'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSub['totalnum']),
                align : 'right',
                width : 80
            },{
                id : 'taxes',
                header : fcSub['taxes'].fieldLabel,
                dataIndex : fcSub['taxes'].name,
                renderer : function(v,m,r){
                    return v;
                },
                align : 'right',
                hidden : true,
                width : 80
			},{
                id : 'inWarehouseNo',
                header : fcSub['inWarehouseNo'].fieldLabel,
                dataIndex : fcSub['inWarehouseNo'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSub['inWarehouseNo']),
                align : 'right',
                width : 80
            },{
                id : 'intoMoney',
                header : fcSub['intoMoney'].fieldLabel,
                dataIndex : fcSub['intoMoney'].name,
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSub['intoMoney']),
                align : 'right',
                width : 80
            },{
                id : 'totalMoney',
                header : fcSub['totalMoney'].fieldLabel,
                dataIndex : fcSub['totalMoney'].name,
                align : 'right',
                renderer : function(v,m,r){
                    //m.attr = "style=background-color:#FBF8BF";
                    return v;
                },
                //editor : new fm.NumberField(fcSub['totalMoney']),
                width : 80
			}, {
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v, m, r) {
					var equno = "";
					//m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][0])
							equno = equWareArr[i][3]+"-"+equWareArr[i][1];
					}
					return equno;
				},
				align : 'center',
				//editor : equnoComboBox,
                hidden : true
			}, {
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
				width : 200,
				align : 'center',
				renderer : function(v, m, r) {
					//m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				//editor : new fm.TextField(fcSub['memo']),
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
	if((edit_flag == 'zgrk' ) &&(equUids != "")){
	    showSubDs = " sbrk_uids  in "+equUids;
	}else if((edit_flag == 'chrk' )&&(equUids != "")){
		showSubDs = " 1=2 and sbrk_uids  in "+equUids;
	}else{
        showSubDs = "1=2";
    }
	dsSub = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSub,
					business : businessSub,
					method : listMethodSub,
					params : showSubDs
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
    cmSub.defaultSortable = true;
    
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
	         value : '显示更多信息',
	         onSelect : function(r,i){
	         	var colModel = gridPanelSub.getColumnModel();
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
	
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		tbar : ['<font color=#15428b><B>暂估入库单明细<B></font>', '->', chooseRow],
		header : false,
		height : document.body.clientHeight * 0.5,
		border : false,
		// layout: 'fit',
		region : 'south',
		enableHdMenu : false,
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

	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});
    for(var o in fcSub){
	        var name = fcSub[o];
	        var temp = new Array();
	        temp.push(fcSub[o].name);
	        temp.push(fcSub[o].fieldLabel);
	        var colModel = gridPanelSub.getColumnModel();
	        //锁定列不在显示更多信息中出现
	        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcSub[o].name)){
		        cmArray.push(temp);
		        if(!colModel.isHidden(colModel.getIndexById(o))){
		            cmHide.push(o)
		        }
	        }
	    }
	    store1.loadData(cmArray)
		chooseRow.setValue(cmHide);
	    chooseRow.setRawValue("显示更多信息");
	    
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
			})		
			
	sm.on("rowselect", function() {
		 var record = gridPanel.getSelectionModel().getSelected();
	     if(record == null || record == "")return;
	     dsSub.baseParams.params="sbrk_uids='"+record.get("uids")+"'";
	     dsSub.load();
	})		
	function formatDateTime(value) {
		return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
	};
	
	function resetFun(){
	        var rec = sm.getSelections();
	        if(rec == null || rec == ""){
	            Ext.Msg.alert("系统提示","请选择要冲回入库的记录！")
	            return;
	        }else{
	        	Ext.MessageBox.confirm('确认', '该操作将不可恢复，确认要进行该操作吗？', function(btn,text) {
		           if(btn == 'yes'){
		                for(var i=0;i<rec.length;i++){
				            var uids = rec[i].get('uids');
				            DWREngine.setAsync(false);
				            //处理暂估入库检验单编号
				            var newRkNo = rec[i].get('warehouseNo');
				            var warehouseNoNo=newRkNo+"-";
							equMgm.getEquNewDhNo(CURRENTAPPID,warehouseNoNo,"warehouse_no_no","equ_goods_storein_back",null,function(str1){
								newRkNo = newRkNo.substring(0,2)+str1;
							});
							DWREngine.setAsync(true);
							DWREngine.setAsync(false);
							equMgm.resetGoodsStoreinBack(uids,newRkNo,null,null,function(str){
							     if(str == 'success'){
							     	  sm.clearSelections(false);
							          dsSub.baseParams.params="sbrk_uids='"+uids+"'";
			                          dsSub.load();
		//	                          parent.ds.load();
			                          parent.selectWin.hide();
							     }else{
							         Ext.Msg.alert("系统提示","冲回入库不成功，请重操作！");
							         return;
							     }
							})
		                }
		           }
	        })
     	}
	}
	
//确认选择
	function chooseFun(){
	   var rec = sm.getSelections();//getSelections();getSelected()
	   if(rec == null || rec ==""){
	       Ext.Msg.alert("信息提示","请选择要入库的暂估入库记录");
	       return;
	   }else{
	   	  var num=0;
		  for(var i=0;i<rec.length;i++){
			var  getUids = "";
			getUids = rec[i].get('uids');
			var conmoneyno;//财务合同编码
			var conno;
		   	DWREngine.setAsync(false);
		   	//财务合同编码
		   	baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", edit_conid,function(obj){
	            conno = obj.conno;
	            conmoneyno = obj.conmoneyno;
			});
//		   	//获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//	        var prefix = "";
//	        var sql = "select c.property_name from PROPERTY_CODE c " +
//	                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//	                " and c.property_code = '"+USERDEPTID+"' ";
//	        baseMgm.getData(sql, function(str){
//	            prefix = str.toString();
//	        });
		       		//处理入库检验单编号
			var newRkNo =  "-"+conno.replace(/^\n+|\n+$/g,"")+"-RK-";
			DWREngine.setAsync(false);
			equMgm.getEquNewDhNoToSb(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,"data_type='EQUBODY'",function(str){
				newRkNo = rec[i].get('warehouseNo').substring(0,2)+str;
			});
			DWREngine.setAsync(true);
			DWREngine.setAsync(false);
			equMgm.equGoodsIntoWarehousingFromZGRK(newRkNo,getUids,pid,function(str){
			      if(str == 'success'){
			      	  parent.dsIntoFormal.reload();
			      	num ++;
			      }else{
				      Ext.example.msg('提示信息', '确认选择操作失败！');
				      return;
			      }
			   })
			DWREngine.setAsync(true);
		}
		if(num>0){
			   Ext.example.msg('提示信息', '操作成功！');
			   parent.dsIntoFormal.reload();
		       parent.selectWin.hide();
			}else{
		      Ext.example.msg('提示信息', '确认选择操作失败！');
		      sm.clearSelections();
		      return;			
		 } 
	   }
	}
})