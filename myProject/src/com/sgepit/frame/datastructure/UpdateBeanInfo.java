package com.sgepit.frame.datastructure;

import java.util.List;
import java.util.Set;

public class UpdateBeanInfo {
	public Set<String> columnSet;
	public List<Object> beanList;
	public List<String> pkValueList;

	public UpdateBeanInfo(Set<String> set, List<Object> beanList, List<String> pkValueList) {
		this.columnSet = set;
		this.beanList = beanList;
		this.pkValueList = pkValueList;
	}
}