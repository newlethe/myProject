var AUDIT_TYPE_EQU = "EQU";
var beanDetail = "com.sgepit.pmis.finalAccounts.interfaces.vo.EquStockOutDetailVO"
var businessDetail = "financialAuditService";
var listMethodDetail = "getEquStockOutDetail";

var orderColumnSub = "outno";
var selectedGgId ;
var sbId, sm;

	var userArray = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);

	var singleAuditBtn = new Ext.Button({
		id: 'single',
		text: '单独稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	
	var mergeAuditBtn = new Ext.Button({
		id: 'merge',
		text: '合并稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	
	var mergeToAuditBtn = new Ext.Button({
		id: 'mergeTo',
		text: '合并到稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	 
	var deleteAuditBtn = new Ext.Button({
		id: 'deleteAudit',
		text: '撤销稽核',
		iconCls: 'remove',
		handler: deleteAuditFun 
	});
	 
	var btnLook = new Ext.Button({
		text: '查看固定资产',
		iconCls: 'add',
		handler: lookAsset 
	});
	
 	var smSub =  new Ext.grid.CheckboxSelectionModel()   //  创建选择模式	
    var fmSub = Ext.form;			// 包名简写（缩写）

    var fcSub = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同主键' ,
			hidden:true,
			hideLabel:true
         },'outid': {
			name: 'outid',
			fieldLabel: '出库单主键' ,
			hidden: true,
			anchor:'95%'
         },'bdgid': {
			name: 'bdgid',
			fieldLabel: '设备的概算项目编号' ,
			hidden: true,
			anchor:'95%'
         },'auditId': {
			name: 'auditId',
			fieldLabel: '稽核主键' ,
			hidden: true,
			anchor:'95%'
         },'auditNo': {
			name: 'auditNo',
			fieldLabel: '稽核流水号' ,
			anchor:'95%'
         },'outno': {
			name: 'outno',
			fieldLabel: '出库单编号',
			anchor:'95%'
         },'applyUser': {
			name: 'applyUser',
			fieldLabel: '申请人',
			anchor:'95%'
         },'outDate': {
			name: 'outDate',
			fieldLabel: '出库日期',
			anchor:'95%'
         },'equId': {
			name: 'equId',
			fieldLabel: '设备主键',
			hidden:true,
			anchor:'95%'
         },'equCode': {
			name: 'equCode',
			fieldLabel: '设备编码',
			anchor:'95%'
         },'equName': {
			name: 'equName',
			fieldLabel: '设备名称',
			anchor:'95%'
         }, 'equSpec': {
			name: 'equSpec',
			fieldLabel: '规格型号', 
			anchor:'95%'
         }, 'equUnit': {
			name: 'equUnit',
			fieldLabel: '单位',
			anchor:'95%'
         },'equPrice': {
			name: 'equPrice',
			fieldLabel: '单价',
			anchor:'95%'
         },'equSupplyunit': {
			name: 'equSupplyunit',
			fieldLabel: '生产厂家',
			anchor:'95%'
         },'equNum': {
			name: 'equNum',
			fieldLabel: '出库数量',
			anchor:'95%'
         },'equAmount': {
			name: 'equAmount',
			fieldLabel: '设备金额',
			anchor:'95%'
         }
    }

    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	smSub, {
           id:'conid',
           header: fcSub['conid'].fieldLabel,
           dataIndex: fcSub['conid'].name,
           hidden: true
        },{
           id:'outid',
           header: fcSub['outid'].fieldLabel,
           dataIndex: fcSub['outid'].name,
           hidden: true
        },{
           id:'bdgid',
           header: fcSub['bdgid'].fieldLabel,
           dataIndex: fcSub['bdgid'].name,
           hidden: true
        },{
           id:'auditId',
           header: fcSub['auditId'].fieldLabel,
           dataIndex: fcSub['auditId'].name,
           hidden: true
        },{
           header: fcSub['auditNo'].fieldLabel,
           dataIndex: fcSub['auditNo'].name,
           width: 120  
        },{
           header: fcSub['outno'].fieldLabel,
           dataIndex: fcSub['outno'].name,
           width: 120  
        },{
           id:'applyUser',
           header: fcSub['applyUser'].fieldLabel,
           dataIndex: fcSub['applyUser'].name,
           renderer: function(value){
						for(var i = 0;i<userArray.length;i++){
							if(value == userArray[i][0]){
								return userArray[i][1]
							}
						}
					},
           width: 90
        },{
           id:'outDate',
           header: fcSub['outDate'].fieldLabel,
           dataIndex: fcSub['outDate'].name,
           renderer: formatDate,
           width: 90
        },{
           id:'equId',
           header: fcSub['equId'].fieldLabel,
           dataIndex: fcSub['equId'].name,
           hidden:true,
           width: 90
        },{
           id:'equCode',
           header: fcSub['equCode'].fieldLabel,
           dataIndex: fcSub['equCode'].name,
           width: 90
        },{
           id:'equName',
           header: fcSub['equName'].fieldLabel,
           dataIndex: fcSub['equName'].name,
           width: 90
        },{
           id:'equSpec',
           header: fcSub['equSpec'].fieldLabel,
           dataIndex: fcSub['equSpec'].name,
           width: 90
        },{
           id:'equUnit',
           header: fcSub['equUnit'].fieldLabel,
           dataIndex: fcSub['equUnit'].name,
           width: 90
        },{
           id:'equPrice',
           header: fcSub['equPrice'].fieldLabel,
           dataIndex: fcSub['equPrice'].name,
           width: 90
        },{
           header: fcSub['equSupplyunit'].fieldLabel,
           dataIndex: fcSub['equSupplyunit'].name,
           width: 70
        },{
           header: fcSub['equNum'].fieldLabel,
           dataIndex: fcSub['equNum'].name,
           width: 70
        },{
           header: fcSub['equAmount'].fieldLabel,
           dataIndex: fcSub['equAmount'].name,
           width: 70
        }
    ]);
    cmSub.defaultSortable = true;						//设置是否可排序

     // 3. 定义记录集
    var ColumnsSub = [
		{name: 'conid', type: 'string'},    	
		{name: 'outid', type: 'string'},    	
		{name: 'bdgid', type: 'string'},    	
		{name: 'auditId', type: 'string'},    	
		{name: 'auditNo', type: 'string'},    	
		{name: 'outno', type: 'string'},    	
		{name: 'applyUser', type: 'string'},    	
		{name: 'outDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},    	
		{name: 'equId', type: 'string' },
		{name: 'equCode', type: 'string' },
		{name: 'equName', type: 'string' },
		{name: 'equSpec', type: 'string' },
		{name: 'equUnit', type: 'string' },
		{name: 'equPrice', type: 'float' },
		{name: 'equSupplyunit', type: 'string'},
		{name: 'equNum', type: 'float'},
		{name: 'equAmount', type: 'float'}
	];
  
		// 4. 创建数据源
    var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanDetail,				
	    	business: businessDetail,
	    	method: listMethodDetail
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'asc');	

    // 5. 创建可编辑的grid: grid-panel
    var gridSub = new Ext.grid.GridPanel({
    	id: 'grid-panel',			//id,可选
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar: [singleAuditBtn, mergeAuditBtn, mergeToAuditBtn, '-', btnLook, '-', deleteAuditBtn],					//顶部工具栏，可选
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        split:true,
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
   });
   
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    //稽核
	function auditFun(btn){
		var recArr = gridSub.getSelectionModel().getSelections();
		if(recArr==null || recArr.length==0) {
			Ext.Msg.alert("提示", "请选择要稽核的设备！");
			return;
		}
		
		var mergeType = "N";
		if(btn.id=="merge") {
			mergeType = "M";
			if(recArr.length<2) {
				Ext.Msg.alert("提示", "合并稽核请选择至少两个设备！");
				return;
			}
		} else if (btn.id=="mergeTo") {
			mergeType = "MT";
		}
		
		var checkFlag = true;
		var sourceNos = "";
		var objectIds = "";
		
		var confirmDataArr = new Array();
		var dataArr = new Array();
		for (i=0; i<recArr.length; i++) {
			var rec = recArr[i];
			if(rec.data["auditNo"]!=null && rec.data["auditNo"].length>0) {
				checkFlag = false;
				break;
			}
			sourceNos += "`" + rec.data["outno"];
			objectIds += "`" + rec.data["equId"];
			dataArr.push(rec.data);
			
			var temp = rec.data;
			temp.equMainAmount = rec.data["equAmount"];
			if(i==0) {
				temp.isMain = "1";
			} else {
				temp.isMain = "0";
			}
			confirmDataArr.push(temp);
		}
		
		if(checkFlag) {
			if(sourceNos.length>0 && objectIds.length>0) {
				sourceNos = sourceNos.substring(1);
				objectIds = objectIds.substring(1);
				
				var master = new Object();
				master.sourceNos = sourceNos;
				master.objectIDs = objectIds;
				master.businessType = AUDIT_TYPE_EQU;
				master.operator = USERID;
				
				if(mergeType=="N") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/equAudit/fa.equ.audit.single.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
					if(rtn) {
						master.equStockOutDetailVOArr = Ext.decode(rtn);
						saveAuditDataFun(master, mergeType, "", "");
					}
				} else if (mergeType=="M") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/equAudit/fa.equ.audit.merge.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
					if(rtn) {
						master.equStockOutDetailVOArr = Ext.decode(rtn.data);
						saveAuditDataFun(master, mergeType, "", rtn.mainObjectId);
					}						
				} else if (mergeType=="MT") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/equAudit/fa.equ.audit.mergeTo.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
					if(rtn) {
						master.equStockOutDetailVOArr = Ext.decode(rtn.data);
						saveAuditDataFun(master, mergeType, rtn.mainAuditId, "");
					}						
				}
			}
		} else {
			Ext.Msg.alert("提示", "某些选中的设备已经稽核！");
		}
	}

