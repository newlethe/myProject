var beanSub ="com.sgepit.pmis.equipment.hbm.EquSbdh";
var beanList ="com.sgepit.pmis.equipment.hbm.EquList";
var beanBdg = "com.sgepit.pmis.budget.hbm.BdgInfo"
var  businessSub ="baseMgm";
var listMethodSub ="findWhereOrderBy";
var primaryKeySub ="uuid";
var orderColumnSub = "sx";
var SPLITB = "`";
var selectedGgId ;
var sbId;
var getzs;
var getdj;
var types = new Array();
var jzhType = new Array();
var selectWindow;
var _kxdh="";
var haveFlag=0;
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取机组号
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				jzhType.push(temp);		
			}
	    });
	appMgm.getCodeValue('设备类型',function(list){         //获取合同状态
	for(i = 0; i < list.length; i++) {
		var temp = new Array();	
		temp.push(list[i].propertyCode);		
		temp.push(list[i].propertyName);	
		types.push(temp);			
	}
   }); 
    DWREngine.setAsync(true);
	function selectWin(_conid, _conname, _conno, _kxdh){
		var obj = new Object();
    	obj.conid = conid;
    	obj.conno = conno;
    	obj.openid = _kxdh;
    	obj.dhid = selectedGgId;
    	obj.haveFlag = haveFlag;
    	var rtn = window.showModalDialog(BASE_PATH + 'Business/equipment/equ.getGoods.getSborBj.jsp' ,obj,"dialogWidth:900px;dialogHeight:600px;center:yes;resizable:yes;")
    	if(rtn){dsSub.reload()}
    }

 	var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	

	var equSelect = new Ext.Button({
    	text: '选择设备或部件',
    	iconCls: 'add',
    	handler: function(){
    		if (sm.getSelections()){
    			if (sm.getSelections().length == 1){
    				selectWin(conid, conname, conno, _kxdh);
	    		} else {
	    			Ext.Msg.show({
	    				title: '提示',
			            msg: '<br>请在一个设备到货批次下新增详细信息！',
			            icon: Ext.Msg.WARNING, 
			            width: 300,
			            buttons: Ext.MessageBox.OK
	    			})
	    		}
    		}
    	}
    });
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    });     
     
    var fmSub = Ext.form;			// 包名简写（缩写）

    var fcSub = {		// 创建编辑域配置
    	 'uuid': {
			name: 'uuid',
			fieldLabel: '设备到货主键',
			hidden:true,
			hideLabel:true
         },'dhId': {
			name: 'dhId',
			fieldLabel: '批次主键' ,
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键' ,
			hidden:true,
			hideLabel:true
         },'sbId': {
			name: 'sbId',
			fieldLabel: '设备名称',
			anchor:'95%'
         },'sx': {
			name: 'sx',
			fieldLabel: '属性',
			anchor:'95%'
         },'sccj': {
			name: 'sccj',
			fieldLabel: '生产厂家',
			anchor:'95%'
         }, 'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号', 
			anchor:'95%'
         }, 'dw': {
			name: 'dw',
			fieldLabel: '单位',
			anchor:'95%'
         },'zs': {
			name: 'zs',
			fieldLabel: '数量',
			anchor:'95%'
         },'dhsl': {
			name: 'dhsl',
			fieldLabel: '数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '入库单价',
			anchor:'95%'
         },'zj': {
			name: 'zj',
			fieldLabel: '入库总价',
			anchor:'95%'
         } ,'jzh': {
			name: 'jzh',
			fieldLabel: '机组号',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'iskx': {
			name: 'iskx',
			fieldLabel: '开箱',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'kxdh': {
			name: 'kxdh',
			fieldLabel: '开箱单号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		},'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算名称',
			anchor:'95%'
         },
         
         'sbno': {name: 'sbno',fieldLabel: '设备编号',anchor:'95%' },
         'sbmc': {name: 'sbmc',fieldLabel: '设备名称',anchor:'95%' },
         'rksl': {name: 'rksl',fieldLabel: '入库数量',anchor:'95%' },
         'fitPlace': {
			name: 'fitPlace',
			fieldLabel: '安装位置',
			anchor:'95%'
         },'gcbh':{
         	name:'gcbh',
         	fieldLabel:'单位工程编号',
         	anchor:'95%'
         },'bz':{
         	name:'bz',
         	fieldLabel:'备注',
         	anchor:'95%'
         },'wztype':{
         	name: 'wztype',
         	fieldLabel:'属性',
         	anchor:'95%'
         },'warehouseno':{
         	name: 'warehouseno',
         	fieldLabel:'仓库号',
         	anchor:'95%'
         },'libraryno':{
         	name: 'libraryno',
         	fieldLabel:'库位号',
         	anchor:'95%'
         }
    }
    
    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	smSub,//第0列，checkbox,行选择器
			 /*new Ext.grid.RowNumberer({
			 header : '到货批号',
			 width : 80
			 }),// 计算行数 */
		{
           id:'uuid',
           header: fcSub['uuid'].fieldLabel,
           dataIndex: fcSub['uuid'].name,
           renderer:function(){return sm.getSelecte},
           hidden: true
        },{
           id:'dhId',
           header: fcSub['dhId'].fieldLabel,
           dataIndex: fcSub['dhId'].name,
           hidden: true
        },{
           id:'pid',
           header: fcSub['pid'].fieldLabel,
           dataIndex: fcSub['pid'].name,
           hidden: true
        },{
           id:'conid',
           header: fcSub['conid'].fieldLabel,
           dataIndex: fcSub['conid'].name,
           hidden: true
        },{
           id:'gcbh',
           header: fcSub['gcbh'].fieldLabel,
           dataIndex: fcSub['gcbh'].name,
           width: 90,
           hidden:true,
           editor : new fmSub.TextField(fcSub['gcbh'])
        },{
           id:'sbId',
           header: '物资编码',hidden:true,
           dataIndex: fcSub['sbId'].name,
           width: 90
        },/*{
           id:'sbId',
           header: '物资名称',
           dataIndex: fcSub['sbId'].name,
           renderer: getSbName,
           width: 90
        },*/
        
        {id:'sbno',header: fcSub['sbno'].fieldLabel,dataIndex: fcSub['sbno'].name,width: 90},	
        {id:'sbmc',header: fcSub['sbmc'].fieldLabel,dataIndex: fcSub['sbmc'].name,width: 90},	
        
        {
           id:'ggxh',
           header: fcSub['ggxh'].fieldLabel,
           dataIndex: fcSub['ggxh'].name,
           width: 90
        },{
           id:'dw',
           header: fcSub['dw'].fieldLabel,
           dataIndex: fcSub['dw'].name,
           width: 60,
           editor : new fmSub.TextField(fcSub['dw'])
        },{
        	//id:'',
        	header:'当前验收数量',
        	width: 80,
        	renderer:function(value,cell,record){
        		var yszsl=0;
           		DWREngine.setAsync(false);
           		baseMgm.getData("select yszsl from equ_list t where sb_id='"+record.get('sbId')+"' and conid='"+conid+"'",function(str){
           			if(str!=null && str!="")yszsl = str;
           		})
           		DWREngine.setAsync(true);
           		return yszsl;
        	}
        },{
        	//id:'',
        	header:'已入库总数量',
        	width: 80,
        	renderer:function(value,cell,record){
        		var rkzsl=0;
           		DWREngine.setAsync(false);
           		baseMgm.getData("select rkzsl from equ_list where conid='"+conid+"' and sb_id='"+record.get('sbId')+"'",function(str){
           			if(str!=null && str!="")rkzsl = str;
           		})
           		DWREngine.setAsync(true);
           		return rkzsl;
        	}
        },{
        	id:'rksl',
        	header: fcSub['rksl'].fieldLabel,
        	dataIndex: fcSub['rksl'].name,
        	css : 'background: #FFFFCC;',
        	editor: new fmSub.NumberField(fcSub['rksl']),
        	width: 70
        },{
           id:'zs',
           header: fcSub['zs'].fieldLabel,
           dataIndex: fcSub['zs'].name,
           editor: new fmSub.NumberField(fcSub['zs']),
           width: 40,hidden:true
        },{
           id:'dj',
           header: fcSub['dj'].fieldLabel,
           dataIndex: fcSub['dj'].name,
           editor: new fmSub.NumberField(fcSub['dj']),
           width: 70
        },{
           id:'zj',
           header: fcSub['zj'].fieldLabel,
           dataIndex: fcSub['zj'].name,
           width: 80,
           renderer:function(v,c,r){
           		r.data.zj = r.data.dj*r.data.rksl;
           		return r.data.dj*r.data.rksl
           }
        },{
           id:'sccj',
           header: fcSub['sccj'].fieldLabel,
           dataIndex: fcSub['sccj'].name,
           //editor: new fmSub.TextField(fcSub['sccj']),
           width: 70
        },{
           id:'wztype',
           header: fcSub['wztype'].fieldLabel,
           dataIndex: fcSub['wztype'].name,
           width: 90,
           renderer:wztypeRender
        },{
           id:'jzh',
           header: fcSub['jzh'].fieldLabel,
           dataIndex: fcSub['jzh'].name,
           editor: new Ext.form.ComboBox(fcSub['jzh']),
           renderer: jzhRender,
           width: 90
        },{
           id:'warehouseno',
           header: fcSub['warehouseno'].fieldLabel,
           dataIndex: fcSub['warehouseno'].name,
           editor: new fmSub.TextField(fcSub['warehouseno']),
           width: 70
        },{
           id:'libraryno',
           header: fcSub['libraryno'].fieldLabel,
           dataIndex: fcSub['libraryno'].name,
           editor: new fmSub.TextField(fcSub['libraryno']),
           width: 70
        },{
           id:'bz',
           header: fcSub['bz'].fieldLabel,
           dataIndex: fcSub['bz'].name,
           editor: new fmSub.TextField(fcSub['bz']),
           width: 70
        },{
           id:'bdgid',
           header: fcSub['bdgid'].fieldLabel,
           dataIndex: fcSub['bdgid'].name,
           editor: comboxWithTree,
	       renderer: bdgName,
	       hidden: true,
           width: 120
        },{
           id:'fitPlace',
           header: fcSub['fitPlace'].fieldLabel,
           dataIndex: fcSub['fitPlace'].name,
           hidden: true
           
        },{
        id:'sx',
           header: fcSub['sx'].fieldLabel,
           dataIndex: fcSub['sx'].name,
           hidden: true
        }
        ,{
        id:'iskx',
           header: fcSub['iskx'].fieldLabel,
           dataIndex: fcSub['iskx'].name,
           hidden: true
        }
        ,{
        id:'dhsl',
           header: fcSub['dhsl'].fieldLabel,
           dataIndex: fcSub['dhsl'].name,
           hidden: true
        }
        ,{
        id:'kxdh',
           header: fcSub['kxdh'].fieldLabel,
           dataIndex: fcSub['kxdh'].name,
           hidden: true
        }
//           header: fcSub['iskx'].fieldLabel,
//           dataIndex: fcSub['iskx'].name,
//           renderer: function(value){
//				return ('0' == value) ? '否' : '是';
//			},
//			hidden: true,
//			width: 40
//        },{
//			id: 'kxdh',
//			header: fcSub['kxdh'].fieldLabel,
//			dataIndex: fcSub['kxdh'].name,
//			renderer: function(value){
//				if ("" != value){
//					var result;
//					DWREngine.setAsync(false); 
//					baseMgm.findById('com.sgepit.pmis.equipment.hbm.EquOpenBox', value, function(obj){
//						result = (obj.boxno == null) ? '开箱单号未填写' : obj.boxno;
//					});
//					DWREngine.setAsync(true);
//					return result;
//				}
//			},
//			 hidden: true
//		}
    ]);
    cmSub.defaultSortable = true;						//设置是否可排序
    // 3. 定义记录集
    var ColumnsSub = [
    	{name: 'uuid', type: 'string'},
    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'dhId', type: 'string'},
		{name: 'conid', type: 'string'},    	
		{name: 'sbId', type: 'string' },
		{name: 'sx', type: 'string' },
		{name: 'sccj', type: 'string'},
		{name: 'sbno', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'rksl', type: 'float'},
		{name: 'ggxh', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'dhsl', type: 'float'},
		{name: 'zs', type: 'float'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'iskx', type: 'float'},
		{name: 'dw', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'fitPlace', type: 'string'},
		{name: 'kxdh', type: 'string'},
		{name: 'gcbh', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'wztype',type: 'string'},
		{name: 'warehouseno',type: 'string'},
		{name: 'libraryno',type: 'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);			//定义记录集   	
    var PlantIntSub = {uuid:'',pid:CURRENTAPPID, dhId: '', conid:'', sbId:'',sx:'', sccj:'', ggxh:'',jzh:'', 
    				iskx:0,  dhsl:0, zs:0, dj:0, zj:'', dw:'', bdgid:'', fitPlace:'',kxdh:'',gcbh:'',
    				bz:'',wztype:'',warehouseno:'',libraryno:'',sbno:'',sbmc:'',rksl:''}	

		// 4. 创建数据源
    var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: businessSub,
	    	method: listMethodSub,
	    	//params: "wztype is not null"
	    	params: " dh_id = '"+selectedGgId+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeySub
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'asc');	

    // 5. 创建可编辑的grid: grid-panel
    var gridSub = new Ext.grid.EditorGridTbarPanel({
    	id: 'grid-panel',			//id,可选
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar: [equSelect],					//顶部工具栏，可选
        width : 1000,				//宽
        height: 300,				//高
        region: 'south',
        split:true,
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        border: false,
        loadMask: true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        saveHandler : getGoodsRkSaveHandler,
        deleteHandler : getGoodsRkDelHandler,
        plant: PlantSub,				
      	plantInt: PlantIntSub,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: businessSub,	
      	primaryKey: primaryKeySub
   });
   
       modRec = new Object();
	gridSub.on("aftersave",function(){
		DWREngine.setAsync(false);		
		if(modRec != null){
			for(var i=0;i<modRec.length;i++){
	   			var sbid=modRec[i].get('sbId');
		   		//更新清单中入库总数量
	   			var sumSql = "select sum(rksl) from equ_sbdh where sb_id='"+sbid+"' and dh_id in (select ggid from equ_get_goods t where conid='"+conid+"')"
	   			var sql = "update equ_list set rkzsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+sbid+"'";		
	   			baseDao.updateBySQL(sql,function(str){
	   				//更新库存
	   				baseDao.updateBySQL("update equ_list set kczsl=nvl(rkzsl,0)-nvl(ckzsl,0) where conid='"+conid+"' and sb_id='"+sbid+"'",function(str){
	   					//dsSub.reload();
	   				});
	   			});		   		
			}
			
		}
		DWREngine.setAsync(true);
		dsSub.reload();
	})
   
   
   gridSub.on('aftersave',function(){
		if (isFlwTask == true){
			Ext.Msg.show({
				title: '您成功维护了设备到货信息！',
				msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.INFO,
				fn: function(value){
			   		if ('yes' == value){
			   			parent.IS_FINISHED_TASK = true;
						parent.mainTabPanel.setActiveTab('common');
			   		}
				}
			});
		}      
   })
   
    

    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
