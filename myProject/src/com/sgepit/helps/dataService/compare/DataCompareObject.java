
package com.sgepit.helps.dataService.compare;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

import com.sgepit.helps.dataService.exception.DataCompareException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.model.HeaderBean;

/**
 * 数据比较
 * @author lizp
 */
public class DataCompareObject {
	private Document document ;
	private List<HeaderBean> header ; //表头对象
	
	public DataCompareObject(Document document) {
		this.document = document;
	}
	
	public List<HeaderBean> getHeader() {
		return header;
	}

	public void setHeader(List<HeaderBean> header) {
		this.header = header;
	}

	public DataCompareObject(String xml) throws DataCompareException {
		try {
			this.document = DocumentHelper.parseText(xml);
		} catch (DocumentException e) {
			throw new DataCompareException(e.getMessage(),e.getCause());
		}
	}
	
	public void initCompareHelper() throws DataCompareException {
		if(document==null) {
			throw new DataCompareException("数据集合对象不能为空！");
		}
	}
	
	/**
	 * 将数据交互的返回数据(默认第一个table结构)转换成List<Map<String,Object>>结构
	 * @return
	 * @throws DataCompareException 
	 * @throws DataTypeException 
	 */
	public List<Map<String,Object>> DataXmlToListMap() throws DataCompareException, DataTypeException {
		return DataXmlToListMapByIndex(1);
	}
	
	/**
	 * 将数据交互的返回数据(按照索引获取table结构)转换成List<Map<String,Object>>结构
	 * @param index 索引
	 * @return
	 * @throws DataCompareException
	 * @throws DataTypeException 
	 */
	public List<Map<String,Object>> DataXmlToListMapByIndex(int index) throws DataCompareException, DataTypeException {
		initCompareHelper() ;
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		Node node = document.selectSingleNode("/data/table[position()="+index+"]");
		if(node!=null) {
			List<HeaderBean> headerList = new ArrayList<HeaderBean>();
			//处理头
			List<Element> els = node.selectNodes("./header/column") ;
			for(Element el : els){
				HeaderBean bean = new HeaderBean();
				bean.setValuesByElement(el) ;
				headerList.add(bean) ;
			}
			this.header = headerList ;
			//处理行
			List<Element> rows = node.selectNodes("./row") ;
			if(rows!=null) {
				for(Element row : rows) {
					Map<String,Object> map = new HashMap<String, Object>() ;
					List<Element> cols = row.elements("col");
					if(cols!=null) {
						for(Element col : cols) {
							String colindex = col.attributeValue("index") ;
							String text = col.getText() ;
							HeaderBean header = HeaderBean.getHeadByIndex(headerList, colindex);
							Object obj = header.getObjectValue(text) ;
							map.put(header.getName(), obj) ;
						}
						list.add(map) ;
					}
				}
			}
		}
		return list ;
	}
	
}
