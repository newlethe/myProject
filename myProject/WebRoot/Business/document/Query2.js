
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
		'company' : {
			name : 'company',
			fieldLabel : '责任者',
			//allowBlank : false,
			anchor : '95%'
		}
	}

	// 3. 定义记录集
    var Columns = [
		{name: 'wjbh_q', type: 'string'},
		{name: 'wjcltm_q', type: 'string'},
		{name: 'company', type: 'string'}
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
            	   // new Ext.form.TextField(fc['treeData']),
		            new Ext.form.TextField(fc['wjbh_q']),
		            new Ext.form.TextField(fc['wjcltm_q']),
		            new Ext.form.TextField(fc['company'])
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
		
		
		var wjbh = form.findField('wjbh_q').getValue();
        var wjcltm = form.findField('wjcltm_q').getValue();
        var company = form.findField('company').getValue();
        if(currentPid != null){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " pid= '"+currentPid+"'";
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
        if(company.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " weavecompany like '%"+company+"%'";
        }
        
        if (val){
	   		with (ds_zlinfo){
  				baseParams.business = 'zlMgm';
  				baseParams.start = 0;
  				baseParams.limit = 15;
  				baseParams.method = 'findwherezlQuery';
   				baseParams.params = sqlStr+'#';
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
