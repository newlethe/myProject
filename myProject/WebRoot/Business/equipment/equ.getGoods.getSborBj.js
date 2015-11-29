var uuid;
//2010-12-21 数据修改为从设备清单读取
var beanList = "com.sgepit.pmis.equipment.hbm.EquList"
var bean = "com.sgepit.pmis.equipment.hbm.EquOpenBox"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquOpenBoxSub"
var beanPartyb = "com.sgepit.pmis.contract.hbm.ConPartyb";
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "uuid"
var orderColumn = "boxno"
var formPanelTitle = "新增一条记录"
//var propertyName = "ggId"
//var propertyValue = ggId;
var SPLITB = "`"
var pid = CURRENTAPPID;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 所有开箱记录";
var selectWindow;
var selectedGgId;
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];
var jzhType2 = [[5,'#1、#2机组'],[1,'#1机组-'],[2,'#2机组'],['','所有机组']];
var wzType = [[2,'设备'],[3,'备品备件'],[4,'专用工具'],['','所有类型']];
var formWindow;
var data = new Array();
var data_sub = new Array();
var data_rec = new Array();
var partBs= new Array();
var dsSub;
var queryWin,queryWin2;
var kxState='';
var billTypes = [[0,'待开箱'],[1,'处理中'],[2,'处理完毕'],[3,'被退回']];
var flowWindow;

var types_sbqd = new Array();
var jzhType_sbqd = new Array();

