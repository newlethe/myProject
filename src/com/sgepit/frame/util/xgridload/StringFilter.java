package com.sgepit.frame.util.xgridload;

public class StringFilter {
	private static final String[] TOBIG = new String[] { "零", "一", "二", "三",
	    "四", "五", "六", "七", "八", "九" };
	private static final String POS[] = new String[] { "", "十", "佰", "仟", "万",
	    "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿" };

	/**
	 * 将传入的字符传，一维和二维的字符串数组里的"'"替换为"''";以便存入oracle
	 * @param obj
	 * @return
	 * @author pengt
	 */
	public static Object dofilter(Object obj){
		if(obj instanceof String [][]){
			String [][] tmpObj = (String [][])obj;
			//String [][] retObj = new String[tmpObj.length][];
			for(int i=0;i<tmpObj.length;i++){
				for(int j=0;j<tmpObj[i].length;j++){
					tmpObj[i][j] = tmpObj[i][j].replace("'", "''");
				}
			}
			return tmpObj;
		}else if(obj instanceof String []){
			String [] tmpObj = (String [])obj;
			for(int i=0;i<tmpObj.length;i++){
				tmpObj[i] = tmpObj[i].replace("'", "''");
			}
			return tmpObj;
		}else if(obj instanceof String){
			return ((String)obj).replace("'", "''");
			
		}else{
			throw new RuntimeException("only String ,String[],String [][] is allowed");
		}
	}
	
	public static String filterJson(String str){
		return str.replaceAll("\\\\", "\\\\\\\\").replaceAll("\"", "\\\\"+"\"");
	}
	//判断能否转换成数字
	public static boolean isNum(String p_str) {
		if(p_str==null)  return false;
		if(p_str.matches("\\.{1}\\d+")) {
			return true;
		}
		else {
			return false;
		}
	}
	public static String numFormat(String str)  {
		if(isNum(str))  {
			Double str2 = Double.parseDouble(str);
			str = str2.toString();
		}
		return str;
		
	}
	/**
	 * 将数字转成中文数字
	 * @param str
	 * @return
	 */
	public static String change(String str)
	{
	   str = delZero(str);
	   String newStr ="";
	  
		for (int i = 0, j = str.length(); i < j; i++)
		{
				String s = str.substring(j - i - 1, j - i);
				newStr = TOBIG[Integer.parseInt(s)].concat(POS[i])+newStr;
		}
	   
	   newStr = newStr.replace("零仟", "零");
	   newStr = newStr.replace("零佰", "零");
	   newStr = newStr.replace("零拾", "零");
	   newStr = newStr.replace("零万", "万");
	   for(int i= 0;i<8;i++)
	    newStr = newStr.replace("零零", "零");
	   newStr = newStr.replace("零仟", "仟");
	   newStr = newStr.replace("零佰", "佰");
	   newStr = newStr.replace("零拾", "拾");
	   newStr = newStr.replace("零万", "万");
	   newStr = newStr.replace("零亿", "亿");
	   if(newStr.startsWith("一十"))  {
		   newStr = newStr.substring(1);
	   }
	   if(newStr.endsWith("零"))
	    newStr = newStr.substring(0,newStr.length()-1);
	   return newStr;
	}
	private static String delZero(String str)
	{
	   if (str.startsWith("0"))
	   {
	    str = str.substring(str.indexOf("0") + 1);
	    return delZero(str);
	   }
	   return str;
	}
	public static void main(String args[])
	{
	   for(int i=0;i<199;i++){
		   System.out.println(change(String.valueOf(i)));
	   }
	}

}
