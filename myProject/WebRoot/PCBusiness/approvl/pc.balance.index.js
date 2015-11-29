var _reg=/,/g    //正则表达式
var sqlPid=USERPIDS.replace(_reg,"','");
	sqlPid="('"+sqlPid+"')";
var primaryKey = "pid";

var forwardURL = "PCBusiness/balance/pc.balance.frame.edit.default.jsp";
var pageLvl = "";
DWREngine.setAsync(false);
	approvlMgm.getPageLvl(USERID, forwardURL, function(power){  //获取结算结构维护页面权限
		pageLvl = power;
	})
DWREngine.setAsync(true);

Ext.onReady(function(){

	var projDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.balance.hbm.VPcBalanceInfo",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"pid in"+sqlPid
		},
		proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'uids'
		}, [
			{name: 'buildStart',type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'buildEnd',type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'pid', type: 'string'},
			{name: 'prjName', type: 'string'},
			{name: 'coMoney', type: 'float'},
			{name: 'constructionCost', type: 'float'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
	var _columns = [
		{
			header:'开工日期', dataIndex:'buildStart',align:'center', renderer: formatDate
		},
		{
			header:'竣工日期', dataIndex:'buildEnd', align : 'center', renderer: formatDate
		},
		{
			header:'工程总价', dataIndex:'constructionCost', align : 'right', renderer: unitConversionFun
		},
		{
			header:'已完成金额', dataIndex:'coMoney', align : 'right', renderer: unitConversionFun
		},
		{
			header:'完成百分比', dataIndex:'uids', align : 'center', renderer: percentFun
		}
	];
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:function(value,meta,record,store){
			var pid = record.get("pid");
			var prjName = record.get("prjName");
			var uid = record.get("uids");
			var param = 'pageLvl='+pageLvl;
			return "<a href='javascript:loadFirstModule(\""+pid+"\",\""+prjName+"\",\""+param+"\")'>"+prjName+"</a>"
		},
		ds:projDS,
		columns:_columns,
		viewConfig:{forceFit:true},
		searchHandler:function(store,unitid,projName){
			systemMgm.getPidsByUnitid(unitid,function(list){
				var unit_pids = ""
				for(var i=0;i<list.length;i++){
					unit_pids+=",'"+list[i].unitid+"'";
				}
				if(unit_pids.length=="") 
					unit_pids="('')";
				else
					unit_pids="("+unit_pids.substring(1)+")";
					
				if(projName==null || projName ==""){
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid;
					}else{
						store.baseParams.params="pid in"+unit_pids;
					}
				}else{
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid+" and prj_name like '%"+projName+"%'";
					}else{
						store.baseParams.params="pid in"+unit_pids+" and prj_name like '%"+projName+"%'";
					}
				}
				store.load();
			});
		}
	});
	projDS.load();
	
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	});
	p.getColumnModel().setHidden(2,true);
	p.getColumnModel().setHidden(3,true);
	p.getColumnModel().setHidden(4,true);
	p.getColumnModel().setHidden(5,true);
	p.getColumnModel().setHidden(6, true);
	p.getColumnModel().setHidden(7,true);
})


  function openReport(pid, pname, type)
  {
	switchoverProj(pid,pname);
	var aw = 1024,ah = 768;
	var url = BASE_PATH+"PCBusiness/jdgk/pc.jdgk.index.gcjd.jsp";
		window.showModalDialog(url,null,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");	
  }

  function formatDate(value) {
		return value ? value.dateFormat('Y-m-d'):null;
  } 
  
  //通过工程总价格和已完成金额获得已完成百分比
  function percentFun(value, meta, record){
  	  var totalMoney = record.get('constructionCost')==null?0:record.get('constructionCost');
  	  var coMoney = record.get('coMoney')==null?0:record.get('coMoney');
  	  if(totalMoney==0||coMoney==0||totalMoney<coMoney)
  	  {
  	  	return 0;
  	  }
  	  else
  	  {
//  	  	return parseInt(coMoney)/parseInt(totalMoney);
  	  		return (coMoney/totalMoney)*100+'%';
  	  }
  }
  
  //元转换为万元
  function unitConversionFun(value){
		return value?value/10000:0;  	
  }