var array_user=new Array();
var userCombo;
var dsCombo_user;
var treeCombo;
// 项目单位array
var array_prjs=new Array();
var proTreeCombo;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var unitStore,unitArr,unitBox;
var where="unit_type_id not in ('9')";	
var hide;
if(type&&"PcBidSendZbdoc"==type){
	hide=false;
}else{
	hide=true;
}
// 通用combobox renderer
Ext.util.Format.comboRenderer = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
		return record
				? record.get(combo.displayField)
				: combo.valueNotFoundText;
	}
}
  
var disableBtn = ModuleLVL != '1';
if(parent.dydaView){
	disableBtn=true;
	ModuleLVL=6;
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
DWREngine.setAsync(false);
 	// 项目单位
	var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean2,"",function(list){   
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_prjs.push(temp);			
		}
    }); 	
 
  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  }) 
  db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
	});
DWREngine.setAsync(true);
// 部门用户store
 dsCombo_user=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: ['','']
});				
// 项目单位store
var dsCombo_prjs=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: array_prjs
});
      // 单位选择
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
		// 得到部门所属用户
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
// 域模型
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
	rateStatus : {
		name : 'rateStatus',
		fieldLabel : '工作进度',
		anchor : '90%',
		maxValue : 100,
		minValue : 0,
		style: 'direction: rtl',
		listeners:{
			focus: domBlur,
			render: function(){
				this.el.insertHtml('afterEnd','%');
			}
		}
	},
	respondDept : {
		name : 'respondDept',
		id: 'respondDept',
		fieldLabel : '负责部门',
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
	PcBidSendZbdoc : {
		name : 'PcBidSendZbdoc',
		text : 'dfsfaasfsafasfsfsadfas',
		anchor : '85%',
		listeners:{
			focus: domBlur
		}
	},
	memo : {
		name : 'memo',
		fieldLabel : '备注',
		anchor : '85%',
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
userCombo=new Ext.form.ComboBox(fcProgress['respondUser']);
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
var PcBidSendZbdoc;
var column=1/3;
if(hide==true){
	column=1/1000;
	PcBidSendZbdoc=new Ext.form.Hidden(fcProgress['PcBidSendZbdoc']);
}else{
	column=1/3;
	PcBidSendZbdoc=new Ext.form.Label(fcProgress['PcBidSendZbdoc']);
}
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
		if (!formPanel.getForm().isValid()) {
			return;
		}
		var progress = formPanel.getForm().getValues();
		if(unitBox&&unitBox.getValue()){
			progress.respondDept=unitBox.getValue();			
		}
		progress.respondUser=userCombo.getValue();		
		progress.rateStatus = progress.rateStatus / 100;
		PCBidDWR.saveBidProgress(progress, function(retVal){
			if ( retVal ){
				Ext.example.msg('保存成功！', '您成功保存了当前招标进度信息！');
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
			border : false,
			title : '工作进度信息',
			region : 'north',
			height : 130,
			labelAlign : 'left',	
			layout: 'form',
			frame : true,
			items : [{
				border : false,
				layout : 'column',
				labelWidth : 55,
				items : [{
						layout : 'form',
						border : false,
						columnWidth : 1/3,
						items : [
								unitBox,
								new Ext.form.Hidden(fcProgress['uids']),
								new Ext.form.Hidden(fcProgress['pid']),
								new Ext.form.Hidden(fcProgress['contentUids']),
								new Ext.form.Hidden(fcProgress['progressType']),
								new Ext.form.Hidden(fcProgress['isActive'])]
		
					}, {
						layout : 'form',
						border : false,
						columnWidth : 1/3,
						items : [ userCombo]
					}, {
						layout : 'form',
						border : false,
						columnWidth : 1/3,
						items : [new Ext.form.NumberField(fcProgress['rateStatus'])]
					}
						
					]
				},
//
				{
				border : false,
				layout : 'column',
				labelWidth : 55,
				items : [{
						layout : 'form',
						border : false,
						columnWidth : column,
						items : [PcBidSendZbdoc]
		
					}, {
						layout : 'form',
						border : false,
						columnWidth : 2/3,
						items : [ new Ext.form.TextField(fcProgress['memo'])]
					}
					]
				}],
			buttonAlign : 'center',
			minButtonWidth: 100,
			buttons : [attachBtn,saveBtn]
		}); 	
});		
function domBlur(o)
{
	if(disableBtn)
    {
	  o.el.dom.blur();
    }	
}
// javascript精度小数精度问题，如0.55*100，arg1为乘数，arg2为被乘数
function accMul(arg1,arg2){ 
         var m=0,s1=arg1.toString(),s2=arg2.toString(); 
         try{m+=s1.split(".")[1].length}catch(e){} 
         try{m+=s2.split(".")[1].length}catch(e){} 
         
         return (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(2); 
    } 
			