// 设备入库主页
var beanIntoFormal = "com.sgepit.pmis.equipment.hbm.EquGoodsStorein";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var selectWin;
var pid = CURRENTAPPID;
var dsIntoFormal;
var dsSubIntoFormal;
var saveBtn;
var intosContentPanel3;

var equWareArr = new Array();
var equTypeArr = new Array();
var partBs = new Array();
var joinUnitArr = new Array();
var allowedDocTypes = "xls,xlsx,doc,docx";

var fcInto;
var fcIntoSub
var gridPanelInto;
var gridPanelIntoSub;
var cmArrayInto = [['selectAll','全部']];
var cmHideInto = new Array();
var store1Into;
var chooseRowInto;

var cmArrayIntoSub = [['selectAll','全部']];
var cmHideIntoSub = new Array();
var store1IntoSub;
var chooseRowIntoSub;
var printIntoBtn;

var treeIds = ""
//判断当前用户是否是财务部
//var isFinance = (USERDEPTID == '102010105') ? true : false;
var businessType='zlMaterial';
var amountRateArr = new Array();
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
	appMgm.getCodeValue("金额税率", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					amountRateArr.push(temp);
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
    //点击树节点时查询树子节点
    var  treeSql = "select a.uids from (select t.* from equ_con_ove_tree_view t" +
    		" where t.conid = '"+edit_conid+"') a start with a.treeid =" +
    		" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+edit_treeUids+"'  " +
    		" and a.conid = '"+edit_conid+"') connect by PRIOR a.treeid = a.parentid"
    baseMgm.getData(treeSql,function(str){
        if(str.length ==1){
			treeIds = " and treeuids='"+str+"'";
        }else if(str.length>1){
			treeIds = " and treeuids in ("
			for (var i = 0; i < str.length; i++) {
				if (i == 0) {
					treeIds += "'" + str[i] + "'";
				} else {
					treeIds += ",'" + str[i] + "'";
				}
			}
			treeIds += ")";
        }
    });
	//主体设备参与单位
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

	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});
	//金额税率
	var amountRateStore  = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : amountRateArr
	});
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	// 处理设备类型下拉框
	var equTypeArrs = [['1', '主体设备'], ['2', '备品备件'], ['3', '专用工具']]
	var equTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equTypeArrs
			});

	var fm = Ext.form; // 包名简写（缩写）
	fcInto = {
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
			fieldLabel : '设备开箱主键'
		},
		'warehouseZgrkNo' : {
			name : 'warehouseZgrkNo',
			fieldLabel : '暂估入库单据号'		
		},
		'warehouseBackNo' : {
			name : 'warehouseBackNo',
			fieldLabel : '冲回入库单据号'		
		}, 
		'type' : {
		    name : 'type',
		    fieldLabel : '入库类型'
		}, 
		'dataType' : {
		    name : 'dataType',
		    fieldLabel : '数据类型'
		},
		'dataSource' : {
			name : 'dataSource',
			fieldLabel : '暂估入库冲回数据'
		},
		'recordUser' : {
			name : 'recordUser',
			fieldLabel : '创单人',
			width : 160		              
	    } ,
	    'createMan' : {
			name : 'createMan',
			fieldLabel : '创单人ID',
			width : 160		               
	    } ,
	    'createUnit' : {
			name : 'createUnit',
			fieldLabel : '填写单位',
			width : 160		               
	    },
	    'joinUnit' : {
			name : 'joinUnit',
			fieldLabel : '参与单位',
			readOnly : true,
			allowBlank : false,
			width : 160			    
	    },
	    'finishMark' : {
			name : 'finishMark',
			fieldLabel : '暂估入库冲回',
			width : 160		    	 
	    },
		'special' : {
			name : 'special',
			fieldLabel : '专业类别'
		}
	};

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([{
			id : 'uids',
			header : fcInto['uids'].fieldLabel,
			dataIndex : fcInto['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fcInto['pid'].fieldLabel,
			dataIndex : fcInto['pid'].name,
			hidden : true
		}, {
			id : 'conid',
			header : fcInto['conid'].fieldLabel,
			dataIndex : fcInto['conid'].name,
			hidden : true
		}, {
			id : 'treeuids',
			header : fcInto['treeuids'].fieldLabel,
			dataIndex : fcInto['treeuids'].name,
			hidden : true
		}, {
			id : 'openBoxId',
			header : fcInto['openBoxId'].fieldLabel,
			dataIndex : fcInto['openBoxId'].name,
			width : 0,
			hidden : true
		}, {
			id : 'finished',
			header : fcInto['finished'].fieldLabel,
			dataIndex : fcInto['finished'].name,
			renderer : function(v, m, r) {
				var o = r.get('finished');
				var abnormalOrNo = r.get('abnormalOrNo');
				var str = "<input type='checkbox' "
						+ (o == 1 ? "disabled title='已完结，不能取消完结' " : "") + " "
						+ (v == 1 ? "checked title='已完结' " : "title='未完结'")
						+ " onclick='finishOpenboxIntoFormal(\"" + r.get("uids") + "\",\""
						+ abnormalOrNo +"\",\""+ r.get("type") + "\",this)'>"
				return str;
			},
			width : 40
		}, {
			id : 'warehouseNo',
			header : fcInto['warehouseNo'].fieldLabel,
			dataIndex : fcInto['warehouseNo'].name,
			align : 'center',
			width : 200
		}, {
			id : 'warehouseZgrkNo',
			header : fcInto['warehouseZgrkNo'].fieldLabel,
			dataIndex : fcInto['warehouseZgrkNo'].name,
			align : 'center',
			hidden : true,
			width : 200	
		}, {
			id : 'warehouseBackNo',
			header : fcInto['warehouseBackNo'].fieldLabel,
			dataIndex : fcInto['warehouseBackNo'].name,
			align : 'center',
			hidden : true,
			width : 200	
		}, {
			id : 'warehouseDate',
			header : fcInto['warehouseDate'].fieldLabel,
			dataIndex : fcInto['warehouseDate'].name,
			align : 'center',
			renderer : formatDateTime,
			width : 100
		}, {
			id : 'noticeNo',
			header : fcInto['noticeNo'].fieldLabel,
			dataIndex : fcInto['noticeNo'].name,
			align : 'center',
			hidden : true,
			width : 250
		}, {
			id : 'supplyunit',
			header : fcInto['supplyunit'].fieldLabel,
			dataIndex : fcInto['supplyunit'].name,
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
			header : fcInto['invoiceno'].fieldLabel,
			dataIndex : fcInto['invoiceno'].name,
			align : 'center',
			width : 120
		}, {
			id : 'equid',
			header : fcInto['equid'].fieldLabel,
			dataIndex : fcInto['equid'].name,
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
		}, {
			id : 'special',
			header : fcInto['special'].fieldLabel,
			dataIndex : fcInto['special'].name,
			align : 'center',
			width : 80,
	        renderer : function(v){
	            for (var i = 0; i < specialArr.length; i++) {
	                if (v == specialArr[i][0])
	                    return specialArr[i][1];
	            }
	        }
	    }, {
	        id:'fileid',
	        header:fcInto['fileid'].fieldLabel,
	        dataIndex:fcInto['fileid'].name,
	        renderer : function(v,m,r){
	            if(v!=''){
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
	    },{
	        id : 'fileid',
	        header : '附件',
	        dataIndex : fcInto['fileid'].name,
	        renderer : filelistFn1,/**function(v,m,r){
	            if(v == null || v =="")
	                return "<a href='javascript:uploadTemplate(\""+r.data.uids+"\")' title='上传'>上传</a>";
	            else
	                return "<a href='javascript:viewTemplate(\""+v+"\")' title='查看'>查看</a>";
	        },**/
	        align : 'center',
	        width : 100
		}, {
			id : 'warehouseMan',
			header : fcInto['warehouseMan'].fieldLabel,
			dataIndex : fcInto['warehouseMan'].name,
			align : 'center',
			width : 0,
	        hidden : true
		}, {
			id : 'makeMan',
			header : fcInto['makeMan'].fieldLabel,
			dataIndex : fcInto['makeMan'].name,
			align : 'center',
			width : 0,
	        hidden : true
		}, {
			id : 'remark',
			header : fcInto['remark'].fieldLabel,
			dataIndex : fcInto['remark'].name,
			align : 'center',
			width : 0,
	        hidden : true
		}, {
			id : 'abnormalOrNo',
			header : fcInto['abnormalOrNo'].fieldLabel,
			dataIndex : fcInto['abnormalOrNo'].name,
			align : 'right',
			width : 0,
			hidden : true
		} , {
			id : 'type',
			header : fcInto['type'].fieldLabel,
			dataIndex : fcInto['type'].name,
			align : 'right',
			width : 0,
			hidden : false
		}, {
			id : 'dataType',
			header : fcInto['dataType'].fieldLabel,
			dataIndex : fcInto['dataType'].name,
			align : 'right',
			width : 0,
			hidden : true
		}, {
			id : 'dataSource',
			header : fcInto['dataSource'].fieldLabel,
			dataIndex : fcInto['dataSource'].name,
			align : 'center',
			hidden : true,
			width : 250
		},{
			id : 'recordUser',
			header : fcInto['recordUser'].fieldLabel,
			dataIndex : fcInto['recordUser'].name,
			align : 'center',
			hidden : true,
			width : 250
		}, {
			id : 'createMan',
			header : fcInto['createMan'].fieldLabel,
			dataIndex : fcInto['createMan'].name,
			align : 'center',
			hidden : true,
			width : 250
		}, {
			id : 'createUnit',
			header : fcInto['createUnit'].fieldLabel,
			dataIndex : fcInto['createUnit'].name,
			align : 'center',
			hidden : true,
			width : 250
		}, {
			id : 'joinUnit',
			header : fcInto['joinUnit'].fieldLabel,
			dataIndex : fcInto['joinUnit'].name,
			align : 'center',
			hidden : true,
	        renderer : function(v,m,r){
		        for(var i=0;i<joinUnitArr.length;i++){
		          if(v==joinUnitArr[i][0]){
		            return joinUnitArr[i][1];
		          }
		        }
	        },
			width : 250
		}, {
			id : 'finishMark',
			header : fcInto['finishMark'].fieldLabel,
			dataIndex : fcInto['finishMark'].name,
			align : 'center',
			hidden : true,
			width : 250
		}
	
	]);

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
			},{
				name : 'warehouseZgrkNo',
				type : 'string'			
			}, {
				name : 'warehouseBackNo',
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
			    name : 'type',
			    type : 'string'
			}, {
			    name : 'dataType',
			    type : 'string'
			}, {
				name : 'dataSource',
				type : 'string'
			},{
				name : 'recordUser',
				type : 'string'
			},{
				name : 'createMan',
				type : 'string'
			}, {
				name : 'createUnit',
				type : 'string'
			},{
				name : 'joinUnit',
				type : 'string'
			}, {
				name : 'finishMark',
				type : 'string'
			}, {
				name : 'special',
				type : 'string'
			}
		];

	dsIntoFormal = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanIntoFormal,
					business : business,
					method : listMethod,
					params: "dataType='"+DATA_TYPE+"' and conid='"+edit_conid+"'"+treeIds
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
	dsIntoFormal.setDefaultSort(orderColumn, 'asc');
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
            
    printIntoBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    function doPrint(){
        var fileid = "";
        var fileName = "";
        var finished = "";
        var uids = "";
        var modetype = "SB";
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
        //var filePrintType = "EquGoodsStoreinView";
        //主体设备入库模板打印
        var filePrintType = "EquBodysInPrintView";  
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
            docUrl += "&beanname="+beanIntoFormal;
            docUrl += "&fileid="+fileid;
            docUrl += "&save="+((finished=="1")?false:true);
            docUrl += "&hasfile="+hasfile;
            docUrl += "&fileName="+fileName;
            docUrl = encodeURI(docUrl);
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
            dsIntoFormal.reload();
        }
    }

  store1Into = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArrayInto
	}); 
   chooseRowInto = new Ext.form.MultiSelect({
         id:   'chooserow4',
         width:  150,
         store : store1Into,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelInto.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowInto.setValue(cmHideInto);
		            cmSelectById(colModel,cmHideInto);
		        }else{
		            this.selectAll();
		            cmSelectById(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowInto.setValue(this.getCheckedValue());
                cmSelectById(colModel,this.getCheckedValue());
		    }
		}
  });    
  
    function cmSelectById(colModel,str){
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
	//新增冲回入库功能
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
		dsIntoFormal.baseParams.params = where + " and dataType='"+DATA_TYPE+"' and conid='"+edit_conid+"'"+treeIds ;
		dsIntoFormal.load({params : {start : 0,limit : PAGE_SIZE}})
	}
	//新增冲回入库功能
	var queryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		iconCls : 'btn',
		menu : fileMenu
	})

	gridPanelInto = new Ext.grid.GridPanel({
				ds : dsIntoFormal,
				sm : sm,
				cm : cm,
				title : '入库清单',
				tbar : ['<font color=#15428b><B>入库单信息<B></font>', '-', addBtn, '-', editBtn,
						'-', delBtn, '-', printIntoBtn,'-',backBtn,'-',queryBtn,'->',chooseRowInto],
				enableHdMenu : false,		
				header : false,
				border : false,
				region : 'center',
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : dsIntoFormal,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	// TODO : ======入库通知单明细======
	fcIntoSub = {
			'uids' : {name : 'uids',fieldLabel : '主键'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'sbrkUids' : {name : 'sbrkUids' ,fieldLabel : '设备入库主表主键'},
			'boxSubId' : {name : 'boxSubId',fieldLabel : '设备开箱明细表主键'},
			'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
			'warehouseType' : {
				name : 'warehouseType',
				fieldLabel : '设备类型',
				readOnly: true,
				allowBlank : false,
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	           	triggerAction: 'all', 
	           	store: equTypeDs
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
                         
	        'stockno' : {name : 'stockno', fieldLabel : '存货编码', allowBlank : true},
	        'taxes' : {name : 'taxes', fieldLabel : '税金', allowBlank : true,decimalPrecision:2},
	        'totalnum' : {name : 'totalnum', fieldLabel : '合计', allowBlank : true,decimalPrecision:2},
			'memo' : {name : 'memo',fieldLabel : '备注',xtype: 'htmleditor',anchor:'95%',height: 80,width: 800},
			'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
		};

	var equnoComboBox = new fm.ComboBox(fcIntoSub['equno']);

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
				header : fcIntoSub['uids'].fieldLabel,
				dataIndex : fcIntoSub['uids'].name,
				hidden : true
			},{
				id : 'pid',
				header : fcIntoSub['pid'].fieldLabel,
				dataIndex : fcIntoSub['pid'].name,
				hidden : true
			},{
			    id : 'sbrkUids',
				header : fcIntoSub['sbrkUids'].fieldLabel,
				dataIndex : fcIntoSub['sbrkUids'].name,
				hidden : true//boxSubId
			},{
			    id : 'boxSubId',
				header : fcIntoSub['boxSubId'].fieldLabel,
				dataIndex : fcIntoSub['boxSubId'].name,
				hidden : true		
			},{
			    id : 'boxNo',
			    header : fcIntoSub['boxNo'].fieldLabel,
			    dataIndex : fcIntoSub['boxNo'].name,
			    align : 'right',
                hidden : true
			},{
				id : 'warehouseType',
				header : fcIntoSub['warehouseType'].fieldLabel,
				dataIndex : fcIntoSub['warehouseType'].name,
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
				header : fcIntoSub['warehouseName'].fieldLabel,
				dataIndex : fcIntoSub['warehouseName'].name,
			    align : 'center',
			    width : 200
			},{
				id : 'ggxh',
				header : fcIntoSub['ggxh'].fieldLabel,
				dataIndex : fcIntoSub['ggxh'].name,
				align : 'center',
				width : 100
			}, {
				id : 'jzNo',
				header : fcIntoSub['jzNo'].fieldLabel,
				dataIndex : fcIntoSub['jzNo'].name,
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
				header : fcIntoSub['unit'].fieldLabel,
				dataIndex : fcIntoSub['unit'].name,
			    align : 'center',
				width : 100
			},{
				id : 'inWarehouseNo',
				header : fcIntoSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcIntoSub['inWarehouseNo'].name,
				align : 'right',
				width : 80
			},{
				id : 'unitPrice',
				header : fcIntoSub['unitPrice'].fieldLabel,
				dataIndex : fcIntoSub['unitPrice'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'amountMoney',
				header : fcIntoSub['amountMoney'].fieldLabel,
				dataIndex : fcIntoSub['amountMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'freightMoney',
				header : fcIntoSub['freightMoney'].fieldLabel,
				dataIndex : fcIntoSub['freightMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'insuranceMoney',
				header : fcIntoSub['insuranceMoney'].fieldLabel,
				dataIndex : fcIntoSub['insuranceMoney'].name,
				align : 'right', 
				hidden : false,
				width : 80
			},{
				id : 'antherMoney',
				header : fcIntoSub['antherMoney'].fieldLabel,
				dataIndex : fcIntoSub['antherMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'intoMoney',
				header : fcIntoSub['intoMoney'].fieldLabel,
				dataIndex : fcIntoSub['intoMoney'].name,
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
				header : fcIntoSub['totalMoney'].fieldLabel,
				dataIndex : fcIntoSub['totalMoney'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'amountRate',
				header : fcIntoSub['amountRate'].fieldLabel,
				dataIndex : fcIntoSub['amountRate'].name,
				align : 'right',
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
				header : fcIntoSub['amountTax'].fieldLabel,
				dataIndex : fcIntoSub['amountTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'freightTax',
				header : fcIntoSub['freightTax'].fieldLabel,
				dataIndex : fcIntoSub['freightTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'insuranceTax',
				header : fcIntoSub['insuranceTax'].fieldLabel,
				dataIndex : fcIntoSub['insuranceTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'antherTax',
				header : fcIntoSub['antherTax'].fieldLabel,
				dataIndex : fcIntoSub['antherTax'].name,
				align : 'right',
				hidden : false,
				width : 80
			},{
				id : 'graphNo',
				header : fcIntoSub['graphNo'].fieldLabel,
				dataIndex : fcIntoSub['graphNo'].name,
				align : 'center',
				width : 100,
                hidden : true
			},{
				id : 'warehouseNum',
				header : fcIntoSub['warehouseNum'].fieldLabel,
				dataIndex : fcIntoSub['warehouseNum'].name,
				align : 'right',
				width : 80,
                hidden : true
			},{
			    id : 'weight',
			    header : fcIntoSub['weight'].fieldLabel,
				dataIndex : fcIntoSub['weight'].name,
				align : 'right',
				width : 80,
                hidden : true
            },{
                id : 'totalnum',
                header : fcIntoSub['totalnum'].fieldLabel,
                dataIndex : fcIntoSub['totalnum'].name,
                align : 'right',
                hidden : true,
                width : 80
            },{
                id : 'taxes',
                header : fcIntoSub['taxes'].fieldLabel,
                dataIndex : fcIntoSub['taxes'].name,
                renderer : function(v,m,r){
                    return v;
                },
                align : 'right',
                hidden :  false,
                width : 80
			}, {
				id : 'equno',
				header : fcIntoSub['equno'].fieldLabel,
				dataIndex : fcIntoSub['equno'].name,
				renderer : function(v,m,r){
			            var equid = "";
			            for (var i = 0; i < equWareArr.length; i++) {
			                if (v == equWareArr[i][0])
			                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
			            }
			            return equid;
			        },
			    width : 160,    
			    align : 'center'
			},{
                id : 'stockno',
                header : fcIntoSub['stockno'].fieldLabel,
                dataIndex : fcIntoSub['stockno'].name,
                align : 'center',
                width : 200
			},{
				id : 'memo',
				header : fcIntoSub['memo'].fieldLabel,
				dataIndex : fcIntoSub['memo'].name,
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

	dsSubIntoFormal = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSub,
					business : businessSub,
					method : listMethodSub,
					params : ' 1=2 ' //"sbrk_uids in (select uids from  EquGoodsStorein where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"'  and dataType='EQUBODY' )"
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
	dsSubIntoFormal.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列
	cmSub.defaultSortable = true;

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
				amountRate:'',
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

	saveBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
                hidden : true,
				handler : saveFun
			});
			
    store1IntoSub = new Ext.data.SimpleStore({  
	          fields : ['k', 'v'],  
	          data : cmArrayIntoSub
		});
		
   chooseRowIntoSub = new Ext.form.MultiSelect({
         id:   'chooserow5',
         width:  150,
         store : store1IntoSub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelIntoSub.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowIntoSub.setValue(cmHideIntoSub);
		            cmSelectByIdSub(colModel,cmHideInto);
		        }else{
		            this.selectAll();
		            cmSelectByIdSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowIntoSub.setValue(this.getCheckedValue());
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
	
  gridPanelIntoSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSubIntoFormal,
		cm : cmSub,
		sm : smSub,
		tbar : ['<font color=#15428b><B>入库单明细<B></font>', '-', saveBtn,'->',chooseRowIntoSub],
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
			store : dsSubIntoFormal,
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
    gridPanelIntoSub.on("aftersave",function(){
        dsSubIntoFormal.load({params:{start:0,limit:PAGE_SIZE}});
    });
   intosContentPanel3 = new Ext.Panel({
   	            id : 'intosContentPanel3',
				layout : 'border',
				region : 'center',
				items : [gridPanelInto, gridPanelIntoSub]
			});
	
    if(ModuleLVL>=3){
                 addBtn.setDisabled(true);
                 editBtn.setDisabled(true);
                 delBtn.setDisabled(true);
			}			
	sm.on("rowselect", function() {
				var record = gridPanelInto.getSelectionModel().getSelected();
				if (record == null || record == '') {
				} else {
					if(ModuleLVL>=3){
		                 addBtn.setDisabled(true);
		                 editBtn.setDisabled(true);
		                 delBtn.setDisabled(true);	 
						}else{
		                   if (record.get("finished") == '1') {
								editBtn.setDisabled(true);
								delBtn.setDisabled(true);
								saveBtn.setDisabled(true);
		                        printIntoBtn.setDisabled(false);
							} else {
								editBtn.setDisabled(false);
								delBtn.setDisabled(false);
								saveBtn.setDisabled(false);
		                        printIntoBtn.setDisabled(false);
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
					dsSubIntoFormal.baseParams.params = "sbrk_uids='"
							                + record.get("uids") + "' and pid='"
							                + record.get("pid") + "'";
					dsSubIntoFormal.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				}
				
			})

	treePanel.on('click', function() {
				dsSubIntoFormal.baseParams.params = "1=2";
				dsSubIntoFormal.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});

			});

	// -------------------function-------------------

	function saveFun() {
        var records = dsSubIntoFormal.getModifiedRecords();
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
		gridPanelIntoSub.defaultSaveHandler();
	}

	function addOrUpdateFun(btn) {
		var record = sm.getSelected();
		var url = BASE_PATH
//				+ "Business/equipment/equMgm/equ.into.warehousing.addorupdata.jsp";
		        +"Business/equipment/baseInfo/equbody/equ.bodys.into.warehousing.addorupdata.jsp";
		if (btn.id == 'addBtn') {
//			Ext.MessageBox.confirm('确认', '是否通过【<font style="color:red;">暂估入库</font>】选择？', function(btn,text){
//			     if(btn=='yes'){
//			     	
//                      url = BASE_PATH
//				          + "Business/equipment/baseInfo/equbody/equ.bodys.back.into.warehousing.estimate.jsp";
//			          url += "?conid=" + edit_conid + "&treeuids=" + edit_treeUids+"&edit_flag=zgrk&dataType="+DATA_TYPE;
//			          windowShow(url)
//			     }else{
					url += "?conid=" + edit_conid + "&treeuids=" + edit_treeUids
							+ "&treeid=" + selectTreeid+"&mark=markTrue&dataType="+DATA_TYPE;			     	
			        windowShow(url)
//			     }
//			})
		} else if (btn.id == 'updataBtn') {
			if (record == null || record == "") {
				Ext.example.msg('提示信息', '请选择您要修改的入库单记录！');
				return;
			}
			var banFlag = record.data.abnormalOrNo;
			url += "?conid=" + record.data.conid + "&treeuids="
					+ record.data.treeuids + "&uids=" + record.data.uids
					+ "&banFlag=" + banFlag+"&mark=markTrue&dataType="+DATA_TYPE;
			windowShow(url);		
		}
	}
    function windowShow(url){
    	selectWin = new Ext.Window({
    		closable : false,
			width : document.body.clientWidth-20,
			height : document.body.clientHeight-20,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function() {
					dsIntoFormal.reload();
					dsSubIntoFormal.reload();
					//正式入库显示更多数据显示
				    for(var o in fcInto){
				        var name = fcInto[o];
				        var temp = new Array();
				        temp.push(fcInto[o].name);
				        temp.push(fcInto[o].fieldLabel);
				        var colModel = gridPanelInto.getColumnModel();
				        //锁定列不在显示更多信息中出现
				        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcInto[o].name)){
					        cmArrayInto.push(temp);
					        if(!colModel.isHidden(colModel.getIndexById(o))){
					            cmHideInto.push(o)
					        }
				        }
				    }
				    store1Into.loadData(cmArrayInto)
					chooseRowInto.setValue(cmHideInto);
				    chooseRowInto.setRawValue("显示更多信息");
				    
				    for(var o in fcIntoSub){
				        var name = fcIntoSub[o];
				        var temp = new Array();
				        temp.push(fcIntoSub[o].name);
				        temp.push(fcIntoSub[o].fieldLabel);
				        var colModel = gridPanelIntoSub.getColumnModel();
				        //锁定列不在显示更多信息中出现
				        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcIntoSub[o].name)){
					        cmArrayIntoSub.push(temp);
					        if(!colModel.isHidden(colModel.getIndexById(o))){
					            cmHideIntoSub.push(o)
					        }
				        }
				    }
				    store1IntoSub.loadData(cmArrayIntoSub)
					chooseRowIntoSub.setValue(cmHideIntoSub);
				    chooseRowIntoSub.setRawValue("显示更多信息");
				     Ext.get("chooserow5").on("mouseout", function(){
				               if(chooseRowIntoSub.getValue()==""||chooseRowIntoSub.getValue()==null){
				                          chooseRowIntoSub.setValue(cmHideIntoSub);
				                          chooseRowIntoSub.setRawValue("显示更多信息"); 
				                    }     
				       }, this);
				    Ext.get("chooserow4").on("mouseout", function(){
				               if(chooseRowInto.getValue()==""||chooseRowInto.getValue()==null){
				                          chooseRowInto.setValue(cmHideInto);
				                          chooseRowInto.setRawValue("显示更多信息"); 
				                    }     
				       }, this);
				},
				'show' : function() {
					equArrival.location.href = url;
				}
			}
		});
		selectWin.show();
    }
 	function delFun() {
		var record = sm.getSelected();
        if (record == null || record == "") {
            Ext.example.msg('提示信息', '请先选择要删除的记录！');
            return;
        } else {
        	var flag = record.get("abnormalOrNo");
			Ext.Msg.confirm("信息提示", "删除后不能恢复，是否要删除", function(btn) {
						if (btn == 'yes') {
							var uids = record.get("uids");
							var getType = record.get("type");
							gridPanelInto.getEl().mask("loading...");
							DWREngine.setAsync(false);
							equMgm.delEquRkGoodsStorein(uids, flag, pid,
									function(text) {
										if (text == 'success') {
											Ext.example.msg('提示信息', '您删除了一条记录');
										} else {
											Ext.example.msg('提示信息', '删除失败');
										}
										dsIntoFormal.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
										dsSubIntoFormal.baseParams.params = "1=2";
										dsSubIntoFormal.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
									});
							DWREngine.setAsync(false);
							gridPanelInto.getEl().unmask();
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

	//TODO 冲回入库功能
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
					gridPanelInto.getEl().mask("loading...");
					var warehouseNos = [record.get('warehouseNo').replace("-ZGRK-","-CHZG-"),record.get('warehouseNo').replace("-ZGRK-","-RK-")];
					var typeArrS = ['冲回入库','正式入库'];
					obj = {
						uids : '',
						pid : record.get('pid'),
						conid : record.get('conid'),
						treeuids : record.get('treeuids'),
						finished : 0,
						warehouseNo : '',
						warehouseZgrkNo : record.get('warehouseZgrkNo'),
						warehouseBackNo : record.get('warehouseBackNo'),
						warehouseDate : new Date(),
						noticeNo : record.get('noticeNo'),
						warehouseMan : record.get('warehouseMan'),
						makeMan : record.get('makeMan'),
						remark : record.get('remark'),
						abnormalOrNo : record.get('abnormalOrNo'),
						openBoxId : record.get('openBoxId'),
						supplyunit : record.get('supplyunit'),
						invoiceno : record.get('invoiceno'),
						equid : record.get('equid'),
						fileid : record.get('fileid'),
						type : record.get('type'),
						dataType : record.get('dataType'),
						dataSource : record.get('uids'),
						createMan : record.get('createMan'),
						createUnit : record.get('createUnit'),
						recordUser : record.get('recordUser'),
						joinUnit : record.get('joinUnit'),
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
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,"data_type='EQUBODY'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.warehouseNo = newRkNo;
							obj.type = '冲回入库';
							obj.finished = 1;
						}else if(typeArrS[i] == '正式入库'){
							obj.type = '正式入库';
							obj.finished = 0;
						    var conno;//合同编码
							DWREngine.setAsync(false);
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", record.get('conid'),function(obj){
							    conno = obj.conno;
							});
							DWREngine.setAsync(true);
						    newRkNo = prefix+"-"+current_year+"-"+current_month+"-ZSRK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,"data_type='EQUBODY'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.warehouseNo = newRkNo;
						}
						DWREngine.setAsync(false);
						equMgm.zgrkInsertChrkAndZsrk(record.get('uids'), obj,function(str) {
							if(str == 'success'){
								count ++;
							}
						});
						DWREngine.setAsync(true);
					}
					gridPanelInto.getEl().unmask();
					if(count == 2){
						dsIntoFormal.reload();
						var updateSql = "update Equ_Goods_Storein set finish_mark='1' , finished_user='"+USERID+"'  where  uids='"+record.get('uids')+"'";
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
})

function finishOpenboxIntoFormal(uids, exceOr,typeS, finished) {
	var record =  gridPanelInto.getSelectionModel().getSelected();
	if(record == null || record == ""){
          Ext.example.msg('提示信息','请选择您要完结的入库单');
		  finished.checked = false;
		  return;
	}
	var getFileid = record.get("fileid");
	if(getFileid == null || getFileid == ""){
	    Ext.MessageBox.confirm('确认', '该入库单<span style="color:red;">Word文档</span>打印之后没有保存，是否完结?',function(btn){
	    	if(btn == "yes"){
	    	    finishFn(uids, exceOr, typeS, finished);
	    	}else{
	    	   finished.checked = false;
	    	   return;
	    	}
	    })
	}else{
		Ext.MessageBox.confirm('提示', '请确保数据无误和打印后再进行完结，确认要完结？',function(btn){
	    	if(btn == 'yes'){
	    		 finishFn(uids, exceOr,typeS,finished);
	    	}else{
	    		finished.checked = false;
				return;	
	    	}
	    });
	}
}

//完结操作
function finishFn(uids, exceOr,typeS,finished){
	DWREngine.setAsync(false);
	equMgm.judgmentFinished(uids, exceOr, pid,'body',typeS, function(index) {
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
		dsIntoFormal.reload()
	});
	DWREngine.setAsync(true);
}

//文档上传
function viewTemplate(fileid){
    window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid)
}

function uploadTemplate(uids) {
    var uploadForm = new Ext.form.FormPanel({
        baseCls : 'x-plain',
        labelWidth : 80,
        url : MAIN_SERVLET + "?ac=upload",
        fileUpload : true,
        defaultType : 'textfield',

        items : [{
            xtype : 'textfield',
            fieldLabel : '流水号',
            name : 'fileid1',
            readOnly : true,
            hidden : true,
            hideLabel : true,
            anchor : '90%' // anchor width by percentage
        }, {
            xtype : 'textfield',
            fieldLabel : '请选择文件',
            name : 'filename1',
            inputType : 'file',
            allowBlank : false,
            // blankText: 'File can\'t not empty.',
            anchor : '90%' // anchor width by percentage
        }]
    });

    var uploadWin = new Ext.Window({
        title : '上传',
        width : 450,
        height : 140,
        minWidth : 300,
        minHeight : 100,
        layout : 'fit',
        plain : true,
        bodyStyle : 'padding:5px;',
        buttonAlign : 'center',
        items : uploadForm,
        buttons : [{
            text : '上传',
            handler : function() {
                var filename = uploadForm.form.findField("filename1").getValue()
                if (filename != "") {
                    var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
                    if (allowedDocTypes.indexOf(fileExt) == -1) {
                        Ext.MessageBox.alert("提示", "请选择Office文档！");
                        return;
                    } else {
                        currentFileExt = fileExt
                    }
                }
                if (uploadForm.form.isValid()) {
                    Ext.MessageBox.show({
                        title : '请等待',
                        msg : '上传中...',
                        progressText : '',
                        width : 300,
                        progress : true,
                        closable : false,
                        animEl : 'loading'
                    });
                    uploadForm.getForm().submit({
                        method : 'POST',
                        params : {
                            ac : 'upload'
                        },
                        success : function(form, action) {
                            tip = Ext.QuickTips.getQuickTip();
                            tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;上传成功!','icon-success')
                            tip.show();
                            Ext.MessageBox.hide();
                            uploadWin.hide();
                            var rtn = action.result.msg;
                            var fileid = rtn[0].fileid;
                            var filename = rtn[0].filename;
                            //保存上传后的文档fileid
                            DWREngine.setAsync(false);
                            equMgm.saveFile(fileid,uids,beanIntoFormal,function(str){
                            });
                            DWREngine.setAsync(true);
                            dsIntoFormal.reload();
                        },
                        failure : function() {
                            Ext.example.msg('Error', 'File upload failure.');
                        }
                    })
                }
            }
        }, {
            text : '关闭',
            handler : function() {
                uploadWin.hide();
            }
        }]
    });
    uploadWin.show();
}
 //附件 
function filelistFn1(value, metadata, record){
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
	//if(billstate == 0){
	//downloadStr="附件["+count+"]";
	 //  editable = false;
	//}else{
	   downloadStr="附件["+count+"]";
	    editable = true;
	//}
	   if(!(record.get('createMan') == USERID)){
	                        editable = false;
	            }						    
	return '<div id="sidebar"><a href="javascript:showUploadWin1(\''
				+ businessType + '\', ' + editable + ', \''
				+ uidsStr
				+ '\', \''+'入库单附件'+'\')">' + downloadStr +'</a></div>'
		
}
//显示多附件的文件列表
function showUploadWin1(businessType, editable, businessId, winTitle) {
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
 	dsIntoFormal.reload();
	});
}
