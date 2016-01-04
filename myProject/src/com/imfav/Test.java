package com.imfav;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.imfav.frame.util.UrlConnUtil;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月7日 上午12:29:35
 */
public class Test {
//	这是您在APIStore调用服务所需要的API密钥，
//	9997e463bbf2d89ff1127aa4d82c23ef
//	您可以在服务详情页及个人中心-个人信息中查看您的apikey，
//	为了您能够安全调用，请不要将apikey给他人使用。
	
	public static void main(String[] args) {
		String urlStr = "http://hq.sinajs.cn/list=123";
		String rtn = UrlConnUtil.loadGBKJson(urlStr);
		System.out.println(rtn);
		if(null != rtn && rtn.indexOf("=") > 0){
			String[] temp = rtn.split("=");
			System.out.println(temp);
			if(temp.length == 2){
				String sotckInfo = temp[1];
				System.out.println(sotckInfo);
				sotckInfo = sotckInfo.substring(1, sotckInfo.length()-2);
				System.out.println(sotckInfo);
			}
		}
		
		
//		String httpUrl = "http://apis.baidu.com/apistore/stockservice/hkstock";
//		String httpArg = "stockid=601006&list=1";
//		String jsonResult = request(httpUrl, httpArg);
//		System.out.println(jsonResult);

	}
	
	/**
	 * @param urlAll
	 *            :请求接口
	 * @param httpArg
	 *            :参数
	 * @return 返回结果
	 */
	public static String request(String httpUrl, String httpArg) {
	    BufferedReader reader = null;
	    String result = null;
	    StringBuffer sbf = new StringBuffer();
	    httpUrl = httpUrl + "?" + httpArg;

	    try {
	        URL url = new URL(httpUrl);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setRequestMethod("GET");
	        // 填入apikey到HTTP header
	        connection.setRequestProperty("apikey",  "9997e463bbf2d89ff1127aa4d82c23ef");
	        connection.connect();
	        InputStream is = connection.getInputStream();
	        reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
	        String strRead = null;
	        while ((strRead = reader.readLine()) != null) {
	            sbf.append(strRead);
	            sbf.append("\r\n");
	        }
	        reader.close();
	        result = sbf.toString();
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return result;
	}


}
