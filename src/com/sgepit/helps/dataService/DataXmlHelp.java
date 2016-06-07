/** 
 * Title:        数据交互服务应用: 
 * Description:  数据请求应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.dataService.exception.DataHelpException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.model.DataBean;
import com.sgepit.helps.dataService.model.DataModel;
import com.sgepit.helps.dataService.model.DataRowBean;
import com.sgepit.helps.dataService.model.DataXmlBean;
import com.sgepit.helps.dataService.model.EventBean;
import com.sgepit.helps.dataService.model.HeaderBean;
import com.sgepit.helps.util.StringUtil;
/**
 * 数据请求应用(构造数据请求)
 * @author lizp
 * @Date 2010-8-10
 */
public class DataXmlHelp {
	/**
	 * 数据请求应用构造(单事件快速构造)
	 * 单脚本前置事件
	 * 将事件作为数据体模型的前置事件执行
	 * @param event 事件字符串
	 * @param variables 事件参数 
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String dynWebService(String event,Map<String,Object> variables) throws DataHelpException, DataTypeException {
		List<EventBean> before = new ArrayList<EventBean>();
		EventBean eventBean = new EventBean() ;
		eventBean.setScriptEventValues(event,variables) ;
		before.add(eventBean) ;
		return dynWebService(before) ;
	}
	
	/**
	 * 数据请求应用构造(单事件快速构造)
	 * 单前置事件
	 * @param event 事件模型
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String dynWebService(EventBean event) throws DataHelpException, DataTypeException {
		List<EventBean> before = new ArrayList<EventBean>();
		before.add(event) ;
		return dynWebService(before) ;
	}
	
	/**
	 * 数据请求应用构造(多事件构造）
	 * 多前置事件
	 * @param events 事件集合模型
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String dynWebService(List<EventBean> events) throws DataHelpException, DataTypeException {
		List<DataXmlBean>  beanList = new ArrayList<DataXmlBean>() ;
		DataXmlBean bean = new DataXmlBean();
		bean.setBefore(events) ;
		beanList.add(bean) ;
		return bulidXml(beanList) ;
	}
	
	/**
	 * 数据请求应用构造(数据交换快速构造)
	 * 数据主体应用
	 * @param sql 数据获取的sql
	 * @param tableName 交换方对应的table
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(String sql,String tableName) throws DataHelpException, DataTypeException {
		return bulidXml(new ArrayList(),sql,tableName,new ArrayList());
	}
	
	/**
	 * 数据请求应用构造(数据交换快速构造)
	 * 单前置sql事件及数据主体应用
	 * @param beforeSql 前置sql
	 * @param sql 数据获取的sql
	 * @param tableName 交换方对应的table
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(String beforeSql,String sql,String tableName) throws DataHelpException, DataTypeException {
		List<String> beforeSqlList = new ArrayList<String>() ;
		if(beforeSql!=null&&(!"".equals(beforeSql))) {
			beforeSqlList.add(beforeSql) ;
		}
		return bulidXml(beforeSqlList,sql,tableName,new ArrayList());
	}
	
	/**
	 * 数据请求应用构造(数据交换快速构造)
	 * 多前置sql事件及数据主体应用
	 * @param beforeSql 前置sql集合
	 * @param sql 数据获取的sql
	 * @param tableName 交换方对应的table
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(List<String> beforeSql,String sql,String tableName) throws DataHelpException, DataTypeException {
		return bulidXml(beforeSql,sql,tableName,new ArrayList());
	}
	
	/**
	 * 数据请求应用构造(数据交换快速构造)
	 * 单前置单后置sql事件及数据主体应用
	 * @param beforeSql 前置sql
	 * @param sql 数据获取的sql
	 * @param tableName 交换方对应的table
	 * @param afterSql 后续sql
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(String beforeSql,String sql,String tableName,String afterSql) throws DataHelpException, DataTypeException {
		List<String> beforeSqlList = new ArrayList<String>() ;
		if(beforeSql!=null&&(!"".equals(beforeSql))) {
			beforeSqlList.add(beforeSql) ;
		}
		
		List<String> afterSqlList = new ArrayList<String>() ;
		if(afterSql!=null&&(!"".equals(afterSql))) {
			afterSqlList.add(afterSql) ;
		}
		return bulidXml(beforeSqlList,sql,tableName,afterSqlList);
	}
	
	/**
	 * 数据请求应用构造(数据交换快速构造)
	 * 多前置多后置sql事件及数据主体应用
	 * @param beforeSql 前置sql集合
	 * @param sql	数据获取的sql
	 * @param tableName	交换方对应的table
	 * @param afterSql	后置sql集合
	 * @return	交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(List<String> beforeSql,String sql,String tableName,List<String> afterSql) throws DataHelpException, DataTypeException {
		List<DataXmlBean> list = new ArrayList<DataXmlBean>() ;
		DataXmlBean bean = new DataXmlBean() ;
		bean.setSql(sql) ;
		bean.setTablename(tableName) ;
		if(beforeSql!=null) {
			bean.addSqlListBefore(beforeSql) ;
		}
		if(afterSql!=null) {
			bean.addSqlListAfter(afterSql) ;
		}
		list.add(bean) ;
		return bulidXml(list);
	}
	
	/**
	 * xml构造单表数据集
	 * 通过xml中事件和数据主体标识生成数据体模型对象xml
	 * @param xml 数据体包装模型集合的xml字符串
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 * xml 格式如下：
	 * <data><list><before></before><sql></sql><tablename></tablename><after></after></list></data>
	 */
	public static String bulidXml(String xml) throws DataHelpException, DataTypeException {
		List<DataXmlBean> bean = xmlToListDataXmlBean(xml);
		return bulidXml(bean);
	}
	
