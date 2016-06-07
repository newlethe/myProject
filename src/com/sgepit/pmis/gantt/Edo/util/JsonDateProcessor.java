package com.sgepit.pmis.gantt.Edo.util;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;


public class JsonDateProcessor
implements JsonValueProcessor
{

public JsonDateProcessor()
{
}


public Object processObjectValue(String key, Object bean, JsonConfig jsonConfig)
{
    String jsonObject = null;
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    if(bean instanceof Date)
        bean = new java.util.Date(((Date)bean).getTime());
    if(bean instanceof Timestamp)
        bean = new java.util.Date(((Timestamp)bean).getTime());
    if(bean instanceof java.util.Date)
        jsonObject = sdf.format(bean);
    return jsonObject;
}

public Object processArrayValue(Object arg0, JsonConfig arg1) {
	return null;
}

}