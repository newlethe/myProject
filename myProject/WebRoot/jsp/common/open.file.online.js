
/**
 * 在线打开office文档，都调用/servlet/BlobCrossDomainServlet，兼容山西项目跨域远程在线打开
 * 目前大对象分别存放在APP_BLOB和SGCC_ATTACH_BLOB两张表，需分别进行处理。
 * @author zhangh 2013-11-19
 * @param _filetype：在线打开文件类型，分别为：appfile为APP_BLOB的大对象，sgccfile为SGCC_ATTACH_BLOB的大对象
 * @param _fileid：文件流水号
 */
var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet?ac="+_filetype+"&fileid=" + _fileid + "&pid=" + CURRENTAPPID;
alert(_ModuleLVL)
Ext.onReady(function(){
    var panel = new Ext.Panel({
        id : "docpanel",
        region : "center",
        border : false,
        split : true,
        contentEl : 'ocxDic',
        tbar : ['-','<font color=#15428b><B>Office文件在线查看<B></font>','-',{
	        text : '下载文档',
	        iconCls : 'save',
            hidden : (_ModuleLVL == "3") ? true : false,
	        handler : function(){
	            document.all.formAc.action = openUrl;
	            document.all.formAc.submit();
	        }
	    },'-',{
	        text : '连接打印机',
	        iconCls : 'print',
            hidden : (_ModuleLVL == "3") ? true : false,
	        handler : function(){
	            TANGER_OCX_PrintDoc();
	        }
	    }]
    });
    var viewport = new Ext.Viewport({
        layout: 'fit',
        border: false,
        items: [panel]
    });
    
// try{
// TANGER_OCX_OpenDoc(openUrl,_fileid);
//        TANGER_OCX_SetReadOnly(true);
//    }catch(e){
//        alert("11111")
//    }

    init();
});

function init(){
    TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
    if (TANGER_OCX_OBJ === null || TANGER_OCX_OBJ === "undefined") {
        return false;
    }
    try {
        displayOCX(true);
        TANGER_OCX_OBJ.OpenFromURL(openUrl, false);
        if(_ModuleLVL == "3"){
	        TANGER_OCX_SetReadOnly(true);
        }
    } catch (err) {
        displayOCX(false);
        document.getElementById('ocxDic').innerHTML = "<div style='color:red;margin:30px;font:14px/20px \"宋体\"';>此文档不支持在线打开！只能在线打开Office文件！<br>请点击<input type='button' value='下载文档' onclick='javascript:downFile()'>，下载后查看！</span>"
    } finally {
    }  
}

function downFile(){
    document.all.formAc.action = openUrl;
    document.all.formAc.submit();
}

window.onbeforeunload = function(){
    
}

