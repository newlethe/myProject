/**
 * safeType:
 * send:安全隐患下发
 * change:安全隐患整改
 * check:隐患整改检查
 * query:安全隐患整改查询
 * PC_AQGK_SAFETY_CHANGE
 */

var selvlet = CONTEXT_PATH + "/servlet/AqgkServlet";
var selvletUrl = selvlet+"?ac=loadDhxData&safeType="+safeType+"&pid="+CURRENTAPPID+"";
if(safeType == 'change') selvletUrl = selvletUrl+"&unitid="+USERDEPTID
var grid_1;
//新增类型，判断是下发新增（1）还是整改新增（0）
var addType = safeType == "send" ? 1 : 0;

function buildInterface(){
    var header = ["UIDS","PID","ADDTYPE","编号","隐患内容","隐患描述","隐患性质","整改单位","录入人","录入时间"];
    var colimnIds = "UIDS,PID,ADDTYPE,BH,YHNR,YHMS,YHXZ,ZGDW,LRR,LRSJ";
    var colTypes = "ro,ro,ro,ed,ed,link,coro,coro,ed,dhxCalendar";
    var colSorting = "str,str,str,str,str,str,str,str,str,str,str";
    var initWidths = "0,0,0,140,"+(safeType != "send" ? "260" : "*")+",90,90,190,90,130";
    var colAlign = "left,left,left,center,left,center,left,left,center,left";
    var dataColumns = [true,true,true,true,true,true,true,true,true,true];
    var colValidators = ["NotEmpty","NotEmpty","NotEmpty","NotEmpty","NotEmpty",null,"NotEmpty","NotEmpty","NotEmpty",null];
    
        header = header.concat(["整改人","整改完成时间","整改说明","整改描述","验收人","验收时间","验收情况","备注"])
        colimnIds += ",ZGR,ZGWCSJ,ZGSM,ZGMS,YSR,YSSJ,YSQK,BZ";
        colTypes += ",ed,dhxCalendar,ed,link,ed,dhxCalendar,coro,ed";
        colSorting += ",str,str,str,str,str,str,str,str";
        initWidths += ",90,130,180,90,90,130,90,180";
        colAlign += ",center,left,left,center,center,left,center,left";
        dataColumns = dataColumns.concat([true,true,true,true,true,true,true,true]);
    if(safeType != "send"){
        colValidators = colValidators.concat(["NotEmpty",null,"NotEmpty",null,null,null,null,null]);
    }
        
    var main_layout = new dhtmlXLayoutObject(document.body, '1C');
    var a = main_layout.cells('a');
    a.hideHeader();
    grid_1 = a.attachGrid();
    grid_1.setImagePath('/dhx/codebase/imgs/');
    grid_1.setHeader(header);
    grid_1.setColumnIds(colimnIds);
    grid_1.setColTypes(colTypes);
    grid_1.setColSorting(colSorting);
    grid_1.setInitWidths(initWidths);
    grid_1.setColAlign(colAlign);
    grid_1.setColValidators(colValidators);
    grid_1.init();
    grid_1.clearAndLoad(selvletUrl,function(){});
    var myDataProcessor = new dataProcessor(selvletUrl);
    myDataProcessor.setUpdateMode("off");
    myDataProcessor.setDataColumns(dataColumns);
    myDataProcessor.init(grid_1);
    grid_1.attachFooter(["<div id='grid_2_recinfoArea' style='width:100%;height:100%'></div>","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan"],['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
    grid_1.enablePaging(true, PAGE_SIZE, 3,'grid_2_recinfoArea');
    grid_1.setPagingSkin('toolbar','dhx_skyblue');
    grid_1.setDateFormat("%Y-%m-%d %H:%i",null,grid_1.getColIndexById("LRSJ")); 
    grid_1.setDateFormat("%Y-%m-%d %H:%i",null,grid_1.getColIndexById("ZGWCSJ")); 
    grid_1.setDateFormat("%Y-%m-%d %H:%i",null,grid_1.getColIndexById("YSSJ")); 
    grid_1.enableEditEvents(false,true,false);
    
    if(safeType == "send"){
        for (var i = 10; i < header.length; i++) {
            grid_1.setColumnHidden(i, true);
        }
    }
    //单元格编辑事件控制
    grid_1.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
        if(safeType == 'query') return false;
        if(safeType == "send"){
            var cellObj = grid_1.cells(rId,grid_1.getColIndexById("YSQK"));
            var type = cellObj.getValue();
            if(type == '1'){
                return false;
            }else {
                return true;
            }
        }else if(safeType == "change"){
            var cellObj = grid_1.cells(rId,grid_1.getColIndexById("YSQK"));
            var type = cellObj.getValue();
            if(type == '1'){
                return false;
            }
            if(cInd >= grid_1.getColIndexById("ZGR") && cInd < grid_1.getColIndexById("YSR")){
                return true;
            }else if(cInd >= grid_1.getColIndexById("YSR")){
                return false;
            }else{
                var cell = grid_1.cells(rId,grid_1.getColIndexById("ADDTYPE"));
	            var type = cell.getValue();
	            if(type=='0'){
	                return true;
	            }
            }
        }else if(safeType == "check"){
            if(cInd >= grid_1.getColIndexById("YSR"))return true;
        }
        return false;
    });
    //页面数据加载完成后事件控制
    grid_1.attachEvent("onXLE",function(grid_1,count){
        //if(safeType == "send") return false;
        count = grid_1.getRowsNum();
        for (var i = 0; i < count; i++) {
            var cellObj = grid_1.cellByIndex(i, grid_1.getColIndexById("YSQK"));
            var type = cellObj.getValue();
            if(type == '1'){
                grid_1.setRowColor(grid_1.getRowId(i),"#d0d0d0");
            }else if(type == '0'){
                grid_1.setRowColor(grid_1.getRowId(i),"#ffff00");
            }
        }
    });
    //查询页面禁用所有编辑功能
    if(safeType == "query"){
        grid_1.setEditable(false);
    }
    
    //创建工具条
    var toolbar_1 = a.attachToolbar();
    toolbar_1.setIconsPath('/dhx/codebase/imgs/');
    var str = []
    
    var year = new Date().getFullYear();
    var yearMonthData = [['ALL','所有']];
    yearMonthData = yearMonthData.concat(getYearMonthBySjType((year-1)+"01", null));
    
    /**
     * 组织查询条件，并传递到后台
     */
    function gridQuery(){
        var queryStr = '';
        if(toolbar_1.getCombo("MONTH_COMBO")){
            queryStr +="&month="+toolbar_1.getCombo("MONTH_COMBO").getSelectedValue();
        }
        if(toolbar_1.getCombo("YHXZ_COMBO")){
            queryStr +="&yhxz="+toolbar_1.getCombo("YHXZ_COMBO").getSelectedValue();
        }
        if(toolbar_1.getCombo("ZGDW_COMBO")){
            queryStr +="&zgdw="+toolbar_1.getCombo("ZGDW_COMBO").getSelectedValue();
        }
        if(toolbar_1.getCombo("YSQK_COMBO")){
            queryStr +="&ysqk="+toolbar_1.getCombo("YSQK_COMBO").getSelectedValue();
        }
        
        grid_1.clearAndLoad(selvletUrl+queryStr,function(){
                    
        });
    }
    
    /**
     * 返回工具栏上的过滤下拉菜单
     * @param {} typeName 下拉菜单中文名，后台根据中文名从属性代码获取下拉菜单内容
     * @param {} typeId 下拉菜单的id
     * @param {} arrData 提供给下拉菜单的数据源，如果不存在，则从后台属性代码获取
     * @return {} 返回一个带label的下拉菜单的数组
     */
    var rtnToolbarCombo = function(typeName,typeId,arrData){
        var objArr = [{type:"label",text:typeName+":"}];
        var comboArr = [{
            id : typeId+'_COMBO',
            type : 'combo',
            width : '100',
            data : (arrData) ? arrData :encodeURI(selvlet+"?ac=getCodeValue&all=&typeName="+typeName),
            func : gridQuery
        }]
        return objArr.concat(comboArr);
    }
    
    //根据模块调整工具栏显示内容
    var tool_str = [{id:'add'},{id:'save'},{id:'delete'}];
    if(safeType == 'send'){
    }else if(safeType == 'change'){
        tool_str = tool_str.concat(rtnToolbarCombo('月份查询','MONTH',yearMonthData)).concat(rtnToolbarCombo('隐患性质','YHXZ'));
        tool_str = tool_str.concat([{id:'exp'}])
    }else if(safeType == 'check' || safeType == 'query'){
        if(safeType == 'check')tool_str = [{id:'save'}];
        if(safeType == 'query')tool_str = [{id:'empty',type:'label',text:' '}];
        tool_str = tool_str.concat(rtnToolbarCombo('月份查询','MONTH',yearMonthData)).concat(rtnToolbarCombo('隐患性质','YHXZ'));
        tool_str = tool_str.concat(rtnToolbarCombo('整改单位','ZGDW')).concat(rtnToolbarCombo('验收情况','YSQK'));
        if(safeType == 'check')tool_str = tool_str.concat([{id:'exp'}])
    }
    toolbar_1.render(tool_str);
    
    if(safeType == 'check'){
        toolbar_1.addSpacer("save");
    }else if(safeType == 'query'){
        toolbar_1.addSpacer("empty");
    }else{
        toolbar_1.addSpacer("delete");
    }
    
    //工具栏按钮点击事件
    toolbar_1.attachEvent("onClick", function(id){
        grid_1.editStop();
        switch(id){
            case 'add' : 
                pcAqgkService.getUuidAndRecordCount(CURRENTAPPID,function(str){
                    var newId = str.split("`")[0];
                    var newBh = str.split("`")[1];
                    var ids = grid_1.getChangedRows(true);
                    if(ids != "")
                        newBh = parseInt(newBh,10) + ids.split(",").length
                    var addRecord = [newId,CURRENTAPPID,addType,newBh,"","<a href='javascript:showFileWin(\""+newId+"\",\"AQGK_YHMS\",\"0\")'>查看[0]</a>","","",REALNAME,new Date()]
	                if(safeType != "send"){
	                    addRecord = addRecord.concat([REALNAME,new Date(),"","<a href='javascript:showFileWin(\""+newId+"\",\"AQGK_ZGMS\",\"0\")'>查看[0]</a>","","","0",""]);
	                }
	                grid_1.addRow(newId,addRecord,0);
	                //grid_1.setRowColor(grid_1.getRowId(0),"#F0F8FF");
                })
                break;
            case 'save' : 
		        if(myDataProcessor.updatedRows.length == 0){
                    Ext.example.msg('提示信息','没有需要保存的数据！');
		            return;
		        }
		        myDataProcessor.sendData();
                break;
            case 'delete' : 
                var uids = grid_1.getSelectedRowId();
                if(!uids){
                    Ext.example.msg('提示信息','请选择需要删除的记录行！');
                    return;
                }
                var type = grid_1.cells(grid_1.getSelectedRowId(),grid_1.getColIndexById("ADDTYPE")).getValue();
                var ysqk_type = grid_1.cells(grid_1.getSelectedRowId(),grid_1.getColIndexById("YSQK")).getValue(); 
                if(type == '1' && safeType == 'change'){
                    Ext.example.msg('提示信息','您无权删除此数据！');
                }else if(ysqk_type == '1'){
                    Ext.example.msg('提示信息','已经验收，不能进行删除！');
                }else{
	                delRowData(grid_1, myDataProcessor);
                }
                break;
                
              case 'exp':
                grid_1.expToExcel();
                break;
        }
    });
    
    myDataProcessor.attachFunctions(main_layout,function(){
        grid_1.clearAndLoad(selvletUrl,function(){
            
        });
    })
    
}

