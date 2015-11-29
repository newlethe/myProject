var isSave = true;//目前不需要保存功能，暂时设置为true
var isPrint = false;
var obj;
var _bean;

Ext.onReady(function() {
	var printBtn = new Ext.Button({
		text : '关联数据',
		iconCls : 'print',
		handler : doPrintData
	});

	var printDocBtn = new Ext.Button({
		text : '连接打印机',
		iconCls : 'print',
		handler : printDoc
	});

	var saveBtn = new Ext.Button({
		text : '保存文档',
		iconCls : 'save',
		handler : doSaveDate,
		disabled : _finished == '1'//完结了就不能保存，与save参数作用相同，重复了
	});

	var panel = new Ext.Panel({
		id : "docpanel",
		region : "center",
		border : false,
		split : true,
		contentEl : 'ocxDic',
		tbar : ['-', '<font color=#15428b><B>文档数据打印<B></font>', '-', printBtn]
	});

	var viewport = new Ext.Viewport({
		layout : 'fit',
		border : false,
		items : [panel]
	});

	if (_save) {
		Ext.getCmp("docpanel").getTopToolbar().add('-', saveBtn);
	}

	Ext.getCmp("docpanel").getTopToolbar().add('-', printDocBtn);
	init();
});

window.onbeforeunload = function(){
    if(isPrint&&!isSave){
        return ("文档已经打印成功，但是还没有保存，确认离开此页面吗？")
    }
}

function init() {
    displayOCX(true);
    TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _fileid);
    TANGER_OCX_SetReadOnly(true);
}

function doSaveDate(){
    if(!isPrint){
        alert('请先关联文档数据！');
        return;
    }
    TANGER_OCX_SetReadOnly(false);
    var url = _basePath + '/servlet/EquServlet?ac=saveDoc';
    //由于设备退库模块，一条数据两个文档，故添加一个参数，params，使用逗号分号分割其中参数，以后不用再新增参数 pengy 2014-11-19
    var params = 'beanname='+_beanname+'&uids='+_uids+'&fileid='+_fileid+'&hasfile='+_hasfile+'&params=fileField,'+_fileField+";";
    var outHTML = document.all("TANGER_OCX").SaveToURL(url,'EDITFILE',params,_fileName);
    alert('文档数据保存成功！');
    isSave = true;
}

function printDoc(){
    TANGER_OCX_PrintDoc();
}

//EquBodysInPrintView   主体设备入库打印视图（Equ_Bodys_In_Print_View）
//EquBodysInsubPrintView   主体设备入库打印明细视图（Equ_Bodys_Insub_Print_View）
//EquBodysOutPrintView  主体设备出库打印视图
//EquBodysOutsubPrintView  主体设备出库打印明细视图
//WZBodysInPrintView    主体材料入库打印视图（Wz_Bodys_In_Print_View）
//WZBodysInsubPrintView    主体材料入库打印明细视图（Wz_Bodys_Insub_Print_View）
//WzBodysOutPrintView   主体材料出库打印视图
//WzBodysOutsubPrintView   主体材料出库打印明细视图
//EquGoodsStoreTkView 设备退库单打印视图

function doPrintData(){
    TANGER_OCX_SetReadOnly(false);
    if(_modetype=="SB"){
    	if(_filetype=='EquStockBodyOutView'){
    	    //处理是主体设备出库单打印
    	   _bean="com.sgepit.pmis.equipment.hbm.EquGoodsStockOutView";
    	}else{
    	   _bean="com.sgepit.pmis.equipment.hbm."+_filetype;
    	}
    	if(_filetype == "EquGoodsArrivalVGj"){
    		//国金设备到货打印，国金项目配置标示符EquGoodsArrivalVGj shuz 2013-12-23
    		_bean ="com.sgepit.pmis.equipment.hbm.EquGoodsArrivalVGj"
    	}else if(_filetype == "EquGoodsStockOutVGj"){
    		//国金设备出库打印，国金项目配置标示符EquGoodsStockOutGj shuz 2013-12-23
    		_bean ="com.sgepit.pmis.equipment.hbm.EquGoodsStockOutVGj"
    	}else if(_filetype == "EquGoodsStoreinVGj"){
    		//国金设备入库打印，国金项目配置标示符EquGoodsStoreinVGj shuz 2013-12-23
    		_bean ="com.sgepit.pmis.equipment.hbm.EquGoodsStoreinVGj"
    	}else if(_filetype == "EquGoodsOpenNotVGj"){
    		//国金设备开箱通知单打印，国金项目配置标示符EquGoodsOpenNotVGj shuz 2013-12-23
    		_bean ="com.sgepit.pmis.equipment.hbm.EquGoodsOpenNoticeVGj"
    	}else if(_filetype == "EquGoodsOpenboxVGj"){
    		//国金设备开箱打印，国金项目配置标示符EquGoodsOpenboxVGj shuz 2013-12-23
    		_bean ="com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxVGj"
    	}
    	
    }else if(_modetype=="CL"){
    	if(_filetype=="MatStoreInCompView"){//处理是生产准备入库单打印
    	   _bean="com.sgepit.pmis.material.hbm.MatStoreInPrintView";
    	}else if(_filetype=="MatStoreOutCompView"){//处理是生产准备出库单打印
    	   _bean="com.sgepit.pmis.material.hbm.MatStoreOutPrintView";
    	}else{
    	   _bean="com.sgepit.pmis.material.hbm."+_filetype;
    	}
    }else if(_modetype=="NewCL"){
    	if(_filetype=='WzGoodsBodyOutView'){
    	     _bean="com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutView";
    	}else{
    		 _bean="com.sgepit.pmis.wzgl.hbm."+_filetype;
    	}
    }else if(_modetype=="SBTK"){
    	if(_filetype=='EquGoodsStoreTkView'){
    		//国峰设备退库
   	     	_bean="com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkView";
    	}else{
    		_bean="com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkView";
    	}
   }
    else{
        alert("需要关联的数据错误！")
        return;
    }
    DWREngine.setAsync(false);
    baseMgm.findById(_bean, _uids,function(object){
        obj = object;
    });
    DWREngine.setAsync(true);
    ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
    for (var o in obj){
    	for (var i=0; i<ocxBookMarks.Count; i++){
            var bookmark = ocxBookMarks(i+1).Name;
            if (bookmark == o.toUpperCase()){
                //需要特别处理的书签，比如时间。
                var dateStr = o.toUpperCase();
                
                if(dateStr=='WAREHOUSEDATE'||dateStr=='IN_DATE'||dateStr=='OUT_DATE'||dateStr =='DH_DATE'||dateStr =='DEM_DH_DATE'||dateStr =='PLA_DH_DATE'||dateStr =='OPENDATE'||dateStr =='EQUARRIVEDATE'){
                    obj[o] = obj[o]==null?'':obj[o].dateFormat('Y-m-d');                
                }
                if(dateStr=='INDATE'||dateStr=='OUTDATE'){
                    obj[o] = obj[o]==null?'':obj[o].dateFormat('Y年m月d日');      
                }
                if(dateStr=='TKDATE'){
                    obj[o] = obj[o]==null?'':obj[o].dateFormat('Y年m月d日');      
                }
                
                //处理财务编码末尾有换行符，去点换行
                
                if(o == "conmoneyno" ){
                	if(obj[o] != null)
                        obj[o] = obj[o].replace(/^\n+|\n+$/g,"");
                }
                TANGER_OCX_OBJ.SetBookmarkValue(bookmark, obj[o]);
           } 
        }
    }
    switch(_filetype){
    case "EquGoodsOpenboxVGj" : 
    		if(CURRENTAPPID == "1032102"){
    			printData_EquGoodsOpenboxVGf();
    		}else{
    			printData_EquGoodsOpenboxVGj();
    		}
            isPrint = true;
            break;
        case "EquGoodsStoreinView" : 
            printData_EquGoodsStorein();
            isPrint = true;
            break;
        case "EquGoodsStoreinVGj" :
        	if(CURRENTAPPID == "1032102"){
        		printData_EquGoodsStoreinVGf();
        	}else{
        		printData_EquGoodsStoreinVGj();
        	}
            isPrint = true;
            break;
        case "EquGoodsOpenNotVGj" : 
        	if(CURRENTAPPID == "1032102"){
        		printData_EquGoodsOpenNotVGf();
        	}else{
        		printData_EquGoodsOpenNotVGj();
        	}
            isPrint = true;
            break;
        case "EquGoodsStockOutView" : 
            printData_EquGoodsStockOut();
            isPrint = true;
            break;
        case "MatStoreOutPrintView" : //生产准备部出库单打印
	        printData_MatStoreOut();
	        isPrint = true;
	        break;
        case "MatStoreInPrintView" : //生产准备部入库单打印
            printData_MatStoreIn();
            isPrint = true;
            break;
        case "MatStoreInCompView" : //综合部入库单打印
            printData_MatStoreInComp();
            isPrint = true;
            break;
        case "MatStoreOutCompView" ://综合部出库单打印
 	        printData_MatStoreOutComp();
	        isPrint = true;
	        break;       
        case "EquGoodsArrivalVGj" : 
        	if(CURRENTAPPID == "1032102"){
        		printData_EquGoodsArrivalVGf();
        	}else{
        		printData_EquGoodsArrivalVGj();
        	}
            isPrint = true;
            break;
        case "EquGoodsStockOutVGj" : 
        	if(CURRENTAPPID == "1032102"){
        		printData_EquGoodsStockOutVGf();
        	}else{
        		printData_EquGoodsStockOutVGj();
        	}
            isPrint = true;
            break;
        case "WzGoodsArrivalView":
            printData_WzGoodsArrival();
            isPrint = true;
            break;
        case "WzGoodsStoreinView" : 
            printData_WzGoodsStorein();
            isPrint = true;
            break;
        case "WzGoodsStockOutView" : 
            printData_WzGoodsStockOut();
            isPrint = true;
            break;
         case "EquStoreinEsView" :
            printData_EquGoodsStoreinEstimate(); //暂估入库
            isPrint = true;
            break; 
         case "EquStoreinBackView" :
             printData_EquGoodsStoreinBack();//冲回入库
            isPrint = true;
            break;    
          case  "EquGoodsOutBackView" :
            printData_EquGoodsOutBack();//冲回出库
            isPrint = true;
            break; 
          case "EquStockOutEsView" :
            printData_EquStockOutEstimate();//暂估出库
            isPrint = true;
            break; 
          case "EquStockBodyOutView" :
            printData_EquStockBodyOutView();//主体设备出库单打印
            isPrint = true;
            break;               
          case "WzStoreinEsView" :
            printData_WzGoodsStoreinEstimate(); //材料暂估入库
            isPrint = true;
            break; 
          case "WzStoreinBackView":
            printData_WzGoodsStoreinBack();//材料冲回入库
            isPrint = true;
            break;    
          case  "WzStockOutEsView":
            printData_WzStockOutEstimate();//材料暂估出库
            isPrint = true;
            break; 
          case "WzGoodsBodyOutView" :
            printData_WzStockOutBodytimate();//主体材料出库单打印
            isPrint = true;
            break;           
          case "WzGoodsOutBackView":
            printData_WzGoodsOutBack();//材料冲回出库
            isPrint = true;
            break; 
          //------2014年山西基建重新移植津能主体设备和主体材料后打印功能 
          //------zhangh 2014-05-21  
          case "EquBodysInPrintView":
            printData_EquBodysInPrintView(_modetype);//主体设备入库单打印 
            isPrint = true;
            break; 
          case "WzBodysInPrintView":
            printData_EquBodysInPrintView(_modetype);//主体材料入库单打印 
            isPrint = true;
            break;
          case "EquBodysOutPrintView":
            printData_EquBodysOutPrintView(_modetype);//主体设备入库单打印 
            isPrint = true;
            break; 
          case "WzBodysOutPrintView":
            printData_EquBodysOutPrintView(_modetype);//主体材料入库单打印 
            isPrint = true;
            break;
          case "EquGoodsStoreTkView":
        	  printData_EquGoodsStoreTk(_modetype);//国峰设备退库单
              isPrint = true;
        	  break;
          case "EquGoodsStoreTkYs":
        	  printData_EquGoodsStoreTk(_modetype);//国峰设备退库验收单
              isPrint = true;
        	  break;
          //------zhangh 2014-05-21
        default :
            break;
    }
    if(isPrint){
	    alert('文档数据打印成功！');
        TANGER_OCX_SetReadOnly(true);
    }
}

