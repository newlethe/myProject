// 材料入库主页
var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStorein";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinSub";
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
var sm;
var businessType='zlMaterial'

var equWareArr = new Array();
var equTypeArr = new Array();
var partBs = new Array();
var joinUnitArr = new Array();
var allowedDocTypes = "xls,xlsx,doc,docx";
var whereSql = "";
var amountRateArr = new Array();
//判断当前用户是否是财务部
var isFinance = (USERDEPTID == '102010105') ? true : false;

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
            temp.push(list[i][2]);
            temp.push(list[i][1]);
            for(var j=0;j<typeArr.length;j++){
                if(list[i][3] == typeArr[j][1]){
                    temp.push(typeArr[j][0]);
                }
            }
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
    appMgm.getCodeValue("金额税率", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					amountRateArr.push(temp);
				}
			});
	appMgm.getCodeValue("主体设备参与单位", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].detailType);
					joinUnitArr.push(temp);
				}
			});
	var specialArr = new Array();
	appMgm.getCodeValue("设备专业分类", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					specialArr.push(temp);
				}
			});
	var jzNoArr = new Array();
	appMgm.getCodeValue("机组号", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					jzNoArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	//金额税率
	var amountRateStore  = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : amountRateArr
	});
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
            fieldLabel : '入库单'
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
		'warehouseZgrkNo': {
			name : 'warehouseZgrkNo',
			fieldLabel : '暂估入库单号'		
		},
		'warehouseBackNo': {
			name : 'warehouseBackNo',
			fieldLabel : '冲回入库单号'		
		},
		'type': {
			name : 'type',
			fieldLabel : '入库类型'		
		}
        , 'judgmentFlag' : {
		    name : 'judgmentFlag',
		    fieldLabel : '判断时是否是主体设备中的出入库'		
		}, 'joinUnit' : {
	              name : 'joinUnit',
	              fieldLabel : '参与单位',
	              width : 160			    
	    }
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
        ,'dataSource' : {name : 'dataSource',fieldLabel : '暂估入库冲回数据'}
		,'finishMark' : {name : 'finishMark',fieldLabel : '暂估入库冲回',width : 160},
		'special' : {
			name : 'special',
			fieldLabel : '专业类别'
		}
	}

	sm = new Ext.grid.CheckboxSelectionModel({
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
            var userID = r.get("createMan");
			var str = "<input type='checkbox' " + (o == 1 ? "disabled title='已完结，不能取消完结' " : " ")
					+ (v == 1 ? "checked title='已完结' " : "title='未完结'") + " onclick='finishOpenbox(\"" + r.get("uids") + "\",\""
					+ userID + "\",\"" + abnormalOrNo + "\",\""+r.get("type") + "\",\""+r.get("warehouseNo")+"\",this)'>";
			return str;
		},
		width : 40
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
		hidden : edit_flagLayout ==''?false:true,
		width : 250
	}, {
		id : 'warehouseZgrkNo',
		header : fc['warehouseZgrkNo'].fieldLabel,
		dataIndex : fc['warehouseZgrkNo'].name,
		align : 'center',
		hidden : true,
		width : 280
	}, {
		id : 'warehouseBackNo',
		header : fc['warehouseBackNo'].fieldLabel,
		dataIndex : fc['warehouseBackNo'].name,
		align : 'center',
		hidden :  true,
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
                if (v == equWareArr[i][2])
                    equid = equWareArr[i][3]+" - "+equWareArr[i][1];
            }
            return equid;
        },
		align : 'center',
		width : 200
    }, {
		id : 'special',
		header : fc['special'].fieldLabel,
		dataIndex : fc['special'].name,
		align : 'center',
		width : 80,
        renderer : function(v){
            for (var i = 0; i < specialArr.length; i++) {
                if (v == specialArr[i][0])
                    return specialArr[i][1];
            }
        }
	},{
        id:'fileid',
        header:fc['fileid'].fieldLabel,
        dataIndex:fc['fileid'].name,
        renderer : function(v,m,r){
            if(v!=''){
                return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid="
                        + v +"'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
            }else{
                return "<img src='"+BASE_PATH+"jsp/res/images/word_bw.gif'></img>";
            }
        },
        align : 'center',
        hidden : true,
        width : 90
    },{
        id : 'fileid',
        header : '附件',
        dataIndex : fc['fileid'].name,
        renderer : filelistFn, 
        align : 'center',
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
	},{
		id : 'type',
		header : fc['type'].fieldLabel,
		dataIndex : fc['type'].name,
		align : 'center',
		hidden :  false,
		width : 100
	}, {
		id : 'abnormalOrNo',
		header : fc['abnormalOrNo'].fieldLabel,
		dataIndex : fc['abnormalOrNo'].name,
		align : 'right',
		width : 0,
		hidden : true
	}, {
		id : 'dataSource',
		header : fc['dataSource'].fieldLabel,
		dataIndex : fc['dataSource'].name,
		align : 'center',
		hidden : true,
		width : 280
	},{
		id : 'finishMark',
		header : fc['finishMark'].fieldLabel,
		dataIndex : fc['finishMark'].name,
		align : 'center',
		hidden : true,
		width : 280
	},{
		id : 'judgmentFlag',
		header : fc['judgmentFlag'].fieldLabel,
		dataIndex : fc['judgmentFlag'].name,
		align : 'center',
		hidden : true,
		width : 100
	}, {
		id : 'joinUnit',
		header : fc['joinUnit'].fieldLabel,
		dataIndex : fc['joinUnit'].name,
		align : 'center',
		width : 100,
		renderer : function(v) {
			var str = "";
			for (var i = 0; i < joinUnitArr.length; i++) {
				if (v == joinUnitArr[i][0]){
					str = joinUnitArr[i][1];
					break;
				}
			}
			return str;
		}
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
			    name : 'warehouseZgrkNo',
			    type : 'string'
			},  {
			    name : 'warehouseBackNo',
			    type : 'string'
			},{
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
				name : 'type',
				type : 'string'			    
			}
            ,{name : 'createMan', type : 'string'}
            ,{name : 'createUnit', type : 'string'}
            ,{name : 'finishMark', type : 'string'}
            ,{name : 'dataSource', type : 'string'}
            ,{name : 'judgmentFlag',type : 'string'}
			,{name : 'joinUnit' ,type : 'string'}
			,{name : 'special' ,type : 'string'}
	];

	if(edit_flagLayout ==''){
	   whereSql = " judgmentFlag='noBody'" +" and " +viewSql ;
	}else{
	   whereSql = " judgmentFlag='body' and conid='"+selectConid+"'";
	}
	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					// params: "conid='"+edit_conid+"'"
					params : whereSql   //默认根据电建公司过滤数据，条件在wz.cont.tree.js中获取
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
    
    function doPrint(){
        var fileid = "";
        var fileName = "";
        var finished = "";
        var uids = "";
        var modetype = "NewCL";
        var record = sm.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
            fileid = record.get("fileid");
            fileName = record.get("warehouseNo");
            finished = record.get("finished");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        //var filePrintType = "WzGoodsStoreinView";
        //主体材料入库模板打印
        var filePrintType = "WzBodysInPrintView";
        var hasfile = false;
        //fileid为空，则打开模板，否则直接打开已经打印保存过的文件
        if(fileid == null || fileid == ""){
            var sql = "select t.fileid,t.filename from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
            DWREngine.setAsync(false);
            baseMgm.getData(sql,function(str){
                fileid = str[0][0];
                fileName = fileName +"-"+ str[0][1]
            });
            DWREngine.setAsync(true);
        }else{
            hasfile = true;
        }
        if(fileid == null || fileid == ""){
            Ext.MessageBox.alert("文档打印错误","文档打印模板不存在，请先在系统管理中添加！");
            return;
        }else{
            var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid="+fileid;
            docUrl += "&filetype="+filePrintType;
            docUrl += "&uids="+uids;
            docUrl += "&modetype="+modetype;
            docUrl += "&beanname="+bean;
            docUrl += "&fileid="+fileid;
            docUrl += "&save="+((finished=="1")?false:true);
            docUrl += "&hasfile="+hasfile;
            docUrl += "&fileName="+fileName;
            docUrl = encodeURI(docUrl);
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
            ds.reload();
        }
    }
  
    var cmArraySub = [['selectAll','全部']];
    var cmHideSub = new Array();
    
   	var store1Sub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArraySub
	}); 
	
    var chooseRowSub = new Ext.form.MultiSelect({
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

	//TODO 主体设备新增冲回入库功能 yanglh 2013-11-19
	var backBtn = new Ext.Button({
		id : 'back',
		text : '冲回入库',
		iconCls : 'btn',
		handler : backFn
	})
    //查询功能菜单
	var fileMenu = new Ext.menu.Menu({
			id : 'CKBtn',
			shadow : "drop",
			allowOtherMenus : true,
			items : [
				new Ext.menu.Item({
					id : 'queryAll',
					text : "查询所有",
					iconCls : 'btn',
					handler : onMunuItem
				}),
				new Ext.menu.Item({
					id : 'ZGRK',
					text : "暂估入库",
					iconCls : 'btn',
					handler : onMunuItem
				}), new Ext.menu.Item({
					id : 'CHZG',
					text : "冲回入库",
					iconCls : 'btn',
					handler : onMunuItem
				}), new Ext.menu.Item({
					id : 'RK',
					text : "正式入库",
					iconCls : 'btn',
					handler : onMunuItem
				})]
		});

	function onMunuItem(btn){
		var where = '';
		if(btn.id == "ZGRK"){
			where = " type='暂估入库' ";
		}else if(btn.id == "CHZG"){
			where = " type='冲回入库'";
		}else if(btn.id == "RK"){
			where = " type='正式入库'";
		}else{
		   where = " 1=1 ";
		}
		ds.baseParams.params = where + " and " + whereSql;
		ds.load({params : {start : 0,limit : PAGE_SIZE}})
	}
		//新增冲回入库功能
	var queryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		iconCls : 'btn',
		menu : fileMenu
	});
