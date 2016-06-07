package com.sgepit.helps.dataService.compare;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dataService.exception.DataCompareException;

public class CompareHelper {
	/**
	 * 对比结果集对象
	 * @param list 基准对象
	 * @param compareList 对比对象
	 * @param keys 对比列
	 * @param objectName 对比标识
	 * @return
	 * @throws DataCompareException 
	 */
	public static CompareObject compareObject(List<Map<String,Object>> list ,List<Map<String,Object>> compareList,List<String> keys,String objectName) throws DataCompareException {
		CompareObject obj = new CompareObject(list,compareList,keys);
		if(objectName!=null) {
			obj.setObjectName(objectName) ;
		}
		obj.compareObject() ;
		return obj ;
	}
	
	/**
	 * 对比结果集对象(无对比结果集对象)
	 * @param list
	 * @param compareList
	 * @param keys
	 * @return
	 * @throws DataCompareException
	 */
	public static CompareObject compareObject(List<Map<String,Object>> list ,List<Map<String,Object>> compareList,List<String> keys) throws DataCompareException {
		return compareObject(list,compareList,keys,null) ;
	}

}
