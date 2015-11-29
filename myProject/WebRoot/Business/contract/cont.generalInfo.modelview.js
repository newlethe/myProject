

var conBean = "com.sgepit.pmis.contract.hbm.ConOve"
//var contractType= [['01', '工程合同'],['02', '其他合同'],['03', '总承包合同'],['04', '设备(自营)合同'],['06', '设备(总包)合同'],['05','前期合同'],['-1', '所有合同']];
//var BillState = [[1,'合同签订'],[2,'合同执行'],[3,'付款完成'],[4,'合同结算'],[5,'终止合同']];
//var payways =[ [01,'现金'],[02,'现金支票'],[03,'转账支票'],[04, '电汇'],[05,'信用证'],[06,'其他']];
//var penaltytypes= [['01','甲方违约'],['02','乙方违约'],['03','承包商违约'],['-1','其他']]
//var changes = [['01','甲方变更'],['02','乙方变更'],['03','设计变更'],['04','不可抗拒力']['-1','其他']]
//var compensateTypes = [['01','甲方索赔'],['02','乙方索赔'],['03','承包商索赔'],['-1','其他']];
//var expressList = new Array();
var countInfoList = new Array();
var partBs = new Array();
var contractType = [['GC','工程合同分类'],['SB','设备合同分类'],['QT','其它合同分类']];
var sortType = new Array();
var BillState = new Array();
var payways = new Array();
var penaltytypes = new Array();
var changes = new Array();
var compensateTypes = new Array();
var conAllInfo = null;
var tabPay, tabChange, tabBreach, tabCompensate, tabBalance
var payMoneyTotal,alreadyMoney,processMoney


Ext.onReady(function (){

	DWREngine.setAsync(false);	
//	DWREngine.beginBatch(); 
//    conexpMgm.getExpression('合同付款', function(list){			//获取合同付款表达式
//    	for (i = 0; i < list.length; i++){
//    		var temp = new Array();
//    		temp.push(list[i].expression);
//    		temp.push(list[i].expression);
//    		expressList.push(temp);
//    	}
//    });
    conpartybMgm.getPartyB(function(list){        				 //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].partybno);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
   	baseMgm.findById(conBean, g_conid, function(con_obj){
    	conAllInfo = con_obj;
    });
    conpartybMgm.getPartyBBean(conAllInfo.partybno, function(pd_obj){
    	conAllInfo.partybbank = pd_obj.partybbank;
    	conAllInfo.partybbankno = pd_obj.partybbankno;  
    	conAllInfo.partyb = pd_obj.partyb;
    	conAllInfo.partyblawer = pd_obj.partyblawer;
    	conAllInfo.address = pd_obj.address;
    	conAllInfo.postalcode = pd_obj.postalcode;
    	conAllInfo.phoneno = pd_obj.phoneno;
    	conAllInfo.homepage = pd_obj.homepage;
    });
//    appMgm.getCodeValue('合同划分类型',function(list){         //获取合同划分类型
//		for(i = 0; i < list.length; i++) {
//			var temp = new Array();	
//			temp.push(list[i].propertyCode);		
//			temp.push(list[i].propertyName);	
//			contractType.push(temp);			
//		}
//    }); 
    
     appMgm.getCodeValue('工程合同分类',function(list){         //获取合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			sortType.push(temp);			
		}
    }); 
     appMgm.getCodeValue('设备合同分类',function(list){         //获取合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			sortType.push(temp);			
		}
    });   
     appMgm.getCodeValue('其它合同分类',function(list){         //获取合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			sortType.push(temp);			
		}
    });   
    
    appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同付款方式',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			payways.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同变更类型',function(list){         //获取变更类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			changes.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同索赔类型',function(list){         //获取合同索赔类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			compensateTypes.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同违约类型',function(list){         //获取合同违约类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			penaltytypes.push(temp);			
		}
    }); 
    
    conexpMgm.getCountInfo("合同付款",g_conid,"",function(list){
    	for(var i=0;i<list.length;i++){
    		if(list[i][0] == "累计实际付款"){
    			payMoneyTotal = list[i][1];
    			break;
    		}
    	}
    })
    
    conpayMgm.getMoneyMessage(g_conid,function(obj){  // 获得合同查询里面的已付金额  和 处理中金额
    	alreadyMoney = obj[0];
    	processMoney = obj[1];
    })
    