	/**
	 * 数据请求应用构造(构造数据体模型对象xml)
	 * @param bean 数据体包装模型集合
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException 
	 */
	public static String bulidXml(List<DataXmlBean> bean) throws DataHelpException, DataTypeException {
		List<DataBean> dataBean = new ArrayList<DataBean>();
		if(bean!=null) {
			for(DataXmlBean b : bean) {
				DataBean d = new DataBean();
				d.setBefore(b.getBefore()) ;
				d.setAfter(b.getAfter()) ;
				DataModel datas = new DataModel();
				if(b.getSql()!=null) {
					datas.buildDataObject(b.getSql(),b.getTablename());  //构造数据结果集合
				}
				d.setDatas(datas) ;
				dataBean.add(d) ;
			}
		}
		return bulidDataXml(dataBean) ;
	}
	
	/**
	 * 数据请求应用构造(由数据体模型集合生成xml)
	 * 快速构造的实现
	 * @param bean 数据体模型集合
	 * @return 交互请求xml字符串(数据体模型的xml)
	 * @throws DataTypeException 
	 * @throws DataHelpException 
	 */
	public static String bulidDataXml(List<DataBean> bean) throws DataHelpException, DataTypeException  {
		Document document = DocumentHelper.createDocument() ;
		Element data = document.addElement("data");
		for(DataBean dataBean : bean) {
			Element table = data.addElement("table");
			bulidEvent(table,dataBean);
			DataModel dataModel = dataBean.getDatas();
			if(dataModel!=null) {
				bulidDatasXml(table,dataModel) ;
			}
		}
		return document.asXML() ;
	}
	
	/**
	 * 数据体模型数据部分生成xml
	 * 数据体模型集合生成xml的实现
	 * @param table xml对象中的table对象
	 * @param dataModel 数据体模型中的数据主体模型
	 * @throws DataTypeException 
	 * @throws DataServiceException 
	 */
	private static void bulidDatasXml(Element table, DataModel dataModel) throws DataHelpException, DataTypeException  {
		String tableName = dataModel.getTableName() ;
		List<DataRowBean> datas = dataModel.getDatas();
		List<HeaderBean> headers = dataModel.getHeader();
		if(datas!=null&&datas.size()>0&&headers!=null&&headers.size()>0)  {
			if(tableName==null) {
				throw new DataHelpException("缺少表名！");
			}
			Element header = table.addElement("header");
			dataModel.buildHeader(header);  //数据头
			dataModel.buildDatas(table); //数据主体
			if(tableName!=null) {
				table.addCDATA(tableName) ;
			}
		}
	}
	
	/**
	 * 构造前置和后置事件
	 * @param table
	 * @param dataxml
	 * @throws DataTypeException 
	 * @throws DataHelpException 
	 */
	private static void bulidEvent(Element table, DataBean dataxml) throws DataHelpException, DataTypeException  {
		List<EventBean> before = dataxml.getBefore();
		for(EventBean bean : before) {
			Element beforeEl = table.addElement("before");
			setEventBeanValues(beforeEl,bean) ;
		}
		List<EventBean> after = dataxml.getAfter() ;
		for(EventBean bean : after) {
			Element beforeEl = table.addElement("after");
			setEventBeanValues(beforeEl,bean) ;
		}
	}

