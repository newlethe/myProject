var weavArr = new Array();
DWREngine.setAsync(false);
appMgm.getCodeValue('责任者',function(list){ 
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			weavArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
var weavStore = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data :  weavArr
		});
var weavCombo = new Ext.form.ComboBox({
				id:"weav",
				name : 'weavecompany_q',
				fieldLabel : '编制人/单位',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : weavStore,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
var fc = { // 创建编辑域配置
		
		'wjbh_q' : {
			name : 'wjbh_q',
			fieldLabel : '文件编号',
			// allowBlank: false,
			anchor : '95%'
		},
		'wjcltm_q' : {
			name : 'wjcltm_q',
			fieldLabel : '文件材料题名',
			//allowBlank : false,
			anchor : '95%'
		},
		'weavecompany_q' : {
			name : 'weavecompany_q',
			fieldLabel : '编制人/单位',
			//allowBlank : false,
			anchor : '95%'
		},
		'rq_q' : {
			id:'rq',
			name : 'rq_q',
			fieldLabel : '文件日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'treeData' : {
			name : 'treeData',
			fieldLabel : '资料分类名称',
			anchor : '95%'
		}

	}

	// 3. 定义记录集
    var Columns = [
		{name: 'wjbh_q', type: 'string'},
		{name: 'wjcltm_q', type: 'string'},
		{name: 'weavecompany_q', type: 'string'},
		{name: 'rq_q', type: 'date'},
		{name:'treeData',type:'String'}
	];
var QueryPanel = new Ext.FormPanel({
		id : 'form-panelef',
		header: false,
        border: false,
        width : 400,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 300,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
		labelAlign : 'top',
		// listeners: {beforeshow: handleActivate},
		bbar: ['->',{
				id: 'query',
		text: '查询',
				tooltip: '查询',
				iconCls: 'btn',
				handler: execQuery
			}],
		items : [
		 			new Ext.form.FieldSet({
    			    title: '资料查询',
            	    layout: 'form',
            	    border: true,
            	items: [
            	    new Ext.form.TextField(fc['treeData']),
		            new Ext.form.TextField(fc['wjbh_q']),
		            new Ext.form.TextField(fc['wjcltm_q']),
		            weavArr.length>0?weavCombo:new Ext.form.TextField(fc['weavecompany_q']),
		            new Ext.form.DateField({
									id: 'stockdate'+'_begin',
									fieldLabel: '文件日期',
									format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
								}),
					new Ext.form.DateField({
									id: 'stockdate'+'_end',
									hideLabel: true,
									format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
								})			
    				]
    			}		
    			)
				]
		
	});
	
	/*
	 * 查询主方法--
	 */
	function execQuery(){
		var val = true;
		var check=true;
		var queStr='';
		var sqlStr = '';
		
		var form = QueryPanel.getForm();
		
		var treeData=form.findField('treeData').getValue();
		var wjbh = form.findField('wjbh_q').getValue();
        var wjcltm = form.findField('wjcltm_q').getValue();
        var weavecompany = form.findField('weavecompany_q').getValue();
        /////////////////得到分类树编码////////////////////////
		if(treeData.trim().length != 0){
	        DWREngine.setAsync(false); 
	         zlMgm.querySort(treeData,function(value){ 
        		sqlStr =sqlStr+value+" and (billstate=1 or billstate=3 or billstate=2)";
	 		}); 
	        DWREngine.setAsync(true);   
	     }
      
        if(flag && USERORGID != ''){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " orgid='"+USERORGID+"'";

        }
        
        if(wjbh.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " fileno like '%"+wjbh+"%'";
        }
 
        if(wjcltm.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " materialname like '%"+wjcltm+"%'";
        }
        
        if(weavecompany.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	if(weavArr.length==0){
        		sqlStr += " weavecompany like '%"+weavecompany+"%'";
        	}else{
        		sqlStr += " weavecompany ='"+weavecompany+"'";
        	}
//        	sqlStr += " weavecompany like '%"+weavecompany+"%'";
        }
              
        var pb = form.findField('stockdate'+'_begin');
	   	var pe = form.findField('stockdate'+'_end');


   		if('' == pb.getValue() && '' != pe.getValue()){
   			if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
   			queStr +=sqlStr+'( stockdate' + ' <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD\'))';
   		}else if ('' != pb.getValue() && "" == pe.getValue()){
   			if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
	   		queStr +=sqlStr+'( stockdate' + ' >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\'))';
	   	} else if ('' != pb.getValue() && '' != pe.getValue()){
			if (pb.getValue() > pe.getValue()){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				if(sqlStr.length>0){
				  queStr+= " and "
				}
				queStr += '( stockdate'
						+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')' 
						+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD\'))'; 
				
			}
	    }
        if (val){
	   		with (ds){
//   				baseParams.business = 'baseMgm';
//   				baseParams.start = 0;
//   				baseParams.limit = 15;
//   				baseParams.method = 'findwhereorderby';
	   		    ds.baseParams.business = "baseMgm";
	            ds.baseParams.method  = "findwhereorderby";
	   			ds.baseParams.params = sqlStr + queStr+ "  and indexid in (select indexid from ZlTree) and (billstate='0' or billstate='1' or billstate='2' or billstate='3')";
   				ds.load({
   					params : {
						start : 0,
						limit : PAGE_SIZE
					},
   					
   					callback: function(){ formWin.hide(); }
   				});
	   		}
	   	}   
	}
	
	function formatDate(value)
		{ return value ? value.dateFormat('Y-m-d') : ''; };
