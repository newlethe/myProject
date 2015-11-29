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

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";

//入库单明细相关信息
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSubView";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "warehouseDate";

var equTypeArr = new Array();
var equWareArr =  new Array();
var unitArr = new Array();
var getEquidstore = new Array();
var equidS = new Array();
var subjectAllnameArr = new Array();
var conPartybNoArr = new Array();
var formPanel;
var smOutSub;
var dsOutSub;
var quryButton;
var pid = CURRENTAPPID;
var thisBdgid,thisBdgno,thisBdgname;
var bdgArr = new Array();
var qcArr = new Array();
var useUnitArr = new Array();
var getFlag= "";
//if (USERDEPTID == '102010103') {// 工程部
//	getFlag = "write"
//} else {// 物资部
//	getFlag = "read"
//}

var selectOutSubFromInSubWin;
var updateEquid;//用于修改入库单时仓库号的判断
var oldWarehouseNo;//用于修改入库单仓库号时，入库单的判断，防止入库单号重复或变更
Ext.onReady(function(){
    
	DWREngine.setAsync(false);
	baseMgm.getData("select e.uids,e.kksno from equ_goods_qc e where pid='"+CURRENTAPPID+"'",function(list){
	 	for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            qcArr.push(temp);
	       }
	 });
	//处理设备仓库下拉框
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
	//出库单位
	appMgm.getCodeValue("主体设备参与单位",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].detailType);			
			unitArr.push(temp);			
		}
	});
	baseMgm.getData("select uids,equno from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	//TODO 把损坏赔偿加入到领料用途中去  yanglh 2013-11-22
	appMgm.getCodeValue("损坏赔偿",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName);			
			bdgArr.push(temp);			
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
	// 获取仓库号的仓库分类，用于判断仓库号子节点的判断
	baseMgm.getData("select equid from equ_warehouse where parent='01'", function(list) {
				for (var i = 0; i < list.length; i++) {
					if (list[i] != null && list[i] != "") {
						var temp = new Array();
						temp.push(list[i]);
						equidS.push(temp);
					}
				}
			})
	var subjectArr = new Array();// 财务科目
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
    baseMgm.getData("select t.treeid,t.subject_allname from FACOMP_FINANCE_SUBJECT t  where pid='" + CURRENTAPPID
                    + "' order by treeid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            subjectAllnameArr.push(temp);
        }
    })
    baseMgm.getData("select distinct q.cpid,q.partyb,t.conid from con_ove t,CON_PARTYB q " +
    		" where t.partybno= q.cpid ", function(list){
	           for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]);
		            temp.push(list[i][2]);
		            conPartybNoArr.push(temp);
	           }
	    });
	//领用单位 yanglh 2013-09-28
	appMgm.getCodeValue("设备出库领用单位",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);			
			useUnitArr.push(temp);			
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

	var qcStore = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : qcArr
    });
    // 设备仓库系统编码下来框
    var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArr
    });
	var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],
        data: equTypeArr
    });
    var unitDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],
        data: unitArr
    });
    var bdginfoDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: bdgArr
    });
    var conPartybNoDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: conPartybNoArr
    });
    var useUnitDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: useUnitArr
    });
    var typeArray = new Ext.data.SimpleStore({
    	fields: ['k','v'],   
        data: [['暂估出库','暂估出库'],['正式出库','正式出库']]
    });
    var fm = Ext.form;
    var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {
			name : 'outNo',
			readOnly : true,
			allowBlank : false,
			fieldLabel : '出库单号',
			width : 200
		},
		'outDate' : {
			id : 'outDate',
			name : 'outDate',
			fieldLabel : '出库日期',
			readOnly : true,
			width : 200,
			format: 'Y-m-d'
		},
		'recipientsUnit' : {
			name : 'recipientsUnit',
			fieldLabel : '出库单位',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank : false,
           	triggerAction: 'all', 
           	store: unitDs,
			width : 200
		},
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述',width : 160},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人',width : 160},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人',width : 160},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人',width : 160},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号',width : 160},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）',width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注',width : 160},
		'type' :  {name : 'type',fieldLabel : '出库类型',
		       		  readOnly : true,
		              width : 200,
					  valueField: 'k',
					  displayField: 'v',
					  mode: 'local',
		              typeAhead: true,
		           	  triggerAction: 'all', 
		           	  emptyText: '请选择...',
		           	  store: typeArray
		},
        'equid' : {name : 'equid', fieldLabel : '仓库号', allowBlank : false, width : 200},
        'using' : {
            name : 'using', 
            fieldLabel : '领料用途',
            triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBdgTreeWin,
            //allowBlank : getFlag == "write"?false:true,
            allowBlank : false,
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: bdginfoDs,
            readOnly : true,
            width : 200
        },
        'equname' : {name : 'equname',fieldLabel : '设备名称',  width : 160},
        'createMan' : {name : 'createMan',fieldLabel : '创单人ID',width : 100},
        'createUnit' : {name : 'createUnit',fieldLabel : '填写单位',width : 100},
        'dataType' : {name : 'dataType',fieldLabel : '数据类型',width : 100},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码',width : 160},
        'usingPart' : {name : 'usingPart',fieldLabel : '安装部位',width : 160},
        'financialSubjects' : {name : 'financialSubjects',fieldLabel : '对应财务科目',width : 200,
             readOnly: true,
             hidden : editBody!=""?false:true,
             hideLabel:editBody!=""?false:true,
             listeners : {
				focus : function(v) {
					if (v.getValue() == "" || v.getValue() == null) {
						if (!formPanel.getForm().findField('using').getValue())
							Ext.example.msg("信息提示：", "请选择领用用途！");
						return;
					}
				}
			}
		},
        'subjectAllname' : {
			name : 'subjectAllname',
			fieldLabel : '凭证财务科目',
			width : 160,
			hidden : editBody != "" ? false : true,
			hideLabel : editBody != "" ? false : true
		},
        'conPartybNo' : {name : 'conPartybNo', fieldLabel : '供货单位', width : 160},
        'useUnit' : {
			name : 'useUnit',
			fieldLabel : '领用单位',
			readOnly: true,
			allowBlank : false,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: useUnitDs,
			width : 200
		},
        'isOtherEqu' : {
             name : 'isOtherEqu',
             fieldLabel : '其他设备', 
             readOnly: true,
             valueField: 'k',
             displayField: 'v',
             mode: 'local',
             typeAhead: true,
             triggerAction: 'all', 
             value : '0',
             width : 200,
             store: new Ext.data.SimpleStore({
                fields : ['k', 'v'],
                data : [['1','是'],['0','否']]
             })
         }
	}
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		disabled : showFlag == 'show' ? true:false,
		handler : saveOut
	});
	var changePartBtn = new Ext.Button({
		id : 'changePartBtn',
		text : '更改部件',
		iconCls : 'btn',
		disabled  : showFlag == 'show' ? true:false,
//		hidden : typeof parent.tabPanelEs == 'undefined' ? true : false,
		handler : changePart
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function() {
			var recipientsUnit = '';
			var useUnit = "";
			var equid = '';
			var using = '';
			var str = "";
			var count = 0;
			var kksNo = 0;
			var suerPart = 0;
			var edit_uids1 = formPanel.getForm().findField('uids').getValue();
			DWREngine.setAsync(false);
			baseMgm.findById(beanOut, edit_uids1, function(obj) {
						recipientsUnit = obj.recipientsUnit;
						useUnit = obj.useUnit;
						equid = obj.equid;
						using = obj.using;
					})
			baseMgm.getData("select count(*),count(kks_No),count(use_parts) from Equ_Goods_Stock_Out_Sub where out_id='"
									+ edit_uids1 + "'", function(list) {
								if (list.length > 0) {
									count = list[0][0];
									kksNo = list[0][1];
									suerPart = list[0][2];
								}
							})
			DWREngine.setAsync(true);
//			if (USERDEPTID == '102010103') {
//				if ((kksNo < count) && (suerPart < count)) {
//					Ext.example.msg("信息提示：", "出库单明细中KKS编码或安装部位没有填写，请填写保存后关闭！");
//					return;
//				}
//			}
			if (useUnit == '' || useUnit == null) {
				str += "领用单位"
			}
			if (equid == '' || equid == null) {
				str += "，仓库号"
			}
			if (editBody != "") {
				if (using == '' || using == null) {
					str += "，领料用途"
				}
				if (recipientsUnit == '' || recipientsUnit == null) {
					str += "出库单位"
				}
			}
			if (str != "") {
				Ext.Msg.show({
							title : '提示',
							msg : '出库单数据不完整，是否关闭？',
							buttons : Ext.Msg.YESNO,
							icon : Ext.MessageBox.QUESTION,
							fn : function(value) {
								if ("yes" == value) {
									if (edit_mark == "markTrue") {
										parent.selectWin.hide();
									} else {
										parent.selectWin.hide();
									}
								} else {
									return;
								}
							}
						});
//				Ext.example.msg("信息提示：", '<span style="color:red;">【' + str
//								+ '】</span>' + '<br>等没有填写或填写后没有保存,<br>请填写、保存！');
//				return;
			} else {
				parent.selectWin.hide();
			}
		}
	});
	var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isInstallation', type : 'float'},
		{name : 'outNo', type : 'string'},
		{name : 'outDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'recipientsUnit', type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'},
        {name : 'equid',type : 'string'},
        {name : 'using',type : 'string'},
        {name : 'equname',type : 'string'},
        {name : 'createMan',type : 'string'},
        {name : 'createUnit',type : 'string'},
        {name : 'dataType',type : 'string'},
        {name : 'kksNo',type : 'string'},
        {name : 'usingPart',type : 'string'},
        {name : 'type',type:'string'},
        {name : 'financialSubjects',type : 'string'},
        {name : 'subjectAllname',type : 'string'},
        {name : 'conPartybNo', type : 'string'},
        {name : 'useUnit' ,type : 'string'},
        {name : 'isOtherEqu' ,type : 'string'}
	];
    
    
	var formRecord = Ext.data.Record.create(ColumnsOut);
	var loadFormRecord = null;
    DWREngine.setAsync(false);
		baseMgm.findById(beanOut, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
	DWREngine.setAsync(true);
    
    //新设备仓库分类树
    var wareTreeCombo = new Ext.ux.TreeCombo({
        //id : 'equid',
        //name : 'equid',
        fieldLabel : '仓库号',
        resizable:true,
        width:200,
        allowBlank : false,
        treeWidth : 230,
        loader:new Ext.tree.TreeLoader({
            url: MAIN_SERVLET,
            requestMethod: "GET",
            baseParams: {
                ac : "tree",
                treeName:"ckxxTreeNew",
                businessName:"equBaseInfo", 
                parent: '01',
                conid : edit_conid
            },
            clearOnLoad: true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
        root:  new Ext.tree.AsyncTreeNode({
            id : "01",
            text: "仓库信息",
            iconCls: 'form',
            expanded:true
        })
    });
    
    var conPartybNoComBo = new Ext.form.ComboBox({
    	     name : 'conPartybNo',
             fieldLabel : '供货单位', 
//             hidden : editBody!=""?false:true,
//             hideLabel:editBody!=""?false:true,
			 readOnly: true,
			 valueField: 'k',
			 displayField: 'v',
			 mode: 'local',
             typeAhead: true,
             disabled  : true,
           	 triggerAction: 'all', 
           	 store: conPartybNoDs,
			 width : 200})
    //Ext.apply(wareTreeCombo,fc['equid']);
    wareTreeCombo.getTree().on('beforeload',function(node){
        wareTreeCombo.getTree().loader.baseParams.parent = node.id; 
    });
    wareTreeCombo.on('select',function(tree, node){
	    if(node.id=='01'){
	        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
	        	   wareTreeCombo.setRawValue("");
	        	   return;
	        	}
        for(var j=0;j<equidS.length;j++){
             if(node.id ==equidS[j]){
        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
        	   wareTreeCombo.setRawValue("");
        	   return;              
             }
         }
    	var equid = "";
        for (var i = 0; i < equWareArr.length; i++) {
            if (node.id == equWareArr[i][1])
                equid = equWareArr[i][3]+" - "+equWareArr[i][2];
        }
        //this.setValue(node.id);
        formPanel.getForm().findField("equid").setValue(node.id);
        this.setRawValue(equid);
        wareTreeCombo.validate();
        if(editBody!=''){
            	 var newRkNo1 = "";
		        //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
		        var prefix1 = "";
		        var sql1 = "select warenocode from equ_warehouse where EQUID='"+node.id+"' and  pid='" + CURRENTAPPID+"'";
		        DWREngine.setAsync(false);
		        baseMgm.getData(sql1, function(str){
		            prefix1 = str+"";
		        });
		        DWREngine.setAsync(true);
		        var current_year=(new Date().getFullYear()+"").substring(2);
				var current_month = (new Date().getMonth()+101+"").substring(1);
				//处理入库检验单编号
		        if((formPanel.getForm().findField("type").getValue()=="暂估出库")){
		             newRkNo1 = prefix1+"-"+current_year+"-"+current_month+"-ZGCK-";
		        }else{
		             newRkNo1 = prefix1+"-"+current_year+"-"+current_month+"-ZSCK-";
		        }
				DWREngine.setAsync(false);
				equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo1,"out_No","equ_goods_stock_out",null,"data_type='EQUBODY'",function(str){
					newRkNo1 = str;
				});
//				equMgm.getEquNewDhNoToSbJn(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,"data_type='EQUBODY'",length,function(str){
//					newRkNo = str;
//				});
				DWREngine.setAsync(true);
				if(formPanel.getForm().findField("uids").getValue() == null || formPanel.getForm().findField("uids").getValue() == ""){//新增
					formPanel.getForm().findField("outNo").setValue(newRkNo1);
				}else{
					if(updateEquid==node.id){
						var strs = oldWarehouseNo.split('-');//oldWarehouseNo
						var str = prefix1;
						for(var i=1;i<strs.length;i++){
						    str +="-"+strs[i];
						}
			        	formPanel.getForm().findField("outNo").setValue(str);
					}else{
						formPanel.getForm().findField("outNo").setValue(newRkNo1);
					}
				}
            }
    });

    //生成概算树
    var rootText = "工程概算";
    
    var rootNew = new Ext.tree.AsyncTreeNode({
        text : rootText,
        iconCls : 'task-folder',
        expanded : true,
        id : '01'
    })
    var treeLoaderNew = new Ext.tree.TreeLoader({
        url : MAIN_SERVLET,
        baseParams : {
            ac : "columntree",
//            treeName : "equBdgTree",
            treeName : editBody != ""?"equBdgTreeCode":"equBdgTree",
            businessName : "equBaseInfo",
            bdgid : '0101,0102,0103,0104',
            parent : 0,
            codeName : '损坏赔偿'  //和属性代码中的损坏赔偿想对应 yanglh 2013-11-22
        },
        clearOnLoad : true,
        uiProviders : {
            'col' : Ext.tree.ColumnNodeUI
        }
    });

    var treePanelNew = new Ext.tree.ColumnTree({
        width : 550,
        header : false,
        border : false,
        lines : true,
        autoScroll : true,
        rootVisible : editBody != ""?false:true,
        listeners: {  
            /*
            // 监听beforenodedrop事件，主要就是在这里工作，拖动后处理数据 
            beforenodedrop: function(dropEvent){
                var node = dropEvent.target;    // 目标结点
                var data = dropEvent.data;      // 拖拽的数据
                if(data.node)return;
                if(!node.attributes.leaf)return;
                for(var i=0;i<data.selections.length;i++){
                    var record = data.selections[i];
                    record.set('bdgno',node.attributes.bdgno);
                    record.set('bdgid',node.attributes.bdgid);
                }
                grid.defaultSaveHandler();
            }
            */
        },
        columns : [{
            header : '概算名称',
            width : 380, // 隐藏字段
            dataIndex : 'bdgname'
        }, {
            header : '概算编号',
            width : 140,
            dataIndex : 'bdgno'
        }, {
            header : '概算主键',
            width : 0,
            dataIndex : 'bdgid'
        }, {
            header : '是否子节点',
            width : 0,
            dataIndex : 'isleaf'
        }, {
            header : '父节点',
            width : 0,
            dataIndex : 'parent'
        }],
        loader : treeLoaderNew,
        root : rootNew,
        //rootVisible : false,
        tbar : [
             {
                iconCls : 'icon-expand-all',
                tooltip : 'Expand All',
                text    : '全部展开',
                handler : function() {
                    rootNew.expand(true);
                }
            }, '-', {
                iconCls : 'icon-collapse-all',
                tooltip : 'Collapse All',
                text    : '全部收起',
                handler : function() {
                    rootNew.collapse(true);
                }
            }, '-', {
                text : '选择概算',
                iconCls : 'add',
                handler : function(){
                    if(thisBdgno == null || thisBdgno == "0" || thisBdgno == '02'){
                        Ext.example.msg('提示信息','请选择该分类下的子项！');
                        return false;
                    }
                    var form = formPanel.getForm();
					var	getBdgno = thisBdgno.substring(0, 2);//损坏赔偿中不需要处理 对应财务科目 yanglh 2013-11-22
					if(getBdgno == '02'){
						//前面截掉了pid部分，现在加上 pengy 2014-5-9
						form.findField('using').setValue(thisBdgid);
						form.findField('using').setRawValue(thisBdgname + "-" + thisBdgno);
						DWREngine.setAsync(false);
						baseMgm.getData("select subject_allname from FACOMP_FINANCE_SUBJECT where pid = '"+CURRENTAPPID+"' and subject_bm = '25208'", function(str) {
							if (str.length > 0) {
								form.findField('financialSubjects').setValue(str);
							} else {
								form.findField('financialSubjects').setValue("");
							}
						});
						DWREngine.setAsync(true);
						bdgTreeWin.hide();
						return;
					}
					var len = thisBdgno.length;
					if (len == 4) {
						form.findField('financialSubjects').setValue(thisBdgname + "-" + thisBdgname);
					} else if (len > 4 && len < 9) {
						var bdgidFour = thisBdgno.substring(0, 4);// 对应财务科目长度为4的父节点信息
						DWREngine.setAsync(false);
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno='" + bdgidFour + "'", function(str) {
									if (str.length > 0) {
										form.findField('financialSubjects').setValue(str + "-" + thisBdgname);
									}
								});
						DWREngine.setAsync(true);
					} else if (len > 8) {
						var bdgidFour = thisBdgno.substring(0, 4);// 对应财务科目长度为4的父节点信息
						var bdgidEight = thisBdgno.substring(0, 8);// 对应财务科目长度为8的父节点信息
						var nameF,nameE;
						DWREngine.setAsync(false);
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno ='" + bdgidFour + "'",function(str) {
									if (str.length > 0) {
										nameF = str;
									}
								});
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno ='" + bdgidEight + "'",function(str) {
									if (str.length > 0) {
										nameE = str;
									}
								});
						DWREngine.setAsync(true);
						if(nameF && nameE)
							form.findField('financialSubjects').setValue(nameF + "-" + nameE);
					}
					form.findField('using').setValue(thisBdgid);
					form.findField('using').setRawValue(thisBdgname + "-" + thisBdgno);
					bdgTreeWin.hide();
				}
			}]
		});

    treePanelNew.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = (editBody != ""?'0':'01');
        var baseParams = treePanelNew.loader.baseParams
        baseParams.parent = bdgid;
    })
    //点击的树不是叶子，则补选中，并展开
    treePanelNew.on('beforeclick', function(node,e){
//        if(!node.isLeaf()){
//            node.expand();
//            return false;
//        }
    });
    
    treePanelNew.on('click', function(node, e){
        var tempNode = node
        var isRootNode = (rootText == tempNode.text);
        thisBdgid = isRootNode  ? "0" : tempNode.attributes.bdgid;
        thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
        thisBdgname = isRootNode ? "0" : tempNode.attributes.bdgname;
    });
    
    var bdgTreeWin = new Ext.Window({
        id:'selectwin',
        title:'选择概算',
        width: 550,
        height: document.body.clientHeight*0.9,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [treePanelNew],
        listeners : {
            'show' : function(){
	            treePanelNew.render(); // 显示树
	            treePanelNew.expand();
            }
        }
    });
	
    function showBdgTreeWin(){
        bdgTreeWin.show();
    }
    var unitCom = new fm.ComboBox(fcOut['recipientsUnit']);
    
	// 凭证财务科目
	var subjectAllnameCombo = new Ext.ux.TreeCombo({
			name : 'subjectAllname',
			fieldLabel : '凭证财务科目',
			resizable : true,
			hidden : editBody!=""?false:true,
            hideLabel:editBody!=""?false:true,
			treeWidth : 200,
            width : 200,
			loader : new Ext.tree.TreeLoader({
						url : MAIN_SERVLET,
						requestMethod : "GET",
						baseParams : {
							ac : "tree",
							treeName : "subjectColumnTree",
							businessName : 'faBaseInfoService',
							parent : '01',
							pid : CURRENTAPPID
						},
						clearOnLoad : true,
						uiProviders : {
							'col' : Ext.tree.ColumnNodeUI
						}
					}),
			root : new Ext.tree.AsyncTreeNode({
						id : "01",
						text : "财务科目",
						iconCls : 'form',
						expanded : true
					})
		});

	subjectAllnameCombo.getTree().on('beforeload', function(node) {
				subjectAllnameCombo.getTree().loader.baseParams.parent = node.id;
			});

	subjectAllnameCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				var subjectAllnameText = "";
				for(var i=0;i<subjectAllnameArr.length;i++){
				    if(node.id==subjectAllnameArr[i][0]){
				       subjectAllnameText = subjectAllnameArr[i][1];
				       break;
				    }
				}
				this.setValue(node.id);
				this.setRawValue(subjectAllnameText);
			});    
    
	//主体设备出入库选择之后对出库单单号的处理
    if(editBody!=''){
	    unitCom.on('select',function(){
//	       var getStr = '';
////	       var sql = "select c.property_name from PROPERTY_CODE c  where c.TYPE_NAME = (" +
////	       		" select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀') and c.property_code = (" +
////	       		" select property_code from property_code where type_name = (select uids from property_type  " +
////	       		" where type_name='填写单位') and property_name='"+unitCom.getRawValue()+"')"
//           var sql = "select c.property_name from PROPERTY_CODE c " +
//                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//                " and c.property_code = '"+unitCom.getValue()+"' ";
//	       DWREngine.setAsync(false);
//	       baseMgm.getData(sql,function(str){
//	           if(str.length>0){
//	               getStr = str;
////	               formPanel.getForm().findField('outNo').setValue(str+"-"+newCkNo)
//	           }       
//	       })
//	       DWREngine.setAsync(true);
//	       getStr = (getStr+"")
//	       var length = getStr.length+1; 
//	       var conno='';
//		   DWREngine.setAsync(false);
//		   baseMgm.findById(beanCon, edit_conid, function(obj) {
//				conno = obj.conno;
//		   });
//		   DWREngine.setAsync(true);
//		   // 处理出库单号
//		   var newCkNo = "";
//		   if(typeComBox.getValue()=='暂估出库'){
//		       newCkNo  = "-" + conno.replace(/^\n+|\n+$/g,"") + "-ZGCK-";
//		   }else{
//		       newCkNo  = "-" + conno.replace(/^\n+|\n+$/g,"") + "-CK-";//prefix +"-"+
//		   }
//		  
//		   DWREngine.setAsync(false);
//		   equMgm.getEquNewDhNoToSbJn(CURRENTAPPID, newCkNo, "out_No",
//					"equ_goods_stock_out", null,"data_type='EQUBODY'",length, function(str) {
//						newCkNo = str;
//					});
//		   DWREngine.setAsync(true);
//		   var value = formPanel.getForm().findField('outNo').getValue();
//		   if(value == null || value == ""){
//			  formPanel.getForm().findField('outNo').setValue(getStr+newCkNo);
//		   }else{
////		      value = getStr+value.substring(2,value.length);
//		   	    var strs = value.split('-');
//				var str = getStr;
//				for(var i=1;i<strs.length;i++){
//				    str +="-"+strs[i];
//				}		   	
//		       formPanel.getForm().findField('outNo').setValue(str);
//		   }
	    })
    }

	var outRemindBtn = new Ext.Button({
		id : 'outRemind',
		text : USERDEPTID == '102010103' ? '反馈回物资部' : '出库提醒',// 工程部
		icon : CONTEXT_PATH + "/jsp/res/images/icon-no-group.gif",
		cls : "x-btn-text-icon",
		hidden : editBody != "" ? false : true,
		handler : function(){
			var rtn = window.showModalDialog(CONTEXT_PATH
							+ "/Business/equipment/equMgm/equ.goods.stock.out.remind.jsp?outId="
							+ edit_uids + "&type=equ", '',
					"dialogWidth:800px;dialogHeight:450px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		}
	})
	var  typeComBox  = new fm.ComboBox(fcOut['type']);
	
	typeComBox.on('select',function(node){
		var gatType = "";
		var getSubNum = 0;
		var getUids = formPanel.getForm().findField('uids').getValue();
		var getUnit = formPanel.getForm().findField('recipientsUnit').getValue();
		var getEquid = formPanel.getForm().findField("equid").getValue();
		var getOutNo = formPanel.getForm().findField('outNo').getValue();
		var sql = "select t.type ,(select count(OUT_NO) from EQU_GOODS_STOCK_OUT_SUB r " +
		 		" where r.OUT_ID = t.uids) as num, RECIPIENTS_UNIT, OUT_NO,equid from EQU_GOODS_STOCK_OUT t " +
		 		" where t.PID = '"+CURRENTAPPID+"' and t.uids = '"+getUids+"'"
		DWREngine.setAsync(false);
		baseMgm.getData(sql,function(list){
		        	if(list){
		        	    for(var i=0;i<list.length;i++){
		        	         gatType = list[i][0];
		        	         getSubNum = list[i][1];
		        	         getUnit = list[i][2];
		        	         getOutNo = list[i][3];
		        	         getEquid = list[i][4]
		        	    }
		        	}
		        })
		DWREngine.setAsync(true);
		if (typeComBox.getValue() != gatType) {
			if (getSubNum != 0) {
				typeComBox.setValue(gatType);
				Ext.MessageBox.alert("系统提示", "执行该操作要先删除该出库单所有的出库单明细，请先删除该出库单所有明细在执行此操作！")
				return;
			} else {
				unitCom.setValue("");
				formPanel.getForm().findField("outNo").setValue("");
				wareTreeCombo.setValue("");
				wareTreeCombo.setRawValue("");
			}
		}else{
			unitCom.setValue(gatType);
			formPanel.getForm().findField("recipientsUnit").setValue(getUnit);
			formPanel.getForm().findField("outNo").setValue(getOutNo);
			wareTreeCombo.setValue(getEquid);
			for (var i = 0; i < equWareArr.length; i++) {
                if (getEquid == equWareArr[i][2]){
                	wareTreeCombo.setRawValue(equWareArr[i][3]+" - "+equWareArr[i][1]);
                }
            }
		}	    
	})
	
	if(editBody!=""){
		formPanel = new Ext.FormPanel({
			id:"formOut",
			region : 'north',
			height : 135,
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:5px 10px;',
			tbar : view == 'view' ? ['<font color=#15428b><B>出库单信息<B></font>']
					: ['<font color=#15428b><B>出库单信息<B></font>','->',saveBtn,'-',cancelBtn],//,outRemindBtn,'-'
			items : [
				{
					layout : 'column',
					border : false,
					items : [
						{
						layout : 'form',
						columnWidth : .32,
						border : false,
						items : [
							new fm.Hidden(fcOut['uids']),
							new fm.Hidden(fcOut['pid']),
							new fm.Hidden(fcOut['conid']),
							new fm.Hidden(fcOut['treeuids']),
							new fm.Hidden(fcOut['finished']),
							new fm.Hidden(fcOut['isInstallation']),
							typeComBox,
							unitCom,
							wareTreeCombo,
							new fm.DateField(fcOut['outDate']),
							new fm.Hidden(fcOut['equname']),
							new fm.Hidden(fcOut['equid']),					
							new fm.Hidden(fcOut['grantDesc']),					
							new fm.Hidden(fcOut['handPerson']),
							new fm.Hidden(fcOut['createMan']),
							new fm.Hidden(fcOut['createUnit']),
							new fm.Hidden(fcOut['dataType']),
							new fm.Hidden(fcOut['remark'])
						]
					},{
						layout : 'form',
						columnWidth: .32,
						border : false,
						items : [
						         
						    new fm.ComboBox(fcOut['useUnit']),
	                        new fm.ComboBox(fcOut['using']),
	                        //wareTreeCombo,
	                        new fm.TextField(fcOut['outNo']),
	                        new fm.ComboBox(fcOut['isOtherEqu']),
							new fm.Hidden(fcOut['recipientsUser']),
							new fm.Hidden(fcOut['shipperNo']),
							//new fm.ComboBox(fcOut['recipientsUnit']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							new fm.Hidden(fcOut['proUse']),
							new fm.Hidden(fcOut['usingPart']),
							new fm.Hidden(fcOut['kksNo'])
						]
					}
					,{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
                            subjectAllnameCombo,
                            new fm.TextField(fcOut['financialSubjects']),
	                        conPartybNoComBo
						]
					}
					]
				}
			]
		});
	}else{
		unitCom = new fm.Hidden(fcOut['recipientsUnit']);
		formPanel = new Ext.FormPanel({
				id:"formOut",
				region : 'north',
				height : 115,
				border : false,
				labelAlign : 'right',
				bodyStyle : 'padding:5px 10px;',
				tbar : view == 'view' ? ['<font color=#15428b><B>出库单信息<B></font>']
						: ['<font color=#15428b><B>出库单信息<B></font>','->',outRemindBtn,'-',saveBtn,'-',cancelBtn],
				items : [
					{
						layout : 'column',
						border : false,
						items : [
							{
							layout : 'form',
							columnWidth : .5,
							border : false,
							items : [
								new fm.Hidden(fcOut['uids']),
								new fm.Hidden(fcOut['pid']),
								new fm.Hidden(fcOut['conid']),
								new fm.Hidden(fcOut['treeuids']),
								new fm.Hidden(fcOut['finished']),
								new fm.Hidden(fcOut['isInstallation']),
								new fm.Hidden(fcOut['type']),
								new fm.ComboBox(fcOut['useUnit']),
								new fm.TextField(fcOut['outNo']),
		                        wareTreeCombo,
		                        subjectAllnameCombo,
								new fm.Hidden(fcOut['equname']),
								new fm.Hidden(fcOut['equid']),					
								new fm.Hidden(fcOut['grantDesc']),					
								new fm.Hidden(fcOut['handPerson']),
								new fm.Hidden(fcOut['createMan']),
								new fm.Hidden(fcOut['createUnit']),
								new fm.Hidden(fcOut['dataType']),
								new fm.Hidden(fcOut['remark'])
							]
						},{
							layout : 'form',
							columnWidth: .5,
							border : false,
							items : [
								new fm.DateField(fcOut['outDate']),
		                        new fm.ComboBox(fcOut['using']),
		                        conPartybNoComBo,
		                        new fm.TextField(fcOut['financialSubjects']),
		                        unitCom,
								new fm.Hidden(fcOut['recipientsUser']),
								new fm.Hidden(fcOut['shipperNo']),
								//new fm.ComboBox(fcOut['recipientsUnit']),
								new fm.Hidden(fcOut['recipientsUnitManager']),
								new fm.Hidden(fcOut['proUse']),
								new fm.Hidden(fcOut['usingPart']),
								new fm.Hidden(fcOut['kksNo'])
							]
						}
			/*			,{
							layout : 'form',
							columnWidth: .33,
							border : false,
							items : [
		//						new fm.ComboBox(fcOut['recipientsUnit']),
								new fm.Hidden(fcOut['recipientsUnitManager']),
								new fm.Hidden(fcOut['proUse']),
								new fm.Hidden(fcOut['usingPart']),
								new fm.Hidden(fcOut['kksNo'])
							]
						}*/
						]
					}
				]
			});	
	}
	//针对工程部修改”安装部位“，‘KKS编码’，‘领料用途’做控制
//	if(USERDEPTID == '102010103'){
//		unitCom.setDisabled(true);
//		wareTreeCombo.setDisabled(true);
//		wareTreeCombo.getTree().on('beforeshow', function() {
//					return false;
//				})
//	}
    
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '物资编码'},
		'equType' : {name : 'equType',fieldLabel : '物资类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '物资名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量', decimalPrecision : 4,allowNegative :true},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'price' : {name : 'price', fieldLabel : '入库单价'+requiredMark, allowBlank : false},
		'amount' : {name : 'amount', fieldLabel : '出库金额'+requiredMark, allowBlank : false},
		'kcMoney' : {name : 'kcMoney', fieldLabel : '库存余额'},
		'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码',width : 160
		},
		'qcId' : {
			name : 'qcId', 
			fieldLabel : 'KKS编码(生产)',
			width : 200
		},
		'useParts' : {name : 'useParts',fieldLabel : '安装部位',width : 160,  allowBlank : false},
		'inNum' : {name : 'inNum',fieldLabel : '入库数量'},
		'inUids' : {name : 'inUids',fieldLabel : '入库单主键'},
		'inSubUids' : {name : 'inSubUids',fieldLabel : '入库明细主键'},
		'memo' : {name : 'memo',fieldLabel : '备注'},
		'equBoxNo' : {name: 'equBoxNo' ,fieldLabel : '箱件号',width : 100},
		'equSubUids' : {name: 'equSubUids' ,fieldLabel : '冲回来源',width : 100},
		'special' : {name : 'special',fieldLabel : '专业类别'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
	};

	smOutSub = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmOutSub = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcOutSub['uids'].fieldLabel,
			dataIndex : fcOutSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcOutSub['pid'].fieldLabel,
			dataIndex : fcOutSub['pid'].name,
			hidden : true
		},{
			id : 'stockId',
			header : fcOutSub['stockId'].fieldLabel,
			dataIndex : fcOutSub['stockId'].name,
			hidden : true
		},{
			id : 'outId',
			header : fcOutSub['outId'].fieldLabel,
			dataIndex : fcOutSub['outId'].name,
			hidden : true
		},{
			id : 'outNo',
			header : fcOutSub['outNo'].fieldLabel,
			dataIndex : fcOutSub['outNo'].name,
			hidden : true
		},{
			id : 'equBoxNo',
			header : fcOutSub['equBoxNo'].fieldLabel,
			dataIndex : fcOutSub['equBoxNo'].name,
			align : 'center',
			width : 100,
			hidden : true
		}, {
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 200
		},{
			id : 'equType',
			header : fcOutSub['equType'].fieldLabel,
			dataIndex : fcOutSub['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
            hidden : true,
			width : 100
		},{
			id : 'equPartName',
			header : fcOutSub['equPartName'].fieldLabel,
			dataIndex : fcOutSub['equPartName'].name,
			align : 'center',
			width : editBody!=""?180:200
		},{
			id : 'ggxh',
			header : fcOutSub['ggxh'].fieldLabel,
			dataIndex : fcOutSub['ggxh'].name,
			align : 'center',
			width : editBody!=""?100:150
		}, {
			id : 'special',
			header : fcOutSub['special'].fieldLabel,
			dataIndex : fcOutSub['special'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<specialArr.length; i++){
					if (v == specialArr[i][0]){
						return specialArr[i][1];
					}
				}
			}
		}, {
			id : 'jzNo',
			header : fcOutSub['jzNo'].fieldLabel,
			dataIndex : fcOutSub['jzNo'].name,
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
			id : 'graphNo',
			header : fcOutSub['graphNo'].fieldLabel,
			dataIndex : fcOutSub['graphNo'].name,
			align : 'center',
            hidden : editBody!=""?true:false,
			width : 100
		},{
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
			width : 80
		}, {
			id : 'inNum',
			header : fcOutSub['inNum'].fieldLabel,
			dataIndex : fcOutSub['inNum'].name,
			width : 80,
			hidden : editBody!=""?false:true
		},{
			id : 'otherOutNum',
			header : "<div title='此单价的物资出库后剩余数量。'>剩余数量</div>",
			dataIndex : 'otherOutNum',
            renderer : function(v,m,r){
                var otherOutNum = 0;
                var sql = " SELECT nvl(SUM(s.out_num),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
				    " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+r.get('outId')+"') " +
				    " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' ";
                DWREngine.setAsync(false);
                baseMgm.getData(sql, function(list) {
	                if (list && list.length > 0) {
	                    otherOutNum = list[0];
	                }
	            });
                DWREngine.setAsync(true);//(r.get('inNum')-(r.get('outNum')))
                return "<div id='num"+r.get('uids')+"' title='此单价的物资出库后剩余数量。' style='cursor:pointer;color:red;'>"+(r.get('inNum')-otherOutNum)+"</div>";
            },
            align : 'right',
            hidden : editBody!=""?false:true,
			width : 80
		}, {
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			editor : USERDEPTID == '102010103'?"":new fm.NumberField(fcOutSub['outNum']),
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'right',
			width : 80
		}, {
			id : 'outNumCH',
			header : '可冲回数量',
			dataIndex : 'outNumCH',
			renderer : function(v,m,r){
				var number = 0;
				DWREngine.setAsync(false);
        		baseMgm.getData("select nvl((nvl(t.out_num, 0) + (select nvl(sum(t.out_num), 0) from equ_goods_stock_out_sub t " +
        				" where t.equ_sub_uids = '"+r.get('equSubUids')+"')), 0) " +
        						" from equ_goods_stock_out_sub t where t.uids = '"+r.get('equSubUids')+"'",function(num){
        				number = num;
        			
        		})
        		DWREngine.setAsync(true);
        		return number;
		    },
		    hidden : showFlag == 'show' ? false : true,
			align : 'right',
			width : 80
		}, {
			id : 'price',
			header : fcOutSub['price'].fieldLabel,
			dataIndex : fcOutSub['price'].name,
			renderer : function(v) {
				return isNaN(v) ? parseFloat(v, 10).toFixed(2) : v.toFixed(2);
			},
			align : 'right',
            hidden : editBody!=""?false:true,
			width : 80
		},{
			id : 'amount',
			header : fcOutSub['amount'].fieldLabel,
			dataIndex : fcOutSub['amount'].name,
			editor : USERDEPTID == '102010103'?"":new fm.NumberField(fcOutSub['amount']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return '<div id="amount">'+v+'</div>'
		    },
			align : 'right',
            hidden : editBody!=""?false:true,
			width : 80
		},{
			id : 'kcMoney',
			header : fcOutSub['kcMoney'].fieldLabel,
			dataIndex : fcOutSub['kcMoney'].name,
			align : 'right',
			hidden : editBody!=""?false:true,
			renderer : function(v,m,r){
                var otherOutMoney = 0;
	            var sql = " SELECT nvl(SUM(s.amount),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
	                " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+r.get('outId')+"')" +
	                " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' " +
	                " AND s.uids <> '"+r.get('uids')+"'";
	            DWREngine.setAsync(false);
	            baseMgm.getData(sql, function(list) {
	                if (list && list.length > 0) {
	                    otherOutMoney = list[0];
	                }
	            });
	            DWREngine.setAsync(true);
		      	return "<div id='money"+r.get('uids')+"'>"+(parseFloat((r.get('inNum')*r.get('price') - otherOutMoney - r.get('amount')).toFixed(2)))+"</div>";
			},
			width : 80
		},{
			id : 'stockNum',
			header : "库存数量余额",
			dataIndex:'stockNum',
			align : 'right',
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
    			equMgm.getStockNumFromStock(record.get('stockId'),function(num){
    				stocknum=num;
    			});
    			DWREngine.setAsync(true);
    			return stocknum;
			},
			hidden : editBody!=""?true:false
		},{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
            hidden : true,
			width : 80
		},{
			id : 'gclName',
			header : "安装工程量",
			align : 'center',
			dataIndex : 'gclName',
            renderer : function(v,m,r){
            	var count = 0;
            	var value  = r.get('inSubUids');
            	DWREngine.setAsync(false);
            	baseDao.getData("select count(*)  from bdg_project t where t.fixed_asset_list ='"+value+"'",function(num){
            		count = num;
            	})
            	DWREngine.setAsync(true);
            	if(count == 0){
            		return "无";
            	}else{
            		return "<a title='工程量信息'   style='color:blue;' href='javascript:void(0);' onclick='openWinFun(\""+value+"\");'>" + 
            				"共有【<span style='color:red;'>"+count+"</span>】个工程量" + "</a>"
            	}
            },
            align : 'right',
            hidden : editBody!=""?false:true,
			width : 120
		}, {
			id : 'useParts',
			header : fcOutSub['useParts'].fieldLabel,
			dataIndex : fcOutSub['useParts'].name,
			editor : new fm.TextField(fcOutSub['useParts']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'right',
			width : 80
		}, {
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			editor : new fm.TextField(fcOutSub['kksNo']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'right',
			hidden : editBody!=""?false:true,
			width : 80
		},{
			id : 'qcId',
			header : fcOutSub['qcId'].fieldLabel,
			dataIndex : fcOutSub['qcId'].name,
			hidden : true,
			renderer : function(v,m,r){
				var strArr = v.split(",");
			    var strS = "";
			    for(var i=0;i<strArr.length;i++){
			    	if(strArr.length == 1){
			    		strS = "'"+strArr[i]+"'";
			    	}else{
			    		if(i>=0&&i<strArr.length-1){
			    			strS += "'"+strArr[i]+"',";
			    		}else{
			    			strS += "'"+strArr[i]+"'";
			    		}
			    	}
			    }
				var kks='';
				DWREngine.setAsync(false);
				baseMgm.getData("select kksno from equ_goods_qc where uids in ("+strS+")",function(list){
					if(list !=null){
						for(var i=0;i<list.length;i++){
							if(list.length == 1){
								kks =list[i];
							}else{
								if(i>=0 && i<list.length-1){
									kks +=list[i]+",";
								}else{
									kks +=list[i]+"";
								}
							}
						}
					}
				});
				DWREngine.setAsync(true);
				m.attr = "style=background-color:#FBF8BF";
                return kks;
		    },
			align : 'left',
			width : 130
		},{
			id : 'inUids',
			header : fcOutSub['inUids'].fieldLabel,
			dataIndex : fcOutSub['inUids'].name,
			width : 80,
            hidden : true
		}, {
			id : 'inSubUids',
			header : fcOutSub['inSubUids'].fieldLabel,
			dataIndex : fcOutSub['inSubUids'].name,
			width : 80,
            hidden : true
		}, {
			id : 'memo',
			header : fcOutSub['memo'].fieldLabel,
			dataIndex : fcOutSub['memo'].name,
			editor : new fm.TextField(fcOutSub['memo']),
			renderer : function(v,m,r){
				var qtip = "qtip=" + v;
				m.attr = "style=background-color:#FBF8BF";
                return '<span ' + qtip + '>' + v + '</span>';
		    },
			align : 'left',
			hidden : editBody!=""?false:true,
			width : 180
		}, {
			id : 'equSubUids',
			header : fcOutSub['equSubUids'].fieldLabel,
			dataIndex : fcOutSub['equSubUids'].name,
			hidden : true,
			width : 180
		}
	]);
	var ColumnsOutSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'stockId', type:'string'},
		{name:'outId', type:'string'},
		{name:'outNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'outNum', type:'float'},
		{name:'price', type:'float'},
		{name:'amount', type:'float'},
		{name:'storage', type:'string'},
		{name:'kcMoney',type:'float'},
		{name:'useParts',type:'string'},
		{name:'kksNo',type:'string'},
		{name:'qcId',type:'string'},
		{name:'inNum',type:'float'},
	    {name:'inUids',type:'string'},
	    {name:'inSubUids',type:'string'},
	    {name:'memo',type:'string'},
	    {name:'equBoxNo', type:'string'},
	    {name:'equSubUids', type:'string'},
		{name:'special',type:'string'},
		{name:'jzNo',type:'string'}
	];

	var PlantSub = Ext.data.Record.create(ColumnsOutSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		outId : '',
		outNo : '',
		boxNo : '',
		equType : '',
		equPartName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		outNum : 0,
		price : 0,
		amount : 0,
		storage : '',
		kcMoney : 0,
		useParts : '',
		kksNo : '',
		qcId:'',
		inNum : '',
		inUids : '',
		inSubUids : '',
		memo : '',
		equBoxNo : '',
		equSubUids : ''
	}

	dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: "pid='"+CURRENTAPPID+"' and outId='"+edit_uids+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyOutSub
        }, ColumnsOutSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsOutSub.setDefaultSort(orderColumnOutSub, 'desc');	//设置默认排序列
    dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
    dsOutSub.on('load',function(){
		for (var i = 0; i < dsOutSub.getCount(); i++) {
			var record = dsOutSub.getAt(i);
			var num = Ext.getDom('num'+record.get('uids')+'').innerText;
			var money = Ext.getDom('money'+record.get('uids')+'').innerText;
			if(num == 0 && money > 0){
				Ext.getDom('money'+record.get('uids')+'').style.color = 'red';
				Ext.getDom('amount').style.color = 'red';
			}
		}
    })
    var tbars = null;
    if(editBody != ""){
      var  choseChangeBtn = new Ext.Button({
			id : 'chooseSub',
			text : '选择出库明细',
			iconCls : 'btn',
			handler : chooseSubFn
	    })
	    tbars = ['<font color=#15428b><B>出库单明细<B></font>','-',choseChangeBtn,'-'];
    }else{
       tbars = ['<font color=#15428b><B>出库单明细<B></font>','-',changePartBtn,'-'];
    }
    var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id:"gridPanelSub",
		ds : dsOutSub,
		cm : cmOutSub,
		sm : smOutSub,
		title : '出库单明细',
		clicksToEdit : 2,
		tbar :  view == 'view' ? ['<font color=#15428b><B>出库单明细<B></font>']
				: tbars,
		addBtn : false,
		saveHandler : saveOutSub,
		deleteHandler : deleteOutSub,
		saveBtn :  view != 'view',
		delBtn :  view != 'view',
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: false
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsOutSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanOutSub,
		business : businessOutSub,
		primaryKey : primaryKeyOutSub,
		listeners:{
//			"cellclick" : function(grid, rowIndex, columnIndex, e) {
//				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
//				// kks编码（生产）
//				if (fieldName == 'qcId') {
//					showqCWin();
//				}
//			},
			beforeedit : function(e){
				if(view == 'view'){
					return false;
				}
			},
			afteredit:function(e){
				if(e.field == "outNum"){
					var record = e.record;
			    	var realOld = e.originalValue;
			    	var valOld = "";
			    	var realNew = e.value;
			    	if(realNew<0 && showFlag !='show'){
			    		record.set('outNum',realOld);
			    		return false;
			    	}
			    	if(editBody != ""){
	                    var r = record;
	                    var inNum = r.get('inNum')
	                    var otherOutNum
	                    var sql = " SELECT nvl(SUM(s.out_num),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
	                        " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+r.get('outId')+"') " +
	                        " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' ";
	                    DWREngine.setAsync(false);
		                baseMgm.getData(sql, function(list) {
		                    if (list && list.length > 0) {
		                        otherOutNum = list[0];
		                    }
		                });
		                DWREngine.setAsync(true);
	                    if((realNew - realOld) > (inNum - otherOutNum)){
	                        Ext.Msg.show({
	                            title: '提示',
	                            msg: '出库数量修改出错，出库数量只能再增加【'+(inNum - otherOutNum)+"】"+record.get('unit'),
	                            icon: Ext.Msg.WARNING, 
	                            width:200,
	                            buttons: Ext.MessageBox.OK
	                        });
	                        record.set('outNum',realOld);
	                    }
                    }else{
                    	if(showFlag == 'show'){
                    		var number = 0;
                    		var oldNum = 0;
                    		var record = e.record;
                    		var getUids = record.get('equSubUids');
                    		DWREngine.setAsync(false);
                    		baseMgm.getData("select nvl((nvl(t.out_num, 0) + (select nvl(sum(t.out_num), 0) from equ_goods_stock_out_sub t " +
                    				" where t.equ_sub_uids = '"+getUids+"')), 0) " +
                    						" from equ_goods_stock_out_sub t where t.uids = '"+getUids+"'",function(num){
                    				number = num;		
                    			
                    		})
                    		DWREngine.setAsync(true);
	                   		DWREngine.setAsync(false);
                    		baseMgm.getData("select nvl(t.out_num, 0) from equ_goods_stock_out_sub t where t.uids = '"+record.get('uids')+"'",function(num){
                    				oldNum = num;		
                    			
                    		})
                    		DWREngine.setAsync(true);
                    		if((record.get('outNum')/1+(parseInt(number)-parseInt(oldNum))/1)<0 || (record.get('outNum')/1)>0){
                    			record.set('outNum',realOld);
                    			if((parseInt(number)-parseInt(oldNum))/1 ==  0){
                    				Ext.example.msg('信息提示','该设备已冲回完，请删除该设备！');
                    			}else{
	                    			Ext.example.msg('信息提示','只允许输入【<span style="color:red">0</span> ~ <span style="color:red">'+(-(parseInt(number)-parseInt(oldNum)))+'</span>】的整数！');
                    			}
                    		}
                    	}else{
	               		    var stocknum;
							DWREngine.setAsync(false);
			    			equMgm.getStockNumFromStock(record.get('stockId'),function(num){
			    				stocknum=num;
			    			});
			    			equMgm.getOutNumFromOutSub(record.get('uids'),function(num){
				    				valOld=num;
				    			});
			    			DWREngine.setAsync(true);
			    			if(realNew - valOld > stocknum){
								Ext.Msg.show({
										title: '提示',
							            msg: '出库数量修改出错，出库数量只能再增加'+stocknum+record.get('unit'),
							            icon: Ext.Msg.WARNING, 
							            width:200,
							            buttons: Ext.MessageBox.OK
									});
								record.set('outNum',realOld);
							}
	               		}	                    
                    }
				}
				if(e.field == "amount"){
					var record = e.record;
			    	var realOld = e.originalValue;
			    	var realNew = e.value;
					var otherOutMoney = 0;
					if(record.get('outNum') == 0){
		                Ext.example.msg("信息提示","请先输入出库数量！");
		                record.set('amount',0);
		                return;
		             }
		            var sql = " SELECT nvl(SUM(s.amount),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
		                " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+record.get('outId')+"') " +
		                " AND s.box_no = '"+record.get('boxNo')+"' AND s.in_sub_uids = '"+record.get('inSubUids')+"' " +
		                " AND s.uids <> '"+record.get('uids')+"'";
		            DWREngine.setAsync(false);
		            baseMgm.getData(sql, function(list) {
		                if (list && list.length > 0) {
		                    otherOutMoney = list[0];
		                }
		            });
		            DWREngine.setAsync(true);
		            var getKcMoney = parseFloat((record.get('inNum')*record.get('price') - otherOutMoney - record.get('amount')).toFixed(2));
		            if(getKcMoney<0){
		                Ext.example.msg("信息提示","修改后库存余额会出现负数，不能进行此操作！");
		                record.set('amount',realOld);
		            }
				}
			},
			aftersave: function(grid, idsOfInsert, idsOfUpdate, primaryKey,  bean){
				var idsArr = idsOfUpdate.split(",");
				for (var i = 0; i < idsArr.length; i++) {
					var record = dsOutSub.getById(idsArr[i])
					var num = Ext.getDom('num'+record.get('uids')+'').innerText;
					var money = Ext.getDom('money'+record.get('uids')+'').innerText;
					if(num == 0 && money > 0){
						Ext.MessageBox.alert('提示信息','存在【剩余数量】为0，但【库存余额】不为0的记录，请调整出库金额!');
						dsOutSub.reload();
						return;
					}
				}
			}
		}
	});

	//修改数据后如果翻页，提醒先保存在进行下一页的编辑         yanglh 2013-11-21
    dsOutSub.on('beforeload',function(store, obj){
    	var record = dsOutSub.getModifiedRecords();
    	if(record.length>0){
			Ext.example.msg("系统提示","当前有数据被修改过，请保存后在编辑下一页的数据！");
			return false;        	
    	}
	})	
	var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
				"?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=CK";
	var filePanel = new Ext.Panel({
		id : 'filePanel',
		title : '附件',
		layout: 'fit',
		html:"<iframe id='fileWinFrame' src='"+url+"' width='100%' height='100%' frameborder='0'></iframe>"
	});
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
    	items: view == 'view' ? [gridPanelSub] : [gridPanelSub,filePanel]
	})
	
	var viewport = new Ext.Viewport({
		layout:'border',
        items: [formPanel, tabPanel]
	});
	
	gridPanelSub.on("afteredit",function(obj){
	   var r=obj.record;
	   if(r!=null){
	   	   if(obj.field == 'outNum')
	          r.set('amount',(r.get('price')*r.get('outNum')).toFixed(2))
	   }
	})
	
	smOutSub.on('rowselect',function(){
		if(USERDEPTID == '102010103'){
			with(gridPanelSub.getTopToolbar().items){
			     get('del').disable();
			}
			changePartBtn.disable();
		}	
	})

	formPanel.getForm().loadRecord(loadFormRecord);
	if(editFlag ==""){
	    //新增时根据合同分类二（财务）属性代码的中文配置，与仓库号中文对比匹配，自动设置
//	    if(wareTreeCombo.getValue() == null || wareTreeCombo.getValue() == ""){
//	        for (var i = 0; i < equWareArr.length; i++) {
//	            if (moneysortText == equWareArr[i][2]){
//	                wareTreeCombo.setValue(equWareArr[i][1]);
//	                loadFormRecord.set("equid",equWareArr[i][1]);
//	                wareTreeCombo.setRawValue(equWareArr[i][3]+" - "+equWareArr[i][2]);
//	            }
//	        }
//	    }
		if (conPartybNoComBo.getValue() == null || conPartybNoComBo.getValue() == "") {
			for (var i = 0; i < conPartybNoArr.length; i++) {
				if (edit_conid == conPartybNoArr[i][2]) {
					conPartybNoComBo.setValue(conPartybNoArr[i][1]);
				}
			}
		}
    } else {
		wareTreeCombo.setValue(loadFormRecord.get("equid"));
		for (var i = 0; i < equWareArr.length; i++) {
			if (loadFormRecord.get("equid") == equWareArr[i][1]) {
				wareTreeCombo.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][2]);
				break;
			}
		}
		updateEquid=loadFormRecord.get("equid");
		oldWarehouseNo=loadFormRecord.get("outNo");
		subjectAllnameCombo.setValue(loadFormRecord.get("subjectAllname"))
		for (var i = 0; i < subjectAllnameArr.length; i++) {
			if (loadFormRecord.get("subjectAllname") == subjectAllnameArr[i][0]) {
				subjectAllnameCombo.setRawValue(subjectAllnameArr[i][1]);
				break;
			}
		}
		conPartybNoComBo.setValue(loadFormRecord.get("conPartybNo"));
	}

	wareTreeCombo.validate();
    function saveOut(){
		var form = formPanel.getForm();
        var checkBlank = ['useUnit','outNo','equid','using'];
        if(editBody != ""){
//        	checkBlank.push('using');
//			checkBlank.push('financialSubjects');
//			checkBlank.push('usingPart');
//			checkBlank.push('kksNo');
// 			checkBlank.push('userPart');
//			checkBlank.push('kks');
            checkBlank.push('recipientsUnit');
        	checkBlank.push('using');
//			if (USERDEPTID == '102010103') {
//				checkBlank.push('financialSubjects');
//			}
        }
        for(var i = 0;i<checkBlank.length;i++){
	        if(form.findField(checkBlank[i]).getValue() == null || form.findField(checkBlank[i]).getValue() == ""){
	            Ext.example.msg('提示信息','【'+fcOut[checkBlank[i]].fieldLabel+'】不能为空！');
	            return false;
	        }
        }
        if(editBody != ""){
        	var getUnit = '';
        	var judgmentSubUids = 0;
	        DWREngine.setAsync(false);
	        var sqlUint = "select recipients_unit from equ_goods_stock_out where uids='"+form.findField('uids').getValue()+"'";
	        baseMgm.getData(sqlUint, function(list) {
	            if (list && list.length > 0) {
	                getUnit = list[0];
	            }
	        });
	        var sqlSubUids = "select count(*) from equ_goods_stock_out_sub where out_id='"+form.findField('uids').getValue()+"'";
	        baseMgm.getData(sqlSubUids, function(listUids) {
	            if (listUids != null  && listUids != '' && listUids != 0) {
	                judgmentSubUids  = 1;
	            }
	        });
	        DWREngine.setAsync(true);
	        if((getUnit != form.findField('recipientsUnit').getValue()) && (judgmentSubUids == 1)){
	             Ext.example.msg('提示信息','如要修改出库单位,请先删除出库单明细记录！');
	             return false;
	        }
	    }
    	var obj = form.getValues();
		for(var i=0; i<ColumnsOut.length; i++) {
    		var n = ColumnsOut[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equMgm.addOrUpdateEquOut(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','设备出库保存失败！');
    			updateEquid=formPanel.getForm().findField("equid").getValue();
				 oldWarehouseNo=formPanel.getForm().findField("outNo").getValue();
    		}else{
    			Ext.example.msg('提示信息','设备出库保存成功！');
                dsOutSub.reload();
    		}
    	});
    	DWREngine.setAsync(true);
	}
	function changePart(){
		if(edit_mark =="markTrue"){
			parent.tabPanelEs.setActiveTab(0);
			parent.selectWin.close();
		}else{
			parent.tabPanel.setActiveTab(0);
			parent.selectWin.close();
		}
	}
	//保存设备部件信息，并更新设备库存数量
	function saveOutSub(){
		var records=dsOutSub.getModifiedRecords();
		if(records == ''){
            Ext.example.msg('提示信息','请先修改数据在保存！');
            return;		  
		}
        for(var i = 0; i < records.length;i ++){
            if(records[i].get('useParts') == ''){
                Ext.example.msg('提示信息','安装部位为必填项，请填写后在保存！');
                return;
            }
//          if (!(editBody != "" ? ((getFlag == "write" ? false : true)) : true)) {
//				if (records[i].get('kksNo') == '') {
//					Ext.example.msg('提示信息', 'KKS编码为必填项，请填写后在保存！');
//					return;
//				}
//			}
        }
        for (var i = 0; i < records.length; i++) {
            var r = records[i]
            //数量
            var num = r.data.outNum;
            //单价
            var price = r.data.price;
            //金额
            var amount = r.data.amount;
            if(amount == (price*num) || amount == 0)
                amount = (price*num);
            r.set("amount",amount);
            var otherOutMoney = 0;
            if(editBody != ""){
	            	var sql = " SELECT nvl(SUM(s.amount),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
	                " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+r.get('outId')+"') " +
	                " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' " +
	                " AND s.uids <> '"+r.get('uids')+"'";
		            DWREngine.setAsync(false);
		            baseMgm.getData(sql, function(list) {
		                if (list && list.length > 0) {
		                    otherOutMoney = list[0];
		                }
		            });
		            DWREngine.setAsync(true);
		            r.set("kcMoney", parseFloat((r.get('inNum')*r.get('price') - otherOutMoney - amount).toFixed(2)));
		     }else{
	     	    //库存余额字段的数值，更改为从入库从表明细金额减去所有该物资出库金额，
	            //与“剩余数量”计算类似
	            //totalMoney 入库金额
	            //amount 出库金额
			    var kcmoney = 0;
				var oldamount = 0;
	            var totMonSql = "select nvl(sum(t.kc_money),0) from equ_goods_stock t where t.judgment ='body'"
						+ " and t.pid = '" + pid + "' and t.stock_no = '" + r.get('boxNo') + "'";
				DWREngine.setAsync(false);
				baseMgm.getData("select t.amount from EQU_GOODS_STOCK_OUT_SUB t where t.uids ='"
		    					+ r.get('uids') + "'", function(list){
		    				if(list && list.length > 0 && list[0]){
		    					oldamount = list[0];
		    				}
		    			})
				baseMgm.getData(totMonSql, function(list) {
							if (list && list.length > 0 && list[0]) {
								kcmoney = list[0];
							}
						});
				DWREngine.setAsync(true);
				r.set("kcMoney", parseFloat((kcmoney/1 + oldamount/1 - amount/1).toFixed(2)));
		     }
        }
        
		var flag=true;
		if(records.length!=0){
			for(var i=0;i<records.length;i++){
				var oldstocknum;
				var oldoutNum;
				DWREngine.setAsync(false);
    			equMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
    				oldstocknum=num;
    			});
    			equMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
    				oldoutNum=num;
    			});
    			DWREngine.setAsync(true);
    			var newstockNum = "";
    			if(editBody=="body"){
    			     newstockNum=records[i].get('inNum')-records[i].get('outNum');
    			}else{
    				 newstockNum=oldstocknum+oldoutNum-records[i].get('outNum');
    			}
    			
    			if(newstockNum<0){
					Ext.Msg.show({
						title: '提示',
			            msg: '设备'+records[i].get('equPartName')+'的出库数量不能大于库存数量',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					});
					flag = false;
					break;
			    }
			}
			if(flag){
			    for(var i=0;i<records.length;i++){
					var oldstocknum;
					var oldoutNum;
					var oldamount = 0;
					DWREngine.setAsync(false);
					if(editBody=="body"){
				        equMgm.insertSubToFinishedRecord(CURRENTAPPID,edit_uids,records[i].get('uids'),records[i].get('outNum'),'CK',function(){})
				    }
//					if(editBody !="body"){
	    			equMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
	    				oldstocknum=num;
	    			});
	    			equMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
	    				oldoutNum=num;
	    			});
	    			baseMgm.getData("select t.amount from EQU_GOODS_STOCK_OUT_SUB t where t.uids ='"
	    					+ records[i].get('uids') + "'", function(list){
	    				if(list && list.length > 0 && list[0]){
	    					oldamount = list[0];
	    				}
	    			})
	    			var newstockNum=0;
	    			if(showFlag == 'show'){
	    			    newstockNum = oldstocknum-oldoutNum-parseInt(records[i].get('outNum'));
	    			}else{
	    				newstockNum = oldstocknum+oldoutNum-parseInt(records[i].get('outNum'));
	    			}
					equMgm.updateStockNum(newstockNum, records[i].get('stockId'), oldamount - records[i].get('amount'), function() {
	   						    			  	
	    			  });	    			
