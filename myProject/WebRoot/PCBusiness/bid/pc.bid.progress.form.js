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
			record.data.rateStatus = record.data.rateStatus * 100;
		}
		this.setValues(record.data);
        return this;
	}
}); 

var formPanel;
var progressBusinessType = 'PCBidProgress';

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
	startDate : {
		id : 'startDate',
		name : 'startDate',
		fieldLabel : '开始时间',
		format : 'Y-m-d',
		anchor : '95%',
		listeners:{
			focus: domBlur
		}
	},
	endDate : {
		id : 'endDate',
		name : 'endDate',
		fieldLabel : '结束时间',
		format : 'Y-m-d',
		anchor : '95%',
		listeners:{
			focus: domBlur
		}
	},
	rateStatus : {
		name : 'rateStatus',
		fieldLabel : '工作进度',
		toolTip : 'gagag',
		unitText : '%',
		anchor : '95%',
		maxValue : 100,
		minValue : 0,
		style: 'direction: rtl',
		listeners:{
			focus: domBlur
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
		name : 'respondUser',
		id: 'respondUser',
		fieldLabel : '负责人',
		anchor : '95%',
		listeners:{
			focus: domBlur
		}
	},
	memo : {
		name : 'memo',
		fieldLabel : '备注',
		anchor : '95%',
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

var BidProgress = Ext.data.Record.create(fcProgress);

// 基本信息fieldSet
var formFieldsSet = new Ext.form.FieldSet({
			border : false,
			layout : 'column',
			labelWidth : 60,
			items : [{
				layout : 'form',
				border : false,
				columnWidth : 1/3,
				
				defaults : { // defaults are applied to items,
					// not the container
					width : 100
					
				},
				items : [new Ext.form.DateField(fcProgress['startDate']),
						new Ext.form.TextField(fcProgress['respondDept']),
						
						new Ext.form.Hidden(fcProgress['uids']),
						new Ext.form.Hidden(fcProgress['pid']),
						new Ext.form.Hidden(fcProgress['contentUids']),
						new Ext.form.Hidden(fcProgress['progressType']),
						new Ext.form.Hidden(fcProgress['isActive'])]

			}, {
				layout : 'form',
				border : false,
				columnWidth : 1/3,
				defaults : { // defaults are applied to items,
					// not the container
					width : 100
				},
				items : [new Ext.form.DateField(fcProgress['endDate']),
						new Ext.form.TextField(fcProgress['respondUser'])
						]
			}, {
				layout : 'form',
				border : false,
				columnWidth : 1/3,
				defaults : { // defaults are applied to items,
					// not the container
					width : 100
				},
				items : [new Ext.form.NumberField(fcProgress['rateStatus']),
						
						new Ext.form.TextField(fcProgress['memo'])]
			}]

		});
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
		progress.startDate = formPanel.getForm().findField('startDate').getValue();
		progress.endDate = formPanel.getForm().findField('endDate').getValue();
		
		if (!progress.startDate){
			progress.startDate = null;
		}
		if (!progress.endDate){
			progress.endDate = null;
		}
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

// 创建表单Panel
formPanel = new Ext.FormPanel({
			id : 'form-panel',
			title : '工作进度信息',
			region : 'north',
			height : 150,
			labelAlign : 'left',	
			frame : true,
			items : [formFieldsSet],
			bodyStyle : 'padding:5px 5px 5px 5px',
			buttonAlign : 'center',
			minButtonWidth: 100,
			buttons : [attachBtn,saveBtn]
		}); 
		
function domBlur(o)
{
	if(disableBtn)
    {
	  o.el.dom.blur();
    }	
}
			