/** 
 * Title:        数据交互服务应用: 
 * Description:  数据体包装模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据体包装模型
 * @author lizp
 * @Date 2010-8-10
 */
public class DataXmlBean {
	private List<EventBean> before = new ArrayList<EventBean>() ;
	private List<EventBean> after = new ArrayList<EventBean>() ;
	private String sql ;
	private String tablename = "dual" ;
	public List<EventBean> getBefore() {
		return before;
	}
	public void setBefore(List<EventBean> before) {
		this.before = before;
	}
	public List<EventBean> getAfter() {
		return after;
	}
	public void setAfter(List<EventBean> after) {
		this.after = after;
	}
	public String getSql() {
		return sql;
	}
	public void setSql(String sql) {
		this.sql = sql;
	}
	public String getTablename() {
		return tablename;
	}
	public void setTablename(String tablename) {
		this.tablename = tablename;
	}
	
	/**
	 * 增加单后置sql事件
	 * @param sql 
	 */
	public void addSqlAfter(String sql) {
		if(sql!=null&&(!"".equals(sql))) {
			EventBean bean = new EventBean() ;
			bean.setType("sql") ;
			bean.setText(sql) ;
			this.after.add(bean) ;
		}
	}
	/**
	 * 增加单前置sql事件
	 * @param sql
	 */
	public void addSqlBefore(String sql) {
		if(sql!=null&&(!"".equals(sql))) {
			EventBean bean = new EventBean() ;
			bean.setType("sql") ;
			bean.setText(sql) ;
			this.before.add(bean) ;
		}
	}
	
	/**
	 * 增加多后置sql事件
	 * @param sql
	 */
	public void addSqlListAfter(List<String> sql) {
		for(String s: sql) {
			if(s!=null) {
				addSqlAfter(s);
			}
		}
	}
	/**
	 * 增加多前置sql事件
	 * @param sql
	 */
	public void addSqlListBefore(List<String> sql) {
		for(String s: sql) {
			if(s!=null) {
				addSqlBefore(s);
			}
		}
	}
	
	/**
	 * 增加后置script事件
	 * @param script
	 */
	public void addScriptAfter(String script) {
		if(script!=null&&(!"".equals(script))) {
			EventBean bean = new EventBean() ;
			bean.setType("script") ;
			bean.setText(script) ;
			this.after.add(bean) ;
		}
	}
	/**
	 * 增加前置script事件
	 * @param script
	 */
	public void addScriptBefore(String script) {
		if(script!=null&&(!"".equals(script))) {
			EventBean bean = new EventBean() ;
			bean.setType("script") ;
			bean.setText(script) ;
			this.before.add(bean) ;
		}
	}
	
	/**
	 * 增加多后置script事件
	 * @param scripts
	 */
	public void addScriptListAfter(List<String> scripts) {
		for(String s: scripts) {
			if(s!=null) {
				addScriptAfter(s);
			}
		}
	}
	/**
	 * 增加多前置script事件
	 * @param scripts
	 */
	public void addScriptListBefore(List<String> scripts) {
		for(String s: scripts) {
			if(s!=null) {
				addScriptBefore(s);
			}
		}
	}
}
