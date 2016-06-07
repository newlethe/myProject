/** 
 * Title:        数据交互服务应用: 
 * Description:  事件模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.util.List;
import java.util.Map;

import org.dom4j.Element;
/**
 * 事件模型应用
 * 主要处理sql及脚本事件，以此适应数据交互过程中特殊事件的处理
 * @author lizp 
 * @date 2010-8-20
 * sql事件主要应用于在交互过程中在交互前或后进行相关更新操作
 * 脚本事件主要应用于动态执行webservice，以及相关操作
 */
public class EventBean {
	private String name ;  //事件名称
	private String type ;  //事件类型(sql,script)
	private String id ;  //事件id
	private String text ;  //事件内容
	private Map<String,Object> variables ;  //事件参数
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Map<String, Object> getVariables() {
		return variables;
	}
	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}
	
	/**
	 * 设置Script事件属性
	 * @param event
	 * @param variables
	 */
	public void setScriptEventValues(String event, Map<String, Object> variables) {
		this.type = "script" ;
		this.text = event ;
		this.variables = variables ;
	}
	
	/**
	 * 设置sql事件属性
	 * @param sql
	 */
	public void setSqlEventValues(String sql) {
		this.type = "sql" ;
		this.text = sql ;
	}
	
	/**
	 * 设置xml属性
	 * @param element
	 */
	public void setXmlValues(Element element) {
		if(this.id!=null) {
			element.addAttribute("id", this.id) ;
		}
		if(this.name!=null) {
			element.addAttribute("name", this.name) ;
		}
		if(this.type!=null) {
			element.addAttribute("type", this.type) ;
		}
		if(this.id!=null) {
			element.addAttribute("id", this.id) ;
		}
		if(this.text!=null) {
			element.setText(this.text) ;
		}
	}
	
	/**
	 * 将xml数据绑定到bean
	 * @param e
	 */
	public void bandXmlToBean(Element e) {
		String id = e.attributeValue("id") ;
		if(id!=null) {
			this.id = id ;
		}
		String name = e.attributeValue("name") ;
		if(name!=null) {
			this.name = name ;
		}
		String type = e.attributeValue("type") ;
		if(type!=null) {
			this.type = type ;
		}
		String text = e.getText() ;
		if(text!=null) {
			this.text = text ;
		}
	}
}