//设备入库单文档打印数据
function printData_EquGoodsStorein(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub", "sbrkUids='"+_uids+"'","stockno desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    /**
     * 关于打印顺序的说明，以顺序打印为例。
     * 第一次点击打印的时候，进入下面else中，Cell(7,1)开始打印，
     * 第一行打印001的数据，然后程序会在此行上插入一行，打印002的数据，
     * 这样如果顺序查询，就变成了倒序打印，因此顺序打印，必须以倒序取数。
     * 
     * 第二次点击打印以后，由于数据对应的表格的行已经生成，下面的i为递增，
     * 因此就需要从最大行，也就是记录的最后一行，向上打印，
     * 因此下面Cell(7+orderNum,1)，orderNum = objArr.length-i-1;
     */
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                var orderNum = objArr.length-i-1;
                Tables.Item(1).Cell(7+orderNum, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+orderNum, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7+orderNum, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7+orderNum, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7+orderNum, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7+orderNum, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7+orderNum, 7).Range.Text = printObj.unitPrice == null?"":String(printObj.unitPrice);//单价
                Tables.Item(1).Cell(7+orderNum, 8).Range.Text = printObj.amountMoney == null?"":printObj.amountMoney;//金额
                Tables.Item(1).Cell(7+orderNum, 9).Range.Text = printObj.freightMoney == null?"":printObj.freightMoney;//运费
                Tables.Item(1).Cell(7+orderNum, 10).Range.Text = printObj.insuranceMoney == null?"":printObj.insuranceMoney;//保险
                Tables.Item(1).Cell(7+orderNum, 11).Range.Text = printObj.antherMoney == null?"":printObj.antherMoney;//其他
                Tables.Item(1).Cell(7+orderNum, 12).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;//入库单价
                Tables.Item(1).Cell(7+orderNum, 13).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;//入库金额
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":String(printObj.unitPrice);//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":printObj.amountMoney;//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":printObj.freightMoney;//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":printObj.insuranceMoney;//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":printObj.antherMoney;//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
        }
        var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalMoney  = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
                allFreightMoney += printObj.freightMoney;
                allInsuranceMoney += printObj.insuranceMoney;
                allAntherMoney  += printObj.antherMoney;
                allTotalMoney += printObj.totalMoney;
                //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text =allTotalMoney;
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
    }
}
//国金设备入库单文档打印数据
function printData_EquGoodsStoreinVGj(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSubVGj", "sbrkUids='"+_uids+"' and pid='"+CURRENTAPPID+"'","uids desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    
    /**
     * 关于打印顺序的说明，以顺序打印为例。
     * 第一次点击打印的时候，进入下面else中，Cell(7,1)开始打印，
     * 第一行打印001的数据，然后程序会在此行上插入一行，打印002的数据，
     * 这样如果顺序查询，就变成了倒序打印，因此顺序打印，必须以倒序取数。
     * 
     * 第二次点击打印以后，由于数据对应的表格的行已经生成，下面的i为递增，
     * 因此就需要从最大行，也就是记录的最后一行，向上打印，
     * 因此下面Cell(7+orderNum,1)，orderNum = objArr.length-i-1;
     */
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.equType == null?"":printObj.equType;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.graphNo == null?"":graphNo;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
				Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);
				Tables.Item(2).Cell(2+i, 9).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(2).Cell(2+i, 10).Range.Text = storage == null?"":storage;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.wareHouseName == null?"":printObj.wareHouseName;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.equType == null?"":printObj.equType;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
				Tables.Item(2).Cell(2, 8).Range.Text = printObj.inWareHouseNo == null?"":String(printObj.inWareHouseNo);
				Tables.Item(2).Cell(2, 9).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(2).Cell(2, 10).Range.Text = printObj.storage == null?"":printObj.storage;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
        }
    }
   window.returnValue = "storein"; 
}
//国峰设备入库单文档打印数据
function printData_EquGoodsStoreinVGf(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSubVGj", "sbrkUids='"+_uids+"' and pid='"+CURRENTAPPID+"'","uids desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.equType == null?"":printObj.equType;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.wareHouseName == null?"":printObj.wareHouseName;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(2).Cell(2+i, 9).Range.Text = printObj.wareHouseNum == null?"":String(printObj.wareHouseNum);
				Tables.Item(2).Cell(2+i, 10).Range.Text = printObj.storage == null?"":printObj.storage;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
               Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.equType == null?"":printObj.equType;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.wareHouseName == null?"":printObj.wareHouseName;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(2).Cell(2, 9).Range.Text = printObj.wareHouseNum == null?"":String(printObj.wareHouseNum);
				Tables.Item(2).Cell(2, 10).Range.Text = printObj.storage == null?"":printObj.storage;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
        }
    }
   window.returnValue = "storein"; 
}
//国金设备开箱验收单文档打印数据
function printData_EquGoodsOpenboxVGj(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubVGj", "openboxId='"+_uids+"'","uids desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    
    /**
     * 关于打印顺序的说明，以顺序打印为例。
     * 第一次点击打印的时候，进入下面else中，Cell(7,1)开始打印，
     * 第一行打印001的数据，然后程序会在此行上插入一行，打印002的数据，
     * 这样如果顺序查询，就变成了倒序打印，因此顺序打印，必须以倒序取数。
     * 
     * 第二次点击打印以后，由于数据对应的表格的行已经生成，下面的i为递增，
     * 因此就需要从最大行，也就是记录的最后一行，向上打印，
     * 因此下面Cell(7+orderNum,1)，orderNum = objArr.length-i-1;
     */
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(3).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(3).Cell(2+i, 2).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(3).Cell(2+i, 3).Range.Text = printObj.equType == null?"":printObj.equType;
               	Tables.Item(3).Cell(2+i, 4).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(3).Cell(2+i, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(3).Cell(2+i, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(3).Cell(2+i, 6).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
				Tables.Item(3).Cell(2+i, 8).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(3).Cell(2+i, 9).Range.Text = printObj.boxinNum == null?"":String(printObj.boxinNum);
				Tables.Item(3).Cell(2+i, 10).Range.Text = printObj.realNum == null?"":String(printObj.realNum);
				Tables.Item(3).Cell(2+i, 11).Range.Text = printObj.exceNum == null?"":String(printObj.exceNum);
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(3).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(3).Cell(2, 2).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(3).Cell(2, 3).Range.Text = printObj.equType == null?"":printObj.equType;
               	Tables.Item(3).Cell(2, 4).Range.Text = printObj.jzno==null?"":printObj.jzno;
                Tables.Item(3).Cell(2, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(3).Cell(2, 7).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(3).Cell(2, 6).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
				Tables.Item(3).Cell(2, 8).Range.Text = printObj.unit == null?"":printObj.unit;
				Tables.Item(3).Cell(2, 9).Range.Text = printObj.boxinNum == null?"":String(printObj.boxinNum);
				Tables.Item(3).Cell(2, 10).Range.Text = printObj.realNum == null?"":String(printObj.realNum);
				Tables.Item(3).Cell(2, 11).Range.Text = printObj.exceNum == null?"":String(printObj.exceNum);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(3).Cell(2, 1).Range.Select();                   
            }
        }
    }
    window.returnValue = "openbox";
}
//国峰设备开箱验收单文档打印数据
function printData_EquGoodsOpenboxVGf(){
}
//国金设备检验通知单打印数据
function printData_EquGoodsOpenNotVGj(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsOpenNoticeSubVGj", "noticeId='"+_uids+"'","uids desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    
    /**
     * 关于打印顺序的说明，以顺序打印为例。
     * 第一次点击打印的时候，进入下面else中，Cell(7,1)开始打印，
     * 第一行打印001的数据，然后程序会在此行上插入一行，打印002的数据，
     * 这样如果顺序查询，就变成了倒序打印，因此顺序打印，必须以倒序取数。
     * 
     * 第二次点击打印以后，由于数据对应的表格的行已经生成，下面的i为递增，
     * 因此就需要从最大行，也就是记录的最后一行，向上打印，
     * 因此下面Cell(7+orderNum,1)，orderNum = objArr.length-i-1;
     */
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.jzno == null?"":printObj.jzno;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.openNum == null?"":String(printObj.openNum);
				Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.unit == null?"":printObj.unit;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.jzno == null?"":printObj.jzno;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.openNum == null?"":String(printObj.openNum);
				Tables.Item(2).Cell(2, 7).Range.Text = printObj.unit == null?"":printObj.unit;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
        }
    }
     window.returnValue = "openNotice";
}
//国峰设备检验通知单打印数据
function printData_EquGoodsOpenNotVGf(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.equipment.hbm.EquGoodsOpenNoticeSubVGj", "noticeId='"+_uids+"'","uids desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
               	Tables.Item(1).Cell(3+i, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(3+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(3+i, 3).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(1).Cell(3+i, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(3+i, 5).Range.Text = printObj.openNum == null?"":String(printObj.openNum);
				Tables.Item(1).Cell(3+i, 6).Range.Text = printObj.equDesc == null?"":printObj.equDesc;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(3, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(3, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(3, 3).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(1).Cell(3, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(3, 5).Range.Text = printObj.openNum == null?"":String(printObj.openNum);
				Tables.Item(1).Cell(3, 6).Range.Text = printObj.equDesc == null?"":printObj.equDesc;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(3, 1).Range.Select();                   
            }
        }
    }
     window.returnValue = "openNotice";
};
//材料出库单文档打印数据
function printData_WzGoodsStockOut(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(2).Cell(2+objArr.length, 5).Range.Text = allOutnum;
//            Tables.Item(2).Cell(2+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(2).Cell(2+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(2).Cell(2+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}

function printData_MatStoreOut(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.material.hbm.MatStoreOutsub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(6+i, 2).Range.Text = printObj.catNo == null?"":printObj.catNo;
                Tables.Item(1).Cell(6+i, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6+i, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6+i, 5).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(1).Cell(6+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6+i, 8).Range.Text = printObj.money == null?"0":printObj.money;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(6, 2).Range.Text = printObj.catNo == null?"":printObj.catNo;
                Tables.Item(1).Cell(6, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6, 5).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(1).Cell(6, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6, 8).Range.Text = printObj.money == null?"0":printObj.money;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(6, 1).Range.Select();                   
            }
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allMoney += printObj.money;
            }
            Tables.Item(1).Cell(6+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}


function printData_MatStoreIn(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.material.hbm.MatStoreInsub", "inId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(6+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(6+i, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6+i, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6+i, 5).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6+i, 6).Range.Text = printObj.inNum == null?"":printObj.inNum;
                Tables.Item(1).Cell(6+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6+i, 8).Range.Text = printObj.subSum == null?"0":printObj.subSum;
                Tables.Item(1).Cell(6+i, 9).Range.Text = printObj.taxes == null?"0":printObj.taxes;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(6, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(6, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6, 5).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6, 6).Range.Text = printObj.inNum == null?"":printObj.inNum;
                Tables.Item(1).Cell(6, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6, 8).Range.Text = printObj.subSum == null?"0":printObj.subSum;
                Tables.Item(1).Cell(6, 9).Range.Text = printObj.taxes == null?"0":printObj.taxes;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(6, 1).Range.Select();                   
            }
        }
        var PageAllInNum = 0;
        var PageAllTotalnum = 0;
        var pageAllSubSum = 0;
        var pageAllTaxes  = 0;
        
        var allInNum = 0;
        var allTotalnum = 0;
        var allSubSum = 0;
        var allTaxes  = 0;
        for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllInNum += printObj.inNum;
                PageAllTotalnum += printObj.totalnum;
                pageAllSubSum += printObj.subSum;
                pageAllTaxes  +=  printObj.taxes;
                //合计
                allInNum += printObj.inNum;
	            allTotalnum += printObj.totalnum;
	            allSubSum += printObj.subSum;
	            allTaxes  += printObj.taxes;
          }
           //处理页小计
//            Tables.Item(1).Cell(6+objArr.length, 6).Range.Text =PageAllInNum;
//            Tables.Item(1).Cell(6+objArr.length+1, 7).Range.Text =PageAllTotalnum;
//            Tables.Item(1).Cell(6+objArr.length, 8).Range.Text =pageAllSubSum;
//            Tables.Item(1).Cell(6+objArr.length, 9).Range.Text =pageAllTaxes;
            //处理合计
            Tables.Item(1).Cell(6+objArr.length+1, 6).Range.Text =allInNum;
//            Tables.Item(1).Cell(6+objArr.length+2, 7).Range.Text =allTotalnum;
            Tables.Item(1).Cell(6+objArr.length+1, 8).Range.Text =allSubSum;
            Tables.Item(1).Cell(6+objArr.length+1, 9).Range.Text =allTaxes;
            Tables.Item(1).Cell(6+objArr.length+2, 4).Range.Text =allTaxes+allSubSum;
    }
}

