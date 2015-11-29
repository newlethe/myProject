var beanOut = "com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimate"
var businessOut = "baseMgm"
var listMethodOut = "findWhereOrderby"
var primaryKeyOut = "uids"
var orderColumnOut = "uids"

var beanOutSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimateSub"
var businessOutSub = "baseMgm"
var listMethodOutSub = "findWhereOrderby"
var primaryKeyOutSub = "uids"
var orderColumnOutSub = "uids"

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";

var equTypeArr = new Array();
var equWareArr =  new Array();
var unitArr = new Array();
var getEquidstore = new Array();
var equidS = new Array();
var formPanel;

var pid = CURRENTAPPID;
var thisBdgid,thisBdgno,thisBdgname;
var bdgArr = new Array();

Ext.onReady(function(){
    
   //处理材料仓库下拉框
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
	//领用单位
	appMgm.getCodeValue("领用单位",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);			
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
    var fm = Ext.form;
    var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'type' : {name : 'type',fieldLabel : '出库类型'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {
			name : 'outNo',
			readOnly : true,
			fieldLabel : '出库单号',
			allowBlank : false,
			width : edit_flagLayout != ""?250:160
		},
		'outDate' : {
			name : 'outDate',
			fieldLabel : '出库日期',
			readOnly : true,
			width : edit_flagLayout != ""?250:160, 
			format: 'Y-m-d'
		},
		'recipientsUnit' : {
			name : 'recipientsUnit',
			fieldLabel : '领用单位',
			readOnly: true,
			allowBlank : edit_flagLayout==''?true:false,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: unitDs,
			width : edit_flagLayout != ""?250:160
		},
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述',width : 160},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人',width : 160},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人',width : 160},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人',width : 160},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号',width : 160},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）',width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注',width : 160},
        'equid' : {name : 'equid', fieldLabel : '仓库号', allowBlank : edit_flagLayout==''?true:false, width : edit_flagLayout != ""?250:160},
        'using' : {
            name : 'using', 
            fieldLabel : '领料用途',
            triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBdgTreeWin,
            allowBlank : edit_flagLayout != ""?false:true, 
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: bdginfoDs,
            readOnly : true,
            width : edit_flagLayout != ""?250:160
        },
        'equname' : {name : 'equname',fieldLabel : '材料名称',  width : 160},
        'judgmentFlag' : {name : 'judgmentFlag', fieldLabel : '设备出入库类型' },
        'kks' : {name : 'kks',fieldLabel : 'KKS编码',  width : 160},
        'userPart' : {name : 'userPart',fieldLabel : '安装部位',  width : 160}
	}
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveOut
	});
	var changePartBtn = new Ext.Button({
		id : 'changePartBtn',
		text : '更改部件',
		iconCls : 'btn',
		handler : changePart
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			   var recipientsUnit ='';
			   var equid='';
			   var using='';
			   var str = "";
			   var edit_uids1=formPanel.getForm().findField('uids').getValue();
			   DWREngine.setAsync(false);
			   baseMgm.findById(beanOut,edit_uids1,function(obj){
			       recipientsUnit = obj.recipientsUnit;
			       equid = obj.equid;
			       using = obj.using;
			   })
			   DWREngine.setAsync(true);
			   if(recipientsUnit=='' || recipientsUnit == null){
			      str +="领用单位"
			   }
			   if(equid == '' || equid == null){
			     str +="，仓库号"
			   }
			   if(edit_flagLayout != ""){
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
		
//			   	 Ext.example.msg("信息提示：", '<span style="color:red;">【'+str+'】</span>' +
//			   	 		'<br>等没有填写或填写后没有保存,<br>请填写、保存！');
//        	     return;              
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
		{name : 'type' ,type : 'string'},
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
        {name : 'judgmentFlag',type : 'stirng'},
        {name : 'kks',type : 'string'},
        {name : 'userPart',type : 'string'}
	];
    
    
	var formRecord = Ext.data.Record.create(ColumnsOut);
    var loadFormRecord = null;
    DWREngine.setAsync(false);
		baseMgm.findById(beanOut, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
	DWREngine.setAsync(true);
    
//    var conno;
//    var conname;
//    var partybno
    var moneysort;//合同分类二（财务）
    DWREngine.setAsync(false);
    baseMgm.findById(beanCon, edit_conid,function(obj){
//        conno = obj.conno;
//        conname = obj.conname;
//        partybno = obj.partybno;
        moneysort = obj.moneysort;
    });
    var moneysortText;
    for (var i = 0; i < conno2cw.length; i++) {
        if(moneysort == conno2cw[i][0]){
            moneysortText = conno2cw[i][1];
            break;
        }
    }
    
    
    //新材料仓库分类树
    var wareTreeCombo = new Ext.ux.TreeCombo({
        //id : 'equid',
        name : 'equid',
        fieldLabel : '仓库号',
        resizable:true,
        width:edit_flagLayout != ""?250:160,
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
//        if(node.id){
//	        	for(var j=0;j<equidS.length;j++){
//		             if(node.id ==equidS[j]){
//		        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
//		        	   wareTreeCombo.setRawValue("");
//		        	   return;	                
//		             }
//		         }
//        	}	
        var equid = "";
        for (var i = 0; i < equWareArr.length; i++) {
            if (node.id == equWareArr[i][1]){
                equid = equWareArr[i][2]+" - "+equWareArr[i][1];
                break;
            }
        }
        //this.setValue(node.id);
        formPanel.getForm().findField("equid").setValue(node.id);
        this.setRawValue(equid);
        wareTreeCombo.validate();
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
            treeName : "equBdgTree",
            businessName : "equBaseInfo",
            bdgid : CURRENTAPPID+'-0101,'+CURRENTAPPID+'-0102',
            parent : 0
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
                    if(thisBdgid == null || thisBdgid == "0"){
                        Ext.example.msg('提示信息','请选择概算项！');
                        return false;
                    }
                    var form = formPanel.getForm();
                    form.findField('using').setValue(thisBdgid);
                    form.findField('using').setRawValue(thisBdgname+"-"+thisBdgid);
                    bdgTreeWin.hide();
                }
            }
        ]
    });

    treePanelNew.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = CURRENTAPPID+'-01';
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
        height: 420,
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
    if(edit_flagLayout != ''){
	    unitCom.on('select',function(){
	       var getStr = '';
	       var sql = "select c.property_name from PROPERTY_CODE c  where c.TYPE_NAME = (" +
	       		" select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀') and c.property_code = (" +
	       		" select property_code from property_code where type_name = (select uids from property_type  " +
	       		" where type_name='填写单位') and property_name='"+unitCom.getRawValue()+"')"
	       DWREngine.setAsync(false);
	       baseMgm.getData(sql,function(str){
	           if(str.length>0){
	               getStr = str;
//	               formPanel.getForm().findField('outNo').setValue(str+"-"+newCkNo)
	           }       
	       })
	       
	       DWREngine.setAsync(true);
	       var conno='';
	       var conmoneyno='';//财务合同编码
		   DWREngine.setAsync(false);
		   baseMgm.findById(beanCon, edit_conid, function(obj) {
				conno = obj.conno;
	            conmoneyno = obj.conmoneyno;
	            
		   });
		   DWREngine.setAsync(true);
		   // 处理出库单号
		   var newCkNo = "-"+conno.replace(/^\n+|\n+$/g,"")+ "-暂估出库-";//prefix +"-"+
		   DWREngine.setAsync(false);
		   equMgm.getEquNewDhNoToSb(CURRENTAPPID, newCkNo, "out_No",
					"wz_goods_out_estimate", null,"judgment_flag='body'", function(str) {
						newCkNo = str;
					});
		   DWREngine.setAsync(true);
		   var value = formPanel.getForm().findField('outNo').getValue();
		   if(value == null || value==""){
		      formPanel.getForm().findField('outNo').setValue(getStr+newCkNo)
		   }else{
			    var strs = value.split('-');
				var str = getStr;
				for(var i=1;i<strs.length;i++){
				    str +="-"+strs[i];
				}
		       formPanel.getForm().findField('outNo').setValue(str)
		   }
		   
	    })
    }
    
    if(edit_flagLayout !=''){
		formPanel = new Ext.FormPanel({
			id:"formOut",
			region : 'north',
			height : edit_flagLayout == ''?85:110,
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:5px 10px;',
			tbar : ['<font color=#15428b><B>暂估出库单信息<B></font>','->',saveBtn,'-',cancelBtn,'-'],
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
							new fm.Hidden(fcOut['type']),
							new fm.Hidden(fcOut['isInstallation']),
//							new fm.ComboBox(fcOut['recipientsUnit']),
							unitCom,
							new fm.TextField(fcOut['outNo']),
	                        wareTreeCombo,
							new fm.Hidden(fcOut['equname']),
							new fm.Hidden(fcOut['equid']),
							new fm.Hidden(fcOut['judgmentFlag']),
							new fm.Hidden(fcOut['grantDesc']),					
							new fm.Hidden(fcOut['handPerson']),
							new fm.Hidden(fcOut['remark'])
						]
					},{
						layout : 'form',
						columnWidth: .5,
						border : false,
						items : [
							new fm.DateField(fcOut['outDate']),
	                        new fm.ComboBox(fcOut['using']),
							new fm.Hidden(fcOut['recipientsUser']),
							new fm.Hidden(fcOut['shipperNo']),
							new fm.Hidden(fcOut['kks']),
                            new fm.Hidden(fcOut['userPart']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							new fm.Hidden(fcOut['proUse'])
						]
					}
/*					,{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
//							userPartForm,
							new fm.Hidden(fcOut['recipientsUnitManager']),
//							kksForm,
							new fm.Hidden(fcOut['proUse'])
						]
					}*/
					]
				}
			]
		});    
    }else{
		formPanel = new Ext.FormPanel({
			id:"formOut",
			region : 'north',
			height : edit_flagLayout == ''?85:110,
			border : false,
			labelAlign : 'right',
			bodyStyle : 'padding:5px 10px;',
			tbar : ['<font color=#15428b><B>暂估出库单信息<B></font>','->',saveBtn,'-',cancelBtn,'-'],
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
							new fm.Hidden(fcOut['uids']),
							new fm.Hidden(fcOut['pid']),
							new fm.Hidden(fcOut['conid']),
							new fm.Hidden(fcOut['treeuids']),
							new fm.Hidden(fcOut['finished']),
							new fm.Hidden(fcOut['type']),
							new fm.Hidden(fcOut['isInstallation']),
							new fm.TextField(fcOut['outNo']),
	                        wareTreeCombo,
	                        userPartForm,
							new fm.Hidden(fcOut['equname']),
							new fm.Hidden(fcOut['equid']),
							new fm.Hidden(fcOut['judgmentFlag']),
							new fm.Hidden(fcOut['grantDesc']),					
							new fm.Hidden(fcOut['handPerson']),
							new fm.Hidden(fcOut['remark'])
						]
					},{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
							new fm.DateField(fcOut['outDate']),
	                        new fm.ComboBox(fcOut['using']),
							new fm.Hidden(fcOut['recipientsUser']),
							new fm.Hidden(fcOut['shipperNo'])
						]
					},{
						layout : 'form',
						columnWidth: .33,
						border : false,
						items : [
							new fm.ComboBox(fcOut['recipientsUnit']),
							new fm.Hidden(fcOut['recipientsUnitManager']),
							kksForm,
							new fm.Hidden(fcOut['proUse'])
						]
					}]
				}
			]
		});    
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
		'outNum' : {name : 'outNum',fieldLabel : '出库数量', decimalPrecision : 4},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
        'price' : {name : 'price', fieldLabel : '入库单价', allowBlank : false},
        'amount' : {name : 'amount', fieldLabel : '出库金额', allowBlank : false},
        'kcMoney' : {name : 'kcMoney', fieldLabel : '库存金额'},
        'useParts' : {name : 'useParts',fieldLabel : '安装部位'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'}
	};
	var smOutSub = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmOutSub = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
