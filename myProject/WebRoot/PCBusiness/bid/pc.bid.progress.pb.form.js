var unitStore,unitArr,unitBox;
var array_user=new Array();
var dsCombo_user;
var treeCombo;
//项目单位array
var array_prjs=new Array();
var proTreeCombo;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var where="unit_type_id not in ('9')";	
var disableBtn = ModuleLVL != '1';
// 通用combobox renderer
Ext.util.Format.comboRenderer = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
		return record
				? record.get(combo.displayField)
				: combo.valueNotFoundText;
	}
}
Ext.override(Ext.form.TextField, {   
              unitText : '',   
              onRender : function(ct, position) {   
            Ext.form.TextField.superclass.onRender.call(this, ct, position);   
                // 如果单位字符串已定义 则在后方增加单位对象   
            if (this.unitText != '') {   
              this.unitEl = ct.createChild({   
                tag : 'div',   
                html : this.unitText   
             });   
              this.unitEl.addClass('x-form-unit');   
                  // 增加单位名称的同时 按单位名称大小减少文本框的长度 初步考虑了中英文混排 未考虑为负的情况   
              this.width = this.width - (this.unitText.replace(/[^\x00-\xff]/g, "xx").length * 6 + 2);   
                  // 同时修改错误提示图标的位置   
              this.alignErrorIcon = function() {   
              this.errorIcon.alignTo(this.unitEl, 'tl-tr', [2, 0]);   
              };   
            }   
              }   
        });
Ext.override(Ext.form.BasicForm, {
	loadRecord : function(record){
		if ( record.data.rateStatus ){
			var rateStatus=accMul( record.data.rateStatus,100);
			record.data.rateStatus = rateStatus;
		}
		this.setValues(record.data);
        return this;
	}
}); 

var formPanel;
var progressBusinessType = 'PCBidProgress';

//评标方式,系统属性维护
var pbWayArr = [];
DWREngine.setAsync(false);
	appMgm.getCodeValue('评标方法',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			pbWayArr.push(temp);			
			}
  	 }); 
  	 
 	//项目单位
	var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean2,"",function(list){   
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_prjs.push(temp);			
		}
    }); 	 	 
 	//得到部门所属用户
	PCBidDWR.getUserInDept(USERBELONGUNITID,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].userid);
			temp.push(list[i].realname);
			array_user.push(temp);			
			}
	 	}
	); 	 
  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  }) 
  db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
	});  	 
DWREngine.setAsync(true);

var wayStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : pbWayArr
			})
	
//部门用户store
 dsCombo_user=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: array_user
});				
//项目单位store
var dsCombo_prjs=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: array_prjs
});	
      //单位选择
  unitBox = new Ext.form.ComboBox({
        emptyText : '负责部门',
        fieldLabel:'负责部门',
        id : 'respondDept',
        store : unitStore,
        allowBlank : false,
        displayField : 'txt',
        valueField : 'val', 
        anchor : '95%',
        editable : false,
        typeAhead : id,
        triggerAction : 'all',
        mode : 'local',
        tpl: "<tpl for='.'><div style='height:220px'><div id='unittree'></div></div></tpl>",   
	    selectOnFocus:true,
		listeners: {
			'render': function(){			
			}
		}
    });	
      var unitTreeNodeUrl =  CONTEXT_PATH + "/servlet/PcBidServlet";
  var unitTree =  new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
                 dataUrl :unitTreeNodeUrl,
                 requestMethod: "POST",
                 baseParams:{
			        ac:"syncBuilding3GroupUnitTree",
					ifcheck : false,
					baseWhere :where,
					unitid:unitid,
			        upunit:upunit,
					async : false,
					hascheck:"no"
			}
            }),
        border : false,
        root : new Ext.tree.AsyncTreeNode({
             text :USERBELONGUNITNAME,
             id: USERBELONGUNITID,
             expanded : true
           }),
        rootVisible : false   
  })
   unitTree.on('beforeload',function(node){
	 unitTree.loader.baseParams.parentId = node.id; 
  })
  
  unitBox.on('expand',function(){   
        unitTree.render('unittree');  
    });   
    
  unitTree.on('click',function(node){  
    unitBox.collapse(); 
	var leaf=node.leaf;
	if(leaf==1){
		userCombo.setValue("");
		unitBox.setValue(node.id); 
		DWREngine.setAsync(false);
		//得到部门所属用户
		PCBidDWR.getUserInDept(node.id,function(list){
			array_user=new Array();
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].userid);
				temp.push(list[i].realname);
				array_user.push(temp);			
				}
	 		}
		);			
		DWREngine.setAsync(true);
		dsCombo_user.loadData(array_user);
		}
		else{
			Ext.example.msg("提示","请选择具体负责部门");
    			return;
		}       	
    });
