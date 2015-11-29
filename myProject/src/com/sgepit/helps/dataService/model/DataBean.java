/** 
 * Title:        数据交互服务应用: 
 * Description:  数据体模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.util.ArrayList;
import java.util.List;
/**
 * 数据体模型
 * @author lizp
 * @Date 2010-8-10
 */
public class DataBean {
	private List<EventBean> before = new ArrayList<EventBean>() ;
	private List<EventBean> after = new ArrayList<EventBean>() ;
	private DataModel datas ;
	public List<EventBean> getBefore() {
		return before;
	}
	public void setBefore(List<EventBean> before) {
		this.before = before;
	}
	public List<EventBean> getAfter() {
		return after;
	}
	public void setAfter(List<EventBean> after) {
		this.after = after;
	}
	public DataModel getDatas() {
		return datas;
	}
	public void setDatas(DataModel datas) {
		this.datas = datas;
	}
}
