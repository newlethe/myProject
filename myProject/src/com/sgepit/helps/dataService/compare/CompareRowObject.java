package com.sgepit.helps.dataService.compare;

import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.beanHelp.BeanUtil;

public class CompareRowObject extends BeanUtil {
	private String flag ; //行差异类型(add为比基准对象多出的行,update有值差异的行,delete比基准对象少的行)
	private List<CompareCellObject> cells ; //差异化列集合
	private Map<String,Object> keyMap ; //主键列对象值集合
	private Map<String,Object> map ; //基准对象集合(delete时有)
	private Map<String,Object> compareMap ; //对比对象集合(add时有)
	
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public List<CompareCellObject> getCells() {
		return cells;
	}
	public void setCells(List<CompareCellObject> cells) {
		this.cells = cells;
	}
	public Map<String, Object> getMap() {
		return map;
	}
	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	public Map<String, Object> getCompareMap() {
		return compareMap;
	}
	public void setCompareMap(Map<String, Object> compareMap) {
		this.compareMap = compareMap;
	}
	public Map<String, Object> getKeyMap() {
		return keyMap;
	}
	public void setKeyMap(Map<String, Object> keyMap) {
		this.keyMap = keyMap;
	}
}
