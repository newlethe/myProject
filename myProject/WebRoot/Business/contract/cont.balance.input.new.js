var bean = "com.sgepit.pmis.contract.hbm.ConBalNew"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "conid"
var gridPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo + "，结算记录";
var billTypes = [['0','未发送'],['-1','处理中'],['1','处理完毕']];
var propertyName = "conid"
var propertyValue = selectedConId;
var SPLITB = "`"
var pid = CURRENTAPPID;
var countInfoList = new Array();
var conObj = new Object();
var totalMoney = "";
var whereStr =propertyName+"='"+propertyValue+"'";
var outFilter ="1=1";
var balTypeArr = new Array();
var billArr = new Array();
var ds;
if(UIDS!=""){
	var len=UIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
}
Ext.onReady(function (){
    DWREngine.setAsync(false);
    var beanName = "com.sgepit.pmis.contract.hbm.ConOve";
    baseMgm.findById(beanName, selectedConId, function(obj){
    	conObj = obj;
    });
    
    appMgm.getCodeValue("合同结算类型",function(list){
    	if(list){
    		for(var i=0;i<list.length;i++){
    			var temp = new Array();
    			temp.push(list[i].propertyCode);
    			temp.push(list[i].propertyName);
    			balTypeArr.push(temp);
    		}
    	}
    });
    appMgm.getCodeValue("流程状态",function(list){
    	if(list){
    		for(var i=0;i<list.length;i++){
    			var temp = new Array();
    			temp.push(list[i].propertyCode);
    			temp.push(list[i].propertyName);
    			billArr.push(temp);
    		}
    	}
    });
    DWREngine.setAsync(true);
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uids': {
			name: 'uids',
			fieldLabel: '主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'			
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'balNo': {
			name: 'balNo',
			fieldLabel: '结算编号',
			anchor: '95%'
         }, 'balPrice': {
			name: 'balPrice',
			fieldLabel: '竣工结算报价', 
			anchor:'95%'
         }, 'balApproPrice': {
			name: 'balApproPrice',
			fieldLabel: '竣工结算审批价', 
			readOnly: true,         
			anchor:'95%'
         }, 'balType': {
			name: 'balType',
			allowNegative:false,
			fieldLabel: '结算类型',      
			anchor:'95%'
         }, 'applyMan': {
			name: 'applyMan',
			fieldLabel: '申请人',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'applyDate': {
			name: 'applyDate',
			fieldLabel: '申请时间',  
			format: 'Y-m-d',
            minValue: '2000-01-01',
			fieldLabel: '申请时间',          
			anchor:'95%'
         }, 'fileid': {
			name: 'fileid',
			fieldLabel: '附件',  
			allowNegative: false,   
			anchor:'95%'
         }, 'billState': {
			name: 'billState',
			fieldLabel: '单据状态',  
			allowNegative:false,
			readOnly : true,        
			anchor:'95%'
         }, 'conMoney': {
			name: 'conMoney',
			fieldLabel: '合同金额',
			readOnly : true,          
			anchor:'95%'
         }, 'payMoney': {
			name: 'payMoney',
			fieldLabel: '已付金额',
			readOnly : true,          
			anchor:'95%'
         },'payDetail': {
			name: 'payDetail',
			fieldLabel: '付款明细',
			readOnly : true,          
			anchor:'95%'
         },'doBalMoney': {
			name: 'doBalMoney',
			fieldLabel: '处理中结算金额',
			readOnly : true,          
			anchor:'95%'
         },'doneBalMoney': {
			name: 'doneBalMoney',
			fieldLabel: '已处理结算金额',
			readOnly : true,          
			anchor:'95%'
         }
    }
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'uids',
           header: fc['uids'].fieldLabel,
           dataIndex: fc['uids'].name, 
           hidden:true,
           width: 90
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           width: 120
        },{
           header: fc['balNo'].fieldLabel,
           dataIndex: fc['balNo'].name,
           width: 120
        },{
           header: fc['balPrice'].fieldLabel,
           dataIndex: fc['balPrice'].name,
           align:'right',
           width: 120,
           renderer: function(v,c,r){
           		var payMoney = r.get("payMoney");
           		if(v < payMoney){
           			return "<html><span style='color:red'>"+cnMoneyToPrec(v,2)+"</span></html>";
           		}else{
           			return cnMoneyToPrec(v,2);
           		}
           }
        },{
           header: fc['balApproPrice'].fieldLabel,
           dataIndex: fc['balApproPrice'].name,
           align:'right',
           width: 120,
           renderer: function(v,c,r){
           		var payMoney = r.get("payMoney");
           		if(v < payMoney){
           			return "<html><span style='color:red'>"+cnMoneyToPrec(v,2)+"</span></html>";
           		}else{
           			return cnMoneyToPrec(v,2);
           		}
           }
        },{
           header: fc['balType'].fieldLabel,
           dataIndex: fc['balType'].name,
           width: 110, 
           align:'left',
           renderer:function(v){
           		var str='';
       			for(var i=0;i<balTypeArr.length;i++){
       				if(v==balTypeArr[i][0]){
       					str = balTypeArr[i][1]
       				}
       			}
           		return str;
           }
        },{
           header: fc['applyMan'].fieldLabel,
           dataIndex: fc['applyMan'].name,
           width: 90, 
           align:'left'
        },{
           header: fc['applyDate'].fieldLabel,
           dataIndex: fc['applyDate'].name,
           width: 120, 
           align:'center',
           renderer: formatDate      
        },{
           header: fc['fileid'].fieldLabel,
           dataIndex: fc['fileid'].name,
           width: 70,
           align:'center',
           renderer: renderConAdjust
        },{
           header: fc['billState'].fieldLabel,
           dataIndex: fc['billState'].name,
           width: 90, 
           align:'center',
           hidden:true,
           renderer:function(v){
           		var str='';
       			for(var i=0;i<billArr.length;i++){
       				if(v==billArr[i][0]){
       					str = billArr[i][1]
       				}
       			}
           		return str;
           }
        },{
           header: fc['conMoney'].fieldLabel,
           dataIndex: fc['conMoney'].name,
           width: 90, 
           align:'right',
           renderer: function(v){ return cnMoneyToPrec(v,2) }
        },{
           header: fc['payMoney'].fieldLabel,
           dataIndex: fc['payMoney'].name,
           width: 90, 
           align:'right',
           renderer: function(v){ return cnMoneyToPrec(v,2) }
        },{
           header: fc['payDetail'].fieldLabel,
           dataIndex: fc['payDetail'].name,
           width: 120, 
           align:'center',
           renderer:renderPayDetail
        },{
           header: fc['doBalMoney'].fieldLabel,
           dataIndex: fc['doBalMoney'].name,
           width: 90, 
           hidden:true,
           align:'right',
           renderer: function(v){ return cnMoneyToPrec(v,2) }
        },{
           header: fc['doneBalMoney'].fieldLabel,
           dataIndex: fc['doneBalMoney'].name,
           hidden:true,
           width: 90, 
           align:'right',
           renderer: function(v){ return cnMoneyToPrec(v,2) }
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序
    // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'balNo', type: 'string'},
		{name: 'balPrice', type: 'float'},
		{name: 'balApproPrice', type: 'float'},
		{name: 'balType', type: 'string'},
		{name: 'applyMan', type: 'string'},
		{name: 'applyDate', type: 'date', dateFormat:'Y-m-d H:i:s'},
		{name: 'fileid', type: 'string'},    	
		{name: 'billState', type: 'string'},
		{name: 'conMoney', type: 'float'},
		{name: 'payMoney', type: 'float'},
		{name: 'payDetail', type: 'string'},
		{name: 'doBalMoney', type: 'float'},
		{name: 'doneBalMoney', type: 'float'}
	];
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: whereStr
		},
		
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
		iconCls: 'title'
	})
	var addBtn = new Ext.Button({
		text: '新增',
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"Business/contract/cont.balance.addorupdate.new.jsp?";
			window.location.href = url + "conid="+selectedConId;
		}
	});
	var updateBtn = new Ext.Button({
		text: '修改',
		iconCls: 'btn',
		handler: function(){
			var rec = sm.getSelected();
			if(rec){
				var uids = rec.get("uids");
				var url = BASE_PATH+"Business/contract/cont.balance.addorupdate.new.jsp?";
				window.location.href = url + "conid="+selectedConId+"&uids="+uids;
			}else{
				Ext.example.msg("提示","请选择需要修改的数据");
			}
		}
	});
	var delBtn = new Ext.Button({
		text: '删除',
		iconCls: 'remove',
		handler: function(){
			var rec = sm.getSelected();
			if(rec){
				var uids = rec.get("uids");
				var bill = rec.get("billState");
				/**if(bill == '1'){
					Ext.example.msg("提示","该数据已审批，不能删除");
					return;
				}*/
				Ext.MessageBox.confirm("提示","是否确认删除该条结算记录？",function(btn){
					if(btn == 'yes'){
						conbalMgm.deleteConbalNew(uids,function(state){
							if(state ==''){
								Ext.example.msg('删除成功！', '您成功删除了一条合同结算信息！');
								ds.reload();
							}
						});
					}
				})
			}else{
				Ext.example.msg("提示","请选择需要删除的数据");
			}
			
		}
	});
	
	var doMoneyBtn = new Ext.Button({
		id:'doMoneyBtn'
	});
	
	var doneMoneyBtn = new Ext.Button({
		id:'doneMoneyBtn'
	});
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
			window.location.href = url + "isBack=1&uids="+UIDS+"&optype="+OPTYPE+"&conids="+CONIDS+"&dyView="+dyView+"&page="+page;
		}
	});
	
    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.GridPanel({
        store: ds,
        cm: cm,
        sm: sm,
        tbar: [titleBar, '-','处理中结算金额:',doMoneyBtn,'-','已处理结算金额:',doneMoneyBtn,'->',addBtn,'-',updateBtn,'-',delBtn,'-', btnReturn,'-','计量单位：元'],
        //split: true,
        iconCls: 'icon-show-all',
        border: false, 
        region: 'center',
        header: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        trackMouseOver:true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
        width:800,
	    height:450
	});
    
	var viewport = new Ext.Viewport({
	    layout:'border',
	    items: [grid]
	});
	// 12. 加载数据
    ds.load();
    
	// 11 事件绑定
	var doMoney = 0;//处理中结算金额
	var doneMoney = 0;//已处理结算金额
	DWREngine.setAsync(false);
	baseMgm.getData("select sum(t.bal_appro_price) from CON_BAL_NEW t where t.bill_state <> '1' and conid='"+selectedConId+"'",function(list){
		if(list){
			doMoney = list[0]
		}
	});
	baseMgm.getData("select sum(t.bal_appro_price) from CON_BAL_NEW t where t.bill_state = '1'  and conid='"+selectedConId+"'",function(list){
		if(list){
			doneMoney = list[0]
		}
	});
	DWREngine.setAsync(true);
    ds.on('load', function(store){
    	if (!store.getCount() > 0) return
    	doMoneyBtn.setText("<font color=red size=2>" + cnMoneyToPrec(doMoney,2) + "</font>");
    	doneMoneyBtn.setText("<font color=red size=2>" + cnMoneyToPrec(doneMoney,2) + "</font>");
    	var selBalId = store.getAt(0).get('balid');
    	DWREngine.setAsync(false);
    	conexpMgm.getCountInfo('合同结算',selectedConId, selBalId, function(list){
	    	for (i = 0; i < list.length; i++){
	    		var temp = new Array();
	    		temp.push(list[i][0]);
	    		temp.push(list[i][1]);
	    		countInfoList.push(temp);
	    	}
	    });
	    DWREngine.setAsync(true);
    });
    
    function formatDate(value){
        return value ? value.dateFormat('Y年m月d日') : '';
    };
    
	function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ conObj.conno+'</span>'
		return output;
	}
	
	function billTypeRender(value){	//单据状态类型
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});
//附件
function renderConAdjust(value, metadata, record) {
	var uids = record.get('uids');
	var count=0;
	DWREngine.setAsync(false);
	db2Json.selectData("select count(*) filesh from SGCC_ATTACH_LIST t where t.transaction_id ='"+uids+"'", function (jsonData) {
		var list = eval(jsonData);
		if(list!=null){
			count=list[0].filesh;
		}
	});
	DWREngine.setAsync(true);
	return "<a href='javascript:void(0)'  style='color:blue;' onclick='conAdjustWin(\"" + uids + "\")'>查看["+count+"]</a>";
}
//查看合同附件函数
function conAdjustWin(uids){
	if (uids == null || uids == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}
	var businessType="CON_BAL";
	var editable=true;
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ uids;
	var fileWin1 = new Ext.Window({
				title : '附件信息',
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin1.show();
	fileWin1.on("close", function() {
		ds.reload();
	});
}
//付款明细
function renderPayDetail(value, metadata, record){
	var uids = record.get('uids');
	var conid = record.get('conid');
	return "<a href='javascript:void(0)'  style='color:blue;' onclick='showPayDetail(\"" + conid + "\")'>查看</a>";
}
function showPayDetail(conid){
	var detailUrl = CONTEXT_PATH
			+ "/Business/contract/cont.payInfo.input.jsp?pageType=showDetail&conid="+conid;
	var detailWin = new Ext.Window({
				title : '付款明细',
				width : document.body.clientWidth,
				height : document.body.clientHeight,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='detailFrame' src='"
						+ detailUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	detailWin.show();
}




