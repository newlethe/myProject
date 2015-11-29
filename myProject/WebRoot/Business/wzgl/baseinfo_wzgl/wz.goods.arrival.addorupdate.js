var beanDh = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrival"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var equWareArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var billStateArr = new Array();
var joinUnitArray = new Array();
var equidS = new Array();

var gridPanelFj;
var formPanel;
var selectWin;

Ext.onReady(function(){
	
	var currentPid = CURRENTAPPID;
	DWREngine.setAsync(false);
	systemMgm.getUnitById(CURRENTAPPID, function(u) {
		if(u && u!=null && u!='null') {
			currentPid = u.upunit;
		}
	});
	
//材料供货厂家，合同管理中乙方单位
	var sql = "select uids,csmc from sb_csb where isused = '1' union all " +
			" select t.cpid uids,t.partyb csmc from CON_PARTYB t where t.PID='"+currentPid+"'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);		
			csnoArr.push(temp);			
		}
	});
    
    //查询合同默认乙方单位
    var partybno = "";
    baseMgm.getData("select t.partybno from CON_OVE t where t.conid = '"+edit_conid+"' ",function(str){
        partybno = str.toString();
    })
	
	//运输方式
	appMgm.getCodeValue("运输方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			sendArr.push(temp);			
		}
	});
	//参与交接单位
	appMgm.getCodeValue("参与交接单位",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyName);	
//			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			joinUnitArray.push(temp);			
		}
	});	
	//包装方式
	var sql = "select puuid,packstyle from Equ_Pack_Style";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			packArr.push(temp);			
		}
	});
	//卸车方式
	appMgm.getCodeValue("卸车方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			dumpArr.push(temp);			
		}
	});
	//箱件类别
	appMgm.getCodeValue("箱件类别",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			boxArr.push(temp);			
		}
	});
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
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
    
    //流程审批状态
    appMgm.getCodeValue('流程状态',function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            billStateArr.push(temp);   
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
	var csnoDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],   
		data: csnoArr
    });
    var sendDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: sendArr
    });
    var packDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: packArr
    });
    var storageDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equWareArr
    });
    var dumpDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: dumpArr
    });
    var boxDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: boxArr
    });
    var jzDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: jzArr
    });
    
	var fm = Ext.form;
	var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isOpen' : {name : 'isOpen',fieldLabel : '是否开箱'},
		'dhNo' : {
			name : 'dhNo',
			fieldLabel : '到货批号', 
			readOnly : true,
			width : 160
		},
		'dhDate' : {
			name : 'dhDate',
			fieldLabel : '到货日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'dhShi' : {name : 'dhShi',fieldLabel : '时'},
		'dhFen' : {name : 'dhFen',fieldLabel : '分'},
		'dhDesc' : {name : 'dhDesc',fieldLabel : '到货描述', allowBlank : false, width : 160},
		'csno' : {name : 'csno',fieldLabel : '供货厂家',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	listWidth : 215,
           	store: csnoDs,
           	width : 160
		},
		'receiveUser' : {name : 'receiveUser',fieldLabel : '接货人', width : 160},
		'boxNum' : {name : 'boxNum',fieldLabel : '箱件数量', width : 190},
		'totalWeight' : {name : 'totalWeight',fieldLabel : '总重量(吨)', width : 160},
		'sendType' : {
			name : 'sendType',
			fieldLabel : '运输方式', 
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: sendDs,
			width : 160
		},
		'carNo' : {name : 'carNo',fieldLabel : '车牌号', width : 190},
		'dumpType' : {
			name : 'dumpType',
			fieldLabel : '卸车方式', 
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: dumpDs,
			width : 160
		},
		'dumpUnit' : {name : 'dumpUnit',fieldLabel : '卸车单位', width : 160},
		'recordUser' : {name : 'recordUser',fieldLabel : '录单人', width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注', width : 190},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号', width : 160, readOnly : isFlwTask},
        'joinUnit' : {name : 'joinUnit',fieldLabel : '参与交接单位', allowBlank : false, width : 190},
        'joinPlace' : {name : 'joinPlace',fieldLabel : '交接地点', allowBlank : false, width : 160},
        
        'singleMaxWeight' : {name : 'singleMaxWeight',fieldLabel : '单体最重（吨）', width : 160},
        'volume' : {name : 'volume',fieldLabel : '体积', width : 160},
        'carrierPhoto' : {name : 'carrierPhoto',fieldLabel : '承运人电话', width : 160},
        'dhNoticeNo' : {name : 'dhNoticeNo',fieldLabel : '到货通知单编号',width : 160, allowBlank : false},
        'actualTime' : {name : 'actualTime' ,fieldLabel:'实际到货时间',width : 160,readOnly : true, format: 'Y-m-d'},
        'dhHandoverNo' : {name : 'dhHandoverNo' ,fieldLabel:'到货交接单编号',width : 190, allowBlank : false}
        
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
	}
	
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveArrival
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			parent.selectWin.close();
		}
	})
