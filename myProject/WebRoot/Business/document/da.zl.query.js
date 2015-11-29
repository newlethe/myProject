
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
			fieldLabel : '单位名称',
			//allowBlank : false,
			anchor : '95%'
		},
		'lururen_q' : {
			name : 'lururen_q',
			fieldLabel : '录入人',
			//allowBlank : false,
			anchor : '95%'
		},
		'rq_q' : {
			id:'rq',
			name : 'rq_q',
			fieldLabel : '接收日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		}

	}

	// 3. 定义记录集
    var Columns = [
		{name: 'wjbh_q', type: 'string'},
		{name: 'wjcltm_q', type: 'string'},
		{name: 'weavecompany_q', type: 'string'},
		{name: 'rq_q', type: 'date'},
		{name: 'lururen_q', type: 'string'}
	];
var QueryzlPanel = new Ext.FormPanel({
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
		            new Ext.form.TextField(fc['wjbh_q']),
		            new Ext.form.TextField(fc['wjcltm_q']),
		            new Ext.form.TextField(fc['weavecompany_q']),
		            new Ext.form.TextField(fc['lururen_q']),
		            new Ext.form.DateField({
									id: 'stockdate'+'_begin',
									fieldLabel: '接收日期',
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
		
		var form = QueryzlPanel.getForm();
		
		//var treeData=form.findField('treeData').getValue();
		var wjbh = form.findField('wjbh_q').getValue();
        var wjcltm = form.findField('wjcltm_q').getValue();
        var weavecompany = form.findField('weavecompany_q').getValue();
        var lruren=form.findField('lururen_q').getValue();
        /////////////////得到分类树编码////////////////////////
		/*if(treeData.trim().length != 0){
	        DWREngine.setAsync(false); 
	         zlMgm.querySort(treeData,function(value){ 
        		sqlStr =sqlStr+value+" and (billstate=2 or billstate=3)";
	 		}); 
	        DWREngine.setAsync(true);   
	     }
      
        if(flag && USERORGID != ''){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " orgid='"+USERORGID+"'";
        }
        */
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
        	sqlStr += " weavecompany like '%"+weavecompany+"%'";
        }
        if(lruren.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " responpeople like '%"+lruren+"%'";
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
   				baseParams.params = sqlStr + queStr;
   				load({
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
