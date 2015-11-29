<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>月结算</title>
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/examples.css" />
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-green.css" />
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-lang-zh_CN.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>extExtend/examples.js"></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/storageMgmImpl.js'></script>
	</head>

	<body>
	</body>
</html>

<script type="text/javascript">
var v_sj="",v_ckh=""
var temp_js  = new Array();

//--计算时间
var tempa = new Array();
var tempb = new Array();
   
DWREngine.setAsync(false);
var sql="select substr(max(tabname),9) tabnamea,to_char(add_months(to_date(substr(max(tabname),9),'YYYYMM'),1),'YYYYMM') tabnameb,to_char(max(sttime),'YYYY-MM-DD') sttimea,to_char(max(edtime),'YYYY-MM-DD') edtimea,to_char(max(edtime)+1,'YYYY-MM-DD') sttimeb,to_char(add_months(max(edtime),1),'YYYY-MM-DD') edtimeb,substr(min(tabname),9) mintab from WZ_STOCK_TAB";
baseMgm.getData(sql,function(list){
	tempa.push(list[0][0]);
	tempa.push(list[0][2]);
	tempa.push(list[0][3]);
	tempb.push(list[0][1]);
	tempb.push(list[0][4]);
	tempb.push(list[0][5]);
	tempb.push(list[0][6]);
	temp_js.push(list[0][0]);
	temp_js.push(list[0][1]);
})
DWREngine.setAsync(true);


Ext.onReady(function(){
	//--月末结转按时间，取表名最后6位时间
	var sjArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select tabname sj,substr(tabname,9)text from WZ_STOCK_TAB order by tabname desc ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			sjArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getsjSt = new Ext.data.SimpleStore({
 		fields:['sj','text'],
 		data:sjArray
 	}) 	
	//--仓库：ckh,ckmc
	var ckArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select ckh,ckmc from wz_ckh",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			ckArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getckSt = new Ext.data.SimpleStore({
 		fields:['ckh','ckmc'],
 		data:ckArray
 	}) 	


	var tbar = new Ext.Toolbar({height:25})
	var container = new Ext.Panel({
		region: 'center',
		renderTo: document.body,
		border: false,
		tbar: tbar,
		html: '<iframe name=content1 src=Business/wzgl/storage/wz.storage.monthStockGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});
	
   jsBtn = new Ext.Toolbar.Button({
		id: 'js',
        icon: "jsp/res/images/portal/page_settings.gif",
		cls: "x-btn-text-icon bmenu",
        text: "结&nbsp;算",
        handler: onItemClick
    })
   queryBtn = new Ext.Toolbar.Button({
		id: 'search',
        icon: "jsp/res/images/icons/zoom.png",
		cls: "x-btn-text-icon bmenu",
        text: "查&nbsp;询",
        handler: onItemClick
    })
    tbar.add(
    	new Ext.form.Label({text:'过滤查询:' }),
	    new Ext.form.ComboBox({
		        	emptyText:'日期', 
		        	width:90,
	                mode:'local',
					store:getsjSt,        
	                displayField:'text',
	                valueField:'sj',
		            triggerAction: 'all',
		            listeners:{select:function(combo,record,index){
	            	   v_sj = record.data.sj;
	           		 }}
		          }),
		 new Ext.form.ComboBox({
		        	emptyText:'仓库号', 
		        	width:90,
	             	store: getckSt,
	                mode: 'local',        
	                displayField:'ckmc',
	                valueField:'ckh',
		            triggerAction: 'all',
		            listeners:{select:function(combo,record,index){
	            	   v_ckh = record.data.ckh;
	           		  }}
		 })
		 ,'-',queryBtn,'-', jsBtn
	          
   )
});



function onItemClick(item){
	var content1 = window.frames["content1"]
	switch(item.id) {
		case 'search' :
			content1.filterGrid(v_sj,v_ckh)
			break
		case 'js' :
			JSWin.show();
			break
	}
}


var sj_Combo = new Ext.form.ComboBox({
	name:'sj',
	width:60,
	fieldLabel:'年月',
	readOnly : true,
	allowBlank: false,
	store:new Ext.data.SimpleStore({
		fields:['k','v'],
		data:[
			[temp_js[0],temp_js[0]],
			[temp_js[1],temp_js[1]]
		]
	}),
	valueField: 'k',
	displayField: 'v',
	mode: 'local',
	anchor:'95%',
	triggerAction:'all',
       listeners:{select:function(combo,record,index){
       if(tempa[0]==record.get('k')){
       	starT.setValue(tempa[1]);
       	endT.setValue(tempa[2]);
       }else if(tempb[0]==record.get('k')){
       	starT.setValue(tempb[1]);
       	endT.setValue(tempb[2]);
       }
       }}
})

var starT = new Ext.form.TextField({
 	name:'startT',
 	width:120,
 	anchor:'95%',
 	allowBlank: false,
 	fieldLabel:'起始日期',
	readOnly : true
 })
var endT = new Ext.form.DateField({
 	name:'endT',
 	width:120,
 	anchor:'95%',
 	format: 'Y-m-d',
	minValue: '2000-01-01',
	allowBlank: false,
 	fieldLabel:'截止日期'
})
 
var jsgridPanel =  new Ext.FormPanel({
    id: 'form-panel',
    header: false,
    border: false,
    autoScroll:true,
    region: 'center',
    bodyStyle: 'padding:10px 10px;',
	labelAlign: 'left',
	items: [
		new Ext.form.FieldSet({
			title: '月结算',
			autoWidth:true,
            border: true,
            width:100,
            layout: 'form',
            items:[sj_Combo,starT ,endT]
		})
	]
});
JSWin = new Ext.Window({
	title:'结算',
	buttonAlign:'center',
	layout:'border',
	width: 300,
    height: 240,
    modal: true,
    closeAction: 'hide',
    constrain:true,
    maximizable: true,
    plain: true,
	items:[jsgridPanel],
	buttons:[{id:'btnSavfe',text:'确定结算' ,handler:confirmJS},{text:'取消',handler:function(){JSWin.hide()}}]
  });
  
function confirmJS(){
	var form = jsgridPanel.getForm();
	if(form.isValid()){
		doFormSave()
	}else{
		Ext.MessageBox.alert("提示","请填写完整!")
	}
 }
function doFormSave(){
  //tempb[3]
  storageMgmImpl.createMonthStock(sj_Combo.getValue(),starT.getValue(),endT.getValue(),function(dat){
  	if(dat=="1"){
  		Ext.MessageBox.alert("提示","结算成功!")
  		window.frames["content1"].initialise();
  		JSWin.hide();
  	}else if(dat=="2"){
  		Ext.MessageBox.alert("提示","已经结算")
  	}else{
  		Ext.MessageBox.alert("提示","结算失败！")
  	}
  });
 }
</script>


