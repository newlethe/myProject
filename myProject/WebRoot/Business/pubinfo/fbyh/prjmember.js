var window_itemselector;
Ext.onReady(function(){

	var ds= new Ext.data.Store({
		id:'userid',
		reader:new Ext.data.JsonReader({root:'rows',totalProperty:'totalCount'},
			[{name:'userid',type:'string'},{name:'realname',type:'string'}])
	});
	
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    var isForm = new Ext.form.FormPanel({
        //title: '这是个测试',
    	width:700,
        items:[{
            xtype:"itemselector",
            name:"itemselector",
            //fieldLabel:"选择",
            hideLabel:true,
            width:300,
            height:300,
            dataFields:["userid", "realname"],
            toData:[[myuserid, myusername]],
            valueField:"userid",
            displayField:"realname",
            imagePath:"gantt/frame/project/resource/images/",
            toLegend:"已选栏",
            fromLegend:"可选栏",
            fromStore:ds,
            toTBar:[{
                text:"清除所有",
                handler:function(){
                    var i=isForm.getForm().findField("itemselector");
                    i.reset.call(i);
                }
            }]
        }]
    });
  
  var tree = new Ext.tree.TreePanel({
        animate : true,
        enableDD : true,
        containerScroll : true,
        rootVisible : true,
        region : 'west',
        width : 150,
        split : true,
        autoScroll : true,
        collapseMode : 'mini',
        border : false,
        // margins: '5 0 5 5',
        //异步数据加载
        loader: new Ext.tree.TreeLoader({
	        dataUrl: 'gantt/frame/project/itemselector/treeData.jsp'
	    }),
        root: new Ext.tree.AsyncTreeNode({
            text: defaultOrgRootName,
            id: defaultOrgRootID,
            expanded: true
        })
    });
    /////////////////当点击树，则显示http://www.cnblogs.com/meetrice/archive/2008/06/02/1212237.html
    tree.on('click', function(node) {
    	gantDwr.getUsername(node.id,function(a){
		    ds.loadData({
		                totalCount : a[0],
		                rows : eval(a[1])
		            })
    	});
    });
     var itlayout = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'fit',
        items : isForm
    });

    var tritlayout = new Ext.Panel({
        layout : 'border',
        border : true,
        items : [tree, itlayout]
    });
    
     var windowconfig = {
        title : '给指定用户发布信息',
        width : 600,
        height : 400,
        closeAction :'hide',
        autoScroll : true,
        //bodyStyle : 'background:white;padding:5px;',
        layout : 'fit',
        items : [tritlayout],
        tbar: ['->',{
            text: '发布信息',
            id:'saveBtn',
            cls:'x-btn-text-icon',
            icon:'jsp/res/images/icons/accept.png',
            handler: function(){
                if(isForm.getForm().isValid()){
                	//alert(pubinfoId+"==="+isForm.getForm().getValues(true))
                        infoDwr.insertInfoHisUser(pubinfoId,isForm.getForm().getValues(true),function(a){
                        	if(a==true){
                        		alert("保存成功")
                        		window_itemselector.hide()
                        	}else if(a==false){
                        		alert("保存失败")
                        	}
                        })
                }
            }
        },'-',' ',{text:'取消',cls:'x-btn-text-icon',icon:'jsp/res/images/icons/delete.png',handler:function(){window_itemselector.hide()}}]
    }
    window_itemselector = new Ext.Window(windowconfig);
   // window.show();   
  /*  
    if(projectid==""){
    	Ext.getCmp("saveBtn").disable();
    }*/
});