package com.imfav.frame.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import net.sf.json.JSONObject;

/**
 * 与CMS通讯工具类
 * @author zhangh
 */
public class UrlConnUtil {

	/**
	 * 股票接口地址
	 * 以大秦铁路（股票代码：601006）为例，如果要获取它的最新行情，只需访问新浪的股票数据
	 * 接口：http://hq.sinajs.cn/list=sh601006
	 */
	public static final String SINA_STOCK_URL = "http://hq.sinajs.cn/";
	
	
	/**
	 * 向Url发送请求，传递参数，并获取url返回的json
	 * @param keyVal	请求需要传递过去的参数，以超链接键值对参数形式：ac=method&a=11&b=22&c=33
	 * 		传递股票代码方式：list=sh601006
	 * @return Url返回处理结果，建议以字符串标识，不建议包含中文
	 */
	public static String doConn(String keyVal){
		StringBuffer html = new StringBuffer();
		String result = null;
		try {
			//向CMS发送servlet请求
			URL url = new URL(SINA_STOCK_URL);
			//URLConnection conn = url.openConnection();
			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
			conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; GTB5; .NET CLR 2.0.50727; CIBA)");
			//conn.setRequestProperty("Content-type", "application/x-java-serialized-object");   
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");
	        OutputStreamWriter out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	        //向CMS发送key = value对的参数
	        out.write(keyVal);
	        out.flush();
	        out.close();
	        
			BufferedInputStream in = new BufferedInputStream(conn.getInputStream());
			try {
				String inputLine;
				byte[] buf = new byte[4096];
				int bytesRead = 0;
				while (bytesRead >= 0) {
					inputLine = new String(buf, 0, bytesRead, "ISO-8859-1");
					html.append(inputLine);
					bytesRead = in.read(buf);
					inputLine = null;
				}
				buf = null;
			} finally {
				in.close();
				conn = null;
				url = null;
			}
			result = new String(html.toString().trim().getBytes("ISO-8859-1"), "UTF-8").toLowerCase();
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return "";
		}
	}
	
	/**
	 * 根据URL获取json
	 * @param url
	 * @return
	 */
	public static String loadGBKJson (String urlStr) {  
        StringBuilder json = new StringBuilder();  
        try {  
            URL url = new URL(urlStr);  
            URLConnection conn = url.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(),"GBK"));
            String inputLine = null;  
            while ( (inputLine = in.readLine()) != null) {  
                json.append(inputLine);  
            }  
            in.close();  
        } catch (MalformedURLException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
        return json.toString();  
    }
	
	
}