//国金设备到货通知单文档数据打印
function printData_EquGoodsArrivalVGj(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSubVGj", "arrivalId='"+_uids+"'",function(list){
        objArr = list;
    });
	DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
               	Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.boxType == null?"":printObj.boxType;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.jzNo == null?"":printObj.jzNo;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.graphNo ==null?"":printObj.graphNo;
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.mustNum == null?"0":printObj.mustNum;
                Tables.Item(2).Cell(2+i, 9).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(2).Cell(2+i, 10).Range.Text = printObj.unit == null?"":printObj.unit;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxType == null?"":printObj.boxType;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.jzNo == null?"":printObj.jzNo;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.mustNum == null?"0":printObj.mustNum;
                Tables.Item(2).Cell(2, 9).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(2).Cell(2, 10).Range.Text = printObj.unit == null?"":printObj.unit;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();
                                  
            }
        }
    }
    window.returnValue = "arrival";
}
//国峰设备到货通知单文档数据打印
function printData_EquGoodsArrivalVGf(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSubVGj", "arrivalId='"+_uids+"'",function(list){
        objArr = list;
    });
	DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
               	Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.boxType == null?"":printObj.boxType;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.jzNo == null?"":printObj.jzNo;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.graphNo ==null?"":printObj.graphNo;
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2+i, 9).Range.Text = printObj.realNum == null?"0":printObj.realNum;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxType == null?"":printObj.boxType;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.jzNo == null?"":printObj.jzNo;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2, 9).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();
                                  
            }
        }
    }
    window.returnValue = "arrival";
}
//（新）材料到货通知单文档数据打印
function printData_WzGoodsArrival(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub", "arrivalId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(3+i, 1).Range.Text = i*1+1;
                Tables.Item(2).Cell(3+i, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(3+i, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(3+i, 4).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(2).Cell(3+i, 5).Range.Text = printObj.weight == null?"0":printObj.weight;
                Tables.Item(2).Cell(3+i, 6).Range.Text = obj["joinPlace"]==null?"":obj["joinPlace"];
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(3, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(3, 2).Range.Text = printObj.boxName == null?"":printObj.boxName;
                Tables.Item(2).Cell(3, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(3, 4).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(2).Cell(3, 5).Range.Text = printObj.weight == null?"0":printObj.weight;
                Tables.Item(2).Cell(3, 6).Range.Text = obj["joinPlace"]==null?"":obj["joinPlace"];
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(3, 1).Range.Select();                   
            }
        }
    }
}


//材料入库单文档打印数据
function printData_WzGoodsStorein(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findWhereOrderBy("com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinSub", "sbrkUids='"+_uids+"'","stockno desc",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                var orderNum = objArr.length-i-1;
                Tables.Item(1).Cell(7+orderNum, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+orderNum, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7+orderNum, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7+orderNum, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7+orderNum, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7+orderNum, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7+orderNum, 7).Range.Text = printObj.unitPrice == null?"":String(printObj.unitPrice);//单价
                Tables.Item(1).Cell(7+orderNum, 8).Range.Text = printObj.amountMoney == null?"":String(printObj.amountMoney);//金额
                Tables.Item(1).Cell(7+orderNum, 9).Range.Text = printObj.freightMoney == null?"":String(printObj.freightMoney);//运费
                Tables.Item(1).Cell(7+orderNum, 10).Range.Text = printObj.insuranceMoney == null?"":String(printObj.insuranceMoney);//保险
                Tables.Item(1).Cell(7+orderNum, 11).Range.Text = printObj.antherMoney == null?"":String(printObj.antherMoney);//其他
                Tables.Item(1).Cell(7+orderNum, 12).Range.Text = printObj.intoMoney == null?"0":String(printObj.intoMoney);//入库单价
                Tables.Item(1).Cell(7+orderNum, 13).Range.Text = printObj.totalMoney == null?"0":String(printObj.totalMoney);//入库金额
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":String(printObj.unitPrice);//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":String(printObj.amountMoney);//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":String(printObj.freightMoney);//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":String(printObj.insuranceMoney);//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":String(printObj.antherMoney);//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":String(printObj.intoMoney);//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":String(printObj.totalMoney);//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
        }
        var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalMoney = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
                allFreightMoney += printObj.freightMoney;
                allInsuranceMoney += printObj.insuranceMoney;
                allAntherMoney  += printObj.antherMoney;
                allTotalMoney +=printObj.totalMoney;
                //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text = allTotalMoney;
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
    }
}
//设备出库单文档打印数据
function printData_EquGoodsStockOut(){
	
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(2).Cell(2+objArr.length, 5).Range.Text = allOutnum;
//            Tables.Item(2).Cell(2+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(2).Cell(2+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(2).Cell(2+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}
//国金设备出库单文档打印数据
function printData_EquGoodsStockOutVGj(){
	
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSubVGj", "outId='"+_uids+"' and pid='"+CURRENTAPPID+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.price==null?"0":String(printObj.price);
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.totalPrice == null?"0":String(printObj.totalPrice);
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.remark == null?"":printObj.remark;
                Tables.Item(2).Cell(2+i, 9).Range.Text = printObj.storage == null?"":printObj.storage;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.price==null?"0":String(printObj.price);
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.totalPrice == null?"0":String(printObj.totalPrice);
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.remark == null?"":printObj.remark;
                Tables.Item(2).Cell(2, 9).Range.Text = printObj.storage == null?"":printObj.storage;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
        }
    }
    window.returnValue = "stockout";
}
//国峰设备出库单文档打印数据
function printData_EquGoodsStockOutVGf(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSubVGj", "outId='"+_uids+"' and pid='"+CURRENTAPPID+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(true);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2+i, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2+i, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2+i, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2+i, 4).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2+i, 5).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2+i, 6).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2+i, 7).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2+i, 8).Range.Text = printObj.remark == null?"":printObj.remark;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
                Tables.Item(2).Cell(2, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
                Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(2).Cell(2, 4).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(2).Cell(2, 5).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(2).Cell(2, 6).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(2).Cell(2, 7).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(2).Cell(2, 8).Range.Text = printObj.remark == null?"":printObj.remark;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(2).Cell(2, 1).Range.Select();                   
            }
        }
    }
    window.returnValue = "stockout";
}
//暂估出库打印文档打印数据
function printData_EquStockOutEstimate(){

    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimateSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(8+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(8, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(8, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(1).Cell(8+objArr.length, 5).Range.Text = String(allOutnum);
//            Tables.Item(1).Cell(8+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(8+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(8+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}
//冲回出库文档打印数据
function printData_EquGoodsOutBack(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsOutBackSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(1).Cell(7+objArr.length, 5).Range.Text = String(allOutnum);
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
};
//暂估入库 文档打印
function printData_EquGoodsStoreinEstimate(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimateSub", "sbrkUids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.totalnum == null?"0":String(printObj.totalnum);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;
                Tables.Item(1).Cell(7+i, 9).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;
                Tables.Item(1).Cell(7+i, 10).Range.Text = printObj.taxes == null?"0":printObj.taxes;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":printObj.unitPrice;//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":printObj.amountMoney;//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":printObj.freightMoney;//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":printObj.insuranceMoney;//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":printObj.antherMoney;//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalMoney = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
	            allFreightMoney += printObj.freightMoney;
	            allInsuranceMoney += printObj.insuranceMoney;
	            allAntherMoney  += printObj.antherMoney;
	            allTotalMoney += printObj.totalMoney;
	            //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text =allTotalMoney
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
            
        }
    }
 /*   var bookMs = ['STOREKEEPER','HEADPEOPLE','WAREHOUSEPEOPLE','SUPPLISEPEOPLE'];
    for (var i=0; i<bookMs.length; i++){
        	var getUids = '';
            var bookmarks = bookMs[i];
               if(bookmarks == 'STOREKEEPER'){
               	  ocxBookMarks('STOREKEEPER').Select();
                  printFn(bookmarks,USERID);
               }else if (bookmarks == 'HEADPEOPLE'){
                  	var value ='';
               	    DWREngine.setAsync(false);
				    baseDao.getData("select ( CASE WHEN upunit='01' THEN '刘济琛'  WHEN upunit='02' THEN '陶伟平'" +
				    		"  WHEN upunit='03'  THEN '周勇'  ELSE '' END)names" +
				    		" from SGCC_INI_UNIT where unitid='"+USERPOSID +"'",function(list){
				    	if(list.length>0){
				    	  value = list[0];
				    	}
				    });
				    DWREngine.setAsync(true);
				    if(value ==''  ||  value == null){
				    	ocxBookMarks('HEADPEOPLE').Select();
				        printFn(bookmarks,USERID)
				    }else{
					    DWREngine.setAsync(false);
		                baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%"+value+"%' or REALNAME like '%"+value+"%'",function(list){
		                     	if(list.length>0){
						             getUids = list[0];
						        }
		                })
		                DWREngine.setAsync(true);
		                ocxBookMarks('HEADPEOPLE').Select();
		                printFn(bookmarks,getUids)
				    }
               }else if (bookmarks == 'WAREHOUSEPEOPLE'){
                   	ocxBookMarks('WAREHOUSEPEOPLE').Select();
               	    DWREngine.setAsync(false);
				    baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%陈玉荣%' or REALNAME like '%陈玉荣%'",function(list){
				        if(list.length>0){
				             getUids = list[0];
				        }
				    });
				    DWREngine.setAsync(true);
				    printFn(bookmarks,getUids)
               }else if(bookmarks == 'SUPPLISEPEOPLE'){
                   	ocxBookMarks('SUPPLISEPEOPLE').Select();
               	    DWREngine.setAsync(false);
				    baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%郭树龙%' or REALNAME like '%郭树龙%'",function(list){
				        if(list.length>0){
				             getUids = list[0];
				        }
				    });
				    DWREngine.setAsync(true); 
				    printFn(bookmarks,getUids)
               }
            }
            
    function printFn(bookmarks,getUids){
    	 var bookmark = bookmarks;
	     with(TANGER_OCX_OBJ.ActiveDocument){
	         var _userid = getUids;
	         DWREngine.setAsync(false);
			 flwFileMgm.isUploadSign(_userid.toString(), function(flag){
					if (flag){
						var url = _basePath+"servlet/FlwServlet?ac=loadDoc&fileid="+_userid;
						//得到书签上的所有图形
						var _shapes = TANGER_OCX_OBJ.ActiveDocument.InlineShapes;
						//书签员工编号
						var bu = bookmark;
						for (var i=_shapes.Count; i>0; i--){
							if(_shapes(i).AlternativeText == bu){
								_shapes(i).Delete();
							}
						}
						try{
						var obj =
							 TANGER_OCX_OBJ.ActiveDocument.Application.Selection.InlineShapes.AddPicture(url,false,true);
							//签名图片与工号绑定
							obj.AlternativeText = bu;
						}catch(e){}									
					} else {
						Ext.example.msg('提示', '您没有上传签名图片！可以到【系统管理】-【用户管理】上传！');
						TANGER_OCX_OBJ.SetBookmarkValue(bookmark,REALNAME)
					}
			});
			DWREngine.setAsync(true);
	     }
    }*/
};
//冲回入库文档打印
 function    printData_EquGoodsStoreinBack(){
 
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStoreinBackSub", "sbrkUids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.totalnum == null?"0":String(printObj.totalnum);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;
                Tables.Item(1).Cell(7+i, 9).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;
                Tables.Item(1).Cell(7+i, 10).Range.Text = printObj.taxes == null?"0":printObj.taxes;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":printObj.unitPrice;//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":printObj.amountMoney;//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":printObj.freightMoney;//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":printObj.insuranceMoney;//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":printObj.antherMoney;//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalMoney = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
	            allFreightMoney += printObj.freightMoney;
	            allInsuranceMoney += printObj.insuranceMoney;
	            allAntherMoney  += printObj.antherMoney;
	            allTotalMoney += printObj.totalMoney;
	            //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text =allTotalMoney;
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
            
        }
    }
/*    var bookMs = ['STOREKEEPER','HEADPEOPLE','WAREHOUSEPEOPLE','SUPPLISEPEOPLE'];
    for (var i=0; i<bookMs.length; i++){
        	var getUids = '';
            var bookmarks = bookMs[i];
               if(bookmarks == 'STOREKEEPER'){
               	  ocxBookMarks('STOREKEEPER').Select();
                  printFn(bookmarks,USERID);
               }else if (bookmarks == 'HEADPEOPLE'){
                  	var value ='';
               	    DWREngine.setAsync(false);
				    baseDao.getData("select ( CASE WHEN upunit='01' THEN '刘济琛'  WHEN upunit='02' THEN '陶伟平'" +
				    		"  WHEN upunit='03'  THEN '周勇'  ELSE '' END)names" +
				    		" from SGCC_INI_UNIT where unitid='"+USERPOSID +"'",function(list){
				    	if(list.length>0){
				    	  value = list[0];
				    	}
				    });
				    DWREngine.setAsync(true);
				    if(value ==''  ||  value == null){
				    	ocxBookMarks('HEADPEOPLE').Select();
				        printFn(bookmarks,USERID)
				    }else{
					    DWREngine.setAsync(false);
		                baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%"+value+"%' or REALNAME like '%"+value+"%'",function(list){
		                     	if(list.length>0){
						             getUids = list[0];
						        }
		                })
		                DWREngine.setAsync(true);
		                ocxBookMarks('HEADPEOPLE').Select();
		                printFn(bookmarks,getUids)
				    }
               }else if (bookmarks == 'WAREHOUSEPEOPLE'){
                   	ocxBookMarks('WAREHOUSEPEOPLE').Select();
               	    DWREngine.setAsync(false);
				    baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%陈玉荣%' or REALNAME like '%陈玉荣%'",function(list){
				        if(list.length>0){
				             getUids = list[0];
				        }
				    });
				    DWREngine.setAsync(true);
				    printFn(bookmarks,getUids)
               }else if(bookmarks == 'SUPPLISEPEOPLE'){
                   	ocxBookMarks('SUPPLISEPEOPLE').Select();
               	    DWREngine.setAsync(false);
				    baseDao.getData("select userid from ROCK_USER  where USERACCOUNT like '%郭树龙%' or REALNAME like '%郭树龙%'",function(list){
				        if(list.length>0){
				             getUids = list[0];
				        }
				    });
				    DWREngine.setAsync(true); 
				    printFn(bookmarks,getUids)
               }
            }
            
    function printFn(bookmarks,getUids){
    	 var bookmark = bookmarks;
	     with(TANGER_OCX_OBJ.ActiveDocument){
	         var _userid = getUids;
	         DWREngine.setAsync(false);
			 flwFileMgm.isUploadSign(_userid.toString(), function(flag){
					if (flag){
						var url = _basePath+"servlet/FlwServlet?ac=loadDoc&fileid="+_userid;
						//得到书签上的所有图形
						var _shapes = TANGER_OCX_OBJ.ActiveDocument.InlineShapes;
						//书签员工编号
						var bu = bookmark;
						for (var i=_shapes.Count; i>0; i--){
							if(_shapes(i).AlternativeText == bu){
								_shapes(i).Delete();
							}
						}
						try{
						var obj =
							 TANGER_OCX_OBJ.ActiveDocument.Application.Selection.InlineShapes.AddPicture(url,false,true);
							//签名图片与工号绑定
							obj.AlternativeText = bu;
						}catch(e){}									
					} else {
						Ext.example.msg('提示', '您没有上传签名图片！可以到【系统管理】-【用户管理】上传！');
						TANGER_OCX_OBJ.SetBookmarkValue(bookmark,REALNAME)
					}
			});
			DWREngine.setAsync(true);
	     }
    }*/
 };
 //材料暂估入库打印
 function printData_WzGoodsStoreinEstimate(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimateSub", "sbrkUids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.totalnum == null?"0":String(printObj.totalnum);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.intoMoney == null?"0":String(printObj.intoMoney);
                Tables.Item(1).Cell(7+i, 9).Range.Text = printObj.totalMoney == null?"0":String(printObj.totalMoney);
                Tables.Item(1).Cell(7+i, 10).Range.Text = printObj.taxes == null?"0":String(printObj.taxes);
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":String(printObj.unitPrice);//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":String(printObj.amountMoney);//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":String(printObj.freightMoney);//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":String(printObj.insuranceMoney);//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":String(printObj.antherMoney);//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":String(printObj.intoMoney);//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":String(printObj.totalMoney);//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalmoney = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
	            allFreightMoney += printObj.freightMoney;
	            allInsuranceMoney += printObj.insuranceMoney;
	            allAntherMoney  += printObj.antherMoney;
	            allTotalmoney += printObj.totalMoney;
	            //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text =allTotalmoney;
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
            
        }
    }
}
 
