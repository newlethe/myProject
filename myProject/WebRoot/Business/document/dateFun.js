//计算日期间隔天数   
  function DateCompare(asStartDate, asEndDate) {   
    var miStart = Date.parse(asStartDate.replace(/\-/g, '/'));   
    var miEnd = Date.parse(asEndDate.replace(/\-/g, '/'));   
    return (miEnd - miStart) / (1000 * 24 * 3600);   
  }     
  
  //日期时间相加   
  function addDate(type, NumDay, dtDate) {   
    var date = new Date(dtDate);   
    type = parseInt(type); //类型        
    lIntval = parseInt(NumDay);//间隔      
    switch (type) {   
    case 6://年      
      date.setYear(date.getYear() + lIntval)   
      break;   
    case 7://季度      
      date.setMonth(date.getMonth() + (lIntval * 3))   
      break;   
    case 5://月      
      date.setMonth(date.getMonth() + lIntval)   
      break;   
    case 4://天      
      date.setDate(date.getDate() + lIntval)   
      break  
    case 3://时      
      date.setHours(date.getHours() + lIntval)   
      break  
    case 2://分      
      date.setMinutes(date.getMinutes() + lIntval)   
      break  
    case 1://秒      
      date.setSeconds(date.getSeconds() + lIntval)   
      break;   
    default:   
    }   
    return date.getYear() + '-' + (date.getMonth() + 1) + '-'  
        + date.getDate(); /*+ '   ' + date.getHours() + ':'  
        + date.getMinutes() + ':' + date.getSeconds(); */  
  } 
  
  
  
  function DateUtil(){}   
/**  
*功能:格式化时间  
*示例:DateUtil.Format("yyyy/MM/dd","Thu Nov 9 20:30:37 UTC+0800 2006 ");  
*返回:2009/12/09  
*/  
DateUtil.Format=function(fmtCode,date){   
    var result,d,arr_d;   
       
    var patrn_now_1=/^y{4}-M{2}-d{2}\sh{2}:m{2}:s{2}$/;   
    var patrn_now_11=/^y{4}-M{1,2}-d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;   
       
    var patrn_now_2=/^y{4}\/M{2}\/d{2}\sh{2}:m{2}:s{2}$/;   
    var patrn_now_22=/^y{4}\/M{1,2}\/d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;   
       
    var patrn_now_3=/^y{4}年M{2}月d{2}日\sh{2}时m{2}分s{2}秒$/;   
    var patrn_now_33=/^y{4}年M{1,2}月d{1,2}日\sh{1,2}时m{1,2}分s{1,2}秒$/;   
       
    var patrn_date_1=/^y{4}-M{2}-d{2}$/;   
    var patrn_date_11=/^y{4}-M{1,2}-d{1,2}$/;   
       
    var patrn_date_2=/^y{4}\/M{2}\/d{2}$/;   
    var patrn_date_22=/^y{4}\/M{1,2}\/d{1,2}$/;   
       
    var patrn_date_3=/^y{4}年M{2}月d{2}日$/;   
    var patrn_date_33=/^y{4}年M{1,2}月d{1,2}日$/;   
       
    var patrn_time_1=/^h{2}:m{2}:s{2}$/;   
    var patrn_time_11=/^h{1,2}:m{1,2}:s{1,2}$/;   
    var patrn_time_2=/^h{2}时m{2}分s{2}秒$/;   
    var patrn_time_22=/^h{1,2}时m{1,2}分s{1,2}秒$/;   
       
    if(!fmtCode){fmtCode="yyyy-MM-dd hh:mm:ss";}   
    if(date){   
        d=new Date(date);   
        if(isNaN(d)){   
            msgBox("时间参数非法\n正确的时间示例:\nThu Nov 9 20:30:37 UTC+0800 2006\n或\n2006/       10/17");   
            return;}   
    }else{   
        d=new Date();   
    }   
  
    if(patrn_now_1.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"-"+arr_d.MM+"-"+arr_d.dd+" "+arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_now_11.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"-"+arr_d.MM+"-"+arr_d.dd+" "+arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_now_2.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"/"+arr_d.MM+"/"+arr_d.dd+" "+arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_now_22.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"/"+arr_d.MM+"/"+arr_d.dd+" "+arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_now_3.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"年"+arr_d.MM+"月"+arr_d.dd+"日"+" "+arr_d.hh+"时"+arr_d.mm+"分"+arr_d.ss+"秒";   
    }   
    else if(patrn_now_33.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"年"+arr_d.MM+"月"+arr_d.dd+"日"+" "+arr_d.hh+"时"+arr_d.mm+"分"+arr_d.ss+"秒";   
    }   
       
    else if(patrn_date_1.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"-"+arr_d.MM+"-"+arr_d.dd;   
    }   
    else if(patrn_date_11.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"-"+arr_d.MM+"-"+arr_d.dd;   
    }   
    else if(patrn_date_2.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"/"+arr_d.MM+"/"+arr_d.dd;   
    }   
    else if(patrn_date_22.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"/"+arr_d.MM+"/"+arr_d.dd;   
    }   
    else if(patrn_date_3.test(fmtCode))   
    {   
        arr_d=splitDate(d,true);   
        result=arr_d.yyyy+"年"+arr_d.MM+"月"+arr_d.dd+"日";   
    }   
    else if(patrn_date_33.test(fmtCode))   
    {   
        arr_d=splitDate(d);   
        result=arr_d.yyyy+"年"+arr_d.MM+"月"+arr_d.dd+"日";   
    }   
    else if(patrn_time_1.test(fmtCode)){   
        arr_d=splitDate(d,true);   
        result=arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_time_11.test(fmtCode)){   
        arr_d=splitDate(d);   
        result=arr_d.hh+":"+arr_d.mm+":"+arr_d.ss;   
    }   
    else if(patrn_time_2.test(fmtCode)){   
        arr_d=splitDate(d,true);   
        result=arr_d.hh+"时"+arr_d.mm+"分"+arr_d.ss+"秒";   
    }   
    else if(patrn_time_22.test(fmtCode)){   
        arr_d=splitDate(d);   
        result=arr_d.hh+"时"+arr_d.mm+"分"+arr_d.ss+"秒";   
    }   
    else{   
        msgBox("没有匹配的时间格式!");   
        return;   
    }   
       
   return result;   
};   
function splitDate(d,isZero){   
    var yyyy,MM,dd,hh,mm,ss;   
    if(isZero){   
         yyyy=d.getYear();   
         MM=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):d.getMonth()+1;   
         dd=d.getDate()<10?"0"+d.getDate():d.getDate();   
         hh=d.getHours()<10?"0"+d.getHours():d.getHours();   
         mm=d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes();   
         ss=d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds();   
    }else{   
         yyyy=d.getYear();   
         MM=d.getMonth()+1;   
         dd=d.getDate();   
         hh=d.getHours();   
         mm=d.getMinutes();   
         ss=d.getSeconds();     
    }   
    return {"yyyy":yyyy,"MM":MM,"dd":dd,"hh":hh,"mm":mm,"ss":ss};     
}   
function msgBox(msg){   
    window.alert(msg);   
}  


function getYM(){
    var date = new Date();
    var s = date.getYear()+"-"
            + (date.getMonth()+101+"").substring(1)
    return s;
}