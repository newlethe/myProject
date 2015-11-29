
var conid = "";
var conno = "";
var conname = "";
var conmoney = "";
//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递
Ext.onReady(function (){
	var btnMoney = new Ext.Button({
		id: 'money',
		text: '合同分摊',
		tooltip: '合同分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			var appUrl;
				appUrl = "PCBusiness/dynamicdata/bdg/bdg.con.app.jsp";
			window.frames[0].location.href = BASE_PATH
							+ appUrl +"?conid="
							+ conid + "&conname=" + encodeURIComponent(conname)
							+ "&conmoney=" + conmoney + "&conno=" + conno+"&pid="+PID+"&time="+TIME ;

		}
	});
	var btnChange = new Ext.Button({
		id: 'change',
		text: '变更分摊',
		tooltip: '变更分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.change.jsp?conid=" + conid + "&conname=" + encodeURIComponent(conname)
			 +　"&conmoney=" + conmoney+ "&conno=" + conno + "&hasNk=" + hasNk;
		}
	});
	var btnPayInfo = new Ext.Button({
		id: 'pay',
		text: '付款分摊',
		tooltip: '付款分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.payInfo.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&hasNk=" + hasNk;
		}
	});
	var btnBreach = new Ext.Button({
		id: 'breach',
		text: '违约分摊',
		tooltip: '违约分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.breach.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname)+ "&conno=" + conno + "&hasNk=" + hasNk;
		}
	});
	var btnCompensate = new Ext.Button({
		id: 'compensate',
		text: '索赔分摊',
		tooltip: '索赔分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.compensate.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&hasNk=" + hasNk;
		}
	});
	var btnBalance = new Ext.Button({
		id: 'balance',
		text: '结算分摊',
		tooltip: '结算分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.balance.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno;
		}
		
	});
	var btnMain = new Ext.Button({
		id: 'main',
		text: '合同信息主页',
		tooltip: '合同信息主页',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp";
		}
	});
	var btnProject = new Ext.Button({
		id: 'project',
		text: '工程量分摊',
		tooltip: '工程量分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.project.apportion.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&type=normal";
		}
	});
	
	var btnChangeProject = new Ext.Button({
	    id : 'changeproject',
	    text : '工程量变更分摊',
	    tooltip : '工程量变更分摊',
	    iconCls :'btn',
	    disabled: true,
	    handler : function (){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.project.change.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&type=normal";	        
	    }
	})
	var btnEqu = new Ext.Button({
		id: 'equation',
		text: '平衡检查',
		tooltip: '平衡检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.conmoney.realmoney.jsp";
		}
	});
	
	var btnPro = new Ext.Button({
		id: 'equproject',
		text: '工程量检查',
		tooltip: '工程量检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.bdgmoney.project.jsp";
		}
	});
	var addToolBar = new Ext.Toolbar({
	    items :[btnMoney,"-",btnChange, "-",btnChangeProject,'-',btnPayInfo , "-", btnCompensate, "-", btnBreach,'-',btnBalance,'-',btnProject,'->',new Ext.Button({
	        text : '返回',
	        iconCls :'returnTo',
	        handler : function (){
	            history.back();
	        }
	    })]
	})
    mainPanel = new Ext.Panel({
    	layout: 'fit',
    	region: 'center',
    	border: false,
    	header: false,
    	contentEl: 'mainDiv',
    	tbar: [],
    	listeners : {
    	    "render" : function (){
    	       addToolBar.render(this.tbar);
    	    }
    	}
    })
    
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [mainPanel]
    });
	
	var gridTopBar = mainPanel.getTopToolbar();
	window.frames[0].location.href = CONTEXT_PATH + '/PCBusiness/dynamicdata/bdg/bdgcon_view.jsp?pid='+PID+'&time='+TIME+'&uids='+UIDS;
});
 function enable(){
 	     if(TYPE==='MONEYAPP'){
	     Ext.getCmp("money").enable();
 	     }
	     if(TYPE==='CONCHANGE'){
	     Ext.getCmp("change").enable();
	     }
	 }
 function disableed(){
         Ext.getCmp("money").disable();
	     Ext.getCmp("change").disable();
	     Ext.getCmp("pay").disable();
	     Ext.getCmp("compensate").disable();
	     Ext.getCmp("breach").disable();
	     Ext.getCmp("balance").disable();
	     Ext.getCmp("project").disable();
	     Ext.getCmp("equation").disable();
	     Ext.getCmp("equproject").disable();
	     Ext.getCmp("main").disable();
	     Ext.getCmp("changeproject").disable();
 }	 