var beanPart = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubPart"
var businessPart = "baseMgm"
var listMethodPart = "findWhereOrderby"
var primaryKeyPart = "uids"
var orderColumnPart = "uids"

var partWin;

var treeArr = new Array();
var jzArr = new Array();
var equTypeArr = new Array();
var equBodysArr = new Array();
var chooseSystemArray = new Array();

var treeUidsArr = '';

Ext.onReady(function(){
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
	  //设备合同分类树
		var sql = "select uuid,treename from equ_type_tree ";
		baseDao.getData(sql,function(list){
			for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
					if(list[i][1]=="1"||list[i][1]=="2"||list[i][1]=="3"){
						for(var j=0;j<equTypeArr.length;j++){
							if(list[i][1] == equTypeArr[j][0])
								temp.push(equTypeArr[j][1]);
						}	
					}else{
						temp.push(list[i][1]);
					}
					
				treeArr.push(temp);			
			}
		});	
		
	   var equBodysSql = "select uids,equ_name from equ_goods_bodys where conid='"+edit_conid+"' order by equ_no asc";
	   baseDao.getData(equBodysSql,function(list){
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);			
					temp.push(list[i][1]);			
					equBodysArr.push(temp);			
				}
			});	     
			
		//设备所属系统类型
		appMgm.getCodeValue("所属系统(设备)",function(list){
			for(i = 0; i < list.length; i++) {
				if(list[i].propertyCode == "4")
					continue;
				var temp = new Array();
				temp.push(list[i].propertyName);	
				temp.push(list[i].propertyName);		
				chooseSystemArray.push(temp);			
			}
		});				
			
	 DWREngine.setAsync(true);
    var treeuidsDs = new Ext.data.SimpleStore({
	    	fields: ['k', 'v'],   
	        data: treeArr
    	});
    var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
    var jzDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: jzArr
    });
    var equBodysDs = new Ext.data.SimpleStore({
         fields : ['k','v'],
         data :equBodysArr
    })
    
    var havePart = [['0','正常'],['1','异常']];
	
	var havePartDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: havePart
    });
     	var storeSystem = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : chooseSystemArray
	});
	
    var  chooseSystem = new Ext.form.MultiSelect({
         id:   'belongSystem',
         width:  160,
         store : storeSystem,
         fieldLabel:'所属系统',
         readOnly : true,
         displayField:'v',
         separator : '、',
         valueField:'k',
         emptyText: '请选择.....',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	r.set(this.checkField, !r.get(this.checkField))
         	 chooseSystem.setValue(this.getCheckedValue());
               chooseSystem.setValue(this.getCheckedValue());
		}
  })        
    
    
    if(edit_treeUids != ''){
      DWREngine.setAsync(false);
      var treeSql = "select uuid from equ_type_tree start with  treeid = (select treeid from equ_type_tree where uuid='"+edit_treeUids+"') connect by prior treeid=parentid and treeid <>'04'";
      baseDao.getData(treeSql,function(list){
      	if(list.length>0){
      		treeUidsArr="("
      		for(var i=0;i<list.length;i++){
	      		if(list.length==1){
	      	         treeUidsArr +="'"+list[i]+"'";
	      	         break;
	      		}else{
	      		    if(i>=0 && i<list.length-1){
	      		        treeUidsArr +="'"+list[i]+"',";
	      		    }else{
	      		        treeUidsArr +="'"+list[i]+"'";
	      		    }
	      		}
      		}
      		treeUidsArr +=")"
      	 }
      	 treeUidsArr ="equ_bodys='"+edit_partUids+"'";//and  treeuids in "+treeUidsArr 
      })
      DWREngine.setAsync(true);
    }
	var fcPart = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxSubId' : {name : 'openboxSubId',fieldLabel : '到货单部件主键',allowBlank: true},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '合同分类树',
			mode : 'local',
			editable:false,
			valueField: 'k',
			displayField: 'v',
			readOnly:true,
            listWidth: 180,
            lazyRender:true,
            maxHeight: 180,
            triggerAction: 'all',
            store: treeuidsDs,
			tpl: "<tpl for='.'><div style='height:200px'><div id='treePart'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'	
		},
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
		'equBodys' : {
		    name : 'equBodys',
		    fieldLabel : '对应主体设备',
		    readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: equBodysDs
		} ,
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: jzDs
		},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）'},
		'userPosition' : {name : 'userPosition' ,fieldLabel :'使用部位'},
		'belongSystem' : {name : 'belongSystem' ,fieldLabel : '所属系统'},
		'openCondition' : {
		        name : 'openCondition',
		        fieldLabel : '开箱情况',
				readOnly: true,
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	           	triggerAction: 'all', 
	           	store: havePartDs
	           	},
		'defectDescription' : {name : 'defectDescription',fieldLabel : '缺陷描述'}
	};
	
	var partComboTree = new fm.ComboBox(fcPart['treeuids']);
	partComboTree.on('beforequery', function(){
		newtreePanelPart.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid = node.attributes.conid;
		if(conid == null || treeid == null){
			conid = edit_conid;
			DWREngine.setAsync(false);
		    var treeSqls = "select parentid from equ_type_tree where  treeid = " +
		    		"(select treeid from equ_type_tree where uuid='"+edit_treeUids+"' " +
		    				"and conid='"+conid+"') and conid='"+conid+"'";
		    baseDao.getData(treeSqls,function(str){
		    	if(str!=''){
		    	  treeid = str;
		    	}else{
		    	  treeid ='root';
		    	}
		    })
		}
		newtreePanelPart.loader.baseParams.parent = treeid+SPLITB+"04";
		newtreePanelPart.loader.baseParams.conid = conid;
		});
		newtreePanelPart.expand();
		newtreePanelPart.render('treePart');
		newtreePanelPart.getRootNode().reload();
	});
	newtreePanelPart.on('click',function(node){
	    var elNode = node.getUI().elNode;
	    var parentid = elNode.all("parentid").innerText;
	    if(parentid == 0){
	       Ext.example.msg('提示信息','请选择该目录下的子节点！');
	       return;
	    }
	    var treeid = elNode.all("uuid").innerText;
	    var treeName = node.text;
	    partComboTree.setValue(treeid);
	    partComboTree.setRawValue(treeName);
	    partComboTree.collapse();
	   
	});

	var smPart = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmPart = new Ext.grid.ColumnModel([
		smPart,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcPart['uids'].fieldLabel,
			dataIndex : fcPart['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcPart['pid'].fieldLabel,
			dataIndex : fcPart['pid'].name,
			hidden : true
		},{
			id : 'openboxSubId',
			header : fcPart['openboxSubId'].fieldLabel,
			dataIndex : fcPart['openboxSubId'].name,
			hidden : true
		},{
			id : 'openboxId',
			header : fcPart['openboxId'].fieldLabel,
			dataIndex : fcPart['openboxId'].name,
			hidden : true
		},{
			id : 'openboxNo',
			header : fcPart['openboxNo'].fieldLabel,
			dataIndex : fcPart['openboxNo'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fcPart['treeuids'].fieldLabel,
			dataIndex : fcPart['treeuids'].name,
			renderer : function(v,m,r){
				var tree = "";
				for(var i=0;i<treeArr.length;i++){
					if(v == treeArr[i][0]){
						tree = treeArr[i][1];
						break;
					}
				}
				for(var i=0;i<equTypeArr.length;i++){
					if(tree == equTypeArr[i][0]){
						tree = equTypeArr[i][1];
						break;
					}
				}
				return tree;
			},
			editor : partComboTree,
			align : 'center',
			width : 180
		},{
			id : 'equType',
			header : fcPart['equType'].fieldLabel,
			dataIndex : fcPart['equType'].name,
			editor : new fm.ComboBox(fcPart['equType']),
			renderer : function(v){
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
			id : 'equBodys',
			header : fcPart['equBodys'].fieldLabel,
			dataIndex : fcPart['equBodys'].name,
			width : 200,
			editor : new fm.ComboBox(fcPart['equBodys']),
			renderer : function(v){
		          for(var i=0;i<equBodysArr.length;i++){
		              if(v == equBodysArr[i][0])
		              	return equBodysArr[i][1];
		          }
			}		
		
		},{
			id : 'jzNo',
			header : fcPart['jzNo'].fieldLabel,
			dataIndex : fcPart['jzNo'].name,
			editor : new fm.ComboBox(fcPart['jzNo']),
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			width : 80
		},{
			id : 'boxNo',
			header : fcPart['boxNo'].fieldLabel,
			dataIndex : fcPart['boxNo'].name,
			editor : new fm.TextField(fcPart['boxNo']),
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fcPart['equPartName'].fieldLabel,
			dataIndex : fcPart['equPartName'].name,
			editor : new fm.TextField(fcPart['equPartName']),
			width : 180
		},{
			id : 'belongSystem',
			header : fcPart['belongSystem'].fieldLabel,
			dataIndex : fcPart['belongSystem'].name,
			editor : chooseSystem,
			width : 180
		},{
			id : 'userPosition',
			header : fcPart['userPosition'].fieldLabel,
			dataIndex : fcPart['userPosition'].name,
			editor : new fm.TextField(fcPart['userPosition']),
			width : 180
		},{
			id : 'ggxh',
			header : fcPart['ggxh'].fieldLabel,
			dataIndex : fcPart['ggxh'].name,
			editor : new fm.TextField(fcPart['ggxh']),
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcPart['graphNo'].fieldLabel,
			dataIndex : fcPart['graphNo'].name,
			editor : new fm.TextField(fcPart['graohNo']),
			align : 'center',
//            hidden : true,
			width : 100
		},{
			id : 'unit',
			header : fcPart['unit'].fieldLabel,
			dataIndex : fcPart['unit'].name,
			editor : new fm.TextField(fcPart['unit']),
			align : 'center',
			width : 60
		},{
			id : 'boxinNum',
			header : fcPart['boxinNum'].fieldLabel,
			dataIndex : fcPart['boxinNum'].name,
			editor : new fm.NumberField(fcPart['boxinNum']),
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcPart['weight'].fieldLabel,
			dataIndex : fcPart['weight'].name,
			editor : new fm.NumberField(fcPart['weight']),
			align : 'center',
			width : 80
		},{
			id : 'openCondition',
			header : fcPart['openCondition'].fieldLabel,
			dataIndex : fcPart['openCondition'].name,
			editor : new fm.ComboBox(fcPart['openCondition']),
			renderer : function(v){
			  for(var i=0;i<havePart.length;i++){
			      if(v==havePart[i][0]){
			        return havePart[i][1];
			      }
			  }
			},
			align : 'center',
			width : 80
		},{
			id : 'defectDescription',
			header : fcPart['defectDescription'].fieldLabel,
			dataIndex : fcPart['defectDescription'].name,
			editor : new fm.TextField(fcPart['defectDescription']),
			align : 'center',
			width : 80
		}
	]);
	var ColumnsPart = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'openboxSubId', type:'string'},
		{name:'openboxId', type:'string'},
		{name:'openboxNo', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'equType', type:'string'},
		{name:'equBodys',type: 'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'boxinNum', type:'float'},
		{name:'weight', type:'float'},
		{name: 'userPosition',type: 'string'},
		{name: 'belongSystem',type: 'string'},
		{name: 'openCondition',type: 'string'},
		{name: 'defectDescription',type: 'string'}
	];
	var PlantPart = Ext.data.Record.create(ColumnsPart);
    var PlantIntPart = {
		uids : '',
		pid : CURRENTAPPID,
		openboxSubId : '',
		openboxId : '',
		openboxNo : '',
		treeuids : '',
		equType : '',
		equBodys : '',
		jzNo : '',
		boxNo : '',
		equPartName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		boxinNum : 0,
		weight : '',
		userPosition : '',
		belongSystem : '',
		openCondition : '',
		defectDescription : ''
	}
	
	var dsPart = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanPart,
	    	business: businessPart,
	    	method: listMethodPart,
	    	params: treeUidsArr
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyPart
        }, ColumnsPart),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    
    dsPart.setDefaultSort(orderColumnPart, 'desc');	//设置默认排序列
    cmPart.defaultSortable = true;
    var partBoxName = new Ext.Button({
    	id : 'partBoxName',
    	text : ''
    });
    var copyBtn = new Ext.Button({
        text : '复制',
        iconCls : 'copy',
        handler : copyFun
    });
    var pasteBtn = new Ext.Button({
        text: '粘贴',
        iconCls: 'paste',
        disabled : true,
        handler : pasteFun
    });
    var backBtn = new Ext.Button({
    	text: '返回',
        iconCls: 'btn',
        handler : function(){
             history.back();
        }
    })
    
        var excelInput= new Ext.Button({
		id : 'Excel',
		text : 'excel导入',
		tooltip : 'excel导入',
		iconCls : 'upload',
		pressed:true,
		handler : showExcelWin
		
	});
	var downloadBtn = new Ext.Toolbar.Button({
			id : 'download',
			text : '模板下载',
			icon : CONTEXT_PATH
					+ "/jsp/res/images/file-download.gif",
			cls : "x-btn-text-icon",
			handler : onItemClick
		});
    
    function copyFun(){
        var records = smPart.getSelections();
        if(records.length == 0){
            Ext.example.msg('提示信息','请先选择需要复制的部件明细！');
            return;
        }else{
            partDataArr = new Array();
	        for (var i = 0; i < records.length; i++) {
	            partDataArr.push(records[i].data);
	        }
            copyBtn.setText("复制("+partDataArr.length+")");
	        pasteBtn.setDisabled(false);
            //Ext.example.msg('提示信息','复制成功，已经复制'+partDataArr.length+'条部件明细！');
        }
    }
    function pasteFun(){
        if(partDataArr.length == 0){
            return ;
        }
        DWREngine.setAsync(false);
        equMgm.pasteEquOpenboxPart(partDataArr,function(str){
           if(str == "1"){
                Ext.example.msg('提示信息','部件明细粘贴成功！');
                dsPart.reload();
            }else if(str == "0"){
                Ext.example.msg('提示信息','部件明细粘贴失败！');
            }
        });
        DWREngine.setAsync(true);
    }	
	var gridPanelPart = new Ext.grid.EditorGridTbarPanel({
		ds : dsPart,
		cm : cmPart,
		sm : smPart,
		title : '部件明细',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>部件明细<B></font>','-','主体设备名称：','<font color=#15428b><B>【'+edit_equName+'】<B></font>'],//,'-',copyBtn,'-',pasteBtn,'-',downloadBtn,'-',excelInput,'-'
		header: false,
		height : document.body.clientHeight*0.5,
		enableHdMenu : false,
	    border: false,
	    //layout: 'fit',
	    addBtn : false, // 是否显示新增按钮
		saveBtn : false, // 是否显示保存按钮
		delBtn : false, // 是否显示删除按钮
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsPart,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantPart,
		plantInt : PlantIntPart,
		servletUrl : MAIN_SERVLET,
		bean : beanPart,
		business : businessPart,
		primaryKey : primaryKeyPart
	});

 	var viewPrt = new Ext.Viewport({
 	     layout : 'fit',
 	     items :[gridPanelPart]
 	})
 	var gridTopBar = gridPanelPart.getTopToolbar()
	with (gridTopBar) {
		add('->',backBtn);
	}
 	dsPart.load();
 	
 ///////////////execel 导入功能 //////////////////////////////////////////////////////////////////////
    function showExcelWin(){
		   fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:30,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 390,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
		fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:460,
				height:100,
				items:[fileForm]
			})
		fileWin.show()
	}
	
	
	 	function doExcelUpLoad(){
		var win = this.ownerCt.ownerCt;
		var file = this.ownerCt.getForm().findField("excelfile").getValue();
		var selectConid1 = edit_conid;
		var uids = edit_partUids;
 		var openboxId = edit_partUids;
		this.ownerCt.getForm().submit({
			waitTitle : '请稍候...',
			waitMsg : '数据上传中...',
			url : CONTEXT_PATH + "/servlet/equExcelServlet?ac=equImportExcelData&pid="
			    + CURRENTAPPID+"&subUids="+uids+"&mainUids="+openboxId+"&selectConnid="+selectConid1+"&equOrWz=equExcel",
			method:'POST',
			params:{
					 ac:'equImportExcelData'
			},
			success : function(form, action) {
				Ext.Msg.alert('恭喜', action.result.msg, function(v) {
							win.close();
							refreshds(uids);
						})
			},
			failure : function(form, action) {
				Ext.Msg.alert('提示', action.result.msg, function(v) {
							win.close();
							refreshds(uids);
						})
			}
		})

		dsPart.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}   
 	function refreshds(uids) {
		dsPart.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						params : "openboxSubIs='" + uids+"'"
					}
				});
	}  
	function onItemClick(){
			var sql = "select fileid from APP_FILEINFO where fileid =(select t.fileid " +
					"from APP_TEMPLATE t where  t.templatecode='equPartExcelInport' and t.filename like '设备(材料)部件excel导入%')"
		    DWREngine.setAsync(false);
			baseDao.getData(sql,function(list){
			   if(list.length>0){	
			   	     window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+list)
			   }else{
			   	   Ext.Msg.alert('信息提示',"Excel导入模板不存在，请与管理员联系");
			   	   return ;
//			       Ext.Msg.confirm('信息提示',"Excel导入模板不存在，是否上传",function(btn){
//			            if(btn=='yes'){
//			                 uploadTemplate(true);
//			            }else{
//			               return;
//			            }
//			       })
			   }
			})
			 DWREngine.setAsync(false);
	}	
})


