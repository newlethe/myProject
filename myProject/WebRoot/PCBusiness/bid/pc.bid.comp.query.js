var BID_SERVLET= CONTEXT_PATH +"/servlet/PcBidServlet";
var bean="com.sgepit.pcmis.bid.hbm.PcBidCompQuery";
var grid;
var userArray=new Array();
var bidTypeArr=new Array();
var pbWayArr=new Array();
var gridTbUnitWin;
var	smTbUnit;
var gridTbUnit;
var isBid,zbType;
var dsResultTbUnit;
var bidcontent,bidstarttime,tbunit,bidway;
var columnModelTbUnit,pageToolbarTbUnit;
var bidTypeStroeTbar,bidTypeArrTbar=new Array();
var titleText="招投标项目汇总查询";
var btnContent,btnCon,btnBidPrice,btnBdgMoney;
Ext.onReady(function() {
	var countContent=0;
	var convmoney=0;
	var bidP=0;
	var bdgMoney = 0;
	if(pid == null || pid == ''){
	   pid = CURRENTAPPID; 
	}
	
	
	DWREngine.setAsync(false);	
	baseDao.getData("select t.prj_name from pc_zhxx_prj_info t where pid = '"+pid+"'",function(text){
           //titleText = text+"-"+titleText;
    })
    
	PCBidDWR.getContentBidCountByType(pid,"","","","","","",function(count){
		countContent=count;
	});
	
	PCBidDWR.getContentConMoneyByType(pid,"","","","","","",function(money){
		if(money!=0&&money!=0.0&&money){
			convmoney=money
		}
	});
	PCBidDWR.getContentBdgMoneyByType(pid,"","","","","","",function(money){
		if(money!=0&&money!=0.0&&money){
			bdgMoney=money
		}
	});	
	PCBidDWR.getContentBidPriceByType(pid,"","","","","","",function(bidPr){
            	if(bidPr!=0&&bidPr!=0.0&&bidPr){
                    bidP=bidPr;
                }else{
                    bidP=0;
                }
            });    
	btnContent=new Ext.Button({
		id:"contentCountId",
		name:"contentCountName",
		text:"<font color=red>"+countContent+"</font>"+" 条"
	});
	
	btnCon=new Ext.Button({
	id:"contentCountId",
	name:"contentCountName",
	text:"<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元"
	});	
	btnBidPrice=new Ext.Button({
		id:"contentCountPriId",
		name:"contentCountPrName",
		text:"<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元"
	});	
	btnBdgMoney=new Ext.Button({
		id:"contentCountPriId",
		name:"contentCountPrName",
		text:"<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元"
	});	
	appMgm.getCodeValue('招标类型', function(list) {
					var tempInit=new Array();
					tempInit.push("-1");
					tempInit.push("全部");
					bidTypeArrTbar.push(tempInit);
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArrTbar.push(temp);
				}
			});		
	appMgm.getCodeValue('招标类型', function(list) {
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			bidTypeArr.push(temp);
		}
	appMgm.getCodeValue('评标方法',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			pbWayArr.push(temp);			
			}
  	 }); 		
	DWREngine.setAsync(true);
	});
	/**
	 * 2. 创建列模型
	 */
	var fm = Ext.form;
	var fc = { // 创建编辑域配置
		'zbuids' : {
			name : 'zbuids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'bidtype' : {
			name : 'bidtype',
			fieldLabel : '招标类型',
			anchor : '95%'
		},
		'bidcontent' : {
			name : 'bidcontent',
			fieldLabel : '招标内容',
			anchor : '95%'
		},
		'bidstarttime' : {
			name : 'bidstarttime',
			fieldLabel : '开标时间',
			anchor : '95%'
		},
		'tbuids' : {
			name : 'tbuids',
			fieldLabel : '投标信息',
			anchor : '95%'
		},
		'tbunit' : {
			name : 'tbunit',
			fieldLabel : '中标单位',
			anchor : '95%'
		},
		'bidprice' : {
			name : 'bidprice',
			fieldLabel : '中标价格',
			anchor : '95%'
		},
		'conprice' : {
			name : 'conprice',
			fieldLabel : '合同价格',
			anchor : '95%'
		},
		'bdgMoney' : {
			name : 'bdgMoney',
			fieldLabel : '概算金额',
			anchor : '95%'
		},
		'bidfj' : {
			name : 'bidfj',
			fieldLabel : '招标文件',
			anchor : '95%'
		},
		'bidassess' : {
			name : 'bidassess',
			fieldLabel : '评标报告',
			anchor : '95%'
		},
		'bidway' : {
			name : 'bidway',
			fieldLabel : '评标方法',
			anchor : '95%'
		}	
        
        ,'conid' : {name : 'conid',fieldLabel : '合同主键',anchor : '95%'}
        ,'conno' : {name : 'conno',fieldLabel : '合同编号',anchor : '95%'}
        ,'conname' : {name : 'conname',fieldLabel : '合同名称',anchor : '95%'}
        ,'conmoney' : {name : 'conmoney',fieldLabel : '合同总金额',anchor : '95%'}
        ,'conpay' : {name : 'conpay',fieldLabel : '已付款金额',anchor : '95%'}
	}
    


	var cm = new Ext.grid.ColumnModel([ // 创建列模型
			{
				id : 'bidtype',
				hidden:true,
				type : 'string',
				header : fc['bidtype'].fieldLabel,
				//width:60,
				dataIndex : fc['bidtype'].name,
				renderer:function(data){
					for(var i=0;i<bidTypeArr.length;i++){
						if(bidTypeArr[i][0]==data){
					 	var qtip = "qtip=" + bidTypeArr[i][1];
                		return '<span ' + qtip + '>' + bidTypeArr[i][1] + '</span>';								
						}
					}
				}
			}, 
			{
				id : 'bidcontent',
				type : 'string',
				header : fc['bidcontent'].fieldLabel,
				width:330,
				dataIndex : fc['bidcontent'].name,
				renderer:function(data,m,r){
					var qtip = "qtip=" + data;
					var zbUids = r.get("zbuids");
					var winName="招投内容综合信息";
					var winUrl='PCBusiness/bid/pc.bid.comp.query.zbnr.jsp?zbUids='+zbUids;			
                	return "<a href = 'javascript:openDialog(\"" + winUrl+ "\",\"" + winName + "\")'><span "+qtip+"> "+data+" </span></a>";
				}
			}
			, 
			{
				id : 'bidstarttime',
				type : 'date',
				header : fc['bidstarttime'].fieldLabel,
				width:100,
				align:"center",
				dataIndex : fc['bidstarttime'].name,
				renderer:function(data){
					return data ? data.dateFormat('Y-m-d') : '';
				}
			},{
				id : 'tbuids',
				hidden:true,
				type : 'string',
				align:'center',
				width:80,
				header : fc['tbuids'].fieldLabel,
				dataIndex : fc['tbuids'].name,
				renderer:function(value, metadata, record, rowIndex,
							colIndex, store){
						var count=value;	
					    var downloadStr="查看["+count+"]";															
						return '<a href="javascript:openTbUnitWin( \''
								+ record.data.uids + '\')">' + downloadStr +'</a>'									
								
								
				}
			}, 
			{
				id : 'tbunit',
				type : 'string',
				header : fc['tbunit'].fieldLabel,
				width:230,
				dataIndex : fc['tbunit'].name,
				renderer:function(value, metadata, record, rowIndex,
							colIndex, store){
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>'; 
				}
			}, 
			{
				id : 'bidprice',
				type : 'float',
				header : fc['bidprice'].fieldLabel,
				width:80,
				align:"right",
				dataIndex : fc['bidprice'].name,
                renderer : cnMoneyToPrec
//				renderer : function(value){
//					return cnMoneyToPrec(value/10000,2);
//				}
			}, 
            {id:'conname',header:fc['conname'].fieldLabel,dataIndex:fc['conname'].name,width:230,hidden:!chart},
			{
				id : 'conprice',
				type : 'float',
				align:"right",
				header : fc['conprice'].fieldLabel,
				width:80,
				dataIndex : fc['conprice'].name,
				renderer : cnMoneyToPrec
			},
			{
				id : 'bdgMoney',
				type : 'float',
				align:"right",
				header : fc['bdgMoney'].fieldLabel,
				width:80,
				dataIndex : fc['bdgMoney'].name,
				renderer : cnMoneyToPrec
			},
            {id:'conpay',header:fc['conpay'].fieldLabel,dataIndex:fc['conpay'].name,align:'right',width:80,hidden:!chart},
            {
				id : 'bidfj',
				hidden:true,
				type : 'date',
				header : fc['bidfj'].fieldLabel,
				align:'center',
				width:80,
				dataIndex : fc['bidfj'].name,
				renderer:function(value, metadata, record, rowIndex,
							colIndex, store){
						var uids;
						DWREngine.setAsync(false);		
				        db2Json.selectData("select uids from pc_bid_progress where progress_type='TbSendZbDoc' and content_uids='"+value+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null&&list[0]){
					   	 uids=list[0].uids;
					     		 }  
					      	 });		
						var editable=false;	
						var count=0;
				        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PcBidProgress' and transaction_Id='"+uids+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null&&list[0]){
					   	 count=list[0].count;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);	
					    var  bidprojectType="PcBidProgress";
					    var downloadStr="查看["+count+"]";								
						return '<a href="javascript:showUploadWin(\''
								+ bidprojectType + '\', ' + editable + ', \''
								+ uids + '\', \'招标文件\' )">' + downloadStr +'</a>'						    
					    
				}
			}, {
				id : 'bidassess',
				hidden:true,
				type : 'string',
				header : fc['bidassess'].fieldLabel,
				dataIndex : fc['bidassess'].name,
				align:"center",
				width:80,
				renderer:function(value, metadata, record, rowIndex,
							colIndex, store){
						var uids;
						DWREngine.setAsync(false);	
				        db2Json.selectData("select uids from pc_bid_progress where progress_type='BidAssess' and content_uids='"+value+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null&&list[0]){
					   	 uids=list[0].uids;
					     		 }  
					      	 });		
						var editable=false;	
						var count=0;
				        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PCBidAssessReport' and transaction_Id='"+uids+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null&&list[0]){
					   	 count=list[0].count;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);	
					    var  bidprojectType="PCBidAssessReport";
					    var downloadStr="查看["+count+"]";								
						return '<a href="javascript:showUploadWin(\''
								+ bidprojectType + '\', ' + editable + ', \''
								+ uids + '\', \'评标报告\' )">' + downloadStr +'</a>'	
				}
			}
			, 
			{
				id : 'bidway',
				type : 'string',
				header : fc['bidway'].fieldLabel,
				width:170,
				dataIndex : fc['bidway'].name,
				hidden:true,
				renderer:function(data){
					for(var i=0;i<pbWayArr.length;i++){
						if(pbWayArr[i][0]==data){
							return pbWayArr[i][1];
						}
					}
				}
			}			
	]);

	cm.defaultSortable = true; // 设置是否可排序	
	// 3. 定义记录集
	var Columns = [
			{
				name : 'zbuids',
				type : 'string'
			},	
			{
				name : 'uids',
				type : 'string'
			},
			{
				name : 'bidtype',
				type : 'string'
			},
			{
				name : 'bidcontent',
				type : 'string'
			},
			
		    {
				name : 'bidstarttime',
				type : 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, 
			{
				name : 'tbuids',
				type : 'string'
			}, {
				name : 'tbunit',
				type : 'string'
			}, {
				name : 'bidprice',
				type : 'float'
			}, {
				name : 'conprice',
				type : 'string'
			}, {
				name : 'bdgMoney',
				type : 'float'
			},{
				name : 'bidfj',
				type : 'string'
			}, {
				name : 'bidassess',
				type : 'string'
			}, {
				name : 'bidway',
				type : 'string'
			}
            
            ,{name:'conid',type:'string'}
            ,{name:'conno',type:'string'}
            ,{name:'conname',type:'string'}
            ,{name:'conmoney',type:'float'}
            ,{name:'conpay',type:'float'}
            
			];			
	
/**
 * 创建数据源
 */
    ds= new Ext.data.Store({
		baseParams : {
			ac : 'listBidCompQuery',
			bean : bean,
			params : "pid='"+pid+"'",
			pid:pid,
			zbType:""
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : BID_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		//remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort("bidstarttime","DESC");
	ds.on('beforeload', function(store, options) {
				//store.baseParams.params="pid = '" + currentPid + "'";  
			});

	var Plant = Ext.data.Record.create(Columns);
	var PlantInt= {
				uids:'',
				bidtype : '',
				bidcontent : '',
				bidstarttime : '',
				tbuids : '',
				tbunit : '',
				bidprice : '',
				conprice : '',
				bdgMoney:'',
				bidfj:'',
				bidassess:'',
				bidway:''
                ,conid:''
                ,conno:''
                ,conname:''
                ,conmoney:''
                ,conpay:''
			}		
	// 招标类型store顶部工具栏
	bidTypeStroeTbar = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidTypeArrTbar
			});					
	// 招标类型下拉框顶部工具栏
	var bidTypeComboTbar = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
                value:bidtypeid=='6'?'-1':bidtypeid,
				store : bidTypeStroeTbar,
				valueField : 'k',
				displayField : 'v',
				allowBlank : true,
				name : 'zbType',
				emptyText : '全部'
			});	
	//顶部工具栏招标类型的过滤
	bidTypeComboTbar.on("select",bidTypeComboSelectFun);
    
    function bidTypeComboSelectFun(){
      	zbType = bidTypeComboTbar.getValue();
         if(zbType&&zbType!="-1"){
            DWREngine.setAsync(false);  
            PCBidDWR.getContentBidCountByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(count){
                countContent=count;
            });
            PCBidDWR.getContentConMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
                if(money!=0&&money!=0.0&&money){
                    convmoney=money;
                }else{
                    convmoney=0;
                }
            });  
            PCBidDWR.getContentBidPriceByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(bidPr){
            	if(bidPr!=0&&bidPr!=0.0&&bidPr){
                    bidP=bidPr;
                }else{
                    bidP=0;
                }
            });     
           	PCBidDWR.getContentBdgMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
				if(money!=0&&money!=0.0&&money){
					bdgMoney=money
				}else{
					bdgMoney=0;
				}
			});	   
            DWREngine.setAsync(true);
            btnContent.setText("<font color=red>"+countContent+"</font>"+" 条");
            btnCon.setText("<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元");
            //btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP/10000,2)+"</font> 万元");
            btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元");
            btnBdgMoney.setText("<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元");
            ds.baseParams.zbType=zbType;
            reload();
         }else if(zbType=="-1"){
            DWREngine.setAsync(false);  
            PCBidDWR.getContentBidCountByType(pid,"",isBid,bidcontent,bidstarttime,tbunit,bidway,function(count){
                countContent=count;
            });
            PCBidDWR.getContentConMoneyByType(pid,"",isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
                if(money!=0&&money!=0.0&&money){
                    convmoney=money;
                }else{
                    convmoney=0;
                }
            }); 
            PCBidDWR.getContentBidPriceByType(pid,"",isBid,bidcontent,bidstarttime,tbunit,bidway,function(bidPr){
            	if(bidPr!=0&&bidPr!=0.0&&bidPr){
                    bidP=bidPr;
                }else{
                    bidP=0;
                }
            });
            PCBidDWR.getContentBdgMoneyByType(pid,"",isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
				if(money!=0&&money!=0.0&&money){
					bdgMoney=money
				}else{
					bdgMoney=0;
				}
			});	                 
            DWREngine.setAsync(true);
            btnContent.setText("<font color=red>"+countContent+"</font>"+" 条");     
            btnCon.setText("<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元");
            //btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP/10000,2)+"</font> 万元");
            btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元");
            btnBdgMoney.setText("<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元");
            ds.baseParams.zbType="";
            reload();       
         }
    }
	//顶部工具栏是否招标条件过滤
	var bidZbArrTbar = [['-1','全部'],['1','已招标已签订合同'],['0','已招标未签订合同']];
	var bidZbArrTbarStore = new Ext.data.SimpleStore({
		fields : ['k','v'],
		data : bidZbArrTbar
	});
	// 是否招标下拉框顶部工具栏
	var bidZbComboTbar = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
                value:'',
				store : bidZbArrTbarStore,
				valueField : 'k',
				displayField : 'v',
				allowBlank : true,
				name : 'bidZb',
				emptyText : '全部'
			});	
	//顶部工具栏是否招标的过滤
	bidZbComboTbar.on("select",bidZbComboSelectFun);
    
    function bidZbComboSelectFun(){
        isBid = bidZbComboTbar.getValue();
         if(isBid&&isBid!="-1"){
         	DWREngine.setAsync(false);  
            PCBidDWR.getContentBidCountByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(count){
                countContent=count;
            });
            PCBidDWR.getContentConMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
                if(money!=0&&money!=0.0&&money){
                    convmoney=money;
                }else{
                    convmoney=0;
                }
            });  
            PCBidDWR.getContentBidPriceByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(bidPr){
            	if(bidPr!=0&&bidPr!=0.0&&bidPr){
                    bidP=bidPr;
                }else{
                    bidP=0;
                }
            });
            PCBidDWR.getContentBdgMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
				if(money!=0&&money!=0.0&&money){
					bdgMoney=money
				}else{
					bdgMoney=0;
				}
			});	          
            DWREngine.setAsync(true);
            btnContent.setText("<font color=red>"+countContent+"</font>"+" 条");
            btnCon.setText("<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元");
            //btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP/10000,2)+"</font> 万元");
            btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元");
            btnBdgMoney.setText("<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元");
            ds.baseParams.isBid=isBid;
            reload();
         }else if(isBid=="-1"){
         	DWREngine.setAsync(false);  
            PCBidDWR.getContentBidCountByType(pid,zbType,"",bidcontent,bidstarttime,tbunit,bidway,function(count){
                countContent=count;
            });
            PCBidDWR.getContentConMoneyByType(pid,zbType,"",bidcontent,bidstarttime,tbunit,bidway,function(money){
                if(money!=0&&money!=0.0&&money){
                    convmoney=money;
                }else{
                    convmoney=0;
                }
            });  
            PCBidDWR.getContentBidPriceByType(pid,zbType,"",bidcontent,bidstarttime,tbunit,bidway,function(bidPr){
            	if(bidPr!=0&&bidPr!=0.0&&bidPr){
                    bidP=bidPr;
                }else{
                    bidP=0;
                }
            }); 
            PCBidDWR.getContentBdgMoneyByType(pid,zbType,"",bidcontent,bidstarttime,tbunit,bidway,function(money){
				if(money!=0&&money!=0.0&&money){
					bdgMoney=money
				}else{
					bdgMoney=0;
				}
			});	         
            DWREngine.setAsync(true);
            btnContent.setText("<font color=red>"+countContent+"</font>"+" 条");
            btnCon.setText("<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元");
            //btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP/10000,2)+"</font> 万元");
            btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元");
            btnBdgMoney.setText("<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元");
            ds.baseParams.isBid="";
            reload();       
         }
    }		
	//模糊查询按钮
	var queryBtn = new Ext.Button({
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler:function(){
			//showWindow(grid);
			queryForm.getForm().reset();
			quryWindow.show();
		}
	});	
	var bidWayStore = new Ext.data.SimpleStore({
		fields : ['k','v'],
		data : pbWayArr
	});
	// 招标方法下拉框
	var bidWayCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				width:200,
                value:'',
				store : bidWayStore,
				valueField : 'k',
				displayField : 'v',
				allowBlank : true,
				fieldLabel:'招标方法',
				name : 'bidway',
				emptyText : ''
			});	
	var queryForm = new Ext.FormPanel({
		frame:true,
		labelWidth:80,
		bodyStyle:'padding:5px 5px 0',
		defaults:{
			width:300
		},
		//defaultType:'textfield',
		items:[
			{
				layout:"column",
				items:[
					{
						layout:"form",
						//xtype:"fieldset",
						items:[	
								{
									xtype:"textfield",
									fieldLabel:"招标内容",
									name:"bidcontent",
									anchor:'95%'
								},
								new Ext.form.DateField({
									fieldLabel: '开标时间',
									width:200,
                       				name: 'bidstarttime',
                        			format:"Y-m-d"
                   				}),
								{
									xtype:"textfield",
									fieldLabel:"中标单位",
									name:"tbunit",
									anchor:'95%'
								},
								bidWayCombo
							]
					}
				]
			}
		]
	});
	var quryWindow = new Ext.Window({
		layout:"fit",
		width:320,
		height:200,
		closeAction:"hide",
		plain:true,
		items:queryForm,
		buttons:[
			{
				text:"确定",
				handler:function(){
					bidQuery();
					quryWindow.hide();
				}
			},
			{
				text:"取消",
				handler:function(){
					quryWindow.hide();
				}
			},
			{
				text:"重置",
				handler:function(){
					queryForm.getForm().reset();
				}
			}
		]
	});
	//顶部模糊查询
	function bidQuery(){
		var obj = queryForm.getForm().getValues();
		bidcontent = obj.bidcontent;
		bidstarttime = obj.bidstarttime;
		tbunit = obj.tbunit;
		bidway = obj.bidway;
		DWREngine.setAsync(false);  
	        PCBidDWR.getContentBidCountByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(count){
	            countContent=count;
	        });
	        PCBidDWR.getContentConMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
	            if(money!=0&&money!=0.0&&money){
	                convmoney=money;
	            }else{
	                convmoney=0;
	            }
	        });  
	        PCBidDWR.getContentBidPriceByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(bidPr){
	        	if(bidPr!=0&&bidPr!=0.0&&bidPr){
	                bidP=bidPr;
	            }else{
	                bidP=0;
	            }
	        });
	        PCBidDWR.getContentBdgMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway,function(money){
				if(money!=0&&money!=0.0&&money){
					bdgMoney=money
				}else{
					bdgMoney=0;
				}
			});        
        DWREngine.setAsync(true);
        btnContent.setText("<font color=red>"+countContent+"</font>"+" 条");
        btnCon.setText("<font color=red>"+cnMoneyToPrec(convmoney)+"</font> 万元");
        //btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP/10000,2)+"</font> 万元");
        btnBidPrice.setText("<font color=red>"+cnMoneyToPrec(bidP)+"</font> 万元");
        btnBdgMoney.setText("<font color=red>"+cnMoneyToPrec(bdgMoney)+"</font> 万元");
		ds.baseParams.bidcontent=bidcontent;
		ds.baseParams.bidstarttime=bidstarttime;
		ds.baseParams.tbunit=tbunit;
		ds.baseParams.bidway=bidway;
		reload();
		quryWindow.hide();
	}
		
	grid = new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		tbar : ["招标类型：",bidTypeComboTbar,"-",'是否签订合同：',bidZbComboTbar,'-',"招标内容：",btnContent,"-","中标金额：",btnBidPrice,'-',"合同金额：",btnCon,"-",'概算金额：',btnBdgMoney,"->",queryBtn,'-','计量单位：万元'],
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		autoScroll : true, // 自动出现滚动条
//		collapsible : false, // 是否可折叠
//		animCollapse : false, // 折叠时显示动画
//		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
//		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true,
			autoScroll:true/*,
			width:document.body.clientWidth  */
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 10,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		addBtn : false, 
		saveBtn : false, 
		delBtn : false, 
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : BID_SERVLET,
		bean : bean
	});	
	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				title : titleText,
				header : false,
				items : [grid]
			})
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
    if(chart&&bidtypeid!='6'){
        bidTypeComboSelectFun(bidtypeid);
    }else{
		reload();
    }
    
	function reload(){	
		ds.load({params:{
				start:0,
				limit:10
			}
		})
	}
    
	var dataGridRsTbUnit = [
{
			name : 'uids',
			type : 'string'
		}, {
			name : 'tbUnit',
			type : 'string'
		}, {
			name : 'preHearResult',
			type : 'string'
		}, {
			name : 'price',
			type : 'float'
		}
			]		
		
		
		
	dsResultTbUnit= new Ext.data.Store({
		baseParams : {
			ac : 'getTbUnitPrice',
			orderby : "tbUnit",
			bidContentId:"",
			pid:pid
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : BID_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, dataGridRsTbUnit),
		remoteSort : true,
		pruneModifiedRecords : true
	});			
			
			
	columnModelTbUnit = new Ext.grid.ColumnModel([ 
				 {
					header : '单位编号',
					dataIndex : 'uids',
					align : 'center',
					hidden:true,
					width : 1
				},  
				{
					header : '投标单位',
					dataIndex : 'tbUnit',
					align : 'left',
					width : 229,
					renderer:function(data){
					 	var qtip = "qtip=" + data;
                		return '<span ' + qtip + '>' + data + '</span>';						
					}

				},  
				{
					header : '预审结果',
					dataIndex : 'preHearResult',
					align : 'center',
					width : 100,
					renderer:function(value){
						return value==0?"未通过":"通过";
					}

				},  
				{
					header : '单位报价',
					dataIndex : 'price',
					align : 'right',
					width : 100,
					renderer : function(value){
						if(value!=0&&value){			
							return cnMoneyToPrec((value/10000).toFixed(0));
						}else{
							return value;
						}
					}

				}]);				
