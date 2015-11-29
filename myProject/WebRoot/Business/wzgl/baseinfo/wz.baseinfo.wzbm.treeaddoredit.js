var treeColumns = [
	{name:'bm',type:'string'},
	{name:'pm',type:'string'},
	{name:'parent',type:'string'},
	{name:'isleaf',type:'string'},
	{name:'uids',type:'string'},
	{name:'lvl',type:'float'},
	{name:'pid',type:'string'}
]
var fbmt = new Ext.form.TextField({fieldLabel: '上层分类编码',name: 'parent',readOnly:true,anchor:'95%'});
var fpmt = new Ext.form.TextField({fieldLabel: '上层分类名称',name: 'fpm',readOnly:true,anchor:'95%'});
var isleaf = new Ext.form.TextField({name: 'isleaf',hidden:true,hideLabel:true,value:1,anchor:'95%'});
var uids = new Ext.form.TextField({name: 'uids',hidden:true,hideLabel:true,anchor:'95%'});
var bm_ = new Ext.form.TextField({fieldLabel: '编码',name: 'bm',readOnly:true});
var pm_ = new Ext.form.TextField({fieldLabel: '编码名称',name: 'pm'});
var pid = new Ext.form.TextField({name: 'pid',hidden:true,hideLabel:true,value:CURRENTAPPID})
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
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
		    items: [fbmt,fpmt,bm_,pm_]
	    }),isleaf,uids,pid
    ]
});

function toHandlerAdd(){
	var node = tmpNode;
	var elNode = node.getUI().elNode;
	var isRoot = (rootText == node.text);
	
	if(isRoot){f_bmArr[0]=0}
	var sonkArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select max(to_number(bm)) from wz_ckclb where parentbm='"+f_bmArr[0]+"' and "+pidWhereString+" and bm in (select bm from WZ_CKCLB where REGEXP_LIKE(bm , '(^[+-]?\\d{0,}\\.?\\d{0,}$)'))", function(obj) {
		if(""!=obj){
			sonkArr[0] = obj[0]
		}else{
			sonkArr[0] = "";
		}
	});
	DWREngine.setAsync(true);
	if(isRoot){
		fbmt.setValue(0)
		fpmt.setValue("物资分类")
		bm_.setValue(sonkArr[0] > 8? (0+parseInt(sonkArr[0],10)+1) : (0+(parseInt((sonkArr[0] > 0 ? sonkArr[0] : "0"),10)+1)))
		pm_.setValue("")
	}else{
		bm_.setValue(f_bmArr[0]+parseInt(sonkArr[0]==""?0:sonkArr[0])+01)
		fbmt.setValue(f_bmArr[0])
		fpmt.setValue(f_bmArr[1])
		pm_.setValue("")
	}
	addWin = new Ext.Window({
		title:'新增物资编码',
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
	baseMgm.getData("select bm from wz_ckclb where bm='"+obj['bm']+"' and "+pidWhereString+" ", function(obj) {
		if(""!=obj){
			chekArr[0] = obj[0]
		}else{
			chekArr[0] = "";
		}
	});
	DWREngine.setAsync(true);
	
	if(""==chekArr[0]){
		DWREngine.setAsync(false);
		wzbaseinfoMgm.addOrUpdateWzCkclb(obj,function(flag){
			if("1"==flag){
				var node =  !saveOrupdateForm.isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
				if (node.isExpanded()) {
			    	treeLoader.load(node);
			    	node.expand();
		    	} else {
		    		node.expand();
		    	}
				Ext.example.msg('提示！', '您成功保存了一条信息！');
				addWin.hide();
				bm_.setValue("");
				pm_.setValue("");
			}else{
				Ext.example.msg('提示！', '保存失败！');
			}
		})
		DWREngine.setAsync(true);
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
	var chekArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select bm from wz_ckclb where bm='"+obj['bm']+"' and "+pidWhereString+" ", function(obj) {
		if(""!=obj){
			chekArr[0] = obj[0]
		}else{
			chekArr[0] = "";
		}
	});
	DWREngine.setAsync(true);
	if(""==chekArr[0]){
		wzbaseinfoMgm.addOrUpdateWzCkclb(obj,function(flag){//修改DWR
			if("2"==flag){
				var node =  !saveOrupdateForm.isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
				if (node.isExpanded()) {
			    	treeLoader.load(node);
			    	node.expand();
		    	} else {
		    		node.expand();
		    	}
				Ext.example.msg('提示！', '您成功修改了一条信息！');
				updateWin.hide();
			}else{
				Ext.example.msg('提示！', '保存失败！');
			}
		})
	}else{
		Ext.example.msg('注意！', '编码已存在，不能重复！');
	}

}

