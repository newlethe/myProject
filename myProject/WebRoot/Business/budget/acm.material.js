
var bean = "com.sgepit.pmis.budget.hbm.MatCompletion";
var primaryKey = "uuid";
var orderColumn = "opdate";
var business = "baseMgm";
var listMethod = "findByProperty";
var propertyName = "pid";
var propertyValue = CURRENTAPPID;
var SPLITB = "`";
var title = "材料投资完成" 	
var beanSub = "com.sgepit.pmis.budget.hbm.ProCompletionSub";
var beanPro = "com.sgepit.pmis.budget.hbm.BdgProject";
var beanBdg = "com.sgepit.pmis.budget.hbm.BdgInfo";
var primaryKeySub = "procomsubid";
var data = new Array();
var acmid;
var bdgId;
	
Ext.onReady(function(){
	
	var btn = new Ext.Button({
		name: 'initial',
        text: '初始化',
        iconCls: 'btn',
        handler : initial
	});
	
	var fm = Ext.form; 
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})
	
	var fc = {		
    	'uuid': {
			name: 'uuid',
			fieldLabel: '材料投资完成主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        },'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'opdate': {
			name: 'opdate',
			fieldLabel: '日期',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'money': {
			name: 'money',
			fieldLabel: '总金额',
			anchor:'95%'
        }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		}
	}
	
    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'pid', type: 'string'},
		{name: 'opdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'money', type: 'float'},
		{name: 'remark', type: 'string'}
	];
		
    var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	money: 0,
    	pid: CURRENTAPPID,
    	remark: ''
    } 
    
    var cm = new Ext.grid.ColumnModel([
    	sm,{
           id:'uuid',
           header: fc['uuid'].fieldLabel,
           dataIndex: fc['uuid'].name,
		   hidden:true,
		   hideLabel:true
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
		   hidden:true,
		   hideLabel:true
        },{
           id:'opdate',
           header: fc['opdate'].fieldLabel,
           dataIndex: fc['opdate'].name,
           width: 100,
           renderer: formatDate,
           editor: new fm.DateField(fc['opdate'])
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           renderer: cnMoney,
           align: 'right',
           width: 120
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           width: 150,
           editor: new fm.TextField(fc['remark'])
        }
	])
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue   // where 子句
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
    ds.setDefaultSort(orderColumn, 'asc');

	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [{text:'<font color=#15428b><b>&nbsp;'+ title+'</b></font>'},'-'],
        iconCls: 'icon-by-category',
        border: false,
        region: 'center',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 6,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey	
	});	
	ds.load({
	    	params:{
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	})
	    

    //  从grid
    //----------------------------------------------------------------------------------------------------------------------------
    var fcSub = {		
    	'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算名称',
			anchor:'95%'
        },'total': {
			name: 'total',
			fieldLabel: '金额',
			anchor:'95%'
        }
	}

    var ColumnsSub = [
    	{name: 'bdgid', type: 'string'},
		{name: 'total', type: 'float'}];
			
   
	var smSub =  new Ext.grid.CheckboxSelectionModel()
    var cmSub = new Ext.grid.ColumnModel([
    	smSub,{
           id:'bdgid',
           header: fcSub['bdgid'].fieldLabel,
           dataIndex: fcSub['bdgid'].name,
           renderer: getBdgname
        }, {
           id:'total',
           header: fcSub['total'].fieldLabel,
           renderer: cnMoney,
           dataIndex: fcSub['total'].name
          
        }
	])
    cmSub.defaultSortable = true;


    // 创建数据源
	var dsSub = new Ext.data.SimpleStore({
        fields: ColumnsSub 
        //data: data
    });
	
    var btnDetail = new Ext.Button({
		name: 'detail',
        text: '查看详细记录',
        iconCls: 'btn',
        handler : function(){
        	if (smSub.hasSelection()){
        		var record = smSub.getSelected();
        		var bdgid = record.get('bdgid');
        		window.location.href = BASE_PATH + "Business/budget/acm.material.detail.jsp?acmid="
        						  	+acmid + "&bdgid="+bdgid;
        	}
        	
        }
	});
    
	gridPanelSub = new Ext.grid.GridPanel({
    	id: 'code-grid-panel',
        ds: dsSub,
        cm: cmSub,
        sm: smSub,
        tbar: [{text:'<font color=#15428b><b>所有概算</b></font>'},'-',btnDetail],
        iconCls: 'icon-by-category',
        border: false, 
        height: 360,
        minSize: 2,
        region: 'south',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        split: true,
        loadMask: true,
        autoExpandColumn: 'bdgid',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
	});	

	sm.on('rowselect',function(sm,rowIndex,record ){
		data = [];
		acmid = record.get('uuid');
		DWREngine.setAsync(false);  
		matCompletionMgmImpl.getBdgData(acmid, function(list){
			for (var i=0; i<list.length; i++){
    			var obj = new Array();
	    		obj.push((list[i].BDGID));
	    		obj.push((list[i].TOTAL));
	    		data.push(obj);
    		}
    		dsSub.loadData(data);
		})
	})
	
	
   //---------------------------------------------------------------------------------------------------------------------------------- 
   
   // 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout: 'border',
            items: [gridPanelSub],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [gridPanel,gridPanelSub]
        });
    }
    
	gridPanel.getTopToolbar().add('->');
	gridPanel.getTopToolbar().add(btn);
    
	
	gridPanelSub.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(grid, rowIndex, e){
		e.stopEvent();
		grid.getSelectionModel().selectRow(rowIndex);
		var record = smSub.getSelected();
		bdgId = record.get('bdgid');
		
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
		                text: '查看详细记录',
		                iconCls: 'btn',
		                value: bdgId,
		                handler : function(){
		                	window.location.href = BASE_PATH + "Business/budget/acm.material.detail.jsp?" + 
		                		"acmid=" + acmid + "&bdgid=" + this.value;
 		                }
                    }]
	    });
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	
	function formatDate(value){
     return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function initial(){
    	Ext.MessageBox.show({
    		title: '提示',
    		msg: '是否初始化?　　　　',
    		icon: Ext.MessageBox.QUESTION,
    		buttons: Ext.Msg.YESNO,
    		fn: function(value){
    			if ('yes' == value){
    				var record = sm.getSelected();
			    	var acmid = record.get('uuid');
			    	
			    	DWREngine.setAsync(false);  
			    	matCompletionMgmImpl.initMatCompletion(acmid);
			    	data = [];
				    matCompletionMgmImpl.getBdgData(acmid, function(list){
						for (var i=0; i<list.length; i++){
			    			var obj = new Array();
				    		obj.push((list[i].BDGID));
				    		obj.push((list[i].TOTAL));
				    		data.push(obj);
			    		}
			    		dsSub.loadData(data);
			    		record.set('money', dsSub.sum('total'))
			    		gridPanel.defaultSaveHandler();
					})
			    	DWREngine.setAsync(true);  	
			    	
					
    		}
    	}
    	});
    	
	    }
	    
    
	function getBdgname(value, cellmeta, record){
		var bdgName;
		DWREngine.setAsync(false);
		baseMgm.findById(beanBdg,value, function(obj){
			bdgName =  obj.bdgname;
		})
		DWREngine.setAsync(true);
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/budget/acm.material.detail.jsp?acmid=' 
		       +acmid+'&bdgid='+record.get('bdgid')+'\'">'+ bdgName+'</span>'
		return output;
	}
});    
    