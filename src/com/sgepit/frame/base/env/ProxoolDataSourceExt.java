package com.sgepit.frame.base.env;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.StringTokenizer;
import java.util.zip.CRC32;

import org.logicalcobwebs.proxool.ProxoolDataSource;

import com.sgepit.frame.util.DESUtil;

public class ProxoolDataSourceExt extends ProxoolDataSource implements
		Serializable {

	private static final long serialVersionUID = 1L;

	@Override
	public void setUser(String O0oo00o) {
		try {
			super.setUser(DESUtil.decryStr(O0oo00o));
		} catch (Exception OOoo) {
			super.setUser(O0oo00o);
		}
	}

	@Override
	public void setPassword(String O0oo00o) {
		try {
			super.setPassword(DESUtil.decryStr(O0oo00o));
		} catch (Exception OOoo) {
			super.setPassword(O0oo00o);
		}
	}

	@Override
	public void setDelegateProperties(String O0oo00o) {
		String o0O0OO = "";
		StringTokenizer oo0O0 = new StringTokenizer(O0oo00o, ",");
		int OOoOooO0 = oo0O0.countTokens();
		if (OOoOooO0 == 2) {
			String OO0OOOo = oo0O0.nextToken();
			String O0OO000 = oo0O0.nextToken();
			String oOoO = "";
			String O00O = "";
			oOoO = OO0OOOo.substring(OO0OOOo.indexOf("=") + 1);
			O00O = O0OO000.substring(O0OO000.indexOf("=") + 1);
			o0O0OO = "user=" + DESUtil.decryStr(oOoO) + "," + "password="
					+ DESUtil.decryStr(O00O);
		}
		try {
			super.setDelegateProperties(o0O0OO);
		} catch (Exception OOoo) {
			super.setDelegateProperties(O0oo00o);
		}
	}
	
	public static void main(String[] O000ooO) {
		try {
			InputStream OOoOO = new FileInputStream("c:/frame.jar");
			CRC32 o0o0Oo = new CRC32();
			byte[] buf = new byte[1024];
			int O0Oo0o = 0;
			while ((O0Oo0o = OOoOO.read(buf)) != -1) {
				o0o0Oo.update(buf, 0, O0Oo0o);
			}
			OOoOO.close();
			java.lang.System.out.println(o0o0Oo.getValue());
		} catch (IOException OOoo) {
			System.exit(0);
		}
	}
	
	public static void verify() {
		try {
			InputStream OOoOO = ProxoolDataSourceExt.class
					.getResourceAsStream("/../lib/frame.jar");
			CRC32 o0o0Oo = new CRC32();
			byte[] buf = new byte[1024];
			int O0Oo0o = 0;
			while ((O0Oo0o = OOoOO.read(buf)) != -1) {
				o0o0Oo.update(buf, 0, O0Oo0o);
			}
			OOoOO.close();
			if (o0o0Oo.getValue() != 66775978L) {
				throw new IOException();
			}
		} catch (IOException OOoo) {
			System.exit(0);
		}
	}

}