//	smOutSub,
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
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 100
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
		},{
			id : 'graphNo',
			header : fcOutSub['graphNo'].fieldLabel,
			dataIndex : fcOutSub['graphNo'].name,
			align : 'center',
            hidden : true,
			width : 100
		},{
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
			width : 80
		},{
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			editor : new fm.NumberField(fcOutSub['outNum']),
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'right',
			width : 80
		},{
			id : 'price',
			header : fcOutSub['price'].fieldLabel,
			dataIndex : fcOutSub['price'].name,
//			editor : new fm.NumberField(fcOutSub['price']),
			renderer : function(v,m,r){
//					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'right',
			width : 80
		},{
			id : 'amount',
			header : fcOutSub['amount'].fieldLabel,
			dataIndex : fcOutSub['amount'].name,
			editor : new fm.NumberField(fcOutSub['amount']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'right',
			width : 80
		},{
			id : 'kcMoney',
			header : fcOutSub['kcMoney'].fieldLabel,
			dataIndex : fcOutSub['kcMoney'].name,
			renderer : function(v,m,r){
                return v
		    },
			align : 'right',
			width : 80
		},{
			id : 'stockNum',
			header : "库存数量",
			dataIndex:'stockNum',
			align : 'right',
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
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0]){
					   storage = equWareArr[i][2]+"-"+equWareArr[i][1];
					   break;
					}
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
			editor : new fm.NumberField(fcOutSub['useParts']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'center',
			hidden : edit_flagLayout!=""?false:true,
			width : 80
		}, {
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			editor : new fm.NumberField(fcOutSub['kksNo']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
                return v
		    },
			align : 'center',
			hidden : edit_flagLayout!=""?false:true,
			width : 80
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
		{name:'kksNo',type:'string'}
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
		kksNo : ''
	}
	var dsOutSub = new Ext.data.Store({
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
    dsOutSub.load({params:{start:0,limit:10}});
    var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id:"gridPanelSub",
		ds : dsOutSub,
		cm : cmOutSub,
		sm : smOutSub,
		title : '暂估出库单明细',
		clicksToEdit : 2,
		tbar : ['<font color=#15428b><B>暂估出库单明细<B></font>','-',changePartBtn,'-'],
		addBtn : false,
		saveHandler : saveOutSub,
		deleteHandler : deleteOutSub,
		saveBtn : true,
		delBtn : true,
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
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
			afteredit:function(e){
				if(e.field == "outnum"){
					var record = e.record;
			    	var realOld = e.originalValue;
			    	var valOld = "";
			    	var realNew = e.value;
			    	if(realNew<0){
			    		record.set('outNum',realOld);
			    		return false;
			    	}
					var stocknum;
					DWREngine.setAsync(false);
	    			wzbaseinfoMgm.getStockNumFromStock(record.get('stockId'),function(num){
	    				stocknum=num;
	    			});
	    			wzbaseinfoMgm.getOutNumFromOutSub(record.get('uids'),function(num){
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
					var getPrice = record.get('price');
					var getNum = record.get('outNum');
					record.set('amount',(getPrice*getNum).toFixed(2));
					
				}
			}
		}
	});
	

	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
    	items: [gridPanelSub]
	})
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [formPanel, tabPanel]
	});
	
   if(editFlag ==""){
	    //新增时根据合同分类二（财务）属性代码的中文配置，与仓库号中文对比匹配，自动设置
	    if(wareTreeCombo.getValue() == null || wareTreeCombo.getValue() == ""){
	        for (var i = 0; i < equWareArr.length; i++) {
	            if (moneysortText == equWareArr[i][1]){
	                wareTreeCombo.setValue(equWareArr[i][1]);
	                loadFormRecord.set("equid",equWareArr[i][1]);
	                wareTreeCombo.setRawValue(equWareArr[i][2]+" - "+equWareArr[i][1]);
	                break;
	            }
	        }
	    }
   }else{
	    wareTreeCombo.setValue(loadFormRecord.get("equid"));
	    for (var i = 0; i < equWareArr.length; i++) {
	        if (loadFormRecord.get("equid") == equWareArr[i][1]){
	            wareTreeCombo.setRawValue(equWareArr[i][2]+" - "+equWareArr[i][1]);
	            break;
	        }
	    }
   }
	formPanel.getForm().loadRecord(loadFormRecord);
	wareTreeCombo.validate();
    function saveOut(){
		var form = formPanel.getForm();
		
        var checkBlank = ['recipientsUnit','equid']
        if(edit_flagLayout != ""){
        	checkBlank.push('using');
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
    	wzbaseinfoMgm.addOrUpdateWzOutEstimate(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','材料出库保存失败！');
    		}else{
    			Ext.example.msg('提示信息','材料出库保存成功！');
                dsOutSub.reload();
    		}
    	});
    	DWREngine.setAsync(true);
	}
	function changePart(){
		parent.tabPanel.setActiveTab(0);
		parent.selectWin.close();
	}
	//保存材料部件信息，并更新材料库存数量
	function saveOutSub(){
		var records=dsOutSub.getModifiedRecords();
		if(records == ''){
            Ext.example.msg('提示信息','请先修改数据在保存！');
            return;		  
		}
        var countKksNo = 0;
        var countUseParts = 0;
        for(var i = 0; i < records.length;i ++){
        	if(records[i].get('kksNo') == ''||records[i].get('kksNo') == null ){
        	       countKksNo ++;  
        	}
        	if(records[i].get('useParts') ==''||records[i].get('useParts') == null){
        	       countUseParts ++;
        	}
        }
        if(countUseParts >0 && (edit_flagLayout != '')){
            Ext.example.msg('提示信息','安装部位为必填项，请填写后在保存！');
            return;
        }
        if(countKksNo >0 && (edit_flagLayout != '')){
        	Ext.example.msg('提示信息','KKS编码为必填项，请填写后在保存！');
            return;
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
        }
        
		var flag=true;
		if(records.length!=0){
			for(var i=0;i<records.length;i++){
				var oldstocknum;
				var oldoutNum;
				DWREngine.setAsync(false);
    			wzbaseinfoMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
    				oldstocknum=num;
    			});
    			wzbaseinfoMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
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
					var oldstocknum;
					var oldoutNum;
					DWREngine.setAsync(false);
	    			wzbaseinfoMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
	    				oldstocknum=num;
	    			});
	    			wzbaseinfoMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
	    				oldoutNum=num;
	    			});
	    			DWREngine.setAsync(true);
	    			var newstockNum=oldstocknum+oldoutNum-records[i].get('outNum');
	    			DWREngine.setAsync(false);
	    			  wzbaseinfoMgm.updateStockNum(newstockNum,records[i].get('stockId'),function(){
	   						    			  	
	    			  });
	    			DWREngine.setAsync(true);
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
		wzbaseinfoMgm.getStockNumFromStock(record.get('stockId'),function(num){
			oldstocknum=num;
		});
		DWREngine.setAsync(true);
		var newstockNum=oldstocknum+record.get('outNum');
		DWREngine.setAsync(false);
		  wzbaseinfoMgm.updateStockNum(newstockNum,record.get('stockId'),function(){
				    			  	
		  });
		DWREngine.setAsync(true);
		gridPanelSub.defaultDeleteHandler();
	}
});