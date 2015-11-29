var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth + '01'
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月' + '01次'
var months = new Array()
var data_sj = new Array()
var combox_month,combox_sj
var btn_create,btn_update,btn_delete,btn_grant,btn_modify
var deptId = ""
/*if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{*/
	deptId = UNITID 
//}
var xcBonus
//var nowQh = '0371'
var store_month,store_sj

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);
	rlzyMgm.findSjListForXcBonusD(USERID,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].toString());
			temp.push(list[i].toString().substring(0,4)+'年'+list[i].toString().substring(4,6)+'月'+list[i].toString().substring(6,8)+'次');
			months.push(temp);
		}
	});
    DWREngine.setAsync(true);
    
//	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
//	var label_user = new Ext.Toolbar.TextItem({text:"填写人："+REALNAME});
	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);
	var label_month = new Ext.Toolbar.TextItem({text:"奖金："});

	store_month = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: months
	})
	
	combox_month = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '时间',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择时间...',
            store: store_month,
            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
	});
    combox_month.on('select', function(obj, record, idx ){
		nowSj = record.data.value
		//if(findXcBonusM("query"))
		//	openCell()
		findXcBonusM("query")
    });
	
	var text_memo = new Ext.form.TextField({id:'text_memo'});
	//text_memo.on('blur',modify)
	btn_modify = new Ext.Toolbar.Button({
//		text: '',
		tooltip: '修改说明',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/save.gif',//accept.png',
//		disabled: true,
		hidden: true,
		handler: modify
	});
	
	btn_grant = new Ext.Toolbar.Button({
		text: '发放',
		tooltip: '奖金发放',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/coins.png',
		disabled: true,
		hidden: true,
		handler: grant
	});
	
	btn_create = new Ext.Toolbar.Button({
//		text: '',
		tooltip: '生成奖金',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		hidden: true,
		handler: create
	});
	
	btn_update = new Ext.Toolbar.Button({
		text: '重复生成',
		tooltip: '根据基数及系数、考勤情况重新生成奖金',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/arrow_undo.png',
		disabled: true,
		hidden: true,
		handler: update
	});
	
	btn_delete = new Ext.Toolbar.Button({
		text: '删除',
		tooltip: '删除当前选择时间奖金数据',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/delete.png',
		disabled: true,
		hidden: true,
		handler: deleteCheckAndDo
	});
	/**/
    var tbar = new Ext.Toolbar({
    	items:[
			label_month
    		,combox_month
    		,btn_create
//    		,'-'
//    		,btn_update
//    		,'-'
    		,btn_delete
    		,'-',btn_grant/**/
    		,'->',label_state//,'-','发放说明：',text_memo,btn_modify
		]
	});
	
	var cellPanel = new Ext.Panel({
		region: 'center',
			//layout: 'fit',
			frame: true,
			html: '<iframe name="cellFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var contentPanel = new Ext.Panel({
		id : 'content',
		title : '奖金管理',
		renderTo: "center",
		layout:'border',
		region:'center',
        border: false,
        tbar: tbar,
        items: [cellPanel]
	});
	
//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	
	function getNewSj(store,sj){
		var rtn = sj
		try{
			for(i = 0; i < store.getCount(); i++){
				if(store.getAt(i).get("value") == sj){
					var count = sj.substring(6,8)*1+1
					sj = sj.substring(0,6)+((count<10)?'0':'')+count
					rtn = getNewSj(store,sj)
				}
			}
		}catch(e){}
		return rtn
	}
	var win
	function create(){
		data_sj = new Array()
		for(y = nowYear; y >= nowYear-1; y--) {
			for(m = 12; m >= 1; m--) {
				var temp = new Array();
				var flag = true;
				/*for(i = 0; i < store_month.getCount(); i++){
					if(store_month.getAt(i).get("value") == y+''+(((m<10)?'0':'') + m)){
						flag = false;
						break;
					}
				}*/
				sj = y+''+(((m<10)?'0':'') + m)+'01'
				try{
					sj = getNewSj(store_month,sj)
					if(flag){
						temp.push(sj);
						temp.push(sj.substring(0,4)+'年'+sj.substring(4,6)+'月'+sj.substring(6,8)+'次');
						data_sj.push(temp);
					}
				}catch(e){alert('有错误')}
			}
		}
		
		store_sj = new Ext.data.SimpleStore({
			fields: ['value','text'],   
			data: data_sj
		})
		var combox_sj = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '奖金月份',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择奖金月份...',
            store: store_sj,
//            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		});
		//if(!win){
			win = new Ext.Window({
				id:'sjChooseWin',
				title : '选择奖金月份',
				width : 250,
				height : 100,
				autoScroll : true,
				isTopContainer : true,
				modal : true,
				resizable : false,
				layout : 'form',
				buttons: [{
					text: '确定',
					handler: function() {
						nowSj = combox_sj.getValue()
						nowSjDesc = nowSj.substring(0,4)+'年'+nowSj.substring(4,6)+'月'+nowSj.substring(6,8)+'次'
					    if(!findXcBonusM("create")){
					    	alert('没有正确生成或找到数据')
				    	}else{
				    		store_month.add(new Ext.data.Record({value:nowSj,text:nowSjDesc}))
				    		combox_month.setValue(nowSj)
				    		//store_sj.remove(store_sj.getAt(store_sj.find('value',nowSj)))
					    	win.close();
				    	}
					    //checkButton()
					}
				}, {
					text: '取消',
					handler: function() {
						win.close();
					}
				}],
				
				items : [combox_sj]
			})
    	//}
    	win.show();
	}
	
	function update(){
		if(!findXcBonusM("update")){
	    	alert('重新生成奖金数据时发生错误！')
	    }
	}
	
	function deleteCheckAndDo(){
		Ext.MessageBox.confirm('提示', '是否确定删除当前时间所有奖金数据？', doDelete);
	}
