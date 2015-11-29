package com.sgepit.helps.dataService.compare;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dataService.exception.DataCompareException;
import com.sgepit.helps.dataService.model.HeaderBean;
import com.sgepit.helps.dbService.beanHelp.BeanUtil;

public class CompareObject extends BeanUtil {
	private List<Map<String,Object>> data ; //基础数据集合对象
	private List<Map<String,Object>> compareData ; //对比的数据集合对象
	private List<String> keys ; //基准列名
	private String ObjectName ; //比较对象名称
	private List<HeaderBean> header ; //表头对象
	
	private List<CompareRowObject> compareResultRow ;  //对比行结果对象
	
	public CompareObject(List<Map<String,Object>> data,List<Map<String,Object>> compareData,List<String> keys) {
		this.data = data ;
		this.compareData = compareData ;
		this.keys = keys ;
	}
	
	public void init() throws DataCompareException {
		if(data==null) {
			throw new DataCompareException("基础数据集合对象不能为空！");
		}
		if(compareData==null) {
			throw new DataCompareException("对比的数据集合对象不能为空！");
		}
		if(keys==null||keys.size()==0) {
			throw new DataCompareException("基准列不能为空");
		}
	}
	
	//进行对比
	public List<CompareRowObject> compareObject() throws DataCompareException {
		init() ;
		List<Map<String,Object>> _data = new ArrayList<Map<String,Object>>();
		_data.addAll(data) ;
		List<Map<String,Object>> _compareData = new ArrayList<Map<String,Object>>();
		_compareData.addAll(compareData) ;
		
		List<CompareRowObject> compareResultRows = new ArrayList<CompareRowObject>();
		for(Map<String,Object> map : _data) {
			CompareRowObject rowObject = new CompareRowObject();
			rowObject.setMap(map) ;
			Map<String,Object> keyMap = new HashMap<String, Object>();
			
			for(String key : keys) {
				if(!map.containsKey(key)) {
					throw new DataCompareException("基准列不存在！列名为："+key);
				}else{
					keyMap.put(key, map.get(key)) ;
				}
			}
			rowObject.setKeyMap(keyMap) ;
			
			boolean rFlag = true ; //是否有匹配的行
			boolean cFlag = true ;  //是否有差异
			for(Map<String,Object> compareMap : _compareData) {
				boolean flag = true ;
				for(String key : keys) {
					if(map.get(key)==null) {
						if(compareMap.get(key)!=null){
							flag = false ;
							break ;
						}
					}else if(map.get(key).equals(compareMap.get(key))) {
						
					}else{
						flag = false ;
						break ;
					}
				}
				if(!flag) {  //不匹配时跳出
					continue ;
				}else{  //主键值匹配，对比其他值
					rFlag = false ;
					List<CompareCellObject> cells = new ArrayList<CompareCellObject>();
					Map<String,Object> _cMap = new HashMap<String, Object>() ;
					_cMap.putAll(compareMap) ;
					Iterator<String> it = map.keySet().iterator();
					while(it.hasNext()) {
						String key = it.next() ;
						if(keys.contains(key)) {
						}else{  //不是主键列时
							Object obj = map.get(key) ;
							Object compareObj = compareMap.get(key) ;
							if(!obj.equals(compareObj)) {
								CompareCellObject cell = new CompareCellObject();
								cell.setCompareValue(compareObj) ;
								cell.setValue(obj) ;
								cell.setType("update") ;
								cell.setColName(key) ;
								cells.add(cell) ;
							}
						}
						_cMap.remove(key) ;
					}
					if(_cMap.size()>0) {
						Iterator<String> _it = _cMap.keySet().iterator();
						while(_it.hasNext()) {
							String _key = _it.next() ;
							Object _obj = _cMap.get(_key) ;
							if(_obj!=null) {
								CompareCellObject cell = new CompareCellObject();
								cell.setCompareValue(_obj) ;
								cell.setValue(null) ;
								cell.setType("update") ;
								cell.setColName(_key) ;
								cells.add(cell) ;
							}
						}
					}
					
					if(cells.size()>0) {
						rowObject.setFlag("update") ;
						rowObject.setCompareMap(compareMap) ;
						rowObject.setCells(cells) ;
					}else{
						cFlag = false ;
					}
					_compareData.remove(compareMap) ;
					break ;
				}
			}
			if(rFlag) {  //没有找到匹配的
				rowObject.setFlag("delete") ;
			}
			if(cFlag) {
				compareResultRows.add(rowObject) ;
			}
		}
		if(compareData.size()>0) {
			for(Map<String,Object> compareMap : _compareData) {
				CompareRowObject rowObj = new CompareRowObject();
				rowObj.setCompareMap(compareMap) ;
				rowObj.setFlag("add") ;
				compareResultRows.add(rowObj) ;
			}
		}
		this.compareResultRow = compareResultRows ;
		return compareResultRows;
	}

