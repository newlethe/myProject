/** 
 * Title:        数据交互服务应用: 
 * Description:  获取交互方数据应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.dataService.exception.DataActionException;
import com.sgepit.helps.dataService.exception.DataHelpException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.exception.ResultAnalysisException;
import com.sgepit.helps.dataService.model.DataXmlBean;
import com.sgepit.helps.dataService.model.HeaderBean;
/**
 * 获取交互方数据
 * 主动获取交互方数据，实现跨库交互
 * @author lizp
 * @Date 2010-8-10
 */
public class DataExchangeHelp {
	//对方解析请求构造数据体的类名
	private static String methodName = "com.sgepit.helps.dataService.DataXmlHelp.bulidXml" ;
	
	/**
	 * 生成获取对方数据的xml请求
	 * @param sql 获取数据的sql语句
	 * @return
	 * @throws DataHelpException 
	 * @throws DataTypeException 
	 */
	public static String bulidXml(String sql) throws DataHelpException, DataTypeException  {
		List<DataXmlBean> list = new ArrayList<DataXmlBean>();
		DataXmlBean bean = new DataXmlBean();
		bean.setSql(sql) ;
		list.add(bean) ;
		return bulidXml(list);
	}
	/**
	 * 生成获取对方数据的xml请求
	 * @param sql 获取数据的sql语句
	 * @param script 脚本语句
	 * @return
	 * @throws DataHelpException
	 * @throws DataTypeException
	 */
	public static String bulidXml(String sql,String script) throws DataHelpException, DataTypeException  {
		List<DataXmlBean> list = new ArrayList<DataXmlBean>();
		DataXmlBean bean = new DataXmlBean();
		bean.setSql(sql) ;
		list.add(bean) ;
		return bulidXml(list,script);
	}
	
	/**
	 * 生成获取对方数据的xml请求
	 * @param bean 数据集合对象
	 * @return
	 * @throws DataHelpException 
	 * @throws DataTypeException 
	 * @throws DataHelpException
	 */
	public static String bulidXml(List<DataXmlBean> bean) throws DataHelpException, DataTypeException  {
		return bulidXml(bean,null);
	}
	public static String bulidXml(List<DataXmlBean> bean,String script) throws DataHelpException, DataTypeException  {
		String varxml = DataXmlHelp.listDataXmlBeanToXml(bean) ;
		Map map = new HashMap();
		map.put("xml", varxml) ;
		return DataXmlHelp.dynWebService((script==null?methodName:script)+"(xml)",map) ;
	}
	
	/**
	 * 解析获得交互请求的数据
	 * @param outxml 请求数据返回xml字符串
	 * @return
	 * @throws DataActionException 
	 * @throws ResultAnalysisException 
	 * @throws DataTypeException 
	 * @throws DataHelpException 
	 */
	public static List<Map<String,Object>> getListFromXml(String outxml) throws DataActionException, ResultAnalysisException, DataTypeException, DataHelpException {
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		XmlHelper help = new XmlHelper(outxml);
		String out = help.getFirstBeforeEventResult() ;
		boolean f = help.getState() ;
		if(f){
			try {
				Document document = DocumentHelper.parseText(out) ;
				List<HeaderBean> header = new ArrayList<HeaderBean>() ;
				List<Element> columns = document.selectNodes("/data/table/header/column");
				for(Element col : columns) {
					String index = col.attributeValue("index") ;
					String type = col.attributeValue("type") ;
					String name = col.attributeValue("name") ;
					HeaderBean head = new HeaderBean();
					if(index!=null) {
						head.setIndex(Integer.parseInt(index)) ;
					}
					head.setType(type) ;
					head.setName(name) ;
					header.add(head) ;
				}
				List<Element> rows = document.selectNodes("/data/table/row");
				for(Element row : rows) {
					List<Element> cols = row.selectNodes("./col") ;
					Map<String,Object> map = new HashMap<String, Object>();
					for(Element col : cols) {
						String text = col.getText() ;
						String index = col.attributeValue("index") ;
						HeaderBean bean = HeaderBean.getHeadByIndex(header, index);
						map.put(bean.getName().toLowerCase(), bean.getObjectValue(text)) ;
					}
					list.add(map) ;
				}
			} catch (NumberFormatException e) {
				throw new DataTypeException(e) ;
			} catch (DocumentException e) {
				throw new DataHelpException(e) ;
			}
		}else{
			throw new DataActionException("数据交互失败！原因："+out);
		}
		return list ;
	}
}
