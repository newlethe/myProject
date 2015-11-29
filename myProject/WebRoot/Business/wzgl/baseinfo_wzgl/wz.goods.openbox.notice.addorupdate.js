var beanNotice = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNotice"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNoticeSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var beanArrSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub"
var businessArrSub = "baseMgm"
var listMethodArrSub = "findWhereOrderby"
var primaryKeyArrSub = "uids"
var orderColumnArrSub = "arrivalNo"

var beanArrival = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrival"
var businessArrival = "baseMgm"
var listMethodArrival = "findWhereOrderby"
var primaryKeyArrival = "uids"
var orderColumnArrival = "uids"

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var profArr = new Array();
var unitArr = new Array();
var equWareArr = new Array();
var joinUnitArray = new Array();

var gridPanelFj;
var formPanel;
var queryAvvivalWin;

Ext.onReady(function(){
	
	DWREngine.setAsync(false);
//设备供货厂家
	var sql = "select uids,csmc from sb_csb";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);		
			csnoArr.push(temp);			
		}
	});
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
	//所属专业
	appMgm.getCodeValue("所属专业",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			profArr.push(temp);			
		}
	});
	//参加单位
	var sql = "select unitid,unitname from sgcc_ini_unit t where t.unit_type_id ='7'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			unitArr.push(temp);			
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
//            if(list[i][3]=="SBCK")
//                temp.push("设备仓库");
//            else if(list[i][3]=="CLCK")
//                temp.push("材料仓库")
//            else if(list[i][3]=="JGCK")
//                temp.push("建管仓库")
	          equWareArr.push(temp);
           
        }
    });
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
    var profDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: profArr
    });
    var unitDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: unitArr
    });
    
	var fm = Ext.form;
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isCheck' : {name : 'isCheck',fieldLabel : '已检验'},
		'noticeNo' : {
			name : 'noticeNo',
			fieldLabel : '开箱通知单号', 
			readOnly : true,
			allowBlank : false,
			width : 160
		},
		'noticeDate' : {
			name : 'noticeDate',
			fieldLabel : '下单日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'openDate' : {
			name : 'openDate',
			fieldLabel : '开箱时间', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'dhShi' : {name : 'dhShi',fieldLabel : '时'},
		'dhFen' : {name : 'dhFen',fieldLabel : '分'},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点', allowBlank : false, width : 160},
		'openUnit' : {
			name : 'openUnit',
			fieldLabel : '参与单位',
            allowBlank : false,
			//readOnly: true,
			//valueField: 'k',
			//displayField: 'v',
			//mode: 'local',
			//typeAhead: true,
			//triggerAction: 'all', 
			//store: unitDs,
			width : 160
		},
		'equDesc' : {name : 'equDesc',fieldLabel : '检验主设备描述', allowBlank : false, width : 160},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '到货交接单编号', width : 160,allowBlank : false},
		'professinal' : {
			name : 'professinal',
			fieldLabel : '所属专业',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: profDs,
			width : 190
		},
		'remark' : {name : 'remark',fieldLabel : '备注', width : 160},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号', width : 160, readOnly : isFlwTask},
        'projectName' : {name : 'projectName',fieldLabel : '工程名称', allowBlank : false, width : 190}
	   ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
    }
	
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveNotice
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
//			'check' : finishNotice
//		}
//	});
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isCheck', type : 'float'},
		{name : 'noticeNo', type : 'string'},
		{name : 'noticeDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'dhShi',type : 'string'},
		{name : 'dhFen',type : 'string'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUnit', type : 'string'},
		{name : 'equDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'professinal', type : 'string'},
		{name : 'remark', type : 'string'},
        
        {name : 'billState', type : 'string'},
        {name : 'flowid', type : 'string'},
        {name : 'projectName', type : 'string'}
        
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
         id:   'openUnit',
         width:  160,
         store : store1,
         fieldLabel:'参与单位',
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
	var newTzNo = conno+"-TZ-"
	equMgm.getEquNewDhNo(CURRENTAPPID,newTzNo,"notice_no","wz_goods_openbox_notice",null,function(str){
		newTzNo = str;
	});
	DWREngine.setAsync(true);
    if(edit_uids == null || edit_uids == ""){
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			isCheck : 0,
			noticeNo : newTzNo,
			noticeDate : new Date(),
			openDate : new Date(),
			openPlace : '',
			equDesc : '',
			ownerNo : '',
			professinal : '',
			remark : '',
            openUnit : '',
            billState : '1',
            flowid : flowid,
            projectName : '天津陈塘庄热电厂煤改气搬迁工程'
            ,createMan : USERID
            ,createUnit : USERDEPTID
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(beanNotice, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }

	formPanel = new Ext.FormPanel({
		region : 'north',
		height : 140,
		border : false,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
//		labelWidth : 80,
		//tbar : ['->','完结：',finishCheck,'-',saveBtn,'-',cancelBtn,'-'],
		tbar : ['<font color=#15428b><B>主要材料开箱申请表<B></font>','->',saveBtn,'-',cancelBtn,'-'],
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
						new fm.Hidden(fc['uids']),
						new fm.Hidden(fc['pid']),
						new fm.Hidden(fc['conid']),
						new fm.Hidden(fc['treeuids']),
						new fm.Hidden(fc['finished']),
						new fm.Hidden(fc['isCheck']),
                        new fm.Hidden(fc['billState']),
						new fm.Hidden(fc['createMan']),
                        new fm.Hidden(fc['createUnit']),
						new fm.TextField(fc['noticeNo']),
						new fm.DateField(fc['noticeDate']),
//						{
//							id : 'conno',
//							xtype : 'textfield',
//							fieldLabel : '合同编号',
//							value : conno,
//							width : 160,
//							readOnly : true
//						}					
						new fm.TextField(fc['ownerNo']),
                        new fm.TextField(fc['flowid'])
					]
				},{
					layout : 'form',
					columnWidth: .36,
					border : false,
					items : [
						{
							id : 'conname',
							xtype : 'textfield',
							fieldLabel : '合同名称',
							value : conname,
							width : 190,
							readOnly : true
						},{
                            layout : 'column',
                            border : false,
                            items : [
                            {
                                layout : 'form',
                                columnWidth: .70,
                                border : false,
                                items : [
//                                new fm.DateField(fc['openDate'])
                                    new fm.DateField({
                                        id : 'openDate',
                                        fieldLabel : '到货时间',
                                        readOnly : true,
							            width : 105, 
							            format: 'Y-m-d'
                                    })
                                ]
                            },{
                                layout : 'form',
                                columnWidth: .10,
                                border : false,
                                items : [
                                    new fm.NumberField({
                                        id : 'dhShi'
                                        ,width : 30
                                        ,fieldLabel : '时'
                                        ,labelWidth : '10'
                                        ,hideLabel : true
                                        ,style : 'text-align:right'
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
                                    })
                                ]
                            },
                            new fm.Label({text : '时',style:"font-family:Georgia; padding:3px 2px 0px 0px"}),
                             {
                                layout : 'form',
                                columnWidth: .10,
                                border : false,
                                items : [
                                    new fm.NumberField({
                                        id : 'dhFen'
                                        ,width : 30
                                        ,fieldLabel : '分'
                                        ,labelWidth : '10'
                                        ,hideLabel : true
                                        ,style : 'text-align:right'
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
                                    })
                                ]
                            },new fm.Label({text : '分',style:"font-family:Georgia; padding:3px 2px 0px 0px"})
                            ]
                        },
//						new fm.DateField(fc['openDate']),
						new fm.ComboBox(fc['professinal']),
                        new fm.TextField(fc['projectName'])
					]
				},{
					layout : 'form',
					columnWidth: .32,
					border : false,
					items : [
                        new fm.TextField(fc['equDesc']),
						new fm.TextField(fc['openPlace']),
						new fm.TextField(fc['remark']),
//                        new fm.TextField(fc['openUnit'])
						chooseUnit
					]
				}]
			}
		]
	});
	
	
	
	
	// TODO : ======开箱通知单明细======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'noticeId' : {name : 'noticeId',fieldLabel : '开箱通知单主键'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '开箱通知单批次号'},
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
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码'},
		'boxName' : {name : 'boxName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'openNum' : {name : 'openNum',fieldLabel : '数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
		'arrivalSubId' : {name : 'arrivalSubId',fieldLabel : '到货明细设备主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'}
	};
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmSub = new Ext.grid.ColumnModel([
		smSub,
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
			id : 'noticeId',
			header : fcSub['noticeId'].fieldLabel,
			dataIndex : fcSub['noticeId'].name,
			hidden : true
		},{
			id : 'noticeNo',
			header : fcSub['noticeNo'].fieldLabel,
			dataIndex : fcSub['noticeNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcSub['boxType'].fieldLabel,
			dataIndex : fcSub['boxType'].name,
			renderer : function(v){
				var box = "";
				for(var i=0;i<boxArr.length;i++){
					if(v == boxArr[i][0])
						box = boxArr[i][1];
				}
				return box;
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'jzNo',
			header : fcSub['jzNo'].fieldLabel,
			dataIndex : fcSub['jzNo'].name,
			renderer : function(v){
				var jz = "";
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
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			dataIndex : fcSub['boxName'].name,
			width : 200
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'openNum',
			header : fcSub['openNum'].fieldLabel,
			dataIndex : fcSub['openNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'arrivalSubId',
			header : fcSub['arrivalSubId'].fieldLabel,
			dataIndex : fcSub['arrivalSubId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'noticeId', type:'string'},
		{name:'noticeNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'openNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'arrivalSubId', type:'string'},
		{name:'arrivalNo', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		noticeId : '',
		noticeNo : '',
		boxType : '',
		jzNo : '',
		boxNo : '',
		boxName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		openNum : '',
		weight : '',
		arrivalSubId : '',
		arrivalNo : ''
	}	
	
	var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"' and noticeId='"+edit_uids+"'"
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
    
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '申请表明细',
		tbar : ['<font color=#15428b><B>申请表明细<B></font>','-'],
		insertHandler : addNoticeSub,
		//saveHandler : saveNoticeSub,
		saveBtn : false,
		header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
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
	
	
	// TODO : ======通知单明细中从到货单选择设备
	var fcArrSub = {
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
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码'},
		'boxName' : {name : 'boxName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数',decimalPrecision:4},
		'realNum' : {name : 'realNum',fieldLabel : '实到数',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量',decimalPrecision:4},
		'packType' : {
			name : 'packType',
			fieldLabel : '包装方式',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: packDs
		},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	var smArrSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmArrSub = new Ext.grid.ColumnModel([
		smArrSub,
//		new Ext.grid.RowNumberer({
//			header : '序号',
//			width : 35
//		}),
		{
			id : 'uids',
			header : fcArrSub['uids'].fieldLabel,
			dataIndex : fcArrSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcArrSub['pid'].fieldLabel,
			dataIndex : fcArrSub['pid'].name,
			hidden : true
		},{
			id : 'arrivalId',
			header : fcArrSub['arrivalId'].fieldLabel,
			dataIndex : fcArrSub['arrivalId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcArrSub['arrivalNo'].fieldLabel,
			dataIndex : fcArrSub['arrivalNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcArrSub['boxType'].fieldLabel,
			dataIndex : fcArrSub['boxType'].name,
			renderer : function(v){
				var box = "";
				for(var i=0;i<boxArr.length;i++){
					if(v == boxArr[i][0])
						box = boxArr[i][1];
				}
				return box;
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'jzNo',
			header : fcArrSub['jzNo'].fieldLabel,
			dataIndex : fcArrSub['jzNo'].name,
			renderer : function(v){
				var jz = "";
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
			type : 'string',
			header : fcArrSub['boxNo'].fieldLabel,
			dataIndex : fcArrSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			type : 'string',
			header : fcArrSub['boxName'].fieldLabel,
			dataIndex : fcArrSub['boxName'].name,
			width : 180
		},{
			id : 'ggxh',
			type : 'string',
			header : fcArrSub['ggxh'].fieldLabel,
			dataIndex : fcArrSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			type : 'string',
			header : fcArrSub['graphNo'].fieldLabel,
			dataIndex : fcArrSub['graphNo'].name,
			align : 'center',
			hidden : true,
			width : 100
		},{
			id : 'unit',
			type : 'string',
			header : fcArrSub['unit'].fieldLabel,
			dataIndex : fcArrSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'mustNum',
			type : 'string',
			header : fcArrSub['mustNum'].fieldLabel,
			dataIndex : fcArrSub['mustNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			type : 'string',
			header : fcArrSub['realNum'].fieldLabel,
			dataIndex : fcArrSub['realNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcArrSub['weight'].fieldLabel,
			dataIndex : fcArrSub['weight'].name,
			align : 'center',
			width : 80
		},{
			id : 'packType',
			header : fcArrSub['packType'].fieldLabel,
			dataIndex : fcArrSub['packType'].name,
			renderer : function(v){
				var pack = "";
				for(var i=0;i<packArr.length;i++){
					if(v == packArr[i][0])
						pack = packArr[i][1];
				}
				return pack;
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'storage',
			header : fcArrSub['storage'].fieldLabel,
			dataIndex : fcArrSub['storage'].name,
			align : 'center',
			hidden : true,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0])
						storage = equWareArr[i][3]+" - "+equWareArr[i][2];;
				}
				return storage;
			},
			width : 80
		},{
			id : 'exception',
			header : fcArrSub['exception'].fieldLabel,
			dataIndex : fcArrSub['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox' "+(v==1?"checked":"")+" disabled >"
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcArrSub['exceptionDesc'].fieldLabel,
			dataIndex : fcArrSub['exceptionDesc'].name,
			hidden : true,
			width : 180
		},{
			id : 'remark',
			header : fcArrSub['remark'].fieldLabel,
			dataIndex : fcArrSub['remark'].name,
			width : 180
		}
	]);
	var ColumnsArrSub = [
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
	
	var dsArrSub = new Ext.data.GroupingStore({
		baseParams: {
	    	ac: 'list',
	    	bean: beanArrSub,
	    	business: businessArrSub,
	    	method: listMethodArrSub,
	    	params: "1=2"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyArrSub
        }, ColumnsArrSub),
        remoteSort: true,
        pruneModifiedRecords: true,
        
        remoteGroup : false,
		sortInfo : {
			field : orderColumnArrSub,
			direction : "ASC"
		}, // 分组
		groupField : orderColumnArrSub // 分组
    });
    dsArrSub.setDefaultSort(orderColumnArrSub, 'desc');	//设置默认排序列
    
    var selectArrSubEquBtn = new Ext.Button({
    	text : '选择',
    	iconCls : 'btn',
    	handler : function(){
    		var records = smArrSub.getSelections();
    		if(records == null || records.length == 0){
    			Ext.example.msg('提示信息','请先选择到货单中的设备！');
    			return;
    		}
    		var arrivalSubUids = new Array()
    		for (var i = 0; i < records.length; i++) {
    			arrivalSubUids.push(records[i].get("uids"));
    		}
    		var id = formPanel.getForm().findField('uids').getValue();
    		var no = formPanel.getForm().findField('noticeNo').getValue();
    		DWREngine.setAsync(false);
    		wzbaseinfoMgm.insertWzNoticeSubFromArrivalSub(arrivalSubUids,id,no,function(str){
    			if(str == "1"){
    				Ext.example.msg('提示信息','设备选择成功！');
    				selectArrSubWin.hide();
    				dsSub.reload();
    			}else{
    				Ext.example.msg('提示信息','设备选择失败！');
    			}
    		});
    		DWREngine.setAsync(true);
    	}
    });
   var queryBtn = new Ext.Button({
				id : 'query',
				text : '查询',
				iconCls : 'btn',
				handler : queryBtnFn
			}); 
	//高级查询过滤条件		
	fixedFilterPart = 	" arrivalId in (select uids from WzGoodsArrival where billState='1' " +
				        " and conid='"+edit_conid+"'" +" ) " +
				        " and uids not in (select arrivalSubId from WzGoodsOpenboxNoticeSub)";
	var gridPanelArrSub = new Ext.grid.QueryExcelGridPanel({
		ds : dsArrSub,
		cm : cmArrSub,
		sm : smArrSub,
		title : '到货单明细',
		tbar : ['<font color=#15428b><B>到货单明细<B></font>','->',selectArrSubEquBtn,'-'],//,queryBtn,
		header: false,
		//height : document.body.clientHeight*0.5,
	    border: false,
	    //region: 'south',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    view : new Ext.grid.GroupingView({ // 分组
			forceFit : false,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		}),
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsArrSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var selectArrSubWin = new Ext.Window({
		width: 900,
		height: 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanelArrSub]
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
	
	function saveNotice(){
		var form = formPanel.getForm();
        var openPlace = form.findField("openPlace").getValue();
        var equDesc = form.findField("equDesc").getValue();
        var projectName = form.findField("projectName").getValue();
        var openUnit = form.findField("openUnit").getValue();
        if(openPlace == null || openPlace.length == 0){
            Ext.example.msg('提示信息','开箱地点必须填写！');
            return false;
        }
        if(equDesc == null || equDesc.length == 0){
            Ext.example.msg('提示信息','检验主设备描述必须填写！');
            return false;
        }
        if(projectName == null || projectName.length == 0){
            Ext.example.msg('提示信息','工程名称必须填写！');
            return false;
        }
        if(openUnit == null || openUnit.length == 0){
            Ext.example.msg('提示信息','参与单位必须填写！');
            return false;
        }
    	var obj = form.getValues();
		for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	wzbaseinfoMgm.addOrUpdateWzOpenboxNotice(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','保存失败！');
    		}else{
    			Ext.example.msg('提示信息','保存成功！');
    			form.findField("uids").setValue(str);
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and noticeId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	
	function addNoticeSub(){
		var uids = formPanel.getForm().findField("uids").getValue();
		var no = formPanel.getForm().findField("noticeNo").getValue();
		var conid = formPanel.getForm().findField("conid").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存基本信息！');
			return;
		}
		
		PlantIntSub.noticeId = uids;
		PlantIntSub.noticeNo = no;
		selectArrSubWin.show();
		
		//查询已经完结的到货单，并且没有选择过的设备
		var arrSubWhere = " arrivalId in (select uids from WzGoodsArrival where billState='1' " +
				" and conid='"+conid+"'" +
                " ) " 
                //+
				//" and uids not in (select arrivalSubId from WzGoodsOpenboxNoticeSub)";
		dsArrSub.baseParams.params = arrSubWhere;
		dsArrSub.load({params:{start:0,limite:PAGE_SIZE}});
	}
	
	function saveNoticeSub(){
		gridPanelSub.defaultSaveHandler();
	}
//查询按钮---查询合同相对应的到货主表的信息，	
//到货信息主表查询
	
	// TODO : ======到货单主表======
	var fcArrival = {
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
			fieldLabel : '设备合同分类树'
		},
		'finished' : {
			name : 'finished',
			fieldLabel : '完结'
		},
		'isOpen' : {
			name : 'isOpen',
			fieldLabel : '是否开箱'
		},
		'dhNo' : {
			name : 'dhNo',
			fieldLabel : '到货批号'
		},
		'dhDate' : {
			name : 'dhDate',
			fieldLabel : '到货时间'
		},
		'dhShi' : {
			name : 'dhShi',
			fieldLabel : '时'
		},
		'dhFen' : {
			name : 'dhFen',
			fieldLabel : '分'
		},
		'dhDesc' : {
			name : 'dhDesc',
			fieldLabel : '到货描述'
		},
		'csno' : {
			name : 'csno',
			fieldLabel : '供货厂家'
		},
		'receiveUser' : {
			name : 'receiveUser',
			fieldLabel : '接货人'
		},
		'boxNum' : {
			name : 'boxNum',
			fieldLabel : '箱件数量'
		},
		'totalWeight' : {
			name : 'totalWeight',
			fieldLabel : '总重量（KG）'
		},
		'sendType' : {
			name : 'sendType',
			fieldLabel : '运输方式'
		},
		'carNo' : {
			name : 'carNo',
			fieldLabel : '车牌号'
		},
		'dumpType' : {
			name : 'dumpType',
			fieldLabel : '卸车方式'
		},
		'dumpUnit' : {
			name : 'dumpUnit',
			fieldLabel : '卸车单位'
		},
		'recordUser' : {
			name : 'recordUser',
			fieldLabel : '录单人'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注'
		},
		'fileList' : {
			name : 'fileList',
			fieldLabel : '附件'
		},
		'billState' : {
			name : 'billState',
			fieldLabel : '审批状态'
		},
		'flowid' : {
			name : 'flowid',
			fieldLabel : '流程编号'
		},
		'joinUnit' : {
			name : 'joinUnit',
			fieldLabel : '参与交接单位'
		},
		'joinPlace' : {
			name : 'joinPlace',
			fieldLabel : '交接地点'
		},
		'setUser' : {
			name : 'setUser',
			fieldLabel : '短信提醒'
		},

		'singleMaxWeight' : {
			name : 'singleMaxWeight',
			fieldLabel : '单体最重（吨）'
		},
		'volume' : {
			name : 'volume',
			fieldLabel : '体积'
		},
		'carrierPhoto' : {
			name : 'carrierPhoto',
			fieldLabel : '承运人电话'
		},
		'dhNoticeNo' : {
			name : 'dhNoticeNo',
			fieldLabel : '到货通知单编号'
		},
		'dhHandoverNo' : {
			name : 'dhHandoverNo',
			fieldLabel : '到货交接单编号'
		}
	}

	var smArrival = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cmArrival = new Ext.grid.ColumnModel([
			// sm,
			{
		id : 'uids',
		header : fcArrival['uids'].fieldLabel,
		dataIndex : fcArrival['uids'].name,
		hidden : true
	}, {
		id : 'pid',
		header : fcArrival['pid'].fieldLabel,
		dataIndex : fcArrival['pid'].name,
		hidden : true
	}, {
		id : 'conid',
		header : fcArrival['conid'].fieldLabel,
		dataIndex : fcArrival['conid'].name,
		hidden : true
	}, {
		id : 'treeuids',
		header : fcArrival['treeuids'].fieldLabel,
		dataIndex : fcArrival['treeuids'].name,
		hidden : true
	}, {
		id : 'billState',
		header : fcArrival['billState'].fieldLabel,
		dataIndex : fcArrival['billState'].name,
		hidden : true,
		align : 'center',
		width : 70
	}, {
		id : 'finished',
		header : fcArrival['finished'].fieldLabel,
		dataIndex : fcArrival['finished'].name,
		renderer : function(v, m, r) {
			var o = r.get("isOpen");
			var str = "<input type='checkbox' "
					+ (o == 1 ? "disabled title='已开箱，不能取消完结' " : "") + " "
					+ (v == 1 ? "checked title='已完结' " : "title='未完结'")
					+">"
			return str;
		},
		align : 'center',
		width : 40
	}, {
		id : 'flowid',
		header : fcArrival['flowid'].fieldLabel,
		dataIndex : fcArrival['flowid'].name,
		hidden : true,
		width : 180
	}, {
		id : 'isOpen',
		header : fcArrival['isOpen'].fieldLabel,
		dataIndex : fcArrival['isOpen'].name,
		hidden : true
	}, {
		id : 'dhNoticeNo',
		header : fcArrival['dhNoticeNo'].fieldLabel,
		dataIndex : fcArrival['dhNoticeNo'].name,
		hidden : true,
		width : 180
	}, {
		id : 'dhHandoverNo',
		header : fcArrival['dhHandoverNo'].fieldLabel,
		dataIndex : fcArrival['dhHandoverNo'].name,
		hidden : true,
		width : 180
	}, {
		id : 'dhNo',
		header : fcArrival['dhNo'].fieldLabel,
		dataIndex : fcArrival['dhNo'].name,
		width : 220
	}, {
		id : 'dhDate',
		header : fcArrival['dhDate'].fieldLabel,
		dataIndex : fcArrival['dhDate'].name,
		renderer : function(v, m, r) {
			var shi = r.get('dhShi');
			var fen = r.get('dhFen');
			var time = shi != null && shi != ""
					? " " + shi + ":" + fen + ":00"
					: ""
			return v ? v.dateFormat('Y-m-d') + time : '';
		},
		align : 'center',
		width : 140
	}, {
		id : 'dhDesc',
		header : fcArrival['dhDesc'].fieldLabel,
		dataIndex : fcArrival['dhDesc'].name,
		width : 220
	}, {
		id : 'csno',
		header : fcArrival['csno'].fieldLabel,
		dataIndex : fcArrival['csno'].name,
		renderer : function(v) {
			var csmc = "";
			for (var i = 0; i < csnoArr.length; i++) {
				if (v == csnoArr[i][0])
					csmc = csnoArr[i][1];
			}
			return csmc;
		},
		width : 220
	}, {
		id : 'receiveUser',
		header : fcArrival['receiveUser'].fieldLabel,
		dataIndex : fcArrival['receiveUser'].name,
		align : 'center',
		width : 100
	}, {
		id : 'boxNum',
		header : fcArrival['boxNum'].fieldLabel,
		dataIndex : fcArrival['boxNum'].name,
		align : 'right',
		width : 80
	}, {
		id : 'totalWeight',
		header : fcArrival['totalWeight'].fieldLabel,
		dataIndex : fcArrival['totalWeight'].name,
		align : 'right',
		width : 100
	}, {
		id : 'singleMaxWeight',
		header : fcArrival['singleMaxWeight'].fieldLabel,
		dataIndex : fcArrival['singleMaxWeight'].name,
		align : 'right',
		width : 100
	}, {
		id : 'volume',
		header : fcArrival['volume'].fieldLabel,
		dataIndex : fcArrival['volume'].name,
		width : 100
	}, {
		id : 'carrierPhoto',
		header : fcArrival['carrierPhoto'].fieldLabel,
		dataIndex : fcArrival['carrierPhoto'].name,
		width : 100
	}, {
		id : 'sendType',
		header : fcArrival['sendType'].fieldLabel,
		dataIndex : fcArrival['sendType'].name,
		renderer : function(v) {
			var send = "";
			for (var i = 0; i < sendArr.length; i++) {
				if (v == sendArr[i][0])
					send = sendArr[i][1];
			}
			return send;
		},
		align : 'center',
//		hidden : true,
		width : 80
	}, {
		id : 'carNo',
		header : fcArrival['carNo'].fieldLabel,
		dataIndex : fcArrival['carNo'].name,
		width : 100
	}, {
		id : 'dumpType',
		header : fcArrival['dumpType'].fieldLabel,
		dataIndex : fcArrival['dumpType'].name,
		renderer : function(v) {
			var send = "";
			for (var i = 0; i < dumpArr.length; i++) {
				if (v == dumpArr[i][0])
					send = dumpArr[i][1];
			}
			return send;
		},
//		hidden : true,
		width : 100
	}, {
		id : 'dumpUnit',
		header : fcArrival['dumpUnit'].fieldLabel,
		dataIndex : fcArrival['dumpUnit'].name,
		width : 160
	}, {
		id : 'recordUser',
		header : fcArrival['recordUser'].fieldLabel,
		dataIndex : fcArrival['recordUser'].name,
		align : 'center',
		width : 120
	}, {
		id : 'joinUnit',
		header : fcArrival['joinUnit'].fieldLabel,
		dataIndex : fcArrival['joinUnit'].name,
		renderer : function(v){
           return v
		},
		width : 160
	}, {
		id : 'joinPlace',
		header : fcArrival['joinPlace'].fieldLabel,
		dataIndex : fcArrival['joinPlace'].name,
		width : 160
	}, {
		id : 'setUser',
		header : fcArrival['setUser'].fieldLabel,
		dataIndex : fcArrival['setUser'].name,
		align : 'center',
		renderer : function(v) {
			if (v == "1")
				return "已设置";
			else
				return "未设置";
		},
		width : 80
	}, {
		id : 'fileList',
		header : fcArrival['fileList'].fieldLabel,
		dataIndex : fcArrival['fileList'].name,
		align : 'center'
	}, {
		id : 'remark',
		header : fcArrival['remark'].fieldLabel,
		dataIndex : fcArrival['remark'].name,
		width : 160
	}]);
	var ColumnsArrival = [{
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
				name : 'isOpen',
				type : 'float'
			}, {
				name : 'dhNoticeNo',
				type : 'string'
			}, {
				name : 'dhHandoverNo',
				type : 'string'
			}, {
				name : 'dhNo',
				type : 'string'
			}, {
				name : 'dhDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'dhShi',
				type : 'string'
			}, {
				name : 'dhFen',
				type : 'string'
			}, {
				name : 'dhDesc',
				type : 'string'
			}, {
				name : 'csno',
				type : 'string'
			}, {
				name : 'receiveUser',
				type : 'string'
			}, {
				name : 'boxNum',
				type : 'float'
			}, {
				name : 'totalWeight',
				type : 'float'
			}, {
				name : 'sendType',
				type : 'string'
			}, {
				name : 'carNo',
				type : 'string'
			}, {
				name : 'dumpType',
				type : 'string'
			}, {
				name : 'dumpUnit',
				type : 'string'
			}, {
				name : 'recordUser',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			},

			{
				name : 'billState',
				type : 'string'
			}, {
				name : 'flowid',
				type : 'string'
			}, {
				name : 'joinUnit',
				type : 'string'
			}, {
				name : 'joinPlace',
				type : 'string'
			}, {
				name : 'setUser',
				type : 'string'
			},
			// singleMaxWeight,volume,carrierPhoto
			{
				name : 'singleMaxWeight',
				type : 'float'
			}, {
				name : 'volume',
				type : 'string'
			}, {
				name : 'carrierPhoto',
				type : 'string'
			}];

   var	dsArrival = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanArrival,
					business : businessArrival,
					method : listMethodArrival,
					params: "conid='"+edit_conid+"' and finished='1' and billState='1' and isOpen='0'"
//					params : ""
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeyArrival
						}, ColumnsArrival),
				remoteSort : true,
				pruneModifiedRecords : true
			});
   dsArrival.setDefaultSort(orderColumnArrival, 'asc');	
   var cancelBtnArrlival = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			queryAvvivalWin.hide();
		}
	})
   gridPanelArrival = new Ext.grid.GridPanel({
				ds : dsArrival,
				sm : smArrival,
				cm : cmArrival,
				tbar : ['<font color=#15428b><B>到货单信息<B></font>','->',cancelBtnArrlival],
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
					store : dsArrival,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});
   queryAvvivalWin = new Ext.Window({
		width: 900,
		height: 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanelArrival]
	});	
//查询按钮功能
	function  queryBtnFn(){
	  dsArrival.load();
      queryAvvivalWin.show();
	}
	
});