var templateWin;
//上传附件的弹出窗口
function showFileWin(uids,type,ysqk){
    var editable = true;
    if(ysqk == '1'){
        //已经验收，不能编辑附件
        editable = false;
    }
    if(type == 'AQGK_YHMS' && safeType == 'change'){
        editable = false;
    }
    if(safeType == 'check'){
        editable = false;
    }
    
    
    if (false) {
        Ext.Msg.show({
            title : '上传文件',
            msg : '请先保存记录再进行上传！',
            buttons : Ext.Msg.OK,
            icon : Ext.MessageBox.WARNING
        });
        return;
    }
    var fileUploadUrl = CONTEXT_PATH
            + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp"
            + "?openType=url"
            + "&businessType="+type+""
            + "&editable="+editable+""
            + "&businessId="+ uids;
    templateWin = new Ext.Window({
        title : "附件",
        width : 600,
        height : 400,
        minWidth : 300,
        minHeight : 200,
        layout : 'fit',
        closeAction : 'close',
        modal : true,
        html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
                + "' frameborder=0 width=100% height=100%></iframe>"
    });
    templateWin.show();
    templateWin.on("close",function(){
        if(editable && frmAttachPanel && frmAttachPanel.uploader){
	        var num = 0;
            var ds = frmAttachPanel.uploader.getStore()
            num = ds.getCount();            
	        var view = type.substring(type.indexOf("_")+1);
	        var numObj = document.getElementById(view+uids);
            if(numObj) numObj.innerText = num
        }
    });
}

dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器