//稽核信息保存	
	function saveAuditDataFun(master, mergeType, mainAuditId, mainObjectId) {
		master.pid = CURRENTAPPID;
		financialAuditService.auditAdd(master, mergeType, mainAuditId, mainObjectId, function(d) {
			if(d=="OK") {
				Ext.Msg.alert("提示", "选中的设备已经稽核！");
				dsSub.load({params:{start: 0,limit: PAGE_SIZE}});
			} else {
				Ext.Msg.alert("提示", "稽核失败，原因：" + d);
			}
		});
	}
    
	// 查看固定资产
	function lookAsset(){
		var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/equAudit/fa.equ.assets.main.jsp"
		var param = new Object();
		var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
	}
   	
   	//撤销稽核
	function deleteAuditFun(){
		var checkFlag = true;
		var recArr = gridSub.getSelectionModel().getSelections();
		var delAuditIds = "";
		
		for (i=0; i<recArr.length; i++) {
			var rec = recArr[i];
			if(rec.data["auditNo"]==null || rec.data["auditNo"].length==0) {
				checkFlag = false;
				break;
			}
			delAuditIds += "`" + rec.data["auditId"];
		}
		
		if(!checkFlag) {
			Ext.Msg.alert("提示", "请选择要撤销的稽核！");
			return;
		} 
		if (delAuditIds.length>0) {
			delAuditIds = delAuditIds.substring(1);
			Ext.Msg.confirm("确认", "确认稽核选中的设备？", function(btn) {
				if(btn=="yes") {
					financialAuditService.delAuditByIds(delAuditIds, function(d) {
						if(d=="OK") {
							Ext.Msg.alert("提示", "稽核撤销成功！");
							dsSub.load({params:{start: 0,limit: PAGE_SIZE}});
						}
					});
				}
			});
		}
	}
	