//	    			}

	    			DWREngine.setAsync(true);
			   }
		      gridPanelSub.defaultSaveHandler();
		    }
		}
	};

	//删除选中的设备部件信息，并更新设备库存数量
	function deleteOutSub() {
		var record = gridPanelSub.getSelectionModel().getSelected();
		if (record == undefined) {
			Ext.example.msg('提示信息', '请选择您要删除的记录！');
			return;
		}
		var oldstocknum;
		DWREngine.setAsync(false);
		equMgm.getStockNumFromStock(record.get('stockId'), function(num) {
			oldstocknum = num;
		});
		DWREngine.setAsync(true);
		// 非主体设备冲回出库时，库存数量要增加yanglh 2013-12-21
		var newstockNum = 0;
		if (showFlag == 'show') {
			newstockNum = oldstocknum - record.get('outNum');
		} else {
			newstockNum = oldstocknum + record.get('outNum');
		}
		//还原库存
		DWREngine.setAsync(false);
		equMgm.updateStockNum(newstockNum, record.get('stockId'), record.get('amount'), function() {});
		DWREngine.setAsync(true);

		if (editBody != "") {
			equMgm.delEquGoodsFinishedRecord(record.get('stockId'));
		}
		gridPanelSub.defaultDeleteHandler();
	}

	// 作展示页面使用，禁用所有功能
	if (view == 'view') {
		var form = formPanel.getForm();
		formPanel.items.each(function(item, index, length) {
					item.disable();
				})
		form.findField('recipientsUnit').disable();
		form.findField('outDate').disable();
		form.findField('kksNo').disable();
		form.findField('usingPart').disable();
		wareTreeCombo.getTree().on('beforeshow', function() {
					return false;
				})
		bdgTreeWin.on('beforeshow', function() {
					return false;
				})
		subjectAllnameCombo.getTree().on('beforeshow', function() {
					return false;
				})
	}
	
