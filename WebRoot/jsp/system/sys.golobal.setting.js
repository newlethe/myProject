var bean='com.sgepit.frame.sysman.hbm.SysGolobal';
var business='baseMgm';
var listMethod='findwhereorderby';
var primaryKey="uids";
var orderColumn="operatedate";
var win;
var classWin;
Ext.onReady(function(){
   var formGrid=new Ext.FormPanel({
   		title:'属性详情',
   	    id:'formGrid',
  	    defaultType:'textfield',
   	    frame:true,
   	    labelAlign:'top',
      	buttonAlign:'center',
       	region: 'east',
	    border: false,
	    split: true,
	    width: 320,
	    minSize: 180,
	    collapsible: true,
	    animCollapse:false,
	    animate: false,
	    collapseMode:'mini',
       
       items:[{ fieldLabel:'名称',
       	        name:'pname',
       	        anchor:'98%',
       	        readOnly:true 
             },{
             	fieldLabel:'数值',
             	name:'pvalue',
             	xtype:'textarea',
             	anchor:"98%",
             	readOnly:true
             },{
             	fieldLabel:'类型',
             	name:'pclass',
             	xtype:'textarea',
             	anchor:'98%',
             	readOnly:true
             },{
             	fieldLabel:'修饰',
             	name:'pmodify',
             	anchor:'98%',
             	readOnly:true
             },{
                name:'filename',
                xtype:'hidden'
             },{
                name:'filetype',
                xtype:'hidden'
             },{
                name:'filepath',
                xtype:'hidden'
             },{
                name:'uids',
                xtype:'hidden'
             },{
                name:'uids',
                xtype:'hidden'
             },{
             	fieldLabel:'说明',
             	name:'descriptions',
             	anchor:'98%',
             	allowBlank:false,
             	height:160,
             	xtype:'textarea'
       }],
       buttons:[{
                  text:'保存',handler:function(){
                  	 if(formGrid.getForm().isValid()){
                  	 	var basicForm=formGrid.getForm();
                  	  var filename=basicForm.findField('filename').getValue();
                  	  var filepath=basicForm.findField('filepath').getValue();
                  	  var filetype=basicForm.findField('filetype').getValue();
                  	  var pname=basicForm.findField('pname').getValue();
                  	  var pvalue=basicForm.findField('pvalue').getValue();
                  	  var pclass=basicForm.findField('pclass').getValue();
                  	  var pmodify=basicForm.findField('pmodify').getValue();
                  	  var uids=basicForm.findField('uids').getValue();
                  	  var descriptions=basicForm.findField('descriptions').getValue();
                  	  var obj=new Object();
                  	  var uids=uids;
                  	  obj.pvalue=pvalue;
                  	  obj.pname=pname;
                  	  obj.pclass=pclass;
                  	  obj.pmodify=pmodify;
                  	  obj.filename=filename;
                  	  obj.filepath=filepath;
                  	  obj.filetype=filetype;
                  	  obj.types='1';
                  	  obj.operatedate=new Date();
                  	  obj.operateuser=REALNAME;
                  	  obj.descriptions=descriptions;
                  	  DWREngine.setAsync(false);
                  	  //systemMgm.saveSysGolobal(obj,function(rtn){
                  	  //})
                  	  var str="update sys_golobal set descriptions='"+descriptions+"' where uids='"+uids+"'";
                  	  baseDao.updateBySQL(str,function(rtn){
                  	  })
                  	  DWREngine.setAsync(true);
                  	  formGrid.getForm().reset();
                  	  editerGrid.getStore().reload();
                  	  for(var i=0;i<formGrid.buttons.length;i++){
                  	    formGrid.buttons[i].setDisabled(true);
                  	  }
                  	 }
                  
                  }
              },{
              	  text:'取消',handler:function(){
              	  	formGrid.getForm().findField('descriptions').setValue();
              	  }
       }],
       listeners:{
          beforerender : function(formGrid){
                 for(var i=0;i<formGrid.buttons.length;i++){
                    formGrid.buttons[i].setDisabled(true);
                 }
          } 
       }
   })
   
   
   var fc={
       'uids':{
          name:'uids',
          fieldLabel:'主键',
          anchor:'98%',
          readyOnly:true,
          hidden:true,
          hideLabel:true
       },'pname':{
          name:'pname',
          fieldLabel:'名称',
          anchor:'98%'
       },'pvalue':{
          name:'pvalue',
          fieldLabel:'数值',
          anchor:'98%'
       },'pclass':{
          name:'pclass',
          fieldLabel:'属性java类',
          anchor:'98%'
       },'pmodify':{
          name:'pmodify',
          fieldLabel:'属性修饰符',
          anchor:'98%'
       },'descriptions':{
          name:'descriptions',
          fieldLabel:'说明',
          anchor:'98%'
       },'filename':{
       	  name:'filename',
          fieldLabel:'文件名称',
          anchor:'98%'
       },'filetype':{
       	  name:'filetype',
       	  fieldLabel:'文件类别',
          anchor:'98%'
       },'operateuser':{
          name:'operateuser',
          fieldLabel:'操作人',
          anchor:'98%'
       },'operatedate':{
       	  name:'operatedate',
       	  fieldLabel:'操作时间',
       	  anchor:'98%'
       },'types':{
          name:'types',
          fieldLabel:'显示类型',
          anchor:'98%'
       },'filepath':{
          name:'filepath',
          fieldLabel:'文件全路径',
          anchor:'98%'
       }    
   }
   
   var Columns=[{
                 name:'uids',type:'string'
             },{
                 name:'pname',type:'string'
             },{
                 name:'pvalue',type:'string'
             },{
                 name:'pclass',type:'string'
             },{
                 name:'pmodify',type:'string'
             },{
                 name:'descriptions',type:'string'
             },{
                 name:'filename',type:'string'
             },{
                 name:'filetype',type:'string'
             },{
                 name:'operateuser',type:'string'
             },{
                 name:'operatedate',type:'date',dataFormat:'Y-m-d'
             },{
                 name:'types',type:'string'
             },{ 
                 name:'filepath',type:'string'
             }
      ]
   var Plant = Ext.data.Record.create(Columns);
   var PlantInt = {
    	uids: '',
    	pname: '', 
    	pvalue: '',
    	pclass: '',
    	pmodify: '',
    	descriptions:'',
    	filename: '',
    	filetype: '',
    	operateuser: '',
    	operatedate:'',
    	types: '',
    	filepath:''
   };
    
   var ds=new Ext.data.Store({
            baseParams:{
                 ac:'list',
                 bean:bean,
                 business:business,
                 method: listMethod,
                 params:'types=1'
            },
            proxy: new Ext.data.HttpProxy({
                  method: 'GET',
                  url: MAIN_SERVLET
            }),
            reader:new Ext.data.JsonReader({
                  root:'topics',
                  totalProperty:'totalCount',
                  id:primaryKey
                  },Columns),
            remoteSort:true,
            pruneModifiedRecords:true
       })
       ds.setDefaultSort(orderColumn, 'DESC');
      
   var sm= new Ext.grid.CheckboxSelectionModel({
       singleSelect:true,
       header:'',
       listeners:{
         rowselect:function(sm,rowIndex,r){
          formGrid.getForm().loadRecord(r);
           formGrid.buttons[0].setDisabled(false);
           formGrid.buttons[1].setDisabled(false);
           editerGrid.getTopToolbar().items.get("form").enable();
         },
         rowdeselect :function(sm,rowIndex,r){
          editerGrid.getTopToolbar().items.get("form").disable();
           formGrid.buttons[0].setDisabled(true);
           formGrid.buttons[1].setDisabled(true);
           formGrid.getForm().reset();
         }
       }
   })    
   var editerGrid=new Ext.grid.EditorGridTbarPanel({
   	   region:'center',
   	   width:550,
       id:'pro-grid-show',
       ds:ds,
       cm:new Ext.grid.ColumnModel([
          sm,
          {
             id:fc['uids'].name,
             header:fc['uids'].fieldLabel,
             dataIndex:fc['uids'].name,
             hidden:true
          },{
             id:fc['pname'].name,
             header:fc['pname'].fieldLabel,
             dataIndex:fc['pname'].name,
             width:80
          },{
             id:fc['pvalue'].name,
             header:fc['pvalue'].fieldLabel,
             dataIndex:fc['pvalue'].name,
             width:80
          },{
             id:fc['pclass'].name,
             header:fc['pclass'].fieldLabel,
             dataIndex:fc['pclass'].name,
             width:80
          },{
             id:fc['pmodify'].name,
             header:fc['pmodify'].fieldLabel,
             dataIndex:fc['pmodify'].name,
             width:80
          },{
             id:fc['descriptions'].name,
             header:fc['descriptions'].fieldLabel,
             dataIndex:fc['descriptions'].name,
             width:80,
             hidden:true
          },{
             id:fc['filename'].name,
             header:fc['filename'].fieldLabel,
             dataIndex:fc['filename'].name,
             width:80,
             hidden:true
          },{
             id:fc['filetype'].name,
             header:fc['filetype'].fieldLabel,
             dataIndex:fc['filetype'].name,
             width:80,
             hidden:true
          },{
             id:fc['operatedate'].name,
             header:fc['operatedate'].fieldLabel,
             dataIndex:fc['operatedate'].name,
             width:80,
             hidden:true
          },{
             id:fc['filepath'].name,
             header:fc['filepath'].fieldLabel,
             dataIndex:fc['filepath'].name,
             width:80,
             hidden:true
          }
       ]),
       sm:sm,
       tbar: [],
       title:'属性列表显示',
       iconCls: 'icon-by-category',
       border: false,
       header: true,
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
            pageSize: 20,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
       }),
       plant: Plant,
       plantInt: PlantInt,	
       servletUrl: MAIN_SERVLET,
       bean: bean,	
       business:business,
       primaryKey: primaryKey,
       saveBtn:false,
       /*formBtn:true,
       crudText : {form: '查看'},
       formHandler:function(){
       	var rec=editerGrid.getSelectionModel().getSelected();
        formGrid.getForm().loadRecord(rec);
       },*/
       insertHandler:function(){
                if(!win){
	                win=new Ext.Window({
	                   layout:'fit',
	                   autoScroll:true,
	                   closeAction:'hide',
	                   modal:true,
	                   title:'新增属性窗口',
	                   align:'center',
	                   width:650,
	                   height:400,
	                   items:[{
	                           xtype:'grid',
	                           id:'newgrid',
	                           layout:'fit',
	                           frame:true,
	                           buttonAlign:'center', 
	                           autoExpandMax:300,
	                           labelAlign:'center',
	                           frame:true,
	                           sm:new Ext.grid.CheckboxSelectionModel({
	                               listeners:{
	                                  selectionchange :function(sm){
	                                  	if(sm.hasSelection()) 
	                                       Ext.getCmp('newgrid').buttons[0].setDisabled(false);
	                                  },
	                                  rowdeselect : function(sm,rowIndex,rec){
	                                      Ext.getCmp('newgrid').buttons[0].setDisabled(true);
	                                  } 
	                               }
	                           }),
	                           ds:new Ext.data.SimpleStore({
	                              fields:['pname','pvalue']
	                           }),
	                           cm:new Ext.grid.ColumnModel([
	                                new Ext.grid.CheckboxSelectionModel(),
	                                {header:'名称',dataIndex:'pname',width:150},
	                                {header:'数值',dataIndex:'pvalue',width:350}
	                           ]),
	                           tbar:[{xtype:'combo',
	                                  id:'fileCombo',
	                                  mode:'local',
	                                  fieldLabel:'文件名称',
	                                  triggerAction:'all',
	                                  displayField:'filename',
	                                  valueField:'filepath',
	                                  lazyRender:true,
	                                  readyOnly:true,
	                                  editable:false, 
	                                  hiddenName:'filename',
	                                  listClass: 'x-combo-list-small',
	                                  store:new Ext.data.SimpleStore({
	                                     fields:['filename','filepath']
	                                  }),
	                                  listeners:{
	                                      beforerender:function(combo){
	                                      	var _store=combo.store;
	                                           DWREngine.setAsync(false);
	                                           baseDao.findByWhere2(bean," types='2' order by operatedate desc ",function(list){
	                                                 var Record = Ext.data.Record.create([
	                                                     {name:'filename'},
	                                                     {name:'filepath'},
	                                                     {name:'filetype'}
	                                                 ]);
	                                                 for(var i=0;i<list.length;i++){
	                                                     _store.add(new Record({filename:list[i].filename,filepath:list[i].filepath,filetype:list[i].filetype}))
	                                                 }
	                                           	    
	                                           }) 
	                                           DWREngine.setAsync(true);
	                                      },
	                                      select : function(combo,record,index){
	                                          var filepath= record.get('filepath');
	                                          var filename=record.get('filename');
	                                          var filetype=record.get('filetype');
	                                         var grid=Ext.getCmp('newgrid');
	                                           DWREngine.setAsync(false);
	                                           systemMgm.findPropertyOrClassByProperty(filepath,filename,filetype,function(list){
	                                               var Record=Ext.data.Record.create([
	                                                   {name:'pname'},
	                                                   {name:'pvalue'},
	                                                   {name:'filetype'},
	                                                   {name:'filename'},
	                                                   {name:'filepath'},
	                                                   {name:'pclass'},
	                                                   {name:'pmodify'}
	                                               ]);
	                                                grid.getStore().removeAll();
	                                               for(var i=0;i<list.length;i++){
	                                                   grid.getStore().add(new Record({
	                                                           pname:list[i].pname,
	                                                           pvalue:list[i].pvalue,
	                                                           filetype:list[i].filetype,
	                                                           filename:list[i].filename,
	                                                           filepath:list[i].filepath,
	                                                           pclass:list[i].pclass,
	                                                           pmodify:list[i].pmodify
	                                                   }))
	                                               }
	                                           })
	                                           DWREngine.setAsync(true);
	                                      } 
	                                  }
                           	       },{text:'新增类名称',
	                           	          iconCls:'add',
	                           	          handler:function(){
	                           	                 if(!classWin){
	                           	                    classWin=new Ext.Window({
	                           	                      layout:'fit',
	                           	                      autoScroll:true,
	                           	                      closeAction:'hide',
	                                                  modal:true,
	                                                  title:'新增',
	                                                  width:300,
	                                                  height:250,
	                                                  items:[{
	                                                          xtype:'form',
	                                                          id:'class-form',
	                                                          defaultType:'textfield',
	                                                          labelAlign:'top',
	                                                          defaults:{labelWidth:30},
	                                                          frame:true,
	                                                          items:[{
	                                                                   fieldLabel:'类名',
	                                                                   name:'filename',
	                                                                   allowBlank:false,
	                                                                   anchor:'98%',
	                                                                   invalidText:'类名称不能为空' 
	                                                                },{
	                                                                    fieldLabel:'路径',
	                                                                    name:'filepath',
	                                                                    anchor:'98%',
	                                                                    allowBlank:false,
	                                                                    invalidText:'类路径不能为空' 
	                                                                 },{
	                                                                    xtype:'combo',
	                                                                    mode:'local',
	                                                                    name:'filetype',
	                                                                    fieldLabel:'文件类型',
	                                                                    triggerAction:'all',
	                                                                    displayField:'v',
	                                                                    valueField:'k',
	                                                                    lazyRender:true,
	                                                                    allowBlank: false,
	                                                                    readyOnly:true,
	                                                                    editable:false, 
	                                                                    hiddenName:'filetype',
	                                                                    listClass: 'x-combo-list-small',
	                                                                    store:new Ext.data.SimpleStore({
	                                                                        data:[['1','java类'],['2','prop文件']],
	                                                                        fields:['k','v']
	                                                                    }),
	                                                                    anchor:'98%'
	                                                                 }
	                                                          ],
	                                                          buttons:[{
	                                                          	         text:'保存',
	                                                          	         handler:function(){
	                                                          	         	var baseForm=Ext.getCmp('class-form').getForm();
	                                                          	         	var filename=baseForm.findField('filename').getValue();
	                                                          	         	var filepath=baseForm.findField('filepath').getValue();
	                                                          	         	var filetype=baseForm.findField('filetype').getValue();
	                                                          	         	if(baseForm.isValid()){
	                                                          	         	    var obj=new Object();
	                                                          	         	    obj.filename=filename;
	                                                          	         	    obj.filepath=filepath;
	                                                          	         	    obj.filetype=filetype;
	                                                          	         	    obj.operateuser=REALNAME;
	                                                          	         	    DWREngine.setAsync(false);
	                                                          	         	    systemMgm.saveSysGolobal(obj,function(rtn){
	                                                          	         	          if(rtn=='ok'){
	                                                          	         	              var combo= Ext.getCmp('fileCombo');
	                                                          	         	              var searchCom=Ext.getCmp('searchCombo');
	                                                          	         	              var Record = Ext.data.Record.create([
	                                                                                          {name:'filename'},
	                                                                                          {name:'filepath'},
	                                                                                          {name:'filetype'}
	                                                                                      ]);
	                                                          	         	              combo.store.add(new Record({filename:filename,filepath:filepath,filetype:filetype}));
	                                                          	         	              searchCom.store.add(new Record({filename:filename,filepath:filepath,filetype:filetype}));
	                                                          	         	          }
	                                                          	         	    })
	                                                          	         	     DWREngine.setAsync(true);
	                                                          	         	     Ext.getCmp('class-form').getForm().reset(); 
	                                                          	         	     classWin.hide();
	                                                          	         	}else {
	                                                          	         	 
	                                                          	         	}
	                                                          	         }
	                                                                 },{
	                                                                     text:'取消',
	                                                                     handler:function(){
	                                                                     	Ext.getCmp('class-form').getForm().reset(); 
	                                                                     }
	                                                           }]
	                                                  }]
	                           	                    })
	                           	                 }
	                           	                 classWin.show();
	                           	          }}
	                            ],
	                            buttons:[{text:'保存',handler:function(){
	                                          var newgrid=Ext.getCmp('newgrid');
	                                          var rec=newgrid.getSelectionModel().getSelections();
	                                          if(rec=='undefined'){
	                                             Ext.Msg.Alert('提示信息','请选择一条数据');
	                                             return ;
	                                          }
	                                           for(var i=0;i<rec.length;i++){
	                                                var r=rec[i];
	                                                  var obj=new Object();
                  	                                  obj.pvalue=r.get('pvalue');
                  	                                  obj.pname=r.get('pname');
                  	                                  obj.pclass=r.get('pclass');
                  	                                  obj.pmodify=r.get('pmodify');
                  	                                  obj.filename=r.get('filename');
                  	                                  obj.filepath=r.get('filepath');
                  	                                  obj.filetype=r.get('filetype');
                  	                                  obj.types='1';
                  	                                  obj.operatedate=new Date();
                  	                                  obj.operateuser=REALNAME;
                  	                                  DWREngine.setAsync(false);
                  	                                  systemMgm.saveSysGolobal(obj,function(rtn){
                  	                                  }) 
                  	                                  DWREngine.setAsync(true);
	                                           }
	                                          win.hide();
	                                          ds.baseParams.params="types='1'";
	                                          ds.setDefaultSort(orderColumn, 'DESC');
	                                          ds.load({params:{start:0,limit:PAGE_SIZE}});
	                                  }}
	                            ],
	                            listeners:{
	                                beforerender:function(grid){
	                                   grid.buttons[0].setDisabled(true);
	                                }
	                                
	                            }
	                            
	                   }]
	                })
	                }
                win.show();
       }
   })
   
     new Ext.Viewport({
         layout:'border',
         border:false,
         items:[editerGrid,formGrid]
     })
      initOthers();
    
    function initOthers(){
    	var typeCombo = new Ext.form.ComboBox({
             id:'searchCombo',
             mode:'local',
             triggerAction:'all',
             editable:false,
             fieldLabel:'文件名',
             displayField:'filename',
             valueField:'filepath',
             lazyRender:true,
             hiddenName:'filename',
             listClass: 'x-combo-list-small',
             store:new Ext.data.SimpleStore({
                 fields:['filename','filepath']
             }),
             listeners:{
                   beforerender:function(combo){
	                   var _store=combo.store;
	                   DWREngine.setAsync(false);
	                   baseDao.findByWhere2(bean," types='2' order by operatedate desc ",function(list){
	                      var Record = Ext.data.Record.create([
	                          {name:'filename'},
	                          {name:'filepath'},
	                          {name:'filetype'}
	                      ]);
	                      for(var i=0;i<list.length;i++){
	                      	  if(i==0){
	                      	  	 combo.value=list[i].filepath;
								 var str="types='1' and filepath='"+list[i].filepath+"' and filetype='"+list[i].filetype+"'";
	                  			 ds.baseParams.params=str;
	                      	  } 
	                          _store.add(new Record({filename:list[i].filename,filepath:list[i].filepath,filetype:list[i].filetype}))
	                       }
	                    }) 
	                    DWREngine.setAsync(true);
                  },
                  select:function(combo,rec,index){
	                  var str="types='1' and filepath='"+rec.get('filepath')+"' and filetype='"+rec.get('filetype')+"'";
	                  ds.baseParams.params=str;
	                  ds.load({params:{start:0,limit:PAGE_SIZE}});
                  }
            }
               
       });
    	
    	
		editerGrid.getTopToolbar().add('&nbsp;&nbsp;&nbsp;&nbsp;名称关键字&nbsp;',{
	    	emptyText :'输入关键字，按回车查询',
	    	width:150,
	    	xtype:'textfield',
	     	listeners:{
	     		specialkey : function(textField, event ){
	     			if(event.getKey()==13){
	     				var filepath = typeCombo.getValue();
	     				var store = typeCombo.store;
	     				var p = store.find("filepath",filepath);
	     				if(p>-1){
	     					 var filetype = store.getAt(p).get("filetype");
	     					 var str="types='1' and filepath='"+filepath+"' and filetype='"+filetype+"' and " +
	     					 		"upper(pname) like '%"+textField.getValue().toUpperCase()+"%'";
	                 	 	 ds.baseParams.params=str;
	                         ds.load({params:{start: 0,limit: 20}});
	     				}
	     			}
	     		}
	     	}
		},'->', '类型&nbsp;&nbsp;',typeCombo,{
			text:'最大化',iconCls:'add',
			handler:function(){
				if(this.text=='最大化'){
					if(top&&top.collapsedWestAndNorth){
						top.collapsedWestAndNorth();
						this.setText('还原');
						this.setIconClass("remove")
					}
				}else{
					if(top&&top.expandWestAndNorth){
						top.expandWestAndNorth();
						this.setText('最大化');
						this.setIconClass("add")
					}
				}
			}
		});		
		ds.setDefaultSort(orderColumn, 'DESC');
	    ds.load({
	    	params:{
		    	start: 0,
		    	limit: 20
	    	}
	    });
    }
})