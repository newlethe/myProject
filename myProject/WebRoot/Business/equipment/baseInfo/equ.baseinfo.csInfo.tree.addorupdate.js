var treeColumns = [
	{name:'bm',type:'string'},
	{name:'pm',type:'string'},
	{name:'parent',type:'string'},
	{name:'isleaf',type:'string'},
	{name:'uids',type:'string'},
	{name:'lvl',type:'float'}
]
var fbmt = new Ext.form.TextField({fieldLabel: '上层分类编码',name: 'parent',readOnly:true,anchor:'95%'});
var fpmt = new Ext.form.TextField({fieldLabel: '上层分类名称',name: 'fpm',readOnly:true,anchor:'95%'});
var isleaf = new Ext.form.TextField({name: 'isleaf',hidden:true,hideLabel:true,value:1,anchor:'95%'});
var uids = new Ext.form.TextField({name: 'uids',hidden:true,hideLabel:true,anchor:'95%'});
var bmField = new Ext.form.TextField({fieldLabel: '编码',name: 'bm'});
var pmField = new Ext.form.TextField({fieldLabel: '编码名称',name: 'pm'});
var saveOrupdateForm = new Ext.form.FormPanel({
	id: 'form-panel',
    header: false,
    width : 300,
    height: 150,
    split: true,
    collapsible : true,
    collapseMode : 'mini',
    border: false,
    bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
	iconCls: 'icon-detail-form',
	labelAlign: 'left',
    items:[
	    new Ext.form.FieldSet({
	    	title:'基本信息',
	    	layout:'form',
	    	border:true,
		    items: [fbmt,fpmt,bmField,pmField]
	    }),isleaf,uids
    ]
});


function toHandlerAdd(){
	var node = tmpNode;
	var elNode = node.getUI().elNode;
	var isRoot = (rootText == node.text);
	fbmt.setValue(f_bmArr[0])
	fpmt.setValue(f_bmArr[1])

	
	addWin = new Ext.Window({
		title:'新增地域分类',
		buttonAlign:'center',
		closable:false,
		layout:'fit',
		modal:'true',
		width:300,
		height:230,
		autoScroll:true,
		items:saveOrupdateForm,
		buttons:[{id:'btnSavfe',text:'保存' ,handler:saveTree},{text:'取消',handler:function(){addWin.hide()}}]
	});
	addWin.show(true);
}

function saveTree(){
	var form = saveOrupdateForm.getForm();
	var obj = new Object();
	for(var i=0;i<treeColumns.length;i++){
		var name = treeColumns[i].name;
		var field = form.findField(name);
		if(field){
			obj[name] = field.getValue();
		}
	}
	
	var chekArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select bm from wz_csb_type where bm='"+obj['bm']+"'", function(obj) {
		if(""!=obj){
			chekArr[0] = obj[0]
		}else{
			chekArr[0] = "";
		}
	});
	DWREngine.setAsync(true);
	
	if(""==chekArr[0]){
		obj.pid = CURRENTAPPID;
		wzbaseinfoMgm.addOrUpdateWzCsType(obj,function(flag){
			if("1"==flag){
				var node =  !saveOrupdateForm.isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
				node.reload();
			    node.expand();
				Ext.example.msg('提示！', '您成功保存了一条信息！');
				bmField.setValue("");
				pmField.setValue("");
				addWin.hide();
			}else{
				Ext.example.msg('提示！', '保存失败！');
			}
		})
	}else{
		Ext.example.msg('注意！', '编码已存在，不能重复！');
	}
}

function saveTreeupdate(){
	var form = saveOrupdateForm.getForm();
	var obj = new Object();
	for(var i=0;i<treeColumns.length;i++){
		var name = treeColumns[i].name;
		var field = form.findField(name);
		if(field){
			obj[name] = field.getValue();
		}
	}
	wzbaseinfoMgm.addOrUpdateWzCsType(obj,function(flag){//修改DWR
		if("2"==flag){
			var node =  !saveOrupdateForm.isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
			node.reload();
			node.expand();
			Ext.example.msg('提示！', '您成功修改了一条信息！');
			bmField.setValue("");
			pmField.setValue("");
			uids.setValue("");
			updateWin.hide();
		}else{
			Ext.example.msg('提示！', '保存失败！');
		}
	})
}

function toHandlerUpdate(){
	var node_ = tmpNode;
	var elNode_ = node_.getUI().elNode;
	var isRoot_ = (rootText == node_.text);
	
	var parentArray = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select b.bm,b.pm ,a.leaf,a.uids from wz_csb_type a,wz_csb_type b where a.parentbm=b.bm and  a.bm='"+f_bmArr[0]+"'", function(obj) {
		parentArray[0] = obj[0][0]//父节点
		parentArray[1] = obj[0][1]//父名称
		parentArray[2] = obj[0][2]//叶子
		parentArray[3] = obj[0][3]//主键
	});
	DWREngine.setAsync(true);
	fbmt.setValue(parentArray[0])
	fpmt.setValue(parentArray[1])
	bmField.setValue(f_bmArr[0])
	pmField.setValue(f_bmArr[1]);
	uids.setValue(parentArray[3])
	updateWin = new Ext.Window({
		title:'更新地域分类',
		buttonAlign:'center',
		closable:false,
		layout:'fit',
		modal:'true',
		width:300,
		height:230,
		autoScroll:true,
		items:saveOrupdateForm,
		buttons:[{id:'btnSavfe',text:'保存' ,handler:saveTreeupdate},{text:'取消',handler:function(){updateWin.hide()}}]
	});
	updateWin.show(true);
}
function toHandlerDel(){
	var node_ = tmpNode;
	var elNode_ = node_.getUI().elNode;
	Ext.Msg.show({
		title: '提示',
		msg: '是否删除' + node_.attributes.pm,
		buttons : Ext.Msg.YESNO,
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.QUESTION,
		fn: function(value){
			if ("yes" == value){
					wzbaseinfoMgm.deleteWzCsType(elNode_.all('uids').innerText,function(flag){
					if("1"==flag){
						var node = !saveOrupdateForm.isNew && !tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
						node.reload();
			    		node.expand();
						Ext.example.msg('提示！', '您成功删除了一条信息！');
					}else{
						Ext.example.msg('提示！', '删除失败！');
					}
				})
			}
		}
	});

}