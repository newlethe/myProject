var beanOut = "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "uids";

var beanOutSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var quryButton;
var equTypeArr = new Array();
var equWareArr =  new Array();
var unitArr = new Array();
var useUnitArr = new Array();
var getEquidstore = new Array();
var equidS = new Array();
var bodyArr = new Array();
var userPartArray = new Array();
var formPanel;
var usePartWin;
var smOutSub;
var dsOutSub;
//用于判断安装主体设备字段是否必填
var installationBodyFlag = true;

var pid = CURRENTAPPID;
var thisBdgid,thisBdgno,thisBdgname;
var thisBodyparentId,thisBodyTreeid,thisBodyName;
var bdgArr = new Array();
var conPartybNoArr = new Array();
var subjectAllnameArr = new Array();
var qcArr = new Array();
var thisAssetTreeid;
var thisAssetIsleaf;
var proacmWin;//概算与工程量清单树的窗口
var proacmArr = new Array();//工程量数组
var updateEquid;//用于修改入库单时仓库号的判断
var oldWarehouseNo;//用于修改入库单仓库号时，入库单的判断，防止入库单号重复或变更

Ext.onReady(function(){

	//处理设备仓库下拉框
    DWREngine.setAsync(false);
    DWREngine.beginBatch();
    baseMgm.getData("select e.equ_no,e.equ_name,e.kksno,e.ggxh,e.equ_make,e.remark from equ_goods_qc e where pid='"+CURRENTAPPID+"'",function(list){
	     	for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]);
		            temp.push(list[i][2]);
		            temp.push(list[i][3]);
		            temp.push(list[i][4]);
		            temp.push(list[i][5]);
		            qcArr.push(temp);
	           }
	     });
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
	//材料类型equTypeArr
	appMgm.getCodeValue("材料合同树分类",function(list){
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
			});
    baseMgm.getData("select bdgid,bdgname,bdgno from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][2]);
            bdgArr.push(temp);
        }
    });
	// 把损坏赔偿加入到领料用途中去  yanglh 2013-11-22
	appMgm.getCodeValue("损坏赔偿",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName);			
			bdgArr.push(temp);			
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
	    });
	 baseMgm.getData("select  treeid,name,isleaf from wz_con_body_tree_view  " +
	 		   "start with  parentid='0' connect by prior treeid=parentid", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            bodyArr.push(temp);
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
    });
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
	//领用单位 新增领用单位 2013-09-28 yanglh
	appMgm.getCodeValue("设备出库领用单位",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);			
			useUnitArr.push(temp);			
		}
	});	    
	baseMgm.getData("select t.treeid,t.fixedname from FACOMP_FIXED_ASSET_LIST t where pid='" + CURRENTAPPID
                    + "' order by treeid ", function(list){
         for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            userPartArray.push(temp);
        }
    });
	baseMgm.getData("select t.PROAPPID,t.PRONO,t.proname from BDG_PROJECT t where pid='" + CURRENTAPPID
                    + "' and prono is not null order by PROAPPID", function(list){
         for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+"-"+list[i][2]);
            proacmArr.push(temp);
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
    DWREngine.endBatch();
	DWREngine.setAsync(true);

	var qcStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : qcArr
			});
	// 材料仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});
	var equTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equTypeArr
			});
	var unitDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : unitArr
			});
	var bdginfoDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bdgArr
			});
	var installationDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bodyArr
			});
	var conPartybNoDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : conPartybNoArr
			});
	var useUnitDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : useUnitArr
			});
	var typeArray = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['暂估出库', '暂估出库'], ['正式出库', '正式出库']]
			});
	var proacmDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : proacmArr
			});

    var fm = Ext.form;
    var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {
			name : 'outNo',
			readOnly : true,
			fieldLabel : '出库单号',
			width : edit_flagLayout != ""?200:160
		},
		'outDate' : {
			name : 'outDate',
			fieldLabel : '出库日期',
			readOnly : true,
			width : edit_flagLayout != ""?200:160, 
			format: 'Y-m-d'
		},
		'recipientsUnit' : {
			name : 'recipientsUnit',
			fieldLabel : '出库单位',
			readOnly: true,
			allowBlank : false,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: unitDs,
			width : edit_flagLayout != ""?200:160
		},
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述',width : 160},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人',width : 160},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人',width : 160},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人',width : 160},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号',width : 160},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）',width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注',width : 160},
        'equid' : {name : 'equid', fieldLabel : '仓库号', allowBlank : false, width : 160},
        'type' : {name : 'type', fieldLabel : '出库类型', width : 160,
			      width : 200,
				  valueField: 'k',
				  displayField: 'v',
				  mode: 'local',
	              typeAhead: true,
	           	  triggerAction: 'all', 
	           	  emptyText: '请选择...',
	           	  store: typeArray
		  },
        'using' : {
            name : 'using', 
            fieldLabel : '领料用途',
            triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBdgTreeWin,
            allowBlank : false,
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: bdginfoDs,
            readOnly : true,
            width : edit_flagLayout != ""?200:160
        },
        'equname' : {name : 'equname',fieldLabel : '材料名称',  width : 160},
        'judgmentFlag' : {name : 'judgmentFlag', fieldLabel : '设备出入库类型' },
        'kks' : {name : 'kks',fieldLabel : 'KKS编码',  allowBlank : true}//edit_flagLayout != ""?false:true, width : 160},
        ,'userPart' : {name : 'userPart',fieldLabel : '安装部位',  width : 160,allowBlank : true} //edit_flagLayout != ""?false:true}
        
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
        ,'installationBody' : {name : 'installationBody',fieldLabel : '安装主体设备',width : 160,
            triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBodyTreeWin,
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: installationDs,
            readOnly : true,
            width : edit_flagLayout != ""?200:160
        }
        ,'financialSubjects' : {name : 'financialSubjects' ,fieldLabel : '对应财务科目',//allowBlank : edit_flagLayout != ""?false:true,
           width : edit_flagLayout != ""?200:160,
           readOnly : true,
           listeners:{
                  focus : function(r){
                  	 if(r.getValue()== "" || r.getValue() == null ){
                  	   Ext.example.msg("信息提示：","请选择领料用途！");
                  	   return;
                  	 }
                  }
             }
           },
        'subjectAllname' : {
        		name : 'subjectAllname', fieldLabel : '凭证财务科目', width : 200,
				hidden : edit_flagLayout != ""?false:true,
				hideLabel:edit_flagLayout != ""?false:true
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
				width : edit_flagLayout != ""?200:160
		},
		'relateProacm' : {
			name : 'relateProacm',
			fieldLabel : '关联工程量清单'
		},
		'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
	};

	//关联工程量combo
	var relaProacmCombo = new Ext.form.ComboBox({
				name : 'relateProacm',
				fieldLabel : '关联工程量清单',
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				triggerClass : 'x-form-date-trigger',
				readOnly : true,
				onTriggerClick : showProacmTree,
				width : 200,
				store : proacmDs
			});

	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		disabled : showFlag == 'show' ? true:false,
		handler : saveOut
	});

    /**
     * 如果是主体材料，则此按钮为选择出库明细，
     * 否则，此按钮为更改部件
     * edit_flagLayout 不为空，则是主体材料
     * zhangh 2013-9-25
     */
    var selectOutSubFromInSubWin;
	var changePartBtn = new Ext.Button({
		id : edit_flagLayout == '' ? 'changePartBtn' : 'selectSubOut',
		text : edit_flagLayout == '' ? '更改部件' : '选择出库明细',
		iconCls : 'btn',
		disabled : showFlag == 'show' ? true:false,
        tooltip : edit_flagLayout == '' ? '更改部件' : '从入库单选择出库明细',
		handler : changePart
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			   var recipientsUnit ='';
			   var useUnit = '';
			   var equid='';
			   var using='';
			   var str = "";
			   var count = 0;
			   var kksNo = 0;
			   var suerPart = 0;
			   var edit_uids1=formPanel.getForm().findField('uids').getValue();
			   DWREngine.setAsync(false);
			   baseMgm.findById(beanOut,edit_uids1,function(obj){
			       recipientsUnit = obj.recipientsUnit;
			       equid = obj.equid;
			       useUnit = obj.useUnit;
			       using = obj.using;
			   })
			   DWREngine.setAsync(true);
			   DWREngine.setAsync(false);
			   baseMgm.getData("select count(*),count(kks_No),count(use_parts) from Wz_Goods_Stock_Out_Sub where out_id='"+edit_uids1+"'",function(list){
                    if(list.length>0){
                       count = list[0][0];
                       kksNo = list[0][1];
                       suerPart = list[0][2];
                    }
			   })
			   DWREngine.setAsync(true);
			   if(useUnit=='' || useUnit == null){
			      str +="领用单位"
			   }
			   if(equid == '' || equid == null){
			     str +="，仓库号"
			   }
			   if(edit_flagLayout != ""){
			   	    if(recipientsUnit=='' || recipientsUnit == null){
				      str +="出库单位"
				   }
				   if(using == '' || using == null){
				      str +="，领料用途"
				   }
			   }
			   if(str != ""){
				    Ext.Msg.show({
						title : '提示',
						msg : '出库单数据不完整，是否关闭？',
						buttons : Ext.Msg.YESNO,
						icon : Ext.MessageBox.QUESTION,
						fn : function(value) {
							if ("yes" == value) {
								  parent.selectWin.hide();
						   }else{
						      return;
						   }
						}
					});
			   }else{
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
        {name : 'type',type : 'string'},
        {name : 'using',type : 'string'},
        {name : 'equname',type : 'string'},
        {name : 'judgmentFlag',type :'string'},
        {name : 'kks',type : 'string'},
        {name : 'userPart',type : 'string'}
        
        ,{name : 'createMan', type : 'string'}
        ,{name : 'createUnit', type : 'string'}
        ,{name : 'installationBody',type : 'string'}
        ,{name : 'financialSubjects' ,type : 'string'}
        ,{name : 'subjectAllname' ,type : 'string'}
        ,{name : 'conPartybNo' ,type : 'string'}
        ,{name : 'useUnit' ,type : 'string'}
        ,{name : 'relateProacm' ,type : 'string'}
	];
    
    
	var formRecord = Ext.data.Record.create(ColumnsOut);
    var loadFormRecord = null;
    DWREngine.setAsync(false);
		baseMgm.findById(beanOut, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
	DWREngine.setAsync(true);

    //新材料仓库分类树
    var wareTreeCombo = new Ext.ux.TreeCombo({
        fieldLabel : '仓库号',
        resizable:true,
        width:edit_flagLayout != ""?200:160,
        treeWidth : 230,
        allowBlank : false,
        loader:new Ext.tree.TreeLoader({
            url: MAIN_SERVLET,
            requestMethod: "GET",
            baseParams: {
                ac : "tree",
                treeName:"ckxxTreeNew",
                businessName:"equBaseInfo", 
                parent: '01'
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
    
//TODO 供应商
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
			 width : edit_flagLayout != ""?200:160})
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
        if(node.id){
	        	for(var j=0;j<equidS.length;j++){
		             if(node.id ==equidS[j]){
		        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
		        	   wareTreeCombo.setRawValue("");
		        	   return;	                
		             }
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
        wareTreeCombo.validate()
         if(edit_flagLayout!=''){
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
				equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo1,"out_No","wz_goods_stock_out",null,"judgment_flag='body'",function(str){
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
            treeName : edit_flagLayout != ""?"equBdgTreeCode":"equBdgTree",
            businessName : "equBaseInfo",
            bdgid : '0101,0102,0103,0104',
            parent : 0,
            codeName : '损坏赔偿' //和属性代码中的损坏赔偿想对应 yanglh 2013-11-22
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
        rootVisible : edit_flagLayout != ""?false:true,
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
                    if(thisBdgid == null || thisBdgno == "0" || thisBdgno == "02"){
                        Ext.example.msg('提示信息','请选择该分类下的子项！');
                        return false;
                    }
                    var form = formPanel.getForm();
					var	getBdgid = thisBdgno.substring(0, 2);//损坏赔偿中不需要处理 对应财务科目 yanglh 2013-11-22
					if(getBdgid == '02'){
						form.findField('using').setValue(thisBdgid);
						form.findField('using').setRawValue(thisBdgname + "-" + thisBdgno);
						DWREngine.setAsync(false);
						baseMgm.getData("select subject_allname from FACOMP_FINANCE_SUBJECT where pid = '"+CURRENTAPPID+"' and subject_bm = '25208'", function(str) {
							if (str.length > 0) {
								form.findField('financialSubjects').setValue(str);
							}
						});
						DWREngine.setAsync(true);
						bdgTreeWin.hide();
						return false;
					}
					var len = thisBdgno.length;
					if (len == 4) {
						form.findField('financialSubjects').setValue(thisBdgname + "-" + thisBdgname);
					} else if (len > 4 && len < 9) {
						var bdgidFour = thisBdgno.substring(0, 4);// 对应财务科目长度为4的父节点信息
						DWREngine.setAsync(false);
						baseMgm.getData("select t.bdgname from BDG_INFO  t where t.bdgno='" + bdgidFour + "'", function(str) {
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
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno='" + bdgidFour + "'",function(str) {
									if (str.length > 0) {
										nameF = str;
									}
								});
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno='" + bdgidEight + "'",function(str) {
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
            }
        ]
    });

    treePanelNew.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid =  edit_flagLayout != ""?'0':'01';
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
        height: 400,
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
	//对应主体设备树的构建
    var bodyRootText = "对应合同主体设备";
    
    var bodyRootNew = new Ext.tree.AsyncTreeNode({
        text : bodyRootText,
        iconCls : 'task-folder',
        expanded : true,
        id : '0'
    })
    var treeLoaderBody = new Ext.tree.TreeLoader({
        url : MAIN_SERVLET,
        baseParams : {
            ac : "columntree",
            treeName : "WzBodyTreeList",
            businessName : "wzglMgmImpl",
            parent : ''
        },
        clearOnLoad : true,
        uiProviders : {
            'col' : Ext.tree.ColumnNodeUI
        }
    });

    var treePanelBody = new Ext.tree.ColumnTree({
        width : 550,
        header : false,
        border : false,
        lines : true,
        autoScroll : true,
        columns : [{
            header : '对应主体设备名称',
            width : 380, // 隐藏字段
            dataIndex : 'name'
        }, {
            header : '对应主体设备编码',
            width : 140,
            dataIndex : 'treeid'
        }, {
            header : '主键',
            width : 0,
            dataIndex : 'uuids'
        }, {
            header : '是否子节点',
            width : 0,
            dataIndex : 'isleaf'
        }, {
            header : '父节点',
            width : 0,
            dataIndex : 'parentid'
        }],
        loader : treeLoaderBody,
        root : bodyRootNew,
        //rootVisible : false,
        tbar : [
             {
                iconCls : 'icon-expand-all',
                tooltip : 'Expand All',
                text    : '全部展开',
                handler : function() {
                    bodyRootNew.expand(true);
                }
            }, '-', {
                iconCls : 'icon-collapse-all',
                tooltip : 'Collapse All',
                text    : '全部收起',
                handler : function() {
                    bodyRootNew.collapse(true);
                }
            }, '-', {
                text : '选择对应主体设备',
                iconCls : 'add',
                handler : function(){
                    if(thisBodyparentId == null || thisBodyparentId == "0"){
                        Ext.example.msg('提示信息','请选择对应主体设备！');
                        return false;
                    }
                    var form = formPanel.getForm();
                    form.findField('installationBody').setValue(thisBodyTreeid);
                    form.findField('installationBody').setRawValue(thisBodyName);
                    bodyTreeWin.hide();
                }
            }
        ]
    });

    treePanelBody.on('beforeload', function(node) {
       var parentid = node.attributes.treeid;
        if (parentid == null)
            parentid = '0';
        var baseParams = treePanelBody.loader.baseParams
        baseParams.parent = parentid;
    })
    //点击的树不是叶子，则补选中，并展开
    treePanelBody.on('beforeclick', function(node,e){
//        if(!node.isLeaf()){
//            node.expand();
//            return false;
//        }
    });
    
    treePanelBody.on('click', function(node, e){
        var tempNode = node
        var isRootNodeBody = (rootText == tempNode.text);
        thisBodyparentId = isRootNodeBody  ? "0" : tempNode.attributes.parentid;
        thisBodyTreeid = isRootNodeBody ? "0" : tempNode.attributes.treeid;
        thisBodyName = isRootNodeBody ? "0" : tempNode.attributes.name;
    });
    var bodyTreeWin = new Ext.Window({
        id:'selectBodywin',
        title:'选择对应主体设备',
        width: 550,
        height: 400,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [treePanelBody],
        listeners : {
            'show' : function(){
	            treePanelBody.render(); // 显示树
	            treePanelBody.expand();
            }
        }
    })
    
    function showBdgTreeWin(){
        bdgTreeWin.show();
    }
    
    function showBodyTreeWin(){
    	 if(installationBodyFlag){
    	 	bodyTreeWin.show();
    	 }
         
    }
    
    var kksForm = '';
    var userPartForm = '';
    if(edit_flagLayout == ''){
       kksForm = new fm.Hidden(fcOut['kks']);
       userPartForm = new fm.Hidden(fcOut['userPart']);
    }else{
       kksForm = new fm.TextField(fcOut['kks']);
       userPartForm = new fm.TextField(fcOut['userPart']);
    }
    var unitCom =  new fm.ComboBox(fcOut['recipientsUnit']);
    var  typeComBox  = new fm.ComboBox(fcOut['type']);
	
	typeComBox.on('select',function(node){
		var gatType = "";
		var getSubNum = 0;
		var getUids = formPanel.getForm().findField('uids').getValue();
		var getUnit = formPanel.getForm().findField('recipientsUnit').getValue();
		var getEquid = formPanel.getForm().findField("equid").getValue();
		var getOutNo = formPanel.getForm().findField('outNo').getValue();
		var sql = "select t.type ,(select count(OUT_NO) from WZ_GOODS_STOCK_OUT_SUB r " +
		 		" where r.OUT_ID = t.uids) as num, RECIPIENTS_UNIT, OUT_NO,equid from WZ_GOODS_STOCK_OUT t " +
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
		if(typeComBox.getValue() != gatType){
		      if(getSubNum !=0){
		      	    typeComBox.setValue(gatType);
					Ext.MessageBox.alert("系统提示","执行该操作要先删除该出库单所有的出库单明细，请先删除该出库单所有明细在执行此操作！")
					return;
		      }else{
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
    if(edit_flagLayout != ''){
	    unitCom.on('beforeselect',function(){
            if(dsOutSub.getTotalCount() > 0){
                this.list.hide();
                Ext.example.msg("信息提示", "已经选择出库物资，不能修改出库单位！如需修改，请先删除出库物资！");
                return false;
            }
        });
	    unitCom.on('select',function(){
//	       var getStr = '';
////	       var sql = "select c.property_name from PROPERTY_CODE c  where c.TYPE_NAME = (" +
////	       		" select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀') and c.property_code = (" +
////	       		" select property_code from property_code where type_name = (select uids from property_type  " +
////	       		" where type_name='填写单位') and property_name='"+unitCom.getRawValue()+"')"
//   	       	var sql = "select c.property_name from PROPERTY_CODE c  where c.TYPE_NAME = (" +
//	       		" select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀') and c.property_code ='"+unitCom.getValue()+"'";
//	       DWREngine.setAsync(false);
//	       baseMgm.getData(sql,function(str){
//	           if(str.length>0){
//	               getStr = str+"";
////	               formPanel.getForm().findField('outNo').setValue(str+"-"+newCkNo)
//	           }       
//	       })
//	       
//	       DWREngine.setAsync(true);
//	       var length = getStr.length+1;
//	       var conno='';
//		   DWREngine.setAsync(false);
//		   baseMgm.findById(beanCon, edit_conid, function(obj) {
//				conno = obj.conno;
//		   });
//		   DWREngine.setAsync(true);
//		   // 处理出库单号
//		   var newCkNo = '';
//		   if(typeComBox.getValue()=='暂估出库'){
//		       newCkNo = "-"+conno.replace(/^\n+|\n+$/g,"")+ "-ZGCK-";//prefix +"-"+
//		   }else{
//		       newCkNo = "-"+conno.replace(/^\n+|\n+$/g,"")+ "-CK-";//prefix +"-"+
//		   }
//		   DWREngine.setAsync(false);
//		   equMgm.getEquNewDhNoToSbJn(CURRENTAPPID, newCkNo, "out_No",
//					"wz_goods_stock_out", null,"judgment_flag='body'",length, function(str) {
//						newCkNo = str;
//					});
//		   DWREngine.setAsync(true);
//		   var value = formPanel.getForm().findField('outNo').getValue();
//		   if(value == null || value==""){
//		      formPanel.getForm().findField('outNo').setValue(getStr+newCkNo)
//		   }else{
////		     value = value.substring(2,value.length); 
//			    var strs = value.split('-');
//				var str = getStr;
//				for(var i=1;i<strs.length;i++){
//				    str +="-"+strs[i];
//				}		   	
//		       formPanel.getForm().findField('outNo').setValue(str)
//		   }
		   
	    })
    }
    
    //TODO 凭证财务科目
    	var subjectAllnameCombo = new Ext.ux.TreeCombo({
				name : 'subjectAllname',
				fieldLabel : '凭证财务科目',
				resizable : true,
				hidden : edit_flagLayout != ""?false:true,
                hideLabel: edit_flagLayout != ""?false:true,
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

	var outRemindBtn = new Ext.Button({
		id : 'outRemind',
		text : USERDEPTID == '102010103' ? '反馈回物资部' : '出库提醒',// 工程部
		icon : CONTEXT_PATH + "/jsp/res/images/icon-no-group.gif",
		cls : "x-btn-text-icon",
		handler : function(){
			var rtn = window.showModalDialog(CONTEXT_PATH
							+ "/Business/equipment/equMgm/equ.goods.stock.out.remind.jsp?outId="
							+ edit_uids + "&type=wz", '',
					"dialogWidth:800px;dialogHeight:450px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		}
	})

    if(edit_flagLayout == ''){
		formPanel = new Ext.FormPanel({
			id:"formOut",
			region : 'north',
			height : 115,
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:5px 10px;',
			tbar : ['<font color=#15428b><B>出库单信息<B></font>','->',saveBtn,'-',cancelBtn,'-'],
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
                        	new fm.Hidden(fcOut['createMan']),
                        	new fm.Hidden(fcOut['createUnit']),
                        	new fm.Hidden(fcOut['type']),
							new fm.TextField(fcOut['outNo']),
		                    wareTreeCombo,
//		                    new fm.TextField(fcOut['userPart']),
		                    userPartForm,
		                    new fm.ComboBox(fcOut['using']),
							new fm.Hidden(fcOut['equname']),
							new fm.Hidden(fcOut['judgmentFlag']),
							new fm.Hidden(fcOut['equid']),					
							new fm.Hidden(fcOut['grantDesc']),					
							new fm.Hidden(fcOut['handPerson']),
							new fm.Hidden(fcOut['remark']),
							new fm.Hidden(fcOut['conPartybNo'])
						]
					},{
						layout : 'form',
						columnWidth: .5,
						border : false,
						items : [
							new fm.ComboBox(fcOut['useUnit']),
							new fm.DateField(fcOut['outDate']),
		                    kksForm,
		                    conPartybNoComBo,
							new fm.Hidden(fcOut['recipientsUser']),
							new fm.Hidden(fcOut['installationBody']),
							new fm.Hidden(fcOut['shipperNo']),
							new fm.Hidden(fcOut['financialSubjects']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							new fm.Hidden(fcOut['proUse'])
						]
					},{
						layout : 'form',
						columnWidth: 0,
						border : false,
						items : [
						    
//							new fm.ComboBox(fcOut['recipientsUnit']),
//						    unitCom,
//						    new fm.TextField(fcOut['kks']),
							kksForm,
							conPartybNoComBo,
							new fm.Hidden(fcOut['financialSubjects']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							new fm.Hidden(fcOut['proUse'])
						]
					}]
				}
			]
		});
    }else{
		formPanel = new Ext.FormPanel({
			id:"formOut",
			region : 'north',
			height : 135,
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:5px 10px;',
			tbar : view == 'view' ? ['<font color=#15428b><B>出库单信息<B></font>']
					: ['<font color=#15428b><B>出库单信息<B></font>','->',saveBtn,'-',cancelBtn,'-'],
			items : [
				{
					layout : 'column',
					border : false,
					items : [
						{
						layout : 'form',
						columnWidth : .33,
						border : false,
						items : [
                        	typeComBox,
                        	new fm.ComboBox(fcOut['useUnit']),
		                    wareTreeCombo,
							conPartybNoComBo,
							
							new fm.Hidden(fcOut['uids']),
							new fm.Hidden(fcOut['pid']),
							new fm.Hidden(fcOut['conid']),
							new fm.Hidden(fcOut['treeuids']),
							new fm.Hidden(fcOut['finished']),
							new fm.Hidden(fcOut['isInstallation']),
                        	new fm.Hidden(fcOut['createMan']),
//                        	new fm.Hidden(fcOut['type']),
                        	new fm.Hidden(fcOut['createUnit']),
                        	new fm.Hidden(fcOut['equname']),
							new fm.Hidden(fcOut['judgmentFlag']),
							new fm.Hidden(fcOut['equid']),					
							new fm.Hidden(fcOut['grantDesc']),					
							new fm.Hidden(fcOut['handPerson']),
							new fm.Hidden(fcOut['remark'])
						]
					},{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
						    unitCom,
							new fm.DateField(fcOut['outDate']),
		                    new fm.ComboBox(fcOut['using']),
		                    new fm.TextField(fcOut['financialSubjects']),
		                    
							new fm.Hidden(fcOut['recipientsUser']),
							new fm.Hidden(fcOut['shipperNo']),
                            new fm.Hidden(fcOut['kks']),
                            new fm.Hidden(fcOut['userPart']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							new fm.Hidden(fcOut['proUse'])
						]
					}
					,{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
						    new fm.TextField(fcOut['outNo']),
						    subjectAllnameCombo,
						    new fm.ComboBox(fcOut['installationBody'])
//						    relaProacmCombo
						]
					}
					]
				}
			]
		});
    }
    if(USERDEPTID == '102010103'){
        unitCom.setDisabled(true);
        wareTreeCombo.setDisabled(true);
		wareTreeCombo.getTree().on('beforeshow', function() {
					return false;
				})
    } 
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '材料库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '物资编码'},
		'equType' : {name : 'equType',fieldLabel : '物资类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '物资名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'inNum' : {name : 'inNum',fieldLabel : '入库数量'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量',decimalPrecision:4},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
        'price' : {name : 'price', fieldLabel : '入库单价'+requiredMark, allowBlank : false},
        'amount' : {name : 'amount', fieldLabel : '出库金额'+requiredMark, allowBlank : false},
        'kcMoney' : {name : 'kcMoney', fieldLabel : '库存余额'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码',  width : 160,
            allowBlank : true
        },
        'qcId' : {
        			name : 'qcId', 
		            fieldLabel : 'KKS编码(生产)',
		            width : 200
        		},
        'useParts' : {id: 'useParts',name : 'useParts',fieldLabel : '安装部位',  width : 160,allowBlank : true}
        ,'inUids' : {name : 'inUids',fieldLabel : '入库单主键'}
        ,'inSubUids' : {name : 'inSubUids',fieldLabel : '入库明细主键'}
        ,'memo' : {name : 'memo' ,fieldLabel : '备注'}
        ,'equBoxNo' : {name: 'equBoxNo' ,fieldLabel : '箱件号',width : 100}
        ,'wzSubUids' : {name: 'wzSubUids' ,fieldLabel : '冲回主键',width : 100}
		,'relateAsset' : {name: 'relateAsset' ,fieldLabel : '关联资产',width : 100},
		'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
	};

	//TODO 安装分类树
	var userPartLoad = new Ext.tree.TreeLoader({
	            url: MAIN_SERVLET,
	            requestMethod: "GET",
	            baseParams: {
	                ac : "tree",
	                treeName:"getFACompFixedAssetList",
	                businessName : 'faBaseInfoService',
	                parent: '01',
	                pid : CURRENTAPPID
	            },
	            clearOnLoad: true,
	            uiProviders:{
	                'col': Ext.tree.ColumnNodeUI
	            }
        });
	var userPartRoot = new Ext.tree.AsyncTreeNode({
	        text : '安装分类',
	        iconCls : 'task-folder',
	        expanded : true,
	        id : '01'
	    });
	var usePartTreePanel = new Ext.tree.ColumnTree({
        width : 550,
        header : false,
        border : false,
        lines : true,
        autoScroll : true,
        columns : [{
            header : '安装部位【<span style="color:red;">双击或单击选择</span>】',
            width : 380, 
            dataIndex : 'fixedname'
        }, {
            header : '安装部位分类编码',
            width : 0,// 隐藏字段
            dataIndex : 'treeid'
        }, {
            header : '主键',
            width : 0,
            dataIndex : 'uuids'
        }, {
            header : '是否子节点',
            width : 0,
            dataIndex : 'isleaf'
        }, {
            header : '父节点',
            width : 0,
            dataIndex : 'parentid'
        }],
        loader : userPartLoad,
        root : userPartRoot,
        tbar : [
             {
                iconCls : 'icon-expand-all',
                tooltip : 'Expand All',
                text    : '全部展开',
                handler : function() {
                    userPartRoot.expand(true);
                }
            }, '-', {
                iconCls : 'icon-collapse-all',
                tooltip : 'Collapse All',
                text    : '全部收起',
                handler : function() {
                    userPartRoot.collapse(true);
                }
            }
        ]
    })
   	usePartTreePanel.on('beforeload', function(node) {
        var treeid = node.id;
        if (treeid == null)
            treeid = '01';
        var baseParams = usePartTreePanel.loader.baseParams
        baseParams.parent = treeid;
    })
   usePartTreePanel.on('click', function(node, e){
        var tempNode = node;
        var isRootNodeBody = (rootText == tempNode.text);
        if(node.id=='01'){
        	Ext.example.msg("系统提示","请选择该分类下的子分类！");
        	return;
        }
        var r = smOutSub.getSelected();
        r.set('useParts',tempNode.id);
        usePartWin.hide();
    });
    
	usePartWin = new Ext.Window({
        id:'selectUsePart',
        title:'选择安装部位',
        width: 500,
        height: 400,
        layout : 'fit',
        border: false, 
        resizable: false,
        modal : true,
        closeAction :"hide",
        items : [usePartTreePanel],
        listeners : {
            'show' : function(){
	            usePartTreePanel.render(); // 显示树
	            usePartTreePanel.expand();
            },
            'close' : function(){
            	usePartWin.hide();
            }
        }
    });

	/**
	 * 固定资产清单树，只有土建节点（0101，0102）
	 * pengy 2014-01-20
	 */
	var rootNode = new Ext.tree.AsyncTreeNode({
				id : "01",
				text : "固定资产分类",
				iconCls : 'folder',
				expanded : true
			});
	var assetTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "getFACompFixedAssetList",
					businessName : "faFixedAssetService",
					parentid : "01",
					pid : CURRENTAPPID,
					relateAsset : "0101,0102,0104,0105"
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});
	var selectAssetBtn = new Ext.Button({
				id : "selectAssetBtn",
				text : '选择',
				iconCls : 'option',
				handler : function() {
					var treeid = thisAssetTreeid;
					var isleaf = thisAssetIsleaf;
					if (typeof treeid == 'undefined' || treeid=='0101' || treeid=='0102' || isleaf=='0'){
						Ext.example.msg('提示', '请选择房屋建筑物或构筑物下的叶子节点！');
						return;
					}
					var rec = smOutSub.getSelected();
					rec.set('relateAsset', treeid);
					assetWin.hide();
				}
			});
	var clearAssetBtn = new Ext.Button({
				id : "clearAssetBtn",
				text : '清空关联资产',
				iconCls : 'remove',
				handler : function() {
					var rec = smOutSub.getSelected();
					rec.set('relateAsset', '');
					assetWin.hide();
				}
			});

	var assetTree = new Ext.tree.ColumnTree({
			id : 'assetTree',
			region : 'center',
			width : 240,
			minSize : 240,
			maxSize : 550,
			frame : false,
			header : false,
			border : false,
			collapsible : true,
			collapseMode : 'mini',
			rootVisible : true,
			split : true,
			lines : true,
			autoScroll : true,
			animate : false,
			tbar : ['<font color=#15428b><b>固定资产清单</b></font>', '-', {
						iconCls : 'icon-expand-all',
						tooltip : '全部展开',
						handler : function() {
							rootNode.expand(true);
						}
					}, '-', {
						iconCls : 'icon-collapse-all',
						tooltip : '全部折叠',
						handler : function() {
							rootNode.collapse(true);
						}
					}, '-', selectAssetBtn, '-', clearAssetBtn],
			columns : [{
						header : '固定资产名称',
						dataIndex : 'fixedname',
						width : 270
					}, {
						header : '固定资产编码',
						dataIndex : 'fixedno',
						width : 140
					}, {
						header : '主键',
						dataIndex : 'uids',
						width : 0,
						renderer : function(value) {
							return "<div id='uids'>" + value + "</div>";
						}
					}, {
						header : '树编码',
						dataIndex : 'treeid',
						width : 0,
						renderer : function(value) {
							return "<div id='treeid'>" + value + "</div>";
						}
					}, {
						header : '是否子节点',
						dataIndex : 'isleaf',
						width : 0,
						renderer : function(value) {
							return "<div id='isleaf'>" + value + "</div>";
						}
					}, {
						header : '父节点',
						dataIndex : 'parentid',
						width : 0,
						renderer : function(value) {
							return "<div id='parentid'>" + value + "</div>";
						}
					}],
			loader : assetTreeLoader,
			root : rootNode
		});
	assetTree.on('beforeload', function(node) {
				var treeid = node.attributes.treeid;
				if (treeid == null) {
					treeid = "01";
				}
				assetTree.loader.baseParams.parentid = treeid;
				assetTree.loader.baseParams.pid = CURRENTAPPID;
			});
	assetTree.on('click', function(node, e) {
				var tempNode = node;
				thisAssetTreeid = tempNode.attributes.treeid;
				thisAssetIsleaf = tempNode.attributes.isleaf;
			});
	var assetWin = new Ext.Window({
			id : 'assetWin',
			title : '关联固定资产',
			layout : 'fit',
			border : false,
			width : 450,
			height : 350,
			minWidth : 300,
			minHeight : 200,
			resizable : true,
			closeAction : "hide",
			items : [assetTree]
		});

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
			id : 'inUids',
			header : fcOutSub['inUids'].fieldLabel,
			dataIndex : fcOutSub['inUids'].name,
			hidden : true
		},{
			id : 'inSubUids',
			header : fcOutSub['inSubUids'].fieldLabel,
			dataIndex : fcOutSub['inSubUids'].name,
			hidden : true
		},{
			id : 'equBoxNo',
			header : fcOutSub['equBoxNo'].fieldLabel,
			dataIndex : fcOutSub['equBoxNo'].name,
			align : 'center',
			 hidden : edit_flagLayout !="" ? true : false ,
			width : 100
		},{
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 140
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
			width : 180
		},{
			id : 'ggxh',
			header : fcOutSub['ggxh'].fieldLabel,
			dataIndex : fcOutSub['ggxh'].name,
			align : 'center',
			width : 100
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
			width : 100
		},{
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
			width : 80
		},{
			id : 'inNum',
			header : fcOutSub['inNum'].fieldLabel,
			dataIndex : fcOutSub['inNum'].name,
            hidden : edit_flagLayout !="" ? false : true,
            align : 'right',
			width : 80
		},{
			id : 'otherOutNum',
			header : "<div title='此单价的物资出库后剩余数量。'>剩余数量</div>",
			dataIndex : 'otherOutNum',
            hidden : edit_flagLayout !="" ? false : true,
            renderer : function(v,m,r){
                var otherOutNum = 0;
                var sql = " SELECT nvl(SUM(s.out_num),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
				    " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = (select type from wz_goods_stock_out where uids='"+r.get('outId')+"') " +
				    " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' ";
                DWREngine.setAsync(false);
                baseMgm.getData(sql, function(list) {
	                if (list && list.length > 0) {
	                    otherOutNum = list[0];
	                }
	            });
                DWREngine.setAsync(true);
                return "<div  id='num"+r.get('uids')+"' title='此单价的物资出库后剩余数量。' style='cursor:pointer;color:red;'>"+(r.get('inNum')-otherOutNum)+"</div>";
            },
            align : 'right',
			width : 80
		},{
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
		},{
			id : 'outNumCH',
			header : '可冲回数量',
			dataIndex : 'outNumCH',
			renderer : function(v,m,r){
				var number = 0;
				DWREngine.setAsync(false);
        		baseMgm.getData("select nvl((nvl(t.out_num, 0) + (select nvl(sum(t.out_num), 0) from wz_goods_stock_out_sub t " +
        				" where t.wz_sub_uids = '"+r.get('wzSubUids')+"' )), 0) " +
        						" from wz_goods_stock_out_sub t where t.uids = '"+r.get('wzSubUids')+"'",function(num){
        				number = num;
        			
        		})
        		DWREngine.setAsync(true);
        		return number;
		    },
		    hidden : showFlag == 'show' ? false : true,
			align : 'right',
			width : 80
		},{
			id : 'price',
			header : fcOutSub['price'].fieldLabel,
			dataIndex : fcOutSub['price'].name,
//			editor : new fm.NumberField(fcOutSub['price']),
			renderer : function(v) {
				return isNaN(v) ? parseFloat(v, 10).toFixed(2) : v.toFixed(2);
			},
			align : 'right',
            hidden : edit_flagLayout!=""?false:true,
			width : 80
		},{
			id : 'amount',
			header : fcOutSub['amount'].fieldLabel,
			dataIndex : fcOutSub['amount'].name,
			editor : USERDEPTID == '102010103'?"":new fm.NumberField(fcOutSub['amount']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return "<div id='amount'>"+v+"</div>"
		    },
			align : 'right',
            hidden : edit_flagLayout!=""?false:true,
			width : 80
		},{
			id : 'kcMoney',
			header : fcOutSub['kcMoney'].fieldLabel,
			dataIndex : fcOutSub['kcMoney'].name,
			align : 'right',
			hidden : edit_flagLayout != ""?false:true,
            renderer : function(v,m,r){
                var otherOutMoney = 0;
	            var sql = " SELECT nvl(SUM(s.amount),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
	                " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = (select type from wz_goods_stock_out where uids='"+r.get('outId')+"')" +
	                " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' " +
	                " AND s.uids <> '"+r.get('uids')+"'";
	            DWREngine.setAsync(false);
	            baseMgm.getData(sql, function(list) {
	                if (list && list.length > 0) {
	                    otherOutMoney = list[0];
	                }
	            });
	            DWREngine.setAsync(true);
				return "<div id='money"+r.get('uids')+"'>"+( parseFloat((r.get('inNum')*r.get('price') - otherOutMoney - r.get('amount')).toFixed(2)))+"</div>";
            },
			width : 80
		},{
			id : 'stockNum',
			header : "库存数量余额",
			dataIndex:'stockNum',
			align : 'right',
            hidden : edit_flagLayout != ""?true:false,
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
    			wzbaseinfoMgm.getWzStockNumFromStock(record.get('stockId'),function(num){
    				stocknum=num;
    			});
    			DWREngine.setAsync(true);
    			return stocknum;
			}
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
		}, {
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
            hidden : edit_flagLayout != ""?false:true,
			width : 120
		}, {
			id : 'useParts',
			header : fcOutSub['useParts'].fieldLabel,
			dataIndex : fcOutSub['useParts'].name,
			editor : new fm.TextField(fcOutSub['useParts']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				var str = '';
				for(var i=0;i<userPartArray.length;i++){
				    if(v == userPartArray[i][0]){
				        str = userPartArray[i][1];
				        break;
				    }
				}
                return (str==''?v:str);
		    },
			align : 'center',
			//hidden : edit_flagLayout != ""?false:true,
			width : 120
		}, {
			id : 'relateAsset',
			header : fcOutSub['relateAsset'].fieldLabel,
			dataIndex : fcOutSub['relateAsset'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				var str = '';
				for(var i=0;i<userPartArray.length;i++){
				    if(v == userPartArray[i][0]){
				        str = userPartArray[i][1];
				        break;
				    }
				}
                return (str==''?v:str);
		    },
			width : 120
		}, {
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			editor : new fm.TextField(fcOutSub['kksNo']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'center',
			hidden : edit_flagLayout != ""?false:true,
			width : 80
		},{
			id : 'qcId',
			header : fcOutSub['qcId'].fieldLabel,
			dataIndex : fcOutSub['qcId'].name,
			//editor : new fm.ComboBox(fcOutSub['qcId']),
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
								if(i>=0 & i<list.length-1){
									kks +=list[i]+",";
								}else{
									kks +=list[i];
								}
								
							}
							
						}
					}
					
				});
				DWREngine.setAsync(true);
				m.attr = "style=background-color:#FBF8BF";
                return kks;
		    }
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
			hidden : edit_flagLayout != ""?false:true,
			width : 180
		}, {
			id : 'wzSubUids',
			header : fcOutSub['wzSubUids'].fieldLabel,
			dataIndex : fcOutSub['wzSubUids'].name,
			hidden : true
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
		{name:'qcId',type:'string'}
		,{name:'inNum', type:'float'}
		,{name:'inUids',type:'string'}
		,{name:'inSubUids',type:'string'}
		,{name:'memo', type:'string'}
		,{name:'equBoxNo',type:'string'}
		,{name:'wzSubUids',type:'string'}
		,{name:'relateAsset',type:'string'},
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
		inNum : 0,
		outNum : 0,
		price : 0,
		amount : 0,
		storage : '',
		kcMoney :0,
		useParts : '',
		kksNo : '',
		qcId : '',
		memo : '',
		equBoxNo : '',
		wzSubUids : ''
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
    var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id:"gridPanelSub",
		ds : dsOutSub,
		cm : cmOutSub,
		sm : smOutSub,
		title : '出库单明细',
		clicksToEdit : 2,
		tbar : view == 'view' ? ['<font color=#15428b><B>出库单明细<B></font>']
				: ['<font color=#15428b><B>出库单明细<B></font>','-',changePartBtn,'-'],
		addBtn : false,
		saveHandler : saveOutSub,
		deleteHandler : deleteOutSub,
		saveBtn : view != 'view',
		delBtn : view != 'view',
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
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
			"cellclick":function(grid, rowIndex, columnIndex, e){
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                //kks编码（生产）
                if(fieldName == 'qcId'){
                    showqCWin();
                }
                if (fieldName == 'relateAsset'){
                	showAssetWin();
                }
			},
			beforeedit : function(e){
				if(view == 'view')
					return false;
			},
			afteredit:function(e){
				if(e.field == "outNum"){
					var record = e.record;
			    	var realOld = e.originalValue;
			    	var valOld = "";
			    	var realNew = e.value;
			    	if(realNew<0){
			    		//record.set('outNum',realOld);
			    		//return false;
			    	}
			    	if(edit_flagLayout != ""){
	                    //出库明细与入库明细像关联，因此出库数量修改为和入库数量进行判断
	                    var r = record;
	                    var inNum = r.get('inNum')
	                    var otherOutNum
	                    var sql = " SELECT nvl(SUM(s.out_num),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
	                        " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = (select type from wz_goods_stock_out where uids='"+r.get('outId')+"') " +
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
	                            msg: '出库数量修改出错，出库数量只能再增加'+(inNum - otherOutNum)+record.get('unit'),
	                            icon: Ext.Msg.WARNING, 
	                            width:200,
	                            buttons: Ext.MessageBox.OK
	                        });
	                        record.set('outNum',realOld);
	                    }
                    }else{
                    	//非主体设备冲回出库修改数量
                    	if(showFlag == 'show'){
							var number = 0;
							var oldNum = 0;
							DWREngine.setAsync(false);
			        		baseMgm.getData("select nvl((nvl(t.out_num, 0) + (select nvl(sum(t.out_num), 0) from wz_goods_stock_out_sub t " +
			        				" where t.wz_sub_uids = '"+record.get('wzSubUids')+"')), 0) " +
			        						" from wz_goods_stock_out_sub t where t.uids = '"+record.get('wzSubUids')+"'",function(num){
			        				number = parseInt(num);
			        		})
			        		DWREngine.setAsync(true);
	                   		DWREngine.setAsync(false);
                    		baseMgm.getData("select nvl(t.out_num, 0) from wz_goods_stock_out_sub t where t.uids = '"+record.get('uids')+"'",function(num){
                    				oldNum = num;		
                    			
                    		})
                    		DWREngine.setAsync(true);
			        		if((record.get('outNum')/1+(parseInt(number)-parseInt(oldNum))/1)<0 || record.get('outNum')/1>0){
			        			record.set('outNum',realOld);
			        			if((parseInt(number)-parseInt(oldNum))/1 == 0){
			        				Ext.example.msg('信息提示','该物资已冲回完，请删除该物资！');
			        			}else{
			        				Ext.example.msg("信息提示","请输入【<span style='color:red'>0</span> ~ <span style='color:red'>"+(-(parseInt(number)-parseInt(oldNum)))+"</span>】的数据！");
			        			}
			        		}
                    	}else{
				    		if(realNew<0){
					    		record.set('outNum',realOld);
					    		return false;
					    	}
		                    //非主体材料
							var stocknum;
							DWREngine.setAsync(false);
			    			wzbaseinfoMgm.getWzStockNumFromStock(record.get('stockId'),function(num){
			    				stocknum=num;
			    			});
			    			wzbaseinfoMgm.getWzOutNumFromOutSub(record.get('uids'),function(num){
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
					var getPrice = record.get('price');
					var getNum = record.get('outNum');
					record.set('amount',(getPrice*getNum).toFixed(2));
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
		            var sql = " SELECT nvl(SUM(s.amount),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
		                " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = (select type from wz_goods_stock_out where uids='"+record.get('outId')+"')" +
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
            aftersave : function(grid, idsOfInsert, idsOfUpdate, primaryKey,  bean){
            if(edit_flagLayout != ""){
                var ds = grid.getStore();
                var idsArr = idsOfUpdate.split(",")
                var checkMsg = '';
                for (var i = 0; i < idsArr.length; i++) {
                    var record = ds.getById(idsArr[i])
                    if(record.get('stockNum') == 0 && record.get('kcMoney') != 0){
                        checkMsg += '物资【'+record.get('boxNo')+'】的[库存数量余额]为0，但是[库存余额]不为0。<br>';
                    }
                }
                if(checkMsg !=''){
                    checkMsg += "请核对以上物资的出库金额！"
                    Ext.Msg.show({
                        title: '提示',
                        msg: checkMsg,
                        width:500,
                        buttons: Ext.MessageBox.OK
                    });
                }
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
//			,// 安装部位下拉选择
//			'celldblclick' : function(grid, rowIdx, colIdx) {
//				if (colIdx == 23) {
//					if (edit_flagLayout != "") {
//						grid.startEditing(rowIdx, colIdx);
//						usePartWin.show();
//					}
//				}
//			}
		}
	});
// 修改数据后如果翻页，提醒先保存在进行下一页的编辑 yanglh 2013-11-21
    dsOutSub.on('beforeload',function(store, obj){
    	var record = dsOutSub.getModifiedRecords();
    	if(record.length>0){
			Ext.example.msg("系统提示","当前有数据被修改过，请保存后在编辑下一页的数据！");
			return false;        	
    	}
	})	
//	var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
//				"?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=CK";
//	var filePanel = new Ext.Panel({
//		id : 'filePanel',
//		title : '附件',
//		layout: 'fit',
//		html:"<iframe id='fileWinFrame' src='"+url+"' width='100%' height='100%' frameborder='0'></iframe>"
//	});
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
    	items: [gridPanelSub]
	})
	
	var viewport = new Ext.Viewport({
		layout:'border',
        items: [formPanel, tabPanel]
	});
	smOutSub.on('rowselect',function(){
		if(USERDEPTID == '102010103'){
			with(gridPanelSub.getTopToolbar().items){
			     get('del').disable();
			}
			changePartBtn.disable();
		}	
	});

	if (editFlag == "") {
		formPanel.getForm().loadRecord(loadFormRecord);
	} else {
		wareTreeCombo.setValue(loadFormRecord.get("equid"));
		for (var i = 0; i < equWareArr.length; i++) {
			if (loadFormRecord.get("equid") == equWareArr[i][1]) {
				formPanel.getForm().findField("equid").setValue(equWareArr[i][1]);
				wareTreeCombo.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][2]);
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

		formPanel.getForm().loadRecord(loadFormRecord);

		if (loadFormRecord.get("relateProacm") != null && loadFormRecord.get("relateProacm") != "" && relaProacmCombo){
			relaProacmCombo.setValue(loadFormRecord.get("relateProacm"));
			var relateArr = loadFormRecord.get("relateProacm").split(',');
			var relateStr = "";
			for (var i = 0; i < relateArr.length; i++) {
				for (var j = 0; j < proacmArr.length; j++) {
					if (relateArr[i] == proacmArr[j][0]) {
						relateStr += proacmArr[j][1] + ",";
						break;
					}
				}
			}
			relaProacmCombo.setRawValue(relateStr.substr(0, relateStr.length-1));
		}
	}
    if (installationBodyFlag) {
		var form = formPanel.getForm();
		if (loadFormRecord.get("using") != null) {
			if (loadFormRecord.get("using").substring(0, 4) == '0101') {// 概算为建筑部分时安装主体设备项
				installationBodyFlag = false;
				form.findField('installationBody').disable();
			} else {
				installationBodyFlag = true;
				form.findField('installationBody').enable();
			}
		}
	}
	if (conPartybNoComBo) {
		conPartybNoComBo.setValue(loadFormRecord.get("conPartybNo"));
			for (var i = 0; i < conPartybNoArr.length; i++) {
				if (loadFormRecord.get("conPartybNo") == conPartybNoArr[i][0]) {
					conPartybNoComBo.setRawValue(conPartybNoArr[i][1]);
					break;
				}
			}
	}

	wareTreeCombo.validate();

    function saveOut(){
		var form = formPanel.getForm();
        var checkBlank = new Array();
        if(installationBodyFlag){
            checkBlank = ['useUnit','equid','using'];            
        }else{
            checkBlank = ['useUnit','equid','using'];
        }
        if(edit_flagLayout != ""){
//            checkBlank.push('userPart');
//            checkBlank.push('kks');
        	//checkBlank.push('using');
        	 checkBlank.push('recipientsUnit');
            if(USERDEPTID == '102010103'){
                    checkBlank.push('financialSubjects');
            }
//            if(thisBdgid != null && thisBdgid.substring(0,4)=='0102')
//                    checkBlank.push('installationBody');
                   
        }
        for(var i = 0;i<checkBlank.length;i++){
	        if(form.findField(checkBlank[i]).getValue() == null || form.findField(checkBlank[i]).getValue() == ""){
	            Ext.example.msg('提示信息','【'+fcOut[checkBlank[i]].fieldLabel+'】不能为空！');
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
    	wzbaseinfoMgm.addOrUpdateWzOut(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','材料出库保存失败！');
    			 updateEquid=formPanel.getForm().findField("equid").getValue();
				 oldWarehouseNo=formPanel.getForm().findField("outNo").getValue();
    		}else{
    			Ext.example.msg('提示信息','材料出库保存成功！');
                dsOutSub.reload();
    		}
    	});
    	DWREngine.setAsync(true);
	}
    
    
    // TODO : ======从入库明细中选择出库======
    var equTypeArrs = [['1','主体设备'],['2','备品备件'],['3','专用工具']]
    var equTypeDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: equTypeArrs
    });
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    var fcInSub = {
        'uids' : {name : 'uids',fieldLabel : '主键'},
		'warehouseNo' : {name:'warehouseNo',fieldLabel:'入库单据号'},
		'warehouseDate' : {name:'warehouseDate',fieldLabel:'入库日期'},
        'conid' : {name : 'conid', fieldLabel : '合同主键'},
        'joinUnit' : {name : 'joinUnit', fieldLabel : '入库单位'},
        'stockno' : {name : 'stockno', fieldLabel : '存货编码'},
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
        'warehouseName' : {name : 'warehouseName',fieldLabel : '材料名称'},
        'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
        'unit' : {name : 'unit',fieldLabel : '单位'},
        'inWarehouseNo' : {name : 'inWarehouseNo',fieldLabel : '入库数量',decimalPrecision:4},
        'hasOutNum' : {name : 'hasOutNum',fieldLabel : '剩余数量',decimalPrecision:4},
        'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价', decimalPrecision:6},
        'totalMoney' : {name : 'totalMoney',fieldLabel : '入库金额', decimalPrecision:2},
        'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
    };
    var smInSub = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
    var cmInSub = new Ext.grid.ColumnModel([
        smInSub,
        {
            id : 'uids',
            header : fcInSub['uids'].fieldLabel,
            dataIndex : fcInSub['uids'].name,
            hidden : true
        }, {
            id : 'conid',
            header : fcInSub['conid'].fieldLabel,
            dataIndex : fcInSub['conid'].name,
            hidden : true
        }, {
	        id : 'warehouseNo',
	        header : fcInSub['warehouseNo'].fieldLabel,
	        dataIndex : fcInSub['warehouseNo'].name,
	        align : 'center',
	        width : 200
	    }, {
	        id : 'warehouseDate',
	        header : fcInSub['warehouseDate'].fieldLabel,
	        dataIndex : fcInSub['warehouseDate'].name,
	        align : 'center',
	        renderer : formatDate,
	        width : 100
        }, {
            id : 'joinUnit',
            header : fcInSub['joinUnit'].fieldLabel,
            dataIndex : fcInSub['joinUnit'].name,
            align : 'center',
            width : 160
	    }, {
	        id : 'stockno',
	        header : fcInSub['stockno'].fieldLabel,
	        dataIndex : fcInSub['stockno'].name,
	        align : 'center',
	        width : 180
        },{
            id : 'warehouseType',
            header : fcInSub['warehouseType'].fieldLabel,
            dataIndex : fcInSub['warehouseType'].name,
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
            header : fcInSub['warehouseName'].fieldLabel,
            dataIndex : fcInSub['warehouseName'].name,
            align : 'center',
            width : 200
        },{
            id : 'ggxh',
            header : fcInSub['ggxh'].fieldLabel,
            dataIndex : fcInSub['ggxh'].name,
            align : 'center',
            width : 100
        }, {
			id : 'special',
			header : fcInSub['special'].fieldLabel,
			dataIndex : fcInSub['special'].name,
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
			header : fcInSub['jzNo'].fieldLabel,
			dataIndex : fcInSub['jzNo'].name,
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
            header : fcInSub['unit'].fieldLabel,
            dataIndex : fcInSub['unit'].name,
            align : 'center',
            width : 100
        },{
            id : 'inWarehouseNo',
            header : fcInSub['inWarehouseNo'].fieldLabel,
            dataIndex : fcInSub['inWarehouseNo'].name,
            align : 'right',
            width : 80
        },{
            id : 'hasOutNum',
            header : fcInSub['hasOutNum'].fieldLabel,
            dataIndex : fcInSub['hasOutNum'].name,
            renderer : function(v){
                return '<div style="color:red">'+v+'</div>'
            },
            align : 'right',
            width : 80
        },{
            id : 'intoMoney',
            header : fcInSub['intoMoney'].fieldLabel,
            dataIndex : fcInSub['intoMoney'].name,
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
            header : fcInSub['totalMoney'].fieldLabel,
            dataIndex : fcInSub['totalMoney'].name,
            align : 'right',
            width : 80
        }
    ]);

    var beanInSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinSubView";
	var businessInSub = "baseMgm";
	var listMethodInSub = "findWhereOrderby";
	var primaryKeyInSub = "uids";
	var orderColumnInSub = "warehouseDate";
    
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
    
    var dsInSub = new Ext.data.GroupingStore({
        baseParams : {
            ac : 'list',
            bean : beanInSub,
            business : businessInSub,
            method : listMethodInSub,
            params : " 1=2 "
        },
        proxy : new Ext.data.HttpProxy({
                    method : 'GET',
                    url : MAIN_SERVLET
                }),
        reader : new Ext.data.JsonReader({
                    root : 'topics',
                    totalProperty : 'totalCount',
                    id : primaryKeyInSub
                }, ColumnsSub),
        remoteSort : true,
        pruneModifiedRecords : true,
        sortInfo: {field: 'stockno', direction: "desc"},    // 分组
        groupField: 'stockno'   // 分组
    });
    dsInSub.setDefaultSort(orderColumnInSub, 'desc');
    
    var doSelectBtn = new Ext.Button({
        id : 'doSelectBtn',
        text : '确定选择',
        iconCls : 'btn',
        handler : function(){
            //var records = collectionToRecords();
            var records=new Array();
		    for(var i = 0;i<collection.getCount();i++){
		        records.push(collection.item(i));
		    }
            
            var recordOutSub = dsOutSub.getAt(0);
            var OutSubType = '';
            if(recordOutSub){
                OutSubType = recordOutSub.get('equType');
            }
            if(records == null || records.length == 0){
                Ext.example.msg('提示信息','请先选择材料！');
                return;
            }      
            var inSubUidsArr = new Array()
            var sbType=records[0].get('warehouseType');
            for (var i = 0; i < records.length; i++) {
                if(records[i].get('warehouseType')!=sbType){
                    Ext.example.msg('提示信息','请先选择相同材料类型的材料！');
                    return;
                }
                if(OutSubType!=''&&records[i].get('warehouseType')!=OutSubType){
                    Ext.example.msg('提示信息','请先选择相同材料类型的材料！');
                    return;
                }
                inSubUidsArr.push(records[i].get("uids"));
            }
            var outUids=formPanel.getForm().findField('uids').getValue();
            var outNo = formPanel.getForm().findField('outNo').getValue();
            
            //保存明细
            DWREngine.setAsync(false);
            wzbaseinfoMgm.doSelectInSubToOutSub(inSubUidsArr,outUids,outNo,function(str){
                if(str == "1"){
                    selectOutSubFromInSubWin.hide();
                    Ext.example.msg('提示信息','出库单材料选择成功！');
                    dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
                }
            })
            DWREngine.setAsync(true);
        }
    })
    
    var gridPanelInSub = new Ext.grid.GridPanel({
        id:"gridPanelInSub",
        ds : dsInSub,
        cm : cmInSub,
        sm : smInSub,
        tbar : ['<font color=#15428b><B>入库单明细<B></font>','-',doSelectBtn],
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
            store: dsInSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    });
    
    storeSelects(dsInSub,smInSub);
    
	function changePart(){
		if(this.id == 'selectSubOut'){
			var outNo = "";
            var outUids=formPanel.getForm().findField('uids').getValue();
            var recipientsUnit = formPanel.getForm().findField('recipientsUnit').getValue();
            for (var i = 0; i < unitArr.length; i++) {
                if(recipientsUnit == unitArr[i][1]){
                    recipientsUnit = unitArr[i][0];
                    break;
                }
            }
			var recipientsUnit = null;
			var useUnit = null;
			var equid = null;
			var using = null;
			var getUids = formPanel.getForm().findField('uids').getValue();
			DWREngine.setAsync(false);
			baseMgm.findById(beanOut,getUids,function(obj){
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
//                dsInSub.baseParams.params = "hasOutNum>0 and conid='"+edit_conid+"' and joinUnit='"+recipientsUnit+"'" +
//                    " and type= (select case type when '暂估出库' then '暂估入库' else '正式入库' end from WzGoodsStockOut where uids='"+outUids+"')  and uids not in (select inSubUids from "+beanOutSub+" where outId = '"+outUids+"')";
            	dsInSub.baseParams.params = "hasOutNum>0 and conid='"+edit_conid+"' and joinUnit='"+detailName+"'" +
						typeS+" uids not in (select inSubUids from "+beanOutSub+" where outId = '"+outUids+"')";
                dsInSub.load({params:{start:0,limit:PAGE_SIZE}});
                smInSub.clearSelections();
                collection.clear();
            })
            selectOutSubFromInSubWin.show();
        }else{
			parent.tabPanel.setActiveTab(0);
			parent.selectWin.close();
		}
	}
    
	//保存材料部件信息，并更新材料库存数量
	function saveOutSub(){
		var records=dsOutSub.getModifiedRecords();
		if(records == ''){
            Ext.example.msg('提示信息','请先修改数据在保存！');
            return;		  
		}
//		for (var i = 0; i < records.length; i++) {
//			if (records[i].get('useParts') == '') {
//				Ext.example.msg('提示信息', '安装部位为必填项，请填写后在保存！');
//				return;
//			}
//			if (edit_flagLayout != "") {
//				if (records[i].get('kksNo') == '') {
//					Ext.example.msg('提示信息', 'KKS编码为必填项，请填写后在保存！');
//					return;
//				}
//			}
//		}
		var flag = 0;
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
            if(edit_flagLayout != ""){
	            //库存余额字段的数值，更改为从入库从表明细金额减去所有该物资出库金额，
	            //与“剩余数量”计算类似
	            var otherOutMoney = 0;
	            //totalMoney 入库金额
	            //amount 出库金额
	            var sql = " SELECT nvl(SUM(s.amount),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
	                " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = (select type from wz_goods_stock_out where uids='"+r.get('outId')+"') " +
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
	            //非主体材料保存
				var kcmoney = 0;
				var oldamount = 0;
				var totMonSql = "select nvl(sum(t.kc_money),0) from WZ_GOODS_STOCK t where t.judgment_flag ='body'"
						+ " and t.make_type='正式入库' and t.pid = '" + pid + "' and t.stock_no = '" + r.get('boxNo') + "'";
				DWREngine.setAsync(false);
				baseMgm.getData("select t.amount from WZ_GOODS_STOCK_OUT_SUB t where t.uids ='"
		    					+ r.get('uids') + "'", function(list){
		    				if(list && list.length > 0 && list[0]){
		    					oldamount = list[0];
		    				}
		    			})
				baseMgm.getData(totMonSql, function(list) {
							if (list && list.length > 0) {
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
    			wzbaseinfoMgm.getWzStockNumFromStock(records[i].get('stockId'),function(num){
    				oldstocknum=num;
    			});
    			wzbaseinfoMgm.getWzOutNumFromOutSub(records[i].get('uids'),function(num){
    				oldoutNum=num;
    			});
    			DWREngine.setAsync(true);
    			var newstockNum=oldstocknum+oldoutNum-records[i].get('outNum');
    			if(newstockNum<0){
					Ext.Msg.show({
						title: '提示',
			            msg: '材料'+records[i].get('equPartName')+'的出库数量不能大于库存数量',
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
					var oldstocknum = 0;
					var oldoutNum = 0;
                    var oldamount = 0;
					DWREngine.setAsync(false);
					//出入库台账统计
					if(edit_flagLayout !=""){
					    wzbaseinfoMgm.insertCLSubToFinishedRecord(CURRENTAPPID,records[i].get('stockId'),records[i].get('uids'),records[i].get('amount'),"CK");
					}
//                    if(edit_flagLayout == ""){
		    			wzbaseinfoMgm.getWzStockNumFromStock(records[i].get('stockId'),function(num){
		    				oldstocknum=num;
		    			});
		    			wzbaseinfoMgm.getWzOutNumFromOutSub(records[i].get('uids'),function(num){
		    				oldoutNum=num;
		    			});
		    			var newstockNum = oldstocknum+oldoutNum-records[i].get('outNum');
		    			baseMgm.getData("select t.amount from WZ_GOODS_STOCK_OUT_SUB t where t.uids ='"
		    					+ records[i].get('uids') + "'", function(list){
		    				if(list && list.length > 0 && list[0]){
		    					oldamount = list[0];
		    				}
		    			})
						wzbaseinfoMgm.updateWzStockNum(newstockNum, records[i].get('stockId'), oldamount - records[i].get('amount'), function() {
		   						    			  	
		    			  });
		    			DWREngine.setAsync(true);
//                    }
			   }
		      gridPanelSub.defaultSaveHandler();
		    }
		}
	};
	//删除选中的材料部件信息，并更新材料库存数量
	function deleteOutSub(){
		var record=smOutSub.getSelected();
		if(record == undefined){
            Ext.example.msg('提示信息','请选择您要删除的记录！');
            return;		    
		}
		var oldstocknum;
		DWREngine.setAsync(false);
		wzbaseinfoMgm.getWzStockNumFromStock(record.get('stockId'),function(num){
			oldstocknum=num;
		});
		DWREngine.setAsync(true);
		
		var newstockNum=0;
		//非主体设备冲回入库时，如果删除明细内容，库存要相加 yanglh 2013-12-21
		if((formPanel.getForm().findField('outNo').getValue().indexOf("-CHCK-") != -1)&&edit_flagLayout == ""){
			newstockNum = oldstocknum-record.get('outNum')
		}else{
			newstockNum = oldstocknum+record.get('outNum')
		}
		DWREngine.setAsync(false);
        //主体材料出库调整为从入库明细中选择，因此删除时不需要跟新库存数量。
        //只针对非主体设备出库进行更新库存的处理
		//删除后库存要发生改变2013-11-20 yanglh
//        if(edit_flagLayout == ""){
		wzbaseinfoMgm.updateWzStockNum(newstockNum,record.get('stockId'),record.get('amount'),function(){
					    			  	
			});
//        }
		 if(edit_flagLayout != ""){
		    equMgm.delEquGoodsFinishedRecord(record.get('stockId'));
		}
		DWREngine.setAsync(true);
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
		form.findField('installationBody').disable();
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
	
	//设备清册
	 quryButton = new Ext.Button({
		id:"quryButton",
		text:"查询",
		iconCls : 'option',
		handler:qury
	});
     //查询
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
				buttons:[{id:'btnQury',text:'查询' ,handler:quryEquGoodsQc},{id:'btnClose',text:'关闭' ,handler:function(){quryWin.hide()}}]
			});
			quryForm.getForm().reset();
			quryWin.show();
		}

	function quryEquGoodsQc() {
		var obj = quryForm.getForm().getValues();
		var equNo = obj.equNo;
		var equName = obj.equName;
		var kksNo = obj.kksNo;
		var ggxh = obj.ggxh;
		var equMake = obj.equMake;
		var str = "";
		if (equNo != "") {
			str += " and equNo like '%" + equNo + "%'";
		}
		if (equName != "") {
			str += " and equName like '%" + equName + "%'";
		}
		if (kksNo != "") {
			str += " and kksNo like '%" + kksNo + "%'";
		}
		if (ggxh != "") {
			str += " and ggxh like '%" + ggxh + "%'";
		}
		if (equMake != "") {
			str += " and equMake like '%" + equMake + "%'";
		}
		ds.baseParams.params = "pid='" + CURRENTAPPID + "'" + str + "";
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
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
				wzbaseinfoMgm.updateQc(uids,qcid,function(str){
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

	function showAssetWin() {
		assetWin.show();
	}

	//概算+工程量树 pengy 2014-04-03
	var proacmColumntree = new Ext.tree.ColumnTree({
				rootVisible : false,
				lines : true,
				autoScroll : true,
				animCollapse : false,
				animate : false,
//				checkModel : "cascade",//级联
				tbar : [{
							text : '全部展开',
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							handler : function() {
								proacmColumntree.root.expand(true);
							}
						}, '-', {
							text : '全部收起',
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							handler : function() {
								proacmColumntree.root.collapse(true);
							}
						}, '->', {
							text : '确定',
							tooltip : '确定',
							iconCls : 'add',
							handler : function() {
								var nodesArr = proacmColumntree.getChecked();
								var treeidArr = new Array();
								var treeids = "";
								if (nodesArr.length > 0) {
									for (var i = 0; i<nodesArr.length; i++) {
										treeidArr.push(nodesArr[i].id);
										treeids += nodesArr[i].id + ",";
									}
									relaProacmCombo.setValue(treeids.substr(0, treeids.length-1));
									var str = "";
									for (var j=0; j<treeidArr.length; j++){
										for (var k=0; k<proacmArr.length; k++){
											if (proacmArr[k][0] == treeidArr[j]){
												str += proacmArr[k][1] + ",";
												break;
											}
										}
									}
									relaProacmCombo.setRawValue(str.substr(0, str.length-1));
								} else {
									relaProacmCombo.setValue("");
									relaProacmCombo.setRawValue("");
								}
								proacmWin.hide();
							}
						}],
				columns : [{
							header : '主键',
							width :0, // 隐藏字段
							dataIndex : 'uids'
						}, {
							header : '名称',
							width :400,
							dataIndex : 'bdgname'
						}, {
							header : '编号',
							width : 140,
							dataIndex : 'prono'
						}, {
							header : '树节点',
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
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							baseParams : {
								ac : "columntree",
								treeName : "proacmTree",
								businessName : "equBaseInfo",
								bdgid : "",
								parentid : '0',
								relate : ""
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							text : 'root',
							id : '0',
							expanded : true,
							leaf : false,
							checked : false
						}),
				listeners : {
					beforeload : function(node) {
						var using = formPanel.getForm().findField("using").getValue();
						var relate = formPanel.getForm().findField("relateProacm").getValue();
						proacmColumntree.loader.baseParams.parentid = node.id;
						proacmColumntree.loader.baseParams.bdgid = using;
						proacmColumntree.loader.baseParams.relate = relate == null || relate == '' ? '' : relate;
					},
					load : function(node1) {
						node1.expand(true);
					}
				}
			});

	// 显示关联固定资产窗口 pengy 2014-04-02
	function showProacmTree() {
		var using = formPanel.getForm().findField("using").getValue();
		if (!using || using.substr(0,2)=='02') {
			Ext.example.msg('提示', '请先选择领料用途中工程概算下节点');
			return;
		}
		if (!proacmWin) {
			proacmWin = new Ext.Window({
						id : 'proacmWin',
						title : '选择工程量',
						height : 400,
						width : 550,
						layout : 'fit',
						border : false,
						resizable : true,
						closeAction : 'hide',
						items : [proacmColumntree],
						listeners : {
							'show' : function() {
								proacmColumntree.getRootNode().reload();
							}
						}
					})
		}
		proacmWin.show();
	}

});

// TODO 显示工程量信息
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
