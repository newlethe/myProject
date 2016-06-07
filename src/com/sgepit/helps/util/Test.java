package com.sgepit.helps.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Test {
//	  public void zip(String inputFileName) throws Exception { 
//	        String zipFileName = "d:\\test.zip"; //打包后文件名字 
//	        System.out.println(zipFileName); 
//	        zip(zipFileName, new File(inputFileName)); 
//	    } 
	  /**
	    * inputFileName 输入一个文件夹 
	    * zipFileName 输出一个压缩文件夹 
	    */ 

	    private static ByteArrayOutputStream zip(String file_url) throws Exception {
	    	File file = new File(file_url);
	    	ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        ZipOutputStream out = new ZipOutputStream(bos); 
	        zip(out, file, ""); 
	        out.close(); 
	        return bos ;
	    } 

	    private static void zip(ZipOutputStream out, File f, String base) throws Exception { 
	        if (f.isDirectory()) { 
	           File[] fl = f.listFiles(); 
	           out.putNextEntry(new ZipEntry(base + "/")); 
	           base = base.length() == 0 ? "" : base + "/"; 
	           for (int i = 0; i < fl.length; i++) { 
	           zip(out, fl[i], base + fl[i].getName()); 
	         } 
	        }else { 
	           out.putNextEntry(new ZipEntry(base)); 
	           FileInputStream in = new FileInputStream(f); 
	           int b; 
	           while ( (b = in.read()) != -1) { 
	            out.write(b); 
	         } 
	         in.close(); 
	       } 
	    } 
	    
   public static void main(String[] args) throws Exception {
		zip("d:\\111111.txt");
	}



}
