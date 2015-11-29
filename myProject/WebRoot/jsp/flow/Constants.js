var F_TYPE = [
	['0','单向'],
	['1','会签'],
	['2','优先处理'],
	['3','任务'],
	['4','完成会签'],
	['5','完成优先处理'],
	['6','完成任务'],
	['8','拒绝关闭流程'],
	['9','状态改变'],
	['10','退回'],
	['11','退回发起人'],
	['12','退回-状态'],
	['13','退回发起人-状态'],
	['0A','单向-发起'],
	['1A','会签-发起'],
	['2A','优先处理-发起'],
	['7','业务流转'],
	['7A','流程状态-发起'],
	['7T','业务退回'],
	['P','审批流转'],
	['T','审批退回'],
	['TA','退回发起人'],
	['W','完成合并'],
	['S','抄送']
];
var beanLog = "com.sgepit.frame.flow.hbm.TaskView";//日志
var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";//状态节点
var userBean = "com.sgepit.frame.sysman.hbm.RockUser";//用户
var roleBean = "com.sgepit.frame.sysman.hbm.RockRole";//角色
var fileBean = "com.sgepit.frame.flow.hbm.FlwFiles";
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var faceBean = "com.sgepit.frame.flow.hbm.FlwFace";//流程任务接口
var faceParamsBean = "com.sgepit.frame.flow.hbm.FlwFaceParams";
var faceParamsInsBean = "com.sgepit.frame.flow.hbm.FlwFaceParamsIns";
var nodeFunModBean = "com.sgepit.frame.flow.hbm.NodeFunModView";//节点任务
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";//流程附件
var insBean = "com.sgepit.frame.flow.hbm.FlwInstanceView";//流程实例
var insDataBean = "com.sgepit.frame.flow.hbm.InsDataInfoView";
var commonNodeBean = "com.sgepit.frame.flow.hbm.FlwCommonNode";//普通节点
var commonNodePathBean = "com.sgepit.frame.flow.hbm.FlwCommonNodePath";//普通节点路由
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];
//流程状态名称获取
function getFType(type){
	for (var i = 0; i < F_TYPE.length; i++) {
		if (F_TYPE[i][0] == type) return F_TYPE[i][1];
	}
}
//机组号
function jzhRender(value){
	var str = '';
	for(var i=0; i<jzhType.length; i++) {
		if (jzhType[i][0] == value) {
			str = jzhType[i][1]
			break; 
		}
	}
	return str;
};
//物资类型
function wztypeRender(value){
	var result = '';
	if('2' == value)result='设备';
	else if('3' == value)result='备品备件';
	else if('4' == value)result='专用工具';
	else result = '';
	return result;
} ;  
//过滤转换日期型格式
function dateFilter(value){
	try{
		value = formatDate(value);
	}catch(err){
	}finally{
		return value;
	}
};
function formatDate(value){
	if ( value.dateFormat ){
		return value ? value.dateFormat('Y-m-d H:i:s') : '';
	}
	else{
		return value;
	}
    
};
//显示或隐藏控件
function displayOCX(flag){
	var ocxDom = document.getElementById('TANGER_OCX');
	if(ocxDom){
		if(flag){
			ocxDom.style.display = 'block';
		}else{
			ocxDom.style.display = 'none';
		}
	}
}


/*
 * 在流程文档打开前隐藏空间，并对流程文档是否存在进行判断
 * 2013-9-18 zhangh
 * 为了统一化处理，所有office控件在jsp页面的对象的隐藏和显示，都通过ocxTab来控制
 */

/**
 * 判断流程需要打开的文档在数据库中是否存在，
 * 分2种情况：
 * 1.fileid对应的APP_BLOB中主记录不存在；
 * 2.主记录存在，APP_BLOB中的blob字段为空；
 * 不考虑打开过程中网络原因导致文档加载失败的情况
 * @param {} fileid
 * @return {}
 */
function flwFileIsExist(fileid){
    var flag = true;
    DWREngine.setAsync(false);
    var sql = "select dbms_lob.getlength(blob) from app_blob where fileid = '"+fileid+"'";
    baseMgm.getData(sql,function(list){
        if(list == null || list == ''){
            flag = false;
            alert("流程文件不存在，或上一步未保存成功，请检查后重试！")
        }
    });
    DWREngine.setAsync(true);
    return flag;
}


/**
 * 打开文档，打开前先判断文档是否存在；
 * 打开前先隐藏控件，打开成功后再显示
 * @param {} url
 * @param {} fileid
 */
function openFlwFile(url, fileid){
    if(flwFileIsExist(fileid)){ 
        displayOCX(false);
        TANGER_OCX_OpenDoc(url, fileid);
        displayOCX(true);
    }
}


/**
 * 修改后保存文档
 * @param {} url
 * @param {} params
 * @param {} filename
 */
function saveFlwFile(url,params,filename){
    var ocxDom = document.getElementById('TANGER_OCX');
    if(ocxDom){
        ocxDom.SaveToURL(url,'EDITFILE',params,filename);
    }else{
        alert('office控件异常，请检查后重试！');
    }
}

/**
 * 页面离开时，隐藏office控件
 */
window.onbeforeunload = function(){
    displayOCX(false);
}
