package com.sgepit.helps.dataService.compare;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.dataService.exception.DataCompareException;
import com.sgepit.helps.dataService.exception.DataTypeException;

@Deprecated
public class DatasCompareObject {
	
	private Document document ;
	
	public DatasCompareObject(Document document) {
		this.document = document;
	}
	
	public DatasCompareObject(String xml) throws DataCompareException {
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
	 * 将数据交互数据转成list集合下的ListMap结构
	 * 不推荐使用多个数据的，表头对象无法获得
	 * @return
	 * @throws DataCompareException
	 * @throws DataTypeException 
	 */
	public List<List<Map<String,Object>>> DataXmlToLists() throws DataCompareException, DataTypeException {
		List<List<Map<String,Object>>> lst = new ArrayList<List<Map<String,Object>>>();
		initCompareHelper() ;
		List list = document.selectNodes("/data/table") ;
		for(int i=0;i<list.size();i++) {
			DataCompareObject helper = new DataCompareObject(document);
			lst.add(helper.DataXmlToListMapByIndex(i+1));
		}
		return lst;
	}
	
	/**
	 * 将数据交互数据转成Map集合下的ListMap结构
	 * 不推荐使用多个数据的，表头对象无法获得
	 * @return
	 * @throws DataCompareException
	 * @throws DataTypeException
	 */
	public Map<String,List<Map<String,Object>>> DataXmlToMaps() throws DataCompareException, DataTypeException {
		Map<String,List<Map<String,Object>>> map = new HashMap<String,List<Map<String,Object>>>();
		initCompareHelper() ;
		List list = document.selectNodes("/data/table") ;
		for(int i=0;i<list.size();i++) {
			Element el = (Element) list.get(i) ;
			String name = el.getText() ;
			DataCompareObject helper = new DataCompareObject(document);
			map.put(name,helper.DataXmlToListMapByIndex(i+1));
		}
		return map;
	}
}