var fcProgress = {
	uids : {
		name : 'uids',
		fieldLabel : 'uids',
		anchor : '95%'
	},
	pid : {
		name : 'pid',
		fieldLabel : '工程项目id',
		allowBlank : false,
		anchor : '95%'
	},
	contentUids : {
		name : 'contentUids',
		fieldLabel : '招标内容id',
		anchor : '95%',
		allowBlank : false
	},
	progressType : {
		name : 'progressType',
		fieldLabel : '招标阶段',
		anchor : '95%'
	},
	startDate : {
		id : 'startDate',
		name : 'startDate',
		fieldLabel : '开始时间',
		format : 'Y-m-d',
		anchor : '98%',
		listeners:{
			focus: domBlur
		}
	},
	endDate : {
		id : 'endDate',
		name : 'endDate',
		fieldLabel : '结束时间',
		format : 'Y-m-d',
		anchor : '98%',
		listeners:{
			focus: domBlur
		}
	},
	rateStatus : {
		name : 'rateStatus',
		fieldLabel : '工作进度',
		anchor : '90%',
		maxValue : 100,
		minValue : 0,
		style:'direction:rtl',
		listeners:{
			focus: domBlur,
			render:function(){
				this.el.insertHtml('afterEnd','%');
			}
		}
	},
	respondDept : {
			name : 'respondDept',
			id:'respondDept',
			hiddenName:'respondDept',
			fieldLabel : '负责部门',
			//allowBlank : false,
			anchor : '95%',
			listeners:{
				focus: domBlur
			}
	},
	respondUser : {
			fieldLabel : '负责人',
			triggerAction : 'all',
			mode : 'local',
			anchor : '95%',
			lazyRender : true,
			store : dsCombo_user,
			valueField : 'k',
			displayField : 'v',
			allowBlank : false,
			name : 'respondUser',
			renderer :Ext.util.Format.comboRenderer(userCombo) 

	},
	'pbWays' : {
			name : 'pbWays',
			readOnly :true,
			fieldLabel : '评标方法',
			anchor : '98%',
			store:wayStore,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
        	hiddenName : 'pbWays',
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
       		selectOnFocus:true,
       		listeners:{
						focus: domBlur
//						select: function(combo){ alert(combo.getValue().length)}
//							var value = combo.getValue();
//							//如果选择评标方法选择的是"其他", 显示文本域并提示输入具体的评标方法
//							if(value=='3')
//							{	
//								Ext.getCmp('pbWay-append').el.dom.readOnly = false;
//								Ext.getCmp('pbWay-append').el.dom.disabled = false;
//								Ext.getCmp('pbWay-append').allowBlank = false;
//								Ext.getCmp('pbWay-append').enable();
//							}
//							else
//							{
//								Ext.getCmp('pbWay-append').el.dom.readOnly = true;
//								Ext.getCmp('pbWay-append').allowBlank = true;
//								Ext.getCmp('pbWay-append').disable();
//								Ext.getCmp('pbWay-append').setValue('');
//								Ext.getCmp('pbWay-append').validate();
//							}
//						}
				}
		},
	assessReport : {
		name : 'assessReport',
		text : '',
		anchor : '85%',
		listeners:{
			focus: domBlur
		}
	},
	fj : {
		name : 'fj',
		text : '',
		anchor : '95%',
		listeners:{
			focus: domBlur
		}
	},                                                        
	memo : {
		name : 'memo',
		fieldLabel : '备注',
		anchor : '99%',
		listeners:{
			focus: domBlur
		}
	},
	isActive : {
		name : 'isActive',
		fieldLabel : 'isActive',
		anchor : '95%'
	}

};
var userCombo=new Ext.form.ComboBox(fcProgress['respondUser']);
userCombo.on("render",function(){
	DWREngine.setAsync(false);
	if(bidContentId){
	PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(
					retVal) {	
		if(retVal.respondDept){
			PCBidDWR.getUserInDept(retVal.respondDept,function(list){
			array_user=new Array();
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].userid);
				temp.push(list[i].realname);
				array_user.push(temp);			
				}
 			});	
 			if(array_user&&array_user.length>0){
 					dsCombo_user.loadData(array_user);	
 			}
		}	
	});
	}
	DWREngine.setAsync(false);
});
var BidProgress = Ext.data.Record.create(fcProgress);
var fjt=new Ext.form.Label(fcProgress['fj']);
var assessReport=new Ext.form.Label(fcProgress['assessReport']);

var attachBtn = new Ext.Button({
	minWidth : 60,
	text : '附件',
	handler : function(){
		var uids = formPanel.getForm().findField('uids').getValue();
		if ( uids == null || uids == '' ){
			return;
		}
		parent.showUploadWin(progressBusinessType, !disableBtn, uids, '招标进度附件',
		"com.sgepit.pcmis.bid.hbm.PcBidProgress");
	}
});

