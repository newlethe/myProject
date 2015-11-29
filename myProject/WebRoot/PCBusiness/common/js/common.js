function getProxy(method){
	method=method||'GET'
	return new Ext.data.HttpProxy({method : 'GET',	url : MAIN_SERVLET});
}
function getBbar(store,pageSize){
	return new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : (pageSize||PAGE_SIZE),
			store : store,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
}
function getReader(columns){
	return new Ext.data.JsonReader({root : 'topics',totalProperty : 'totalCount',id : "uids"}, columns)
}

function createUnitTreeCombo(unitname,unitid,treeid,baseWhere){
	var loader = new Ext.tree.TreeLoader({
		dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
		requestMethod: "GET",
		baseParams:{
			parentId:USERBELONGUNITID,
			ac:"buildingUnitTree",
			baseWhere:baseWhere?baseWhere:"1=1"
		}
	})
	var treeCombo = new Ext.ux.TreeCombo({
		resizable:true,
		id:(treeid?treeid:Ext.id()),
		loader:loader,
		root:  new Ext.tree.AsyncTreeNode({
	       text: (unitname?unitname:USERBELONGUNITNAME),
	       id: (unitid?unitid:USERBELONGUNITID),
	       expanded:true
	    })
	});
	var treePanel = treeCombo.getTree();
	treePanel.on('beforeload',function(node){
		loader.baseParams.parentId = node.id; 
	});
	return treeCombo;
}
BackWindow=Ext.extend(Ext.Panel ,{
	title:"退回原因",
	width:380,
	height:232,
	region:'center',
	layout:"border",
	modal : true,
	doBack:Ext.emptyFn,
	initComponent: function(){
		this.items=[{
				region:"center",
				xtype:"textarea",
				border:false,
				hideBorders :false,
				bodyBorder  :false,
				maxLength : 200
				//,value:Math.round((Math.random()*100000000000))
			},{
				region:"south",
				border:false,
				hideBorders :false,
				frame:false,
				plain:true,
				bodyBorder :true,
				bodyStyle:'background-color:#EBEBEB;color:green;'
			}
		];
		this.tpl = new Ext.XTemplate(
		    "<div style='float:right;padding-right:20px;'>",
		    "可以输入200字  ，",
		    "剩余字数：{num}{warn}",
		    '</div>'
		);
		this.buttons = [{
				text:'确定',
				scope:this,
				handler:function(){
					var reason = this.items.get(0).getValue();
					if(reason.length>200){
						Ext.example.msg('提示','退回原因超过200字');
						return;
					}else if(reason==""){
						Ext.example.msg('提示','请先输入退回原因');
						return;
					}
					
					Ext.Msg.confirm('提示','是否退回重报？',function(text){
						if(text=="yes"){
							this.doBack(reason)
						}else{
							this.items.get(0).setValue("");
							var backWin=Ext.getCmp('backWin');
							backWin.destroy();
						}
					},this)
				}
			},{
				text:'取消',
				scope:this,
				handler:function(){
					this.items.get(0).setValue("");
					var backWin=Ext.getCmp('backWin');
					backWin.destroy();
				}
		}]
		BackWindow.superclass.initComponent.call(this);
	},
	listeners:{
		render:function(win){
			win.items.get(0).on('render',function(cmp){
				cmp.el.on("keyup", this.displayInfo,this);
				cmp.el.dom.style.fontSize="14px";
				cmp.el.dom.style.lineHeight= "15pt";
				cmp.el.dom.style.letterSpacing = "1pt";
			},this);
		}
		,
		afterlayout:function(win){
			win.displayInfo();
		}
	},
	displayInfo:function(){
			var txt = this.items.get(0);
			var info = this.items.get(1);
			var data = {
				num:(200-txt.getValue().length<0)?0:(200-txt.getValue().length),
				warn:(200-txt.getValue().length<0)?("，<font color=red>超出"+(txt.getValue().length-200)+"个字</font>"):""
			};
			this.tpl.overwrite(info.body, data);
	},
	buttonAlign:'center'
})
//start和end必须都是六位的字符串型的时间表示：如“200103”表示2001年03月
function getYearMonthBySjType(start,end){
	var sjArr=new Array();
	var months=["01","02","03","04","05","06","07","08","09","10","11","12"];
	var curr_year=new Date().getYear();
	var curr_month = new Date().getMonth();
	
	if(!start) start = "200701"
	if(!end) end = curr_year+""+(curr_month+101+"").substring(1);

	var start_year=parseInt(start.substr(0,4),10);
	var end_year=parseInt(end.substr(0,4),10);
	var end_month=parseInt(end.substr(4,6),10);
	
	for(var i=end_year;i>=start_year;i--){
		if(i!=end_year) end_month=12
		for(var j=end_month-1;j>=0;j--){
			var temp = new Array();	
			temp.push(i+months[j]);		
			temp.push(i+"年"+months[j]+"月");	
			sjArr.push(temp);
		}
	}
	return sjArr;
}
//start和end都必须是四位的字符串型时间，如：“2008”表示2008年。
function getYearBysjType(start,end){
	var sjArr=new Array();
	var curr_year=new Date().getYear();
	
	if(!start) start = "2007";
	if(!end) end = (new Date().getYear()+1);
	
	var start_year=parseInt(start);
	var end_year=parseInt(end);
	for(var i=end_year;i>=start_year;i--){
		var temp = new Array();	
		temp.push(i+"");		
		temp.push(i+"年");	
		sjArr.push(temp);
	}
	return sjArr;
}
getMonths = getYearMonthBySjType;
getYears = getYearBysjType;
/**
 * cell解析类
 * @param {} config
 */
