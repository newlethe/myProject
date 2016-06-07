/** 
 * Title:        数据交互服务应用: 
 * Description:  数据交互结果解析应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.exception.ResultAnalysisException;

/**
 * 数据交互结果解析
 * 解析数据交互返回信息，并提供多种快速获取交互结果的方法。
 * @author lizp
 * @Date 2010-8-10
 */
public class XmlHelper {
	private Document document ;
	
	/**
	 * xml构造
	 * @param xml
	 * @throws ResultAnalysisException 
	 */
	public XmlHelper(String xml) throws ResultAnalysisException {
		try {
			if(xml==null) {
				throw new ResultAnalysisException("待解析的xml为空！");
			}
			this.document = DocumentHelper.parseText(xml) ;
		} catch (DocumentException e) {
			throw new ResultAnalysisException("解析xml出错！xml:"+xml) ;
		}
	}
	
	public XmlHelper(Document document) {
		this.document = document ;
	}
	
	/**
	 * 获得返回参数状态标识
	 * 获取的是交互过程的全局状态
	 * @return true为交互成功
	 */
	public boolean getState(){
		boolean f = false ;
		Node state = this.document.selectSingleNode("/data/state");
		if(state!=null&&"1".equals(state.getText())) {
			f = true ;
		}
		return f ;
	}
	
	/**
	 * 获得默认的第一个前置事件的返回结果
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException
	 */
	public String getFirstBeforeEventResult() throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/before[position()=1]") ;
		return getResult(node) ;
	}
	
	/**
	 * 获得默认的第一个前置事件的个数
	 * @return 
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public int getFirstBeforeEventSize() throws ResultAnalysisException, DataTypeException {
		List list = this.document.selectNodes("/data/table[position()=1]/before") ;
		return list.size() ;
	}
	
	/**
	 * 获取具体位置前置事件个数
	 * @param index
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public int getBeforeEventSizeByIndex(String index) throws ResultAnalysisException, DataTypeException {
		List list = this.document.selectNodes("/data/table[position()="+index+"]/before") ;
		return list.size() ;
	}
	
	/**
	 * 通过事件id获得前置事件返回结果
	 * @param id 事件id
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	public String getFirstBeforeEventResultById(String id) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/before[@id='"+id+"']") ;
		return getResult(node) ;
	}
	
	/**
	 * 通过索引获得前置事件返回结果
	 * @param index 事件索引的字符串形式(从1开始)
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	public String getFirstBeforeEventResultByIndex(String index) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/before[position()="+index+"]") ;
		return getResult(node) ;
	}
	
	/**
	 * 通过table索引及前置事件索引获得返回结果
	 * @param tindex table索引
	 * @param index 前置事件索引
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public String getBeforeEventResultByIndex(String tindex,String index) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()="+tindex+"]/before[position()="+index+"]") ;
		return getResult(node) ;
	}
	
	
	/**
	 * 获得默认的第一个后置事件的返回结果
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	public String getFirstAfterEventResult() throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/after[position()=1]") ;
		return getResult(node) ;
	}
	
	/**
	 * 获得具体位置的后置事件
	 * @param index
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public String getAfterEventResultByIndex(String index) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()="+index+"]/after") ;
		return getResult(node) ;
	}
	
	/**
	 * 获得默认的第一个后置事件的个数
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public int getFirstAfterEventSize() throws ResultAnalysisException, DataTypeException {
		List list = this.document.selectNodes("/data/table[position()=1]/after[position()=1]") ;
		return list.size() ;
	}
	
	/**
	 * 通过索引获得后置事件返回结果
	 * @param index 事件索引的字符串形式(从1开始)
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException
	 */
	public String getFirstAfterEventResultByIndex(String index) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/after[position()="+index+"]") ;
		return getResult(node) ;
	}
	/**
	 * 获得具体位置对应索引的后置事件返回结果
	 * @param tindex
	 * @param index
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public String getAfterEventResultByIndex(String tindex,String index) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()="+tindex+"]/after[position()="+index+"]") ;
		return getResult(node) ;
	}
	
	/**
	 * 通过事件id获得后置事件返回结果
	 * @param id 事件id
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	public String getFirstAfterEventResultById(String id) throws ResultAnalysisException, DataTypeException {
		String s = null ;
		Node node = this.document.selectSingleNode("/data/table[position()=1]/after[@id='"+id+"']") ;
		return getResult(node) ;
	}
	
	
	/**
	 * 获得返回结果
	 * @param node 
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	private String getResult(Node node) throws ResultAnalysisException, DataTypeException {
		String flag = node.valueOf("@flag");
		String isencode = node.valueOf("@isencode");
		if("1".equals(isencode)) {//加密时
			return VariableCoding.decode(node.getText()) ;
		}else{
			return node.getText() ;
		}
	}
	
	/**
	 * 获得数据主体部分状态
	 * @return
	 */
	public boolean getFirstBodyResultState() {
		Node node = this.document.selectSingleNode("/data/table[position()=1]");
		String flag = node.valueOf("@flag");
		return "1".equals(flag)?true:false ;
	}
	
	
	
	/**
	 * 获取数据主体部分返回消息
	 * @return 返回解密后的字符串结果，解密失败就抛出异常
	 * @throws DataTypeException 
	 * @throws ResultAnalysisException 
	 */
	public String getFirstBodyResult() throws ResultAnalysisException, DataTypeException {
		Node node = this.document.selectSingleNode("/data/table[position()=1]");
		String isencode = node.valueOf("@isencode");
		if("1".equals(isencode)) {//加密时
			return VariableCoding.decode(node.getText()) ;
		}else{
			return node.getText() ;
		}
	}
	
	/**
	 * 通过索引获取数据主体
	 * @param index
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public String getBodyResultByIndex(String index) throws ResultAnalysisException, DataTypeException {
		Node node = this.document.selectSingleNode("/data/table[position()="+index+"]");
		String isencode = node.valueOf("@isencode");
		if("1".equals(isencode)) {//加密时
			return VariableCoding.decode(node.getText()) ;
		}else{
			return node.getText() ;
		}
	}
	
	/**
	 * 获取数据主体消息集合
	 * @return
	 * @throws ResultAnalysisException
	 * @throws DataTypeException
	 */
	public List<String> getBodyResult() throws ResultAnalysisException, DataTypeException {
		List<String> list = new ArrayList<String>();
		List<Element> nodes = this.document.selectNodes("/data/table");
		for(Element el : nodes) {
			String isencode = el.attributeValue("@isencode");
			if("1".equals(isencode)) {//加密时
				list.add(VariableCoding.decode(el.getText())) ;
			}else{
				list.add(el.getText()) ;
			}
		}
		return list ;
	}
}