	/**
	 * 设置事件相关配置
	 * @param beforeEl
	 * @param bean
	 * @throws DataTypeException 
	 * @throws UnsupportedEncodingException 
	 */
	private static void setEventBeanValues(Element element, EventBean bean) throws DataHelpException, DataTypeException  {
		if(bean!=null) {
			String id = bean.getId() ;
			if(id!=null) {
				element.addAttribute("id", id) ;
			}
			String name = bean.getName() ;
			if(name!=null) {
				element.addAttribute("name", name) ;
			}
			String type = bean.getType() ;
			if(type!=null) {
				element.addAttribute("type", type) ;
			}
			String text = bean.getText() ;
			if(text!=null) {
				element.addAttribute("isencode", "1") ;
				element.setText(VariableCoding.encode(text)) ;
			}
			Map<String,Object> variables = bean.getVariables() ;
			if(variables!=null) {
				Iterator<String> it = variables.keySet().iterator();
				while(it.hasNext()) {
					String key = it.next() ;
					Object value = variables.get(key) ;
					String valueType = value.getClass().getName() ;
					Element variable = element.addElement("variable");
					variable.addAttribute("id", key) ;
					variable.addAttribute("type", valueType) ;
					variable.addAttribute("isencode", "1") ;
					variable.setText(VariableCoding.encode(StringUtil.objectToString(value))) ;
				}
			}
		}
	}

	/**
	 * 将xml转换成bean对象
	 * @param xml
	 * @return
	 * @throws DataHelpException 
	 */
	public static List<DataXmlBean> xmlToListDataXmlBean(String xml) throws DataHelpException {
		List<DataXmlBean> bean = new ArrayList<DataXmlBean>();
		try {
			Document docuement = DocumentHelper.parseText(xml) ;
			List<Element> list = docuement.selectNodes("/data/table");
			for(Element l : list) {
				DataXmlBean b = new DataXmlBean() ;
				Element sqlEl = l.element("sql");
				b.setSql(sqlEl.getText()) ;
				
				Element tablenameEl = l.element("tablename");
				b.setTablename(tablenameEl.getText()) ;
				
				List<Element> befores = l.elements("before");
				List<EventBean> lb = new ArrayList<EventBean>();
				for(Element e : befores) {
					EventBean eb = new EventBean();
					eb.bandXmlToBean(e);
					lb.add(eb) ;
				}
				b.setBefore(lb) ;
				
				List<Element> afters = l.elements("after");
				List<EventBean> ab = new ArrayList<EventBean>();
				for(Element e : afters) {
					EventBean eb = new EventBean();
					eb.bandXmlToBean(e);
					ab.add(eb) ;
				}
				b.setAfter(ab) ;
				
				bean.add(b) ;
			}
		} catch (DocumentException e) {
			throw new DataHelpException(e) ;
		}
		return bean;
	}
	
	/**
	 * 数据体包装模型集合转换成xml
	 * @param beans  数据体包装模型集合
	 * @return 
	 */
	public static String listDataXmlBeanToXml(List<DataXmlBean> beans) {
		Document docuement = DocumentHelper.createDocument() ;
		Element root = docuement.addElement("data");
		if(beans!=null) {
			for(DataXmlBean xmlbean : beans) {
				Element data = root.addElement("table");
				List<EventBean> before = xmlbean.getBefore();
				for(EventBean b : before) {
					if(b!=null) {
						Element beforeEl = data.addElement("before");
						b.setXmlValues(beforeEl);
					}
				}
				
				String sql = xmlbean.getSql() ;
				if(sql!=null) {
					Element sqlEl = data.addElement("sql");
					sqlEl.setText(sql) ;
				}
				
				String tablename = xmlbean.getTablename() ;
				if(tablename!=null) {
					Element tablenameEl = data.addElement("tablename");
					tablenameEl.setText(tablename) ;
				}
				
				List<EventBean> after = xmlbean.getAfter();
				for(EventBean a : after) {
					if(a!=null) {
						Element afterEl = data.addElement("after");
						a.setXmlValues(afterEl);
					}
				}
			}
		}
		return docuement.asXML();
	}
}
