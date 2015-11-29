<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>投资计划管理-主记录-季度</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	</head>
	
	<script type="text/javascript">
		var bean = 'com.sgepit.pmis.planMgm.hbm.PlanMaster'
		var business = 'baseMgm'
		var listMethod = 'findWhereOrderby'
		var primaryKey = 'uids'
		var orderColumns = 'sjType desc'
		var PAGE_SIZE = 6
		var yearArray = new Array()
		var quarterArray = new Array()
		var mainGrid, reportBtn;
		var editable = true;
		var title = "投资计划主表";
		if(parent && parent.businessType && parent.businessType.indexOf("F_P")>-1){
			title = "资金计划主表";
		}
		
		Ext.onReady(function(){
			//建安工程投资计划年度主表 相关
			//初始化年度的combo，上下五年，数组一个10个元素
			var beginYear = new Date().getFullYear() - 5
			for(var i = beginYear;i<beginYear+10;i++){
				var temp = new Array()
				temp.push(i)
				temp.push(i+'年')
				yearArray.push(temp)
			}
			
			var dsYear = new Ext.data.SimpleStore({
				fields:['k','v'],
				data:yearArray
			})
			
			quarterArray = [['1','1季度'],['2','2季度'],['3','3季度'],['4','4季度']];	
			var dsQuarter = new Ext.data.SimpleStore({
				fields:['k','v'],
				data:quarterArray
			})
			
			reportBtn = new Ext.Button({
				id: 'report',
				text: '上报计划部',
				tooltip: '计划上报计划部',
				iconCls: 'btn',
				handler: function() {
					parent.reportFun(mainGrid, "1");
				}
			});
			
			var mainFc = {
				'uids':{
					name:'uids',
					fieldLabel:'主键',
					hidden:true,
					hideLabel:true
				}, 'pid':{
					name:'pid',
					fieldLabel:'项目编号',
					hidden:true,
					hideLabel:true
				},'sjType':{
					name:'sjType',
					fieldLabel:'时间',
					hidden:true,
					hideLabel:true
				},'year':{
					name:'year',
					fieldLabel:'年份'	,
					store:dsYear,
					displayField:'v',
					valueField:'k',
					typeAhead:true,
					mode:'local',
					triggerAction:'all',
					emptyText:'请选择...',
					selectOnFocus:true,		
					width:125,			
					readOnly:true,
					anchor:'95%'
				},'quarter':{
					name:'quarter',
					fieldLabel:'季度'	,
					store:dsQuarter,
					displayField:'v',
					valueField:'k',
					typeAhead:true,
					mode:'local',
					triggerAction:'all',
					emptyText:'请选择...',
					selectOnFocus:true,		
					width:125,			
					readOnly:true,
					anchor:'95%'
				},'operator':{
					name:'operator',
					fieldLabel:'填报人',
					readOnly:true,
					anchor:'95%'
				},'operateTime':{
					name:'operateTime',
					fieldLabel:'填报日期',
					readOnly:true,
					format:'Y-m-d H:i:s',
					anchor:'95%'
				},'state':{
					name:'state',
					fieldLabel:'上报状态',			
					anchor:'95%'
				},'billState':{
					name:'billState',
					fieldLabel:'流程状态',			
					anchor:'95%'
				},'remark':{
					name:'remark',
					fieldLabel:'备注',			
					anchor:'95%'
				},'businessType':{
					name:'businessType',
					fieldLabel:'业务类型'	,
					readOnly:true		
				},'unitId':{
					name:'unitId',
					fieldLabel:'单位编号'	,
					readOnly:true		
				}
			}
			
			var MainColumns = [
				{name:'uids',type:'string'},
				{name:'pid',type:'string'},
				{name:'sjType',type:'string'},
				{name:'year',type:'string'},
				{name:'quarter',type:'string'},
				{name:'operator',type:'string'},
				{name:'operateTime',type:'date',dateFormat:'Y-m-d H:i:s'},
				{name:'remark',type:'string'},
				{name:'unitId',type:'string'},
				{name:'state',type:'string'},
				{name:'billState',type:'string'},
				{name:'businessType',type:'string'}
			]
			
			var MainPlant = Ext.data.Record.create(MainColumns)
			var MainPlantInt = {
				uids:'',
				pid: CURRENTAPPID,
				sjType:'',
				year: '',
				quarter: '',
				operator: USERID,
				remark: '',
				operateTime: new Date(),
				unitId: USERDEPTID,
				businessType: parent.businessType
			};
			
			var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
			
			var cm = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(),sm,{
					id:'uids',
					header:mainFc['uids'].fieldLabel,
					dataIndex:mainFc['uids'].name,
					hidden:true
				},{
					id:'pid',
					header:mainFc['pid'].fieldLabel,
					dataIndex:mainFc['pid'].name,
					hidden:true
				},{
					id:'sjType',
					header:mainFc['sjType'].fieldLabel,
					dataIndex:mainFc['sjType'].name,
					hidden:true
				},{
					id:'year',
					type:'combo',
					header:mainFc['year'].fieldLabel,
					dataIndex:mainFc['year'].name,
					editor:new Ext.form.ComboBox(mainFc['year']),
					renderer: getYearFun,
					width:100
				},{
					id:'quarter',
					type:'combo',
					header:mainFc['quarter'].fieldLabel,
					dataIndex:mainFc['quarter'].name,
					editor:new Ext.form.ComboBox(mainFc['quarter']),
					renderer: getQuarterFun,
					width:100
				},{
					id:'operator',
					header:mainFc['operator'].fieldLabel,
					dataIndex:mainFc['operator'].name,
					renderer: parent.showUserNameFun,
					width:100
				},{
					id:'operateTime',
					header:mainFc['operateTime'].fieldLabel,
					dataIndex:mainFc['operateTime'].name,
					renderer: parent.formatDate,
					width:150
				},{
					id:'state',
					header:mainFc['state'].fieldLabel,
					dataIndex:mainFc['state'].name,
					renderer: parent.formatReportStateFun,
					width:100
				},{
					id:'billState',
					header:mainFc['billState'].fieldLabel,
					dataIndex:mainFc['billState'].name,
					width:150
				},{
					id:'remark',
					header:mainFc['remark'].fieldLabel,
					dataIndex:mainFc['remark'].name,
					editor:new Ext.form.TextArea(mainFc['remark']),		
					width:320
				},{
					id:'businessType',
					header:mainFc['businessType'].fieldLabel,
					dataIndex:mainFc['businessType'].name,
					hidden:true
				},{
					id:'unitId',
					header:mainFc['unitId'].fieldLabel,
					dataIndex:mainFc['unitId'].name,
					hidden:true
				}
			])
			cm.defaultSortable = true
			
			var mainDs = new Ext.data.Store({
				baseParams:{
					ac:'list',
					bean:bean,
					business:business,
					method:listMethod,
					params: "business_Type='" + parent.businessType + "' and length(sj_type)=5 and unit_id ='" + USERDEPTID + "'"
				},
				proxy:new Ext.data.HttpProxy({
					method:'GET',
					url:MAIN_SERVLET
				}),
				reader:new Ext.data.JsonReader({
					root:'topics',
					totalProperty:'totalCount',
					id:primaryKey
				},MainColumns),
				remoteSort:true,
				pruneModifiedRecords:true
			})
			mainDs.setDefaultSort(orderColumns,'asc')
			
			mainGrid = new Ext.grid.EditorGridTbarPanel({
				id:'plan-money-main',
				ds:mainDs,
				cm:cm,
				sm:sm,
				width:400,
		//		height:230,
				border:false,
				region:'center',
				clicksToEditor:2,
				border:false,
				frame:false,
				autoScroll:true,
				collapsible:false,
				animaCollapse:false,
				loadMask:true,
				stripeRows:true,
				saveHandler: checkSaveHandler,
				deleteHandler: checkDeleteHandler,
				tbar: ['<font color=#15428b><b>&nbsp;'+title+'</b></font>','-'],
				viewConfig:{
					ignoreAadd:true
				},
				bbar:new Ext.PagingToolbar({
					pageSize:PAGE_SIZE,
					store:mainDs,
					displayInfo:true,
					displayMsg:'{0}-{1}/{2}',
					emptyMsg:'无记录。'
				}),
				plant:MainPlant,
				plantInt:MainPlantInt,
				servletUrl:MAIN_SERVLET,
				bean:bean,
				business:business,
				primaryKey:primaryKey
			})
		
			mainDs.load({
				params:{start:0,limit:PAGE_SIZE},
				callback:function(){
					sm.selectFirstRow()
				}
			})
			
			mainDs.on('load', function(){
				if(mainDs.getCount()==0){
					parent.frames[ "detailFrame"].location.reload(true);
				} else {
					sm.selectFirstRow();
				}
			});
			
			
			mainGrid.on('beforeedit', function(e){
				e.cancel = !editable;
			});
			
			function checkSaveHandler(){
				parent.saveFun(this);
			}
			
			mainDs.on('load', function(){
				sm.selectFirstRow();
			});
			
			function checkDeleteHandler(){
				var sm = mainGrid.getSelectionModel()
				if(sm.getCount() == 0){
					Ext.Msg.alert('提示!','您尚未选择一条记录!')
					return
				} else {
					Ext.Msg.confirm('确认','您确认删除所选记录及其相关的明细数据信息？', function(btn, text) {
						if (btn == "yes") {
							var records = sm.getSelections()
							var codes = []
							for (var i = 0; i < records.length; i++) {
								var m = records[i].get(this.primaryKey)
								if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
									continue;
								}
								codes[codes.length] = m
							}
							var mrc = codes.length
							DWREngine.setAsync(false);
							if (mrc > 0) {
								var ids = codes.join(",");
								investmentPlanService.deleteMasterAndDetailData(parent.sjFlag, ids, function (d) {
									if (d) {
										Ext.example.msg('删除成功！', '您成功删除了 {0} 条主记录及关联的明细数据信息。', mrc);
										mainDs.reload();
									} else {
										Ext.example.msg('删除失败！', '删除失败！', mrc);
									}
								});
							} else {
								mainDs.reload();
							}
							DWREngine.setAsync(true);
						}
					});
				}
			}
			
			//主记录选中，刷新明细grid
			sm.on('rowselect',function(sm,rowIndex,record){
				if(record && record.data["uids"] && record.data["uids"]!=null) {
					parent.reloadDetailData(record);
				}
				checkEditableFun(record);
			});
			
			var viewport = new Ext.Viewport({
				layout:'border',
				items:[mainGrid]
			});
			
			//if(editable){
			    var gridTopBar = mainGrid.getTopToolbar()
				with(gridTopBar){
					add('->', reportBtn);
				}
		    //}
			
			function getYearFun(value, m, rec){
				if(value && value!="") {
			        return value + '年';
				} else {
			        return rec.data["sjType"] ? (rec.data["sjType"].substring(0,4)+'年') : '';
				}
		    };
		    
			function getQuarterFun(value, m, rec){
				if(value && value!="") {
			        return value + '季度';
				} else {
			        return rec.data["sjType"] ? (rec.data["sjType"].substring(4,5)+'季度') : '';
				}
		    };
		});
		
		  //根据报送状态和流程审批状态，确定编辑行的数据是否可编辑；
	    function checkEditableFun(record) {
	    	var tempState = record.data["state"];
	    	if (tempState && tempState=="1") {
	    		reportBtn.disable();
		    	editable = false;
	    	} else {
	    		reportBtn.enable();
		    	editable = true;
	    	}
	    }
	</script>
</html>
