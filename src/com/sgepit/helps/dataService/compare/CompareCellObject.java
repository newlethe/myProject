package com.sgepit.helps.dataService.compare;

import com.sgepit.helps.dbService.beanHelp.BeanUtil;

public class CompareCellObject extends BeanUtil {
	private String type ; //行差异类型(add为比基准对象多出的行,update有值差异的行,delete比基准对象少的行)
	private Object value ; //基准值
	private Object compareValue ; //对比值
	private String colName ; //列名
	
	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		this.colName = colName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	public Object getCompareValue() {
		return compareValue;
	}
	public void setCompareValue(Object compareValue) {
		this.compareValue = compareValue;
	}
}