function CellXmlDoc(_CellWeb){
	this.xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
	this.xmlDoc.setProperty("SelectionLanguage", "XPath");
	this.xmlDoc.async = false;
	this.cllOcx = null;
	this.signCells={};
	if(_CellWeb) this.cllOcx = _CellWeb;
	
	this.loadXML = function(xmlStr){
		this.xmlDoc.loadXML(xmlStr);
	};
	this.selectNodes = function(path){
		return this.xmlDoc.selectNodes(path);
	}
	this.selectSingleNode = function(path){
		return this.selectSingleNode(path)
	}
	this.getText = function(node){
		try{
			return node.text
		}catch(e){
			throw e.description;
		}
	}
	this.getRowIndex = function(cellNode){
		try{
			return cellNode.parentNode.getAttribute("Index");
		}catch(e){
			return "Not a Cell Node"
		}
	}
	this.getColIndex = function(cellNode){
		return cellNode.getAttribute("Index");
	}
	this.getSheetName = function(cellNode){
		try{
			return cellNode.parentNode.parentNode.parentNode.getAttribute("Name");
		}catch(e){
			return "Not a Cell Node"
		}
	}
	this.Cells = function(cellNode){
		try{
			var txt = cellNode.text;
			var colIndex = parseInt(cellNode.getAttribute("Index"));
			var	rowIndex = parseInt(cellNode.parentNode.getAttribute("Index"));
			var sheetName= cellNode.parentNode.parentNode.parentNode.getAttribute("Name");
			var sheetIndex= this.cllOcx.GetSheetIndex(sheetName);
			
			return {c:colIndex,r:rowIndex,s:sheetIndex,text:txt};
		}catch(e){
			return {};
		}
	}
	
	this.getPath=function(sheetName,rowIndex,colIndex){
		return "/Workbook/Worksheet[@Name='"+sheetName+"']/Table/Row[@Index='"+rowIndex+"']/Cell[@Index='"+colIndex+"']"
	}
	this.getSignPath=function(){
		return "/Workbook/Worksheet/Table/Row/Cell[starts-with(Data,'#')]"
	}
	this.replaceSign=function(values){
		if(!this.cllOcx) return
		
		values=values||{};
		var signArr = this.signCells;
		for(var tag in signArr){
			var tagValue=values[tag];
			
			if (tag.indexOf("DATE") > -1&&tagValue!="") {
//				alert(Ext.type(tagValue));
//				alert(tagValue.getDay());
				var d1 = new Date(tagValue)
				if(d1 && !isNaN(d1)) {
					tagValue = d1.getYear() + "-" + (d1.getMonth() + 1)+'-'+d1.getDate();
				}
			}else if(tagValue==null||tagValue=='null'){
				tagValue="";
			}
			this.cllOcx.S(signArr[tag].c, signArr[tag].r, signArr[tag].s, tagValue);
		}
		this.cllOcx.StartEdit(1,1)
		this.cllOcx.SaveEdit();
	}
	this.initSignCells=function(){
		if(!this.cllOcx) return
		
		var tagConfigElArr = this.selectNodes(this.getSignPath());
		for (var i = 0; i < tagConfigElArr.length; i++) {
			var cell0 = this.Cells(tagConfigElArr[i]);
			var tagMark = (cell0.text.split("/").length>1)?((cell0.text.split("/"))[0]):(cell0.text);
			var save    = (cell0.text.split("/").length>1)?((cell0.text.split("/"))[1]):"READ";
			var tag     = tagMark.substring(1, tagMark.length - 1);
			
			this.signCells[tag] = {tag:tag, s:cell0.s, r:cell0.r, c:cell0.c, save:save}
		}
	}
	this.getValues=function(){
		var dataMap = new Array();
		if(this.cllOcx){
			var signArr = this.signCells;
			for(var tag in signArr){
				var save=signArr[tag].save;
				if(save=="SAVE"){
					dataMap[dataMap.length] = tag + "`" + this.cllOcx.GetCellString2(signArr[tag].c, signArr[tag].r, signArr[tag].s);
				}
			}
		}
		return dataMap;
	}
	if(_CellWeb){
		this.cllOcx = _CellWeb;
		this.xmlDoc.loadXML(this.cllOcx.SaveToXML(""));
		this.initSignCells();
	}
};
//ExtAjax同步异步
Ext.lib.Ajax.request = function(method, uri, cb, data, options) {   
    if(options){   
        var hs = options.headers;   
        if(hs){   
            for(var h in hs){   
                if(hs.hasOwnProperty(h)){   
                    this.initHeader(h, hs[h], false);   
                }   
            }   
        }   
        if(options.xmlData){   
            if (!hs || !hs['Content-Type']){   
                this.initHeader('Content-Type', 'text/xml', false);   
            }   
            method = (method ? method : (options.method ? options.method : 'POST'));   
            data = options.xmlData;   
        }else if(options.jsonData){   
            if (!hs || !hs['Content-Type']){   
                this.initHeader('Content-Type', 'application/json', false);   
            }   
            method = (method ? method : (options.method ? options.method : 'POST'));   
            data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;   
        }   
    }   
 	return this["sync" in options ? "syncRequest" : "asyncRequest"](method, uri, cb, data);
  
}; 
Ext.lib.Ajax.syncRequest = function(method, uri, callback, postData)
{
    var o = this.getConnectionObject();

    if (!o) {
        return null;
    }
    else {
        o.conn.open(method, uri, false);

        if (this.useDefaultXhrHeader) {
            if (!this.defaultHeaders['X-Requested-With']) {
                this.initHeader('X-Requested-With', this.defaultXhrHeader, true);
            }
        }

        if(postData && this.useDefaultHeader && (!this.hasHeaders || !this.headers['Content-Type'])){
            this.initHeader('Content-Type', this.defaultPostHeader);
        }

        if (this.hasDefaultHeaders || this.hasHeaders) {
            this.setHeader(o);
        }

        o.conn.send(postData || null);
        this.handleTransactionResponse(o, callback);
        return o;
    }
};
//获取cell拓展的过滤控制java源代码
function getFile(filename){
	var javasrc = "";
	if(!filename||filename=="") return "";
	Ext.Ajax.request({
		url:BASE_PATH+"PCBusiness/CellExt/"+filename,
		scope:this,
		sync:true,
		success:function(response){
			javasrc = (response.responseText)
		},
		failure:function(){
			javasrc = "";
		}
	});
	return javasrc;
}