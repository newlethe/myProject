/** 
 * Title:        文件操作应用: 
 * Description:  文件操作
 * Company:      sgepit
 */
package com.sgepit.helps.fileService;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * 文件操作工具类
 * @author lizp
 * @Date 2010-8-10
 */
public class FileUtil {
	/**
	 * 按照行读取文件中的内容
	 * @param file 文件对象
	 * @return 返回行记录文本集合
	 */
	public static List<String> readFileByRow(File file){
		List<String> list = new ArrayList<String>() ;
		BufferedReader reader = null;
		StringBuffer sb = new StringBuffer();
		try {
			reader = new BufferedReader(new FileReader(file));
			String tempString = null;
			while ((tempString = reader.readLine()) != null) {
				list.add(tempString) ;
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
		}
		return list ;
	}
	
	/**
	 * 读取文件内容(按行读取)
	 * @param file 文件对象
	 * @return 返回文件中的文本内容，行用\r分隔
	 */
	public static String readFile(File file){
		BufferedReader reader = null;
		StringBuffer sb = new StringBuffer();
		try {
			reader = new BufferedReader(new FileReader(file));
			String tempString = null;
			while ((tempString = reader.readLine()) != null) {
				sb.append(tempString).append("\r") ;
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
		}
		return sb.toString() ;
	}
	
	/**
	 * 输入流转输出流
	 * @param input 输入流
	 * @return
	 * @throws IOException
	 */
	public static ByteArrayOutputStream InputstreamToOutputStream(InputStream input) throws IOException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			if(input!=null) {
				byte[] b = new byte[1024] ;
				int n = 0 ;
				while((n=input.read(b))!=-1){
					out.write(b, 0, n) ;
				}
				input.close() ;
			}
		} catch (IOException e) {
			throw e ;
		}
		return out;
	}
}
