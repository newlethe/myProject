package com.sgepit.frame.util;
import java.io.Serializable;
import org.hibernate.HibernateException;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.engine.SessionImplementor;

/**
 * Hibernate主键生成器
 *
 */
public class UUIDGenerator implements IdentifierGenerator{
	private static int sn = 0;

	@Override
	public Serializable generate(SessionImplementor sessionImplementor, Object o)throws HibernateException {
		return getNewID();
	}

	public synchronized static String getNewID() {
		if(sn>=9999) {
			sn = 0;
		}
		return new java.text.SimpleDateFormat("yyyyMMddHHmmssSSS").format(new java.util.Date()) 
				+ new java.text.DecimalFormat("0000").format( sn++ );
	}
	
	/**
	 * 返回随机主键36位（带'-'号）
	 * @return
	 */
	public static String getUUID(){
		return java.util.UUID.randomUUID().toString();
	}
	
	/**
	 * 返回随机主键32位
	 * @return
	 */
	public static String UUID(){
		return getUUID().replaceAll("-", "");
	}
	
	/**
	 * 生成短字符串
	 * @param url
	 * @return
	 */
	public static String getShortUrl(String url) {
		// 要使用生成 URL 的字符
		String[] chars = new String[] { "a", "b", "c", "d", "e", "f", "g", "h",
				"i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
				"u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
				"6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H",
				"I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
				"U", "V", "W", "X", "Y", "Z" };
		// 对传入网址进行 MD5 加密
		String hex  = MD5Util.getMd5().md5(url);

		// 把加密字符按照 8 位一组 16 进制与 0x3FFFFFFF 进行位与运算
		String sTempSubString = hex.substring(2 * 8, 2 * 8 + 8);

		// 这里需要使用 long 型来转换，因为 Inteper .parseInt() 只能处理 31 位 , 首位为符号位 , 如果不用
		// long ，则会越界
		long lHexLong = 0x3FFFFFFF & Long.parseLong(sTempSubString, 16);
		String outChars = "";
		for (int j = 0; j < 6; j++) {
			// 把得到的值与 0x0000003D 进行位与运算，取得字符数组 chars 索引
			long index = 0x0000003D & lHexLong;
			// 把取得的字符相加
			outChars += chars[(int) index];
			// 每次循环按位右移 5 位
			lHexLong = lHexLong >> 5;
		}
		// 把字符串存入对应索引的输出数组
		return outChars;
	}
}