	public List<Map<String, Object>> getData() {
		return data;
	}

	public void setData(List<Map<String, Object>> data) {
		this.data = data;
	}

	public List<Map<String, Object>> getCompareData() {
		return compareData;
	}

	public void setCompareData(List<Map<String, Object>> compareData) {
		this.compareData = compareData;
	}

	public List<String> getKeys() {
		return keys;
	}

	public void setKeys(List<String> keys) {
		this.keys = keys;
	}

	public String getObjectName() {
		return ObjectName;
	}

	public void setObjectName(String objectName) {
		ObjectName = objectName;
	}

	public List<CompareRowObject> getCompareResultRow() {
		return compareResultRow;
	}

	public void setCompareResultRow(List<CompareRowObject> compareResultRow) {
		this.compareResultRow = compareResultRow;
	}
	
	public List<HeaderBean> getHeader() {
		return header;
	}

	public void setHeader(List<HeaderBean> header) {
		this.header = header;
	}

	//对比对象测试
	public static void main(String[] args) {
		List<Map<String,Object>> model = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> compareModel  = new ArrayList<Map<String,Object>>();
		List<String> keys = new ArrayList<String>();
		
		keys.add("col") ;
		
		Map<String,Object> map1 = new HashMap<String, Object>();
		map1.put("col", "key") ;
		map1.put("col1", new Date(System.currentTimeMillis())) ;
		map1.put("col2", new BigDecimal("123.2")) ;
		map1.put("col3", "key") ;
		map1.put("col4", 12) ;
		model.add(map1) ;
		
		Map<String,Object> map2 = new HashMap<String, Object>();
		map2.put("col", "key11") ;
		map2.put("col1", new Date(System.currentTimeMillis())) ;
		map2.put("col2", new BigDecimal("123.2")) ;
		map2.put("col3", "key") ;
		map2.put("col4", 12) ;
		model.add(map2) ;
		
		
		Map<String,Object> cmap1 = new HashMap<String, Object>();
		cmap1.put("col", "key") ;
		cmap1.put("col1", new Date(System.currentTimeMillis()-365)) ;
		cmap1.put("col2", new BigDecimal("123.20")) ;
		cmap1.put("col3", "key") ;
		cmap1.put("col4", 122) ;
		compareModel.add(cmap1) ;
		
		Map<String,Object> cmap3 = new HashMap<String, Object>();
		cmap3.put("col", "keyqq") ;
		cmap3.put("col1", new Date(System.currentTimeMillis()-365)) ;
		cmap3.put("col2", new BigDecimal("123.20")) ;
		cmap3.put("col3", "key") ;
		cmap3.put("col4", 122) ;
		compareModel.add(cmap3) ;
		
		try {
			CompareObject obj = CompareHelper.compareObject(model, compareModel, keys) ;
			System.out.println(obj.getCompareResultRow()) ;
			
		} catch (DataCompareException e) {
			e.printStackTrace();
		}
	}
}