/*	pageToolbarTbUnit = new Ext.PagingToolbar({
					pageSize : PAGE_SIZE,
					beforePageText : "第",
					afterPageText : "页, 共{0}页",
					store : dsResultTbUnit,
					displayInfo : true,
					firstText : '第一页',
					prevText : '前一页',
					nextText : '后一页',
					lastText : '最后一页',
					refreshText : '刷新',
					displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
					emptyMsg : "无记录。"
				});	*/	
});
//投标单位及报价
function openTbUnitWin(contentuids){
		
		// 创建Grid				
		gridTbUnit = new Ext.grid.GridPanel({
					id : 'file-grid',
					ds : dsResultTbUnit,
					cm : columnModelTbUnit,
					sm : smTbUnit,
					region : 'center',
					layout : 'anchor',
					autoScroll : true, // 自动出现滚动条
					collapsible : false, // 是否可折叠
					animCollapse : false, // 折叠时显示动画
					loadMask : true, // 加载时是否显示进度
					stripeRows : true,
					viewConfig : {
						//forceFit : true
					},
					//bbar : pageToolbarTbUnit,
					tbar :["->","计量单位：万元"]
				});	
		dsResultTbUnit.baseParams.bidContentId=contentuids;
		dsResultTbUnit.load({
				});					
	if(!gridTbUnitWin){
	gridTbUnitWin = new Ext.Window({
				title : '投标单位及报价',
				width : 470,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				items:[gridTbUnit]
			});			
	}
	
		gridTbUnitWin.show();		
}
function showUploadWin(businessType, editable, businessId, winTitle) {
	
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
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
	fileWin.show();
}
function openDialog(url, winName){
    var r = BASE_PATH + url;
	var h = screen.availHeight;
	var w = screen.availWidth;
    	try{
    	 window.open(r,null,"width="+w+"px, height="+h+"px, status=no, center=yes," +
    				"resizable=no, alwaysRaised=yes, location=no, left=0px, titlebar=yes"); 
    	}
    	catch(e){
    		//alert(e.description);
    		//window.open(r);
    	}
}

