/** 
 * Title:        数据交互服务应用: 
 * Description:  数据头模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import org.dom4j.Element;

import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.fileService.FileUtil;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据头模型
 * @author lizp
 * @Date 2010-8-10
 */
public class HeaderBean {
	public static int COL_TYPE_NONE = 0 ;
	public static int COL_TYPE_NOTNULL = 1 ;
	public static int COL_TYPE_KEY = 2 ;
	public static int COL_TYPE_AUTOUUID = 9 ;
	private String uuid ;
	private int index ;   //序号
	private String type ;
	private String name ;  //表头名称
	private int nullType ;
	private String value ;
	private int colType = COL_TYPE_NONE ; //列类型控制(0为不控制，1为不为空，9为自动uuid填充值)
	
	private String width ;
	
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getValue() {
		return value;
	}
	public int getIndex() {
		return index;
	}
	public String getStringIndex() {
		return this.index+"";
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public void setStringIndex(String index) {
		this.index = Integer.parseInt(index);
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getNullType() {
		return nullType;
	}
	public void setNullType(int nullType) {
		this.nullType = nullType;
	}
	public int getColType() {
		return colType;
	}
	public void setColType(int colType) {
		this.colType = colType;
	}
	
	/**
	 * 通过xml对象给头模型对象赋值
	 * @param column
	 */
	public void setValuesByElement(Element column) {
		String type = column.attributeValue("type") ;
		String name = column.attributeValue("name") ;
		String index = column.attributeValue("index") ;
		String colType = column.attributeValue("colType") ;
		this.index = Integer.parseInt(index) ; ;
		this.name = name ;
		this.type = type ;
		if(colType!=null&&(!"".equals(colType))) {
			this.colType = Integer.parseInt(colType);
		}
		this.nullType = getNullTypeValueByType(type) ;
	}
	
	/**
	 * 通过类型获得null值
	 * @param type2
	 * @return
	 */
	private int getNullTypeValueByType(String type) {
		int t = 12 ;
		if("DATE".equalsIgnoreCase(type)) {
			t = Types.DATE ;
		} else if("BINARY_DOUBLE".equalsIgnoreCase(type)){
			t = Types.DOUBLE ;
		} else if("BINARY_FLOAT".equalsIgnoreCase(type)){
			t = Types.FLOAT ;
		} else if("CHAR".equalsIgnoreCase(type)){
			t = Types.CHAR ;
		} else if("INTERVALDS".equalsIgnoreCase(type)){
			//暂时不处理
		} else if("INTERVALYM".equalsIgnoreCase(type)){
			//暂时不处理
		} else if("NUMBER".equalsIgnoreCase(type)){
			t = Types.NUMERIC ;
		} else if("VARCHAR2".equalsIgnoreCase(type)){
			t = Types.VARCHAR ;
		} else if("RAW".equalsIgnoreCase(type)){
			//暂时不处理
		} else if("TIMESTAMP".equalsIgnoreCase(type)){
			t = Types.TIMESTAMP ;
		} else if("TIMESTAMPLTZ".equalsIgnoreCase(type)){
			t = Types.TIMESTAMP ;
		} else if("TIMESTAMPTZ".equalsIgnoreCase(type)){
			t = Types.TIMESTAMP ;
		} else if("LONG".equalsIgnoreCase(type)){
			t = Types.LONGVARCHAR ;
		} else if("LONG RAW".equalsIgnoreCase(type)){
			//暂时不处理
		} else if("BLOB".equalsIgnoreCase(type)){
			t = Types.BLOB ;
		} else if("CLOB".equalsIgnoreCase(type)){
			t = Types.CLOB ;
		} else if("ROWID".equalsIgnoreCase(type)){
			//暂时不处理
		}
		return t;
	}
	/**
	 * 设置预处理sql中的值
	 * @param i 索引
	 * @param pstmt 
	 * @throws DataTypeException 
	 * @throws SQLException 
	 */
	public void setPstmtObjectValue(int i, PreparedStatement pstmt) throws DataTypeException, SQLException {
		try {
			String type = this.type ;
			if(type==null) return ;
			String text = this.getValue() ;
			Object value = text ;
			if("DATE".equalsIgnoreCase(type)) {
				value = java.sql.Date.valueOf(text) ;
				pstmt.setObject(i, value) ;
			} else if("BINARY_DOUBLE".equalsIgnoreCase(type)){
				//不转换
			} else if("BINARY_FLOAT".equalsIgnoreCase(type)){
				//不转换
			} else if("CHAR".equalsIgnoreCase(type)){
				pstmt.setObject(i, value) ;
				//不转换
			} else if("INTERVALDS".equalsIgnoreCase(type)){
				//不转换
			} else if("INTERVALYM".equalsIgnoreCase(type)){
				//不转换
			} else if("NUMBER".equalsIgnoreCase(type)){
				value = new BigDecimal(text);
				pstmt.setObject(i, value) ;
				//不转换
			} else if("VARCHAR2".equalsIgnoreCase(type)){
				pstmt.setObject(i, value) ;
				//不转换
			} else if("RAW".equalsIgnoreCase(type)){
				
			} else if("TIMESTAMP".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("TIMESTAMPLTZ".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("TIMESTAMPTZ".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("LONG".equalsIgnoreCase(type)){
				pstmt.setObject(i, value) ;
				//不转换
			} else if("LONG RAW".equalsIgnoreCase(type)){
			} else if("BLOB".equalsIgnoreCase(type)){
				byte[] bytes = new sun.misc.BASE64Decoder().decodeBuffer(text);
				ByteArrayInputStream in = new ByteArrayInputStream(bytes);
				int len = in.available() ;
				pstmt.setBinaryStream(i, in, len) ;
				in.close() ;
			} else if("CLOB".equalsIgnoreCase(type)){
				
			} else if("ROWID".equalsIgnoreCase(type)){
				
			}
		} catch (SQLException e) {
			throw e ;
		} catch (IOException e) {
			throw new DataTypeException("字节型数据",e) ;
		}
	}
	
	/**
	 * 获得头对象类型下的字符串对应的值
	 * @param text 
	 * @return Object对象
	 * @throws DataTypeException 
	 */
	public Object getObjectValue(String text) throws DataTypeException  {
		try {
			Object value = text ;
			if(value==null) {
				return value ;
			}
			String type = this.type ;
			
			if("DATE".equalsIgnoreCase(type)) {
				value = java.sql.Date.valueOf(text) ;
			} else if("BINARY_DOUBLE".equalsIgnoreCase(type)){
				//不转换
			} else if("BINARY_FLOAT".equalsIgnoreCase(type)){
				//不转换
			} else if("CHAR".equalsIgnoreCase(type)){
				//不转换
			} else if("INTERVALDS".equalsIgnoreCase(type)){
				//不转换
			} else if("INTERVALYM".equalsIgnoreCase(type)){
				//不转换
			} else if("NUMBER".equalsIgnoreCase(type)){
				value = new BigDecimal(text);
				//不转换
			} else if("VARCHAR2".equalsIgnoreCase(type)){
				//不转换
			} else if("RAW".equalsIgnoreCase(type)){
				
			} else if("TIMESTAMP".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("TIMESTAMPLTZ".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("TIMESTAMPTZ".equalsIgnoreCase(type)){
				//不使用该类型
			} else if("LONG".equalsIgnoreCase(type)){
				//不转换
			} else if("LONG RAW".equalsIgnoreCase(type)){
			} else if("BLOB".equalsIgnoreCase(type)){
			} else if("CLOB".equalsIgnoreCase(type)){
				
			} else if("ROWID".equalsIgnoreCase(type)){
				
			}
		} catch (Exception e) {
			throw new DataTypeException(e) ;
		}
		return text;
	}
	
	/**
	 * 列转换成字符串
	 * 目前仅对BLOB型进行了加密处理，其他采用toString方法转换
	 * @param type 类型
	 * @param obj 
	 * @throws DataTypeException 
	 */
	public static String TranColValueToString(String type ,Object obj) throws DataTypeException  {
		String value = StringUtil.objectToString(obj) ;
		if("DATE".equalsIgnoreCase(type)) {
		} else if("BINARY_DOUBLE".equalsIgnoreCase(type)){
			//不转换
		} else if("BINARY_FLOAT".equalsIgnoreCase(type)){
			//不转换
		} else if("CHAR".equalsIgnoreCase(type)){
			//不转换
		} else if("INTERVALDS".equalsIgnoreCase(type)){
			//不转换
		} else if("INTERVALYM".equalsIgnoreCase(type)){
			//不转换
		} else if("NUMBER".equalsIgnoreCase(type)){
			//不转换
		} else if("VARCHAR2".equalsIgnoreCase(type)){
			//不转换
		} else if("RAW".equalsIgnoreCase(type)){
			
		} else if("TIMESTAMP".equalsIgnoreCase(type)){
			//不使用该类型
		} else if("TIMESTAMPLTZ".equalsIgnoreCase(type)){
			//不使用该类型
		} else if("TIMESTAMPTZ".equalsIgnoreCase(type)){
			//不使用该类型
		} else if("LONG".equalsIgnoreCase(type)){
			//不转换
		} else if("LONG RAW".equalsIgnoreCase(type)){
		} else if("BLOB".equalsIgnoreCase(type)){
			try {
				java.sql.Blob blob = (Blob) obj ;
				ByteArrayOutputStream out = FileUtil.InputstreamToOutputStream(blob.getBinaryStream());
				value = new sun.misc.BASE64Encoder().encodeBuffer(out.toByteArray());
				out.flush() ;
				out.close() ;
			} catch (IOException e) {
				throw new DataTypeException(e) ;
			} catch (SQLException e) {
				throw new DataTypeException(e) ;
			} 
		} else if("CLOB".equalsIgnoreCase(type)){
			
		} else if("ROWID".equalsIgnoreCase(type)){
			/*ROWID rowid = (ROWID) obj;
			if(rowid!=null) {
				value = rowid.stringValue() ;
			}*/
		}
		return value;
	}
	
	/**
	 * 通过索引获得头模型对象
	 * @param list 头对象模型集合
	 * @param index 索引的字符串形式
	 * @return
	 */
	public static HeaderBean getHeadByIndex(List<HeaderBean> list,String index) {
		if(index!=null) {
			int i = Integer.parseInt(index) ;
			return getHeadByIndex(list,i);
		}else{
			return null ;
		}
	}
	
	/**
	 * 通过索引获得头模型对象
	 * @param list 头对象模型集合
	 * @param index 索引
	 * @return
	 */
	public static HeaderBean getHeadByIndex(List<HeaderBean> list,int index) {
		for(HeaderBean bean : list) {
			if(index==bean.getIndex()) {
				return bean ;
			}
		}
		return null ;
	}
}