//材料冲回入库打印
function  printData_WzGoodsStoreinBack(){
 
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinBackSub", "sbrkUids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.totalnum == null?"0":String(printObj.totalnum);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;
                Tables.Item(1).Cell(7+i, 9).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;
                Tables.Item(1).Cell(7+i, 10).Range.Text = printObj.taxes == null?"0":printObj.taxes;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;//库存编码
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.warehouseName == null?"":printObj.warehouseName;// ，名称
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;//规格型号
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.unit==null?"":printObj.unit;///单位
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.inWarehouseNo == null?"":String(printObj.inWarehouseNo);//入库数量
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.unitPrice == null?"":printObj.unitPrice;//单价
				Tables.Item(1).Cell(7, 8).Range.Text = printObj.amountMoney == null?"":printObj.amountMoney;//金额
				Tables.Item(1).Cell(7, 9).Range.Text = printObj.freightMoney == null?"":printObj.freightMoney;//运费
				Tables.Item(1).Cell(7, 10).Range.Text = printObj.insuranceMoney == null?"":printObj.insuranceMoney;//保险
				Tables.Item(1).Cell(7, 11).Range.Text = printObj.antherMoney == null?"":printObj.antherMoney;//其他
				Tables.Item(1).Cell(7, 12).Range.Text = printObj.intoMoney == null?"0":printObj.intoMoney;//入库单价
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.totalMoney == null?"0":printObj.totalMoney;//入库金额
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var PageAllAmountMoney = 0;
            var PageAllFreightMoney = 0;
            var pageAllInsuranceMoney = 0;
            var pageAllAntherMoney  = 0;
            
            var allAmountMoney = 0;
            var allFreightMoney = 0;
            var allInsuranceMoney = 0;
            var allAntherMoney  = 0;
            var allTotalMoney  = 0;
            
            var taxsAllAmountMoney = 0;
            var taxsAllFreightMoney = 0;
            var taxsAllInsuranceMoney = 0;
            var taxsAllAntherMoney  = 0;
            
            var taxsAll = 0;
            for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllAmountMoney += printObj.amountMoney;
                PageAllFreightMoney += printObj.freightMoney;
                pageAllInsuranceMoney += printObj.insuranceMoney;
                pageAllAntherMoney  +=  printObj.antherMoney;
                //合计
                allAmountMoney += printObj.amountMoney;
	            allFreightMoney += printObj.freightMoney;
	            allInsuranceMoney += printObj.insuranceMoney;
	            allAntherMoney  += printObj.antherMoney;
	            allTotalMoney +=printObj.totalMoney;
	            //各项税金合计
                taxsAllAmountMoney += printObj.amountTax;
                taxsAllFreightMoney +=printObj.freightTax;
                taxsAllInsuranceMoney += printObj.insuranceTax;
                taxsAllAntherMoney += printObj.antherTax;    
            }
            //处理页小计