//	var finishCheck = new Ext.form.Checkbox({
//		id : 'finished',
//		name : 'finished',
//		fieldLabel : '完结',
//		//checked : true,
//		listeners : {
//			'check' : finishArrival
//		}
//	});
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isOpen', type : 'float'},
		{name : 'dhNo', type : 'string'},
		{name : 'dhDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'dhShi', type : 'string'},
		{name : 'dhFen', type : 'string'},
		{name : 'dhDesc', type : 'string'},
		{name : 'csno', type : 'string'},
		{name : 'receiveUser', type : 'string'},
		{name : 'boxNum', type : 'float'},
		{name : 'totalWeight', type : 'float'},
		{name : 'sendType', type : 'string'},
		{name : 'carNo', type : 'string'},
		{name : 'dumpType', type : 'string'},
		{name : 'dumpUnit', type : 'string'},
		{name : 'recordUser', type : 'string'},
		{name : 'remark', type : 'string'},

        {name : 'billState', type : 'string'},
        {name : 'flowid', type : 'string'},
        {name : 'joinUnit', type : 'string'},
        {name : 'joinPlace', type : 'string'},
        //singleMaxWeight,volume,carrierPhoto
        {name : 'singleMaxWeight', type : 'float'},
        {name : 'volume', type : 'string'},
        {name : 'carrierPhoto', type : 'string'},
        {name : 'dhNoticeNo' ,type : 'string'},
        {name : 'actualTime' ,type : 'date',  dateFormat: 'Y-m-d H:i:s'},
		{name : 'dhHandoverNo',type : 'string'}
        
        ,{name : 'createMan', type : 'string'}
        ,{name : 'createUnit', type : 'string'}
	];
	
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    	var store1 = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : joinUnitArray
	});    
    var  chooseUnit = new Ext.form.MultiSelect({
         id:   'joinUnit',
         width:  190,
         store : store1,
         fieldLabel:'参与交接单位',
         readOnly : true,
         displayField:'v',
         separator : '、',
         valueField:'k',
         allowBlank:false,
         emptyText: '',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	r.set(this.checkField, !r.get(this.checkField))
         	 chooseUnit.setValue(this.getCheckedValue());
               chooseUnit.setValue(this.getCheckedValue());
		}
  })       
    var conno;
    var conname;
	DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid,function(obj){
		conno = obj.conno;
		conname = obj.conname;
	});
	//处理到货批号
	var newDhNo = conno+"-DH-"
	equMgm.getEquNewDhNo(CURRENTAPPID,newDhNo,"dh_no","wz_goods_arrival",null,function(str){
		newDhNo = str;
	});
	DWREngine.setAsync(true);
    if(edit_uids == null || edit_uids == ""){
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			isOpen : 0,
			dhNo : newDhNo,
			dhDate : new Date(),
			dhShi : '',
            dhFen : '',			
			dhDesc : '',
			csno : partybno,
			receiveUser : '',
			boxNum : 0,
			totalWeight : 0,
			sendType : '',
			carNo : '',
			dumpType : '',
			dumpUnit : '',
			recordUser : REALNAME,
			remark : '',

            billState : '1',
            flowid : flowid,
            joinUnit : '',
            joinPlace : '',
            
            singleMaxWeight : 0,
            volume : '',
            carrierPhoto : '',
            dhNoticeNo : '',
            actualTime : new Date(),
			dhHandoverNo : ''
            ,createMan : USERID
            ,createUnit : USERDEPTID
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(beanDh, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }
 
	
	formPanel = new Ext.FormPanel({
		region : 'north',
		height : 220,
		border : false,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
//		labelWidth : 90,
		//tbar : ['->','完结：',finishCheck,'-',saveBtn,'-',cancelBtn,'-'],
		tbar : ['<font color=#15428b><B>到货单信息<B></font>','->',saveBtn,'-',cancelBtn,'-'],
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
						new fm.Hidden(fc['uids']),
						new fm.Hidden(fc['pid']),
						new fm.Hidden(fc['conid']),
						new fm.Hidden(fc['treeuids']),
						new fm.Hidden(fc['finished']),
						new fm.Hidden(fc['isOpen']),
						new fm.Hidden(fc['billState']),
						new fm.Hidden(fc['flowid']),
						new fm.Hidden(fc['createMan']),
						new fm.Hidden(fc['createUnit']),
						new fm.TextField(fc['dhNoticeNo']),
						{
							id : 'conno',
							xtype : 'textfield',
							fieldLabel : '合同编号',
							value : conno,
							width : 160,
							readOnly : true
						},
						new fm.TextField(fc['receiveUser']),
						//new fm.ComboBox(fc['sendType']),
						new fm.TextField(fc['dumpUnit']),
                        new fm.TextField(fc['recordUser']),
                        new fm.TextField(fc['volume']),
                        new fm.TextField(fc['carrierPhoto'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						//new fm.DateField(fc['dhDate']),
						new fm.TextField(fc['dhHandoverNo']),
					    {
                            layout : 'column',
                            border : false,
                            items : [
                            {
                                layout : 'form',
                                columnWidth: .70,
                                border : false,
                                items : [
                                    new fm.DateField({
                                        id : 'dhDate',
                                        fieldLabel : '到货时间',
                                        readOnly : true,
							            width : 90, 
							            format: 'Y-m-d'
                                    })
                                ]
                            },
                            	{
                                layout : 'column',
                                columnWidth: .15,
                                border : false,
                                items : [
                                    new fm.NumberField({
                                        id : 'dhShi'
                                        ,width : 25
                                        ,fieldLabel : '时'
                                        ,labelWidth : '20'
                                        ,hideLabel : true
                                        ,style : 'text-align:left'
                                        ,minValue : 0
                                        ,maxValue : 23
                                        ,enableKeyEvents : true
                                        ,listeners : {
                                            'keyup' : function(e){
                                                var v = parseInt(e.getValue(),10);
                                                if(isNaN(v) || v < e.minValue || v > e.maxValue){
	                                                e.setValue('');
                                                }else{
                                                    e.setValue(v);
                                                }
                                            }
                                        }
                                    }),
                                    new fm.Label({text : '时',style:"font-family:Georgia; padding:5px 0px 0px 5px"})
                                ]
                            },{
                                layout : 'column',
                                columnWidth: .15,
                                border : false,
                                items : [
                                    new fm.NumberField({
                                        id : 'dhFen'
                                        ,width : 25
                                        ,fieldLabel : '分'
                                        ,labelWidth : '20'
                                        ,hideLabel : true
                                        ,style : 'text-align:left'
                                        ,minValue : 0
                                        ,maxValue : 59
                                        ,enableKeyEvents : true
                                        ,listeners : {
                                            'keyup' : function(e){
                                                var h = Ext.getCmp('dhShi').getValue();
                                                if(h == null || h === ""){
                                                    e.setValue('');
                                                    return;
                                                }
                                                var v = parseInt(e.getValue(),10);
                                                if(isNaN(v) || v < e.minValue || v > e.maxValue){
	                                                e.setValue('');
                                                }else{
                                                    e.setValue(v);
                                                }
                                            }
                                        }
                                    }),
                                    new fm.Label({text : '分',style:"font-family:Georgia; padding:5px 0px 0px 2px"})
                                ]
                            }
                            ]
                        },
//                        new fm.TextField(fc['joinUnit']),
                        chooseUnit,
						{
							id : 'conname',
							xtype : 'textfield',
							fieldLabel : '合同名称',
							value : conname,
							width : 190,
							readOnly : true
						},
						new fm.NumberField(fc['boxNum']),
						new fm.TextField(fc['carNo']),
						new fm.TextField(fc['remark'])
					]
				},{
					layout : 'form',
					columnWidth: .34,
					border : false,
					items : [
					    new fm.TextField(fc['dhNo']),
						new fm.TextField(fc['dhDesc']),
                        new fm.TextField(fc['joinPlace']),
						new fm.ComboBox(fc['csno']),
//						new Ext.form.TriggerField({
//                			name:'csno',
//                			id:'getCsFromList',
//                			fieldLabel:'供货厂家',
//                			triggerClass: 'x-form-date-trigger',
//	    					readOnly: true, selectOnFocus: true,
//	    					anchor:'95%',
//	    					onTriggerClick:getParamsFromList
//                		}),
						new fm.NumberField(fc['totalWeight']),
						new fm.NumberField(fc['singleMaxWeight']),
						new fm.DateField(fc['actualTime'])
						//new fm.ComboBox(fc['dumpType'])
					]
				}]
			}
		]
	});

	// TODO : ======到货详细信息======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'arrivalId' : {name : 'arrivalId',fieldLabel : '到货单主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'},
		'boxType' : {
			name : 'boxType',
			fieldLabel : '箱件类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: boxDs
			},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: jzDs
		},
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码',allowBlank : true},
		'boxName' : {name : 'boxName',fieldLabel : '存货名称'+requiredMark,allowBlank : false},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数',decimalPrecision:4,allowBlank : true},
		'realNum' : {name : 'realNum',fieldLabel : '实到数',decimalPrecision:4,allowBlank : true},
		'weight' : {id: 'weight',  name : 'weight',fieldLabel : '重量'+requiredMark,decimalPrecision:4,allowBlank : false,listeners : {
			blur : function(field){
				  var value = Ext.get('weight').getValue();
				  if(value.length>15){
				     Ext.example.msg("信息提示：","您输入的长度大于15，请输入小于15的数据！");
				  }
			}
			}},
		'packType' : {
			name : 'packType',
			fieldLabel : '包装方式',
			//readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: packDs
		},
		'storage' : {
			name : 'storage',
			fieldLabel : '存放库位',
			mode : 'local',
			editable:false,
			valueField: 'k',
			displayField: 'v',
			readOnly:true,
            listWidth: 220,
            lazyRender:true,
            triggerAction: 'all',
            store : storageDs,
			tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small'
		},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	
	var storageComboTree = new fm.ComboBox(fcSub['storage']);
	storageComboTree.on('beforequery', function(){
		storTreePanel.render('tree');
		storTreePanel.getRootNode().reload();
	});
	
	storTreePanel.on('click', function(node,e){
		var elNode = node.getUI().elNode;
		var treename = node.attributes.treename;
		var uids = elNode.all("uids").innerText;
        if(node.id=='01'){
        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
        	   storageComboTree.setRawValue("");
        	   return;
        	}
        if(node.id){
	       for(var j=0;j<equidS.length;j++){
		             if(node.id ==equidS[j]){
		        	   Ext.example.msg("信息提示：","请选择此分类下的子分类！");
		        	   storageComboTree.setRawValue("");
		        	   return;	                
		             }
		         }
        }
        var equid = "";
            for (var i = 0; i < equWareArr.length; i++) {
                if (uids == equWareArr[i][0])
                    equid = equWareArr[i][3]+" - "+equWareArr[i][1];
            }
            //this.setValue(node.id);
            //formPanel.getForm().findField("equid").setValue(node.id);
            
        storageComboTree.setRawValue(equid);
		storageComboTree.setValue(uids);
		storageComboTree.collapse();
	});
	
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
			id : 'arrivalId',
			header : fcSub['arrivalId'].fieldLabel,
			dataIndex : fcSub['arrivalId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcSub['boxType'].fieldLabel,
			dataIndex : fcSub['boxType'].name,
			editor : new fm.ComboBox(fcSub['boxType']),
			renderer : function(v,m,r){
				var box = "";
				m.attr = rendererColumnColorMark;
				for(var i=0;i<boxArr.length;i++){
					if(v == boxArr[i][0])
						box = boxArr[i][1];
				}
				return box;
			},
			align : 'center',
//			hidden : true,
			width : 80
		},{
			id : 'jzNo',
			header : fcSub['jzNo'].fieldLabel,
			dataIndex : fcSub['jzNo'].name,
			editor : new fm.ComboBox(fcSub['jzNo']),
			renderer : function(v,m,r){
				var jz = "";
				m.attr = rendererColumnColorMark;
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			dataIndex : fcSub['boxNo'].name,
			editor : new fm.TextField(fcSub['boxNo']),
			renderer : rendererColumnColorFun,
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			dataIndex : fcSub['boxName'].name,
			editor : new fm.TextField(fcSub['boxName']),
			renderer : rendererColumnColorFun,
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			editor : new fm.TextField(fcSub['ggxh']),
			renderer : rendererColumnColorFun,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			editor : new fm.TextField(fcSub['graphNo']),
			renderer : rendererColumnColorFun,
			align : 'center',
            hidden : true,
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			editor : new fm.TextField(fcSub['unit']),
			renderer : rendererColumnColorFun,
			align : 'center',
			width : 60
		},{
			id : 'mustNum',
			header : fcSub['mustNum'].fieldLabel,
			dataIndex : fcSub['mustNum'].name,
			editor : new fm.NumberField(fcSub['mustNum']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			header : fcSub['realNum'].fieldLabel,
			dataIndex : fcSub['realNum'].name,
			editor : new fm.NumberField(fcSub['realNum']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			editor : new fm.NumberField(fcSub['weight']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'center',
			width : 80
		},{
			id : 'packType',
			header : fcSub['packType'].fieldLabel,
			dataIndex : fcSub['packType'].name,
            editor : new fm.TextField(fcSub['packType']),
            renderer : rendererColumnColorFun,
//			editor : new fm.ComboBox(fcSub['packType']),
//			renderer : function(v){
//				var pack = "";
//				for(var i=0;i<packArr.length;i++){
//					if(v == packArr[i][0])
//						pack = packArr[i][1];
//				}
//				return pack;
//			},
			align : 'center',
			hidden : true,
			width : 150
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
			align : 'center',
			editor : storageComboTree,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				var storage = "";
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0])
						storage = equWareArr[i][3]+" - "+equWareArr[i][1];;
				}
				return storage;
			},
			width : 160
		},{
			id : 'exception',
			header : fcSub['exception'].fieldLabel,
			dataIndex : fcSub['exception'].name,
			editor : new fm.Checkbox(fcSub['exception']),
//			editor : new fm.Hidden(fcSub['exception']),
			renderer : function(v,m,r){
				return "<input type='checkbox' title='双击可编辑' "+(v==1?"checked":"")+" disabled>"
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcSub['exceptionDesc'].fieldLabel,
			dataIndex : fcSub['exceptionDesc'].name,
			editor : new fm.TextField(fcSub['exceptionDesc']),
			renderer : rendererColumnColorFun,
			hidden : true,
			width : 180
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			editor : new fm.TextField(fcSub['remark']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'arrivalId', type:'string'},
		{name:'arrivalNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'mustNum', type:'float'},
		{name:'realNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'packType', type:'string'},
		{name:'storage', type:'string'},
		{name:'exception', type:'float'},
		{name:'exceptionDesc', type:'string'},
		{name:'remark', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		arrivalId : '',
		arrivalNo : '',
		boxType : '',
		jzNo : '',
		boxNo : '',
		boxName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		mustNum : '0',
		realNum : '0',
		weight : '0',
		packType : '',
		storage  : '',
		exception : 0,
		exceptionDesc : '',
		remark : ''
	}	
	
	var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"' and arrivalId='"+edit_uids+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeySub
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'desc');	//设置默认排序列
    
    
    var btnList = new Ext.Button({
		text: '选择入库物资',
		iconCls: 'add',
		disabled : true,
		handler: selectList
	});
	var btnConMat = new Ext.Button({
		text: '从合同材料选',
		iconCls: 'add',
		handler: function(){
			   	var form = formPanel.getForm();
		   		var dhNo = form.findField('dhNo').getValue();
		   		var conid = form.findField('conid').getValue();
		   		var uidsStr = null;
		   		DWREngine.setAsync(false);
		 		baseMgm.getData("select uids from wz_goods_arrival where conid='"+conid+"' and dh_no='"+dhNo+"'",function(num){
						uidsStr = num;
					});  		
		   		DWREngine.setAsync(true);
			if (uidsStr != null || uidsStr !=""){
				if (conid){
					var params = "conid=" + conid+ "&appid="+ uidsStr+"&dhNo="+dhNo+"&type=apply&page=storein1"
					selectWinShow(params)     					
				}else{
					Ext.Msg.show({
						title: '提示',
			            msg: '请选择一个合同',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					})
				}
			}else{
				Ext.Msg.show({
						title: '提示',
			            msg: '请选择一条主记录',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					})
			}
		}
	});
	var btnStockPlan = new Ext.Button({
		text: '从采购计划选',
		iconCls: 'add',
		disabled : true,
		handler: selectStockPlan
		
	})

	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '到货单明细',
		tbar : ['<font color=#15428b><B>到货单明细<B></font>','-',btnList,'-',btnConMat,'-',btnStockPlan,'-'],
		insertHandler : addArrivalSub,
		saveHandler : saveArrivalSub,
		addBtn : true, // 是否显示新增按钮
		header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : businessSub,
		primaryKey : primaryKeySub
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
	formPanel.getForm().loadRecord(loadFormRecord);
	chooseUnit.validate();
	dsSub.load({params:{start:0,limit:10}});
	
	function saveArrival(){
		var form = formPanel.getForm();
        var dhDesc = form.findField("dhDesc").getValue();
        var joinUnit = form.findField("joinUnit").getValue();
        var joinPlace = form.findField("joinPlace").getValue();
        if(dhDesc == null || dhDesc.length == 0){
            Ext.example.msg('提示信息','到货描述必须填写！');
            return false;
        }
        if(joinUnit == null || joinUnit.length == 0){
            Ext.example.msg('提示信息','参与交接单位必须填写！');
            return false;
        }
        if(joinPlace == null || joinPlace.length == 0){
            Ext.example.msg('提示信息','交接地点必须填写！');
            return false;
        }
    	var obj = form.getValues();
		for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    			if((n=="dhShi"||n=="dhFen")&&(field.getValue()!=""&&field.getValue()<10)){
                    obj[n] = "0"+field.getValue()
                }
    		}
    	}
    	DWREngine.setAsync(false);
    	wzbaseinfoMgm.addOrUpdateWzArrival(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息',' 材料到货保存失败！');
    		}else{
    			Ext.example.msg('提示信息','材料到货保存成功！');
    			form.findField("uids").setValue(str);
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and arrivalId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	
	function addArrivalSub(){
		var uids = formPanel.getForm().findField("uids").getValue();
		var no = formPanel.getForm().findField("dhNo").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存到货单基本信息！');
			return;
		}
		PlantIntSub.arrivalId = uids;
		PlantIntSub.arrivalNo = no;
		gridPanelSub.defaultInsertHandler();
	}
	
	function saveArrivalSub(){
		var records = dsSub.getModifiedRecords();
		for (var i = 0; i < records.length; i++) {
			var exc = records[i].get("exception");
			if(exc == true){
				records[i].set("exception","1");
			}else{
				records[i].set("exception","0");
			}	
		}
		gridPanelSub.defaultSaveHandler();
	}
	    // 物资清单  
   	function selectList(){
   		var form = formPanel.getForm();
   		var dhNo = form.findField('dhNo').getValue();
   		var conid = form.findField('conid').getValue();
   		var flogStr = null;
   		DWREngine.setAsync(false);
 		baseMgm.getData("select uids from wz_goods_arrival where conid='"+conid+"' and dh_no='"+dhNo+"'",function(num){
				flogStr = num;
			});  		
   		DWREngine.setAsync(true);
   		if (flogStr!=null||flogStr!=""){
   			
//   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp?inId="
//   					+inId + "&type=storeIn";
//   			var url = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp"
   			var params = "inId=" +flogStr + "&type=storeIn&page=storein2"
   			selectWinShow(params)     			
   		}else{
   			Ext.Msg.show({
				title: '提示',
	            msg: '请选择一条入库记录',
	            icon: Ext.Msg.WARNING, 
	            width:200,
	            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	  	//从采购计划中选
   	function selectStockPlan(){
        var form = formPanel.getForm();
   		var dhNo = form.findField('dhNo').getValue();
   		var conid = form.findField('conid').getValue();
   		var flogStr = null;
   		DWREngine.setAsync(false);
 		baseMgm.getData("select uids from wz_goods_arrival where conid='"+conid+"' and dh_no='"+dhNo+"'",function(num){
				flogStr = num;
			});  		
   		DWREngine.setAsync(true);
   		if (flogStr!=null||flogStr!=""){
//   			window.location.href = BASE_PATH+"jsp/material/mat.goods.check.select.jsp?inId="
//   					+inId + "&type=storeIn";
//   			var url = BASE_PATH+"jsp/material/mat.goods.check.select.jsp"
   			var params = "inId=" +flogStr + "&type=storeIn&page=storein5" 
   			selectWinShow(params)
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条入库记录',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
 	
 	function selectWinShow(params){
   		if(!selectWin){
   			selectWin = new Ext.Window({
   				title:'选择',
   				closeAction:'hide',
   				width:800,height:450,
   				modal:true,plain:true,border: false, resizable: false,
   				autoLoad:{
   					url:BASE_PATH +'Business/wzgl/baseinfo_wzgl/wz.viewDispatcher.jsp',
   					text:'loading...'
   				},
				listeners: {
					hide: function(){
						dsSub.reload();
						if (isFlwTask == true){
							Ext.Msg.show({
								title: '您成功维护了'+storetitle+'信息！',
								msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
								buttons: Ext.Msg.YESNO,
								icon: Ext.MessageBox.INFO,
								fn: function(value){
							   		if ('yes' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
								}
							});
						}
					}
				}   				
   			})
   		}
   		selectWin.autoLoad.params = params;
   		selectWin.show()
   		selectWin.doAutoLoad()
   	}
});
