var datazy=new Array();
var databzdw=new Array();
var bjhdStr = new Array();
DWREngine.setAsync(false);
/**appMgm.getCodeValue('编制单位',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			databzdw.push(temp);			
		}
    });*/
    appMgm.getCodeValue('立卷单位',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			databzdw.push(temp);			
		}
    });
 appMgm.getCodeValue('专业',function(list){         //获取专业
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			datazy.push(temp);			
		}
    });
 appMgm.getCodeValue('脊背厚度',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			bjhdStr.push(temp);			
		  }
    });   
DWREngine.setAsync(true);
var bzdwStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : databzdw
    });
var zyStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : datazy
    });
    
var bjhdStore = new Ext.data.SimpleStore({
        fields :['k','v'],
        data : bjhdStr
    })    
var fc = { // 创建编辑域配置
		
		'wjbh_q' : {
			name : 'wjbh_q',
			fieldLabel : '档号',
			// allowBlank: false,
			anchor : '95%'
		},
		'bjhd':{
			name : 'bjhd',
			fieldLabel : '脊背厚度',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选脊背厚度...',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
             store: bjhdStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		
		},
		'wjcltm_q' : {
			name : 'wjcltm_q',
			fieldLabel : '案卷题名',
			//allowBlank : false,
			anchor : '95%'
		},
		'ljr_q' : {
			name : 'ljr_q',
			fieldLabel : '立卷人',
			anchor : '95%'
		},
		'weavecompany_q' : {
			name : 'weavecompany_q',
			fieldLabel : '立卷单位',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选立卷单位...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: bzdwStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
           // allowBlank: false,
			anchor : '95%'
		},
		'zy_q' : {
			name : 'zy_q',
			fieldLabel : '专业',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选择专业...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: datazy,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'jcjsh_q' : {
			name : 'jcjsh_q',
			fieldLabel : '卷册检索号',
			anchor : '95%'
		}

	}

	// 3. 定义记录集
    var Columns = [
		{name: 'wjbh_q', type: 'string'},
		{name: 'bjhd', type: 'string'},
		{name: 'wjcltm_q', type: 'string'},
		{name: 'ljr_q', type: 'string'},
		{name: 'weavecompany_q', type: 'string'},
		{name: 'zy_q', type: 'string'},
		{name: 'jcjsh_q', type: 'string'}
		
	];
var QueryDAPanel = new Ext.FormPanel({
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
    			    title: '档案查询',
            	    layout: 'form',
            	    border: true,
            	items: [
		            new Ext.form.TextField(fc['wjbh_q']),
		            new Ext.form.ComboBox(fc['bjhd']),
		            new Ext.form.TextField(fc['jcjsh_q']),
		            new Ext.form.TextField(fc['wjcltm_q']),
		            new Ext.form.TextField(fc['ljr_q']),
		            new Ext.form.ComboBox(fc['weavecompany_q']),
		            new Ext.form.ComboBox(fc['zy_q'])
						
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
		
		var form = QueryDAPanel.getForm();
		var wjbh = form.findField('wjbh_q').getValue();
		var bjhdK = form.findField('bjhd').getValue();
		var zy=form.findField('zy_q').getValue();
		var jcjsh=form.findField('jcjsh_q').getValue();
        var wjcltm = form.findField('wjcltm_q').getValue();
        var ljr= form.findField('ljr_q').getValue();
        var weavecompany = form.findField('weavecompany_q').getValue();
        /////////////////得到分类树编码////////////////////////
		/*if(treeData.trim().length != 0){
	        DWREngine.setAsync(false); 
	         zlMgm.querySort(treeData,function(value){ 
        		sqlStr +=value;
	 		}); 
	        DWREngine.setAsync(true);   
	     }
      */
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
        	sqlStr += " dh like '%"+wjbh+"%'";
        }
        if(jcjsh.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " jcjsh like '%"+jcjsh+"%'";
        	
        }
        if(wjcltm.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " mc like '%"+wjcltm+"%'";
        }
        
         if(ljr.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " ljr like '%"+ljr+"%'";
        }
        
        if(weavecompany.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " bzdw like '%"+weavecompany+"%'";
        }
        if(zy.trim().length != 0){
        	if(sqlStr.length > 0){
        		sqlStr += " and "
        	}
        	sqlStr += " zy like '%"+zy+"%'";
        }
        if (bjhdK.trim().length != 0) {
    	   if(sqlStr.length > 0){
    		   sqlStr += " and "
    	   }
			sqlStr += " bjhd like '%" + bjhdK + "%'";
	    }
        if (val){
	   		with (ds){
   				//baseParams.business = 'baseMgm';
   				//baseParams.start = 0;
   				//baseParams.limit = 15;
   				//baseParams.method = 'findwhereorderby';
   				baseParams.params = sqlStr;
   				load({
   					params:{
   						start:0,
   						limit:PAGE_SIZE
   					},
   					callback: function(){ formWin.hide(); }
   				});
	   		}
	   	}   
	}
	
	function formatDate(value){ 
		return value ? value.dateFormat('Y-m-d') : '';
	};