//    DWREngine.endBatch();
    DWREngine.setAsync(true);
    
    var dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contractType
    });
    
    var payTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : payways
    });
    
//    var expressType = new Ext.data.SimpleStore({
//        fields: ['k', 'v'],
//        data : expressList
//    });

    var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
    
	////////////////////////////////////////////////////////////////////////////////////////////////
	tabPay = new Ext.TabPanel({
        activeTab: 0,
        height: 155,  
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
           	id: 'pay',
			title: '付款情况',
			autoLoad: {
				url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
				params: 'type=pay&conid='+ g_conid,
				text: "Loading..."
			}
        }]
    });
    
    tabChange = new Ext.TabPanel({
        activeTab: 0,
        height: 155,        
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'change',
	            	title: '变更情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=change&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });

    tabBreach = new Ext.TabPanel({
        activeTab: 0,
        height: 155,        
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'breach',
					title: '违约情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=breach&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });
    
    tabCompensate = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'compensate',
	                title: '索赔情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=compensate&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });
    
    tabBalance = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	          	id: 'balance',
	            title: '结算情况',
				autoLoad: {
					url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
					params: 'type=balance&conid='+ g_conid,
					text: "Loading..."
				}
        	}
        ]
    });
    
    
    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同详细信息',
        autoHeight: true,
        bodyStyle: 'padding: 5px;',
        border: false
    });
    
	var bodyPanel = new Ext.Panel({
    	border: false,
    	autoScroll: true,
    	layout: 'fit',
    	items: [viewPanel, tabPay, tabChange, tabBreach, tabCompensate, tabBalance]
    });
    
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [bodyPanel]
    });
   
	tabPay.getEl().setDisplayed("none");
	tabChange.getEl().setDisplayed("none");
	tabBreach.getEl().setDisplayed("none");
	tabCompensate.getEl().setDisplayed("none");
	tabBalance.getEl().setDisplayed("none");

    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	if(formData.convalue == 0)formData.actualPercent = 0;
	else formData.actualPercent = (alreadyMoney/formData.convalue*100).toFixed(2) +'%';
	
	formData.condivno = contractTypeRender(formData.condivno);
	formData.sort = sortTypeRender(formData.sort);	
	formData.billstate = billTypeRender(formData.billstate);
	formData.payway = payTypeRender(formData.payway);
	formData.signdate = formatDate(formData.signdate);
	formData.enddate = formatDate(formData.enddate);
	formData.startdate = formatDate(formData.startdate);	
	formData.convalue = "￥"+formData.convalue;
	formData.payMoneyTotal = "￥"+payMoneyTotal; 
	formData.bidprice = "￥"+formData.bidprice
	formData.processMoney = "￥"+processMoney;
	formData.alreadyMoney = "￥"+alreadyMoney;
	
	DWREngine.setAsync(false);	
	conoveMgm.getRealName(formData.conadmin, function(real_name){
		formData.conadmin = real_name;
    });
    DWREngine.setAsync(true);
	
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

    function getComboxValue(k, ds){
    	var str = "&nbsp;"
    	for(var i=0; i<ds.getCount(); i++){
    		var r = ds.getAt(i)
    		if (r.get('k') == k) {
    			str = r.get('v')
    			break;
    		}
    	}
    	if (str != "")
    		return str
    	else
    		return k
    }
    // 下拉列表中 k v 的mapping 
   	function payTypeRender(value){	//付款类型
   		var str = '';
   		for(var i=0; i<payways.length; i++) {
   			if (payways[i][0] == value) {
   				str = payways[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function contractTypeRender(value){	//合同类型
   		var str = '';
   		for(var i=0; i<contractType.length; i++) {
   			if (contractType[i][0] == value) {
   				str = contractType[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function billTypeRender(value){	//合同状态类型
   		var str = '';
   		for(var i=0; i<BillState.length; i++) {
   			if (BillState[i][0] == value) {
   				str = BillState[i][1]
   				break; 
   			}
   		}
   		return str;
   	}

	function sortTypeRender(value){
		var str = '';
   		for(var i=0; i<sortType.length; i++) {
   			if (sortType[i][0] == value) {
   				str = sortType[i][1]
   				break; 
   			}
   		}
   		return str;		
	}   	
   	
});