//            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text =PageAllAmountMoney;
//            Tables.Item(1).Cell(7+objArr.length, 9).Range.Text =PageAllFreightMoney;
//            Tables.Item(1).Cell(7+objArr.length, 10).Range.Text =pageAllInsuranceMoney;
//            Tables.Item(1).Cell(7+objArr.length, 11).Range.Text =pageAllAntherMoney;
            //处理合计
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text =allAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 9).Range.Text =allFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 10).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 11).Range.Text =allAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 13).Range.Text =allTotalMoney
            //处理各项税金合计
            Tables.Item(1).Cell(7+objArr.length+2, 3).Range.Text =taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 4).Range.Text =taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 5).Range.Text =allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+2, 6).Range.Text =taxsAllAntherMoney;
            //处理各项发票金额合计
            Tables.Item(1).Cell(7+objArr.length+3, 3).Range.Text =allAmountMoney+taxsAllAmountMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 4).Range.Text =allFreightMoney+taxsAllFreightMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 5).Range.Text =allInsuranceMoney+allInsuranceMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 6).Range.Text =allAntherMoney+taxsAllAntherMoney;
            //处理发票总金额
            var  allTaxs = allAmountMoney+taxsAllAmountMoney+allFreightMoney+taxsAllFreightMoney
                          +allInsuranceMoney+allInsuranceMoney+allAntherMoney+taxsAllAntherMoney;
            Tables.Item(1).Cell(7+objArr.length+3, 8).Range.Text =allTaxs;
            
        }
    }
 }
 //材料暂估出库打印
 function printData_WzStockOutEstimate(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimateSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
            Tables.Item(1).Cell(7+objArr.length, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}

//材料冲回出库
function printData_WzGoodsOutBack(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsOutBackSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
            Tables.Item(1).Cell(7+objArr.length, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(7+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(7+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(7+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}


//主体设备出库单打印
function printData_EquStockBodyOutView(){

    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(8+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(8, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(8, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(1).Cell(8+objArr.length, 5).Range.Text = allOutnum;
//            Tables.Item(1).Cell(8+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(8+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(8+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}


//主体材料出库单打印
function printData_WzStockOutBodytimate(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(8+i, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8+i, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8+i, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8+i, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8+i, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(8, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(8, 2).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
                Tables.Item(1).Cell(8, 3).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
                Tables.Item(1).Cell(8, 4).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(8, 5).Range.Text = printObj.outNum == null?"0":String(printObj.outNum);
                Tables.Item(1).Cell(8, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(8, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(8, 8).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(8, 1).Range.Select();                   
            }
            var allOutnum = 0;
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allOutnum += printObj.outNum;
               allMoney += printObj.amount;
            }
//            Tables.Item(1).Cell(8+objArr.length, 5).Range.Text = allOutnum;
//            Tables.Item(1).Cell(8+objArr.length, 8).Range.Text = allMoney;
            Tables.Item(1).Cell(8+objArr.length+1, 5).Range.Text = String(allOutnum);
            Tables.Item(1).Cell(8+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}


//综合部入库单打印
function printData_MatStoreInComp(){
    var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.material.hbm.MatStoreInsub", "inId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(6+i, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(6+i, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6+i, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6+i, 5).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6+i, 6).Range.Text = printObj.inNum == null?"":printObj.inNum;
                Tables.Item(1).Cell(6+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6+i, 8).Range.Text = printObj.subSum == null?"0":printObj.subSum;
                Tables.Item(1).Cell(6+i, 9).Range.Text = printObj.taxes == null?"0":printObj.taxes;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(6, 2).Range.Text = printObj.stockno == null?"":printObj.stockno;
                Tables.Item(1).Cell(6, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6, 5).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6, 6).Range.Text = printObj.inNum == null?"":printObj.inNum;
                Tables.Item(1).Cell(6, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6, 8).Range.Text = printObj.subSum == null?"0":printObj.subSum;
                Tables.Item(1).Cell(6, 9).Range.Text = printObj.taxes == null?"0":printObj.taxes;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(6, 1).Range.Select();                   
            }
        }
        var PageAllInNum = 0;
        var PageAllTotalnum = 0;
        var pageAllSubSum = 0;
        var pageAllTaxes  = 0;
        
        var allInNum = 0;
        var allTotalnum = 0;
        var allSubSum = 0;
        var allTaxes  = 0;
        for(var k=0;k<objArr.length;k++){
                var printObj = objArr[k];
                //页小计
                PageAllInNum += printObj.inNum;
                PageAllTotalnum += printObj.totalnum;
                pageAllSubSum += printObj.subSum;
                pageAllTaxes  +=  printObj.taxes;
                //合计
                allInNum += printObj.inNum;
	            allTotalnum += printObj.totalnum;
	            allSubSum += printObj.subSum;
	            allTaxes  += printObj.taxes;
          }
           //处理页小计
//            Tables.Item(1).Cell(6+objArr.length, 6).Range.Text =PageAllInNum;
//            Tables.Item(1).Cell(6+objArr.length+1, 7).Range.Text =PageAllTotalnum;
//            Tables.Item(1).Cell(6+objArr.length, 8).Range.Text =pageAllSubSum;
//            Tables.Item(1).Cell(6+objArr.length, 9).Range.Text =pageAllTaxes;
            //处理合计
            Tables.Item(1).Cell(6+objArr.length+1, 6).Range.Text =allInNum;
//            Tables.Item(1).Cell(6+objArr.length+2, 7).Range.Text =allTotalnum;
            Tables.Item(1).Cell(6+objArr.length+1, 8).Range.Text =allSubSum;
            Tables.Item(1).Cell(6+objArr.length+1, 9).Range.Text =allTaxes;
            Tables.Item(1).Cell(6+objArr.length+2, 4).Range.Text =allTaxes+allSubSum;
    }
}

//综合部出库单打印
function printData_MatStoreOutComp(){
	var objArr = new Array();
    DWREngine.setAsync(false);
    baseDao.findByWhere2("com.sgepit.pmis.material.hbm.MatStoreOutsub", "outId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(6+i, 2).Range.Text = printObj.catNo == null?"":printObj.catNo;
                Tables.Item(1).Cell(6+i, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6+i, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6+i, 5).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(1).Cell(6+i, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6+i, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6+i, 8).Range.Text = printObj.money == null?"0":printObj.money;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(6, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(6, 2).Range.Text = printObj.catNo == null?"":printObj.catNo;
                Tables.Item(1).Cell(6, 3).Range.Text = printObj.catName == null?"":printObj.catName;
                Tables.Item(1).Cell(6, 4).Range.Text = printObj.spec == null?"":printObj.spec;
                Tables.Item(1).Cell(6, 5).Range.Text = printObj.realNum == null?"0":printObj.realNum;
                Tables.Item(1).Cell(6, 6).Range.Text = printObj.unit==null?"":printObj.unit;
                Tables.Item(1).Cell(6, 7).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(6, 8).Range.Text = printObj.money == null?"0":printObj.money;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(6, 1).Range.Select();                   
            }
            var allMoney = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               allMoney += printObj.money;
            }
            Tables.Item(1).Cell(6+objArr.length+1, 8).Range.Text = allMoney;
        }
    }
}


/**
 * 主体设备/材料入库单打印
 * @author zhangh 2014-05-21
 */
function printData_EquBodysInPrintView(_modetype){
    var objArr = new Array();
    DWREngine.setAsync(false);
    //国峰目前主体设备入库和主体材料入库打印单据相同，因此使用相同方法
    var _beansub = "com.sgepit.pmis.equipment.hbm.EquBodysInsubPrintView";
    if(_modetype == "SB"){
        _beansub = "com.sgepit.pmis.equipment.hbm.EquBodysInsubPrintView";
    }else if(_modetype == "NewCL"){
        _beansub = "com.sgepit.pmis.wzgl.hbm.WzBodysInsubPrintView";
    }
    baseDao.findByWhere2(_beansub, "inuids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.bodyname == null?"":printObj.bodyname;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.mustnum == null?"0":printObj.mustnum;
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.realnum == null?"0":printObj.realnum;
                
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.taxrate == null?"0":String(printObj.taxrate);
                if(printObj.realnum == '0') {
                	Tables.Item(1).Cell(7+i, 8).Range.Text ="0";
                }else{
                	Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.realnum == null?"0":String((printObj.amountmoney+printObj.taxes)/printObj.realnum);
                }
                Tables.Item(1).Cell(7+i, 9).Range.Text = (printObj.amountmoney == null && printObj.taxes == null)?"0":String(printObj.amountmoney+printObj.taxes);
           
                
                Tables.Item(1).Cell(7+i, 10).Range.Text = printObj.unitprice == null?"0":printObj.unitprice;
                Tables.Item(1).Cell(7+i, 11).Range.Text = printObj.amountmoney == null?"0":printObj.amountmoney;
                Tables.Item(1).Cell(7+i, 12).Range.Text = printObj.taxes == null?"0":printObj.taxes;
                Tables.Item(1).Cell(7+i, 13).Range.Text = printObj.freightmoney == null?"0":printObj.freightmoney;
                Tables.Item(1).Cell(7+i, 14).Range.Text = printObj.othermoney == null?"0":printObj.othermoney;
                Tables.Item(1).Cell(7+i, 15).Range.Text = printObj.intomoney == null?"0":printObj.intomoney;
                Tables.Item(1).Cell(7+i, 16).Range.Text = printObj.totalmoney == null?"0":printObj.totalmoney;
                Tables.Item(1).Cell(7+i, 17).Range.Text = printObj.inplace == null?"":printObj.inplace;
            }                   
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.bodyname == null?"":printObj.bodyname;
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.mustnum == null?"0":printObj.mustnum;
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.realnum == null?"0":printObj.realnum;
                
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.taxrate == null?"0":String(printObj.taxrate);
                if(printObj.realnum == '0') {
                	Tables.Item(1).Cell(7, 8).Range.Text ="0";
                }else{
                	Tables.Item(1).Cell(7, 8).Range.Text = printObj.realnum == null?"0":String((printObj.amountmoney+printObj.taxes)/printObj.realnum);
                }
                Tables.Item(1).Cell(7, 9).Range.Text = (printObj.amountmoney == null && printObj.taxes == null)?"0":String(printObj.amountmoney+printObj.taxes);
                
                Tables.Item(1).Cell(7, 10).Range.Text = printObj.unitprice == null?"0":printObj.unitprice;
                Tables.Item(1).Cell(7, 11).Range.Text = printObj.amountmoney == null?"0":printObj.amountmoney;
                Tables.Item(1).Cell(7, 12).Range.Text = printObj.taxes == null?"0":printObj.taxes;
                Tables.Item(1).Cell(7, 13).Range.Text = printObj.freightmoney == null?"0":printObj.freightmoney;
                Tables.Item(1).Cell(7, 14).Range.Text = printObj.othermoney == null?"0":printObj.othermoney;
                Tables.Item(1).Cell(7, 15).Range.Text = printObj.intomoney == null?"0":printObj.intomoney;
                Tables.Item(1).Cell(7, 16).Range.Text = printObj.totalmoney == null?"0":printObj.totalmoney;
                Tables.Item(1).Cell(7, 17).Range.Text = printObj.inplace == null?"":printObj.inplace;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var num9 = num11 = num12 = num13 = num14 = num16 = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               num9 += (printObj.amountmoney + printObj.taxes);
               num11 += printObj.amountmoney;
               num12 += printObj.taxes;
               num13 += printObj.freightmoney;
               num14 += printObj.othermoney;
               num16 += printObj.totalmoney;
            }
            //由于当前文档“总计”行，“总计”单元格向后合并和3个单元格，因此打印的单元格列-3
            Tables.Item(1).Cell(7+objArr.length+1, 9-3).Range.Text = num9;
            Tables.Item(1).Cell(7+objArr.length+1, 11-3).Range.Text = num11;
            Tables.Item(1).Cell(7+objArr.length+1, 12-3).Range.Text = num12;
            Tables.Item(1).Cell(7+objArr.length+1, 13-3).Range.Text = num13;
            Tables.Item(1).Cell(7+objArr.length+1, 14-3).Range.Text = num14;
            Tables.Item(1).Cell(7+objArr.length+1, 16-3).Range.Text = num16;
        }
    }
}

/**
 * 主体设备/材料出库单打印
 * @author zhangh 2014-05-21
 */
function printData_EquBodysOutPrintView(_modetype){
    var objArr = new Array();
    DWREngine.setAsync(false);
    //国峰目前主体设备出库和主体材料出库打印单据相同，因此使用相同方法
    var _beansub = "com.sgepit.pmis.equipment.hbm.EquBodysOutsubPrintView";
    if(_modetype == "SB"){
        _beansub = "com.sgepit.pmis.equipment.hbm.EquBodysOutsubPrintView";
    }else if(_modetype == "NewCL"){
        _beansub = "com.sgepit.pmis.wzgl.hbm.WzBodysOutsubPrintView";
    }
    baseDao.findByWhere2(_beansub, "outuids='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    if (objArr != null && objArr.length>0){
    	var special = objArr[0].special;
    	if (special){
    		TANGER_OCX_OBJ.SetBookmarkValue("SPECIAL", special);
    	}
    }
    ocxBookMarks('ROWNUM').Select();
    with(TANGER_OCX_OBJ.ActiveDocument){
        var rowNum = Application.Selection.Text;
        if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7+i, 1).Range.Text = i*1+1;
                Tables.Item(1).Cell(7+i, 2).Range.Text = printObj.bodyname == null?"":printObj.bodyname;
                Tables.Item(1).Cell(7+i, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7+i, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(7+i, 5).Range.Text = printObj.outnum == null?"0":printObj.outnum;
                Tables.Item(1).Cell(7+i, 6).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7+i, 7).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                Tables.Item(1).Cell(7+i, 8).Range.Text = printObj.useparts == null?"":printObj.useparts;
                Tables.Item(1).Cell(7+i, 9).Range.Text = printObj.memo == null?"":printObj.memo;
            }
        }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            for(var i=0;i<objArr.length;i++){
                var printObj = objArr[i];
                Tables.Item(1).Cell(7, 1).Range.Text = objArr.length - i;
                Tables.Item(1).Cell(7, 2).Range.Text = printObj.bodyname == null?"":printObj.bodyname;
                Tables.Item(1).Cell(7, 3).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
                Tables.Item(1).Cell(7, 4).Range.Text = printObj.unit == null?"":printObj.unit;
                Tables.Item(1).Cell(7, 5).Range.Text = printObj.outnum == null?"0":printObj.outnum;
                Tables.Item(1).Cell(7, 6).Range.Text = printObj.price == null?"0":String(printObj.price);
                Tables.Item(1).Cell(7, 7).Range.Text = printObj.amount == null?"0":String(printObj.amount);
                Tables.Item(1).Cell(7, 8).Range.Text = printObj.useparts == null?"":printObj.useparts;
                Tables.Item(1).Cell(7, 9).Range.Text = printObj.memo == null?"":printObj.memo;
                if(i<objArr.length-1)
                    Application.Selection.Rows.Add(Application.Selection.Rows(1));
                Tables.Item(1).Cell(7, 1).Range.Select();                   
            }
            var num7 = 0;
            for(var k=0;k<objArr.length;k++){
               var printObj = objArr[k];
               num7 += printObj.amount;
            }
            //由于当前文档“总计”行，“总计”单元格向后合并和1个单元格，因此打印的单元格列-1
            Tables.Item(1).Cell(7+objArr.length+1, 7-1).Range.Text = num7;
        }
    }
}

