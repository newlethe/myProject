var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStock"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var fileWin;
var equTypeArr = new Array();
var getEquidstore = new Array();
var ds;
var dsSub,sm,gridPanel;
var jzArr = new Array();
var xjhArr = new Array();

var selectedUids;
Ext.onReady(function(){
	DWREngine.setAsync(false);
	db2Json.selectData(
			"select uids,stockid from EQU_SPECIAL_TOOLS_DETAIL where  masteruids='"
					+ masteruids + "'", function(jsonData) {
				var list = eval(jsonData);
				if (list != null) {
					for (var i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].uids);
						temp.push(list[i].stockid);
						xjhArr.push(temp);
					}

				}
			});
	DWREngine.setAsync(true);
	var fm = Ext.form;
	DWREngine.setAsync(false);
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
	});	
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
	baseMgm.getData("select uids,equno from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
	//合同列表
	var conArr=new Array();
	var sql = "select c.conid,c.conname  from Equ_Cont_View c";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			conArr.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
    //查询表单
    var boxNo = new Ext.form.TextField({
		id: 'boxNo', name: 'boxNo'
	});
	var equPartName = new Ext.form.TextField({
		id: 'equPartName', name: 'equPartName'
	});
	var ggxh = new Ext.form.TextField({
		id: 'ggxh', name: 'ggxh'
	});

    //过滤掉已经选择过的设备
    if(masteruids!=""){
        var sql = "SELECT t.stockid FROM Equ_Special_Tools_Detail t WHERE t.masteruids ='"+masteruids+"'";
            var notInStr = "";
            DWREngine.setAsync(false);
            baseDao.getData(sql,function(list){
                for(i = 0; i < list.length; i++) {
                    notInStr += ",'"+list[i]+"' ";
                }
            });
            DWREngine.setAsync(true);
            if(notInStr!=""){
                notInStr = notInStr.substring(1);
                selectedUids = " and uids not in ("+notInStr+")";
            }
    }
	
    var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号'
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '设备部件名称'
		},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {
			name : 'equType',
			fieldLabel : '设备类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: equTypeDs
		},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量'},
		'weight' : {name : 'weight',fieldLabel : '重量（吨）'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	sm = new Ext.grid.CheckboxSelectionModel({
		renderer:function(value,metaData,record){
            return Ext.grid.CheckboxSelectionModel.prototype.renderer.apply(this,arguments);
        },
        listeners:{'beforerowselect':function(SelectionModel,rowIndex,keepExisting,record){
            var count1 = 0, count2 = 0; 
            DWREngine.setAsync(false);
            var sql = "SELECT nvl(d.jcnum,0) jcnum ,(SELECT nvl(sum(g.ghnum),0) FROM " +
                    " equ_special_tools_detail_gh g WHERE g.detailuids = d.uids) ghnum " +
                    " FROM equ_special_tools_detail d WHERE d.stockid = '"+record.data.uids+"' ";            
            db2Json.selectData(sql, function(jsonData) {
                var list = eval(jsonData);
                if (list != null) {
                    for (var i = 0; i < list.length; i++) {
                        count1 += parseInt(list[i].jcnum,10);
                        count2 += parseInt(list[i].ghnum,10);
                    }
                }
            });
            DWREngine.setAsync(true);
            count1 = parseInt(count1, 10);
            count2 = parseInt(count2, 10);
            if(record.data.stockNum > (count1 - count2)){
                return true;
            }else{
                Ext.example.msg('不能选择！','库存不足，不能再借出！');
                return false;
            }
        }}
			});		
	var cm = new Ext.grid.ColumnModel([
		sm,
		{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fc['treeuids'].fieldLabel,
			dataIndex : fc['treeuids'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fc['boxNo'].fieldLabel,
			dataIndex : fc['boxNo'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
		},{
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
			width : 180,
			renderer : function(v,m,r){
				var conid = r.get('conid');
			    var conname;
				for(var i=0;i<conArr.length;i++){
					if(conid == conArr[i][0]){
						conname = conArr[i][1];
						break;
					}
				}
				var output ="<a title='"+conname+"' style='color:blue;' " +
						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+conname+"</a>"		
				return output;           
           },
           type : 'string'
		}, {
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			align : 'center',
			width : 100	,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			}
		},{
			id : 'equPartName',
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			align : 'center',
			width : 180,
			type : 'string'
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'graphNo',
			header : fc['graphNo'].fieldLabel,
			dataIndex : fc['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			width : 80
		},{
			id : 'stockNum',
			header : fc['stockNum'].fieldLabel,
			dataIndex : fc['stockNum'].name,
			align : 'right',
			width : 80
		}, {
			id : 'XX',
			header : "已借出数量",
			dataIndex : "XX",
			renderer : function(data, metadata, record, rowIndex, columnIndex, store) {
				var count1 = 0, count2 = 0;
				DWREngine.setAsync(false);
                var sql = "SELECT nvl(d.jcnum,0) jcnum ,(SELECT nvl(sum(g.ghnum),0) FROM " +
                        " equ_special_tools_detail_gh g WHERE g.detailuids = d.uids) ghnum " +
                        " FROM equ_special_tools_detail d WHERE d.stockid = '"+record.data.uids+"' "
				db2Json.selectData(sql, function(jsonData) {
					var list = eval(jsonData);
					if (list != null) {
						for (var i = 0; i < list.length; i++) {
							count1 +=  parseInt(list[i].jcnum,10);
							count2 +=  parseInt(list[i].ghnum,10);
						}
					}
				});
				DWREngine.setAsync(true);
				count1 = parseInt(count1, 10);
				count2 = parseInt(count2, 10);
				return count1 - count2 ;
			},
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fc['weight'].fieldLabel,
			dataIndex : fc['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fc['storage'].fieldLabel,
			dataIndex : fc['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 80
		}
	]);
	var Columns = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'conid', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'stockNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'storage', type:'string'},
		{name:'jzNo', type:'string'}
	];
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"' and treeuids not in (" + notreeuuidstr + ")"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    ds.on("beforeload",function(){
    	if(ds.baseParams.params!=""){//过滤出库单已经选中的设备
    		ds.baseParams.params+=" and stockNum>0";
    	}else{
    		ds.baseParams.params ="pid='"+CURRENTAPPID+"' and treeuids not in (" + notreeuuidstr + ") and stockNum>0";
    	}
    	if(selectedUids){
			ds.baseParams.params += selectedUids;
		}
    });
    
   	var borrowBtn = new Ext.Toolbar.Button({
			id:'btnSavfe',
			text : '确定选择',
			handler : borrowFun
		});	
   	var cancelBtn = new Ext.Toolbar.Button({
			id:'btnSavfe',
			text : '取消',
			handler:function(){parent.selectWin.hide()}
		});			
    gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm:sm,
		border: false, 
		region: 'center',
		header: false, 
		tbar:['<font color=#15428b><B>设备库存(专用工具及备品备件)<B></font>','-',borrowBtn,"-",cancelBtn],
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
    
});
function borrowFun(){
 	var selectRows =gridPanel.getSelectionModel().getSelections();
  	if(selectRows.length==0){
        Ext.example.msg('提示！', '请先勾选需要选择的设备！');
  	}else{
  		for(var i = 0;i<selectRows.length;i++){
  			var record=selectRows[i];
  		  	var gh = new Object();
  			gh.masteruids=masteruids;
  			gh.stockid=record.data.uids;	
			gh.conid=record.data.conid;	
			gh.bh=bh;	
			DWREngine.setAsync(false);
			equMgm.initEquSpecialToolsDetail(gh,function(flag){
				Ext.example.msg('提示！', '保存成功');
				parent.selectWin.hide();
				parent.applicantDs2.baseParams.params="masteruids='"+masteruids+"'";
				parent.applicantDs2.load({
					params:{
						start: 0,
						limit: PAGE_SIZE
					}
				});						
			});
			DWREngine.setAsync(true);
  		}  	
  	}
  	
}