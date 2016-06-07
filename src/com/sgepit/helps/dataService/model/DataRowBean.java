/** 
 * Title:        数据交互服务应用: 
 * Description:  数据行模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.util.ArrayList;
import java.util.List;
/**
 * 数据行模型
 * @author lizp
 * @Date 2010-8-10
 */
public class DataRowBean {
	private int rownum ; //从0开始
	private List<DataColBean> cols = new ArrayList<DataColBean>();
	public int getRownum() {
		return rownum;
	}
	public void setRownum(int rownum) {
		this.rownum = rownum;
	}
	public List<DataColBean> getCols() {
		return cols;
	}
	public void setCols(List<DataColBean> cols) {
		this.cols = cols;
	}
}
