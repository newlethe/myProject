
if(PID!=''&&PRONAME!=''){
    switchoverProj(PID,PRONAME);
}
Ext.onReady(function(){
	DWREngine.setAsync(false);
	pcJdgkMgm.isHaveProjectPlan(CURRENTAPPID,plan,function(str){
		ProjectUID = str
	})
	DWREngine.setAsync(true);
	var proPanel=new Ext.Panel({
		id:'proPanel',
		region:'center',
		autoScroll :true,
		frame:false,
		border: false,
		html:'<iframe name="contentFrame" width="100%" height="100%" frameborder="0" src=""></iframe>'
	});
	
	var view = new Ext.Viewport({
		layout:'border',
		items:[proPanel]
	});
	
	if(ProjectUID == null || ProjectUID == "null"){
		var planName = "里程碑计划";
		if(plan == "yi")planName = "一级网络计划";
		Ext.Msg.show({
			title : '提示',
			msg : "该项目单位还没有"+planName+"！",
			buttons : Ext.Msg.OK,
			icon : Ext.MessageBox.QUESTION
		});
	}else{
		if(plan == "li"){
		     window.frames["contentFrame"].location.href=basePath+"/gantt/index.li.jsp?projectid="+ProjectUID+"&isEditPlan="+isEditPlan+"&isPlan=true&isView="+isView;	
		}else{
		     window.frames["contentFrame"].location.href=basePath+"/gantt/index.jsp?projectid="+ProjectUID+"&isEditPlan="+isEditPlan+"&isPlan=true&isView="+isView;		
		}
	}
})
