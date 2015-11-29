/** 
 * Title:        数据交互服务应用: 
 * Description:  数据加码解码应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.sgepit.helps.dataService.exception.DataTypeException;


/**
 * 字符串加码解码应用
 * 主要解决xml多层嵌套及数据加密的问题
 * @author lizp
 * @Date 2010-8-10
 */
public class VariableCoding {
	
	/**
	 * 将字符串转换成字符编码（加密）
	 * @param s 待处理字符串
	 * @return 编码后的字符串
	 * @throws DataTypeException
	 */
	public static String encode(String s) throws DataTypeException {
		String r = "" ;
		if(s!=null) {
			try {
				BASE64Encoder e = new sun.misc.BASE64Encoder();
				r = e.encode(s.getBytes("utf-8"));
			} catch (UnsupportedEncodingException e) {
				throw new DataTypeException("编码字符转换失败！"+e.getMessage()) ;
			}
		}
		return r ;
	}
	
	/**
	 * 将转码后的字符解码为字符串（解码）
	 * @param s 待处理字符串
	 * @return 解码后的字符串
	 * @throws DataTypeException 
	 */
	public static String decode(String s) throws DataTypeException {
		String r = null ;
		if(s!=null) {
			BASE64Decoder d = new sun.misc.BASE64Decoder();
			byte[] b = null ;
			try {
				b = d.decodeBuffer(s) ;
			} catch (IOException e) {
				throw new DataTypeException("字符解码失败!"+e.getMessage()) ;
			}
			try {
				r = new String(b,"utf-8") ;
			} catch (UnsupportedEncodingException e) {
				throw new DataTypeException("编码字符转换失败！"+e.getMessage()) ;
			}
		}
		return r ;
	}
	
}
