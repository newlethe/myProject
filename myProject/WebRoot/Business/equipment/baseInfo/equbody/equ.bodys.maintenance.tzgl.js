var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsBodys";
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = 'uids';
var grid;
var ds;
var btnId;

var addOrUpdate;
var	formPanel = null;

var  equBodysWin;
var bdgArr = new Array();

var rkTypeArr = new Array();
var ckTypeArr = new Array();
var treeuuidstr = "",stConId = "",rklx ="",cklx ="";
//默认显示当月的数据
//入库sql
var whereSql = " where data_type = 'EQUBODY' and To_char(warehouse_date, 'yyyy-mm')  = To_char(sysdate, 'yyyy-mm') ";
//出库sql
var whereCkSql = "where  data_type ='EQUBODY' and To_char(out_date, 'yyyy-mm')  = To_char(sysdate, 'yyyy-mm')  ";
//库存sql
var whereKcSql = "where data_type = 'EQUBODY' ";
var selectTab = "";
var fineReportUrl ="/fineReport7/ReportServer?reportlet=/jjmis"
var rkCpt = "/business/equbody/equ_goods_storein.cpt";
var ckCpt = "/business/equbody/equ_goods_stock_out.cpt";
var kcCpt = "/business/equbody/equ_goods_stock.cpt";

