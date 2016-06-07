package com.sgepit.frame.util;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class DESUtil {

	public static String encryStr(String str) {
		try {
			SecretKey deskey = null;
			try {
				InputStream fis = DESUtil.class.getResourceAsStream("/key.dat");
				GZIPInputStream gis = new GZIPInputStream(fis);
				ObjectInputStream ois = new ObjectInputStream(gis);
				deskey = (SecretKey) ois.readObject();
				ois.close();
			} catch (Exception e) {
				KeyGenerator keygen = KeyGenerator.getInstance("DES");
				deskey = keygen.generateKey();
				FileOutputStream fos = new FileOutputStream(DESUtil.class
						.getResource("/").getPath().toString().concat(
								"/key.dat"));
				GZIPOutputStream gos = new GZIPOutputStream(fos);
				ObjectOutputStream oos = new ObjectOutputStream(gos);
				oos.writeObject(deskey);
				oos.close();
			}
			Cipher c1 = Cipher.getInstance("DES");
			c1.init(Cipher.ENCRYPT_MODE, deskey);
			byte[] cipherByte = c1.doFinal(str.getBytes());
			BASE64Encoder en = new BASE64Encoder();
			String s = en.encode(cipherByte);
			str = s;
		} catch (Exception e) {
			e.printStackTrace();
			str = "";
		}
		return str;
	}

	public static String decryStr(String str) {
		try {
			InputStream fis = DESUtil.class.getResourceAsStream("/key.dat");
			GZIPInputStream gis = new GZIPInputStream(fis);
			ObjectInputStream ois = new ObjectInputStream(gis);
			SecretKey deskey = (SecretKey) ois.readObject();
			ois.close();
			BASE64Decoder de = new BASE64Decoder();
			byte[] cipherByte = de.decodeBuffer(str);
			Cipher c1 = Cipher.getInstance("DES");
			c1.init(Cipher.DECRYPT_MODE, deskey);
			byte[] clearByte = c1.doFinal(cipherByte);
			String s = new String(clearByte);
			str = s;
		} catch (Exception e) {
			e.printStackTrace();
			str = "";
		}
		return str;
	}

	public static void main(String[] args){
		System.out.println(DESUtil.encryStr("frame_trunk"));
	}
}