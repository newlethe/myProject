package com.sgepit.pmis.gantt.Edo.util;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.JsonConfig;


public class Json {
	
	public static String encode(Object obj) {
		if(obj == null) return "";
		if(obj instanceof List) { 
			JsonConfig jsonConfig = new JsonConfig(); 
			//Map<String,Object> classMap = new HashMap<String,Object>();
			Map classMap = new HashMap();
			classMap.put("*", HashMap.class);
			jsonConfig.setClassMap(classMap);
			jsonConfig.registerJsonValueProcessor(Timestamp.class, new JsonDateProcessor());
			jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateProcessor());
			return JSONSerializer.toJSON((List)obj, jsonConfig).toString();
		} else if(obj instanceof Map){
			JsonConfig jsonConfig = new JsonConfig(); 
			jsonConfig.registerJsonValueProcessor(Timestamp.class, new JsonDateProcessor());
			jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateProcessor());
			return JSONSerializer.toJSON((Map)obj, jsonConfig).toString();
		} else { 
			return obj.toString();
		}
	}
	
	/**
	 * json反序列化
	 * @param json
	 * @return
	 */
	public static Object decode(String json) {
		if(json.startsWith("[")) {
			JsonConfig jsonConfig = new JsonConfig();
			jsonConfig.setRootClass(HashMap.class);
			//Map<String,Object> classMap = new HashMap<String,Object>();
			Map classMap = new HashMap();
			classMap.put("*", HashMap.class);
			jsonConfig.setClassMap(classMap);						
			List o = (List)JSONSerializer.toJava(JSONArray.fromObject(json), jsonConfig);//
			return toObject(o);
		} else if(json.startsWith("{")) {
			JsonConfig jsonConfig = new JsonConfig(); 
			jsonConfig.setRootClass(HashMap.class);
			//Map<String,Object> classMap = new HashMap<String,Object>();
			Map classMap = new HashMap();
			classMap.put("*", HashMap.class);
			jsonConfig.setClassMap(classMap);						
			Map o = (Map)JSONObject.toBean(JSONObject.fromObject(json),jsonConfig);
			return toObject(o);
		} else {
			return null;
		}
	}
	private static Object toObject(Object o){
		if(o == null) return null;
		Class cls = o.getClass(); 
		if(cls == ArrayList.class){
			List list = new ArrayList();
			list.addAll((List)o);
			for(int i=0,l=list.size(); i<l; i++){
				list.set(i, toObject(list.get(i)));
			}
			o = list;
		}else if(cls == HashMap.class){
			Map h = new HashMap();
			Map<String, Object> jo = (Map<String, Object>)o;			
	        for(Map.Entry<String, Object> entry : jo.entrySet()){                   
	            String key = entry.getKey();
	            Object v = entry.getValue();
	            h.put(key, toObject(v));
	        }
	        o = h;
		}else if(cls == JSONObject.class){
			if(o.toString().equals("null")) o = null;
		}
		return o;		
	}
}
