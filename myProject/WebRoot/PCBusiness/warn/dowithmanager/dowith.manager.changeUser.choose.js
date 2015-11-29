var ctreePanel, croot, cgrid;
var cuserWindow;
var selectPid;
var warninfoId;
var parnetUnitId;
croot = new Ext.tree.AsyncTreeNode({
   text: "",
   id: '-1',
   expanded: true
});

var loader =new Ext.tree.TreeLoader({
	            dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
		        requestMethod: "GET",
		        baseParams:{
			       ac:"buildingUnitTree",
			       baseWhere:"1=1"
				}
	})
ctreePanel = new Ext.tree.TreePanel({
    region:'west',
    split:true,
    width: 196,
    minSize: 175,
    maxSize: 500,
    frame: false,
    layout: 'accordion',
    margins:'5 0 5 5',
    cmargins:'0 0 0 0',
    rootVisible: true,
    lines:true,
    autoScroll:true,
    collapsible: true,
    animCollapse:false,
    animate: true,
    collapseMode:'mini',
    tbar: [{
        iconCls: 'icon-expand-all',
		tooltip: '全部展开',
        handler: function(){ croot.expand(true); }
    }, '-', {
        iconCls: 'icon-collapse-all',
        tooltip: '全部折叠',
        handler: function(){ croot.collapse(true); }
    }],    
    loader: loader,
    root: croot,
    collapseFirst:false,
    listeners : {
        beforeload : function (node){
        	if(node.id=="-1") return false;
            loader.baseParams.parentId = node.id;
        },
        click : function (n,e){
        	if(n.attributes.unitTypeId=='8'){
        	cds.baseParams.params = "deptId`"+n.id+";warninfoId`"+warninfoId;
        	}else {
            cds.baseParams.params = "unitid`"+n.id+";warninfoId`"+warninfoId;
        	}
            cdsReload();
        }
    }
});
 var doWithColumn = new Ext.grid.CheckColumn({
       header: "处理权限",
       dataIndex: 'dowithtype',
       width: .2,
       renderer:function(v, p, record){
        if(v==="2"){
         return '&#160;';
        }else{
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
        }
       }
    });
    var checkColumn = new Ext.grid.CheckColumn({
       header: "查询权限",
       dataIndex: 'searchtype',
       width: .2,
       renderer:function(v, p, record){
        if(v==="2"){
         return '&#160;';
        }else{
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
        }
       }
    });

var csm = new Ext.grid.CheckboxSelectionModel({});
var ccm = new Ext.grid.ColumnModel([
	 {
		id: 'userid',
		header: '主键',
		dataIndex: 'userid',
		hidden: true
	},{
		id: 'username',
		header: '用户名',
		dataIndex: 'username',
		width: .3
	},{
		id: 'realname',
		header: '用户姓名',
		dataIndex: 'realname',
		width: .3
	},{
		id: 'sex',
		header: '性别',
		dataIndex: 'sex',
		width: .2,
		renderer: function(value){
       	  if (value!="")
       	  	return value=='0' ? "<img src='jsp/res/images/shared/icons/user_suit.gif'>" 
       	  					: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
       	  	//return value=='0' ? '男':'女';
       	  else
       	  	return value;
       }
	},
	doWithColumn,
	checkColumn
]);
ccm.defaultSortable = true;

var cColumns = [
	{name: 'userid', type: 'string'},
	{name: 'username', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'sex', type: 'string'},
	{name : 'dowithperson', type: 'string'},
	{name : 'searchperson', type: 'string'},
	{name : 'dowithtype', type :'string'},
	{name : 'searchtype',type:'string'}
];

var cds = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		business: 'PcWarnService',
		method: 'getUserlistBySql'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'userid'
	}, cColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
cds.setDefaultSort('userid', 'desc');

var cgridTitleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;用户列表,请选择用户</b></font>',
	iconCls: 'form'
})

var cgetUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		var records = cgrid.getStore().getModifiedRecords();
		if (records.length > 0){
		    var dowithperson = "";
		    var searchperson = "";
		    for(var i=0;i<records.length;i++){
		        var rec = records[i];
		         if(rec.get('dowithtype')==true){
		             dowithperson+=rec.get('userid')+",true";
		         }else if(rec.get('dowithtype')==false){
		             dowithperson+=rec.get('userid')+",false";
		         }
		         if(rec.get('searchtype')==true||rec.get('dowithtype')==true){
		             searchperson+=rec.get('userid')+",true";
		         }else {
		             searchperson+=rec.get('userid')+",false";
		         }
		         if(i<records.length-1){
		         	if(rec.get('dowithtype')==true||rec.get('dowithtype')==false){
		             dowithperson+=";";
		         	}
		         	if(rec.get('searchtype')==true||rec.get('searchtype')==false)
		             searchperson+=";";
		         }
		    }
		    var guideComments = commentsPanel.getForm().findField('guidecomments').getValue();
		    var obj = new Object();
		    obj.dowithperson = dowithperson;
		    obj.searchperson = searchperson;
		    obj.pid = selectPid;
		    obj.warninfoid = warninfoId;
		    obj.userid =USERID;
		    obj.guidecomments = guideComments;
		    DWREngine.setAsync(false);
		    PcWarnService.otherSaveDoWithPersonAndSearchPerson(obj,function(rtn){
		        if(rtn!='1'){
		            Ext.Msg.alert('提示信息','保存发生异常!请重新选择');
		            return ;
		        }    
		    })
		    DWREngine.setAsync(true);
		    dowithStore.load({params :{start : 0,limit : PAGE_SIZE}});
		    southStore.baseParams.params = " warninfoid ='"+warninfoId+"'";
			southStore.load({params:{start:0,limit:PAGE_SIZE}});
			cuserWindow.hide();
		}
	}
})

cgrid = new Ext.grid.GridPanel({
	ds: cds,
	cm: ccm,
	sm: csm,
	tbar: [cgridTitleBar,'->', cgetUsers],
	border: false,
	region: 'center',
	layout: 'accordion',
	header: false,
	autoScroll: true,
	loadMask: true,
	plugins : [doWithColumn,checkColumn],
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: cds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    width: 200
});

function cdsReload(){
    cds.load({params:{start : 0,limit : PAGE_SIZE}});
}

var commentsPanel = new Ext.form.FormPanel({
    id : 'commentsPanel',
    region : 'south',
    width : 1000,
    height : 80,
    items : [
        {
            xtype : 'textarea',
            id : 'guidecomments',
            name : 'guidecomments',
            fieldLabel : '发送人意见',
            width : 465,
            height : 100
        }
    ]
})
cuserWindow = new Ext.Window({               
	title: '人员选择列表',
	iconCls: 'form',
	layout: 'border',
	width: 800, height: 400,
	modal: true,
	closeAction: 'hide',
	maximizable: true,
	plain: true,
	items: [ctreePanel, cgrid,commentsPanel],
	show:function(p1,p2,p3,p4,animateTarget, cb, scope){
        if(!this.rendered){
            this.render(Ext.getBody());
        }
        if(this.hidden === false){
            this.toFront();
            return;
        }
        if(this.fireEvent("beforeshow", this) === false){
            return;
        }
        if(cb){
            this.on('show', cb, scope, {single:true});
        }
        this.hidden = false;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        this.beforeShow();
        if(this.animateTarget){
            this.animShow();
        }else{
            this.afterShow();
        }
        // reload ctreePanel and cgrid
		croot.setText(p2);
		croot.id=p1;
		selectPid = p3;//设置Pid
		warninfoId = p4; //设置预警信息ID
        loader.baseParams.parentId =p1;
		croot.reload();
		cgrid.getStore().baseParams.params="unitid ='"+p1+"'";
		cdsReload();
	}
});
