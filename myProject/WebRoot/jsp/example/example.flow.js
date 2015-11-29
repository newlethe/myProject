var startFlowBtn;
Ext.onReady(function() {
	//启动流程按钮 begin -added by Liuay
	startFlowBtn = new Ext.Toolbar.Button({
		id: 'start_flow',
		iconCls : 'cbPlan',
		text: "启动流程",
		tooltip: '启动流程',
		disabled: false,
		handler: startFlowFun
	})
	
	//启动流程按钮的处理事件 -- begin  
	function startFlowFun(){
		var records = sm.getSelections();
		//流程的主题
		var flowSubject = records[0].data["title"];
		//业务数据的过滤条件
		var retriveCondition = records[0].data["lsh"];
		//业务数据的时间标识
		var sjType = "2009-11";//records[0].data["sjType"];
		//调用flow.start.jsp中已经定义的startFlow()方法
		startFlow(flowSubject, retriveCondition, sjType);
	}
});
 
function startFlowReply(){
		//设置业务数据的流程状态为“审批中”
		//刷新处理页面
}
