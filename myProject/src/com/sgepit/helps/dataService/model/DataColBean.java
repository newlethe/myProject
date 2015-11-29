/** 
 * Title:        数据交互服务应用: 
 * Description:  数据单元格模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;
/**
 * 数据单元格模型
 * @author lizp
 * @Date 2010-8-10
 */
public class DataColBean {
	private int index ;  //索引
	private Object value ;//原始值
	private String type ;//单元格类型(如果存在此类型以此类型为准，不存在则为表头类型)
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	/**
	 * 设置web dynpro类型
	 * @param dataType
	 */
	public void setIWDType(String dataType) {
		String[] types = dataType.split("[.]") ;
		String type = types[types.length-1] ;
		if("BigDecimal".equalsIgnoreCase(type)) {
			type = "number" ;
		}else if("double".equalsIgnoreCase(type)) {
			type = "number" ;
		}else if("int".equalsIgnoreCase(type)) {
			type = "number" ;
		}else if("Integer".equalsIgnoreCase(type)) {
			type = "number" ;
		}
		this.type = type ;
	}
}
