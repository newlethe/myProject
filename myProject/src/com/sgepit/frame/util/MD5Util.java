package com.sgepit.frame.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/**
 * md5加密算法工具类
 *
 */
public class MD5Util {
	private MessageDigest __md5 = null;
	private StringBuffer __digestBuffer = null;
	private static final MD5Util md5 = new MD5Util();

	public static MD5Util getMd5() {
		return md5;
	}

	public MD5Util() {
		try {
			__md5 = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		__digestBuffer = new StringBuffer();
	}
/**
 * 使用计算传入字符串的md5值.
 * @param s 传入的字符串
 * @return 计算出的md5值
 */
	public String md5(String s) {
		__digestBuffer.setLength(0);
		byte abyte0[] = __md5.digest(s.getBytes());
		for (int i = 0; i < abyte0.length; i++)
			__digestBuffer.append(toHex(abyte0[i]));

		return __digestBuffer.toString();
	}

	public String toHex(byte one) {
		String HEX = "0123456789ABCDEF";
		char[] result = new char[2];
		result[0] = HEX.charAt((one & 0xf0) >> 4);
		result[1] = HEX.charAt(one & 0x0f);
		String mm = new String(result);
		return mm.toLowerCase();
	}
}