function uploadTemplate(flag) {
	var uploadForm = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 80,
		url : MAIN_SERVLET + "?ac=upload",
		fileUpload : true,
		defaultType : 'textfield',

		items : [{
			xtype : 'textfield',
			fieldLabel : '流水号',
			name : 'fileid1',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '90%' // anchor width by percentage
		}, {
			xtype : 'textfield',
			fieldLabel : '请选择文件',
			name : 'filename1',
			inputType : 'file',
			allowBlank : false,
			// blankText: 'File can\'t not empty.',
			anchor : '90%' // anchor width by percentage
		}]
	});

	var uploadWin = new Ext.Window({
		title : '上传',
		width : 450,
		height : 140,
		minWidth : 300,
		minHeight : 100,
		layout : 'fit',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : uploadForm,
		buttons : [{
			text : '上传',
			handler : function() {
				var filename = uploadForm.form.findField("filename1").getValue()
				if (filename != "") {
					var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
					var fileExt1 = filename.substring(filename.lastIndexOf("\\") + 1,filename.lastIndexOf(".")).toLowerCase();
                    if(fileExt1 != "设备(材料)部件excel导入"){
                        Ext.MessageBox.alert("提示", "请修改上传的Excel文档名称为【<span style='color:red;'>设备(材料)excel导入."+fileExt+"</span>】！");
						return;                   
                    }
					if (allowedDocTypes.indexOf(fileExt) == -1) {
						Ext.MessageBox.alert("提示", "请选择Excel文档！");
						return;
					} else {
						currentFileExt = fileExt
					}
				}
				if (uploadForm.form.isValid()) {
					Ext.MessageBox.show({
						title : '请等待',
						msg : '上传中...',
						progressText : '',
						width : 300,
						progress : true,
						closable : false,
						animEl : 'loading'
					});
					uploadForm.getForm().submit({
						method : 'POST',
						params : {
							ac : 'upload'
						},
						success : function(form, action) {
							tip = Ext.QuickTips.getQuickTip();
							tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;上传成功!','icon-success')
							tip.show();
							Ext.MessageBox.hide();
							uploadWin.hide();
							var rtn = action.result.msg;
							var fileid = rtn[0].fileid;
							var filename = rtn[0].filename;
//							//保存上传后的文档fileid
//                            DWREngine.setAsync(false);
//                            equMgm.saveFile(fileid,uids,bean,function(str){
//                            });
//                            DWREngine.setAsync(true);
							 Ext.example.msg('信息提示','模板上传成功！')
						},
						failure : function() {
							Ext.example.msg('Error', 'File upload failure.');
						}
					})
				}
			}
		}, {
			text : '关闭',
			handler : function() {
				uploadWin.hide();
			}
		}]
	});

	uploadWin.show();
}