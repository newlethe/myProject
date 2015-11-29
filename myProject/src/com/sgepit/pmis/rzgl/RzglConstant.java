package com.sgepit.pmis.rzgl;

public class RzglConstant {

	public enum DFormat{
		YMD_HMS("yyyy-MM-dd HH:mm:ss"),YMD("yyyy-MM-dd"),ORACLE_YMD_HMS("yyyy-MM-dd hh24:mi:ss");
		private final String format;
		public String getFormat(){
			return format;
		}
		DFormat(String format){
			this.format = format;
		}
	}
	/**
	 * 
	 */
	public static final String RZGL_RZ_FJ = "RZGL_RZ_FJ";
	/**
	 * 
	 */
	public static final String RZGL_PL_FJ = "RZGL_PL_FJ";
}