/**
 * 设备退库单打印
 * @author yuanxuyun 2014-09-15
 */
function printData_EquGoodsStoreTk(_modetype){
    var objArr = new Array();
    DWREngine.setAsync(false);
    var _beansub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkSubView";
   
    baseDao.findByWhere2(_beansub, "tkId='"+_uids+"'",function(list){
        objArr = list;
    });
    DWREngine.setAsync(false);
    if (objArr != null && objArr.length>0){
    	var jzName = objArr[0].jzName;
    	if (jzName){
    		TANGER_OCX_OBJ.SetBookmarkValue("JZNO", jzName);
    	}
    }
   
    if(_modetype=="SBTK" && _filetype =='EquGoodsStoreTkView') {
    	ocxBookMarks('ROWNUM').Select();
    	with(TANGER_OCX_OBJ.ActiveDocument){
    		var rowNum = Application.Selection.Text;
    		if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
    			for(var i=0;i<objArr.length;i++){
    				var printObj = objArr[i];
    				Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
    				Tables.Item(2).Cell(2, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
    				Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
    				Tables.Item(2).Cell(2, 4).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
    				Tables.Item(2).Cell(2, 5).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
    				Tables.Item(2).Cell(2, 6).Range.Text = printObj.unit == null?"":printObj.unit;
    				Tables.Item(2).Cell(2, 7).Range.Text = printObj.tkNum == null?"0":String(printObj.tkNum);
    				Tables.Item(2).Cell(2, 8).Range.Text = printObj.remark == null?"":printObj.remark;
    			}
    		}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
    			for(var i=0;i<objArr.length;i++){
    				var printObj = objArr[i];
    				Tables.Item(2).Cell(2, 1).Range.Text = objArr.length - i;
    				Tables.Item(2).Cell(2, 2).Range.Text = printObj.graphNo == null?"":printObj.graphNo;
    				Tables.Item(2).Cell(2, 3).Range.Text = printObj.boxNo == null?"":printObj.boxNo;
    				Tables.Item(2).Cell(2, 4).Range.Text = printObj.equPartName == null?"":printObj.equPartName;
    				Tables.Item(2).Cell(2, 5).Range.Text = printObj.ggxh == null?"":printObj.ggxh;
    				Tables.Item(2).Cell(2, 6).Range.Text = printObj.unit == null?"":printObj.unit;
    				Tables.Item(2).Cell(2, 7).Range.Text = printObj.tkNum == null?"0":String(printObj.tkNum);
    				Tables.Item(2).Cell(2, 8).Range.Text = printObj.remark == null?"":printObj.remark;
    				if(i<objArr.length-1)
    					Application.Selection.Rows.Add(Application.Selection.Rows(1));
    				Tables.Item(2).Cell(2, 1).Range.Select();    
    			}
    			
    		}
    	}
    }
   
}