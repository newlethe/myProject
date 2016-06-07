package com.sgepit.frame.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dhtmlx.connector.ConnectorBehavior;
import com.dhtmlx.connector.ConnectorOutputWriter;
import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.DataItem;
import com.dhtmlx.connector.FilteringRule;
import com.dhtmlx.connector.SortingRule;

/**
 * @author 吴运来
 * 
 */
public class DhxCustomerBehavior extends ConnectorBehavior {
	private ConnectorBehavior instance;
	private String regex = ";";
	String behavirors;
	String fields;
	String values;
	Map<String, List<Map<String, String>>> behavirorMap;
	public static Map<String,String> propsMap = new HashMap<String,String>();

	static{
		try{
			InputStream is = DhxCustomerBehavior.class.getResourceAsStream("/dberror.properties");
			Properties p = new Properties();
			p.load(is);
			Enumeration<String> emt = (Enumeration<String>) p.propertyNames();
			for(;emt.hasMoreElements();){
				String code = emt.nextElement();
				propsMap.put(code, p.getProperty(code));
			}
			is.close();
		}catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 
	 */
	public DhxCustomerBehavior() {
		// TODO Auto-generated constructor stub
		super();
	}

	/**
	 * 
	 */
	public DhxCustomerBehavior(String behavirors, String fields, String values) {
		// TODO Auto-generated constructor stub
		super();
		this.behavirors = behavirors;
		this.fields = fields;
		this.values = values;
		String[] behavirorArr = behavirors.split(regex);
		String[] fieldArr = fields.split(regex);
		String[] valueArr = values.split(regex);
		for (int i = 0; i < behavirorArr.length; i++) {
			List<Map<String, String>> list = new ArrayList<Map<String, String>>();
			Map map = new HashMap();
			map.put("behaviror", behavirorArr[i]);
			map.put("field", fieldArr[i]);
			map.put("value", valueArr[i]);
			list.add(map);
			List<Map<String, String>> fieldValueList = behavirorMap
					.get(behavirorArr[i]);
			if (fieldValueList == null) {
				fieldValueList = list;
			} else {
				fieldValueList.addAll(list);
			}
			behavirorMap.put(behavirorArr[i], fieldValueList);
		}
	}

	/**
	 * @param args
	 */
//	public static void main(String[] args) {
//		// TODO Auto-generated method stub
//		SortingRule sr = new SortingRule("dassdf", "asdf");
//		ArrayList<SortingRule> t = new ArrayList<SortingRule>();
//		t.add(sr);
//		t.add(sr);
//		System.out.println(t.getClass().isArray());
//		System.out.println(t.getClass().getName());
//		System.out.println(t.getClass().getSimpleName());
//		System.out.println(t.getClass().isInstance(ArrayList.class));
//		System.out.println(t.getClass().getEnumConstants());
//		System.out.println(t.getClass());
//		ArrayList tt = (ArrayList) t;
//		Object o = tt.get(0);
//		System.out.println(o.getClass().getSimpleName());
//		String match="ORA[0-9]{5}";
//		String sd="ORA00904";
//		System.out.println("::::"+sd.matches(match));
//
//	}

	/**
	 * Before sort event
	 * 
	 * Occurs in selection mode, when incoming request parsed and before data
	 * selection from DB
	 */
	public void beforeSort(ArrayList<SortingRule> sorters) {
		if (instance != null)
			instance.beforeSort(sorters);
		setBehaviror("beforeSort", sorters);
	}

	/**
	 * Before filter event
	 * 
	 * Occurs in selection mode, when incoming request parsed and before data
	 * selection from DB
	 */
	public void beforeFilter(ArrayList<FilteringRule> filters) {
		if (instance != null)
			instance.beforeFilter(filters);
		setBehaviror("beforeFilter", filters);
	}

	/**
	 * Before render event
	 * 
	 * Occurs in selection mode. Event logic called for rendering of each item.
	 * Related data item is provided as parameter of the called method.
	 * 
	 * @param data
	 *            the data item
	 */
	public void beforeRender(DataItem data) {
		if (instance != null)
			instance.beforeRender(data);
		setBehaviror("beforeRender", data);
	}

	/**
	 * Before processing event
	 * 
	 * Occurs in update mode, before execution any DB operations. Event logic
	 * called for each updated record. Related data action is provided as
	 * parameter of the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void beforeProcessing(DataAction action) {
		if (instance != null)
			instance.beforeProcessing(action);
		setBehaviror("beforeProcessing", action);
	}

	/**
	 * After DB error event
	 * 
	 * Occurs in update mode, after some DB error Related error object is
	 * provided as parameter of the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void afterDBError(DataAction action, Throwable e) {
		if (instance != null)
			instance.afterDBError(action, e);
		setBehaviror("afterDBError", action, e);
	}

	/**
	 * After processing event
	 * 
	 * Occurs in update mode, after execution any DB operations. Event logic
	 * called for each updated record. Related data action is provided as
	 * parameter of the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void afterProcessing(DataAction action) {
		if (instance != null)
			instance.afterProcessing(action);
		setBehaviror("beforeDelete", action);
	}

	/**
	 * Before delete event
	 * 
	 * Occurs in update mode, before deleting record from DB Event logic called
	 * for each updated record. Related data action is provided as parameter of
	 * the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void beforeDelete(DataAction action) {
		if (instance != null)
			instance.beforeDelete(action);
		setBehaviror("beforeDelete", action);
	}

	/**
	 * Before insert event
	 * 
	 * Occurs in update mode, before inserting record in DB Event logic called
	 * for each updated record. Related data action is provided as parameter of
	 * the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	@Override
	public void beforeInsert(DataAction action) {
		if (instance != null)
			instance.beforeInsert(action);
		setBehaviror("beforeInsert", action);
	}

	/**
	 * Before update event
	 * 
	 * Occurs in update mode, before updating record in DB Event logic called
	 * for each updated record. Related data action is provided as parameter of
	 * the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void beforeUpdate(DataAction action) {
		if (instance != null)
			instance.beforeUpdate(action);
		setBehaviror("beforeUpdate", action);
	}

	/**
	 * After delete event
	 * 
	 * Occurs in update mode, after deleting record from DB Event logic called
	 * for each updated record. Related data action is provided as parameter of
	 * the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void afterDelete(DataAction action) {
		if (instance != null)
			instance.afterDelete(action);
		setBehaviror("afterDelete", action);
	}

	/**
	 * After insert event
	 * 
	 * Occurs in update mode, after inserting record in DB Event logic called
	 * for each updated record. Related data action is provided as parameter of
	 * the called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void afterInsert(DataAction action) {
		if (instance != null)
			instance.afterInsert(action);
		setBehaviror("afterInsert", action);
	}

	/**
	 * After update event
	 * 
	 * Occurs in update mode, after updating record in DB Event logic called for
	 * each updated record. Related data action is provided as parameter of the
	 * called method.
	 * 
	 * @param action
	 *            the data action
	 */
	public void afterUpdate(DataAction action) {
		if (instance != null)
			instance.afterUpdate(action);
		setBehaviror("afterUpdate", action);
	}

	/**
	 * Before output event
	 * 
	 * Event occurs before rendering output of connector. It can be used to
	 * inject any extra data in the output
	 * 
	 * @param out
	 *            xml string
	 * @param http_request
	 *            the http request
	 */
	public void beforeOutput(ConnectorOutputWriter out,
			HttpServletRequest http_request, HttpServletResponse http_response) {
		if (instance != null)
			instance.beforeOutput(out, http_request, http_response);
		setBehaviror("beforeOutput", out, http_request, http_response);
	}

	private void setBehaviror(String type, Object... objects) {
		DataAction dataAction = null;
		DataItem dataItem = null;
		Throwable throwable = null;
		ArrayList<SortingRule> sortingRuleList = null;
		ArrayList<FilteringRule> filteringRuleList = null;
		ConnectorOutputWriter out = null;
		HttpServletRequest http_request = null;
		HttpServletResponse http_response = null;
		for (Object object : objects) {
			if (DataAction.class.isInstance(object)) {
				dataAction = (DataAction) object;
			}
			if (DataItem.class.isInstance(object)) {
				dataItem = (DataItem) object;
			}
			if (Throwable.class.isInstance(object)) {
				throwable = (Throwable) object;
			}
			if (ConnectorOutputWriter.class.isInstance(object)) {
				out = (ConnectorOutputWriter) object;
			}
			if (HttpServletRequest.class.isInstance(object)) {
				http_request = (HttpServletRequest) object;
			}
			if (HttpServletResponse.class.isInstance(object)) {
				http_response = (HttpServletResponse) object;
			}
			if (object.getClass().getSimpleName().equals("ArrayList")) {
				ArrayList list = (ArrayList) object;
				if (list.size() > 0) {
					Object o = list.get(0);
					if (SortingRule.class.isInstance(o)) {
						sortingRuleList = (ArrayList<SortingRule>) object;
					}
					if (FilteringRule.class.isInstance(o)) {
						filteringRuleList = (ArrayList<FilteringRule>) object;
					}
				}
			}
		}
		if(behavirorMap!=null){
			List<Map<String, String>> fieldValueList = behavirorMap.get(type);
			for (Map<String, String> fieldValueMap : fieldValueList) {
				String field = fieldValueMap.get("field");
				if (field != null && !field.trim().equals("")) {
					String value = fieldValueMap.get("value");
					if (value != null) {
						if (type.equalsIgnoreCase("beforeRender")) {
							dataItem.set_value(field, value);
						} else if (type.equalsIgnoreCase("beforeSort")) {
							SortingRule sortingRule = new SortingRule(field,value);
							sortingRuleList.add(sortingRule);
						} else if (type.equalsIgnoreCase("beforeFilter")) {
							FilteringRule filteringRule = new FilteringRule(field,value);
							filteringRuleList.add(filteringRule);
						} else if (type.equalsIgnoreCase("afterDBError")) {
							//dataAction.error();
							//setBehaviror("afterDBError", dataAction, throwable);
						} else if (type.equalsIgnoreCase("beforeOutput")) {
							//setBehaviror("beforeOutput", out, http_request, http_response);
						} else {
							dataAction.set_value(field, value);
						}
					}
				}
			}
		}
		if (type.equalsIgnoreCase("afterDBError")) {
			String match="(ORA)-[0-9]{5}";
			String message=throwable.getMessage();
			Pattern p = Pattern.compile(match);  
	        Matcher m = p.matcher(message);
	        String returnText="操作失败";
	        if(m.find()) {  
	        	String value=propsMap.get(m.group(0));
	        	if(value!=null&&value.length()>0){
	        		returnText+=","+value;
	        	}
	        }
			dataAction.set_response_text(returnText);
		}
	}

}