function toHandlerUpdate(){
	var node_ = tmpNode;
	var elNode_ = node_.getUI().elNode;
	var isRoot_ = (rootText == node_.text);
	
	var parentArray = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select b.bm,b.pm ,a.leaf,a.uids from wz_ckclb a,wz_ckclb b where a.parentbm=b.bm and  a.bm='"+f_bmArr[0]+"'", function(obj) {
		parentArray[0] = obj[0][0]//父节点
		parentArray[1] = obj[0][1]//父名称
		parentArray[2] = obj[0][2]//叶子
		parentArray[3] = obj[0][3]//主键
	});
	DWREngine.setAsync(true);
	fbmt.setValue(parentArray[0])
	fpmt.setValue(parentArray[1])
	bm_.setValue(f_bmArr[0])
	pm_.setValue(f_bmArr[1]);
	uids.setValue(parentArray[3])
	
	//alert(f_bmArr[0]+"=="+f_bmArr[1]+"=="+"=="+parentArray[0]+"=="+parentArray[1]+"=="+parentArray[2] )
	
	updateWin = new Ext.Window({
		title:'更新物资编码',
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

function toHandlerCK(){
	var node_ = tmpNode;
	var elNode_ = node_.getUI().elNode;
	var isRoot_ = (rootText == node_.text);
	var parentArray = new Array();
	if(isRoot_){
		fbmt.setValue("")
		fpmt.setValue("")
		bm_.setValue("0")
		pm_.setValue("物资分类");
		uids.setValue("0")
	}else{
		DWREngine.setAsync(false);
		baseMgm.getData("select b.bm,b.pm ,a.leaf,a.uids from wz_ckclb a,wz_ckclb b where a.parentbm=b.bm and  a.bm='"+f_bmArr[0]+"'", function(obj) {
			parentArray[0] = obj[0][0]//父节点
			parentArray[1] = obj[0][1]//父名称
			parentArray[2] = obj[0][2]//叶子
			parentArray[3] = obj[0][3]//主键
		});
		DWREngine.setAsync(true);
		fbmt.setValue(parentArray[0])
		fpmt.setValue(parentArray[1])
		bm_.setValue(f_bmArr[0])
		pm_.setValue(f_bmArr[1]);
		uids.setValue(parentArray[3])
	}
	
	
	updateWin = new Ext.Window({
		title:'查看物资编码',
		buttonAlign:'center',
		closable:false,
		layout:'fit',
		modal:'true',
		width:300,
		height:230,
		autoScroll:true,
		items:saveOrupdateForm,
		buttons:[{text:'关闭',handler:function(){updateWin.hide()}}]
	});
	updateWin.show(true);	
}

function toHandlerDel(){
	var node_ = tmpNode;
	var flbm = tmpNode.attributes.bm;
	var elNode_ = node_.getUI().elNode;
	var str = 0;
	DWREngine.setAsync(false);
	baseMgm.getData("select t.flbm from WZ_BM t where t.FLBM like '"+flbm+"%' and t.PID = '"+CURRENTAPPID+"' order by t.BM DESC ",function(list){
		str = list.length;
	});
	DWREngine.setAsync(true);
	if(str>0){
		Ext.example.msg('提示！', '该分类下已有数据，不能删除！');
		return;
	}
	Ext.Msg.show({
		title: '提示',
		msg: '是否删除' + node_.attributes.pm,
		buttons : Ext.Msg.YESNO,
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.QUESTION,
		fn: function(value){
			if ("yes" == value){
					DWREngine.setAsync(false)
					wzbaseinfoMgm.deleteWzCkclb(elNode_.all('uids').innerText,function(flag){
					if("1"==flag){
						var node =  !saveOrupdateForm.isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
						if (node.isExpanded()) {
					    	treeLoader.load(node);
					    	node.expand();
				    	} else {
				    		node.expand();
				    	}
						Ext.example.msg('提示！', '您成功删除了一条信息！');
					}else{
						Ext.example.msg('提示！', '删除失败！');
					}
				})
				DWREngine.setAsync(true)
			}
		}
	});

}