//加载数据--------------------------------------------------------------------------------------------------
	//loadMonthCombox()
	//openCell()
	findXcBonusM("query")
});
//自定方法--------------------------------------------------------------------------------------------------
/*	function createFromCopyXcBonus(selQh,selSj,createSj){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.createFromCopyXcBonus(selQh,selSj,createSj,function(obj){
		});
	    DWREngine.setAsync(true);
	    openCell()
	    return rtn
	}
*/
	
	function openCell(){
		/*
		p_type	报表类型	必选	无	属性表中定义了报表类型
		p_date	数据期别	必选 	无	必须符合系统的数据期别规则
		p_corp	数据及报表所属单位（部门）
		在报表中定义{CORP}时，替换成该参数对应的单位名称。 	必选 	无	可以为 单位ID/部门ID模式，此种模式下表示应用于同单位下多个部门情况，根据部门ID查找报表模板，根据单位ID进行数据的存储。如果为单位ID模式，则报表模板和报表数据均用同一个单位ID。
		p_inx	指标（产品ID）。在报表中定义{INX}时，替换成该参数对应的指标（产品）名称。	可选 	无	指标管理中的指标ID
		saveAsFile	是否将cell保存为文件	可选	False	布尔类型
		savable	是否具备保存权限	可选	False	布尔类型
		p_key_col	保存数据主表主键	有主从关系结构且需要保存时，必选	无	数据表列
		p_key_val	保存数据主表主键值	有主从关系结构且需要保存时，必选	无	主表主键值
		拓展的参数
		p_remarkTable	数据说明信息对应的数据表	需要填写数据说明时，必选	无	数据表
		p_remarkCol	数据说明信息对应的数据列	需要填写数据说明时，必选	无	数据列
		p_where	拓展的数据过滤条件。针对仅用于数据查询的报表，除了报表的基础过滤条件外增加了该参数。	可选	无	table1`whereStr1|table2`whereStr2
		p_showVersion	是否显示历史版本按钮	可选	“none”	字符串，none或block
		p_showRemark	是否显示数据说明按钮	可选	“none”	字符串，none或block
		*/
		cellType = '24'
		cellDate = nowSj
		corp = USERID+'/'+defaultOrgRootID
		GUIDELINEIDS = 'zb_seqno'
		cellSaveable = false
		reportIdTemp = xcBonus!=null?xcBonus.lsh:''
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl = CONTEXT_PATH + "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=masterLsh&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
		cellUrl += "&p_where=V_HR_XC_BONUS_D`bill_status=1"

		document.all.cellFrame.src = cellUrl;
	}

	function findXcBonusM(type){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.makeXcBonus(nowSj,deptId,type,function(obj){
			var status = '1'
			if(obj!=null && obj.lsh!=null){
				xcBonus = obj
				//Ext.getCmp('text_memo').setValue(obj.memo==null?'':obj.memo)
				document.getElementById("toolbarStatus").value =(obj.latestDate==null?'奖金未发放':'奖金发放时间：' + obj.latestDate.toLocaleString()) + (obj.memo==null?'':'    发放说明：' + obj.memo)
				status = obj.status==null?'1':obj.status
				nowSj = obj.sjType==null?'':obj.sjType
			    openCell()
				rtn = true
			}else{
				rtn = false
			}
			checkButton(status)
		});
	    DWREngine.setAsync(true);
	    return rtn
	}
	function checkButton(status){
		if(allButtonPermission=='true' || status==null||status=='0'){
			btn_grant.enable()
			btn_update.enable()
			btn_delete.enable()
		}else{
			btn_grant.disable()
			btn_update.disable()
			btn_delete.disable()
		}
	}
	
	function doDelete(btn){
		if(btn=="yes"){
			DWREngine.setAsync(false);
			rlzyMgm.deleteXcBonus(nowSj,deptId,function(obj){
				if(obj||obj=='true'){
				    //openCell()
					location.reload() 
				}
			});
		    DWREngine.setAsync(true);
		}
	}
	
	function modify(){
		var oldMemo = xcBonus.memo
		var newMemo =Ext.getCmp('text_memo').getValue()
		if(newMemo!=oldMemo){
			xcBonus.memo = newMemo
	    	DWREngine.setAsync(false);
			rlzyMgm.updateXcBonusM(xcBonus,function(obj){
				if(obj){
					alert('更新成功！')
				}else{
					xcBonus.memo = oldMemo
					Ext.getCmp('text_memo').setValue(oldMemo)
					alert('更新失败！')
				}
			});
		    DWREngine.setAsync(true);
	    }
	}
	function grant(){
		xcBonus.latestDate = new Date()
		xcBonus.userId = USERID
		xcBonus.billStatus = '1'
		xcBonus.status = '1'
    	DWREngine.setAsync(false);
		rlzyMgm.updateXcBonusM(xcBonus,function(obj){
			if(obj){
				document.getElementById("toolbarStatus").value = xcBonus.latestDate==null?'奖金未发放':'奖金发放时间：' + xcBonus.latestDate.toLocaleString()
				alert('发放成功！')
			}else{
				alert('发放失败！')
			}
		});
	    DWREngine.setAsync(true);
	}
	