/*    function getSbName(value){
    	var sbName = "";
    	DWREngine.setAsync(false);   
    	baseMgm.findById(beanList, value, function(obj){
    		sbName = obj.sbMc;
    	})
    	 DWREngine.setAsync(true); 
    	return sbName;
    }*/
    
/*    function getSbBh(value){
    	var sbBh = "";
    	DWREngine.setAsync(false);   
    	baseMgm.findById(beanList, value, function(obj){
    		sbBh = obj.sbBm;
    	})
    	 DWREngine.setAsync(true); 
    	return sbBh;
    }    */
   
	smSub.on('rowselect', function(){
		var record = smSub.getSelected();
		sbId = record.get('sbId');
		getrksl=record.get('rksl');
		getdj=record.get('dj');
		var getzj=getrksl*getdj;
		//record.set('zj',getzj);
	})
	//1、都是未开箱；2、已开箱并且开箱单号一样；
//	smSub.on('selectionchange', function(_sm){
//		var records = _sm.getSelections();
//		if (records.length > 0){
//			if (checkAllNotKx(records)){
//				gridSub.getTopToolbar().items.get('open').enable();
//				return;
//			} else if (IsSameKx(records)){
//				gridSub.getTopToolbar().items.get('open').enable();
//				return;
//			} else {
//				gridSub.getTopToolbar().items.get('open').disable();
//			}
//		} else {
//			gridSub.getTopToolbar().items.get('open').disable();
//		}
//	});
	
   // 属性值 
   function sxRender(value){
   		var str = types[5][1];
   		for(var i=0; i<types.length; i++) {
   			if (types[i][0] == value) {
   				str = types[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
   function jzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
   //保存入库子表
   function getGoodsRkSaveHandler(){   		
   		var records = dsSub.getModifiedRecords();
   		if(records.length==0)return;
   		modRec = records
   		var krk=false;
   		var krksl = 0
   		DWREngine.setAsync(false);
   		var flag = false;
   		var strArr = new Array();
   		for(var i = 0;i<records.length;i++){
   			//当前入库数量不能大于可入库数量（验收总数量-入库总数量）   		
   			var rksl = records[i].get('rksl');
   			var sbid = records[i].get('sbId');
   			var uuid = records[i].get('uuid');
   			var sumSql = "select sum(x.rksl) from (select uuid,sb_id,rksl from equ_sbdh where conid='"+conid+"' and sb_id='"+sbid+"') x where uuid<>'"+uuid+"'"
   			var sql = "select yszsl,("+sumSql+") qtrksl from equ_list where conid='"+conid+"' and sb_id='"+sbid+"'"
     		baseMgm.getData(sql,function(str){
     			strArr = str;
     		});
			if(rksl+strArr[0][1]>strArr[0][0]){
				Ext.Msg.show({
				   title: '提示！',
				   msg: '入库数量不能大于验收数量！',
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.INFO
				});
				flag=true;
				break;
			}

		}
		if(!flag){
			gridSub.defaultSaveHandler();
			dsSub.commitChanges();
			//dsSub.reload();
				   			
		}
		DWREngine.setAsync(true);
   }
   
   //删除入库子表
	function getGoodsRkDelHandler(){
		var records = smSub.getSelections();
		if(records.length==0)return;
			Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
			if(btn == "yes"){
				var uuidArr = new Array();
				for(var i = 0;i<records.length;i++){
					uuidArr.push(records[i].data.uuid);
				}
				DWREngine.setAsync(false);
				equGetGoodsMgm.deleteGetGoodInputSub(uuidArr,function(bool){
					if(bool){
						Ext.example.msg('删除成功！', '您成功删除了入库设备信息！');
						dsSub.reload();
					}else{
						
					}
				})
				DWREngine.setAsync(true);
			}
		});   
	}
   
	/*  
	*    ForDight(Dight,How):数值格式化函数，Dight要  
	*    格式化的  数字，How要保留的小数位数。  
	*/  

	function  ForDight(Dight,How)  
	{  
           Dight  =  Math.round  (Dight*Math.pow(10,How))/Math.pow(10,How);  
           return  Dight;  
	}  

	function checkAllNotKx(records){
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('iskx') == '1') return false;
		}
		return true;
	}

	function IsSameKx(records){
		if (checkAllIsKx(records)){
			var temp = records[0].get('kxdh');
			for (var i = 1; i < records.length; i++) {
				if (records[i].get('kxdh') != temp) return false;
			}
			return true;
		} else { return false }
	}
	
	function checkAllIsKx(records){
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('iskx') == '0') return false;
		}
		return true;
	}
	
	function bdgName(value){
	   	var bdgName = '';
		if (value != ''){
			DWREngine.setAsync(false);
	       		baseMgm.findById(beanBdg, value, function(obj){
	       			bdgName =  obj.bdgname;
	       		})
	   		DWREngine.setAsync(true);	
	   	}
	   	return bdgName;
	}
	/*
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}*/
	 function wztypeRender(value){
	 	var str = "";
   		for(var i=0; i<types.length; i++) {
   			if (types[i][0] == value) {
   				str = types[i][1]
   				break; 
   			}
   		}
   		return str;
   }