Ext.onReady(function(){
	
	   ds = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : bean,
				business : business,
				method : listMethod,
				params : ''
			},
			proxy : new Ext.data.HttpProxy({
				method : 'GET',
				url : MAIN_SERVLET
			}),
			reader : new Ext.data.JsonReader({
				root : 'topics',
				totalProperty : 'totalCount',
				id : "uids"
			}, columns),
			remoteSort : true,
			pruneModifiedRecords : true, // 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
			sortInfo: {field: "uids", direction: "DESC"}
		});
	   columns : [{
           header : '概算名称',
           width : 380, // 隐藏字段
           dataIndex : 'bdgname'
       }];
	   var columns = [{name : 'uids', type : 'string'}];
	
	rkTypeArr = [['', '全部'],['正式入库', '正式入库'], ['暂估入库', '暂估入库'], ['冲回入库', '冲回入库']];
	ckTypeArr = [['', '全部'],['正式出库', '正式出库'], ['暂估出库', '暂估出库'], ['冲回出库', '冲回出库']];
	
	DWREngine.setAsync(false);
	var jzNoArr = new Array();
	jzNoArr.push(['','全部']);
	appMgm.getCodeValue("机组号", function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			jzNoArr.push(temp);
		}
	});
	DWREngine.setAsync(true);

	var equTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : rkTypeArr
	});
	var equCkTypeDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : ckTypeArr
	});
	var jzNoDs =  new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : jzNoArr
	});
	
	var fm = Ext.form;
	
    //入库台账工具栏
    var rkLabel1 = new Ext.form.Label({
    	text : "入库时间："
    });
    var rkTime = new Ext.form.DateField({  
    	id : 'rkTime',  
        width: 90,      
        format: 'Y年m月',      
        readOnly : true,
        value:new Date()  
    });
    
    var rkLabel2 = new Ext.form.Label({
    	text : "入库类型："
    });
    
    var rkType = new Ext.form.ComboBox({
    	id : 'rkType',  
    	width: 80,     
    	readOnly : true,
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		//typeAhead : true,
		triggerAction : 'all',
		emptyText:"请选择...",
		value:'',
		store : equTypeDs
    });
    var rkLabel3 = new Ext.form.Label({
    	text : "开始时间："
    });
    var startTime = new Ext.form.DateField({  
    	id : 'startTime',  
        width: 90,      
        format: 'Y-m-d',      
        readOnly : true,
        emptyText:"请选择..."
        //value:new Date()  
    });
    var rkLabel4 = new Ext.form.Label({
    	text : "结束时间："
    });
    var endTime = new Ext.form.DateField({  
    	id : 'endTime',  
    	width: 90,    
        format: 'Y-m-d',      
        readOnly : true,
        emptyText:"请选择..."
        //value:new Date()  
    });
    var rkLabel5 = new Ext.form.Label({
    	text : "入库单号："
    });
    var rkNo = new Ext.form.TextField({
    	id:"rkNo",
    	width: 90,    
    	emptyText:"请输入..."
    });
    
    var queryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		iconCls : 'btn',
		handler : queryFun
	})
    
    //出库台账工具栏
    var ckLabel1 = new Ext.form.Label({
    	text : "出库时间："
    });
    var ckTime = new Ext.form.DateField({  
    	id : 'ckTime',  
        width: 90,      
        format: 'Y年m月',      
        readOnly : true,
        value:new Date()  
    });
    
    var ckLabel2 = new Ext.form.Label({
    	text : "出库类型："
    });
    
    var ckType = new Ext.form.ComboBox({
    	id : 'ckType',  
    	width: 80,     
    	readOnly : true,
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		//typeAhead : true,
		triggerAction : 'all',
		emptyText:"请选择...",
		value:'',
		store : equCkTypeDs
    });
    var ckLabel3 = new Ext.form.Label({
    	text : "开始时间："
    });
    var ckStartTime = new Ext.form.DateField({  
    	id : 'ckStartTime',  
        width: 90,      
        format: 'Y-m-d',      
        readOnly : true,
        emptyText:"请选择..."
        //value:new Date()  
    });
    var ckLabel4 = new Ext.form.Label({
    	text : "结束时间："
    });
    var ckEndTime = new Ext.form.DateField({  
    	id : 'ckEndTime',  
    	width: 90,    
        format: 'Y-m-d',      
        readOnly : true,
        emptyText:"请选择..."
        //value:new Date()  
    });
    var ckLabel5 = new Ext.form.Label({
    	text : "出库单号："
    });
    var ckNo = new Ext.form.TextField({
    	id:"ckNo",
    	width: 90,    
    	emptyText:"请输入..."
    });
    
    var ckQueryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		iconCls : 'btn',
		handler : ckQueryFun
	})
   //库存台账工具栏
    var kcLabel1 = new Ext.form.Label({
    	text : "合同名称："
    });
    var conName = new Ext.form.TextField({
    	id:"conName",
    	width: 90,    
    	emptyText:"请输入..."
    });
    var kcLabel2 = new Ext.form.Label({
    	text : "机组号："
    });
    var jzNo = new Ext.form.ComboBox({
    	id : 'jzNo',  
    	width: 80,     
    	readOnly : true,
		allowBlank : true,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		//typeAhead : true,
		triggerAction : 'all',
		emptyText:"请选择...",
		value:'',
		store : jzNoDs
    });
    var kcLabel3 = new Ext.form.Label({
    	text : "物资名称："
    });
    var wzName = new Ext.form.TextField({
    	id:"wzName",
    	width: 90,    
    	emptyText:"请输入..."
    });
    var kcLabel4 = new Ext.form.Label({
    	text : "规格型号："
    });
    var ggxh = new Ext.form.TextField({
    	id:"ggxh",
    	width: 90,    
    	emptyText:"请输入..."
    });
    var kcQueryBtn = new Ext.Button({
		id : 'query',
		text : '查询',
		iconCls : 'btn',
		handler : kcQueryBtn
	})
    
   var panel1 =  new Ext.Panel({
        title: "入库台账",
        headerHeight:0,
        contentEl : 'equBodysWin2',
        tbar: [rkLabel1,rkTime,'-',rkLabel2,rkType,'-',rkLabel3,startTime,'-',rkLabel4,endTime,'-',rkLabel5,rkNo,'-',queryBtn]
   });
	
   var panel2 =  new Ext.Panel({
        title: "出库台账",
        headerHeight:0,
        contentEl : 'equBodysWin3',
        tbar: [ckLabel1,ckTime,'-',ckLabel2,ckType,'-',ckLabel3,ckStartTime,'-',ckLabel4,ckEndTime,'-',ckLabel5,ckNo,'-',ckQueryBtn]
   });
  
   var panel3 =  new Ext.Panel({
        title: "库存台账",
        headerHeight:0,
        //renderTo: Ext.getBody(),
        contentEl : 'equBodysWin4',
        tbar: [kcLabel1,conName,'-',kcLabel2,jzNo,'-',kcLabel3,wzName,'-',kcLabel4,ggxh,'-',kcQueryBtn]
   });
	
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
		border : false,
		region : 'center',
		items: [panel1,panel2,panel3],
		listeners:{
			'tabchange':function(tb,p){
				selectTab = p.title;
				 if(selectTab =='入库台账'){
					 renovateTabcontext(selectTab,whereSql);
				 }
				 if(selectTab =='出库台账'){
					 renovateTabcontext(selectTab,whereCkSql);
				 }
				 if(selectTab =='库存台账'){
					 renovateTabcontext(selectTab,whereKcSql);
				 }
				
			}
		}
	});

	
	Ext.apply(treePanel,{
		width:280
	})
	
	var viewport = new Ext.Viewport({
	    layout:'border',
        items:[treePanel,tabPanel]
	})
	
	treePanel.on('click', onClicks);
	//事件部分***********************************
	function onClicks(node, e){
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
		selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
		selectConid = isRoot ? "0" : elNode.all("conid").innerText;
		selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
		if(selectParentid == "0" && (selectConid == null || selectConid == '')){
			if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
		         
	            }else{
		           var conid='';
				   for(var i=0;i<treeNode.length;i++){
						 if(node.id==treeNode[i][0]&& node.text==treeNode[i][2]){
	            	        DWREngine.setAsync(false);
	            	        baseMgm.getData("select  distinct conid  from (select * from equ_con_ove_tree_view start with  treeid='"+node.id+"' connect by prior treeid=parentid)where conid is not null",function(str){
                                if(str.length>1){
                                    for(var k=0;k<str.length;k++){
                                      if(k==0){
                                         conid +="'"+str[k]+"'";
                                      }else{
                                         conid +=",'"+str[k]+"'";
                                      }
                                    }
                                }
	            	        })
	            	        DWREngine.setAsync(true);
	            	     }				   
				   }
	            	if(conid == ''){
	            		 conid =  selectConid;
	            		 stConId = conid;
	            		 whereSql = " where data_type = 'EQUBODY'  and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' ) ";
	            		 //对入库类型进行判断
	            		 if(rklx){
	            			 //whereSql += "  and type = '"+ rklx +"'";
	            		 }
	            		 whereCkSql = " where  data_type ='EQUBODY' and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' ) ";
	            		 if(cklx){
	            			// whereCkSql += " and type = '"+ cklx +"'";
	            		 }
	            		 whereKcSql = " where data_type = 'EQUBODY' and    conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' ) ";
	            		 //402881e43db4fee8013db50a32bb0005
	            		 //刷新右侧打开的tab页内容
	            		 if(selectTab =='入库台账'){
	    					 renovateTabcontext(selectTab,whereSql);
	    				 }
	    				 if(selectTab =='出库台账'){
	    					 renovateTabcontext(selectTab,whereCkSql);
	    				 }
	    				 if(selectTab =='库存台账'){
	    					 renovateTabcontext(selectTab,whereKcSql);
	    				 }
	            		
	            	}
	            }
		}else{
			if(selectParentid == "0"){
			
	            	 stConId = conid;
	            	 whereSql = "where data_type = 'EQUBODY' conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' )  ";
	            	 if(rklx){
            			// whereSql += "  and type = '"+ rklx +"'";
            		 }
	            	 whereCkSql = "  where  data_type ='EQUBODY' and   conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' ) ";
	            	 if(cklx){
            			// whereCkSql += " and type = '"+ cklx +"'";
            		 }
	            	 whereKcSql = " where data_type = 'EQUBODY' and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' ) ";
	            	 if(selectTab =='入库台账'){
						 renovateTabcontext(selectTab,whereSql);
					 }
					 if(selectTab =='出库台账'){
						 renovateTabcontext(selectTab,whereCkSql);
					 }
					 if(selectTab =='库存台账'){
						 renovateTabcontext(selectTab,whereKcSql);
					 }
			}else{
				//以04开头的为技术资料
				if(selectTreeid.indexOf("04")== 0){
	                if(typeof isFlwView != "undefined" && isFlwView == true) return;
					var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
							"?uuid="+selectUuid+"&conid="+selectConid+"&edit=false";
					fileWin = new Ext.Window({
						width: 950,
						height: 500,
						modal: true, 
						plain: true, 
						border: false, 
						resizable: false,
						layout : 'fit',
						html:"<iframe id='fileWinFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
						listeners : {
							'show' : function(){
								fileWinFrame.location.href  = url;
							}
						}
				    });
					fileWin.show();
				}else{
					treeuuidstr = "";
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
							" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
							" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
							" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
					DWREngine.setAsync(false);
					baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
							treeuuidstr += ",'"+list[i]+"'";		
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
						stConId = selectConid;
						whereSql = "where data_type = 'EQUBODY'  and conid ='" + stConId + "' and treeuids in (" +treeuuidstr+ ") ";
						 if(rklx){
	            			// whereSql += "  and type = '"+ rklx +"'";
	            		 }
						whereCkSql = " where  data_type ='EQUBODY' and conid ='"+ stConId + "'   and treeuids in (" +treeuuidstr+ ")";
						 if(cklx){
	            			// whereCkSql += " and type = '"+ cklx +"'";
	            		 }
						whereKcSql = "where data_type = 'EQUBODY' and  conid ='"+ stConId + "' and  treeuids in (" +treeuuidstr+ ")";
						 if(selectTab =='入库台账'){
							 renovateTabcontext(selectTab,whereSql);
						 }
						 if(selectTab =='出库台账'){
							 renovateTabcontext(selectTab,whereCkSql);
						 }
						 if(selectTab =='库存台账'){
							 renovateTabcontext(selectTab,whereKcSql);
						 }
		            }else{
		            	stConId = selectConid;
		            	whereSql = "where data_type = 'EQUBODY'  and conid ='" + stConId + "' and treeuids in (" +treeuuidstr+ ") ";
		            	 if(rklx){
	            			// whereSql += "  and type = '"+ rklx +"'";
	            		 }
		            	whereCkSql = "  where  data_type ='EQUBODY' and conid ='"+ stConId + "'   and treeuids in (" +treeuuidstr+ ")";
		            	 if(cklx){
	            			// whereCkSql += " and type = '"+ cklx +"'";
	            		 }
		            	whereKcSql = "where data_type = 'EQUBODY' and  conid ='"+ stConId + "' and  treeuids in (" +treeuuidstr+ ")";
		            	 if(selectTab =='入库台账'){
							 renovateTabcontext(selectTab,whereSql);
						 }
						 if(selectTab =='出库台账'){
							 renovateTabcontext(selectTab,whereCkSql);
						 }
						 if(selectTab =='库存台账'){
							 renovateTabcontext(selectTab,whereKcSql);
						 }
		            }
				}
			}
		}
		
	}
	
	//入库台账查询方法
    function queryFun(){
    	var rksj = Ext.get('rkTime').getValue().replace("年","-").replace("月","");
    	rklx = Ext.getCmp('rkType').getValue();
    	var startTime = Ext.get('startTime').getValue();
    	var endTime = Ext.get('endTime').getValue();
    	var rkNo = Ext.get('rkNo').getValue();
    	//这里作为查询按钮的一个基本sql在后面选择开始时间和入库单里用到
    	var jbsql = "where data_type = 'EQUBODY' " ;
    	whereSql = jbsql;
    	//先判断是否选择了合同在判断是否选择了节点  因为如果没有合同就要根据节点来找下面的合同
    	if(stConId){
    		jbsql = " and conid ='" + stConId + "'" ;
    		whereSql = jbsql;
    	}else{
    		if(selectTreeid){
    			jbsql += " and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' )"
    			whereSql = jbsql;
    		}
    	}
    	if(treeuuidstr){
    		jbsql += " and treeuids in (" +treeuuidstr+ ") ";
    		whereSql = jbsql;
    	}
    	if(rklx){
    		jbsql += " and type = '"+ rklx +"'";
        	whereSql = jbsql;
    	}
    	
    	
    	//存放选择了开始或者结束时间的sql
    	var timeSql = "";
    	
    	whereSql += " and To_char(warehouse_date, 'yyyy-mm')  = '"+ rksj + "'" ;

    	if(startTime != '请选择...'){
    		whereSql = jbsql;
    		whereSql += " and To_char(warehouse_date, 'yyyy-mm-dd')  >=  '"+startTime+"'";
    		whereSql += " and To_char(warehouse_date, 'yyyy-mm-dd')  <=  To_char(sysdate, 'yyyy-mm-dd') ";
    		if(endTime != '请选择...'){
    			if(endTime < startTime){
    				Ext.Msg.alert("系统提示","结束时间不能小于开始时间!")
    				return false;
    			}else{
    				whereSql = jbsql;
    				whereSql += " and To_char(warehouse_date, 'yyyy-mm-dd')  >=  '"+startTime+"'";
    	    		whereSql += " and To_char(warehouse_date, 'yyyy-mm-dd')  <=  '"+endTime+"'";
    			}
    		}
    		timeSql = whereSql;
    	}
    	//只选择结束时间
    	if(startTime == '请选择...' && endTime != '请选择...'){
    		whereSql = jbsql;
    		whereSql += " and To_char(warehouse_date, 'yyyy-mm-dd')  <=  '"+endTime+"'";
    		timeSql = whereSql;
    	}
    	if(rkNo != '请输入...'){
    		if(timeSql){
    			whereSql = timeSql;
    		}
    		whereSql += " and   warehouse_no like '%"+rkNo+"%'";
    	}
    	renovateTabcontext(selectTab,whereSql);
    }
    
	//出库台账查询方法
    function ckQueryFun(){
    	var cksj = Ext.get('ckTime').getValue().replace("年","-").replace("月","");
    	cklx = Ext.getCmp('ckType').getValue();
    	var startTime = Ext.get('ckStartTime').getValue();
    	var endTime = Ext.get('ckEndTime').getValue();
    	var ckNo = Ext.get('ckNo').getValue();
    	
    	//这里作为查询按钮的一个基本sql在后面选择开始时间和入库单里用到
    	//and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' )"
    	var jbsql = "  where  data_type ='EQUBODY' " ;
    	whereCkSql = jbsql;
    	//存放选择了开始或者结束时间的sql
    	var timeSql = "";
    	//先判断是否选择了合同在判断是否选择了节点  因为如果没有合同就要根据节点来找下面的合同
    	if(stConId){
    		jbsql = " and conid ='" + stConId + "'" ;
    		whereCkSql = jbsql;
    	}else{
    		if(selectTreeid){
    			jbsql += " and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' )"
    			whereCkSql = jbsql;
    		}
    	}
    	if(treeuuidstr){
    		jbsql += " and treeuids in (" +treeuuidstr+ ") ";
    		whereCkSql = jbsql;
    	}
    	if(cklx){
    		jbsql += " and type = '"+ cklx +"' ";
    		whereCkSql = jbsql;
    	}
    	whereCkSql += " and To_char(out_date, 'yyyy-mm')  = '"+ cksj +"' ";
    	
    	if(startTime != '请选择...'){
    		whereCkSql = jbsql;
    		whereCkSql += " and To_char(out_date, 'yyyy-mm-dd')  >=  '"+startTime+"'";
    		whereCkSql += " and To_char(out_date, 'yyyy-mm-dd')  <=  To_char(sysdate, 'yyyy-mm-dd') ";
    		if(endTime != '请选择...'){
    			if(endTime < startTime){
    				Ext.Msg.alert("系统提示","结束时间不能小于开始时间!")
    				return false;
    			}else{
    				whereCkSql = jbsql;
    				whereCkSql += " and To_char(out_date, 'yyyy-mm-dd')  >=  '"+startTime+"'";
    				whereCkSql += " and To_char(out_date, 'yyyy-mm-dd')  <=  '"+endTime+"'";
    			}
    		}
    		timeSql = whereCkSql;
    	}
    	//只选择结束时间
    	if(startTime == '请选择...' && endTime != '请选择...'){
    		whereCkSql = jbsql;
    		whereCkSql += " and To_char(out_date, 'yyyy-mm-dd')  <=  '"+endTime+"'";
    		whereCkSql = whereSql;
    	}
    	if(ckNo != '请输入...'){
    		if(timeSql){
    			whereCkSql = timeSql;
    		}
    		whereCkSql += " and   out_no like '%"+ckNo+"%'";
    	}
    	renovateTabcontext(selectTab,whereCkSql);
    }
    
    //库存台账查询方法
    function kcQueryBtn(){
    	var conName = Ext.get('conName').getValue();
    	var jzNo = Ext.getCmp('jzNo').getValue();
    	var wzName = Ext.get('wzName').getValue();
    	var ggxh = Ext.get('ggxh').getValue();
    	whereKcSql = "where data_type = 'EQUBODY' ";
    	if(stConId){
    		whereKcSql += " and conid ='" + stConId + "'";
    	}else{
    		if(selectTreeid){
    			whereKcSql += " and  conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"' )"
    		}
    	}
    	if(treeuuidstr){
    		whereKcSql += " and treeuids in (" +treeuuidstr+ ") ";
    	}
    	if(conName != '请输入...'){
    		whereKcSql += " and conname like '%"+conName+"%' "
    	}
    	if(jzNo != '请选择...' && jzNo != ''){
    		whereKcSql += " and jz_no ='"+jzNo+"' "
    	}
    	if(wzName != '请输入...'){
    		whereKcSql += " and equ_part_name like '%"+wzName+"%' "
    	}
    	if(ggxh != '请输入...'){
    		whereKcSql += " and ggxh like '%"+ggxh+"%' "
    	}
    	renovateTabcontext(selectTab,whereKcSql);
    }

	
	//刷新右侧打开的tab页内容
	function renovateTabcontext (type,whereSql) {
		
		 if(type =='入库台账'){
			 document.all('equBodysWinck').src = fineReportUrl + rkCpt +"&whereSql=" + encodeURIComponent(whereSql);
		 }
		 if(type =='出库台账'){
			 document.all('equBodysWinrk').src = fineReportUrl + ckCpt +"&whereSql=" + encodeURIComponent(whereSql); 
		 }
		 if(type =='库存台账'){
			 document.all('equBodysWinkc').src = fineReportUrl + kcCpt +"&whereSql=" + encodeURIComponent(whereSql);
		 }
	}
	
	

	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
})