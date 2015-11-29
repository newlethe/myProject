// 全局变量
var beanMat = "com.hdkj.webpmis.domain.material.MatFrame"; 
var beanPartyb = "com.sgepit.pmis.contract.hbm.ConPartyb"
var data = new Array();
var dataSub = new Array();


Ext.onReady(function (){
	
	DWREngine.setAsync(false);  
	data = [];
    matCompletionMgmImpl.getPartyb(acmid, bdgid, function(list){
		for (var i=0; i<list.length; i++){
			var obj = new Array();
    		obj.push((list[i].PARTYB));
    		obj.push((list[i].TOTAL));
    		data.push(obj);
		}
	})
	DWREngine.setAsync(true);  	
	//----------------------------------------------主表grid----------------------------------------
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true })
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		            // 创建编辑域配置
    	 'partyb': {
			name: 'partyb',
			fieldLabel: '乙方单位名称',
			anchor:'95%'
         }, 'total': {
			name: 'total',
			fieldLabel: '合计金额',
			anchor:'95%'
         }
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'partyb',
           header: fc['partyb'].fieldLabel,
           renderer: getPartyb,
           dataIndex: fc['partyb'].name
        },{
           id:'total',
           header: fc['total'].fieldLabel,
           renderer: cnMoney,
           //align: 'right',
           dataIndex: fc['total'].name
        }
    ]);
    cm.defaultSortable = true;						

    // 3. 定义记录集
    var Columns = [
    	{name: 'partyb', type: 'string'},
    	{name: 'total', type: 'string'}
		];
      
    // 创建数据源
	var ds = new Ext.data.SimpleStore({
        fields: Columns, 
        data: data
    });

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.GridPanel({
    	id: 'dd-grid-panel',			
        ds: ds,						
        cm: cm,						
        sm: sm,						
        tbar: [{text:'<font color=#15428b><b>材料投资完成详情</b></font>'},'->',btnReturn],					
        height: 200,				
        iconCls: 'icon-show-all',	
        border: false,				
        region: 'center',
        clicksToEdit: 2,			
        header: false,				
        autoScroll: true,			
        collapsible: false,			
        animCollapse: false,		
        autoExpandColumn: 2,		
        loadMask: true,
        viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
   });
    // 12. 加载数据
  
   
	//=======================================end========================================================
	//**************************************************************************************************
    //--------------------------------从表grid----------------------------------------------------------
    var smSub =  new Ext.grid.CheckboxSelectionModel()
    var fmSub = Ext.form;			// 包名简写（缩写）
    var fcSub = {		// 创建编辑域配置
    	 'matid': {
			name: 'matid',
			fieldLabel: '材料名称',
			anchor:'95%'
         },'spec': {
			name: 'spec',
			fieldLabel: '规格',
			anchor:'95%'
         },'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
         },'money': {
			name: 'money',
			fieldLabel: '金额',
			anchor:'95%'
         }
    }
    
    // 3. 定义记录集
    var ColumnsSub = [
    	{name: 'matid', type: 'string'},
		{name: 'money', type: 'float'}
		];
    
    
    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	smSub,{
           id:'matid',
           header: fcSub['matid'].fieldLabel,
           renderer: getMatname,
           dataIndex: fcSub['matid'].name
        },{
           id:'spec',
           header: fcSub['spec'].fieldLabel,
           renderer: getSpec,
           dataIndex: fcSub['spec'].name
        },{
           id:'unit',
           header: fcSub['unit'].fieldLabel,
           renderer: getUnit,
           dataIndex: fcSub['unit'].name
        },{
           id:'money',
           header: fcSub['money'].fieldLabel,
           renderer:cnMoney,
           align: 'right',
           dataIndex: fcSub['money'].name
        }
    ]);
    cmSub.defaultSortable = true;						//设置是否可排序
   	
   
     // 创建数据源
	var dsSub = new Ext.data.SimpleStore({
        fields: ColumnsSub 
        //data: data
    });
    
    // 5. 创建可编辑的grid: grid-panel
    gridSub = new Ext.grid.GridPanel({
        // basic properties
    	id: 'sub-grid-panel',			//id,可选
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar : [{text:'<font color=#15428b><b>所有材料</b></font>'}],					//顶部工具栏，可选
        width : 800,				//宽
        height: 300,				//高
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'south',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        split: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
   });
   // =======================================end========================================================
	
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [grid,gridSub],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [grid,gridSub]
        });
    }
    


    // 11. 事件绑定
	sm.on('rowselect', function(){ // grid 行选择事件
		var record = sm.getSelected();
		var partyb = record.get('partyb');
		dataSub=[];
	    matCompletionMgmImpl.getMat(acmid, bdgid, partyb, function(list){
			for (var i=0; i<list.length; i++){
				var obj = new Array();
	    		obj.push((list[i].MATID));
	    		obj.push((list[i].MONEY));
	    		dataSub.push(obj);
			}
			dsSub.loadData(dataSub);
		})
		DWREngine.setAsync(true);
    });
    
   function getPartyb(value){
		var partyb;
		DWREngine.setAsync(false);
		baseMgm.findById(beanPartyb,value, function(obj){
			partyb =  obj.partyb;
		})
		DWREngine.setAsync(true);
		return partyb;
	}
    
	function getMatname(value){
		var catName;
		DWREngine.setAsync(false);
		baseMgm.findById(beanMat,value, function(obj){
			catName =  obj.catName;
		})
		DWREngine.setAsync(true);
		return catName;
	}
    
	function getUnit(value, cellmeta,record){
		var  unit;
		var matid = record.get('matid');
		DWREngine.setAsync(false);
		baseMgm.findById(beanMat,matid, function(obj){
			unit =  obj.unit;
		})
		DWREngine.setAsync(true);
		return unit;
	}
    
	function getSpec(value, cellmeta,record){
		var  spec;
		var matid = record.get('matid');
		DWREngine.setAsync(false);
		baseMgm.findById(beanMat,matid, function(obj){
			spec =  obj.spec;
		})
		DWREngine.setAsync(true);
		return spec;
	}	
  
});




