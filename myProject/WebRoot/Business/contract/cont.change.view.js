var bean = "com.sgepit.pmis.contract.hbm.ConCha"
var changes = new Array();
var changeType = new Array();
var conAllInfo = null;

Ext.onReady(function (){
 	DWREngine.setAsync(false);
	appMgm.getCodeValue('合同变更类型',function(list){      //获取变更类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			changes.push(temp);		
		}
    });
    baseMgm.findById(bean, g_chaid, function(con_obj){
    	conAllInfo = con_obj;
    });
	DWREngine.setAsync(true);
	
	var dschangeType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: changes
    });
	var fm = Ext.form;
	var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更单编号',
			readOnly:true,
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额', 
			allowNegative: false,
			readOnly:true,
            maxValue: 100000000,         
			anchor:'95%'
         }, 'actionman': {
			name: 'actionman',
			readOnly:true,
			fieldLabel: '经班人',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期',
			readOnly:true,
			width:130, 
			format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型',
			store: dschangeType,
			readOnly : true,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            width:120,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
			anchor:'95%'
         }, 'chareason': {
			name: 'chareason',
			fieldLabel: '变更依据',  
			height:60,
			readOnly:true,
			hideLabel:true,
			width:300,        
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '变更内容',
			height:60,
			readOnly:true,
			hideLabel:true,
			width:300,
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件号',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }
	};

    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同变更详细信息',
        autoHeight: true,
        bodyStyle: 'padding: 5px;',
        border: false
    });
    
	var panel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
		tbar: [
				new Ext.Button({
					text: '<font color=#15428b><b>合同变更详细信息</b></font>',
					iconCls: 'title'
				}),'->',
				new Ext.Button({
					text: '修改',
					iconCls: 'btn',
					disabled : dyView=='true'?true:false,
					handler: function(){
						var url = BASE_PATH+"Business/contract/cont.change.addorupd.jsp?";
						window.location.href = url + "conid="+g_conid+"&chaid=" + g_chaid + "&tid='udp'";
						
					}
				}),'-',
				new Ext.Button({
					text: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})
		],
    	items: [viewPanel]
    });
    
    var viewport = new Ext.Viewport({
	    layout: 'border',
	    items: [panel]
	});
   
    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	formData.chatype = dschangeTyperender(formData.chatype);
	formData.chadate = formatDate(formData.chadate);
	formData.chamoney = formData.chamoney;
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null") formData[o] = "&nbsp;"
		if(o.indexOf('money') != -1) formData[o] = "￥"+formData[o];
	}
	
	var tplstr = new Array();
	
	tplstr = document.all.viewFormDiv.innerHTML
    var tpl = new Ext.Template(tplstr);
	tpl.overwrite(viewPanel.body, formData);

	

    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

	// 下拉列表中 k v 的mapping 
   	function dschangeTyperender(value){	//付款类型
   		var str = "";
    		for(var i=0; i<changes.length; i++) {
   			if (changes[i][0] == value) {
   				str = changes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   
   	
});