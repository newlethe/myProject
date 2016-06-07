/** 
 * Title:       字符串应用: 
 * Description:  字符串压缩处理应用
 * Company:      sgepit
 */
package com.sgepit.helps.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * 压缩解压处理工具
 * @author lizp
 * @Date 2010-8-11
 */
public class IOZip {
	/**
	 * 压缩字符串
	 * 使用ZIP 文件格式压缩
	 * @param p_str 待压缩的字符串
	 * @return
	 */
	public static final String zipString(String p_str) {
		String zipStr = "";
		try {
			byte[] compressed; 
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ZipOutputStream zout = new ZipOutputStream(out);
			zout.putNextEntry(new ZipEntry("0"));
			zout.write(p_str.getBytes());
			zout.closeEntry(); 
			compressed = out.toByteArray();
			zout.close();
			out.close();
			zipStr = new sun.misc.BASE64Encoder().encodeBuffer(compressed);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return zipStr;
	}
	
	/**
	 * 解压字符串
	 * ZIP 文件格式解压
	 * @param p_str 待处理字符串
	 * @return
	 */
	public static final String unzipString(String p_str) {
		String unzipStr = "";
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream(); 
			byte[] compressed = new sun.misc.BASE64Decoder().decodeBuffer(p_str);
			ByteArrayInputStream in = new ByteArrayInputStream(compressed);
			ZipInputStream zin = new ZipInputStream(in); 
			ZipEntry entry = zin.getNextEntry(); 
			byte[] buffer = new byte[1024];
			int offset = -1; 
			while((offset = zin.read(buffer)) != -1) {
				out.write(buffer, 0, offset); 
			}
			unzipStr = out.toString(); 
			zin.close();
			in.close();
			out.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return unzipStr;
	}
	
	/**
	 * 压缩指定文件夹下具体文件
	 * 压缩多个文件
	 * @param p_dir 文件目录
	 * @param p_files 文件名集合
	 * @return 字节数组
	 */
	public static final byte[] zipFile(String p_dir, String[] p_files) {
		byte[] compressed = null;
		if(!p_dir.endsWith("/")) {
			p_dir += "/";
		}
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ZipOutputStream zout = new ZipOutputStream(out);
			for(int i=0;i<p_files.length;i++) {
				File f = new File(p_dir + p_files[i]);
				if(f.exists()) {
					zout.putNextEntry(new ZipEntry(p_files[i]));
					FileInputStream fis = new FileInputStream(f);
					byte[] buffer = new byte[2048];
					int offset = -1; 
					while((offset = fis.read(buffer)) != -1) {
						zout.write(buffer, 0, offset); 
					}
					fis.close();
					zout.closeEntry();
				}
			}
			compressed = out.toByteArray();
			out.close();
			zout.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return compressed;
	}
	
	/**
	 * 解压字节数组中的文件
	 * 解压多个文件
	 * @param p_dir 文件目录
	 * @param p_bytes 文件流字节数组
	 * @return
	 */
	public static final String[] unzipFile(String p_dir, byte[] p_bytes) {
		String fStr = "";
		if(!p_dir.endsWith("/")) {
			p_dir += "/";
		}
		try {
			ByteArrayInputStream in = new ByteArrayInputStream(p_bytes);
			ZipInputStream zin = new ZipInputStream(in);
			ZipEntry entry = null;
			while((entry = zin.getNextEntry())!=null) {
				File f = new File(p_dir + entry.getName());
				fStr += "|" + p_dir + entry.getName();
				f.getParentFile().mkdirs();
				FileOutputStream fos = new FileOutputStream(f);
				byte[] buffer = new byte[2048];
				int offset = -1;
				while((offset = zin.read(buffer)) != -1) {
					fos.write(buffer, 0, offset);
				}
				fos.flush();
				fos.close();
			}
			in.close();
			zin.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		if(!fStr.equals("")) {
			fStr = fStr.substring(1);
		}
		return fStr.split("[|]");
	}
	
	/**
	 * 压缩字节数组
	 * @param p_bytes 待压缩字节数组
	 * @return
	 */
	public static final byte[] zipBytes(byte[] p_bytes) {
		byte[] zipBytes = null;
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ZipOutputStream zout = new ZipOutputStream(out);
			zout.putNextEntry(new ZipEntry("0"));
			zout.write(p_bytes);
			zout.closeEntry(); 
			zipBytes = out.toByteArray();
			zout.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return zipBytes;
	}
	
	/**
	 * 解压字节数组
	 * @param p_bytes 待解压缩字节数组
	 * @return
	 */
	public static final byte[] unzipBytes(byte[] p_bytes) {
		byte[] unzipBytes = null;
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream(); 
			ByteArrayInputStream in = new ByteArrayInputStream(p_bytes);
			ZipInputStream zin = new ZipInputStream(in); 
			ZipEntry entry = zin.getNextEntry(); 
			byte[] buffer = new byte[1024];
			int offset = -1; 
			while((offset = zin.read(buffer)) != -1) {
				out.write(buffer, 0, offset); 
			}
			unzipBytes = out.toByteArray();
			zin.close();
			in.close();
			out.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return unzipBytes;
	}
	
	/**
	 * @param file_url 要压缩的文件的路径
	 * @return
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 * @throws Exception
	 */
	public static ByteArrayOutputStream zip(String file_url) throws Exception {
    	File file = new File(file_url);
    	ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ZipOutputStream out = new ZipOutputStream(bos); 
        zip(out, file, ""); 
        out.close(); 
        return bos ;
    } 

    /**
     * 压缩文件和文件夹
     * @param out
     * @param f
     * @param base
     * @throws IOException 
     * @throws IOException,FileNotFoundException 
     * @throws Exception
     */
    private static void zip(ZipOutputStream out, File f, String base) throws IOException { 
        if (f.isDirectory()) { 
           File[] fl = f.listFiles(); 
           out.putNextEntry(new ZipEntry(base + "/")); 
           base = base.length() == 0 ? "" : base + "/"; 
           for (int i = 0; i < fl.length; i++) { 
        	   zip(out, fl[i], base + fl[i].getName()); 
           } 
        }else { 
        	if (base.length()>0) {
        		out.putNextEntry(new ZipEntry(base)); 
			}else {
				out.putNextEntry(new ZipEntry(f.getName()));
			}
            FileInputStream in = new FileInputStream(f);;
            int b; 
            byte[] by = new byte[1024];
            while ((b = in.read(by)) != -1) { 
        	    out.write(by,0,b); 
            } 
            in.close(); 
       } 
    } 
    
    /**
     * 压缩并加密文件
     * @param file_url 文件路径
     * @return
     * @throws Exception 
     * @throws Exception
     */
    public static String zipDecode(String file_url) throws IOException {
    	File file = new File(file_url);
    	ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ZipOutputStream out = new ZipOutputStream(bos); 
        zip(out, file, ""); 
        out.close(); 
        return new sun.misc.BASE64Encoder().encode(bos.toByteArray()) ;
    } 
    
    /**
     * 解密压缩文件
     * @param fileStr
     * @return
     * @throws IOException
     */
    public static byte[] encodeZip(String fileStr) throws IOException {
    	byte[] compressed = new sun.misc.BASE64Decoder().decodeBuffer(fileStr);
    	return compressed ;
    } 
    
    
    public static void main(String[] args){
    	try {
    		String s = "c:/build.xml" ;
			ByteArrayOutputStream b = zip(s);
			
			File f = new File("c:\\test11");
			FileOutputStream out = new FileOutputStream(f);
			b.writeTo(out) ;
			out.close() ;
			b.close() ;
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
	
}