//TODO  主体设备出库从对应的合同及出库单位与参与单位相同时选择入库明细从表内容
	
		// TODO : ======入库通知单明细======
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
	var fcSub = {
        'uids' : {name : 'uids',fieldLabel : '主键'},
		'warehouseNo' : {name:'warehouseNo',fieldLabel:'入库单据号'},
		'warehouseDate' : {name:'warehouseDate',fieldLabel:'入库日期'},
        'conid' : {name : 'conid', fieldLabel : '合同主键'},
        'joinUnit' : {name : 'joinUnit', fieldLabel : '入库单位'},
        'stockno' : {name : 'stockno', fieldLabel : '存货编码'},
        'warehouseType' : {
            name : 'warehouseType',
            fieldLabel : '设备类型',
            readOnly: true,
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            allowBlank : false,
            triggerAction: 'all',
            store: equTypeDs
        },
        'warehouseName' : {name : 'warehouseName',fieldLabel : '设备名称'},
        'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
        'unit' : {name : 'unit',fieldLabel : '单位'},
        'inWarehouseNo' : {name : 'inWarehouseNo',fieldLabel : '入库数量',decimalPrecision:4},
        'hasOutNum' : {name : 'hasOutNum',fieldLabel : '剩余数量',decimalPrecision:4},
        'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价', decimalPrecision:6},
        'totalMoney' : {name : 'totalMoney',fieldLabel : '入库金额', decimalPrecision:2},
        'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
    };
	var smSub = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			});

	var cmSub = new Ext.grid.ColumnModel([
        smSub,
        {
            id : 'uids',
            header : fcSub['uids'].fieldLabel,
            dataIndex : fcSub['uids'].name,
            hidden : true
        }, {
            id : 'conid',
            header : fcSub['conid'].fieldLabel,
            dataIndex : fcSub['conid'].name,
            hidden : true
        }, {
	        id : 'warehouseNo',
	        header : fcSub['warehouseNo'].fieldLabel,
	        dataIndex : fcSub['warehouseNo'].name,
	        align : 'center',
	        width : 200
	    }, {
	        id : 'warehouseDate',
	        header : fcSub['warehouseDate'].fieldLabel,
	        dataIndex : fcSub['warehouseDate'].name,
	        align : 'center',
	        renderer : formatDate,
	        width : 100
        }, {
            id : 'joinUnit',
            header : fcSub['joinUnit'].fieldLabel,
            dataIndex : fcSub['joinUnit'].name,
            align : 'center',
            width : 160
	    }, {
	        id : 'stockno',
	        header : fcSub['stockno'].fieldLabel,
	        dataIndex : fcSub['stockno'].name,
	        align : 'center',
	        width : 180
        },{
            id : 'warehouseType',
            header : fcSub['warehouseType'].fieldLabel,
            dataIndex : fcSub['warehouseType'].name,
            align : 'center',
            renderer : function(v){
                var equ = "";
                for(var i=0;i<equTypeArr.length;i++){
                    if(v == equTypeArr[i][0])
                        equ = equTypeArr[i][1];
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
			id : 'special',
			header : fcSub['special'].fieldLabel,
			dataIndex : fcSub['special'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<specialArr.length; i++){
					if (v == specialArr[i][0]){
						return specialArr[i][1];
					}
				}
			}
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
            align : 'right',
            width : 80
        },{
            id : 'hasOutNum',
            header : fcSub['hasOutNum'].fieldLabel,
            dataIndex : fcSub['hasOutNum'].name,
            renderer : function(v){
                return '<div style="color:red">'+v+'</div>'
            },
            align : 'right',
            width : 80
        },{
            id : 'intoMoney',
            header : fcSub['intoMoney'].fieldLabel,
            dataIndex : fcSub['intoMoney'].name,
            align : 'right',
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
            width : 80
        }
    ]);

	var ColumnsSub = [
        {name:'uids', type:'string'},
        {name:'warehouseNo', type:'string'},
        {name:'warehouseDate', type:'date', dateFormat: 'Y-m-d H:i:s'},
        {name:'conid', type:'string'},
        {name:'joinUnit', type:'string'},
        {name:'stockno', type:'string'},
        {name:'warehouseType', type:'string'},
        {name:'warehouseName', type:'string'},
        {name:'ggxh', type:'string'},
        {name:'unit', type:'string'},
        {name:'inWarehouseNo', type:'float'},
        {name:'hasOutNum', type:'float'},
        {name:'intoMoney', type:'float'},
        {name:'totalMoney', type:'float'},
        {name:'special',type:'string'},
		{name:'jzNo',type:'string'}
    ];

    var dsSub = new Ext.data.GroupingStore({
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
				pruneModifiedRecords : true,
		        sortInfo: {field: 'stockno', direction: "desc"},    // 分组
		        groupField: 'stockno'   // 分组
			});
	dsSub.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列
    cmSub.defaultSortable = true;
    var chooseBtn = new Ext.Button({
		id : 'chooseBtn',
		text : '确认选择',
		iconCls : 'btn',
		handler : chooseBtnFn
	})
	var gridPanelInSub = new Ext.grid.GridPanel({
	        id:"gridPanelInSub",
	        ds : dsSub,
	        cm : cmSub,
	        sm : smSub,
	        tbar : ['<font color=#15428b><B>入库单明细<B></font>','->',chooseBtn],
	        border: false,
	        stripeRows:true,
	        loadMask : true,
	        viewConfig: {
	            forceFit: false,
	            ignoreAdd: true
	        },
	        view: new Ext.grid.GroupingView({   // 分组
	            forceFit: false,
	            groupTextTpl: '{text}(共{[values.rs.length]}项)'
	        }),
	        bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: dsSub,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        })
	    });
	    
	    storeSelects(dsSub,smSub);   
    
	function chooseSubFn(){
	   var recipientsUnit = null;
	   var useUnit = null;
	   var equid = null;
	   var using = null;
 	   var edit_uids1=formPanel.getForm().findField('uids').getValue();
	   DWREngine.setAsync(false);
	   baseMgm.findById(beanOut,edit_uids1,function(obj){
	       recipientsUnit = obj.recipientsUnit;
	       useUnit  = obj.useUnit;
	       equid = obj.equid;
	       using = obj.using;
	   })
	   DWREngine.setAsync(true);
	   if(recipientsUnit == null && useUnit == null && equid == null && using == null){
	      Ext.example.msg('提示信息','请填写完整出库单信息保存之后再选择出库明细！');
	      return;
	   }
      if(!selectOutSubFromInSubWin){
	         selectOutSubFromInSubWin = new Ext.Window({
		            id : 'selectOutSubFromInSubWin',
		            width : 920,
		            height : 380,
		            modal: true, 
		            plain: true, 
		            border: false, 
		            layout: 'fit',
		            resizable: false,
		            closeAction :"hide",
	                items : [gridPanelInSub]
	          })
        }
        var outUids=formPanel.getForm().findField('uids').getValue();
        var typeS = formPanel.getForm().findField('type').getValue();
        if(typeS == '正式出库'){
			typeS = " and  type='正式入库' and "; 
        }else if(typeS == '暂估出库'){
        	typeS = " and type='暂估入库' and finishMark is null and "; 
        }
        var detailName = '';
        for(var i=0;i<unitArr.length;i++){
           if(recipientsUnit==unitArr[i][0]){
             detailName  = unitArr[i][1];
             break;
           }
        }
        selectOutSubFromInSubWin.on('show',function(){
	            dsSub.baseParams.params = "hasOutNum>0 and conid='"+edit_conid+"' and joinUnit='"+detailName+"'" +
						typeS+" uids not in (select inSubUids from "+beanOutSub+" where outId = '"+outUids+"')";
	            dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	            smSub.clearSelections();
	            collection.clear();
        })
        selectOutSubFromInSubWin.show();      
	}

	function chooseBtnFn() {
		var records = new Array();
		for (var i = 0; i < collection.getCount(); i++) {
			records.push(collection.item(i));
		}

		var recordOutSub = dsOutSub.getAt(0);
		var OutSubType = '';
		if (recordOutSub) {
			OutSubType = recordOutSub.get('equType');
		}
		if (records == null || records.length == 0) {
			Ext.example.msg('提示信息', '请先选择设备！');
			return;
		}
		var inSubUidsArr = new Array()
		var sbType = records[0].get('warehouseType');
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('warehouseType') != sbType) {
				Ext.example.msg('提示信息', '请先选择相同设备类型的设备！');
				return;
			}
			if (OutSubType != ''
					&& records[i].get('warehouseType') != OutSubType) {
				Ext.example.msg('提示信息', '请先选择相同设备类型的设备！');
				return;
			}
			inSubUidsArr.push(records[i].get("uids"));
		}
		var outUids = formPanel.getForm().findField('uids').getValue();
		var outNo = formPanel.getForm().findField('outNo').getValue();
		// 保存明细
		var flag = 'nobody';// 判断是否是主体设备，主体设备中出库单明细从对应的入库单明细中选择物资
		if (editBody == "body") {
			flag = 'body';
		}
		DWREngine.setAsync(false);
		equMgm.insertOutSubFromStock(inSubUidsArr, outUids, outNo, flag,
				function(str) {
					if (str == "1") {
						selectOutSubFromInSubWin.hide();
						Ext.example.msg('提示信息', '出库单材料选择成功！');
						dsOutSub.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					} else {
						Ext.example.msg('提示信息', '出库单设备选择失败！');
					}
				});
	}

     // 设备清册
     quryButton = new Ext.Button({
		id:"quryButton",
		text:"查询",
		iconCls : 'option',
		handler:qury
	});
     // 查询
	var gridColumns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'treeId',type:'string'},
		{name:'equNo',type:'string'},
		{name:'equName',type:'string'},
		{name:'kksNo',type:'string'},
		{name:'ggxh',type:'string'},
		{name:'equMake',type:'string'},
		{name:'remark',type:'string'}
		]
		var equNo_q = new Ext.form.TextField({fieldLabel: '序号',name: 'equNo',anchor:'95%'});
		var equName_q = new Ext.form.TextField({fieldLabel: '设备名称',name: 'equName',anchor:'95%'});
		var kksNo_q = new Ext.form.TextField({fieldLabel: 'KKS编码',name: 'kksNo',anchor:'95%'});
		var ggxh_q = new Ext.form.TextField({fieldLabel: '设备型号规格',name: 'ggxh',anchor:'95%'});
		var equMake_q = new Ext.form.TextField({fieldLabel: '生产厂家',name: 'equMake',anchor:'95%'});
		var quryForm = new Ext.FormPanel({
			id: 'form-panel',
		  	header: false,
		 	width : 500,
		  	height: 250,
		  	split: true,
		  	collapsible : true,
		  	collapseMode : 'mini',
		  	border: false,
		  	bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
			iconCls: 'icon-detail-form',
			labelAlign: 'left',
		  	items:[
		   		 equNo_q,equName_q,kksNo_q,ggxh_q,equMake_q
		  ]
		});
		function qury(){
			quryWin = new Ext.Window({
				title:'设备清册查询',
				buttonAlign:'center',
				closable:false,
				layout:'fit',
				modal:'true',
				width:500,
				height:260,
				autoScroll:true,
				items:quryForm,
				buttons:[{id:'btnQury',text:'查询' ,handler:quryEquGoodsQc},{id:'btnClose',text:'关闭',handler:function(){quryWin.hide()}}]
			});
			quryWin.show();
		}
	function quryEquGoodsQc(){
		var obj = quryForm.getForm().getValues();
		var equNo = obj.equNo;
		var equName = obj.equName;
	   	var kksNo = obj.kksNo;
	   	var ggxh = obj.ggxh;
	   	var equMake = obj.equMake;
		var str = "";
			if(equNo !=""){
				str += " and equNo like '%"+equNo+"%'";
			}
			if(equName != ""){
				str +=" and equName like '%"+equName+"%'";
			}
			if(kksNo !=""){
				str +=" and kksNo like '%"+kksNo+"%'";
			}
			if(ggxh !=""){
				str +=" and ggxh like '%"+ggxh+"%'";
			}
			if(equMake !=""){
				str +=" and equMake like '%"+equMake+"%'";
			}
			ds.baseParams.params = "pid='" + CURRENTAPPID + "'"+str+"";
			ds.load({params:{start: 0,limit: PAGE_SIZE}});
			quryForm.getForm().reset();
			quryWin.hide();	
	}
    var sm =  new Ext.grid.CheckboxSelectionModel({})   //  创建选择模式
    
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uids': {name: 'uids',fieldLabel: '设备主键',hidden:true,hideLabel:true}, 
    	 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true},
    	 'treeId': {name: 'treeId',fieldLabel: '设备清册树ID' ,hidden:true,hideLabel:true,anchor:'95%'},
    	 'equNo': {name: 'equNo',fieldLabel: '序号', anchor:'95%', allowBlank:false}, 
    	 'equName': {name: 'equName',fieldLabel: '设备名称',anchor:'95%',allowBlank:false}, 
    	 'kksNo': {name: 'kksNo',fieldLabel: 'KKS编码', anchor:'95%', allowBlank:false},
    	 'ggxh': {name: 'ggxh',fieldLabel: '设备型号规格',anchor:'95%',allowBlank:false}, 
    	 'equMake': {name: 'equMake',fieldLabel: '生产厂家', anchor:'95%'}, 
    	 'remark': {name: 'remark',fieldLabel: '备注',anchor:'95%'}
    }

     // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'treeId', type: 'string'},
    	{name: 'equNo', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'equName', type: 'string'},    	
		{name: 'kksNo', type: 'string' },
		{name: 'ggxh', type: 'string'},
		{name: 'equMake', type: 'string'},
		{name: 'remark', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = {uids:'',pid:CURRENTAPPID, treeId: '', equNo:'', equName:'', kksNo:'', ggxh:'',  equMake:'',remark:''}	//设置初始值 
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{	id:"equNo",
    		header:fc['equNo'].fieldLabel,
    		dataIndex: fc['equNo'].name
    	},
    	{	id:'pid',
    		header: fc['pid'].fieldLabel,
    		dataIndex: fc['pid'].name,
    		hidden: true
    	},
        {	id:'uids',
        	header: fc['uids'].fieldLabel,
        	dataIndex: fc['uids'].name,
        	hidden: true
        },
        {	id:'treeId', 
        	header: fc['treeId'].fieldLabel, 
        	dataIndex: fc['treeId'].name, 
        	hidden: true
        },
        {	id:'equName',
        	header: fc['equName'].fieldLabel,
        	width:120,
        	dataIndex: fc['equName'].name
        },
        {	id:'kksNo', 
        	header: fc['kksNo'].fieldLabel,
        	width:120,
        	dataIndex: fc['kksNo'].name
        },
        {
         	id:'ggxh',
           	header: fc['ggxh'].fieldLabel,
           	dataIndex: fc['ggxh'].name
        },
        {
        	id:'equMake',header: fc['equMake'].fieldLabel,
        	width:150,
        	dataIndex: fc['equMake'].name
        },
        {
           id:'remark',
           header: fc['remark'].fieldLabel,
           width:200,
           dataIndex: fc['remark'].name
        }
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.pmis.equipment.hbm.EquGoodsQc",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params: "pid='" + CURRENTAPPID + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort("equNo", 'asc');	//设置默认排序列
    ds.load({params : {start : 0,limit : PAGE_SIZE}});
    // 5. 创建可编辑的grid: grid-panel
    var selectBtn = new Ext.Button({
		id:"selectBtn",
		text:'选择',
		iconCls:'option',
		handler:function(){
			var list =  sm.getSelections();
			var qcid = "";
			var uids;
			if(list != ""){
				for(var i=0;i<list.length;i++){
					var rec = list[i];
					qcid +=rec.get("uids")+","; 
				}
				if(smOutSub.getSelected()!=''){
					uids = smOutSub.getSelected().get("uids");
				}
				DWREngine.setAsync(false);
				equMgm.updateQc(uids,qcid,function(str){
					if(str == 0){
						dsOutSub.reload();
						ds.reload();
						qcWin.hide();
					}else{
						Ext.example.msg("提示","请重新选择！");
					}
				});
				DWREngine.setAsync(true);
			}else{
				Ext.example.msg("提示","请选择您需要的数据！");
			}
		}
	});  
    var grid = new Ext.grid.EditorGridPanel({
        // basic properties
    	id: 'grffid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true
		},
		tbar:['->',quryButton,'-',selectBtn],
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean:"com.sgepit.pmis.equipment.hbm.EquGoodsQc",					
      	business: "baseMgm",
      	primaryKey:"uids"
   }); 
   
	function showqCWin(){
		qcWin.show();
		ds.baseParams.params = "pid='" + CURRENTAPPID + "'";
		ds.load({params : {start : 0,limit : PAGE_SIZE}});
	}
	 var qcWin = new Ext.Window({
        id:'selectqcwin',
        title:'设备清册明细',
        width: 800,
        height: document.body.clientHeight*0.7,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [grid]
    });

});

//TODO 显示工程量信息
function openWinFun(inSubUids){
	gclDs.baseParams.params = "pid='"+CURRENTAPPID+"' and fixedAssetList='"+inSubUids+"'";
	gclDs.load({params:{start:0,limit:PAGE_SIZE}});
	var openWin = new Ext.Window({
        title:'工程量信息',
        width : 800,
        height : 300,
        modal: true, 
        plain: true, 
        border: false, 
        layout: 'fit',
        resizable: false,
        closeAction :"hide",
        items : [gclGridPanel]
    });
    openWin.show();
}