// 按钮saveBidProgress
var saveBtn = new Ext.Button({
	minWidth : 60,
	text : '保存',
	hidden:disableBtn,
	handler : function() {
		var contentUids = formPanel.getForm().findField('contentUids').getValue();
		if ( contentUids == null || contentUids == '' ){
			return;
		}
		
		//数据校验
		if (!formPanel.getForm().isValid()) {
			return;
		}
		
		var progress = formPanel.getForm().getValues();
		if(unitBox&&unitBox.getValue()){
			progress.respondDept=unitBox.getValue();			
		}		
		progress.respondUser=userCombo.getValue();
		progress.startDate = formPanel.getForm().findField('startDate').getValue();
		progress.endDate   = formPanel.getForm().findField('endDate').getValue();
		
		if(progress.pbWays=='null'||progress.pbWays==null)
		{
			progress.pbWays = "";
		}
		
		if (!progress.startDate){
			progress.startDate = null;
		}
		if (!progress.endDate){
			progress.endDate = null;
		}
		progress.rateStatus = progress.rateStatus / 100;
		PCBidDWR.saveBidProgress(progress, function(retVal){
			if ( retVal ){
				Ext.example.msg('保存成功！', '您成功保存了当前评标进度信息！');
				loadProgressForm();
			}
			else{
				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		});
	}
	
});
Ext.onReady(function (){

// 创建表单Panel
formPanel = new Ext.FormPanel({
			id : 'form-panel',
			title : '工作进度信息',
			region : 'north',
			height : 180,
			labelAlign : 'left',	
			frame : true,
			items : [
				{
	    			autoWidth:true,
	                border: false,
	                labelWidth: 60,
	                layout: 'column',
					items : [
						{
								layout : 'form',
								border : false,
								columnWidth : 2/9,
								defaults : { 
									// defaults are applied to items,
									//not the container
									//width : 100
								},
								items : [
									new Ext.form.DateField(fcProgress['startDate']),
									new Ext.form.Hidden(fcProgress['uids']),
									new Ext.form.Hidden(fcProgress['pid']),
									new Ext.form.Hidden(fcProgress['contentUids']),
									new Ext.form.Hidden(fcProgress['progressType']),
									new Ext.form.Hidden(fcProgress['isActive'])
								]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 2/9,
							defaults : {
								// defaults are applied to items,
								//width : 100
							},
							items : [new Ext.form.DateField(fcProgress['endDate'])]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 1/3,
							defaults : {
								// defaults are applied to items,
								// not the container
								//width : 140
							},
							items : [unitBox]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 2/9,
							defaults : { 
								// not the container
								//width : 60
							},
							items : [userCombo]
						}]
    			}
    			,{
    				autoWidth:true,
	                border: false,
	                labelWidth: 60,
	                layout: 'column',
    				items:[
    				{
							layout : 'form',
							border : false,
							columnWidth : 2/9,
							defaults : {
								// defaults are applied to items,
								// not the container
								//width : 100
							},
							items : [new Ext.form.NumberField(fcProgress['rateStatus'])]
					},{
							layout : 'form',
							border : false,
							columnWidth : 2/9,
							defaults : { // defaults are applied to items,
								// not the container
								//width : 100
							},
							items : [new Ext.form.ComboBox(fcProgress['pbWays'])]
					},{
							layout : 'form',
							border : false,
							columnWidth :3/9,
							defaults : { // defaults are applied to items,
								// not the container
								//width : 100
							},
							items : [ assessReport]
					},{
							layout : 'form',
							border : false,
							columnWidth : 2/9,
							defaults : { // defaults are applied to items,
								// not the container
								//width : 100
							},
							items : [fjt ]
					}
    				]
    			}
    			,{
    				autoWidth:true,
	                border: false,
	                labelWidth: 60,
	                layout: 'column',
    				items:[{
							layout : 'form',
							border : false,
							columnWidth :3/5,
							defaults : { // defaults are applied to items,
								// not the container
								// width : 100
							},
							items : [new Ext.form.TextField(fcProgress['memo'])]
					}
    				]
    			}    			
    			
			],
			bodyStyle : 'padding:5px 5px 5px 1px',
			buttonAlign : 'center',
			minButtonWidth: 100,
			buttons : [saveBtn]
		}); 
});		
function domBlur(o)
{
	if(disableBtn)
    {
	  o.el.dom.blur();
    }	
}

function bytesOfString(str)
{
	var bytesCount = 0;
	if(null==str||str.length==0)
	{
		return 0;
	}
	
	for(var i=0; i<str.length; i++)
	{
		var c = str.charAt(i);
		if (/^[\u0000-\u00ff]$/.test(c))   //
		{
			//非双字节的编码字节数只+1
			bytesCount += 1;
		}
		else
		{   
			//双字节的编码(比如汉字)字节数+2
			bytesCount += 2;
		}
	}
	
	return bytesCount;
}
//javascript精度小数精度问题，如0.55*100，arg1为乘数，arg2为被乘数
function accMul(arg1,arg2){ 
         var m=0,s1=arg1.toString(),s2=arg2.toString(); 
         try{m+=s1.split(".")[1].length}catch(e){} 
         try{m+=s2.split(".")[1].length}catch(e){} 
         
         return (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(2); 
    } 
    	