//TODO非主体设备冲回入库功能
	var backSbBtn = new Ext.Button({
		id : 'backSb',
		text : '冲回入库',
		iconCls : 'btn',
		handler : backSbFn
	})	
	var tabArr = "";
	if(edit_flagLayout !=''){
		rabArr = ['<font color=#15428b><B>入库单信息<B></font>', '-', addBtn, '-', editBtn,
					 '-', delBtn, '-', printBtn,'-',backBtn,'-',queryBtn,'->',chooseRow];
	}else{
		rabArr = ['<font color=#15428b><B>入库单信息<B></font>', '-', addBtn, '-', editBtn,
					 '-', delBtn, '-', printBtn,'-',backSbBtn,'->',chooseRow];	
	}

	var gridPanel = new Ext.grid.GridPanel({
				ds : ds,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : rabArr,
				header : false,
				border : false,
				height : document.body.clientHeight * 0.5,
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
			'amountRate' : {
		    	        id : 'amountRate',
		                name : 'amountRate',
		                fieldLabel : '金额税率',
		                mode : 'local',
						editable:false,
						valueField: 'k',
						displayField: 'v',
						readOnly:true,
			            listWidth: 80,
			            lazyRender:true,
			            triggerAction: 'all',
			            store : amountRateStore,
						//tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			            listClass: 'x-combo-list-small'
					     },
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
			'memo' : {name : 'memo',fieldLabel : '备注',xtype: 'htmleditor',anchor:'95%',height: 80,width: 800},
			'jzNo' : {name : 'jzNo', fieldLabel : '机组号'}
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

	var smSub = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cmSub = new Ext.grid.ColumnModel([
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
			}, {
				id : 'jzNo',
				header : fcSub['jzNo'].fieldLabel,
				dataIndex : fcSub['jzNo'].name,
				align : 'center',
				width : 80,
				renderer : function(v){
					for (var i=0; i<jzNoArr.length; i++){
						if (v == jzNoArr[i][0]){
							return jzNoArr[i][1];
						}
					}
				}
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
                renderer : function(v,m,r){
                    return v;
                },
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
				id : 'amountRate',
				header : fcSub['amountRate'].fieldLabel,
				dataIndex : fcSub['amountRate'].name,
				align : 'right',
				//hidden : edit_flag,
				//editor : new fm.ComboBox(fcIntoSub['amountRate']),
				renderer : function(v,m,r){
					var str = '';
					if(v && v != null){
						for(var i=0;i<amountRateArr.length;i++){
							if(v == amountRateArr[i][0]){
								str = amountRateArr[i][1];
							}
						}
					}
					return str;
				},
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
						if(v == equWareArr[i][0])
							equno = equWareArr[i][3]+" - "+equWareArr[i][1];
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
			{name:'amountRate', type:'string'},
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
			{name:'totalnum', type:'float'},
			{name:'jzNo', type:'string'}
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
				amountRate:'',
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
			
	sm.on("rowselect", function() {
		var record = gridPanel.getSelectionModel().getSelected();
		if (record == null || record == '') return;
		if(edit_flagLayout != ''){
				//权限控制
				if(ModuleLVL>=3){
					    backSbBtn.setDisabled(true);
					    addBtn.setDisabled(true);
					    editBtn.setDisabled(true);
						delBtn.setDisabled(true);
				}else{
					if (record.get("finished") == '1') {
						editBtn.setDisabled(true);
						delBtn.setDisabled(true);
						saveBtn.setDisabled(true);
			            printBtn.setDisabled(false);
			            backSbBtn.setDisabled(false);
					} else {
						editBtn.setDisabled(false);
						delBtn.setDisabled(false);
						saveBtn.setDisabled(false);
			            printBtn.setDisabled(false);
			            backSbBtn.setDisabled(true);
					}					
				}			
		}else{
			if(ModuleLVL>=3){
				 		backSbBtn.setDisabled(true);
					    addBtn.setDisabled(true);
					    editBtn.setDisabled(true);
						delBtn.setDisabled(true);
				}else{
			        if(record.get('createMan') == USERID){
						if (record.get("finished") == '1') {
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
							saveBtn.setDisabled(true);
				            printBtn.setDisabled(false);
				            backSbBtn.setDisabled(false);
						} else {
							editBtn.setDisabled(false);
							delBtn.setDisabled(false);
							saveBtn.setDisabled(false);
				            printBtn.setDisabled(false);
				            backSbBtn.setDisabled(true);
						}
						dsSub.baseParams.params = "sbrk_uids='"
								                + record.get("uids") + "' and pid='"
								                + record.get("pid") + "'";
						dsSub.load({params : {start : 0,limit : PAGE_SIZE}});
			        }else{
			            editBtn.setDisabled(true);
			            delBtn.setDisabled(true);
			            saveBtn.setDisabled(true);
			        }				
				}
	    }
	    
		if(record.get("type") == "暂估入库"){
			if((record.get("finishMark")!=1)&&(record.get("finished") == 1)){
				backBtn.setDisabled(false);
			}else{
				backBtn.setDisabled(true);
			}
		}else{
			backBtn.setDisabled(true);
		}
	   dsSub.baseParams.params = "sbrk_uids='"
					                + record.get("uids") + "' and pid='"
					                + record.get("pid") + "'";
	   dsSub.load({params : {start : 0,limit : PAGE_SIZE}});
	})
		//权限控制
	if(ModuleLVL>=3){
		    addBtn.setDisabled(true);
		    editBtn.setDisabled(true);
			delBtn.setDisabled(true);
	}else{
		if(competenceFlag==true){
           addBtn.setDisabled(false);
	    }else{
	       addBtn.setDisabled(true);
	     }
		if(edit_flagLayout != ''){
	        addBtn.setDisabled(false);
	     }
	}
    
     
	treePanel.on('click', function() {
				dsSub.baseParams.params = "1=2";
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
		gridPanelSub.defaultSaveHandler();
	}

	function addOrUpdateFun(btn) {
		if(selectParentid == '0'){
				Ext.example.msg('提示信息','请选择该分类下的合同！');
		    	return ;		
		}
		var record = sm.getSelected();
		var url = BASE_PATH
				+ "Business/wzgl/baseinfo_wzgl/wz.into.warehousing.addorupdata.jsp";
		if (btn.id == 'addBtn') {
			    if(edit_flagLayout==''){
					if (selectUuid == "" || selectConid == "") {
						Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
						return;
					}
					if (selectTreeid.indexOf("04") == 0) {
						Ext.example.msg('提示信息', '技术资料分类下不能添加入库通知单！');
						return;
					}
			    }
			    if(edit_flagLayout!=''){
//					Ext.MessageBox.confirm('确认', '是否通过【<font style="color:red;">暂估入库</font>】选择？', function(btn,text){
//					     if(btn=='yes'){
//		                      url = BASE_PATH
//						          + "Business/wzgl/baseinfo_wzgl/wz.back.into.warehousing.estimate.jsp";
//					          url += "?conid=" + selectConid + "&treeuids=" + selectConid+"&edit_flag=zgrk"+"&flagLayout="+edit_flagLayout
//					          windowShow(url);
//					      }else{
								url += "?conid=" + selectConid + "&treeuids=" + selectConid
										+ "&treeid=" + selectConid+"&flagLayout="+edit_flagLayout;
								windowShow(url);
//							}
//					 })
			    }else{
					url += "?conid=" + selectConid + "&treeuids=" + selectConid
							+ "&treeid=" + selectConid+"&flagLayout="+edit_flagLayout;
					windowShow(url);
				}
		} else if (btn.id == 'updataBtn') {
			//在修改页面显示剩余库存数量
			var showFlag = 'hide';
			if(record.data.warehouseNo.indexOf("-CHRK-") != -1){
				showFlag = 'show';
			}
			if (record == null || record == "") {
				Ext.example.msg('提示信息', '请选择您要修改的入库单记录！');
				return;
			}
			var banFlag = record.data.abnormalOrNo;
			url += "?conid=" + record.data.conid + "&treeuids="
					+ record.data.treeUids + "&uids=" + record.data.uids
					+ "&banFlag=" + banFlag+"&flagLayout="+edit_flagLayout+"&showFlag="+showFlag;
			windowShow(url);		
		}
	}

	function windowShow(url) {
		selectWin = new Ext.Window({
			width : document.body.clientWidth-20,
			height : document.body.clientHeight-20,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			closable : false,
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
		if (finished == null) {
			Ext.example.msg('提示信息', '请先选择要删除的记录！');
			return;
		} else if (finished == '1') {
			delBtn.setDisabled(true);
			return;
		} else {
			Ext.Msg.confirm("信息提示", "删除后不能恢复，是否要删除", function(btn) {
						if (btn == 'yes') {
							var uids = record.get("uids");
							gridPanel.getEl().mask("loading...");
							DWREngine.setAsync(false);
							wzbaseinfoMgm.delWzRkGoodsStorein(uids, flag, pid,
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
//						if(billstate == 0){
//						   downloadStr="附件["+count+"]";
//						   editable = false;
//						}else{
						   downloadStr="附件["+count+"]";
						    editable = true;
//						}
					    if(!(record.get('createMan') == USERID)){
		                            editable = false;
		                }						    
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}

		//TODO 冲回功能实现，yanglh 2013-11-19
		function backFn(){
		    var record = sm.getSelected();
			if(record == null){
				Ext.example.msg("系统提示","请选择暂估入库记录！");
				return;
			}
		    var obj=new Object();//用于新增入库单
		    if(record.get('type') == '暂估入库' && record.get('finished') == 1){
		    	Ext.MessageBox.confirm('系统提示','是否对该记录进行冲回？',function(btn){
		    		if(btn == 'yes'){
						gridPanel.getEl().mask("loading...");
		    			var warehouseNos = [record.get('warehouseNo').replace("-ZGRK-","-CHZG-"),record.get('warehouseNo').replace("-ZGRK-","-RK-")];
		    			var typeArrS = ['冲回入库','正式入库'];
		    			obj = {
							uids :'',
							pid : record.get('pid'),
							conid : record.get('conid'),
							treeUids : record.get('treeUids'),
							finished : record.get('finished'),
							warehouseNo : record.get('warehouseNo'),
							warehouseDate : record.get('warehouseDate'),
							noticeNo : record.get('noticeNo'),
							warehouseMan : record.get('warehouseMan'),
							makeMan : record.get('makeMan'),
							supplyunit : record.get('supplyunit'),
							judgmentFlag : record.get('judgmentFlag'),
							invoiceno : record.get('invoiceno'),
							joinUnit : record.get('joinUnit'),
 							equid : record.get('equid'),
							fileid : record.get('fileid'),
							remark  : record.get('remark'),
							abnormalOrNo : record.get('abnormalOrNo'),
							openBoxId : record.get('openBoxId'),
							warehouseZgrkNo : record.get('warehouseZgrkNo'),
							warehouseBackNo : record.get('warehouseBackNo'),
							type : record.get('type'),
							createMan : USERID,
							createUnit : USERDEPTID,
							createMan : record.get('createMan'), 
							createUnit : record.get('createUnit'),
							dataSource : record.get('uids'),
							finishMark : '',
							special : record.get('special')							
	    			}
	    			var count = 0;
	    			var newRkNo = "";
			        //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
			        var prefix = "";
			        var sql = "select warenocode from equ_warehouse where EQUID='"+record.get('equid')+"' and  pid='" + CURRENTAPPID+"'";
			        DWREngine.setAsync(false);
			        baseMgm.getData(sql, function(str){
			            prefix = str+"";
			        });
			        DWREngine.setAsync(true);
			        var current_year=(new Date().getFullYear()+"").substring(2);
					var current_month = (new Date().getMonth()+101+"").substring(1);
	    			for (var i = 0; i < typeArrS.length; i++) {
	    				if(typeArrS[i] == '冲回入库'){
	    					newRkNo = prefix+"-"+current_year+"-"+current_month+"-CHRK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"warehouse_no","Wz_Goods_Storein",null,"judgment_flag='body'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.warehouseNo = newRkNo;
	    					obj.type = '冲回入库';
	    					obj.finished = 1;
	    				}else if(typeArrS[i] == '正式入库'){
	    					obj.type = '正式入库';
	    					obj.finished = 0;
					        var conno;//财务合同编码
							DWREngine.setAsync(false);
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", record.get('conid'),function(obj){
							    conno = obj.conno;
							});
							DWREngine.setAsync(true);
	    					newRkNo = prefix+"-"+current_year+"-"+current_month+"-ZSRK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"warehouse_no","Wz_Goods_Storein",null,"judgment_flag='body'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.warehouseNo = newRkNo;
	    				}
						DWREngine.setAsync(false);
						wzbaseinfoMgm.zgrkInsertChrkAndZsrkWz(record.get('uids'), obj,function(str) {
							if(str == 'success'){
								count ++;
							}
						});
						DWREngine.setAsync(true);
					}
					gridPanel.getEl().unmask();
					if(count == 2){
						ds.reload();
						var updateSql = "update Wz_Goods_Storein set finish_mark='1' , finished_user='"+USERID+"'  where  uids='"+record.get('uids')+"'";
						DWREngine.setAsync(false);
						baseDao.updateBySQL(updateSql);
						DWREngine.setAsync(false);
						Ext.example.msg("系统提示", "冲回操作成功！");
					}
	    		}else{
	    			return;
	    		}
	    	})
	    }
	}
	
	//TODO非主体设备冲回入库 yanlg 2013-12-20
	function backSbFn(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg("系统提示","请选您要冲回入库的记录！");
			return false;
		}
		var str = record.data.warehouseNo;
		if(str.indexOf("-CHRK-") != -1){
			Ext.example.msg("系统提示","该数据是冲回的数据，不能再次冲回！");
			return false;
		}
		var strArr = str.split("-");
		Ext.Msg.confirm("信息提示", "冲回后数据不可恢复，是否要冲回？", function(btn) {
			if(btn == 'yes'){
				var newRkNo = '';
				var value = '-';
				var str = record.data.warehouseNo.replace("-RK-","-CHRK-");
				var strArr = str.split("-");
				for(var i = 1; i < strArr.length-1; i ++){
					value += strArr[i]+"-";
				}
				DWREngine.setAsync(false);
				equMgm.getEquNewDhNoToSb(CURRENTAPPID,value,"warehouse_no","wz_goods_storein",null,"judgment_flag='noBody'",function(str){
					newRkNo = strArr[0]+str;
				});
				DWREngine.setAsync(true);
				DWREngine.setAsync(false);
				wzbaseinfoMgm.wzGoodsStoreinBack(record.data.uids,newRkNo,function(str){
					if(str == 'success'){
						Ext.example.msg('信息提示','冲回数据成功！');
						ds.reload();
						return true;
					}else{
						Ext.example.msg('信息提示','冲回数据失败！')
						ds.reload();
						return false;
					}
				});
				DWREngine.setAsync(true);
				return true;
			}else{
				sm.clearSelections();
				return false;
			}
			
		})
	}
})

function finishOpenbox(uids, userID, exceOr, typeS, warehouseNo, finished) {
	var flag = "";
	var record = sm.getSelected();

	if (edit_flagLayout == '') {
		flag = 'noBody';
		// 对冲回的数据进行判断，如果冲回后库存数量小于0，不允许冲回
		if (warehouseNo.indexOf("-CHRK-") != -1) {
			var str = '';
			DWREngine.setAsync(false);
			wzbaseinfoMgm.judgmentSubIsSameStock(uids, function(num) {
						if (num == '1') {
							str = '1';// 表明有完结后有库存小于0的情况
						} else {
							str = '0';// 表明有完结后有库存没有小于0的情况
						}
					})
			DWREngine.setAsync(true);
			if (str == '1') {
				Ext.Msg.alert("信息提示", "完结之后库存数量小于0，请检查数量是否正确!");
				finished.checked = false;
				return false;
			}
		}
	} else {
		flag = 'body'
		finishFn(uids, exceOr, pid, flag, typeS, finished);
	}
}

//完结操作
function finishFn(uids, exceOr, pid, flag, typeS, finished) {
	Ext.MessageBox.confirm("信息提示", "完结后不可取消，不可编辑，确认要完结吗？", function(btn) {
		if (btn == 'yes') {
			DWREngine.setAsync(false);
			wzbaseinfoMgm.judgmentWzFinished(uids, exceOr, pid, flag, typeS,
					function(index) {
						if (index == '2') {
							Ext.example.msg('提示信息', '材料入库单中<br>【<font style="color:red;">'
													+ '材料入库详细信息</font>】数据未填写完整<br>请填写完整！');
							finished.checked = false;
						} else if (index == '3') {
							Ext.example.msg('提示信息', '材料入库单中<br>【<font style="color:red;">'
											+ '材料入库详细信息</font>】为空<br>不能完结！');
							finished.checked = false;
						} else if (index == '0') {
							Ext.example.msg('提示信息', '材料入库单完结操作成功！');
							finished.checked = true;
						} else if (index == '1') {
							Ext.example.msg('提示信息', '完结出错！');
							finished.checked = false;
						}
						if (selectUuid == null || selectUuid == "") {
							ds.baseParams.params = whereSql;
						} else {
							ds.baseParams.params = "conid='" + selectConid
									+ "' and pid='" + pid + "' and " + whereSql;
						}
						ds.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					})
			DWREngine.setAsync(true);
		} else {
			finished.checked = false;
			return;
		}
	})
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
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) and "+whereSql
			} 
		});
	});
}

