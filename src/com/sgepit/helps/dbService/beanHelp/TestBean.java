package com.sgepit.helps.dbService.beanHelp;

import java.math.BigDecimal;
import java.sql.Date;

import com.sgepit.helps.dbService.exception.AttributeException;
import com.sgepit.helps.dbService.exception.InvokeException;

public class TestBean extends BeanUtil {
	private String col1 = "aaa" ;
	private Date col2 = new Date(System.currentTimeMillis()) ;
	private Integer col3 = 12 ;
	private BigDecimal col4 = new BigDecimal("123.222") ;
	private int col5 = 11 ;
	public String getCol1() {
		return col1;
	}
	public void setCol1(String col1) {
		this.col1 = col1;
	}
	public Date getCol2() {
		return col2;
	}
	public void setCol2(Date col2) {
		this.col2 = col2;
	}
	public Integer getCol3() {
		return col3;
	}
	public void setCol3(Integer col3) {
		this.col3 = col3;
	}
	public BigDecimal getCol4() {
		return col4;
	}
	public void setCol4(BigDecimal col4) {
		this.col4 = col4;
	}
	public int getCol5() {
		return col5;
	}
	public void setCol5(int col5) {
		this.col5 = col5;
	}
	
	public static void main(String[] args) {
		TestBean bean = new TestBean();
		try {
			System.out.println(bean.asXML());
		} catch (AttributeException e) {
			e.printStackTrace();
		} catch (InvokeException e) {
			e.printStackTrace();
		}
	}
}