Ext.onReady(function (){
	
     var BUTTON_CONFIG = {
	  'Select': {
	    	id: 'select',
	    	text: '选择',
	    	iconCls: 'btn',
	    	//disabled: true,
	    	handler: toHandler
	    } 
    };
	
	DWREngine.setAsync(false);
	conpartybMgm.getPartyB(function(list){         //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });	
    DWREngine.setAsync(true);
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    });   
    var dsJzh2 = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });       
	 var combox_wztype = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : wzType
    });
    
    var dsTypes = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : types_sbqd
    });
	
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType_sbqd
    }); 
	//----------------------------------------------------从表相关
	var fmSub = Ext.form;
	var fcSub = {
		'sbId': {
			name: 'sbId',
			fieldLabel: '设备主键',
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '系统编码',
			hidden:true,
			hideLabel:true
         }, 'sbBm': {
			name: 'sbBm',
			fieldLabel: '设备编码/图号',
			anchor:'95%'
         }, 'sbMc': {
			name: 'sbMc',
			fieldLabel: '设备名称',  
			anchor:'95%'
         },'sccj': {
			name: 'sccj',
			fieldLabel: '生产厂家',
			anchor:'95%'
         },'returnDate': {
			name: 'returnDate',
			fieldLabel: '到货日期',
			format: 'Y-m-d',
            minValue: '2010-01-01',
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
			fieldLabel: '总到货数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '签订单价',
			anchor:'95%'
         },'zj': {
			name: 'zj',
			fieldLabel: '签订总价',
			anchor:'95%'
         },'jzh': {
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
         } ,'sx': {
			name: 'sx',
			fieldLabel: '属性',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsTypes,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },
         'kcsl': {
			name: 'kcsl',
			fieldLabel: '库存数量',
			anchor:'95%'
         },
         //2010-12-20 新增内容
         'dhzsl': {name: 'dhzsl',fieldLabel: '到货总数量',anchor:'95%'},
         'yszsl': {name: 'yszsl',fieldLabel: '验收总数量',anchor:'95%'},
         'rkzsl': {name: 'rkzsl',fieldLabel: '入库总数量',anchor:'95%'},
         'ckzsl': {name: 'ckzsl',fieldLabel: '出库总数量',anchor:'95%'},
         'kczsl': {name: 'kczsl',fieldLabel: '库存总数量',anchor:'95%'},
         
         'bdgid': {name: 'bdgid',fieldLabel: '概算编号',anchor:'95%'},
         'jhsl': {name: 'jhsl',fieldLabel: '签订数量',anchor:'95%'},
         'azsl': {name: 'azsl',fieldLabel: '安装数量',anchor:'95%'}
	}
	
	var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
	
	var cmSub = new Ext.grid.ColumnModel([
		smSub,
		new Ext.grid.RowNumberer({header:'序号',width:33}),
		  {id:'sbId',header: fcSub['sbId'].fieldLabel,dataIndex: fcSub['sbId'].name,hidden: true
		},{id:'conid',header: fcSub['conid'].fieldLabel,dataIndex: fcSub['conid'].name,hidden: true
		},{id:'pid',header: fcSub['pid'].fieldLabel,dataIndex: fcSub['pid'].name,hidden: true
        },{id:'sbBm',header: fcSub['sbBm'].fieldLabel,dataIndex: fcSub['sbBm'].name,width: 80//,renderer: renderConno
        },{id:'sbMc',header: fcSub['sbMc'].fieldLabel,dataIndex: fcSub['sbMc'].name,width: 100
        },{id:'ggxh',header: fcSub['ggxh'].fieldLabel,dataIndex: fcSub['ggxh'].name,width: 130
        },{id:'returnDate',header: fcSub['returnDate'].fieldLabel,dataIndex: fcSub['returnDate'].name,renderer:formatDate,width: 100       
        },{id:'jhsl', header: fcSub['jhsl'].fieldLabel,width: 80,dataIndex: fcSub['jhsl'].name
        },{id:'dhzsl',header: fcSub['dhzsl'].fieldLabel,dataIndex: fcSub['dhzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'yszsl',header: fcSub['yszsl'].fieldLabel,dataIndex: fcSub['yszsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'rkzsl',header: fcSub['rkzsl'].fieldLabel,dataIndex: fcSub['rkzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'ckzsl',header: fcSub['ckzsl'].fieldLabel,dataIndex: fcSub['ckzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'kczsl',header: fcSub['kczsl'].fieldLabel,dataIndex: fcSub['kczsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'azsl',hidden : true,header: fcSub['azsl'].fieldLabel,width: 80,dataIndex: fcSub['azsl'].name
        }
	]);	
	cmSub.defaultSortable = true;
	
	 var ColumnsSub = [
    	{name: 'bdgid', type: 'string'},
		{name: 'jhsl', type: 'float'},
		{name: 'azsl', type: 'float'},		
    	{name: 'sbId', type: 'string'},
    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sbBm', type: 'string'},    	
		{name: 'sbMc', type: 'string' },
		{name: 'sx', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'zs', type: 'float'},
		{name: 'kcsl', type: 'string'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'sccj', type: 'string'},
		{name: 'conid', type: 'string'},
		
		{name: 'dhzsl', type: 'float'},
		{name: 'yszsl', type: 'float'},
		{name: 'rkzsl', type: 'float'},
		{name: 'ckzsl', type: 'float'},
		{name: 'kczsl', type: 'float'},
		
		{name: 'returnDate', type: 'date',dateFormat: 'Y-m-d H:i:s'}
	 ]
	 // 4. 创建数据源
     dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanList,				
	    	business: business,
	    	method: listMethod,
	    	//params: "openId=(select uuid from "+bean+" where boxno='"+openid+"') and sbId not in(select sbId from com.sgepit.pmis.equipment.hbm.EquSbdh where dhId = "+dhid+")"
	    	params: " conid='"+conid+"' and yszsl>0 and sbId not in (select sbId from com.sgepit.pmis.equipment.hbm.EquSbdh where dhId='"+dhid+"')"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uuid'
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort('sbBm', 'asc');
 	dsSub.load({params: {start: 0,limit: PAGE_SIZE2}})
    
    // 5. 创建可编辑的grid
    var gridSub = new Ext.grid.EditorGridTbarPanel({
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        height: 300,				//高
        border: false,				// 
        tbar:['-'],
        region: 'center',
        addBtn:false,saveBtn:false,
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        delBtn : false, // 是否显示删除按钮
        collapsed: false,
        collapsible: true,
        split:true,
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE3,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
      	servletUrl: MAIN_SERVLET,		
      	bean: beanList,					
      	business: business,	
      	primaryKey: 'uuid'
   });    
   
   
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridSub]
    });
    
    gridSub.getTopToolbar().add(BUTTON_CONFIG['Select']);
    
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
	   // 属性值 
   function dsTypeRender(value){
   		var str = types_sbqd[5][1];
   		for(var i=0; i<types_sbqd.length; i++) {
   			if (types_sbqd[i][0] == value) {
   				str = types_sbqd[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
       function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		//alert(record.get('parentid'))
		if(getConid && getConid!="" && record.get('parentid')){
			var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
			return output;
		}else{
			return value;
		}
	}
	
	   function dsJzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType_sbqd.length; i++) {
   			if (jzhType_sbqd[i][0] == value) {
   				str = jzhType_sbqd[i][1]
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
 	function zjRender(value,metadata,record){
		var result = 0;
		result = record.data.dj * record.data.jhsl
		return result;
	}  
	
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}  
	
 
    function toHandler(){
	  	var record = gridSub.getSelectionModel().getSelected();
	  	var recArr = gridSub.getSelectionModel().getSelections();  	
		if(recArr){
			DWREngine.setAsync(false);
			var sbIds="";
			for(i=0;i<recArr.length;i++){
				sbIds += ","+recArr[i].data.sbId
			}		
			
			//dhid 入库主表主键
			//equGetGoodsMgm.insertEquSbrk(dhid,recArr[0].data.openId,sbIds.substr(1,sbIds.length-1),function(dat){
			equGetGoodsMgm.insertEquSbrkFromEquList(dhid,conid,sbIds.substr(1,sbIds.length-1),function(dat){
				 	if(dat){
				  		window.close();	
				  	}else{
				  		Ext.MessageBox.alert('提示',"错误!")
				  	}
			})
			/*
			//opensl入库数量(开箱：入库数量),sbbm,sbmc,ggxh,dw
			equGetGoodsMgm.insertEqusbdh(dhid,record.get('sbId'),record.get('sbbm'),record.get('sbbmc'),record.get('ggxh'),
										  record.get('dw'),record.get('opensl'),haveFlag,
										  function(dta){
										  	if(dta){
										  		window.close();	
										  	}else{Ext.MessageBox.alert('提示',"错误!")}
										  }
			);
			}*/
		    DWREngine.setAsync(true);
			
		    window.returnValue =true;
		}
	}   
    
});