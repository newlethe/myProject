var formPanel,formWin;
var selectedPath="";
Ext.onReady(function() {
	var fm = Ext.form; // 包名简写（缩写）
	var formFc = {
        'condivno':{
        	id:"condivno",
            name: 'condivno',
            fieldLabel: '合同分类',
            readOnly:true,
            anchor:'95%'
        },'conno':{
        	id:"conno",
            name: 'conno',
            fieldLabel: '合同编号',
            readOnly:true,
            anchor:'95%'
        },'partybno':{
        	id:"partybno",
            name: 'partybno',
            fieldLabel: '乙方单位',
            readOnly:true,
            anchor:'95%'
        },'contypename':{
        	id:"contypename",
            name: 'contypename',
            fieldLabel: '合同名称',
            readOnly:true,
            anchor:'95%'
        },'convaluemoney':{
        	id:"convaluemoney",
            name: 'convaluemoney',
            fieldLabel: '合同总金额',
            readOnly:true,
            anchor:'95%'
        },'conpay':{
        	id:"conpay",
            name: 'conpay',
            fieldLabel: '已付款金额',
            decimalPrecision:4,
//            readOnly:true,
            anchor:'95%'
        },'batch':{
        	id:"batch",
            name: 'batch',
            fieldLabel: '批次',
            readOnly:true,
            anchor:'95%'
        },'predictPayment1':{
        	id:"predictPayment1",
            name: 'predictPayment1',
            fieldLabel: '预计本月支付',
            decimalPrecision:4,
            allowBlank:false,
            anchor:'95%'
        },'predictPayment2':{
        	id:"predictPayment2",
            name: 'predictPayment2',
            fieldLabel: '预计下月支付',
            decimalPrecision:4,
            allowBlank:false,
            anchor:'95%'
        },'predictPayment3':{
        	id:"predictPayment3",
            name: 'predictPayment3',
            fieldLabel: '预计隔月支付',
            decimalPrecision:4,
            allowBlank:false,
            anchor:'95%'
        }, 'remark': {
        	id:"remark",
            name: 'remark',
            fieldLabel: '备注',
            anchor:'95%'
        }
        ,'reportId':{id:"reportId",name:'reportId',fieldLabel:'主表主键'}
        ,'conid':{id:"conid",name:'conid',fieldLabel:'固定资产树主键'}
        ,'uids':{id:"uids",name:'uids',fieldLabel:'主键'}
    }
    //创建表单form-panel
    var saveFormBtn = new Ext.Button({
        name: 'save',
       text: '保存',
       iconCls: 'save',
       handler: formSave
    })
    var cancelFormBtn = new Ext.Button({
        name: 'cancel',
       text: '取消',
       iconCls: 'remove',
       handler: function(){
       	  formWin.hide();
       }
    })
    formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 350,
        height: 350,
        split: true,
        collapsible : true,
//        collapsed: false,
        collapseMode : 'mini',
//        minSize: 250,
//        maxSize: 400,
        border: false,
//        autoScroll:true,
        region: 'center',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
        iconCls: 'icon-detail-form',    //面板样式
        labelAlign: 'left',
        buttons : [saveFormBtn,cancelFormBtn],
        items: [
            new Ext.form.FieldSet({
                layout: 'form',
                width : 350,
                border: true,
                labelWidth : 100,
                items: [
	                new fm.Hidden(formFc['uids']),
	                new fm.Hidden(formFc['reportId']),
	                new fm.Hidden(formFc['condivno']),
	                new fm.Hidden(formFc['conid']),
                    new fm.TextField(formFc['contypename']),
                    new fm.TextField(formFc['conno']),
                    new fm.Hidden(formFc['partybno']),
	                new fm.Hidden(formFc['batch']),
                    new fm.NumberField(formFc['convaluemoney']),
                    new fm.NumberField(formFc['conpay']),
                    new fm.NumberField(formFc['predictPayment1']),
                    new fm.NumberField(formFc['predictPayment2']),
                    new fm.NumberField(formFc['predictPayment3']),
                    new fm.TextArea(formFc['remark'])
                    
                ]
            })
        ]
    });
     // 表单保存方法
    function formSave(){
        var form = formPanel.getForm();
        if (form.isValid()){
            doFormSave(true)  //修改
        }else{
        	Ext.Msg.alert("提示","必填值不能为空");
        }
    }
    
    function doFormSave(isNew){
        var form = formPanel.getForm();
        var obj = new Object();
        for (var i=0; i<treeColumns.length; i++){
            var name = treeColumns[i].id;
            var field = form.findField(name);
            if (field){
            	obj[name] = field.getValue();
            }
        }
        DWREngine.setAsync(false);
        fundMonthPlanService.updatefundMonthPlanD(obj,function(){
        	formWin.hide();
        	selectCrrentTreeNode();
        	
        });
        DWREngine.setAsync(true);
    }
});
//定位到上次选择的树节点           
function selectCrrentTreeNode(){
    var rec = treeGrid.getSelectionModel().getSelected();
    if(rec){
        selectedPath = treeStore.getPath(rec, "conid");
        treeStore.load();
    }
 }
function showFormWin() {
	if (!formWin) {
		formWin = new Ext.Window({
					title : '月度资金计划明细信息编辑',
					iconCls : 'form',
					layout : 'border',
					closeAction : 'hide',
					width : 380,
					height: 340,
					modal : true,
					resizable : false,
					closable : false,
					border : false,
					maximizable : false,
					plain : true,
					items : [formPanel]
				});
	}
	var record=treeSm.getSelected();
	formPanel.getForm().reset();
	formWin.show();
    formPanel.getForm().loadRecord(record);
}